// Axios is HTTP client library for making requests to backend server
import axios from 'axios';

// Backend server URL - Update this if backend runs on different port/address
// Example: 'http://192.168.1.100:5000' for network requests
const API_BASE_URL = 'http://localhost:5000';

// Create axios instance with base configuration
// Allows us to make requests without repeating base URL in each call
const api = axios.create({
  baseURL: API_BASE_URL,
});

// ========== API COMMUNICATION FUNCTIONS ==========
// These functions connect frontend to backend server
// Backend team: Implement corresponding endpoints
// Database team: Create tables/schemas for storing returned data

/**
 * Upload Resume to Backend Server
 * Called from: UploadResume page when user uploads file
 * Processing: Backend extracts text, parses skills using AI
 * Storage: Database stores resume file and extracted skills
 * @param {File} file - User's resume file (accepts PDF or DOCX)
 * @returns {Promise} - Extracted resume data (skills, experience, etc)
 */
export const uploadResume = async (file) => {
  // FormData is required for file uploads (binary data transmission)
  const formData = new FormData();
  formData.append('resume', file);
  
  // POST request to backend - sends file to /upload-resume endpoint
  return await api.post('/upload-resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Tells server we are sending file
    },
  });
};

/**
 * Calculate Match Score Between Resume and Job Description
 * Called from: JobDescription page after user enters job description
 * Processing: AI model compares resume skills with job requirements
 * Returns: Match percentage (0-100%) and skill analysis
 * @param {string} jobDescription - Full job description text from user input
 * @returns {Promise} - Match score, matched skills, missing skills array
 */
export const matchJobs = async (jobDescription) => {
  return await api.post('/match-jobs', { jobDescription });
};


/**
 * Get Recommended Learning Resources
 * Called from: LearningResources page
 * Processing: Suggests courses, tutorials for skill development
 * Database: Queries course database or external learning APIs
 * @returns {Promise} - Recommended courses, links, free resources
 */
export const getLearningResources = async () => {
  return await api.get('/learning-resources');
};

/**
 * Send OTP for Password Reset
 * @param {string} email - User's email
 */
export const sendOtp = async (email) => {
  return await api.post('/auth/send-otp', { email });
};

/**
 * Verify OTP and set New Password
 * @param {string} email - User's email
 * @param {string} otp - The 6-digit OTP
 * @param {string} newPassword - The new password
 */
export const verifyOtp = async (email, otp, newPassword) => {
  return await api.post('/auth/verify-otp', { email, otp, newPassword });
};

// Export default api instance for use in other files
export default api;