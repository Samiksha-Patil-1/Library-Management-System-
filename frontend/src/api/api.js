import axios from 'axios';

// Base API URL; in production uses same-domain /api, in development defaults to http://localhost:5000/api
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to requests if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('academic_hub_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me')
};

export const booksAPI = {
  getAll: (params) => api.get('/books', { params }),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`)
};

export const studentsAPI = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data)
};

export const transactionsAPI = {
  getAll: (params) => api.get('/transactions', { params }),
  issue: (data) => api.post('/transactions/issue', data),
  returnBook: (id, data) => api.post(`/transactions/${id}/return`, data),
  renewBook: (id, data) => api.post(`/transactions/${id}/renew`, data)
};

export const reportsAPI = {
  getStats: () => api.get('/reports/stats'),
  getAnalytics: () => api.get('/reports/analytics'),
  exportCSV: () => `${API_BASE_URL}/reports/export-csv`
};

export default api;
