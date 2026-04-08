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

// Request Interceptor to add JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
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

// Applications API

/**
 * Fetch all job applications for the user
 * @returns {Promise<Array>} - List of job applications
 */
export async function getApplications() {
  const response = await api.get('/api/applications');
  return response.data;
}

/**
 * Update the status of a job application
 * @param {string} id - The application ID
 * @param {string} status - New status (Applied, Failed, InterviewScheduled, etc)
 * @returns {Promise<Object>} - Updated application
 */
export async function updateApplicationStatus(id, status) {
  const response = await api.patch(`/api/applications/${id}/status`, { status });
  return response.data;
}

/**
 * Get aggregated application statistics
 * @returns {Promise<Object>} - Stats (total, thisWeek, avgScore, interviews)
 */
export async function getApplicationStats() {
  const apps = await getApplications();
  
  const total = apps.length;
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const thisWeek = apps.filter(app => new Date(app.appliedAt) > oneWeekAgo).length;
  
  const totalScore = apps.reduce((sum, app) => sum + (app.matchScore || 0), 0);
  const avgScore = total > 0 ? (totalScore / total).toFixed(1) : 0;
  
  const interviewsScheduled = apps.filter(app => app.status === 'InterviewScheduled').length;
  
  return {
    total,
    thisWeek,
    avgScore,
    interviewsScheduled
  };
}

// Export default api instance for use in other files
export default api;