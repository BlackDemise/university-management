import API from './api';

const courseService = {
  /**
   * Get all courses
   * @returns {Promise} - Promise with courses array
   */
  getAllCourses: async () => {
    try {
      const response = await API.get(`/v1/course/all`);
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