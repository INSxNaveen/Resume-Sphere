import pytest
from services.screen_answerer import generate_screen_answer

def test_yes_no_match():
    resume = "Experienced React and Python developer with 5 years in frontend."
    question = "Do you have experience with React?"
    result = generate_screen_answer(resume, question, "yes_no")
    assert result["answer"] == "Yes"
    assert result["confidence"] >= 0.7
    assert "react" in result["reasoning"].lower()

def test_yes_no_no_match():
    resume = "Python backend developer."
    question = "Do you have experience with Kubernetes?"
    result = generate_screen_answer(resume, question, "yes_no")
    assert result["answer"] == "No"
    assert result["confidence"] >= 0.7

def test_numeric_years_found():
    resume = "5+ years of Python experience. Senior Software Engineer."
    question = "How many years of Python experience do you have?"
    result = generate_screen_answer(resume, question, "numeric")
    assert result["answer"] == "5"
    assert result["confidence"] >= 0.8

def test_multiple_choice_match():
    resume = "Cloud architect specializing in AWS and serverless."
    question = "Which cloud platform are you most proficient in?"
    options = ["AWS", "Azure", "Google Cloud"]
    result = generate_screen_answer(resume, question, "multiple_choice", options)
    assert result["answer"] == "AWS"
    assert result["confidence"] > 0.0

def test_text_relevant_extract():
    resume = "I worked at Google for 3 years. I specialized in Cloud computing and distributed systems."
    question = "Describe your experience with cloud platforms."
    result = generate_screen_answer(resume, question, "text")
    assert "Cloud" in result["answer"]
    assert result["confidence"] == 0.7

def test_sensitive_question():
    resume = "I am a skilled developer."
    question = "What is your citizenship status?"
    result = generate_screen_answer(resume, question, "yes_no")
    assert result["answer"] == ""
    assert result["confidence"] == 0.0
    assert "Sensitive" in result["reasoning"]

def test_fallback_confidence():
    resume = "I like apples."
    question = "Do you have 10 years of experience in Quantum Computing?"
    # Numeric will fallback to "1" with low confidence if skill not found or no years found
    result = generate_screen_answer(resume, question, "numeric")
    if result["confidence"] < 0.5:
        assert "manual review recommended" in result["reasoning"]
