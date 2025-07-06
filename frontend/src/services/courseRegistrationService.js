import API from './api.js';

const courseRegistrationService = {
    // For CourseRegistrationSummaryList
    getRegistrationSummaries: async (params = {}) => {
        const response = await API.get('/v1/course-registration/all/summary/page', { params });
        return response.data;
    },

    // For CourseOfferingRegistrationDetails  
    getRegistrationsByCourseOffering: async (courseOfferingId, params = {}) => {
        const response = await API.get(`/v1/course-registration/by-course-offering/${courseOfferingId}`, { params });
        return response.data;
    },

    getRegistrationsByCourseOfferingWithPaging: async (courseOfferingId, params = {}) => {
        const response = await API.get(`/v1/course-registration/by-course-offering/${courseOfferingId}/page`, { params });
        return response.data;
    },

    // For individual operations
    getAllRegistrations: async (params = {}) => {
        const response = await API.get('/v1/course-registration/all', { params });
        return response.data;
    },

    getRegistrationById: async (id) => {
        const response = await API.get(`/v1/course-registration/details/${id}`);
        return response.data;
    },

    createRegistration: async (data) => {
        const response = await API.post('/v1/course-registration/save', data);
        return response.data;
    },

    updateRegistration: async (data) => {
        const response = await API.post('/v1/course-registration/save', data);
        return response.data;
    },

    deleteRegistration: async (id) => {
        const response = await API.delete(`/v1/course-registration/delete/${id}`);
        return response.data;
    },

    // Validation
    validateRegistration: async (id) => {
        const response = await API.get(`/v1/course-registration/${id}/validate`);
        return response.data;
    }
};

export default courseRegistrationService;
