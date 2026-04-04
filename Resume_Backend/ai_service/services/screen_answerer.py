import re
import spacy

# Load spaCy for sentence segmentation
try:
    nlp = spacy.load("en_core_web_sm")
except:
    # Fallback if model not loaded
    nlp = None

def generate_screen_answer(resume_text: str, question: str, question_type: str, options: list[str] | None = None) -> dict:
    """
    Analyzes a screening question and resume text to generate a recommended answer.
    
    Args:
        resume_text (str): Full text of the user's resume.
        question (str): The screening question from the job application.
        question_type (str): "yes_no", "numeric", "text", or "multiple_choice".
        options (list[str], optional): Multiple choice options if applicable.
        
    Returns:
        dict: {
            "answer": str,
            "confidence": float,
            "reasoning": str
        }
    """
    # 1. Sensitive question detection
    sensitive_keywords = ["authorized", "citizenship", "visa", "disability", "veteran", "gender", "race", "ethnicity", "religion", "age"]
    if any(k in question.lower() for k in sensitive_keywords):
        return {
            "answer": "",
            "confidence": 0.0,
            "reasoning": "Sensitive question — requires manual input"
        }

    resume_lower = resume_text.lower()
    question_lower = question.lower()
    
    result = {"answer": "", "confidence": 0.5, "reasoning": ""}

    if question_type == "yes_no":
        # Extract potential skill keywords (simplified: remove common words)
        keywords = set(re.findall(r"\w+", question_lower)) - {"do", "you", "have", "experience", "with", "working", "in", "the", "a", "an", "at", "to", "or"}
        
        matches = [k for k in keywords if k in resume_lower and len(k) > 2]
        
        if len(matches) >= 1:
            result["answer"] = "Yes"
            result["confidence"] = 0.9 if len(matches) > 1 else 0.7
            result["reasoning"] = f"Found relevant keywords in resume: {', '.join(matches)}"
        else:
            result["answer"] = "No"
            result["confidence"] = 0.8
            result["reasoning"] = "No matching keywords found in resume"

    elif question_type == "numeric":
        # Find the main skill in the question
        keywords = set(re.findall(r"\w+", question_lower)) - {"how", "many", "years", "of", "experience", "do", "you", "have", "with", "in", "at"}
        skill = next((k for k in keywords if len(k) > 2), None)
        
        # Search for years near skill
        years = "1" # Conservative fallback
        found = False
        
        if skill:
            # Look for skill and then a number + "years" nearby in resume
            pattern = rf"{re.escape(skill)}.*?(\d+)\+?\s*(years?|yrs?)"
            match = re.search(pattern, resume_lower, re.DOTALL | re.IGNORECASE)
            if match:
                years = match.group(1)
                found = True
            else:
                # Try number then skill
                pattern = rf"(\d+)\+?\s*(years?|yrs?).*?{re.escape(skill)}"
                match = re.search(pattern, resume_lower, re.DOTALL | re.IGNORECASE)
                if match:
                    years = match.group(1)
                    found = True
        
        result["answer"] = years
        result["confidence"] = 0.8 if found else 0.4
        result["reasoning"] = f"Extracted {years} years based on resume content" if found else f"Estimated {years} year (conservative fallback)"

    elif question_type == "multiple_choice" and options:
        scores = []
        for opt in options:
            opt_lower = opt.lower()
            opt_words = set(re.findall(r"\w+", opt_lower)) - {"the", "a", "an", "and", "or"}
            score = sum(1 for w in opt_words if w in resume_lower and len(w) > 2)
            scores.append(score)
            
        max_idx = scores.index(max(scores))
        if max(scores) > 0:
            result["answer"] = options[max_idx]
            result["confidence"] = min(1.0, max(scores) / 3.0) # clamped normalization
            result["reasoning"] = f"Option '{options[max_idx]}' matches keywords in resume"
        else:
            # Pick the first/generic if no match
            result["answer"] = options[0]
            result["confidence"] = 0.3
            result["reasoning"] = "No clear match found, picking first option as fallback"

    elif question_type == "text":
        keywords = set(re.findall(r"\w+", question_lower)) - {"describe", "your", "experience", "with", "in", "tell", "us", "about"}
        
        sentences = []
        if nlp:
            doc = nlp(resume_text)
            sentences = [sent.text.strip() for sent in doc.sents]
        else:
            # Basic fallback split if model not available
            sentences = [s.strip() for s in re.split(r'[.!?]\s+', resume_text)]
            
        relevant = [s for s in sentences if any(k in s.lower() for k in keywords if len(k) > 2)]
        
        if relevant:
            result["answer"] = " ".join(relevant[:3])
            result["confidence"] = 0.7
            result["reasoning"] = "Extracted relevant segments from experience history"
        else:
            result["answer"] = resume_text[:200] + "..." # Generic first 200 chars
            result["confidence"] = 0.4
            result["reasoning"] = "No direct matching sentences found, provided general summary"

    # Fallback confidence adjustment
    if result["confidence"] < 0.5:
        result["reasoning"] += " — low confidence, manual review recommended"
        
    return result
