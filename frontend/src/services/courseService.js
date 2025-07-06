import API from "./api";

const courseService = {
  /**
   * Get all course types enum values
   * @returns {Promise} - Promise with course types object
   */
  getCourseTypes: async () => {
    try {
      const response = await API.get(`/v1/course/enum/course-types`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all courses with pagination and search
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (0-based)
   * @param {number} params.size - Page size
   * @param {string} params.search - Search term
   * @param {string} params.searchBy - Field to search by
   * @param {string} params.sort - Sort parameter (e.g., "id,desc")
   * @returns {Promise} - Promise with paginated courses
   */
  getAllCourses: async (params = {}) => {
    try {
      // Use paginated endpoint if params are provided, otherwise fallback to non-paginated
      const endpoint =
        params.page !== undefined || params.size !== undefined
          ? `/v1/course/all/page`
          : `/v1/course/all`;

      const response = await API.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get course by ID
   * @param {number} id - Course ID
   * @returns {Promise} - Promise with course details
   */
  getCourseById: async (id) => {
    try {
      const response = await API.get(`/v1/course/details/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create or update course
   * @param {Object} courseData - Course data
   * @returns {Promise} - Promise with created/updated course
   */
  saveCourse: async (courseData) => {
    try {
      const response = await API.post(`/v1/course/save`, courseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete course
   * @param {number} id - Course ID
   * @returns {Promise} - Promise with deletion response
   */
  deleteCourse: async (id) => {
    try {
      const response = await API.delete(`/v1/course/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default courseService;
