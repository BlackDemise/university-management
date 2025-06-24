import API from './api';

/**
 * Authentication service for handling user authentication operations
 */
const authService = {
    /**
     * Login user with email and password
     * @param {Object} credentials - User credentials
     * @param {string} credentials.email - User email
     * @param {string} credentials.password - User password
     * @returns {Promise} - Promise with login response
     */
    login: async (credentials) => {
        try {
            const response = await API.post('/v1/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Logout the current user
     * @returns {Promise} - Promise with logout response
     */
    logout: async () => {
        try {
            const response = await API.post('/v1/auth/logout');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Refresh the access token using refresh token
     * @returns {Promise} - Promise with new access token
     */
    refreshToken: async () => {
        try {
            const response = await API.post('/v1/auth/refresh');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default authService; 