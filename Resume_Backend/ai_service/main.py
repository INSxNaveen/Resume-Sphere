"""
ResumeSphere AI Service — FastAPI Application
Endpoints: POST /analyze, POST /generate-resume, GET /health
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import traceback

from services.resume_extractor import extract_resume_entities
from services.planner import infer_jobs
from services.screen_answerer import generate_screen_answer
from services.jd_extractor import extract_jd_entities
from services.comparator import compare_entities
from services.scorer import compute_score

app = FastAPI(
    title="ResumeSphere AI Service",
    description="NLP-powered resume analysis, comparison, scoring, and generation",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "chrome-extension://*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ═══════════════════════════════════════════════════════════════════════════════
# Request / Response Models
# ═══════════════════════════════════════════════════════════════════════════════

class AnalyzeRequest(BaseModel):
    resume_text: str = Field(..., min_length=20, description="Full extracted text from resume")
    job_description: str | None = Field(None, description="Optional JD text for specific matching")

class GenerateResumeRequest(BaseModel):
    resume_text: str = Field(..., min_length=20)

class ScreenAnswerRequest(BaseModel):
    resume_text: str
    question: str
    question_type: str  # "yes_no" | "numeric" | "text" | "multiple_choice"
    options: list[str] | None = None  # only for multiple_choice

class ScreenAnswerResponse(BaseModel):
    answer: str
    confidence: float
    reasoning: str


# ═══════════════════════════════════════════════════════════════════════════════
# Endpoints
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ResumeSphere AI", "version": "1.0.0"}


@app.post("/screen-answer", response_model=ScreenAnswerResponse)
async def screen_answer(request: ScreenAnswerRequest):
    """
    Automated job application screening assistant.
    Returns the best answer for a screening question based on the resume.
    """
    try:
        result = generate_screen_answer(
            request.resume_text, 
            request.question, 
            request.question_type, 
            request.options
        )
        return result
    except Exception as e:
        traceback.print_exc()
        return {
            "answer": "",
            "confidence": 0.0,
            "reasoning": f"Internal error — manual input required: {str(e)}"
        }


@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    """
    Dual-mode analysis endpoint:
    1. If JD provided: Compare resume vs JD and return match score.
    2. If no JD: Resume-first analysis (eligible jobs, suggestions).
    """
    try:
        # Always extract resume entities first
        resume_entities = extract_resume_entities(request.resume_text)

        # MODE 1: Specific Job Comparison (used by Chrome Extension)
        if request.job_description and len(request.job_description) > 50:
            jd_entities = extract_jd_entities(request.job_description)
            comparison = compare_entities(resume_entities, jd_entities)
            score_data = compute_score(comparison, resume_entities, jd_entities)
            
            return {
                "score": score_data["overall_score"],
                "match_details": comparison,
                "score_breakdown": score_data["breakdown"],
                "reasoning": score_data["deduction_reasons"][0] if score_data["deduction_reasons"] else "Strong match detected"
            }

        # MODE 2: Resume-first general analysis
        eligible_jobs, improvement_suggestions, unlocked_opportunities = infer_jobs(resume_entities.get("skills", []))

        return {
            "currentSkills": resume_entities.get("skills", []),
            "eligibleJobs": eligible_jobs,
            "improvementSuggestions": improvement_suggestions,
            "unlockedOpportunities": unlocked_opportunities
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/generate-resume")
async def generate_resume(request: GenerateResumeRequest):
    """
    Deprecated in new flow.
    """
    raise HTTPException(status_code=501, detail="Resume generation deprecated in resume-first flow.")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
