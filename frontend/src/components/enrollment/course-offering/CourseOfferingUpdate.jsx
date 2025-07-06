import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChalkboardTeacher, faArrowLeft, faSave, faEdit, faPlus, faUsers, faClock
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import courseOfferingService from "../../../services/courseOfferingService.js";
import courseService from "../../../services/courseService.js";
import userService from "../../../services/userService.js";
import semesterService from "../../../services/semesterService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

const CourseOfferingUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // State management
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // Dropdown data states
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [loadingDropdowns, setLoadingDropdowns] = useState(true);

    // Form data state
    const [formData, setFormData] = useState({
        id: null,
        maxStudents: '',
        currentStudents: 0,
        openTime: '',
        closeTime: '',
        courseId: '',
        semesterId: '',
        teacherId: ''
    });

    // Form validation state
    const [formErrors, setFormErrors] = useState({});

    // Load dropdown data (courses, teachers, semesters)
    const loadDropdownData = async () => {
        try {
            setLoadingDropdowns(true);
            
            // Load courses, teachers, and semesters in parallel
            const [coursesResponse, teachersResponse, semestersResponse] = await Promise.all([
                courseService.getAllCourses(),
                userService.getAllTeachers(),
                semesterService.getAllSemesters()
            ]);

            // Handle courses response
            if (coursesResponse.result) {
                setCourses(Array.isArray(coursesResponse.result) ? coursesResponse.result : []);
            } else if (Array.isArray(coursesResponse)) {
                setCourses(coursesResponse);
            }

            // Handle teachers response  
            if (teachersResponse.result) {
                setTeachers(Array.isArray(teachersResponse.result) ? teachersResponse.result : []);
            } else if (Array.isArray(teachersResponse)) {
                setTeachers(teachersResponse);
            }

            // Handle semesters response
            if (semestersResponse.result) {
                setSemesters(Array.isArray(semestersResponse.result) ? semestersResponse.result : []);
            } else if (Array.isArray(semestersResponse)) {
                setSemesters(semestersResponse);
            }

        } catch (err) {
            console.error('Error loading dropdown data:', err);
            toast.error('Lỗi khi tải dữ liệu dropdown');
        } finally {
            setLoadingDropdowns(false);
        }
    };

    // Load course offering data for edit mode
    const loadCourseOfferingData = async () => {
        if (!isEditMode) return;

        try {
            setLoading(true);
            setError(null);

            const response = await courseOfferingService.getCourseOfferingById(id);
            const courseOffering = response.result || response;

            // Map course offering data to form
            setFormData({
                id: courseOffering.id,
                maxStudents: courseOffering.maxStudents || '',
                currentStudents: courseOffering.currentStudents || 0,
                openTime: courseOffering.openTime ? new Date(courseOffering.openTime).toISOString().slice(0, 16) : '',
                closeTime: courseOffering.closeTime ? new Date(courseOffering.closeTime).toISOString().slice(0, 16) : '',
                courseId: courseOffering.courseResponse?.id || '',
                semesterId: courseOffering.semesterResponse?.id || '',
                teacherId: courseOffering.teacherResponse?.teacherId || ''
            });

        } catch (err) {
            setError('Không thể tải thông tin khóa học. Vui lòng thử lại.');
            console.error('Error loading course offering data:', err);
            toast.error('Lỗi khi tải thông tin khóa học');
        } finally {
            setLoading(false);
        }
    };

    // Initialize component
    useEffect(() => {
        loadDropdownData();
        if (isEditMode) {
            loadCourseOfferingData();
        }
    }, [id]);

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear specific field error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    // Form validation
    const validateForm = () => {
        const errors = {};

        // Required fields
        if (!formData.courseId) {
            errors.courseId = 'Vui lòng chọn môn học';
        }

        if (!formData.teacherId) {
            errors.teacherId = 'Vui lòng chọn giảng viên';
        }

        if (!formData.semesterId) {
            errors.semesterId = 'Vui lòng chọn học kỳ';
        }

        if (!formData.maxStudents) {
            errors.maxStudents = 'Số lượng sinh viên tối đa là bắt buộc';
        } else if (isNaN(formData.maxStudents) || parseInt(formData.maxStudents) <= 0) {
            errors.maxStudents = 'Số lượng sinh viên tối đa phải là số dương';
        } else if (parseInt(formData.maxStudents) > 500) {
            errors.maxStudents = 'Số lượng sinh viên tối đa không được vượt quá 500';
        }

        if (!formData.openTime) {
            errors.openTime = 'Thời gian mở đăng ký là bắt buộc';
        }

        if (!formData.closeTime) {
            errors.closeTime = 'Thời gian đóng đăng ký là bắt buộc';
        }

        // Date validation
        if (formData.openTime && formData.closeTime) {
            const openTime = new Date(formData.openTime);
            const closeTime = new Date(formData.closeTime);
            
            if (openTime >= closeTime) {
                errors.closeTime = 'Thời gian đóng phải sau thời gian mở';
            }

            // Check if times are in the past (only for new records)
            if (!isEditMode) {
                const now = new Date();
                if (openTime < now) {
                    errors.openTime = 'Thời gian mở không được trong quá khứ';
                }
            }
        }

        // Current students validation (for edit mode)
        if (isEditMode && formData.currentStudents && formData.maxStudents) {
            if (parseInt(formData.currentStudents) > parseInt(formData.maxStudents)) {
                errors.maxStudents = 'Số lượng tối đa không được nhỏ hơn số sinh viên hiện tại';
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại thông tin đã nhập');
            return;
        }

        try {
            setSaving(true);

            // Prepare request data
            const requestData = {
                id: isEditMode ? formData.id : null,
                maxStudents: parseInt(formData.maxStudents),
                currentStudents: isEditMode ? parseInt(formData.currentStudents) : 0,
                openTime: new Date(formData.openTime).toISOString(),
                closeTime: new Date(formData.closeTime).toISOString(),
                courseId: parseInt(formData.courseId),
                semesterId: parseInt(formData.semesterId),
                teacherId: parseInt(formData.teacherId)
            };

            console.log('Submitting course offering data:', requestData);

            const response = await courseOfferingService.saveCourseOffering(requestData);

            const successMessage = isEditMode
                ? 'Cập nhật khóa học thành công'
                : 'Tạo khóa học mới thành công';

            toast.success(successMessage);
            navigate('/admin/enrollment/course-offerings');

        } catch (err) {
            const errorMessage = isEditMode
                ? 'Lỗi khi cập nhật khóa học'
                : 'Lỗi khi tạo khóa học';

            toast.error(errorMessage);
            console.error('Error saving course offering:', err);
        } finally {
            setSaving(false);
        }
    };

    // Calculate registration duration
    const getRegistrationDuration = () => {
        if (!formData.openTime || !formData.closeTime) return '';
        
        const open = new Date(formData.openTime);
        const close = new Date(formData.closeTime);
        const diffTime = Math.abs(close - open);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        
        if (diffDays >= 1) {
            return `${diffDays} ngày`;
        } else {
            return `${diffHours} giờ`;
        }
    };

    if (loading || loadingDropdowns) {
        return (
            <MainLayout activeMenu="enrollment">
                <div className="container-fluid pt-3 pb-5">
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted">
                            {loading ? 'Đang tải thông tin...' : 'Đang tải dữ liệu dropdown...'}
                        </p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout activeMenu="enrollment">
            <div className="container-fluid pt-3 pb-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="h4 fw-bold text-dark">
                            {isEditMode ? 'Chỉnh Sửa Khóa Học' : 'Thêm Khóa Học Mới'}
                        </h2>
                        <p className="text-muted mb-0">
                            {isEditMode 
                                ? `Cập nhật thông tin khóa học #${id}` 
                                : 'Tạo khóa học mới trong hệ thống'
                            }
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-primary"
                            onClick={() => navigate('/admin/enrollment/course-offerings')}
                            disabled={saving}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                            Quay lại
                        </Button>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <Alert variant="danger" dismissible onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <Row>
                    <Col lg={10} className="mx-auto">
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-light border-0">
                                <h5 className="mb-0 d-flex align-items-center">
                                    <FontAwesomeIcon icon={isEditMode ? faEdit : faPlus} className="me-2 text-primary" />
                                    Thông Tin Khóa Học
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        {/* Course Selection */}
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="fw-medium">
                                                    Môn Học <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Select
                                                    value={formData.courseId}
                                                    onChange={(e) => handleInputChange('courseId', e.target.value)}
                                                    isInvalid={!!formErrors.courseId}
                                                    disabled={saving}
                                                >
                                                    <option value="">-- Chọn môn học --</option>
                                                    {courses.map((course) => (
                                                        <option key={course.id} value={course.id}>
                                                            {course.code} - {course.name} ({course.creditsTheory + course.creditsPractical} tín chỉ)
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    {formErrors.courseId}
                                                </Form.Control.Feedback>
                                                <Form.Text className="text-muted">
                                                    Chọn môn học sẽ được giảng dạy
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>

                                        {/* Teacher Selection */}
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="fw-medium">
                                                    Giảng Viên <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Select
                                                    value={formData.teacherId}
                                                    onChange={(e) => handleInputChange('teacherId', e.target.value)}
                                                    isInvalid={!!formErrors.teacherId}
                                                    disabled={saving}
                                                >
                                                    <option value="">-- Chọn giảng viên --</option>
                                                    {teachers.map((teacher) => (
                                                        <option key={teacher.teacherId} value={teacher.teacherId}>
                                                            {teacher.teacherCode} - {teacher.teacherName}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    {formErrors.teacherId}
                                                </Form.Control.Feedback>
                                                <Form.Text className="text-muted">
                                                    Chọn giảng viên phụ trách môn học
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        {/* Semester Selection */}
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="fw-medium">
                                                    Học Kỳ <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Select
                                                    value={formData.semesterId}
                                                    onChange={(e) => handleInputChange('semesterId', e.target.value)}
                                                    isInvalid={!!formErrors.semesterId}
                                                    disabled={saving}
                                                >
                                                    <option value="">-- Chọn học kỳ --</option>
                                                    {semesters.map((semester) => (
                                                        <option key={semester.id} value={semester.id}>
                                                            {semester.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    {formErrors.semesterId}
                                                </Form.Control.Feedback>
                                                <Form.Text className="text-muted">
                                                    Chọn học kỳ diễn ra khóa học
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>

                                        {/* Max Students */}
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="fw-medium">
                                                    Số Lượng Sinh Viên Tối Đa <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Nhập số lượng sinh viên tối đa"
                                                    value={formData.maxStudents}
                                                    onChange={(e) => handleInputChange('maxStudents', e.target.value)}
                                                    isInvalid={!!formErrors.maxStudents}
                                                    disabled={saving}
                                                    min="1"
                                                    max="500"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formErrors.maxStudents}
                                                </Form.Control.Feedback>
                                                <Form.Text className="text-muted">
                                                    Số lượng sinh viên tối đa có thể đăng ký (1-500)
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Current Students (Edit mode only) */}
                                    {isEditMode && (
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-4">
                                                    <Form.Label className="fw-medium">
                                                        Số Lượng Sinh Viên Hiện Tại
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        value={formData.currentStudents}
                                                        disabled={true}
                                                        className="bg-light"
                                                    />
                                                    <Form.Text className="text-muted">
                                                        Số lượng sinh viên đã đăng ký (tự động cập nhật)
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    )}

                                    <Row>
                                        {/* Open Time */}
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="fw-medium">
                                                    Thời Gian Mở Đăng Ký <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="datetime-local"
                                                    value={formData.openTime}
                                                    onChange={(e) => handleInputChange('openTime', e.target.value)}
                                                    isInvalid={!!formErrors.openTime}
                                                    disabled={saving}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formErrors.openTime}
                                                </Form.Control.Feedback>
                                                <Form.Text className="text-muted">
                                                    Thời điểm bắt đầu nhận đăng ký
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>

                                        {/* Close Time */}
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="fw-medium">
                                                    Thời Gian Đóng Đăng Ký <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="datetime-local"
                                                    value={formData.closeTime}
                                                    onChange={(e) => handleInputChange('closeTime', e.target.value)}
                                                    isInvalid={!!formErrors.closeTime}
                                                    disabled={saving}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formErrors.closeTime}
                                                </Form.Control.Feedback>
                                                <Form.Text className="text-muted">
                                                    Thời điểm kết thúc nhận đăng ký
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Duration Preview */}
                                    {formData.openTime && formData.closeTime && (
                                        <Row>
                                            <Col md={12}>
                                                <div className="bg-light rounded p-3 mb-4">
                                                    <h6 className="mb-2">
                                                        <FontAwesomeIcon icon={faClock} className="me-2" />
                                                        Thời Gian Đăng Ký
                                                    </h6>
                                                    <div className="text-muted">
                                                        <strong>Thời gian mở:</strong> {new Date(formData.openTime).toLocaleString('vi-VN')}
                                                    </div>
                                                    <div className="text-muted">
                                                        <strong>Thời gian đóng:</strong> {new Date(formData.closeTime).toLocaleString('vi-VN')}
                                                    </div>
                                                    <div className="text-muted">
                                                        <strong>Thời lượng:</strong> {getRegistrationDuration()}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="d-flex justify-content-end gap-2">
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => navigate('/admin/enrollment/course-offerings')}
                                            disabled={saving}
                                        >
                                            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                                            Hủy
                                        </Button>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <Spinner size="sm" animation="border" className="me-2" />
                                            ) : (
                                                <FontAwesomeIcon icon={faSave} className="me-1" />
                                            )}
                                            {isEditMode ? 'Cập nhật' : 'Tạo mới'}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </MainLayout>
    );
};

export default CourseOfferingUpdate;
