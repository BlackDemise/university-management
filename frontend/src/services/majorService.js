import API from './api';

const majorService = {
    /**
     * Get all majors with pagination
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number (0-based)
     * @param {number} params.size - Page size
     * @param {string} params.sort - Sort field and direction
     * @param {string} params.search - Search term (optional)
     * @param {string} params.searchBy - Search field: 'name' or 'departmentResponse.name' (optional)
     * @returns {Promise} - Promise with paginated user response
     */
    getAllMajors: async (params) => {
        try {
            const response = await API.get(`/v1/major/all/page`, {
                params
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get major by ID
     * @param {number} id - Major ID
     * @returns {Promise} - Promise with major details
     */
    getMajorById: async (id) => {
        try {
            const response = await API.get(`/v1/major/details/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Create or update major
     * @param {Object} majorData - Major data
     * @returns {Promise} - Promise with created/updated major
     */
    saveMajor: async (majorData) => {
        try {
            const response = await API.post(`/v1/major/save`, majorData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete major
     * @param {number} id - Major ID
     * @returns {Promise} - Promise with deletion response
     */
    deleteMajor: async (id) => {
        try {
            const response = await API.delete(`/v1/major/delete/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default majorService; 