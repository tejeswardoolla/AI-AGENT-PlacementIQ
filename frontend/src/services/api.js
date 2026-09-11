import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

api.interceptors.response.use(
  res => res.data,
  err => {
    console.error('API Error:', err.message);
    throw err;
  }
);

export const studentsApi = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  getMatches: (id) => api.get(`/students/${id}/matches`),
};

export const companiesApi = {
  getAll: () => api.get('/companies'),
  getById: (id) => api.get(`/companies/${id}`),
};

export const jobsApi = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
};

export const analyticsApi = {
  getOverview: () => api.get('/analytics/overview'),
  getDepartments: () => api.get('/analytics/departments'),
  getTrends: () => api.get('/analytics/trends'),
  getAll: () => api.get('/analytics'),
};

export const skillsApi = {
  getAll: () => api.get('/skills'),
  getDemand: () => api.get('/skills/demand'),
  getGaps: () => api.get('/skills/gaps'),
};

export const atRiskApi = {
  getAll: (level) => api.get('/at-risk', { params: level ? { level } : {} }),
};

export const recruitersApi = {
  getAll: (priority) => api.get('/recruiters', { params: priority ? { priority } : {} }),
};

export const agentApi = {
  ask: (question) => api.post('/agent/ask', { question }),
  getPriorities: () => api.get('/agent/priorities'),
};

export const applicationsApi = {
  getAll: (studentId) => api.get('/applications', { params: studentId ? { studentId } : {} }),
  getGaps: () => api.get('/applications/gaps'),
};

export const healthApi = {
  check: () => api.get('/health'),
};

export default api;
