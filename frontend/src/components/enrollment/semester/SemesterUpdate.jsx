import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendarAlt, faArrowLeft, faSave, faEdit, faPlus
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import semesterService from "../../../services/semesterService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

const SemesterUpdate = () => {
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
        name: '',
        startDate: '',
        endDate: ''
    });

    // Form validation state
    const [formErrors, setFormErrors] = useState({});

    // Load semester data for edit mode
    const loadSemesterData = async () => {
        if (!isEditMode) return;

        try {
            setLoading(true);
            setError(null);

            const response = await semesterService.getSemesterById(id);
            const semester = response.result || response;

            // Map semester data to form
            setFormData({
                id: semester.id,
                name: semester.name || '',
                startDate: semester.startDate || '',
                endDate: semester.endDate || ''
            });

        } catch (err) {
            setError('Không thể tải thông tin học kỳ. Vui lòng thử lại.');
            console.error('Error loading semester data:', err);
            toast.error('Lỗi khi tải thông tin học kỳ');
        } finally {
            setLoading(false);
        }
    };

    // Initialize component
    useEffect(() => {
        if (isEditMode) {
            loadSemesterData();
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
        if (!formData.name.trim()) {
            errors.name = 'Tên học kỳ là bắt buộc';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Tên học kỳ phải có ít nhất 2 ký tự';
        } else if (formData.name.trim().length > 255) {
            errors.name = 'Tên học kỳ không được vượt quá 255 ký tự';
        }

        if (!formData.startDate) {
            errors.startDate = 'Ngày bắt đầu là bắt buộc';
        }

        if (!formData.endDate) {
            errors.endDate = 'Ngày kết thúc là bắt buộc';
        }

        // Date validation
        if (formData.startDate && formData.endDate) {
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);
            
            if (startDate >= endDate) {
                errors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
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
                name: formData.name.trim(),
                startDate: formData.startDate,
                endDate: formData.endDate
            };

            const response = await semesterService.saveSemester(requestData);

            const successMessage = isEditMode
                ? 'Cập nhật thông tin học kỳ thành công'
                : 'Tạo học kỳ mới thành công';

            toast.success(successMessage);
            navigate('/admin/enrollment/semesters');

        } catch (err) {
            const errorMessage = isEditMode
                ? 'Lỗi khi cập nhật học kỳ'
                : 'Lỗi khi tạo học kỳ';

            toast.error(errorMessage);
            console.error('Error saving semester:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <MainLayout activeMenu="enrollment">
                <div className="container-fluid pt-3 pb-5">
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted">Đang tải thông tin...</p>
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
                            {isEditMode ? 'Chỉnh Sửa Học Kỳ' : 'Thêm Học Kỳ Mới'}
                        </h2>
                        <p className="text-muted mb-0">
                            {isEditMode 
                                ? `Cập nhật thông tin học kỳ #${id}` 
                                : 'Tạo học kỳ mới trong hệ thống'
                            }
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-primary"
                            onClick={() => navigate('/admin/enrollment/semesters')}
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
                    <Col lg={8} className="mx-auto">
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-light border-0">
                                <h5 className="mb-0 d-flex align-items-center">
                                    <FontAwesomeIcon icon={isEditMode ? faEdit : faPlus} className="me-2 text-primary" />
                                    Thông Tin Học Kỳ
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="fw-medium">
                                                    Tên Học Kỳ <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập tên học kỳ (ví dụ: Học kỳ 1 năm 2024)"
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    isInvalid={!!formErrors.name}
                                                    disabled={saving}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formErrors.name}
                                                </Form.Control.Feedback>
                                                <Form.Text className="text-muted">
                                                    Tên học kỳ sẽ hiển thị trong toàn bộ hệ thống
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="fw-medium">
                                                    Ngày Bắt Đầu <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={formData.startDate}
                                                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                                                    isInvalid={!!formErrors.startDate}
                                                    disabled={saving}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formErrors.startDate}
                                                </Form.Control.Feedback>
                                                <Form.Text className="text-muted">
                                                    Ngày bắt đầu chính thức của học kỳ
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="fw-medium">
                                                    Ngày Kết Thúc <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={formData.endDate}
                                                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                                                    isInvalid={!!formErrors.endDate}
                                                    disabled={saving}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formErrors.endDate}
                                                </Form.Control.Feedback>
                                                <Form.Text className="text-muted">
                                                    Ngày kết thúc chính thức của học kỳ
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Duration Preview */}
                                    {formData.startDate && formData.endDate && (
                                        <Row>
                                            <Col md={12}>
                                                <div className="bg-light rounded p-3 mb-4">
                                                    <h6 className="mb-2">
                                                        <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                                                        Thời Gian Học Kỳ
                                                    </h6>
                                                    <div className="text-muted">
                                                        Từ <strong>{new Date(formData.startDate).toLocaleDateString('vi-VN')}</strong> đến <strong>{new Date(formData.endDate).toLocaleDateString('vi-VN')}</strong>
                                                        {(() => {
                                                            const start = new Date(formData.startDate);
                                                            const end = new Date(formData.endDate);
                                                            const diffTime = Math.abs(end - start);
                                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                            
                                                            if (diffDays > 0) {
                                                                const months = Math.floor(diffDays / 30);
                                                                const days = diffDays % 30;
                                                                return ` (${months > 0 ? `${months} tháng ` : ''}${days} ngày)`;
                                                            }
                                                            return '';
                                                        })()}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="d-flex justify-content-end gap-2">
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => navigate('/admin/enrollment/semesters')}
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

export default SemesterUpdate;
