import API from './api';

const semesterService = {
    /**
     * Get all semesters with pagination and search
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number (0-based)
     * @param {number} params.size - Page size
     * @param {string} params.search - Search term
     * @param {string} params.searchBy - Field to search by
     * @param {string} params.sort - Sort parameter (e.g., "id,desc")
     * @returns {Promise} - Promise with paginated semesters
     */
    getAllSemesters: async (params = {}) => {
        try {
            // Use paginated endpoint if params are provided, otherwise fallback to non-paginated
            const endpoint = (params.page !== undefined || params.size !== undefined) 
                ? `/v1/semester/all/page`
                : `/v1/semester/all`;

            const response = await API.get(endpoint, { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get semester by ID
     * @param {number} id - Semester ID
     * @returns {Promise} - Promise with semester details
     */
    getSemesterById: async (id) => {
        try {
            const response = await API.get(`/v1/semester/details/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Create or update semester
     * @param {Object} semesterData - Semester data
     * @returns {Promise} - Promise with created/updated semester
     */
    saveSemester: async (semesterData) => {
        try {
            const response = await API.post(`/v1/semester/save`, semesterData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete semester
     * @param {number} id - Semester ID
     * @returns {Promise} - Promise with deletion response
     */
    deleteSemester: async (id) => {
        try {
            const response = await API.delete(`/v1/semester/delete/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default semesterService; 