# Team Integration Guide - What Each Team Should Implement

This document tells backend, database, and AI teams exactly what they need to do to make this application work.

---

## Quick Summary

**Frontend (✅ DONE):** Upload interface, pages, API calls, routing, styling  
**Backend (TODO):** Handle file uploads, extract skills, implement matching algorithm  
**Database (TODO):** Store resumes, skills, users, courses  
**AI/ML (TODO):** Skill extraction, job-resume matching algorithm  

---

## Backend Team - What to Implement

### 1. Resume Upload Endpoint

**Frontend sends to:** `POST /upload-resume`

**What frontend sends:**
```javascript
FormData {
  resume: File (PDF or DOCX)
}
```

**What backend should do:**
1. Receive file from frontend
2. Save file to server/storage
3. Extract text from PDF/DOCX using Python libraries:
   - PDF: Use `PyPDF2` or `pdfplumber`
   - DOCX: Use `python-docx` library
4. Parse skills using AI/NLP (see AI team section)
5. Store extracted data in database
6. Return response to frontend

**What frontend expects back:**
```javascript
{
  success: true,
  message: "Resume uploaded successfully",
  data: {
    skills: ["Python", "JavaScript", "React", "SQL"],
    experience: ["Senior Developer at Google", "..."],
    education: ["B.S. Computer Science"],
    resumeId: "resume_123",  // Important: Pass this back
    extractedText: "Full resume text..."
  }
}
```

**Error handling:**
```javascript
{
  success: false,
  error: "File too large or unsupported format"
}
```

**Code Example (Python Flask):**
```python
from flask import Flask, request
from werkzeug.utils import secure_filename
import PyPDF2
import os

@app.route('/upload-resume', methods=['POST'])
def upload_resume():
    if 'resume' not in request.files:
        return {'success': False, 'error': 'No file provided'}
    
    file = request.files['resume']
    
    # Save file
    filename = secure_filename(file.filename)
    file.save(os.path.join('uploads', filename))
    
    # Extract text
    text = extract_text_from_file(file)
    
    # Parse skills using AI
    skills = extract_skills_with_ai(text)
    
    # Save to database
    resume = Resume(file_path=filename, extracted_text=text)
    db.session.add(resume)
    db.session.commit()
    
    return {'success': True, 'data': {'skills': skills, ...}}
```

---

### 2. Job Matching Endpoint

**Frontend sends to:** `POST /match-jobs`

**What frontend sends:**
```javascript
{
  jobDescription: "We are looking for a Python Developer with 5+ years experience in Django, REST APIs, and PostgreSQL..."
}
```

**What backend should do:**
1. Receive user's resume (stored from previous upload)
2. Receive job description text
3. Extract job requirements/skills from job description
4. Compare with user's skills using AI matching algorithm
5. Calculate match percentage (0-100%)
6. Identify matched skills and missing skills
7. Return results

**What frontend expects back:**
```javascript
{
  success: true,
  matchPercentage: 78,  // 0-100
  matchScore: 0.78,     // 0-1 decimal
  matchedSkills: [
    { skill: "Python", userLevel: "Expert", jobRequired: "Required" },
    { skill: "REST APIs", userLevel: "Expert", jobRequired: "Required" },
    { skill: "PostgreSQL", userLevel: "Intermediate", jobRequired: "Required" }
  ],
  missingSkills: [
    { skill: "Django", difficulty: "Medium", importance: "High" },
    { skill: "Docker", difficulty: "Medium", importance: "Medium" }
  ],
  analysis: {
    strengths: ["Strong Python experience", "REST API expertise"],
    weaknesses: ["No Django framework experience"],
    overallFit: "Good fit with some skill gaps"
  }
}
```

**Code Example (Python with NLP):**
```python
@app.route('/match-jobs', methods=['POST'])
def match_jobs():
    data = request.get_json()
    job_description = data['jobDescription']
    
    # Get user's resume from session/database
    user_resume = get_current_user_resume()
    
    # Extract skills from job description
    job_skills = extract_skills_with_ai(job_description)
    user_skills = user_resume.skills
    
    # Calculate match percentage
    match_percentage = calculate_match(user_skills, job_skills)
    
    # Identify matched and missing
    matched = find_matched_skills(user_skills, job_skills)
    missing = find_missing_skills(user_skills, job_skills)
    
    return {
        'success': True,
        'matchPercentage': match_percentage,
        'matchedSkills': matched,
        'missingSkills': missing
    }
```

---

### 3. Skill Gap Endpoint

**Frontend sends to:** `GET /skill-gap`

**What backend should do:**
1. Get current user's uploaded resume
2. Get skills from the job description (stored from previous request)
3. Find skills in job but not in user's resume
4. Determine difficulty level for each skill
5. Return list of skills to learn

**What frontend expects back:**
```javascript
{
  success: true,
  skillGaps: [
    {
      skill: "Django",
      difficulty: "Medium",
      importance: "High",
      learning_time: "3-4 weeks",
      description: "Web framework for Python"
    },
    {
      skill: "Docker",
      difficulty: "Hard",
      importance: "Medium",
      learning_time: "2-3 weeks",
      description: "Container orchestration"
    },
    {
      skill: "Kubernetes",
      difficulty: "Hard",
      importance: "Low",
      learning_time: "4-6 weeks",
      description: "Cloud orchestration"
    }
  ],
  totalSkillsNeeded: 3,
  estimatedLearningTime: "9-13 weeks"
}
```

---

### 4. Learning Resources Endpoint

**Frontend sends to:** `GET /learning-resources`

**What backend should do:**
1. Get missing skills from skill gap analysis
2. Query database for courses/resources for each skill
3. Can use external APIs:
   - Udemy API for course data
   - Coursera API
   - YouTube API
   - YouTube Learning API
4. Filter and rank resources by rating/popularity
5. Return top resources

**What frontend expects back:**
```javascript
{
  success: true,
  resources: [
    {
      skill: "Django",
      courses: [
        {
          title: "Complete Django for Beginners",
          provider: "Udemy",
          link: "https://udemy.com/...",
          price: "₹499",
          rating: 4.8,
          duration: "15 hours",
          free: false
        },
        {
          title: "Django Official Tutorial",
          provider: "django.org",
          link: "https://docs.djangoproject.com/",
          price: "Free",
          rating: 5.0,
          duration: "Self-paced",
          free: true
        },
        {
          title: "Django Tutorial Playlist",
          provider: "YouTube",
          link: "https://youtube.com/...",
          price: "Free",
          rating: 4.6,
          duration: "6 hours",
          free: true
        }
      ]
    },
    {
      skill: "Docker",
      courses: [
        // Similar structure...
      ]
    }
  ]
}
```

---

### 5. Error Handling (All Endpoints)

**Always return in this format:**

Success:
```javascript
{
  success: true,
  message: "Operation successful",
  data: { /* whatever data needed */ }
}
```

Error:
```javascript
{
  success: false,
  error: "Specific error message",
  code: "ERROR_CODE"  // For frontend to handle specific errors
}
```

---

## Database Team - What Tables to Create

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Resumes Table
```sql
CREATE TABLE resumes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  file_path VARCHAR(255),
  file_name VARCHAR(255),
  extracted_text LONGTEXT,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Skills Table
```sql
CREATE TABLE skills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) UNIQUE,
  category VARCHAR(100),  -- e.g., "Programming Language", "Framework", "Tool"
  difficulty INT,         -- 1=Easy, 2=Medium, 3=Hard
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Resume Skills Table (Many-to-Many)
```sql
CREATE TABLE resume_skills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  resume_id INT NOT NULL,
  skill_id INT NOT NULL,
  proficiency_level VARCHAR(50),  -- "Beginner", "Intermediate", "Expert"
  years_experience DECIMAL(3,1),
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id),
  UNIQUE KEY unique_resume_skill (resume_id, skill_id)
);
```

### Job Descriptions Table
```sql
CREATE TABLE job_descriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255),
  company VARCHAR(255),
  description LONGTEXT,
  job_link VARCHAR(500),
  saved_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Courses/Resources Table
```sql
CREATE TABLE learning_resources (
  id INT PRIMARY KEY AUTO_INCREMENT,
  skill_id INT NOT NULL,
  title VARCHAR(255),
  provider VARCHAR(100),  -- "Udemy", "Coursera", "YouTube", etc
  link VARCHAR(500),
  price DECIMAL(10,2),     -- 0 for free
  rating DECIMAL(3,2),     -- 0-5
  duration VARCHAR(100),   -- "15 hours", "etc
  free BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);
```

### Match Results Table (Optional - for history)
```sql
CREATE TABLE match_results (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  job_description_id INT,
  match_percentage INT,
  matched_skills JSON,     -- Store as JSON array
  missing_skills JSON,     -- Store as JSON array
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_description_id) REFERENCES job_descriptions(id)
);
```

---

## AI/ML Team - What Algorithms to Implement

### 1. Skill Extraction from Resume Text

**Input:** Plain text extracted from PDF/DOCX  
**Output:** List of skills with proficiency levels

**What to do:**
1. Use NLP library like spaCy or NLTK in Python
2. Create skill database or use pre-trained model
3. Match keywords in resume to known skills
4. Assign proficiency levels based on:
   - Keywords like "Expert", "5+ years", "Master", etc.
   - Position in resume (skills section = higher proficiency)
   - Context in work experience

**Example Python:**
```python
import spacy
from skillNer.skill_matcher_utils import skill_matcher

def extract_skills_from_resume(text):
    # Use spaCy or SkillNer library
    skills = skill_matcher(text)
    
    # Match to your skill database
    extracted_skills = []
    for skill in skills:
        proficiency = determine_proficiency(text, skill)
        extracted_skills.append({
            'skill': skill,
            'proficiency': proficiency
        })
    
    return extracted_skills
```

---

### 2. Skill Extraction from Job Description

**Input:** Job description text  
**Output:** List of required skills

**What to do:**
1. Parse job description using NLP
2. Extract "Required Skills", "Nice to Have", "Preferred" sections
3. Return skills with importance level

**Example:**
```python
def extract_job_skills(job_description):
    skills = []
    
    # Look for "Skills" section
    if "skills" in job_description.lower():
        skills_section = extract_section(job_description, "skills")
        skills = parse_skills_list(skills_section)
    
    # Also extract from "Requirements" section
    if "requirements" in job_description.lower():
        requirements = extract_section(job_description, "requirements")
        more_skills = parse_skills_list(requirements)
        skills.extend(more_skills)
    
    return skills
```

---

### 3. Resume-Job Matching Algorithm

**Input:** User's skills, Job's required skills  
**Output:** Match percentage (0-100%)

**Algorithm options:**

**Option 1: Simple Matching**
```
Match % = (Matched Skills / Total Job Skills) * 100
Example: 5 matched out of 8 required = 62.5%
```

**Option 2: Weighted Matching**
```
Match % = SUM(weight * skill_match) / SUM(required_weights)
- Give more weight to important skills (marked as "Required")
- Less weight to "Nice to Have" skills
```

**Option 3: Semantic Similarity (Better)**
```
Use ML model to find similar skills
Example: "Spring Boot" matches "Java Web Framework"
Use word embeddings (Word2Vec, BERT) for similarity
```

**Python Example:**
```python
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

def match_resume_with_job(user_skills, job_skills, weights=None):
    # Use sentence embeddings for better matching
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    user_embeddings = [model.encode(skill) for skill in user_skills]
    job_embeddings = [model.encode(skill) for skill in job_skills]
    
    # Calculate similarity scores
    similarity_matrix = cosine_similarity(user_embeddings, job_embeddings)
    
    # Find best matches
    matches = []
    for i, job_skill in enumerate(job_skills):
        max_similarity = max(similarity_matrix[:, i])
        if max_similarity > 0.7:  # Threshold
            matches.append((job_skill, max_similarity))
    
    # Calculate percentage
    match_percentage = (len(matches) / len(job_skills)) * 100
    
    return {
        'percentage': match_percentage,
        'matched': matches,
        'missing': [s for s in job_skills if s not in [m[0] for m in matches]]
    }
```

---

### 4. Skill Difficulty Assignment

**How to determine difficulty:**
1. Research-based (manual):
   - Easy: HTML, CSS, Basic SQL
   - Medium: JavaScript, Python, SQL Intermediate
   - Hard: Kubernetes, Advanced ML, System Design

2. Data-based:
   - Look at course duration/complexity
   - Check how many people master this skill
   - Use training effort metrics

**Python Example:**
```python
SKILL_DIFFICULTY = {
    'JavaScript': 2,      # Medium
    'React': 2,          # Medium
    'Django': 2,         # Medium
    'Kubernetes': 3,     # Hard
    'Machine Learning': 3, # Hard
    'HTML': 1,           # Easy
    'CSS': 1,            # Easy
}

def get_skill_difficulty(skill_name):
    return SKILL_DIFFICULTY.get(skill_name, 2)  # Default to Medium
```

---

## Integration Checklist

### Before Frontend Can Be Fully Tested:

- [ ] Backend: `/upload-resume` endpoint working
  - [ ] Accepts PDF/DOCX files
  - [ ] Extracts text
  - [ ] Parses skills
  - [ ] Returns correct format

- [ ] Backend: `/match-jobs` endpoint working
  - [ ] Receives job description
  - [ ] Compares with user's resume
  - [ ] Returns match percentage

- [ ] Backend: `/skill-gap` endpoint working
  - [ ] Returns missing skills
  - [ ] Includes difficulty levels

- [ ] Backend: `/learning-resources` endpoint working
  - [ ] Returns courses for skills
  - [ ] Has working links

- [ ] Database: All tables created with correct relationships

- [ ] AI: Skill extraction working with good accuracy

- [ ] AI: Matching algorithm returning reasonable percentages

### Testing Order:

1. **Test upload:** Upload test resume → Check extraction
2. **Test matching:** Enter job description → Check match %
3. **Test gap:** Verify missing skills are correct
4. **Test resources:** Check recommended courses

---

## Common Issues & Solutions

### Issue: File upload fails
**Solution:** Check MIME type handling, file size limits, storage permissions

### Issue: Skills not extracted properly
**Solution:** Check NLP model accuracy, improve skill database

### Issue: Match percentage seems wrong
**Solution:** Review matching algorithm weights, test with manual examples

### Issue: No learning resources found
**Solution:** Add more courses to database, integrate external APIs

---

## Timeline Example

Week 1: Database setup, basic endpoints  
Week 2: File upload working, skill extraction  
Week 3: Matching algorithm, resource APIs  
Week 4: Testing, optimization, deployment  

---

## Questions?

Ask the frontend team (me) if you need clarification on what the frontend expects!

Good luck! 🚀
