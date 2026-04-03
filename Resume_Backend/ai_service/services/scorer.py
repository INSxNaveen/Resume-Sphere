"""
Transparent weighted scoring engine.
Produces a 0–100 overall score with per-category breakdown and deduction reasons.

Weight allocation:
- Required skills:          35%
- Preferred skills:         15%
- ATS keywords:             15%
- Experience/project relevance: 15%
- Education/certifications: 10%
- Resume quality:           10%
"""


def compute_score(comparison: dict, resume_entities: dict, jd_entities: dict) -> dict:
    """
    Compute a transparent weighted score based on comparison results.
    Returns overall score, per-category scores, and deduction reasons.
    """
    deductions = []

    # ─── 1. Required Skills Score (35%) ────────────────────────────────────────
    required_skills = jd_entities.get("required_skills", [])
    matched_required = comparison.get("matched_required", [])
    if len(required_skills) > 0:
        required_score = (len(matched_required) / len(required_skills)) * 100
        missing_req_count = len(required_skills) - len(matched_required)
        if missing_req_count > 0:
            deductions.append(
                f"Missing {missing_req_count}/{len(required_skills)} required skills "
                f"(-{round(35 * (1 - required_score/100), 1)} points)"
            )
    else:
        required_score = 100.0  # No required skills specified = full marks

    # ─── 2. Preferred Skills Score (15%) ───────────────────────────────────────
    preferred_skills = jd_entities.get("preferred_skills", [])
    matched_preferred = comparison.get("matched_preferred", [])
    if len(preferred_skills) > 0:
        preferred_score = (len(matched_preferred) / len(preferred_skills)) * 100
        missing_pref_count = len(preferred_skills) - len(matched_preferred)
        if missing_pref_count > 0:
            deductions.append(
                f"Missing {missing_pref_count}/{len(preferred_skills)} preferred skills "
                f"(-{round(15 * (1 - preferred_score/100), 1)} points)"
            )
    else:
        preferred_score = 100.0

    # ─── 3. ATS Keywords Score (15%) ──────────────────────────────────────────
    total_kw = len(comparison.get("matched_keywords", [])) + len(comparison.get("missing_keywords", []))
    matched_kw = len(comparison.get("matched_keywords", []))
    if total_kw > 0:
        ats_score = (matched_kw / total_kw) * 100
        missing_kw_count = total_kw - matched_kw
        if missing_kw_count > 0:
            deductions.append(
                f"Missing {missing_kw_count}/{total_kw} ATS keywords "
                f"(-{round(15 * (1 - ats_score/100), 1)} points)"
            )
    else:
        ats_score = 80.0  # Default when no keywords detected

    # ─── 4. Experience / Project Relevance Score (15%) ─────────────────────────
    relevance_pct = comparison.get("experience_relevance_pct", 0)
    has_projects = comparison.get("resume_has_projects", False)
    experience_score = min(100, relevance_pct)
    if has_projects:
        experience_score = min(100, experience_score + 10)
    if experience_score < 50:
        deductions.append(
            f"Low project/experience relevance to the target role ({round(relevance_pct)}% skill coverage) "
            f"(-{round(15 * (1 - experience_score/100), 1)} points)"
        )

    # ─── 5. Education / Certifications Score (10%) ─────────────────────────────
    education_score = 50.0  # Base score
    if comparison.get("resume_has_education", False):
        education_score += 25
    if comparison.get("education_aligned", False):
        education_score += 15
    if comparison.get("resume_has_certifications", False):
        education_score += 10
    education_score = min(100, education_score)
    jd_education_reqs = jd_entities.get("education_requirements", [])
    if jd_education_reqs and not comparison.get("education_aligned", False):
        deductions.append(
            f"Education requirements mentioned in JD may not align with resume "
            f"(-{round(10 * (1 - education_score/100), 1)} points)"
        )

    # ─── 6. Resume Quality Score (10%) ─────────────────────────────────────────
    quality_score = 40.0  # Base
    sections = resume_entities.get("sections_found", [])
    action_verbs = comparison.get("action_verbs_count", 0)
    achievements = comparison.get("achievements_count", 0)

    # Reward for having proper sections
    quality_score += min(30, len(sections) * 6)
    # Reward for action verbs
    quality_score += min(15, action_verbs * 3)
    # Reward for measurable achievements
    quality_score += min(15, achievements * 5)
    quality_score = min(100, quality_score)

    section_weaknesses = comparison.get("section_weaknesses", [])
    if len(section_weaknesses) > 2:
        deductions.append(
            f"Resume is missing {len(section_weaknesses)} standard sections "
            f"({', '.join(w['section'] for w in section_weaknesses)})"
        )
    weak_bullets = comparison.get("weak_bullet_warnings", [])
    if weak_bullets:
        for wb in weak_bullets:
            deductions.append(wb["issue"] + ": " + wb["suggestion"])

    # ─── Weighted Overall Score ────────────────────────────────────────────────
    overall = (
        required_score * 0.35
        + preferred_score * 0.15
        + ats_score * 0.15
        + experience_score * 0.15
        + education_score * 0.10
        + quality_score * 0.10
    )
    overall = round(min(100, max(0, overall)), 1)

    return {
        "overall_score": overall,
        "breakdown": {
            "required_skills_score": round(required_score, 1),
            "preferred_skills_score": round(preferred_score, 1),
            "ats_keywords_score": round(ats_score, 1),
            "experience_relevance_score": round(experience_score, 1),
            "education_score": round(education_score, 1),
            "resume_quality_score": round(quality_score, 1),
        },
        "weights": {
            "required_skills": 35,
            "preferred_skills": 15,
            "ats_keywords": 15,
            "experience_relevance": 15,
            "education": 10,
            "resume_quality": 10,
        },
        "deduction_reasons": deductions,
    }
