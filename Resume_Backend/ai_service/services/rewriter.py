"""
Truthful resume rewriter.
Generates ATS-optimized role-specific resume drafts based ONLY on real user data.

Hard truth rules:
- Never invent fake internships, companies, dates, achievements, or certifications
- Only rewrite and reorganize facts the user already provided
- If a JD skill is missing from the resume, mark it as missing — do NOT fabricate it
- Improves bullet quality with stronger verbs and quantification prompts
"""

import re
from .skill_dictionary import normalize_skill_lenient


def generate_tailored_resume(
    resume_entities: dict,
    jd_entities: dict,
    comparison: dict,
    score_result: dict,
    role_title: str = "",
    company_name: str = "",
) -> dict:
    """
    Generate a truthful ATS-optimized resume draft.
    Returns structured resume content in sections.
    """
    matched_skills = comparison.get("matched_skills", [])
    missing_skills = [m["skill_name"] for m in comparison.get("missing_skills", [])]
    resume_skills = resume_entities.get("skills", [])
    resume_education = resume_entities.get("education", [])
    resume_certifications = resume_entities.get("certifications", [])
    resume_projects = resume_entities.get("projects", [])
    resume_achievements = resume_entities.get("achievements", [])
    jd_required = jd_entities.get("required_skills", [])
    jd_preferred = jd_entities.get("preferred_skills", [])

    # ─── 1. ATS-Optimized Professional Summary ────────────────────────────────
    years_hint = ""
    seniority = jd_entities.get("seniority_signals", [])
    if "senior" in seniority:
        years_hint = "seasoned"
    elif "mid" in seniority:
        years_hint = "experienced"
    elif "entry" in seniority:
        years_hint = "motivated"
    else:
        years_hint = "results-driven"

    # Build summary from real skills only
    top_matched = matched_skills[:5]
    summary_skills = ", ".join(top_matched) if top_matched else ", ".join(resume_skills[:5])

    target = f"{role_title}" if role_title else "the target role"
    company_mention = f" at {company_name}" if company_name else ""

    summary = (
        f"{years_hint.capitalize()} software professional with demonstrated expertise in {summary_skills}. "
        f"Seeking to contribute to {target}{company_mention}. "
    )
    if resume_achievements:
        achievement_summary = resume_achievements[0] if len(resume_achievements[0]) < 100 else resume_achievements[0][:97] + "..."
        summary += f"Track record includes: {achievement_summary}."

    # ─── 2. Reordered Skills Section ──────────────────────────────────────────
    # Priority: matched required → matched preferred → other resume skills
    skills_section = []
    # First: skills that match JD requirements (most ATS-relevant)
    for skill in jd_required:
        if skill.lower() in [s.lower() for s in resume_skills]:
            if skill not in skills_section:
                skills_section.append(skill)
    # Then: skills matching preferred
    for skill in jd_preferred:
        if skill.lower() in [s.lower() for s in resume_skills]:
            if skill not in skills_section:
                skills_section.append(skill)
    # Then: remaining resume skills
    for skill in resume_skills:
        if skill not in skills_section:
            skills_section.append(skill)

    # ─── 3. Improved Project Bullets ──────────────────────────────────────────
    improved_projects = []
    for project in resume_projects:
        improved = project
        # Add context if the project relates to matched skills
        related_skills = [s for s in matched_skills if s.lower() in project.lower()]
        if related_skills:
            improved = f"{project} — Technologies: {', '.join(related_skills)}"
        improved_projects.append(improved)

    # ─── 4. Suggestions for improvement (not fabrication) ─────────────────────
    improvement_notes = []
    if missing_skills:
        improvement_notes.append(
            f"Note: The following skills are required by the JD but not found in your resume: "
            f"{', '.join(missing_skills[:5])}. Consider acquiring these through learning rather than fabricating experience."
        )

    weak_bullets = comparison.get("weak_bullet_warnings", [])
    for wb in weak_bullets:
        improvement_notes.append(f"{wb['issue']}: {wb['suggestion']}")

    section_weaknesses = comparison.get("section_weaknesses", [])
    for sw in section_weaknesses:
        improvement_notes.append(f"Add a '{sw['section']}' section: {sw['suggestion']}")

    # ─── 5. Build the structured output ───────────────────────────────────────
    overall_score = score_result.get("overall_score", 0)

    plain_text_parts = []
    plain_text_parts.append(f"═══ TAILORED RESUME FOR: {role_title or 'Target Role'} ═══")
    if company_name:
        plain_text_parts.append(f"Company: {company_name}")
    plain_text_parts.append(f"Match Score: {overall_score}%")
    plain_text_parts.append("")

    # Summary
    plain_text_parts.append("── PROFESSIONAL SUMMARY ──")
    plain_text_parts.append(summary)
    plain_text_parts.append("")

    # Skills
    plain_text_parts.append("── TECHNICAL SKILLS ──")
    plain_text_parts.append(", ".join(skills_section))
    plain_text_parts.append("")

    # Education
    if resume_education:
        plain_text_parts.append("── EDUCATION ──")
        for edu in resume_education:
            plain_text_parts.append(f"• {edu}")
        plain_text_parts.append("")

    # Certifications
    if resume_certifications:
        plain_text_parts.append("── CERTIFICATIONS ──")
        for cert in resume_certifications:
            plain_text_parts.append(f"• {cert}")
        plain_text_parts.append("")

    # Projects
    if improved_projects:
        plain_text_parts.append("── KEY PROJECTS ──")
        for proj in improved_projects:
            plain_text_parts.append(f"• {proj}")
        plain_text_parts.append("")

    # Achievements
    if resume_achievements:
        plain_text_parts.append("── KEY ACHIEVEMENTS ──")
        for ach in resume_achievements:
            plain_text_parts.append(f"• {ach}")
        plain_text_parts.append("")

    # Improvement notes
    if improvement_notes:
        plain_text_parts.append("── IMPROVEMENT RECOMMENDATIONS ──")
        for note in improvement_notes:
            plain_text_parts.append(f"⚠ {note}")
        plain_text_parts.append("")

    plain_text = "\n".join(plain_text_parts)

    content_json = {
        "summary": summary,
        "skills": skills_section,
        "education": resume_education,
        "certifications": resume_certifications,
        "projects": improved_projects,
        "achievements": resume_achievements,
        "improvement_notes": improvement_notes,
        "missing_skills_not_included": missing_skills,
        "role_title": role_title,
        "company_name": company_name,
        "match_score": overall_score,
    }

    return {
        "plain_text": plain_text,
        "content_json": content_json,
    }
