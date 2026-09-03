import axios from 'axios';

// 1. Configure the base connection
const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// 2. Export reusable functions for your components to call
export const apiService = {
    
    // Fetch a single weekly plan with its nested days
    getWeeklyPlan: async (planId) => {
        const response = await apiClient.get(`/weekly-plans/${planId}`);
        return response.data.data; 
    },

    // Update a single day's row (PATCH)
    updateDailyMetric: async (metricId, updateData) => {
        const response = await apiClient.patch(`/daily-metrics/${metricId}`, updateData);
        return response.data;
    },

    // Update the weekly plan (for the reflection footer)
    updateWeeklyPlan: async (planId, updateData) => {
        const response = await apiClient.patch(`/weekly-plans/${planId}`, updateData);
        return response.data;
    }
    
};