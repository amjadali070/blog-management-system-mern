import axios from 'axios';

// Create axios instance
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
    timeout: 10000,
});

// Request interceptor to automatically add authentication token
// Runs before every request to attach JWT token if available
api.interceptors.request.use(
    (config) => {
        // Automatically attach auth token to all requests if available
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

// Response interceptor for global error handling and token management
// Handles common HTTP errors and automatic logout on authentication failure
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Global error handling for authentication failures
        if (error.response?.status === 401) {
            // Unauthorized - token expired or invalid, clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');

            // Redirect to login only if not already on login page (prevent infinite redirects)
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
