import axios from 'axios';
import { toast } from 'react-hot-toast';
import { navigateTo, replaceRoute } from './navigationService';

/**
 * Base API configuration for the application
 */
const baseURL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:8222/api';

const API = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for handling httpOnly cookies
});

// Token refresh management
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    console.log(`📋 PROCESSING QUEUE:`, {
        error: !!error,
        token: token ? `${token.substring(0, 20)}...` : 'none',
        queueLength: failedQueue.length
    });

    failedQueue.forEach((prom, index) => {
        console.log(`📝 Processing queued request #${index + 1}`);
        if (error) {
            console.log(`❌ Rejecting request #${index + 1}`);
            prom.reject(error);
        } else {
            console.log(`✅ Resolving request #${index + 1} with new token`);
            prom.resolve(token);
        }
    });

    failedQueue = [];
    console.log('🧹 QUEUE CLEARED');
};

const refreshAccessToken = async () => {
    console.log('🔄 REFRESH ACCESS TOKEN - Starting...');

    try {
        console.log('📡 Calling refresh endpoint...');
        const response = await axios.post('/v1/auth/refresh', {}, {
            baseURL: baseURL,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ REFRESH RESPONSE RECEIVED:', {
            status: response.status,
            data: response.data
        });

        // Extract access token - adjust path based on your backend response structure
        const { accessToken } = response.data.result || response.data;
        console.log('🔑 NEW ACCESS TOKEN EXTRACTED:', {
            tokenPreview: accessToken ? `${accessToken.substring(0, 20)}...` : 'none',
            tokenLength: accessToken?.length
        });

        localStorage.setItem('accessToken', accessToken);
        console.log('💾 NEW TOKEN STORED IN LOCALSTORAGE');

        return accessToken;
    } catch (error) {
        console.log('❌ REFRESH FAILED:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });

        console.log('🧹 CLEARING TOKEN FROM LOCALSTORAGE');
        localStorage.removeItem('accessToken');
        
        // Show error toast
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', {
            duration: 4000,
            id: 'token-refresh-failed'
        });
        
        console.log('🧭 NAVIGATING TO LOGIN (preserving logs)');
        replaceRoute('/login');
        throw error;
    }
};

// REQUEST INTERCEPTOR - Add Authorization header
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');

        console.log('🚀 REQUEST INTERCEPTOR:', {
            url: config.url,
            method: config.method,
            hasToken: !!token,
            tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
        });

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('✅ Authorization header added');
        } else {
            console.log('❌ No token found - request sent without auth');
        }

        return config;
    },
    (error) => {
        console.log('❌ REQUEST INTERCEPTOR ERROR:', error);
        return Promise.reject(error);
    }
);

// RESPONSE INTERCEPTOR - Handle token refresh
API.interceptors.response.use(
    (response) => {
        console.log('✅ RESPONSE SUCCESS:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    async (error) => {
        console.log('🔥 RESPONSE ERROR INTERCEPTOR TRIGGERED:', {
            url: error.config?.url,
            status: error.response?.status,
            statusText: error.response?.statusText,
            hasResponse: !!error.response
        });

        const originalRequest = error.config;

        if (error.response) {
            const { status } = error.response;
            console.log(`📊 HTTP Status: ${status}`);

            // CHECK: Is this an authentication endpoint?
            const isAuthEndpoint = originalRequest.url?.includes('/auth/');
            console.log('🔍 Is auth endpoint?', isAuthEndpoint);

            // Handle 401 Unauthorized
            if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
                console.log('🔄 401 DETECTED - Determining cause...');
                
                // Check if this is a malformed token vs expired token
                const currentToken = localStorage.getItem('accessToken');
                const errorMessage = error.response?.data?.error || '';
                
                console.log('🔍 401 Analysis:', { 
                    hasToken: !!currentToken, 
                    errorMessage 
                });
                
                // If explicitly malformed token, go to unauthenticated (punishment!)
                if (errorMessage.includes('Malformed') || errorMessage.includes('Invalid')) {
                    console.log('💀 MALFORMED TOKEN DETECTED - Punishment time!');
                    localStorage.removeItem('accessToken');
                    
                    toast.error('Token không hợp lệ. Vui lòng đăng nhập lại.', {
                        duration: 5000,
                        id: 'malformed-token'
                    });
                    
                    navigateTo('/unauthenticated');
                    return Promise.reject(error);
                }
                
                console.log('🔄 EXPIRED TOKEN - Starting refresh logic');

                // Check if refresh is already in progress
                if (isRefreshing) {
                    console.log('⏳ REFRESH IN PROGRESS - Queueing request');
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                        console.log(`📝 Request queued. Queue length: ${failedQueue.length}`);
                    }).then(token => {
                        console.log('🔄 RETRYING QUEUED REQUEST with new token');
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return API(originalRequest);
                    }).catch(err => {
                        console.log('❌ QUEUED REQUEST FAILED:', err);
                        return Promise.reject(err);
                    });
                }

                console.log('🔒 SETTING REFRESH FLAG - First request to trigger refresh');
                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    console.log('🔄 CALLING REFRESH TOKEN...');
                    const newToken = await refreshAccessToken();
                    console.log('✅ REFRESH SUCCESS - New token received');
                    
                    // Show success toast
                    toast.success('Phiên đăng nhập đã được gia hạn tự động', {
                        duration: 3000,
                        id: 'token-refresh-success'
                    });

                    console.log(`📤 PROCESSING QUEUED REQUESTS (${failedQueue.length} requests)`);
                    processQueue(null, newToken);

                    console.log('🔄 RETRYING ORIGINAL REQUEST with new token');
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return API(originalRequest);

                } catch (refreshError) {
                    console.log('❌ REFRESH FAILED:', refreshError);
                    console.log('📤 REJECTING ALL QUEUED REQUESTS');
                    processQueue(refreshError, null);
                    return Promise.reject(refreshError);
                } finally {
                    console.log('🏁 CLEARING REFRESH FLAG');
                    isRefreshing = false;
                }
            }

            // Handle 403 Forbidden - Permission issues only (valid token, wrong role)
            if (status === 403) {
                console.log('🚫 403 FORBIDDEN - Insufficient permissions (valid token, wrong role)');
                
                toast.error('Bạn không có quyền truy cập tài nguyên này.', {
                    duration: 4000,
                    id: 'insufficient-permissions'
                });

                console.log('🧭 NAVIGATING TO UNAUTHORIZED PAGE (preserving logs)');
                navigateTo('/unauthorized');
                return Promise.reject(error);
            }
        }

        console.log('❌ PASSING ERROR THROUGH:', error);
        return Promise.reject(error);
    }
);

export default API;