import API from './api';

const userService = {
    /**
     * Get all users with pagination
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number (0-based)
     * @param {number} params.size - Page size
     * @param {string} params.sort - Sort field and direction
     * @param {string} params.search - Search term (optional)
     * @param {string} params.searchBy - Search field: 'fullName' or 'email' (optional)
     * @returns {Promise} - Promise with paginated user response
     */
    getAllUsers: async (params ) => {
        try {
            const response = await API.get(`/v1/user/all/page`, {
                params
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get user by ID
     * @param {number} id - User ID
     * @returns {Promise} - Promise with user details
     */
    getUserById: async (id) => {
        try {
            const response = await API.get(`/v1/user/details/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Create or update user
     * @param {Object} userData - User data
     * @returns {Promise} - Promise with created/updated user
     */
    saveUser: async (userData) => {
        try {
            const response = await API.post(`/v1/user/save`, userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete/Deactivate user
     * @param {number} id - User ID
     * @returns {Promise} - Promise with deletion response
     */
    deleteUser: async (id) => {
        try {
            const response = await API.delete(`/v1/user/delete/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get all teachers for dropdown selection
     * @returns {Promise} - Promise with all teachers list
     */
    getAllTeachers: async () => {
        try {
            const response = await API.get(`/v1/user/teachers/all`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Upload avatar for user
     * @param {number} userId - User ID
     * @param {FormData} formData - FormData containing the file
     * @returns {Promise} - Promise with upload response
     */
    uploadAvatar: async (userId, formData) => {
        try {
            const response = await API.post(`/v1/user/${userId}/avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default userService;