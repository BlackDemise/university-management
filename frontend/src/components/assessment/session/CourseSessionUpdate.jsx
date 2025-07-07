import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Button, Alert, Spinner, Row, Col, Card } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import MainLayout from '../../layout/main/MainLayout.jsx';
import { sessionService, courseOfferingService, classroomService } from '../../../services/apiService.js';

const CourseSessionUpdate = () => {
    const { sessionId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Determine if this is create or edit mode
    const isEditMode = !!sessionId;
    const courseOfferingIdFromQuery = searchParams.get('courseOfferingId');
    
    // State management
    const [formData, setFormData] = useState({
        id: null,
        sessionType: 'LECTURE',
        sessionNumber: '',
        startTime: '',
        endTime: '',
        courseOfferingId: courseOfferingIdFromQuery || '',
        classroomId: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [courseOfferings, setCourseOfferings] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(false);

    // Session type options
    const sessionTypeOptions = [
        { value: 'LECTURE', label: 'Tiết học lý thuyết' },
        { value: 'LAB', label: 'Tiết học thực hành' },
        { value: 'EXAM', label: 'Thời gian thi' }
    ];

    // Load session data for edit mode
    const loadSession = async () => {
        if (!isEditMode) return;
        
        try {
            setLoading(true);
            setError(null);

            console.log('📖 Loading session for edit:', sessionId);

            const response = await sessionService.getSessionById(sessionId);

            if (response.result) {
                const session = response.result;
                setFormData({
                    id: session.id,
                    sessionType: getSessionTypeValue(session.sessionType),
                    sessionNumber: session.sessionNumber || '',
                    startTime: formatDateTimeForInput(session.startTime),
                    endTime: formatDateTimeForInput(session.endTime),
                    courseOfferingId: session.courseOfferingId || '',
                    classroomId: session.classroomId || ''
                });
            } else {
                setError('Không tìm thấy thông tin phiên học.');
            }
        } catch (err) {
            setError('Không thể tải thông tin phiên học. Vui lòng thử lại.');
            console.error('Error loading session:', err);
            toast.error('Lỗi khi tải thông tin phiên học');
        } finally {
            setLoading(false);
        }
    };

    // Load course offerings and classrooms
    const loadOptions = async () => {
        try {
            setLoadingOptions(true);

            // Load course offerings and classrooms in parallel
            const [courseOfferingsResponse, classroomsResponse] = await Promise.all([
                courseOfferingService.getAllCourseOfferings(),
                classroomService.getAllClassrooms()
            ]);

            if (courseOfferingsResponse.result) {
                setCourseOfferings(courseOfferingsResponse.result);
            }

            if (classroomsResponse.result) {
                setClassrooms(classroomsResponse.result);
            }
        } catch (err) {
            console.error('Error loading options:', err);
            toast.error('Lỗi khi tải danh sách khóa học và phòng học');
        } finally {
            setLoadingOptions(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        loadOptions();
        if (isEditMode) {
            loadSession();
        }
    }, [sessionId]);

    // Helper functions
    const getSessionTypeValue = (sessionTypeText) => {
        const option = sessionTypeOptions.find(opt => opt.label === sessionTypeText);
        return option ? option.value : 'LECTURE';
    };

    const formatDateTimeForInput = (dateTimeString) => {
        if (!dateTimeString) return '';
        try {
            const date = new Date(dateTimeString);
            return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
        } catch {
            return '';
        }
    };

    const formatDateTimeForSubmit = (inputDateTime) => {
        if (!inputDateTime) return null;
        try {
            const date = new Date(inputDateTime);
            return date.toISOString().slice(0, 19); // Format: YYYY-MM-DDTHH:mm:ss
        } catch {
            return null;
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.sessionType || !formData.sessionNumber || !formData.startTime || 
            !formData.endTime || !formData.courseOfferingId || !formData.classroomId) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (new Date(formData.startTime) >= new Date(formData.endTime)) {
            toast.error('Thời gian bắt đầu phải trước thời gian kết thúc');
            return;
        }

        try {
            setSaving(true);
            setError(null);

            const submitData = {
                ...formData,
                sessionNumber: parseInt(formData.sessionNumber),
                courseOfferingId: parseInt(formData.courseOfferingId),
                classroomId: parseInt(formData.classroomId),
                startTime: formatDateTimeForSubmit(formData.startTime),
                endTime: formatDateTimeForSubmit(formData.endTime)
            };

            console.log('💾 Submitting session data:', submitData);

            const response = await sessionService.saveSession(submitData);

            if (response.result) {
                toast.success(isEditMode ? 'Cập nhật phiên học thành công' : 'Tạo phiên học thành công');
                
                // Navigate back to the course offering sessions list
                const courseOfferingId = formData.courseOfferingId;
                navigate(`/admin/assessment/sessions/course-offering/${courseOfferingId}`);
            } else {
                throw new Error('Không có dữ liệu trả về từ server');
            }
        } catch (err) {
            setError(isEditMode ? 'Không thể cập nhật phiên học. Vui lòng thử lại.' : 'Không thể tạo phiên học. Vui lòng thử lại.');
            console.error('Error saving session:', err);
            toast.error(isEditMode ? 'Lỗi khi cập nhật phiên học' : 'Lỗi khi tạo phiên học');
        } finally {
            setSaving(false);
        }
    };

    // Handle navigation
    const handleBack = () => {
        if (formData.courseOfferingId) {
            navigate(`/admin/assessment/sessions/course-offering/${formData.courseOfferingId}`);
        } else if (isEditMode) {
            navigate(`/admin/assessment/sessions/details/${sessionId}`);
        } else {
            navigate('/admin/assessment/sessions/summary');
        }
    };

    return (
        <MainLayout>
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow">
                            <div className="card-header bg-primary text-white">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">
                                        <i className={`fas ${isEditMode ? 'fa-edit' : 'fa-plus'} me-2`}></i>
                                        {isEditMode ? 'Chỉnh Sửa Phiên Học' : 'Tạo Phiên Học Mới'}
                                    </h5>
                                    <Button 
                                        variant="light" 
                                        size="sm"
                                        onClick={handleBack}
                                    >
                                        <i className="fas fa-arrow-left me-1"></i>
                                        Quay Lại
                                    </Button>
                                </div>
                            </div>

                            <div className="card-body">
                                {/* Error Alert */}
                                {error && (
                                    <Alert variant="danger" className="mb-4">
                                        <i className="fas fa-exclamation-triangle me-2"></i>
                                        {error}
                                    </Alert>
                                )}

                                {/* Loading Spinner */}
                                {loading && (
                                    <div className="text-center py-4">
                                        <Spinner animation="border" variant="primary" />
                                        <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
                                    </div>
                                )}

                                {/* Form */}
                                {!loading && (
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col lg={8}>
                                                <Card className="mb-4">
                                                    <Card.Header className="bg-light">
                                                        <h6 className="mb-0">
                                                            <i className="fas fa-info-circle me-2"></i>
                                                            Thông Tin Phiên Học
                                                        </h6>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <Row className="mb-3">
                                                            <Col md={6}>
                                                                <Form.Group>
                                                                    <Form.Label>Loại Phiên Học <span className="text-danger">*</span></Form.Label>
                                                                    <Form.Select
                                                                        name="sessionType"
                                                                        value={formData.sessionType}
                                                                        onChange={handleInputChange}
                                                                        required
                                                                    >
                                                                        {sessionTypeOptions.map(option => (
                                                                            <option key={option.value} value={option.value}>
                                                                                {option.label}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Select>
                                                                </Form.Group>
                                                            </Col>
                                                            <Col md={6}>
                                                                <Form.Group>
                                                                    <Form.Label>Số Phiên <span className="text-danger">*</span></Form.Label>
                                                                    <Form.Control
                                                                        type="number"
                                                                        name="sessionNumber"
                                                                        value={formData.sessionNumber}
                                                                        onChange={handleInputChange}
                                                                        placeholder="Nhập số phiên học"
                                                                        min="1"
                                                                        required
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>

                                                        <Row className="mb-3">
                                                            <Col md={6}>
                                                                <Form.Group>
                                                                    <Form.Label>Thời Gian Bắt Đầu <span className="text-danger">*</span></Form.Label>
                                                                    <Form.Control
                                                                        type="datetime-local"
                                                                        name="startTime"
                                                                        value={formData.startTime}
                                                                        onChange={handleInputChange}
                                                                        required
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col md={6}>
                                                                <Form.Group>
                                                                    <Form.Label>Thời Gian Kết Thúc <span className="text-danger">*</span></Form.Label>
                                                                    <Form.Control
                                                                        type="datetime-local"
                                                                        name="endTime"
                                                                        value={formData.endTime}
                                                                        onChange={handleInputChange}
                                                                        required
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>

                                                        <Row className="mb-3">
                                                            <Col md={6}>
                                                                <Form.Group>
                                                                    <Form.Label>Khóa Học <span className="text-danger">*</span></Form.Label>
                                                                    <Form.Select
                                                                        name="courseOfferingId"
                                                                        value={formData.courseOfferingId}
                                                                        onChange={handleInputChange}
                                                                        disabled={loadingOptions}
                                                                        required
                                                                    >
                                                                        <option value="">Chọn khóa học</option>
                                                                        {courseOfferings.map(offering => (
                                                                            <option key={offering.id} value={offering.id}>
                                                                                ID: {offering.id} - Course: {offering.courseId}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Select>
                                                                    {loadingOptions && (
                                                                        <Form.Text className="text-muted">
                                                                            <Spinner size="sm" className="me-1" />
                                                                            Đang tải danh sách khóa học...
                                                                        </Form.Text>
                                                                    )}
                                                                </Form.Group>
                                                            </Col>
                                                            <Col md={6}>
                                                                <Form.Group>
                                                                    <Form.Label>Phòng Học <span className="text-danger">*</span></Form.Label>
                                                                    <Form.Select
                                                                        name="classroomId"
                                                                        value={formData.classroomId}
                                                                        onChange={handleInputChange}
                                                                        disabled={loadingOptions}
                                                                        required
                                                                    >
                                                                        <option value="">Chọn phòng học</option>
                                                                        {classrooms.map(classroom => (
                                                                            <option key={classroom.id} value={classroom.id}>
                                                                                {classroom.name} ({classroom.classroomType})
                                                                            </option>
                                                                        ))}
                                                                    </Form.Select>
                                                                    {loadingOptions && (
                                                                        <Form.Text className="text-muted">
                                                                            <Spinner size="sm" className="me-1" />
                                                                            Đang tải danh sách phòng học...
                                                                        </Form.Text>
                                                                    )}
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Card>

                                                {/* Form Actions */}
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Button 
                                                        variant="secondary" 
                                                        onClick={handleBack}
                                                        disabled={saving}
                                                    >
                                                        <i className="fas fa-times me-1"></i>
                                                        Hủy
                                                    </Button>
                                                    <Button 
                                                        type="submit" 
                                                        variant="primary"
                                                        disabled={saving || loadingOptions}
                                                    >
                                                        {saving ? (
                                                            <>
                                                                <Spinner size="sm" className="me-2" />
                                                                {isEditMode ? 'Đang cập nhật...' : 'Đang tạo...'}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className={`fas ${isEditMode ? 'fa-save' : 'fa-plus'} me-1`}></i>
                                                                {isEditMode ? 'Cập Nhật' : 'Tạo Mới'}
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </Col>

                                            <Col lg={4}>
                                                <Card>
                                                    <Card.Header className="bg-light">
                                                        <h6 className="mb-0">
                                                            <i className="fas fa-info me-2"></i>
                                                            Hướng Dẫn
                                                        </h6>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <ul className="list-unstyled mb-0">
                                                            <li className="mb-2">
                                                                <i className="fas fa-check text-success me-2"></i>
                                                                Điền đầy đủ thông tin bắt buộc (*)
                                                            </li>
                                                            <li className="mb-2">
                                                                <i className="fas fa-check text-success me-2"></i>
                                                                Thời gian bắt đầu phải trước thời gian kết thúc
                                                            </li>
                                                            <li className="mb-2">
                                                                <i className="fas fa-check text-success me-2"></i>
                                                                Số phiên học phải là số nguyên dương
                                                            </li>
                                                            <li className="mb-2">
                                                                <i className="fas fa-check text-success me-2"></i>
                                                                Chọn phòng học phù hợp với loại phiên học
                                                            </li>
                                                        </ul>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default CourseSessionUpdate;
