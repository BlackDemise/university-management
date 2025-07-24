import API from "./api";

const programCurriculumService = {
  /**
   * Get all program curriculums with pagination and search
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (0-based)
   * @param {number} params.size - Page size
   * @param {string} params.search - Search term
   * @param {string} params.searchBy - Field to search by
   * @param {string} params.sort - Sort parameter (e.g., "id,desc")
   * @returns {Promise} - Promise with paginated program curriculums
   */
  getAllProgramCurriculums: async (params = {}) => {
    try {
      // Use paginated endpoint if params are provided, otherwise fallback to non-paginated
      const endpoint =
        params.page !== undefined || params.size !== undefined
          ? `/v1/program-curriculum/all/page`
          : `/v1/program-curriculum/all`;

      const response = await API.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get program curriculum by ID
   * @param {number} id - Program Curriculum ID
   * @returns {Promise} - Promise with program curriculum details
   */
  getProgramCurriculumById: async (id) => {
    try {
      const response = await API.get(`/v1/program-curriculum/details/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create or update program curriculum
   * @param {Object} programCurriculumData - Program curriculum data
   * @returns {Promise} - Promise with created/updated program curriculum
   */
  saveProgramCurriculum: async (programCurriculumData) => {
    try {
      const response = await API.post(
        `/v1/program-curriculum/save`,
        programCurriculumData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete program curriculum
   * @param {number} id - Program Curriculum ID
   * @returns {Promise} - Promise with deletion response
   */
  deleteProgramCurriculum: async (id) => {
    try {
      const response = await API.delete(`/v1/program-curriculum/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // =====================================================
  // PLACEHOLDER METHODS FOR FUTURE BACKEND IMPLEMENTATION
  // =====================================================

  /**
   * Search majors for curriculum assignment
   * @param {string} searchTerm - Search term for major name
   * @returns {Promise} - Promise with filtered majors
   *
   * 🚧 BACKEND TODO: Implement search endpoint for majors
   * Expected endpoint: GET /v1/major/search?q={searchTerm}
   */
  searchMajors: async (searchTerm) => {
    try {
      // TODO: Replace with actual search endpoint when backend is ready
      const response = await API.get(
        `/v1/major/search?q=${encodeURIComponent(searchTerm)}`
      );
      return response.data;
    } catch (error) {
      // Fallback to get all majors and filter on frontend (temporary)
      console.warn(
        "🚧 Using fallback major search - implement backend search endpoint"
      );
      try {
        const response = await API.get(`/v1/major/all`);
        const majors = response.data.result || response.data || [];
        return {
          result: majors.filter((major) =>
            major.name?.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        };
      } catch (fallbackError) {
        throw error; // Throw original error
      }
    }
  },

  /**
   * Search courses for curriculum assignment
   * @param {string} searchTerm - Search term for course name/code
   * @returns {Promise} - Promise with filtered courses
   *
   * 🚧 BACKEND TODO: Implement search endpoint for courses
   * Expected endpoint: GET /v1/course/search?q={searchTerm}
   */
  searchCourses: async (searchTerm) => {
    try {
      // TODO: Replace with actual search endpoint when backend is ready
      const response = await API.get(
        `/v1/course/search?q=${encodeURIComponent(searchTerm)}`
      );
      return response.data;
    } catch (error) {
      // Fallback to get all courses and filter on frontend (temporary)
      console.warn(
        "🚧 Using fallback course search - implement backend search endpoint"
      );
      try {
        const response = await API.get(`/v1/course/all`);
        const courses = response.data.result || response.data || [];
        return {
          result: courses.filter(
            (course) =>
              course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              course.code?.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        };
      } catch (fallbackError) {
        throw error; // Throw original error
      }
    }
  },

  /**
   * Get courses in a major's curriculum
   * @param {number} majorId - Major ID  
   * @returns {Promise} - Promise with courses in curriculum
   * 
   * ✅ BACKEND IMPLEMENTED: GET /v1/program-curriculum/{majorId}/all-courses
   */
  getCurriculumCourses: async (majorId) => {
    try {
      const response = await API.get(
        `/v1/program-curriculum/${majorId}/all-courses`
      );
      return response.data;
    } catch (error) {
      // Fallback for development - this should not be needed anymore
      console.warn(
        "⚠️ Backend endpoint failed, using placeholder data"
      );
      return {
        result: [
          // Placeholder course data
          {
            id: 1,
            code: "CS101", 
            name: "Lập trình căn bản",
            creditsTheory: 2,
            creditsPractical: 1,
            courseType: "SPECIALIZED",
          },
          {
            id: 2,
            code: "MATH101",
            name: "Toán cao cấp 1", 
            creditsTheory: 3,
            creditsPractical: 0,
            courseType: "GENERAL",
          },
        ],
      };
    }
  },
};

export default programCurriculumService;
