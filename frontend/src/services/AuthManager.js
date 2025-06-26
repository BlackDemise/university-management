import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';
import { navigationManager } from './NavigationManager.js';

/**
 * AuthManager - Single source of truth for authentication state and logic
 * 
 * This service centralizes all authentication concerns:
 * - Token validation and refresh
 * - Auth state management
 * - Event-driven communication with other layers
 * - Multi-tab synchronization
 * - Error handling for all 4 auth scenarios
 */
class AuthManager {
    constructor() {
        // Core authentication state
        this.state = {
            isAuthenticated: false,
            user: null,
            userRole: null,
            isRefreshing: false,
            isInitialized: false
        };

        // Event system for layer communication
        this.listeners = [];
        
        // Token refresh management
        this.refreshPromise = null;
        this.failedQueue = [];

        // Storage key constants
        this.ACCESS_TOKEN_KEY = 'accessToken';
        
        // Bind methods to preserve context
        this.handleStorageChange = this.handleStorageChange.bind(this);
        
        // Listen to storage events for multi-tab sync
        window.addEventListener('storage', this.handleStorageChange);
        
        console.log('🔐 AUTH MANAGER: Initialized');
        
        // Initialize authentication state
        this.initializeAuth();
    }

    // =========================================================================
    // EVENT SYSTEM - Communication with other layers
    // =========================================================================

    /**
     * Subscribe to AuthManager events
     * @param {Function} listener - Event listener function
     * @returns {Function} Unsubscribe function
     */
    subscribe(listener) {
        this.listeners.push(listener);
        console.log(`📢 AUTH MANAGER: New subscriber added (${this.listeners.length} total)`);
        
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
            console.log(`📢 AUTH MANAGER: Subscriber removed (${this.listeners.length} remaining)`);
        };
    }

    /**
     * Emit events to all subscribers
     * @param {string} event - Event type
     * @param {*} data - Event data
     */
    emit(event, data) {
        console.log(`📡 AUTH MANAGER: Emitting ${event}`, data ? { dataType: typeof data } : 'no data');
        this.listeners.forEach(listener => {
            try {
                listener(event, data);
            } catch (error) {
                console.error(`❌ AUTH MANAGER: Error in event listener for ${event}:`, error);
            }
        });
    }

    // =========================================================================
    // TOKEN MANAGEMENT - Single source of truth
    // =========================================================================

    /**
     * Get access token from localStorage
     * @returns {string|null} Token or null
     */
    getToken() {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    /**
     * Set access token in localStorage
     * @param {string} token - JWT access token
     */
    setToken(token) {
        if (token) {
            localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
            console.log('💾 AUTH MANAGER: Token stored in localStorage');
        } else {
            console.warn('⚠️ AUTH MANAGER: Attempted to set null/undefined token');
        }
    }

    /**
     * Remove access token from localStorage
     */
    removeToken() {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        console.log('🧹 AUTH MANAGER: Token removed from localStorage');
    }

    /**
     * Check if token format is valid (can be parsed)
     * @param {string} token - Token to validate
     * @returns {boolean} True if token format is valid
     */
    isTokenFormatValid(token = null) {
        const tokenToCheck = token || this.getToken();
        
        if (!tokenToCheck) {
            return false;
        }

        try {
            // Check if token has proper JWT structure (3 parts separated by dots)
            const parts = tokenToCheck.split('.');
            if (parts.length !== 3) {
                console.log('❌ AUTH MANAGER: Token format invalid - wrong number of parts');
                return false;
            }

            // Try to decode - this will fail for malformed tokens
            const decoded = jwtDecode(tokenToCheck);
            console.log('✅ AUTH MANAGER: Token format is valid');
            return true;
        } catch (error) {
            console.log('❌ AUTH MANAGER: Token format validation failed:', error.message);
            return false;
        }
    }

    /**
     * Validate JWT token (check expiration and format)
     * @param {string} token - Token to validate (optional, uses stored token if not provided)
     * @returns {boolean} True if token is valid
     */
    isTokenValid(token = null) {
        const tokenToCheck = token || this.getToken();
        
        if (!tokenToCheck) {
            console.log('🔍 AUTH MANAGER: No token to validate');
            return false;
        }

        // First check format
        if (!this.isTokenFormatValid(tokenToCheck)) {
            return false;
        }

        try {
            const decoded = jwtDecode(tokenToCheck);
            const currentTime = Date.now() / 1000;
            const isValid = decoded.exp > currentTime;
            
            console.log('🔍 AUTH MANAGER: Token validation result:', {
                isValid,
                expiresAt: new Date(decoded.exp * 1000),
                timeUntilExpiry: decoded.exp - currentTime
            });
            
            return isValid;
        } catch (error) {
            console.log('❌ AUTH MANAGER: Token validation failed (malformed):', error.message);
            return false;
        }
    }

    /**
     * Extract user information from JWT token
     * @param {string} token - Token to decode (optional, uses stored token if not provided)
     * @returns {Object|null} User info or null
     */
    getUserFromToken(token = null) {
        const tokenToCheck = token || this.getToken();
        
        if (!tokenToCheck) return null;

        try {
            const decoded = jwtDecode(tokenToCheck);
            return {
                username: decoded.sub,
                role: decoded.role,
                email: decoded.email,
                fullName: decoded.fullName || decoded.name
            };
        } catch (error) {
            console.error('❌ AUTH MANAGER: Failed to extract user from token:', error);
            return null;
        }
    }

    // =========================================================================
    // AUTHENTICATION STATE MANAGEMENT
    // =========================================================================

    /**
     * Initialize authentication state from stored token
     */
    async initializeAuth() {
        console.log('🚀 AUTH MANAGER: Initializing authentication state...');

        try {
            const token = this.getToken();

            if (!token) {
                console.log('📭 AUTH MANAGER: No stored token found');
                this.setUnauthenticatedState();
                return;
            }

            if (!this.isTokenFormatValid(token)) {
                console.log('❌ AUTH MANAGER: Invalid token format, clearing state');
                this.removeToken();
                this.setUnauthenticatedState();
                return;
            }

            // 🔧 ADD SERVER VALIDATION HERE
            try {
                // Make a lightweight API call to verify token
                const API = (await import('./api.js')).default;
                const response = await API.post('/v1/auth/introspect'); // Add this endpoint

                // If successful, token is valid
                const user = this.getUserFromToken(token);
                this.setAuthenticatedState(user);
            } catch (verifyError) {
                if (verifyError.response?.status === 401) {
                    // Try to refresh token
                    try {
                        await this.refreshToken();
                        const user = this.getUserFromToken(this.getToken());
                        this.setAuthenticatedState(user);
                    } catch (refreshError) {
                        // Both verify and refresh failed - logout
                        this.removeToken();
                        this.setUnauthenticatedState();
                    }
                } else {
                    // Network error - assume token is valid for now
                    const user = this.getUserFromToken(token);
                    this.setAuthenticatedState(user);
                }
            }

        } catch (error) {
            console.error('❌ AUTH MANAGER: Error during initialization:', error);
            this.setUnauthenticatedState();
        } finally {
            this.state.isInitialized = true;
            this.emit('AUTH_INITIALIZED', this.state);
            console.log('🏁 AUTH MANAGER: Initialization complete');
        }
    }

    /**
     * Set authenticated state
     * @param {Object} user - User information
     */
    setAuthenticatedState(user) {
        this.state = {
            ...this.state,
            isAuthenticated: true,
            user: user,
            userRole: user?.role || null
        };
        
        console.log('✅ AUTH MANAGER: State set to authenticated', { 
            role: this.state.userRole,
            username: this.state.user?.username 
        });
        
        this.emit('AUTH_STATE_CHANGED', this.state);
    }

    /**
     * Set unauthenticated state
     */
    setUnauthenticatedState() {
        this.state = {
            ...this.state,
            isAuthenticated: false,
            user: null,
            userRole: null
        };
        
        console.log('❌ AUTH MANAGER: State set to unauthenticated');
        this.emit('AUTH_STATE_CHANGED', this.state);
    }

    // =========================================================================
    // PUBLIC AUTHENTICATION METHODS
    // =========================================================================

    /**
     * Login user with JWT token
     * @param {string} token - JWT access token
     * @returns {boolean} Success status
     */
    async login(token) {
        console.log('🔐 AUTH MANAGER: Processing login...');
        
        if (!token) {
            console.error('❌ AUTH MANAGER: Login attempted with no token');
            return false;
        }

        if (!this.isTokenValid(token)) {
            console.error('❌ AUTH MANAGER: Login attempted with invalid token');
            toast.error('Token không hợp lệ');
            return false;
        }

        try {
            // Store token and extract user info
            this.setToken(token);
            const user = this.getUserFromToken(token);
            
            if (!user) {
                console.error('❌ AUTH MANAGER: Failed to extract user from token');
                this.removeToken();
                return false;
            }

            // Update state
            this.setAuthenticatedState(user);
            
            toast.success(`Chào mừng, ${user.fullName || user.username}!`);
            console.log('✅ AUTH MANAGER: Login successful');
            
            return true;
        } catch (error) {
            console.error('❌ AUTH MANAGER: Login error:', error);
            this.removeToken();
            toast.error('Đăng nhập thất bại');
            return false;
        }
    }

    /**
     * Logout user
     * @param {boolean} showToast - Whether to show logout toast
     */
    async logout(showToast = true) {
        console.log('🚪 AUTH MANAGER: Processing logout...');
        
        try {
            // Try to call logout API (fire and forget)
            const API = (await import('./api.js')).default;
            await API.post('/v1/auth/logout').catch(err => {
                console.log('⚠️ AUTH MANAGER: Logout API call failed (continuing anyway):', err.message);
            });
        } catch (error) {
            console.log('⚠️ AUTH MANAGER: Could not call logout API:', error.message);
        }

        // Clear local state regardless of API call result
        this.removeToken();
        this.setUnauthenticatedState();
        
        if (showToast) {
            toast.success('Đã đăng xuất thành công');
        }
        
        console.log('✅ AUTH MANAGER: Logout complete');
    }

    // =========================================================================
    // TOKEN REFRESH LOGIC
    // =========================================================================

    /**
     * Refresh access token using refresh token (httpOnly cookie)
     * @returns {Promise<string>} New access token
     */
    async refreshToken() {
        console.log('🔄 AUTH MANAGER: Starting token refresh...');

        // Prevent multiple simultaneous refresh attempts
        if (this.refreshPromise) {
            console.log('⏳ AUTH MANAGER: Refresh already in progress, waiting...');
            return this.refreshPromise;
        }

        this.state.isRefreshing = true;
        this.emit('TOKEN_REFRESHING', true);

        this.refreshPromise = this._performTokenRefresh();
        
        try {
            const newToken = await this.refreshPromise;
            return newToken;
        } finally {
            this.refreshPromise = null;
            this.state.isRefreshing = false;
            this.emit('TOKEN_REFRESHING', false);
        }
    }

    /**
     * Internal method to perform the actual token refresh
     * @private
     */
    async _performTokenRefresh() {
        try {
            console.log('📡 AUTH MANAGER: Calling refresh endpoint...');
            
            // Import API dynamically to avoid circular dependency
            const axios = (await import('axios')).default;
            const baseURL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:8222/api';
            
            const response = await axios.post('/v1/auth/refresh', {}, {
                baseURL: baseURL,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('✅ AUTH MANAGER: Refresh response received');

            // Extract new access token
            const { accessToken } = response.data.result || response.data;
            
            if (!accessToken) {
                throw new Error('No access token in refresh response');
            }

            // Store new token and update state
            this.setToken(accessToken);
            const user = this.getUserFromToken(accessToken);
            this.setAuthenticatedState(user);

            console.log('✅ AUTH MANAGER: Token refresh successful');
            this.emit('TOKEN_REFRESHED', accessToken);
            
            toast.success('Phiên đăng nhập đã được gia hạn tự động', {
                duration: 3000,
                id: 'token-refresh-success'
            });

            return accessToken;
            
        } catch (error) {
            console.error('❌ AUTH MANAGER: Token refresh failed:', error);
            
            // Clear authentication state
            this.removeToken();
            this.setUnauthenticatedState();
            
            this.emit('TOKEN_REFRESH_FAILED', error);
            
            toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', {
                duration: 4000,
                id: 'token-refresh-failed'
            });

            // Navigate to login
            this.emit('NAVIGATE_TO', '/login');
            navigationManager.replaceRoute('/login');
            
            throw error;
        }
    }

    // =========================================================================
    // API ERROR HANDLING - Core business logic for 4 auth scenarios
    // =========================================================================

    /**
     * Handle API errors and determine appropriate action
     * @param {Object} error - Axios error object
     * @param {Object} originalRequest - Original request config
     * @returns {Promise<Object>} Action result
     */
    async handleApiError(error, originalRequest) {
        console.log('🔥 AUTH MANAGER: Handling API error:', {
            url: originalRequest?.url,
            status: error.response?.status,
            statusText: error.response?.statusText
        });

        if (!error.response) {
            console.log('❌ AUTH MANAGER: Network error, passing through');
            return { shouldRetry: false };
        }

        const { status } = error.response;
        const isAuthEndpoint = originalRequest?.url?.includes('/auth/');

        // Skip auth handling for auth endpoints to prevent infinite loops
        if (isAuthEndpoint) {
            console.log('🔍 AUTH MANAGER: Auth endpoint error, passing through');
            return { shouldRetry: false };
        }

        switch (status) {
            case 401:
                return await this._handle401Error(error, originalRequest);
            case 403:
                return this._handle403Error(error);
            default:
                console.log(`📊 AUTH MANAGER: Non-auth error (${status}), passing through`);
                return { shouldRetry: false };
        }
    }

    /**
     * Handle 401 Unauthorized errors
     * @private
     */
    async _handle401Error(error, originalRequest) {
        console.log('🔄 AUTH MANAGER: Handling 401 Unauthorized');

        // Prevent retry loops
        if (originalRequest._authRetryAttempted) {
            console.log('🔄 AUTH MANAGER: Already attempted auth retry, giving up');
            return { shouldRetry: false };
        }

        const currentToken = this.getToken();
        const errorMessage = error.response?.data?.error || '';

        console.log('🔍 AUTH MANAGER: 401 Analysis:', {
            hasToken: !!currentToken,
            errorMessage: errorMessage.substring(0, 100)
        });

        // Case 4a: NO TOKEN at all -> /unauthenticated (punishment + logout)
        if (!currentToken) {
            console.log('💀 AUTH MANAGER: No token detected - punishment flow');
            
            // Call logout to clean refreshToken on backend
            try {
                await this.logout(false); // false = no toast, we'll show our own
            } catch (logoutError) {
                console.log('⚠️ AUTH MANAGER: Logout call failed, but continuing with cleanup');
            }
            
            this.setUnauthenticatedState();
            
            toast.error('Không có token xác thực. Vui lòng đăng nhập lại.', {
                duration: 5000,
                id: 'no-token'
            });
            
            this.emit('NAVIGATE_TO', '/unauthenticated');
            navigationManager.navigateTo('/unauthenticated');
            return { shouldRetry: false };
        }

        // Case 4b: Malformed/Invalid JWT -> /unauthenticated (punishment + logout)
        // Check client-side format validation first (catches malformed tokens like the TokenDebug test token)
        if (!this.isTokenFormatValid(currentToken)) {
            console.log('💀 AUTH MANAGER: Client-side token format validation failed - punishment flow');
            
            // Call logout to clean refreshToken on backend
            try {
                await this.logout(false); // false = no toast, we'll show our own
            } catch (logoutError) {
                console.log('⚠️ AUTH MANAGER: Logout call failed, but continuing with cleanup');
            }
            
            this.setUnauthenticatedState();
            
            toast.error('Token không hợp lệ. Vui lòng đăng nhập lại.', {
                duration: 5000,
                id: 'malformed-token'
            });
            
            this.emit('NAVIGATE_TO', '/unauthenticated');
            navigationManager.navigateTo('/unauthenticated');
            return { shouldRetry: false };
        }

        // Check for specific backend error messages that indicate malformed tokens
        if (errorMessage.includes('Malformed') || errorMessage.includes('Invalid')) {
            console.log('💀 AUTH MANAGER: Backend reported malformed token - punishment flow');
            
            // Call logout to clean refreshToken on backend
            try {
                await this.logout(false); // false = no toast, we'll show our own
            } catch (logoutError) {
                console.log('⚠️ AUTH MANAGER: Logout call failed, but continuing with cleanup');
            }
            
            this.setUnauthenticatedState();
            
            toast.error('Token không hợp lệ. Vui lòng đăng nhập lại.', {
                duration: 5000,
                id: 'backend-malformed-token'
            });
            
            this.emit('NAVIGATE_TO', '/unauthenticated');
            navigationManager.navigateTo('/unauthenticated');
            return { shouldRetry: false };
        }

        // Case 3: Expired JWT -> attempt refresh
        console.log('🔄 AUTH MANAGER: Expired token, attempting refresh');
        
        try {
            const newToken = await this.refreshToken();
            
            // Mark request as retried and add new token
            originalRequest._authRetryAttempted = true;
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            
            console.log('✅ AUTH MANAGER: Refresh successful, retrying original request');
            return { shouldRetry: true };
            
        } catch (refreshError) {
            console.log('❌ AUTH MANAGER: Refresh failed, user must re-login');
            return { shouldRetry: false };
        }
    }

    /**
     * Handle 403 Forbidden errors
     * @private
     */
    _handle403Error(error) {
        console.log('🚫 AUTH MANAGER: Handling 403 Forbidden (insufficient permissions)');
        
        // Case 2: Valid JWT + invalid authorization -> /unauthorized
        toast.error('Bạn không có quyền truy cập tài nguyên này.', {
            duration: 4000,
            id: 'insufficient-permissions'
        });

        this.emit('NAVIGATE_TO', '/unauthorized');
        navigationManager.navigateTo('/unauthorized');
        return { shouldRetry: false };
    }

    // =========================================================================
    // MULTI-TAB SYNCHRONIZATION
    // =========================================================================

    /**
     * Handle localStorage changes from other tabs
     * @param {StorageEvent} event - Storage event
     */
    handleStorageChange(event) {
        if (event.key === this.ACCESS_TOKEN_KEY) {
            console.log('🔄 AUTH MANAGER: Token changed in another tab');
            
            if (event.newValue === null) {
                // Token was removed in another tab
                console.log('🧹 AUTH MANAGER: Token removed in another tab, logging out');
                this.setUnauthenticatedState();
            } else if (event.newValue !== event.oldValue) {
                // Token was updated in another tab
                console.log('🔄 AUTH MANAGER: Token updated in another tab, syncing state');
                const user = this.getUserFromToken(event.newValue);
                if (user) {
                    this.setAuthenticatedState(user);
                }
            }
        }
    }

    // =========================================================================
    // PUBLIC GETTERS
    // =========================================================================

    /**
     * Get current authentication state
     * @returns {Object} Current auth state
     */
    getAuthState() {
        return { ...this.state };
    }

    /**
     * Check if user is authenticated
     * @returns {boolean} Authentication status
     */
    isAuthenticated() {
        return this.state.isAuthenticated;
    }

    /**
     * Get current user role
     * @returns {string|null} User role
     */
    getUserRole() {
        return this.state.userRole;
    }

    /**
     * Get current user information
     * @returns {Object|null} User info
     */
    getUser() {
        return this.state.user;
    }

    /**
     * Check if initialization is complete
     * @returns {boolean} Initialization status
     */
    isInitialized() {
        return this.state.isInitialized;
    }

    // =========================================================================
    // CLEANUP
    // =========================================================================

    /**
     * Cleanup method for removing event listeners
     */
    destroy() {
        window.removeEventListener('storage', this.handleStorageChange);
        this.listeners = [];
        console.log('🧹 AUTH MANAGER: Destroyed');
    }
}

// Create singleton instance
export const authManager = new AuthManager();

// Export for testing purposes
export { AuthManager }; 