// Axios is HTTP client library for making requests to backend server
import axios from 'axios';

// Backend server URL - Update this if backend runs on different port/address
// THE BACKEND RUNS ON PORT 5000 WITH /api prefix.
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with base configuration
// Allows us to make requests without repeating base URL in each call
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include the JWT token in all outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear stale tokens (e.g. after database drop) and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

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
  formData.append('file', file);

  // POST request to backend - sends file to /resume/upload endpoint
  return await api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Tells server we are sending file
    },
  });
};

/**
 * Get Recommended Learning Resources for a skill
 */
export const getResourcesForSkill = async (skill) => {
  if (skill) {
    return await api.get(`/resources/${skill}`);
  }
  return await api.get('/resources/supported-skills');
};


/**
 * Get personalized learning plan based on analysis
 * @param {string} analysisId - ID of the analysis
 */
export const getLearningPlan = async (analysisId) => {
  return await api.get(`/learning-plan/${analysisId}`);
};

/**
 * Update the user's progress on a learning item
 * @param {Object} data - { analysisId, skillName, status, percentComplete }
 */
export const updateProgress = async (data) => {
  return await api.post('/progress/update', data);
};

/**
 * Authenticate User (Login)
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - Auth token and user details
 */
export const loginUser = async (email, password) => {
  return await api.post('/auth/login', { email, password });
};

/**
 * Register New User
 * @param {Object} userData - User full name, email, and password
 * @returns {Promise} - Auth token and user details
 */
export const registerUser = async (userData) => {
  return await api.post('/auth/register', userData);
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

// ========== ANALYSIS FUNCTIONS ==========

/**
 * Run Semantic Analysis
 * @param {Object} payload - { resumeId }
 */
export const runAnalysis = async (payload) => {
  return await api.post('/analysis/run', payload);
};

/**
 * Get Analysis Details
 * @param {string} id - Analysis ID
 */
export const getAnalysis = async (id) => {
  return await api.get(`/analysis/${id}`);
};

/**
 * Get Analysis History
 * @returns {Promise} - List of user's past semantic matching analyses
 */
export const getAnalysisHistory = async () => {
  return await api.get('/analysis/history');
};

/**
 * Delete Analysis Record
 * @param {string} id - Analysis ID to delete
 */
export const deleteAnalysis = async (id) => {
  return await api.delete(`/analysis/${id}`);
};

/**
 * Get Dashboard Summary
 * @returns {Promise} - Aggregated dashboard data including user profile and latest analysis
 */
export const getDashboardSummary = async () => {
  return await api.get('/dashboard/summary');
};

/**
 * Search Jobs (Real-time Adzuna data)
 */
export const searchJobs = async (query, category) => {
  return await api.get('/jobs/search', { params: { q: query, category } });
};

/**
 * Get Featured Companies
 */
export const getCompanies = async (category) => {
  return await api.get('/companies', { params: { category } });
};

/**
 * Get Company Details
 */
export const getCompanyDetails = async (name) => {
  return await api.get(`/companies/${name}`);
};

// Export default api instance for use in other files
export default api;