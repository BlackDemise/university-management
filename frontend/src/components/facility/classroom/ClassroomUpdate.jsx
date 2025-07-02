import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChalkboard, faArrowLeft, faSave, faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import { classroomService } from "../../../services/apiService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

const ClassroomUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // Form state
    const [formData, setFormData] = useState({
        id: '',
        roomNumber: '',
        building: '',
        capacity: '',
        equipment: '',
        classroomType: ''
    });

    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isNotFound, setIsNotFound] = useState(false);

    // Load classroom data if in edit mode
    useEffect(() => {
        if (isEditMode) {
            loadClassroomData();
        }
    }, [id]);

    const loadClassroomData = async () => {
        try {
            setLoading(true);
            setError(null);
            setIsNotFound(false);

            const response = await classroomService.getClassroomById(id);
            
            if (response.result) {
                setFormData(response.result);
            } else {
                setFormData(response);
            }
        } catch (err) {
            console.error('Error loading classroom:', err);
            
            if (err.response && err.response.status === 404) {
                setIsNotFound(true);
                setError(null);
            } else {
                setError('Không thể tải thông tin phòng học. Vui lòng thử lại.');
                setIsNotFound(false);
                toast.error('Lỗi khi tải thông tin phòng học');
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            setError(null);

            // Validate capacity as a number
            const capacityNum = parseInt(formData.capacity);
            if (isNaN(capacityNum) || capacityNum <= 0) {
                throw new Error('Sức chứa phải là số nguyên dương');
            }

            // Prepare data for submission
            const submitData = {
                ...formData,
                capacity: capacityNum
            };

            // Call API
            const response = await classroomService.saveClassroom(submitData);
            
            toast.success(
                isEditMode 
                    ? 'Cập nhật phòng học thành công' 
                    : 'Tạo phòng học mới thành công'
            );
            
            // Navigate back to list view
            navigate('/admin/facility/classrooms');
        } catch (err) {
            console.error('Error saving classroom:', err);
            setError(err.message || 'Có lỗi xảy ra khi lưu thông tin phòng học');
            toast.error('Lỗi khi lưu thông tin phòng học');
        } finally {
            setLoading(false);
        }
    };

    // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (isEditMode && isNotFound) {
        return (
            <MainLayout activeMenu="classrooms">
                <div className="container-fluid pt-3 pb-5">
                    <div className="text-center py-5">
                        <div className="mb-4">
                            <FontAwesomeIcon 
                                icon={faChalkboard} 
                                size="5x" 
                                className="text-muted opacity-50" 
                            />
                        </div>
                        <h3 className="text-muted mb-3">Không Tìm Thấy Phòng Học</h3>
                        <p className="text-muted mb-4">
                            Phòng học với ID <code>#{id}</code> không tồn tại trong hệ thống.
                        </p>
                        <div className="d-flex gap-2 justify-content-center">
                            <Button 
                                variant="primary" 
                                onClick={() => navigate('/admin/facility/classrooms')}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                                Quay Lại Danh Sách
                            </Button>
                            <Button 
                                variant="outline-secondary" 
                                onClick={() => window.location.reload()}
                            >
                                <FontAwesomeIcon icon={faRefresh} className="me-1" />
                                Thử Lại
                            </Button>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout activeMenu="classrooms">
            <div className="container-fluid pt-3 pb-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="h4 fw-bold text-dark">
                            {isEditMode ? 'Chỉnh Sửa Phòng Học' : 'Thêm Phòng Học Mới'}
                        </h2>
                        <p className="text-muted mb-0">
                            {isEditMode 
                                ? `Chỉnh sửa thông tin phòng học ${formData.roomNumber}`
                                : 'Thêm một phòng học mới vào hệ thống'
                            }
                        </p>
                    </div>
                    <Button
                        variant="outline-primary"
                        onClick={() => navigate('/admin/facility/classrooms')}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                        Quay lại
                    </Button>
                </div>

                {/* Error Alert */}
                {error && (
                    <Alert variant="danger" className="mb-4">
                        {error}
                    </Alert>
                )}

                {/* Form */}
                <Card className="border-0 shadow-sm">
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    {/* Room Number */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Số Phòng <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="roomNumber"
                                            value={formData.roomNumber}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Nhập số phòng"
                                        />
                                    </Form.Group>

                                    {/* Building */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tòa Nhà <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="building"
                                            value={formData.building}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Nhập tên tòa nhà"
                                        />
                                    </Form.Group>

                                    {/* Capacity */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Sức Chứa <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="capacity"
                                            value={formData.capacity}
                                            onChange={handleInputChange}
                                            required
                                            min="1"
                                            placeholder="Nhập sức chứa"
                                        />
                                    </Form.Group>
                                </div>

                                <div className="col-md-6">
                                    {/* Classroom Type */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Loại Phòng <span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            name="classroomType"
                                            value={formData.classroomType}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Chọn loại phòng</option>
                                            <option value="LECTURE_HALL">Giảng Đường</option>
                                            <option value="COMPUTER_LAB">Phòng Máy Tính</option>
                                            <option value="SCIENCE_LAB">Phòng Thí Nghiệm</option>
                                            <option value="SEMINAR_ROOM">Phòng Hội Thảo</option>
                                        </Form.Select>
                                    </Form.Group>

                                    {/* Equipment */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Thiết Bị</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="equipment"
                                            value={formData.equipment}
                                            onChange={handleInputChange}
                                            rows={4}
                                            placeholder="Nhập danh sách thiết bị (không bắt buộc)"
                                        />
                                    </Form.Group>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => navigate('/admin/facility/classrooms')}
                                    disabled={loading}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                className="me-2"
                                            />
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faSave} className="me-1" />
                                            {isEditMode ? 'Cập Nhật' : 'Tạo Mới'}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </MainLayout>
    );
};

export default ClassroomUpdate; 