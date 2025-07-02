import API from "./api.js"

const classroomService = {
    getAllClassrooms: async (params = {}) => {
        // Use paginated endpoint if params are provided, otherwise fallback to non-paginated
        const endpoint = (params.page !== undefined || params.size !== undefined) 
            ? `/v1/classroom/all/page`
            : `/v1/classroom/all`;
        
        const response = await API.get(endpoint, { params });
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