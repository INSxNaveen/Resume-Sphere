"""
Resume entity extractor.
Uses spaCy PhraseMatcher + regex to extract skills, education, certifications,
projects, achievements, section labels, and action verbs from resume text.
"""

import re
import spacy
from spacy.matcher import PhraseMatcher
from .skill_dictionary import SYNONYM_MAP, CANONICAL_SKILLS, normalize_skill_lenient
from .normalizer import clean_text, normalize_section_labels

# Load spaCy model once at module level
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # If model not installed, use blank
    nlp = spacy.blank("en")

# Build PhraseMatcher for skills
_skill_matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
_all_skill_terms = set()
for alias in SYNONYM_MAP.keys():
    _all_skill_terms.add(alias.lower())
for canonical in CANONICAL_SKILLS:
    _all_skill_terms.add(canonical.lower())

# Add patterns in batches to avoid memory issues
_patterns = [nlp.make_doc(term) for term in _all_skill_terms if len(term) > 1]
if _patterns:
    _skill_matcher.add("SKILLS", _patterns)

# Section header patterns
SECTION_PATTERNS = {
    "SUMMARY": re.compile(r"^(SUMMARY|OBJECTIVE|PROFILE|ABOUT ME)\s*:?\s*$", re.IGNORECASE | re.MULTILINE),
    "EXPERIENCE": re.compile(r"^(EXPERIENCE|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EMPLOYMENT)\s*:?\s*$", re.IGNORECASE | re.MULTILINE),
    "EDUCATION": re.compile(r"^(EDUCATION|ACADEMIC|QUALIFICATIONS?)\s*:?\s*$", re.IGNORECASE | re.MULTILINE),
    "SKILLS": re.compile(r"^(SKILLS?|TECHNICAL SKILLS?|CORE COMPETENCIES|KEY SKILLS?)\s*:?\s*$", re.IGNORECASE | re.MULTILINE),
    "PROJECTS": re.compile(r"^(PROJECTS?|PERSONAL PROJECTS?|KEY PROJECTS?)\s*:?\s*$", re.IGNORECASE | re.MULTILINE),
    "CERTIFICATIONS": re.compile(r"^(CERTIFICATIONS?|CERTIFICATES?|LICENSES?)\s*:?\s*$", re.IGNORECASE | re.MULTILINE),
    "ACHIEVEMENTS": re.compile(r"^(ACHIEVEMENTS?|AWARDS?|HONORS?)\s*:?\s*$", re.IGNORECASE | re.MULTILINE),
}

# Action verbs commonly used in resume bullets
ACTION_VERBS = {
    "developed", "built", "designed", "implemented", "created", "managed",
    "led", "improved", "reduced", "increased", "optimized", "automated",
    "deployed", "integrated", "architected", "maintained", "analyzed",
    "collaborated", "mentored", "delivered", "launched", "migrated",
    "refactored", "tested", "debugged", "configured", "established",
    "streamlined", "coordinated", "spearheaded", "orchestrated",
    "engineered", "contributed", "resolved", "scaled", "transformed",
}

# Patterns for measurable achievements (numbers with context)
ACHIEVEMENT_PATTERN = re.compile(
    r"(?:(?:reduced|improved|increased|boosted|grew|cut|saved|generated|achieved|delivered|processed|handled|managed|served|supported)"
    r"[^.]*?"
    r"(?:\d+[%xX]|\$[\d,]+|\d+[\s,]*(?:users?|clients?|customers?|requests?|transactions?|team members?|engineers?|developers?)))"
    r"|(?:\d+[%xX]\s+(?:improvement|increase|decrease|reduction|growth|faster|slower|more|less))"
    r"|(?:\$[\d,.]+[MmKkBb]?\s+(?:revenue|savings?|cost|budget|funding|valuation))",
    re.IGNORECASE,
)

# Education degree patterns
DEGREE_PATTERNS = re.compile(
    r"\b(?:B\.?S\.?|B\.?A\.?|M\.?S\.?|M\.?A\.?|Ph\.?D\.?|MBA|"
    r"Bachelor(?:'?s)?|Master(?:'?s)?|Doctorate|Associate(?:'?s)?|"
    r"B\.?Tech|M\.?Tech|B\.?E\.?|M\.?E\.?|B\.?Sc|M\.?Sc|"
    r"Computer Science|Information Technology|Software Engineering|"
    r"Data Science|Electrical Engineering|Mathematics|Statistics|"
    r"Mechanical Engineering|Business Administration)\b",
    re.IGNORECASE,
)

# Certification patterns
CERT_PATTERNS = re.compile(
    r"\b(?:AWS\s+(?:Certified|Solutions?\s+Architect|Developer|SysOps)|"
    r"Google\s+Cloud\s+(?:Certified|Professional)|"
    r"Azure\s+(?:Certified|Administrator|Developer|Solutions?\s+Architect)|"
    r"Certified\s+(?:Kubernetes|Scrum\s+Master|Product\s+Owner|Information\s+Security)|"
    r"PMP|CISSP|CompTIA|CCNA|CCNP|CKA|CKAD|"
    r"Terraform\s+Associate|"
    r"Oracle\s+(?:Certified|Java)|"
    r"Cisco\s+Certified|"
    r"ITIL|Six\s+Sigma|"
    r"HubSpot|Salesforce|SAP)\b",
    re.IGNORECASE,
)


def extract_resume_entities(resume_text: str) -> dict:
    """
    Extract structured entities from resume text.
    Returns a dict with: skills, education, certifications, projects,
    achievements, sections_found, action_verbs_used, raw_text_cleaned
    """
    cleaned = clean_text(resume_text)
    normalized = normalize_section_labels(cleaned)

    # 1. Extract skills via PhraseMatcher
    doc = nlp(normalized[:100000])  # limit to avoid memory issues
    matches = _skill_matcher(doc)
    raw_skills = set()
    for match_id, start, end in matches:
        span_text = doc[start:end].text
        raw_skills.add(span_text)

    # Also extract via regex for multi-word skills PhraseMatcher might miss
    for term in _all_skill_terms:
        pattern = re.compile(r"(?<![a-zA-Z0-9])" + re.escape(term) + r"(?![a-zA-Z0-9])", re.IGNORECASE)
        if pattern.search(normalized):
            raw_skills.add(term)

    # Normalize all skills to canonical form
    skills = []
    seen = set()
    for raw in raw_skills:
        canonical = normalize_skill_lenient(raw)
        key = canonical.lower()
        if key not in seen:
            seen.add(key)
            skills.append(canonical)
    skills.sort()

    # 2. Detect sections present
    sections_found = []
    for section_name, pattern in SECTION_PATTERNS.items():
        if pattern.search(normalized):
            sections_found.append(section_name)

    # 3. Extract education
    education = []
    edu_matches = DEGREE_PATTERNS.findall(normalized)
    for match in edu_matches:
        if match.strip() and match.strip() not in education:
            education.append(match.strip())

    # 4. Extract certifications
    certifications = []
    cert_matches = CERT_PATTERNS.findall(normalized)
    for match in cert_matches:
        if match.strip() and match.strip() not in certifications:
            certifications.append(match.strip())

    # 5. Extract achievements (measurable impact statements)
    achievements = []
    for match in ACHIEVEMENT_PATTERN.finditer(normalized):
        text = match.group().strip()
        if len(text) > 15 and text not in achievements:
            achievements.append(text)

    # 6. Detect action verbs used
    words_lower = set(re.findall(r"\b[a-z]+\b", normalized.lower()))
    action_verbs_used = sorted(ACTION_VERBS & words_lower)

    # 7. Extract project names (lines following PROJECT section header)
    projects = []
    project_section = re.search(
        r"PROJECTS?\s*:?\s*\n((?:.*\n)*?)(?=\n(?:EXPERIENCE|EDUCATION|SKILLS|CERTIFICATIONS|ACHIEVEMENTS|$))",
        normalized,
        re.IGNORECASE,
    )
    if project_section:
        for line in project_section.group(1).split("\n"):
            line = line.strip()
            # Project names are typically short lines, often bold/capitalized
            if line and len(line) < 120 and not line.startswith(("•", "-", "*", "–")):
                # Filter out dates and empty-ish lines
                if not re.match(r"^\d{4}", line) and len(line) > 3:
                    projects.append(line)
                    if len(projects) >= 10:
                        break

    return {
        "skills": skills,
        "education": education,
        "certifications": certifications,
        "projects": projects[:10],
        "achievements": achievements[:10],
        "sections_found": sections_found,
        "action_verbs_used": action_verbs_used,
        "raw_text_cleaned": cleaned,
    }
