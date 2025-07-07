import API from './api';

const gradeService = {
    /**
     * Get all grades
     * @returns {Promise} - Promise with all grades
     */
    getAllGrades: async () => {
        try {
            const response = await API.get(`/v1/grade/all`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get grade by ID
     * @param {number} id - Grade ID
     * @returns {Promise} - Promise with grade details
     */
    getGradeById: async (id) => {
        try {
            const response = await API.get(`/v1/grade/details/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Save grade (create or update)
     * @param {Object} gradeData - Grade data
     * @returns {Promise} - Promise with saved grade
     */
    saveGrade: async (gradeData) => {
        try {
            const response = await API.post(`/v1/grade/save`, gradeData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete grade by ID
     * @param {number} id - Grade ID
     * @returns {Promise} - Promise with deletion result
     */
    deleteGrade: async (id) => {
        try {
            const response = await API.delete(`/v1/grade/delete/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get student grade details (S2S optimized)
     * @param {number} studentId - Student ID
     * @returns {Promise} - Promise with student grade details grouped by course
     */
    getStudentGradeDetails: async (studentId) => {
        try {
            const response = await API.get(`/v1/grade/s2s/student/${studentId}/details`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get grades by course registration ID (S2S optimized)
     * @param {number} courseRegistrationId - Course registration ID
     * @returns {Promise} - Promise with grades for the course registration
     */
    getGradesByCourseRegistrationId: async (courseRegistrationId) => {
        try {
            const response = await API.get(`/v1/grade/s2s/course-registration/${courseRegistrationId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default gradeService;
