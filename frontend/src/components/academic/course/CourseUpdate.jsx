import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Form, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBook, faCode, faGraduationCap, faArrowLeft, faSave,
    faPlus, faEdit, faInfoCircle, faAward, faCertificate
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import { courseService } from "../../../services/apiService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

const CourseUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // State management
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // Form data state
    const [formData, setFormData] = useState({
        id: null,
        code: '',
        name: '',
        creditsTheory: '',
        creditsPractical: '',
        courseType: ''
    });

    // Form validation state
    const [formErrors, setFormErrors] = useState({});

    // Course type options
    const courseTypeOptions = [
        { value: 'CORE', label: 'Môn cơ sở', icon: faAward },
        { value: 'SPECIALIZED', label: 'Môn chuyên ngành', icon: faCertificate },
        { value: 'ELECTIVE', label: 'Môn tự chọn', icon: faGraduationCap },
        { value: 'GENERAL', label: 'Môn chung', icon: faBook }
    ];

    // Load course data for edit mode
    const loadCourseData = async () => {
        if (!isEditMode) return;

        try {
            setLoading(true);
            setError(null);

            const response = await courseService.getCourseById(id);
            const course = response.result || response;

            // Map course data to form
            setFormData({
                id: course.id,
                code: course.code || '',
                name: course.name || '',
                creditsTheory: course.creditsTheory || '',
                creditsPractical: course.creditsPractical || '',
                courseType: course.courseType || ''
            });

        } catch (err) {
            setError('Không thể tải thông tin môn học. Vui lòng thử lại.');
            console.error('Error loading course data:', err);
            toast.error('Lỗi khi tải thông tin môn học');
        } finally {
            setLoading(false);
        }
    };

    // Initialize component
    useEffect(() => {
        if (isEditMode) {
            loadCourseData();
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

        // Course code validation
        if (!formData.code.trim()) {
            errors.code = 'Mã môn học là bắt buộc';
        } else if (formData.code.length < 2 || formData.code.length > 20) {
            errors.code = 'Mã môn học phải từ 2-20 ký tự';
        }

        // Course name validation
        if (!formData.name.trim()) {
            errors.name = 'Tên môn học là bắt buộc';
        } else if (formData.name.length < 2 || formData.name.length > 255) {
            errors.name = 'Tên môn học phải từ 2-255 ký tự';
        }

        // Course type validation
        if (!formData.courseType) {
            errors.courseType = 'Loại môn học là bắt buộc';
        }

        // Credits validation
        const theoryCredits = parseInt(formData.creditsTheory) || 0;
        const practicalCredits = parseInt(formData.creditsPractical) || 0;

        if (theoryCredits < 0 || theoryCredits > 10) {
            errors.creditsTheory = 'Tín chỉ lý thuyết phải từ 0-10';
        }

        if (practicalCredits < 0 || practicalCredits > 10) {
            errors.creditsPractical = 'Tín chỉ thực hành phải từ 0-10';
        }

        if (theoryCredits + practicalCredits === 0) {
            errors.creditsTheory = 'Môn học phải có ít nhất 1 tín chỉ';
        }

        if (theoryCredits + practicalCredits > 10) {
            errors.creditsPractical = 'Tổng số tín chỉ không được vượt quá 10';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra và sửa các lỗi trong form');
            return;
        }

        try {
            setSaving(true);

            const submitData = {
                ...formData,
                creditsTheory: parseInt(formData.creditsTheory) || 0,
                creditsPractical: parseInt(formData.creditsPractical) || 0
            };

            const response = await courseService.saveCourse(submitData);
            
            if (response && response.result) {
                const successMessage = isEditMode ? 'Cập nhật môn học thành công!' : 'Tạo môn học mới thành công!';
                toast.success(successMessage);
                navigate('/admin/academic/courses');
            }
        } catch (err) {
            console.error('Error saving course:', err);
            const errorMessage = isEditMode ? 'Lỗi khi cập nhật môn học' : 'Lỗi khi tạo môn học mới';
            toast.error(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    // Get course type icon
    const getCourseTypeIcon = (courseType) => {
        const option = courseTypeOptions.find(opt => opt.value === courseType);
        return option ? option.icon : faBook;
    };

    // Calculate total credits
    const totalCredits = (parseInt(formData.creditsTheory) || 0) + (parseInt(formData.creditsPractical) || 0);

    if (loading) {
        return (
            <MainLayout activeMenu="courses">
                <div className="container-fluid pt-3 pb-5">
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted">Đang tải thông tin môn học...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout activeMenu="courses">
            <div className="container-fluid pt-3 pb-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="h4 fw-bold text-dark">
                            {isEditMode ? 'Chỉnh Sửa Môn Học' : 'Thêm Môn Học Mới'}
                        </h2>
                        <p className="text-muted mb-0">
                            {isEditMode ? `Cập nhật thông tin cho môn học ${formData.name || formData.code}` : 'Tạo môn học mới trong hệ thống'}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-secondary"
                            onClick={() => navigate('/admin/academic/courses')}
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

                <form onSubmit={handleSubmit}>
                    <Row>
                        {/* Main Form - Left Side */}
                        <Col lg={8} className="mb-4">
                            <Card className="border-0 shadow-sm">
                                <Card.Header className="bg-light border-0">
                                    <h5 className="mb-0 d-flex align-items-center">
                                        <FontAwesomeIcon icon={faBook} className="me-2 text-primary" />
                                        Thông Tin Môn Học
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        {/* Course Code */}
                                        <Col md={6} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="fw-medium">
                                                    Mã Môn Học <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập mã môn học (VD: CS101)"
                                                    value={formData.code}
                                                    onChange={(e) => handleInputChange('code', e.target.value)}
                                                    isInvalid={!!formErrors.code}
                                                    disabled={saving}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formErrors.code}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>

                                        {/* Course Type */}
                                        <Col md={6} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="fw-medium">
                                                    Loại Môn Học <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Select
                                                    value={formData.courseType}
                                                    onChange={(e) => handleInputChange('courseType', e.target.value)}
                                                    isInvalid={!!formErrors.courseType}
                                                    disabled={saving}
                                                >
                                                    <option value="">Chọn loại môn học</option>
                                                    {courseTypeOptions.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    {formErrors.courseType}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>

                                        {/* Course Name */}
                                        <Col xs={12} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="fw-medium">
                                                    Tên Môn Học <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập tên môn học"
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    isInvalid={!!formErrors.name}
                                                    disabled={saving}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formErrors.name}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>

                                        {/* Theory Credits */}
                                        <Col md={6} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="fw-medium">
                                                    Tín Chỉ Lý Thuyết <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min="0"
                                                    max="10"
                                                    placeholder="0"
                                                    value={formData.creditsTheory}
                                                    onChange={(e) => handleInputChange('creditsTheory', e.target.value)}
                                                    isInvalid={!!formErrors.creditsTheory}
                                                    disabled={saving}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formErrors.creditsTheory}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>

                                        {/* Practical Credits */}
                                        <Col md={6} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="fw-medium">
                                                    Tín Chỉ Thực Hành <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min="0"
                                                    max="10"
                                                    placeholder="0"
                                                    value={formData.creditsPractical}
                                                    onChange={(e) => handleInputChange('creditsPractical', e.target.value)}
                                                    isInvalid={!!formErrors.creditsPractical}
                                                    disabled={saving}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formErrors.creditsPractical}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Preview - Right Side */}
                        <Col lg={4} className="mb-4">
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Header className="bg-light border-0">
                                    <h5 className="mb-0 d-flex align-items-center">
                                        <FontAwesomeIcon icon={faInfoCircle} className="me-2 text-info" />
                                        Xem Trước
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <div className="mb-3">
                                        <small className="text-muted">Mã môn học</small>
                                        <p className="fw-bold mb-0">
                                            {formData.code || <em className="text-muted">Chưa nhập</em>}
                                        </p>
                                    </div>
                                    <div className="mb-3">
                                        <small className="text-muted">Tên môn học</small>
                                        <p className="fw-bold mb-0">
                                            {formData.name || <em className="text-muted">Chưa nhập</em>}
                                        </p>
                                    </div>
                                    <div className="mb-3">
                                        <small className="text-muted">Loại môn học</small>
                                        <p className="fw-bold mb-0">
                                            {formData.courseType ? (
                                                <Badge bg="primary">
                                                    <FontAwesomeIcon 
                                                        icon={getCourseTypeIcon(formData.courseType)} 
                                                        className="me-1" 
                                                    />
                                                    {courseTypeOptions.find(opt => opt.value === formData.courseType)?.label}
                                                </Badge>
                                            ) : (
                                                <em className="text-muted">Chưa chọn</em>
                                            )}
                                        </p>
                                    </div>
                                    <div className="mb-3">
                                        <small className="text-muted">Tổng tín chỉ</small>
                                        <p className="fw-bold mb-0">
                                            <Badge bg={totalCredits > 0 ? "success" : "secondary"}>
                                                {totalCredits} tín chỉ
                                            </Badge>
                                        </p>
                                    </div>
                                    <div>
                                        <small className="text-muted">Cấu trúc</small>
                                        <p className="fw-bold mb-0">
                                            {(parseInt(formData.creditsTheory) || 0)} LT + {(parseInt(formData.creditsPractical) || 0)} TH
                                        </p>
                                    </div>

                                    {totalCredits > 0 && (
                                        <div className="mt-4">
                                            <small className="text-muted">Phân bổ tín chỉ</small>
                                            <div className="progress mt-1" style={{ height: '8px' }}>
                                                <div 
                                                    className="progress-bar bg-primary" 
                                                    style={{ width: `${((parseInt(formData.creditsTheory) || 0) / totalCredits) * 100}%` }}
                                                ></div>
                                                <div 
                                                    className="progress-bar bg-success" 
                                                    style={{ width: `${((parseInt(formData.creditsPractical) || 0) / totalCredits) * 100}%` }}
                                                ></div>
                                            </div>
                                            <div className="d-flex justify-content-between mt-1">
                                                <small className="text-muted">
                                                    {Math.round(((parseInt(formData.creditsTheory) || 0) / totalCredits) * 100)}% LT
                                                </small>
                                                <small className="text-muted">
                                                    {Math.round(((parseInt(formData.creditsPractical) || 0) / totalCredits) * 100)}% TH
                                                </small>
                                            </div>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Form Actions */}
                    <Row>
                        <Col xs={12}>
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="text-muted">
                                            <small>
                                                <span className="text-danger">*</span> Các trường bắt buộc
                                            </small>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="outline-secondary"
                                                onClick={() => navigate('/admin/academic/courses')}
                                                disabled={saving}
                                            >
                                                <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                                                Hủy
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                disabled={saving}
                                            >
                                                {saving ? (
                                                    <>
                                                        <Spinner
                                                            as="span"
                                                            animation="border"
                                                            size="sm"
                                                            role="status"
                                                            className="me-1"
                                                        />
                                                        Đang lưu...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon 
                                                            icon={isEditMode ? faEdit : faPlus} 
                                                            className="me-1" 
                                                        />
                                                        {isEditMode ? 'Cập Nhật' : 'Tạo Mới'}
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </form>
            </div>
        </MainLayout>
    );
};

export default CourseUpdate; 