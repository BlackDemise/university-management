import api from './api';

export const excelService = {
    previewExcel: (data) => api.post('/v1/excel/preview', data),
    uploadExcel: (data) => api.post('/v1/excel/upload', data),
    uploadExcelFile: (file, entityType) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('entityType', entityType);

        return api.post('/v1/excel/upload/multipart', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};