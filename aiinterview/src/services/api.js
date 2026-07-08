import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Helper to set auth token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// --- Auth ---
export const verifyAuth = () => api.post('/auth/verify');

// --- Interview ---
export const startInterview = (role) => api.post('/interviews/start', { role });
export const submitAnswer = (interviewId, questionId, answer) => 
  api.post(`/interviews/${interviewId}/answer`, { questionId, answer });
export const finishInterview = (interviewId, duration) => 
  api.post(`/interviews/${interviewId}/finish`, { duration });

// --- Dashboard ---
export const getDashboardStats = () => api.get('/dashboard/stats');
export const getRecentInterviews = () => api.get('/dashboard/recent');

// --- History ---
export const getHistory = (page = 1, limit = 10) => 
  api.get(`/history?page=${page}&limit=${limit}`);
export const getInterviewResult = (interviewId) => 
  api.get(`/history/${interviewId}/result`);

export default api;
