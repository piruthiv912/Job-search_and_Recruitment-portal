import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');

    if (error.response?.status === 401 && !isAuthRoute) {
      // Handle unauthorized (session expired) for non-auth routes
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout')
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAllUsers: () => api.get('/users/all'),
  deleteUser: (id) => api.delete(`/users/${id}`)
};


// Job API
export const jobAPI = {
  getAllJobs: () => api.get('/jobs'),
  getJobById: (id) => api.get(`/jobs/${id}`),
  getRecruiterJobs: () => api.get('/jobs/recruiter/my-jobs'),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`)
};

// Company API
export const companyAPI = {
  getCompanies: () => api.get('/companies'),
  getCompanyById: (id) => api.get(`/companies/${id}`),
  getMyCompany: () => api.get('/companies/my-company'),
  createCompany: (data) => api.post('/companies', data)
};


// Application API
export const applicationAPI = {
  applyForJob: (data) => api.post('/applications/apply', data),
  getApplications: () => api.get('/applications'),
  updateStatus: (id, status, notes) => api.put(`/applications/${id}`, { status, notes })
};

export const activityAPI = {
  getActivities: () => api.get('/activities')
};

export default api;

