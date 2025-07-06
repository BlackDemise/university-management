import API from "./api";

const departmentMemberService = {
  /**
   * Get departments summary with member counts
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (0-based)
   * @param {number} params.size - Page size
   * @param {string} params.sort - Sort parameter
   * @param {string} params.searchValue - Search term (optional)
   * @param {string} params.searchCriterion - Search field (optional)
   * @returns {Promise} - Promise with departments summary
   */
  getDepartmentsSummary: async (params = {}) => {
    try {
      const response = await API.get(
        `/v1/department-member/department-summary`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get department details with member information
   * @param {number} departmentId - Department ID
   * @returns {Promise} - Promise with department details and members
   */
  getDepartmentDetails: async (departmentId) => {
    try {
      const response = await API.get(
        `/v1/department-member/department/${departmentId}/details`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all available teachers for selection
   * @returns {Promise} - Promise with teachers list
   */
  getAvailableTeachers: async () => {
    try {
      const response = await API.get(
        `/v1/department-member/teachers/available`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get department member types enum
   * @returns {Promise} - Promise with member types
   */
  getMemberTypes: async () => {
    try {
      const response = await API.get(`/v1/department-member/enum/department-member-type`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get department member by ID
   * @param {number} id - Department member ID
   * @returns {Promise} - Promise with member details
   */
  getDepartmentMemberById: async (id) => {
    try {
      const response = await API.get(`/v1/department-member/details/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get department members by department ID
   * @param {number} departmentId - Department ID
   * @returns {Promise} - Promise with department members
   */
  getDepartmentMembersByDepartmentId: async (departmentId) => {
    try {
      const response = await API.get(
        `/v1/department-member/department/${departmentId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Save department member (create or update)
   * @param {Object} memberData - Department member data
   * @returns {Promise} - Promise with saved member
   */
  saveDepartmentMember: async (memberData) => {
    try {
      const response = await API.post(`/v1/department-member/save`, memberData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete department member
   * @param {number} id - Department member ID
   * @returns {Promise} - Promise with deletion response
   */
  deleteDepartmentMember: async (id) => {
    try {
      const response = await API.delete(`/v1/department-member/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete all department members by department ID
   * @param {number} departmentId - Department ID
   * @returns {Promise} - Promise with deletion response
   */
  deleteAllDepartmentMembers: async (departmentId) => {
    try {
      const response = await API.delete(
        `/v1/department-member/department/${departmentId}/delete-all`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default departmentMemberService;
