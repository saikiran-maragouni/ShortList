import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
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

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
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
    getProfile: () => api.get('/auth/profile'),
};

// Public Jobs API
export const publicJobsAPI = {
    getJobs: (params) => api.get('/public/jobs', { params }),
    getJobById: (id) => api.get(`/public/jobs/${id}`),
};

// Candidate Applications API
export const applicationsAPI = {
    apply: (jobId, formData) => {
        return api.post(`/applications/${jobId}/apply`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    getMyApplications: (params) => api.get('/applications/my', { params }),
    getApplicationById: (id) => api.get(`/applications/${id}`),
};

// Recruiter Jobs API
export const recruiterJobsAPI = {
    createJob: (data) => api.post('/jobs', data),
    getMyJobs: () => api.get('/jobs/my'),
    getJobById: (id) => api.get(`/jobs/${id}`),
    updateJob: (id, data) => api.put(`/jobs/${id}`, data),
    closeJob: (id) => api.put(`/jobs/${id}/close`),
    deleteJob: (id) => api.delete(`/jobs/${id}`),
};

// Recruiter Applications API
export const recruiterApplicationsAPI = {
    getApplicationsForJob: (jobId, params) =>
        api.get(`/recruiter/applications/job/${jobId}`, { params }),
    updateApplicationStatus: (applicationId, status) =>
        api.put(`/recruiter/applications/${applicationId}/status`, { status }),
};

export const profileAPI = {
    getCompanyProfile: () => api.get('/profile/company'),
    updateCompanyProfile: (data) => api.put('/profile/company', data),
    getCandidateProfile: () => api.get('/profile/candidate'),
    updateCandidateProfile: (data) => api.put('/profile/candidate', data),
};

export default api;
