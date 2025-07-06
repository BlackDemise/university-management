import API from './api.js';

export const prerequisiteCourseService = {
    // Enhanced endpoints for prerequisite course management
    getAllCoursesWithPrerequisiteInfo: async () => {
        return await API.get('/v1/prerequisite-course/courses/summary');
    },

    getCoursePrerequisiteDetails: async (courseId) => {
        return await API.get(`/v1/prerequisite-course/courses/${courseId}/details`);
    },

    getAvailablePrerequisiteOptions: async (courseId) => {
        return await API.get(`/v1/prerequisite-course/courses/${courseId}/available-prerequisites`);
    },

    updateCoursePrerequisites: async (courseId, updateData) => {
        return await API.put(`/v1/prerequisite-course/courses/${courseId}/prerequisites`, updateData);
    },

    validatePrerequisiteAddition: async (courseId, prerequisiteCourseId) => {
        return await API.get(`/v1/prerequisite-course/validate/${courseId}/prerequisite/${prerequisiteCourseId}`);
    },

    // Original endpoints (kept for compatibility)
    findAll: async () => {
        return await API.get('/v1/prerequisite-course/all');
    },

    findById: async (id) => {
        return await API.get(`/v1/prerequisite-course/details/${id}`);
    },

    save: async (prerequisiteCourseData) => {
        return await API.post('/v1/prerequisite-course/save', prerequisiteCourseData);
    },

    deleteById: async (id) => {
        return await API.delete(`/v1/prerequisite-course/delete/${id}`);
    }
}; 