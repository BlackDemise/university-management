import API from './api.js';

const sessionService = {
    /**
     * Get optimized session summary with course offering details
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number (0-based)
     * @param {number} params.size - Page size
     * @param {string} params.sort - Sort parameter
     * @returns {Promise} - Promise with paginated session summary
     */
    getOptimizedSessionSummary: async (params = {}) => {
        try {
            const response = await API.get('/v1/session/course-session-summary', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get all sessions for a specific course offering with details
     * @param {number} courseOfferingId - Course offering ID
     * @returns {Promise} - Promise with sessions list
     */
    getSessionsByOffering: async (courseOfferingId) => {
        try {
            const response = await API.get(`/v1/session/by-course-offering/${courseOfferingId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get sessions for a specific course offering with pagination
     * @param {number} courseOfferingId - Course offering ID
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number (0-based)
     * @param {number} params.size - Page size
     * @param {string} params.sort - Sort parameter
     * @returns {Promise} - Promise with paginated sessions
     */
    getSessionsByOfferingWithPaging: async (courseOfferingId, params = {}) => {
        try {
            const response = await API.get(`/v1/session/by-course-offering/${courseOfferingId}/page`, { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get all sessions (basic endpoint)
     * @returns {Promise} - Promise with all sessions
     */
    getAllSessions: async () => {
        try {
            const response = await API.get('/v1/session/all');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get session by ID
     * @param {number} id - Session ID
     * @returns {Promise} - Promise with session details
     */
    getSessionById: async (id) => {
        try {
            const response = await API.get(`/v1/session/details/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Create or update session
     * @param {Object} sessionData - Session data
     * @returns {Promise} - Promise with saved session
     */
    saveSession: async (sessionData) => {
        try {
            const response = await API.post('/v1/session/save', sessionData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete session by ID
     * @param {number} id - Session ID
     * @returns {Promise} - Promise with deletion result
     */
    deleteSession: async (id) => {
        try {
            const response = await API.delete(`/v1/session/delete/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default sessionService;
