import API from './api';

const departmentService = {
    /**
     * Get all departments with pagination and search
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number (0-based)
     * @param {number} params.size - Page size
     * @param {string} params.search - Search term
     * @param {string} params.searchBy - Field to search by
     * @param {string} params.sort - Sort parameter (e.g., "id,desc")
     * @returns {Promise} - Promise with paginated departments
     */
    getAllDepartments: async (params = {}) => {
        try {
            // Use paginated endpoint if params are provided, otherwise fallback to non-paginated
            const endpoint = (params.page !== undefined || params.size !== undefined) 
                ? `/v1/department/all/page`
                : `/v1/department/all`;
            
            const response = await API.get(endpoint, { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get department by ID
     * @param {number} id - Department ID
     * @returns {Promise} - Promise with department details
     */
    getDepartmentById: async (id) => {
        try {
            const response = await API.get(`/api/v1/department/details/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Create or update department
     * @param {Object} departmentData - Department data
     * @returns {Promise} - Promise with created/updated department
     */
    saveDepartment: async (departmentData) => {
        try {
            const response = await API.post(`/api/v1/department/save`, departmentData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete department
     * @param {number} id - Department ID
     * @returns {Promise} - Promise with deletion response
     */
    deleteDepartment: async (id) => {
        try {
            const response = await API.delete(`/api/v1/department/delete/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default departmentService; 