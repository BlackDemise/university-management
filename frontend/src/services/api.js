import axios from 'axios';
import { authManager } from './AuthManager.js';

/**
 * Simplified API configuration for the application
 * Now delegates all authentication concerns to AuthManager
 */
const baseURL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:8222/api';

const API = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for handling httpOnly cookies
});

console.log('🔧 API CLIENT: Initialized with baseURL:', baseURL);

// REQUEST INTERCEPTOR - Simple header addition
API.interceptors.request.use(
    (config) => {
        const token = authManager.getToken();

        console.log('🚀 API REQUEST:', {
            url: config.url,
            method: config.method.toUpperCase(),
            hasToken: !!token
        });

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        console.error('❌ API REQUEST INTERCEPTOR ERROR:', error);
        return Promise.reject(error);
    }
);

// RESPONSE INTERCEPTOR - Delegate auth errors to AuthManager
API.interceptors.response.use(
    (response) => {
        console.log('✅ API RESPONSE:', {
            url: response.config.url,
            status: response.status
        });
        return response;
    },
    async (error) => {
        console.log('🔥 API ERROR:', {
            url: error.config?.url,
            status: error.response?.status,
            statusText: error.response?.statusText
        });

        const originalRequest = error.config;

        // Delegate auth error handling to AuthManager
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.log('🎯 API INTERCEPTOR: Delegating auth error to AuthManager');
            
            try {
                const result = await authManager.handleApiError(error, originalRequest);
                
                if (result.shouldRetry) {
                    console.log('🔄 API INTERCEPTOR: AuthManager says retry, attempting request again');
                    return API(originalRequest);
                } else {
                    console.log('❌ API INTERCEPTOR: AuthManager says do not retry');
                    return Promise.reject(error);
                }
            } catch (authError) {
                console.error('❌ API INTERCEPTOR: AuthManager error handling failed:', authError);
                return Promise.reject(error);
            }
        }

        // For non-auth errors, pass through normally
        console.log('📤 API INTERCEPTOR: Non-auth error, passing through');
        return Promise.reject(error);
    }
);

/**
 * Export the configured API client
 * 
 * This API client is now much simpler and more reliable:
 * - Request interceptor: Just adds Authorization header
 * - Response interceptor: Delegates auth errors to AuthManager
 * - No complex refresh logic here - all handled by AuthManager
 * - No navigation dependencies - AuthManager handles routing
 * - No race conditions - single source of truth
 */
export default API;