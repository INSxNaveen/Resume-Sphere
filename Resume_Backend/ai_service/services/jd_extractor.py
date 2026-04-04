"""
Job description entity extractor.
Extracts required skills, preferred skills, responsibilities, domain terms,
ATS keywords, seniority signals, and education requirements from JD text.
Uses frequency analysis to identify high-priority repeated terms.
"""

import re
from collections import Counter
from .skill_dictionary import SYNONYM_MAP, CANONICAL_SKILLS, normalize_skill_lenient
from .normalizer import clean_text
from .resume_extractor import nlp, _skill_matcher, _all_skill_terms

# Seniority signals
SENIORITY_PATTERNS = {
    "entry": re.compile(r"\b(?:entry[\s-]?level|junior|fresh\s*grad(?:uate)?|0[\s-]?[12]\s*years?|intern(?:ship)?)\b", re.IGNORECASE),
    "mid": re.compile(r"\b(?:mid[\s-]?level|intermediate|[2-5]\+?\s*years?)\b", re.IGNORECASE),
    "senior": re.compile(r"\b(?:senior|sr\.?|lead|principal|staff|[5-9]\+?\s*years?|10\+?\s*years?)\b", re.IGNORECASE),
    "management": re.compile(r"\b(?:manager|director|head\s+of|vp|vice\s+president|chief|c-level|cto|ceo|cio)\b", re.IGNORECASE),
}

# Section markers in JDs
JD_REQUIRED_SECTION = re.compile(
    r"(?:required|must[\s-]?have|minimum|essential|mandatory|requirements?|qualifications?)\s*:?\s*",
    re.IGNORECASE,
)
JD_PREFERRED_SECTION = re.compile(
    r"(?:preferred|nice[\s-]?to[\s-]?have|good[\s-]?to[\s-]?have|bonus|plus|desired|advantageous)\s*:?\s*",
    re.IGNORECASE,
)
JD_RESPONSIBILITIES_SECTION = re.compile(
    r"(?:responsibilities|duties|what\s+you'?ll?\s+do|role|key\s+areas|you\s+will)\s*:?\s*",
    re.IGNORECASE,
)

# Education requirement patterns
JD_EDUCATION_PATTERN = re.compile(
    r"\b(?:B\.?S\.?|B\.?A\.?|M\.?S\.?|M\.?A\.?|Ph\.?D\.?|MBA|"
    r"Bachelor(?:'?s)?|Master(?:'?s)?|Doctorate|"
    r"B\.?Tech|M\.?Tech|B\.?E\.?|degree\s+in|"
    r"Computer Science|Engineering|Mathematics|Statistics)\b",
    re.IGNORECASE,
)

# Common ATS keywords that aren't skills but matter for matching
ATS_DOMAIN_TERMS = {
    "cross-functional", "stakeholder", "scalable", "production",
    "large-scale", "high-traffic", "enterprise", "startup",
    "full-stack", "full stack", "frontend", "front-end", "backend", "back-end",
    "cloud-native", "cloud native", "serverless",
    "real-time", "real time", "low-latency", "high-availability",
    "data-driven", "data driven", "customer-facing",
    "continuous integration", "continuous deployment",
    "code review", "peer review", "pull request",
    "mentoring", "team lead", "tech lead", "technical lead",
    "problem solving", "problem-solving", "analytical",
    "communication", "collaboration", "team player",
    "self-motivated", "deadline", "fast-paced",
    "version control", "documentation", "testing",
    "performance optimization", "monitoring", "observability",
    "security", "compliance", "gdpr", "sox",
    "api development", "api design", "database design",
    "schema design", "data modeling", "data pipeline",
    "etl", "batch processing", "stream processing",
    "mobile development", "web development", "desktop application",
}


def extract_jd_entities(jd_text: str, role_title: str = "") -> dict:
    """
    Extract structured entities from a job description.
    Returns dict with: required_skills, preferred_skills, all_skills,
    responsibilities, ats_keywords, seniority_signals, education_requirements,
    domain_terms, keyword_frequencies
    """
    cleaned = clean_text(jd_text)

    # 1. Extract all skills via PhraseMatcher
    doc = nlp(cleaned[:100000])
    matches = _skill_matcher(doc)
    raw_skills = set()
    for match_id, start, end in matches:
        raw_skills.add(doc[start:end].text)

    # Also regex-based extraction
    for term in _all_skill_terms:
        pattern = re.compile(r"(?<![a-zA-Z0-9])" + re.escape(term) + r"(?![a-zA-Z0-9])", re.IGNORECASE)
        if pattern.search(cleaned):
            raw_skills.add(term)

    # Normalize
    all_skills = []
    seen_skills = set()
    for raw in raw_skills:
        canonical = normalize_skill_lenient(raw)
        key = canonical.lower()
        if key not in seen_skills:
            seen_skills.add(key)
            all_skills.append(canonical)
    all_skills.sort()

    # 2. Categorize into required vs preferred based on section context
    required_skills = []
    preferred_skills = []

    # Simple heuristic: find sections and assign skills found in each
    lines = cleaned.split("\n")
    current_section = "general"

    for line in lines:
        line_stripped = line.strip()
        if JD_REQUIRED_SECTION.search(line_stripped):
            current_section = "required"
        elif JD_PREFERRED_SECTION.search(line_stripped):
            current_section = "preferred"
        elif JD_RESPONSIBILITIES_SECTION.search(line_stripped):
            current_section = "responsibilities"

        # Check which skills appear in this line
        for skill_lower in _all_skill_terms:
            pattern = re.compile(r"(?<![a-zA-Z0-9])" + re.escape(skill_lower) + r"(?![a-zA-Z0-9])", re.IGNORECASE)
            if pattern.search(line_stripped):
                canonical = normalize_skill_lenient(skill_lower)
                if current_section == "preferred":
                    if canonical not in preferred_skills:
                        preferred_skills.append(canonical)
                elif current_section in ("required", "general", "responsibilities"):
                    if canonical not in required_skills:
                        required_skills.append(canonical)

    # Skills not assigned to either go to required by default
    for skill in all_skills:
        if skill not in required_skills and skill not in preferred_skills:
            required_skills.append(skill)

    # 3. Extract responsibilities (bullet points after responsibilities header)
    responsibilities = []
    in_resp_section = False
    for line in lines:
        line_stripped = line.strip()
        if JD_RESPONSIBILITIES_SECTION.search(line_stripped):
            in_resp_section = True
            continue
        if in_resp_section:
            # Check if we hit a new section
            if JD_REQUIRED_SECTION.search(line_stripped) or JD_PREFERRED_SECTION.search(line_stripped):
                in_resp_section = False
                continue
            if line_stripped and (line_stripped.startswith(("•", "-", "*", "–", "·")) or re.match(r"^\d+[\.\)]\s", line_stripped)):
                resp = re.sub(r"^[•\-*–·\d.)\s]+", "", line_stripped).strip()
                if resp and len(resp) > 10:
                    responsibilities.append(resp)
                    if len(responsibilities) >= 15:
                        break

    # 4. Detect seniority signals
    seniority_signals = []
    for level, pattern in SENIORITY_PATTERNS.items():
        if pattern.search(cleaned):
            seniority_signals.append(level)

    # Also check the role title
    if role_title:
        for level, pattern in SENIORITY_PATTERNS.items():
            if pattern.search(role_title) and level not in seniority_signals:
                seniority_signals.append(level)

    # 5. Extract education requirements
    education_requirements = list(set(JD_EDUCATION_PATTERN.findall(cleaned)))

    # 6. Extract ATS domain keywords
    ats_keywords = []
    for term in ATS_DOMAIN_TERMS:
        if re.search(r"(?<![a-zA-Z])" + re.escape(term) + r"(?![a-zA-Z])", cleaned, re.IGNORECASE):
            ats_keywords.append(term)
    # Also include all skill names as ATS keywords
    ats_keywords.extend(all_skills)
    ats_keywords = sorted(set(ats_keywords))

    # 7. Keyword frequency analysis (to identify high-priority terms)
    word_freq = Counter()
    # Count skill mentions
    for skill in all_skills:
        count = len(re.findall(re.escape(skill.lower()), cleaned.lower()))
        if count > 0:
            word_freq[skill] = count
    # Count domain term mentions
    for term in ATS_DOMAIN_TERMS:
        count = len(re.findall(re.escape(term.lower()), cleaned.lower()))
        if count > 0:
            word_freq[term] = count

    # Sort by frequency
    keyword_frequencies = dict(word_freq.most_common(30))

    return {
        "required_skills": sorted(required_skills),
        "preferred_skills": sorted(preferred_skills),
        "all_skills": all_skills,
        "responsibilities": responsibilities,
        "ats_keywords": ats_keywords,
        "seniority_signals": seniority_signals,
        "education_requirements": education_requirements,
        "keyword_frequencies": keyword_frequencies,
    }
