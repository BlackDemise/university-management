import API from './api';

const classroomService = {
    getAllClassrooms: async (params = {}) => {
        const response = await API.get(`/v1/classroom/all`, { params });
        return response.data;
    },

    getClassroomById: async (id) => {
        const response = await API.get(`/v1/classroom/details/${id}`);
        return response.data;
    },

    saveClassroom: async (classroomData) => {
        const response = await API.post(`/v1/classroom/save`, classroomData);
        return response.data;
    },

    deleteClassroom: async (id) => {
        const response = await API.delete(`/v1/classroom/delete/${id}`);
        return response.data;
    }
};

export default classroomService; 