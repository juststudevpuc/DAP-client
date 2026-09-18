import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

// 1. Configure the base connection
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
        ? `${import.meta.env.VITE_API_BASE_URL}/api`
        : "http://localhost:8000/api",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// 2. Request Interceptor: Automatically attach the token
apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 3. Response Interceptor: Catch unauthorized errors instantly
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token is invalid or expired, clear it out
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

// 4. Export reusable functions for your components to call
export const apiService = {

    // --- Auth Endpoints ---
    login: async (credentials) => {
        const response = await apiClient.post('/login', credentials);
        return response.data;
    },

    register: async (userData) => {
        const response = await apiClient.post('/register', userData);
        return response.data;
    },

    logout: async () => {
        const response = await apiClient.post('/logout');
        return response.data;
    },

    // --- Weekly Plan Endpoints ---
    getCurrentWeeklyPlan: async () => {
        const response = await apiClient.get('/weekly-plans/current');
        return response.data.data;
    },

    getWeeklyPlans: async (params) => {
        const response = await apiClient.get('/weekly-plans', { params });
        return response.data.data || response.data;
    },

    getWeeklyPlan: async (planId) => {
        const response = await apiClient.get(`/weekly-plans/${planId}`);
        return response.data.data;
    },

    createWeeklyPlan: async (data) => {
        const response = await apiClient.post('/weekly-plans', data);
        return response.data.data || response.data;
    },

    updateDailyMetric: async (metricId, updateData) => {
        const response = await apiClient.patch(`/daily-metrics/${metricId}`, updateData);
        return response.data;
    },

    updateWeeklyPlan: async (planId, updateData) => {
        const response = await apiClient.patch(`/weekly-plans/${planId}`, updateData);
        return response.data;
    },

    deleteWeeklyPlan: async (id) => {
        const response = await apiClient.delete(`/weekly-plans/${id}`);
        return response.data;
    },

    completeWeeklyPlan: async (planId, summaryData) => {
        const response = await apiClient.post(`/weekly-plans/${planId}/complete`, summaryData);
        return response.data;
    },

    // --- Admin & Team Overview Endpoints ---
    getMemberPlan: async (params) => {
        const response = await apiClient.get('/admin/member-plan', { params });
        return response.data;
    },

    getTeamOverview: async (params) => {
        const response = await apiClient.get('/admin/team-reports', { params });
        return response.data.data || response.data;
    },

    getCompanySummary: async (params) => {
        const response = await apiClient.get('/admin/company-summary', { params });
        return response.data.data || response.data;
    },

    // --- Super Admin Endpoints ---
    getAllUsers: async () => {
        const response = await apiClient.get('/admin/users');
        return response.data.data || response.data;
    },

    updateUserRole: async (userId, role) => {
        const response = await apiClient.patch(`/super-admin/users/${userId}/role`, { role });
        return response.data;
    },

    sendDailyImagesToTelegram: async (formData) => {
        const response = await apiClient.post('/telegram/send-daily-images', formData, {
            headers: {
                'Content-Type': undefined,
            },
        });
        return response.data;
    },
    sendWeeklyImagesToTelegram: async (formData) => {
        const response = await apiClient.post('/telegram/send-weekly-images', formData, {
            headers: {
                'Content-Type': undefined,
            },
        });
        return response.data;
    },

    deleteUser: async (userId) => {
        const response = await apiClient.delete(`/super-admin/users/${userId}`);
        return response.data;
    }

};

export default apiClient;