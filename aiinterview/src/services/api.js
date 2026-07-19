import axios from 'axios';
import { auth } from '../firebase';

// Spring Boot backend URL from .env
const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

// Automatically attach Firebase ID token to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Helper to manually set auth token (legacy support)
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
export const startInterview = (topic) => api.post('/interviews/start', { topic });
export const submitAnswer = (interviewId, topic, questionText, answer, currentDifficulty, isLastQuestion) =>
  api.post(`/interviews/${interviewId}/answer`, { 
    topic, 
    question: questionText, 
    answer, 
    currentDifficulty, 
    isLastQuestion 
  });
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
