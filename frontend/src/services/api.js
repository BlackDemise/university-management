import axios from 'axios';

/**
 * Base API configuration for the application
 * Creates an axios instance with predefined configuration
 */
const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL || 'http://localhost:8222/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for handling cookies and CSRF tokens
});

// Add a request interceptor to add the auth token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for global error handling
API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle global errors here (e.g., 401 Unauthorized, 403 Forbidden)
        if (error.response) {
            const { status } = error.response;
            
            if (status === 401) {
                // Handle unauthorized access (e.g., redirect to login)
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
            }
            
            if (status === 403) {
                // Handle forbidden access
                window.location.href = '/unauthorized';
            }
        }
        
        return Promise.reject(error);
    }
);

export default API; 