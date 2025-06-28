import API from './api';

const departmentService = {
    /**
     * Get all departments
     * @returns {Promise} - Promise with departments array
     */
    getAllDepartments: async () => {
        try {
            const response = await API.get(`/v1/department/all`);
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
            const response = await API.get(`/v1/department/details/${id}`);
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
            const response = await API.post(`/v1/department/save`, departmentData);
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
            const response = await API.delete(`/v1/department/delete/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default departmentService; 