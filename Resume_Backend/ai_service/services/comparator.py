"""
Comparator — compares resume entities against JD entities.
Outputs: matched skills, missing skills (with priority), missing ATS keywords,
weak bullets, project/experience relevance assessment.
"""

import re
from .skill_dictionary import normalize_skill_lenient


def compare_entities(resume_entities: dict, jd_entities: dict, role_title: str = "") -> dict:
    """
    Compare extracted resume entities against JD entities.
    Returns structured comparison result.
    """
    # Normalize skills for comparison (case-insensitive)
    resume_skills_set = {s.lower(): s for s in resume_entities.get("skills", [])}
    jd_required_set = {s.lower(): s for s in jd_entities.get("required_skills", [])}
    jd_preferred_set = {s.lower(): s for s in jd_entities.get("preferred_skills", [])}
    jd_all_skills_set = {s.lower(): s for s in jd_entities.get("all_skills", [])}

    # 1. Matched skills (resume has AND JD wants)
    matched_required = []
    matched_preferred = []
    for skill_lower, skill_canonical in resume_skills_set.items():
        if skill_lower in jd_required_set:
            matched_required.append(skill_canonical)
        elif skill_lower in jd_preferred_set:
            matched_preferred.append(skill_canonical)
        elif skill_lower in jd_all_skills_set:
            matched_required.append(skill_canonical)

    all_matched = sorted(set(matched_required + matched_preferred))

    # 2. Missing skills
    missing_required = []
    for skill_lower, skill_canonical in jd_required_set.items():
        if skill_lower not in resume_skills_set:
            freq = jd_entities.get("keyword_frequencies", {}).get(skill_canonical, 1)
            missing_required.append({
                "skill_name": skill_canonical,
                "priority": "high" if freq > 1 else "medium",
                "category": "required",
                "why_it_matters": f"This skill is listed as a required qualification in the job description for {role_title}." if role_title else "Listed as a required qualification.",
                "decision": "learn",
            })

    missing_preferred = []
    for skill_lower, skill_canonical in jd_preferred_set.items():
        if skill_lower not in resume_skills_set:
            missing_preferred.append({
                "skill_name": skill_canonical,
                "priority": "low",
                "category": "preferred",
                "why_it_matters": f"Listed as a preferred/nice-to-have skill for {role_title}." if role_title else "Listed as a preferred skill.",
                "decision": "consider",
            })

    all_missing = missing_required + missing_preferred

    # 3. Missing ATS keywords (domain terms in JD not found in resume)
    resume_text_lower = resume_entities.get("raw_text_cleaned", "").lower()
    jd_ats_keywords = jd_entities.get("ats_keywords", [])
    missing_keywords = []
    matched_keywords = []
    for kw in jd_ats_keywords:
        kw_lower = kw.lower()
        # Check if keyword appears in resume
        if kw_lower in resume_text_lower or re.search(r"(?<![a-zA-Z])" + re.escape(kw_lower) + r"(?![a-zA-Z])", resume_text_lower):
            matched_keywords.append(kw)
        else:
            # Skip if it's already in missing skills
            is_in_missing = any(m["skill_name"].lower() == kw_lower for m in all_missing)
            if not is_in_missing:
                missing_keywords.append({
                    "keyword": kw,
                    "context": "Found in job description but not in resume",
                })

    # 4. Resume section weaknesses
    section_weaknesses = []
    expected_sections = ["SUMMARY", "EXPERIENCE", "EDUCATION", "SKILLS", "PROJECTS"]
    found_sections = resume_entities.get("sections_found", [])
    for section in expected_sections:
        if section not in found_sections:
            section_weaknesses.append({
                "section": section,
                "issue": f"Your resume appears to be missing a dedicated '{section}' section.",
                "suggestion": f"Add a clear '{section}' section header to improve ATS parsing and readability.",
            })

    # 5. Check for weak/generic bullets (no action verbs, no numbers)
    action_verbs_used = set(resume_entities.get("action_verbs_used", []))
    achievements = resume_entities.get("achievements", [])
    weak_bullet_warnings = []
    if len(action_verbs_used) < 3:
        weak_bullet_warnings.append({
            "issue": "Few strong action verbs detected",
            "suggestion": "Start bullet points with impactful verbs like 'Developed', 'Optimized', 'Architected', 'Reduced', 'Increased'.",
        })
    if len(achievements) < 2:
        weak_bullet_warnings.append({
            "issue": "Few measurable achievements detected",
            "suggestion": "Add quantified results (e.g., 'Reduced load time by 40%', 'Served 10K+ users', 'Saved $50K annually').",
        })

    # 6. Project/experience relevance to target role
    resume_projects = resume_entities.get("projects", [])
    resume_certs = resume_entities.get("certifications", [])
    resume_education = resume_entities.get("education", [])
    jd_education_reqs = jd_entities.get("education_requirements", [])

    # Check education alignment
    education_aligned = False
    if jd_education_reqs and resume_education:
        for req in jd_education_reqs:
            for edu in resume_education:
                if req.lower() in edu.lower() or edu.lower() in req.lower():
                    education_aligned = True
                    break

    # Experience relevance score (fraction of JD skills covered)
    total_jd_skills = len(jd_all_skills_set)
    covered = len(all_matched)
    experience_relevance = (covered / total_jd_skills * 100) if total_jd_skills > 0 else 0

    return {
        "matched_skills": all_matched,
        "matched_required": sorted(matched_required),
        "matched_preferred": sorted(matched_preferred),
        "missing_skills": all_missing,
        "missing_required_count": len(missing_required),
        "missing_preferred_count": len(missing_preferred),
        "missing_keywords": missing_keywords[:20],
        "matched_keywords": matched_keywords,
        "section_weaknesses": section_weaknesses,
        "weak_bullet_warnings": weak_bullet_warnings,
        "experience_relevance_pct": round(experience_relevance, 1),
        "education_aligned": education_aligned,
        "resume_has_education": len(resume_education) > 0,
        "resume_has_certifications": len(resume_certs) > 0,
        "resume_has_projects": len(resume_projects) > 0,
        "action_verbs_count": len(action_verbs_used),
        "achievements_count": len(achievements),
    }
