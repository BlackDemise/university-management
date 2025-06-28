import API from './api';

const roleService = {
    /**
     * Get all available roles
     * @returns {Promise} - Promise with roles list
     */
    getAllRoles: async () => {
        try {
            const response = await API.get(`/v1/role/all`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default roleService;