# Resume-Job Matcher Frontend - Code Documentation

This document provides comprehensive explanations of all frontend code for team members to easily understand the implementation.

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar for all pages
│   ├── UploadBox.jsx   # Resume file upload with drag-drop
│   ├── DashboardCard.jsx      # Card for displaying results
│   ├── MatchScoreCard.jsx      # Shows match percentage
│   ├── SkillTag.jsx    # Individual skill badge
│   ├── FeatureCard.jsx # Feature display card
│   ├── ResourceCard.jsx        # Learning resource card
│   ├── FuturisticLoading.jsx   # Loading animation
│   └── ThreeBackground.jsx     # 3D background animation
├── pages/              # Full page components
│   ├── LandingPage.jsx # Home page with intro
│   ├── UploadResume.jsx        # Resume upload page
│   ├── JobDescription.jsx      # Job description input page
│   ├── Dashboard.jsx   # Results display page
│   ├── SkillGap.jsx    # Missing skills analysis
│   └── LearningResources.jsx   # Course recommendations
├── services/           # API communication
│   └── api.js          # Axios API functions
├── App.jsx            # Main app with routing
├── main.jsx           # Entry point
└── index.css          # Global styles + Tailwind
```

---

## How the Application Works

### User Journey:
1. **Landing Page** (`/`) → User sees intro and features
2. **Upload Resume** (`/upload`) → User uploads PDF/DOCX  
3. **Job Description** (`/job-description`) → User pastes job description
4. **Dashboard** (`/dashboard`) → Shows match score and analysis
5. **Skill Gap** (`/skill-gap`) → Lists missing skills
6. **Resources** (`/resources`) → Recommends learning courses

---

## Key Components Explanation

### 1. App.jsx (Main Application)
**Purpose:** Sets up routing for all pages  
**What it does:**
- Wraps entire app with React Router
- Displays Navbar on every page
- Routes URLs to different page components

**Backend team:** No backend code needed here - pure routing

---

### 2. services/api.js (Backend Communication)
**Purpose:** Handles all API calls to backend server

**Key Functions:**
- `uploadResume(file)` - Sends resume file to backend
- `matchJobs(jobDescription)` - Compares resume with job description (uses AI)
- `getSkillGap()` - Gets list of missing skills
- `getLearningResources()` - Gets course recommendations

**Backend team:** Implement these endpoints:
- POST `/upload-resume` - Accept file, extract text using Python/OCR
- POST `/match-jobs` - Compare resume & job description using AI/NLP
- GET `/skill-gap` - Query database for missing skills
- GET `/learning-resources` - Return courses from database/API

**Database team:** Create tables for:
- Users
- Resumes (store file path, extracted skills)
- Skills (name, difficulty level)
- Courses (title, link, skill_id)

---

### 3. components/Navbar.jsx
**Purpose:** Navigation bar at top of every page

**Features:**
- Logo/brand name (clickable to home)
- Links to all 6 pages
- Fixed position (stays at top while scrolling)
- Changes color on hover for better UX

**How it works:**
```jsx
<Link to="/">Home</Link>  // Uses React Router for client-side navigation
```

---

### 4. components/UploadBox.jsx
**Purpose:** File upload interface with drag-and-drop

**Features:**
- Drag & drop files onto zone
- Click to browse button
- File validation (only PDF/DOCX)
- Error messages
- Shows selected filename

**How it works:**
1. User drags file or clicks browse
2. `handleFileSelect()` validates file type
3. User clicks "Upload & Analyze Resume" button
4. `handleUpload()` calls backend API
5. Backend processes file, extracts skills
6. Returns data to parent component via callback `onUploadSuccess`

**Callbacks (for parent component):**
- `onUploadStart()` - Called when upload starts (show loading)
- `onUploadSuccess(data)` - Called when upload succeeds (show results)
- `onUploadEnd()` - Called when upload finishes (hide loading)

---

### 5. pages/UploadResume.jsx
**Purpose:** Resume upload page

**What it does:**
1. Displays title and instructions
2. Shows UploadBox component
3. Displays FuturisticLoading when uploading
4. Navigates to next page after successful upload
5. Shows 3D animation in background (QuantumField)

**User flow:**
- Upload resume → Show loading → Save data → Go to Job Description page

---

### 6. pages/JobDescription.jsx
**Purpose:** Page where user enters job description

**What it does:**
1. Shows textarea for job description input
2. User pastes job posting text
3. Calls backend AI to match resume with job
4. Shows match percentage and results
5. 3D data stream animation in background

**Backend:** Use NLP/AI to calculate similarity between resume and job description

---

### 7. pages/Dashboard.jsx
**Purpose:** Display match results

**Shows:**
- Match score percentage
- List of matched skills (skills in both resume & job)
- Job position info
- Additional analysis
- 3D skill visualization

**Uses 3D components:**
- SkillVisualization - Shows skill nodes connected with lines
- HolographicCard - Cards with glowing borders

---

### 8. pages/SkillGap.jsx
**Purpose:** Show missing skills analysis

**Shows:**
- Skills from job description that user doesn't have
- Difficulty level (easy/medium/hard)
- Skill network visualization

**Backend:** Compare user skills with job requirements

---

### 9. pages/LearningResources.jsx
**Purpose:** Recommend courses for skill development

**Shows:**
- Courses for each missing skill
- Course links (Udemy, Coursera, YouTube, etc)
- Free/Paid filter
- Difficulty level

**Database/Backend:** Maintain course database with topics

---

## Styling & Design System

### Colors:
- **Cyan** (#00ffff) - Primary accent color (highlights, hover)
- **Purple** (#9333ea) - Secondary color (gradients)
- **Pink** (#ec4899) - Accent for gradients
- **Dark** (slate-950) - Background
- **Light** (slate-300) - Text

### CSS Classes Used:
- `backdrop-blur-md` - Glassmorphism effect (frosted glass look)
- `shadow-lg` / `shadow-2xl` - Depth effects
- `transition-all duration-300` - Smooth animations
- Tailwind CSS for responsive design

---

## 3D Components (Three.js + React Three Fiber)

Used for animations:
- **LandingPage:** NeuralNetwork (moving nodes and lines)
- **UploadResume:** QuantumField (particle animation)
- **JobDescription:** DataStream (flowing data visualization)
- **Dashboard:** SkillVisualization (skill network with connections)
- **SkillGap:** SkillNetwork (interconnected skills)

These are purely visual - no functionality impact. Can be disabled if performance issues.

---

## State Management

This project uses **React Hooks** (useState, useRef) - no Redux needed.

### Common Patterns:
```jsx
// Store data
const [data, setData] = useState(null);

// Track loading
const [isLoading, setIsLoading] = useState(false);

// Store errors
const [error, setError] = useState('');

// Use navigation between pages
const navigate = useNavigate();
navigate('/next-page');
```

---

## API Flow Diagram

```
User Upload Resume
        ↓
UploadBox.jsx calls uploadResume(file)
        ↓
api.js sends POST /upload-resume with FormData
        ↓
Backend: Extract text, parse skills (Python/NLP)
        ↓
Database: Store resume file and extracted skills
        ↓
Return: { skills: [...], experience: [...] }
        ↓
Frontend: Show success, navigate to next page
```

---

## Type of Errors You Might See

### Network Error:
- Backend server not running
- Check if `http://localhost:5000` is running
- Solution: Start backend server first

### File Upload Error:
- Only PDF and DOCX allowed
- File too large (>10MB)
- Check backend `/upload-resume` endpoint

### No Results:
- Backend AI model not working properly
- Database queries failing
- Check backend logs

### Styling Issues:
- Tailwind CSS not compiled
- Solution: `npm run dev` should handle it automatically

---

## How to Add New Features

### Add New Page:
1. Create file in `pages/` folder
2. Add import in `App.jsx`
3. Add route: `<Route path="/new-page" element={<NewPage />} />`
4. Add link in `Navbar.jsx`

### Add New API Call:
1. Add function in `services/api.js`
2. Document what backend should return
3. Use in component: `const response = await newApiFunction()`

### Add New Component:
1. Create file in `components/` folder
2. Create reusable component
3. Import and use in any page

---

## Important Notes for Team Members

### For Backend Team:
- ✅ Resume file upload must work (PDF/DOCX)
- ✅ Extract skills using Python/OCR/NLP
- ✅ Implement AI matching algorithm
- ✅ Store data in database
- ✅ Return proper JSON responses

### For Database Team:
- ✅ Store user resumes
- ✅ Store extracted skills per user
- ✅ Store job descriptions
- ✅ Store courses and learning resources
- ✅ Create relationships between skills and courses

### For Frontend (This Codebase):
- ✅ All components created
- ✅ All pages created
- ✅ API functions ready to use
- ✅ Routing complete
- ✅ Styling done
- ✅ Just need backend working!

---

## Testing the Application

1. Start backend server: `python app.py` or node equivalent
2. Start frontend: `npm run dev`
3. Open http://localhost:5173
4. Follow user journey:
   - Upload resume → Check if backend processes it
   - Enter job description → Check if matching works
   - View results → Check if data displays correctly

---

## Common Questions

**Q: Why is the page not loading?**  
A: Check if backend is running and database is connected

**Q: Can I customize colors?**  
A: Yes, edit `tailwind.config.js` or change className colors

**Q: How do I disable animations?**  
A: Remove `<Canvas>` components from pages

**Q: Can I add more pages?**  
A: Yes, follow "Add New Page" section above

---

**Last Updated:** March 5, 2026  
**Project:** Hacknovate 7.0 - Resume-Job Matcher
