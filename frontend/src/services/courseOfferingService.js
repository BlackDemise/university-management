import API from './api';

const courseOfferingService = {
    /**
     * Get all course offerings with pagination and search
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number (0-based)
     * @param {number} params.size - Page size
     * @param {string} params.search - Search term
     * @param {string} params.searchBy - Field to search by
     * @param {string} params.sort - Sort parameter (e.g., "id,desc")
     * @returns {Promise} - Promise with paginated course offerings
     */
    getAllCourseOfferings: async (params = {}) => {
        try {
            // Use paginated endpoint if params are provided, otherwise fallback to non-paginated
            const endpoint = (params.page !== undefined || params.size !== undefined) 
                ? `/v1/course-offering/all/page`
                : `/v1/course-offering/all`;
            
            const response = await API.get(endpoint, { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get course offering by ID
     * @param {number} id - Course offering ID
     * @returns {Promise} - Promise with course offering details
     */
    getCourseOfferingById: async (id) => {
        try {
            const response = await API.get(`/v1/course-offering/details/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Create or update course offering
     * @param {Object} courseOfferingData - Course offering data
     * @returns {Promise} - Promise with created/updated course offering
     */
    saveCourseOffering: async (courseOfferingData) => {
        try {
            const response = await API.post(`/v1/course-offering/save`, courseOfferingData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete course offering
     * @param {number} id - Course offering ID
     * @returns {Promise} - Promise with deletion response
     */
    deleteCourseOffering: async (id) => {
        try {
            const response = await API.delete(`/v1/course-offering/delete/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default courseOfferingService; 