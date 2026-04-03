"""
ResumeSphere AI Service — FastAPI Application
Endpoints:
- GET /health
- POST /analyze
- POST /generate-resume
"""

import os
import traceback
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from services.resume_extractor import extract_resume_entities
from services.jd_extractor import extract_jd_entities
from services.comparator import compare_entities
from services.scorer import compute_score
from services.planner import generate_learning_plan
from services.rewriter import generate_tailored_resume


app = FastAPI(
    title="ResumeSphere AI Service",
    description="NLP-powered resume analysis, comparison, scoring, and generation",
    version="1.0.0",
)

# CORS
frontend_url = os.getenv("FRONTEND_URL", "*")

if frontend_url == "*":
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[frontend_url],
        allow_methods=["*"],
        allow_headers=["*"],
    )


# Request Models
class AnalyzeRequest(BaseModel):
    resume_text: str = Field(..., min_length=20, description="Full extracted text from resume")
    jd_text: str = Field(..., min_length=20, description="Full pasted job description text")
    role_title: str = Field(..., min_length=1, description="Target role title")
    company_name: Optional[str] = Field(default="", description="Optional company name")
    experience_level: Optional[str] = Field(default="", description="Optional experience level")


class GenerateResumeRequest(BaseModel):
    resume_text: str = Field(..., min_length=20)
    jd_text: str = Field(..., min_length=20)
    role_title: str = Field(..., min_length=1)
    company_name: Optional[str] = Field(default="")
    experience_level: Optional[str] = Field(default="")


@app.get("/")
async def root():
    return {
        "message": "ResumeSphere AI Service is running",
        "docs": "/docs",
        "health": "/health",
        "version": "1.0.0",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ResumeSphere AI",
        "version": "1.0.0",
    }


@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    """
    Full analysis pipeline:
    1. Extract resume entities
    2. Extract JD entities
    3. Compare both directly
    4. Compute weighted score
    5. Generate learning plan
    6. Return structured JSON
    """
    try:
        resume_entities = extract_resume_entities(request.resume_text)
        jd_entities = extract_jd_entities(request.jd_text, request.role_title)
        comparison = compare_entities(resume_entities, jd_entities, request.role_title)
        score_result = compute_score(comparison, resume_entities, jd_entities)

        learning_plan = generate_learning_plan(
            comparison.get("missing_skills", []),
            request.role_title,
        )

        suggestions = []

        for weakness in comparison.get("section_weaknesses", []):
            suggestions.append({
                "type": "section",
                "title": f"Missing '{weakness['section']}' section",
                "description": weakness["suggestion"],
            })

        for warning in comparison.get("weak_bullet_warnings", []):
            suggestions.append({
                "type": "quality",
                "title": warning["issue"],
                "description": warning["suggestion"],
            })

        if request.role_title:
            suggestions.append({
                "type": "targeting",
                "title": f"Tailor your summary for {request.role_title}",
                "description": f"Explicitly mention '{request.role_title}' in your professional summary to improve ATS matching.",
            })

        for deduction in score_result.get("deduction_reasons", []):
            suggestions.append({
                "type": "scoring",
                "title": "Score deduction",
                "description": deduction,
            })

        return {
            "overall_score": score_result["overall_score"],
            "score_breakdown": score_result["breakdown"],
            "score_weights": score_result["weights"],
            "deduction_reasons": score_result["deduction_reasons"],
            "matched_skills": comparison.get("matched_skills", []),
            "missing_skills": comparison.get("missing_skills", []),
            "missing_keywords": comparison.get("missing_keywords", []),
            "matched_keywords": comparison.get("matched_keywords", []),
            "suggestions": suggestions,
            "learning_plan": learning_plan,
            "resume_entities": {
                "skills": resume_entities.get("skills", []),
                "education": resume_entities.get("education", []),
                "certifications": resume_entities.get("certifications", []),
                "projects": resume_entities.get("projects", []),
                "achievements": resume_entities.get("achievements", []),
                "sections_found": resume_entities.get("sections_found", []),
                "action_verbs_count": len(resume_entities.get("action_verbs_used", [])),
            },
            "jd_entities": {
                "required_skills": jd_entities.get("required_skills", []),
                "preferred_skills": jd_entities.get("preferred_skills", []),
                "seniority_signals": jd_entities.get("seniority_signals", []),
                "education_requirements": jd_entities.get("education_requirements", []),
                "keyword_frequencies": jd_entities.get("keyword_frequencies", {}),
            },
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/generate-resume")
async def generate_resume(request: GenerateResumeRequest):
    """
    Generate a truthful ATS-optimized resume based on real user data.
    """
    try:
        resume_entities = extract_resume_entities(request.resume_text)
        jd_entities = extract_jd_entities(request.jd_text, request.role_title)
        comparison = compare_entities(resume_entities, jd_entities, request.role_title)
        score_result = compute_score(comparison, resume_entities, jd_entities)

        result = generate_tailored_resume(
            resume_entities=resume_entities,
            jd_entities=jd_entities,
            comparison=comparison,
            score_result=score_result,
            role_title=request.role_title,
            company_name=request.company_name,
        )

        return {
            "plain_text": result["plain_text"],
            "content_json": result["content_json"],
            "overall_score": score_result["overall_score"],
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Resume generation failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)