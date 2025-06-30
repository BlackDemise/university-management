import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faGraduationCap, faArrowLeft, faSave, faEdit, faPlus
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import { majorService } from "../../../services/apiService.js";
import departmentService from "../../../services/departmentService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

const MajorUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // State management
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [loadingDepartments, setLoadingDepartments] = useState(true);

    // Form data state
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        totalCreditsRequired: '',
        departmentId: ''
    });

    // Form validation state
    const [formErrors, setFormErrors] = useState({});

    // Load departments for dropdown
    const loadDepartments = async () => {
        try {
            setLoadingDepartments(true);
            const response = await departmentService.getAllDepartments();
            
            if (response.result) {
                setDepartments(response.result || []);
            } else {
                setDepartments(response || []);
            }
        } catch (err) {
            console.error('Error loading departments:', err);
            toast.error('Lỗi khi tải danh sách khoa');
            setDepartments([]);
        } finally {
            setLoadingDepartments(false);
        }
    };

    // Load major data for edit mode
    const loadMajorData = async () => {
        if (!isEditMode) return;

        try {
            setLoading(true);
            setError(null);

            const response = await majorService.getMajorById(id);
            const major = response.result || response;

            // Map major data to form
            setFormData({
                id: major.id,
                name: major.name || '',
                totalCreditsRequired: major.totalCreditsRequired || '',
                departmentId: major.departmentResponse?.id || ''
            });

        } catch (err) {
            setError('Không thể tải thông tin ngành học. Vui lòng thử lại.');
            console.error('Error loading major data:', err);
            toast.error('Lỗi khi tải thông tin ngành học');
        } finally {
            setLoading(false);
        }
    };

    // Initialize component
    useEffect(() => {
        const initializeComponent = async () => {
            await loadDepartments();
            if (isEditMode) {
                await loadMajorData();
            }
        };
        
        initializeComponent();
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
            errors.name = 'Tên ngành học là bắt buộc';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Tên ngành học phải có ít nhất 2 ký tự';
        } else if (formData.name.trim().length > 255) {
            errors.name = 'Tên ngành học không được vượt quá 255 ký tự';
        }

        if (!formData.departmentId) {
            errors.departmentId = 'Khoa là bắt buộc';
        }

        if (formData.totalCreditsRequired) {
            const credits = parseInt(formData.totalCreditsRequired);
            if (isNaN(credits) || credits < 0) {
                errors.totalCreditsRequired = 'Số tín chỉ phải là số nguyên dương';
            } else if (credits > 300) {
                errors.totalCreditsRequired = 'Số tín chỉ không được vượt quá 300';
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
                departmentId: parseInt(formData.departmentId)
            };

            // Add totalCreditsRequired if provided
            if (formData.totalCreditsRequired) {
                requestData.totalCreditsRequired = parseInt(formData.totalCreditsRequired);
            }

            const response = await majorService.saveMajor(requestData);

            const successMessage = isEditMode
                ? 'Cập nhật thông tin ngành học thành công'
                : 'Tạo ngành học mới thành công';

            toast.success(successMessage);
            navigate('/admin/academic/majors');

        } catch (err) {
            const errorMessage = isEditMode
                ? 'Lỗi khi cập nhật ngành học'
                : 'Lỗi khi tạo ngành học';

            toast.error(errorMessage);
            console.error('Error saving major:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading || loadingDepartments) {
        return (
            <MainLayout activeMenu="academic">
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
        <MainLayout activeMenu="academic">
            <div className="container-fluid pt-3 pb-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="h4 fw-bold text-dark">
                            {isEditMode ? 'Chỉnh Sửa Ngành Học' : 'Thêm Ngành Học Mới'}
                        </h2>
                        <p className="text-muted mb-0">
                            {isEditMode 
                                ? `Cập nhật thông tin ngành học #${id}` 
                                : 'Tạo ngành học mới trong hệ thống'
                            }
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-primary"
                            onClick={() => navigate('/admin/academic/majors')}
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
                                    Thông Tin Ngành Học
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="fw-medium">
                                                    Tên Ngành Học <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    placeholder="Nhập tên ngành học..."
                                                    disabled={saving}
                                                    isInvalid={!!formErrors.name}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formErrors.name}
                                                </Form.Control.Feedback>
                                                <Form.Text className="text-muted">
                                                    Tên ngành học phải có từ 2-255 ký tự
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="fw-medium">
                                                    Khoa <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Select
                                                    value={formData.departmentId}
                                                    onChange={(e) => handleInputChange('departmentId', e.target.value)}
                                                    disabled={saving}
                                                    isInvalid={!!formErrors.departmentId}
                                                >
                                                    <option value="">Chọn khoa...</option>
                                                    {departments.map(dept => (
                                                        <option key={dept.id} value={dept.id}>
                                                            {dept.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    {formErrors.departmentId}
                                                </Form.Control.Feedback>
                                                <Form.Text className="text-muted">
                                                    Chọn khoa mà ngành học này thuộc về
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="fw-medium">
                                                    Tổng Số Tín Chỉ Yêu Cầu
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={formData.totalCreditsRequired}
                                                    onChange={(e) => handleInputChange('totalCreditsRequired', e.target.value)}
                                                    placeholder="Nhập số tín chỉ..."
                                                    disabled={saving}
                                                    isInvalid={!!formErrors.totalCreditsRequired}
                                                    min="0"
                                                    max="300"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formErrors.totalCreditsRequired}
                                                </Form.Control.Feedback>
                                                <Form.Text className="text-muted">
                                                    Số tín chỉ cần thiết để tốt nghiệp (0-300)
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Form Actions */}
                                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                        <Button 
                                            variant="outline-secondary"
                                            onClick={() => navigate('/admin/academic/majors')}
                                            disabled={saving}
                                        >
                                            Hủy
                                        </Button>
                                        <Button 
                                            variant="primary"
                                            type="submit"
                                            disabled={saving || !formData.name.trim() || !formData.departmentId}
                                        >
                                            {saving ? (
                                                <>
                                                    <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        className="me-2"
                                                    />
                                                    {isEditMode ? 'Đang cập nhật...' : 'Đang tạo...'}
                                                </>
                                            ) : (
                                                <>
                                                    <FontAwesomeIcon icon={faSave} className="me-2" />
                                                    {isEditMode ? 'Cập nhật' : 'Tạo mới'}
                                                </>
                                            )}
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

export default MajorUpdate; 