"""
Text normalizer — cleans resume and JD text for consistent extraction.
Handles whitespace, symbols, section-label normalization, and skill canonicalization.
"""

import re
from .skill_dictionary import normalize_skill, normalize_skill_lenient


def clean_text(raw: str) -> str:
    """Basic text cleanup: collapse whitespace, strip stray symbols, normalize dashes."""
    if not raw:
        return ""
    text = raw
    # Normalize various dash/hyphen characters to standard hyphen
    text = re.sub(r"[–—―‐]", "-", text)
    # Normalize quotes
    text = re.sub(r"[""''`]", "'", text)
    # Collapse multiple spaces/tabs to single space
    text = re.sub(r"[ \t]+", " ", text)
    # Collapse multiple newlines to double newline (paragraph break)
    text = re.sub(r"\n{3,}", "\n\n", text)
    # Strip leading/trailing whitespace per line
    lines = [line.strip() for line in text.split("\n")]
    text = "\n".join(lines)
    return text.strip()


def normalize_section_labels(text: str) -> str:
    """
    Standardize common resume section headers so downstream extractors
    can find them reliably.
    """
    replacements = {
        r"(?i)\b(work\s+)?experience\b": "EXPERIENCE",
        r"(?i)\bprofessional\s+experience\b": "EXPERIENCE",
        r"(?i)\bemployment\s+history\b": "EXPERIENCE",
        r"(?i)\beducation(al)?\s*(background|qualifications?)?\b": "EDUCATION",
        r"(?i)\bacademic\s+(background|qualifications?)\b": "EDUCATION",
        r"(?i)\btechnical\s+skills?\b": "SKILLS",
        r"(?i)\bcore\s+(competencies|skills?)\b": "SKILLS",
        r"(?i)\bskills?\s*(&|and)\s*technologies?\b": "SKILLS",
        r"(?i)\bkey\s+skills?\b": "SKILLS",
        r"(?i)\bprojects?\b": "PROJECTS",
        r"(?i)\bcertification(s)?\b": "CERTIFICATIONS",
        r"(?i)\bachievement(s)?\b": "ACHIEVEMENTS",
        r"(?i)\baward(s)?\b": "ACHIEVEMENTS",
        r"(?i)\bsummary\b": "SUMMARY",
        r"(?i)\bobjective\b": "SUMMARY",
        r"(?i)\bprofile\b": "SUMMARY",
        r"(?i)\babout\s+me\b": "SUMMARY",
    }
    result = text
    for pattern, replacement in replacements.items():
        result = re.sub(pattern, replacement, result)
    return result


def normalize_skills_in_list(skills: list[str]) -> list[str]:
    """Normalize a list of skill strings to canonical form, deduplicating."""
    seen = set()
    result = []
    for s in skills:
        canonical = normalize_skill_lenient(s)
        key = canonical.lower()
        if key not in seen:
            seen.add(key)
            result.append(canonical)
    return result
