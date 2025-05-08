import axios from 'axios';

const API_URL = 'http://localhost:8083/api/meals';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// API service functions
export const mealService = {
    // Get all meals
    getAllMeals: async () => {
        try {
            const response = await api.get('/');
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw new Error(error.response?.data || 'Failed to fetch meals');
        }
    },

    // Create new meal
    createMeal: async (mealData) => {
        try {
            const response = await api.post('/', mealData);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw new Error(error.response?.data || 'Failed to create meal');
        }
    },

    updateMeal: async (mealId, mealData) => {
        try {
            const response = await api.put(`/${mealId}`, mealData);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw new Error(error.response?.data || 'Failed to update meal');
        }
    },

    deleteMeal: async (mealId) => {
        try {
            await api.delete(`/${mealId}`);
            return true;
        } catch (error) {
            console.error('API Error:', error);
            throw new Error(error.response?.data || 'Failed to delete meal');
        }
    }
}; 