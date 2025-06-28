import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBuilding, faArrowLeft, faSave, faEdit, faPlus, 
    faExclamationTriangle, faCheckCircle 
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import departmentService from "../../services/departmentService.js";
import MainLayout from "../layout/main/MainLayout.jsx";

const DepartmentUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // State management
    const [formData, setFormData] = useState({
        id: null,
        name: ''
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    // Load department data for edit mode
    const loadDepartment = async () => {
        if (!isEditMode) return;

        try {
            setLoading(true);
            setError(null);

            const response = await departmentService.getDepartmentById(id);
            
            if (response.result) {
                setFormData({
                    id: response.result.id,
                    name: response.result.name || ''
                });
            } else {
                setError('Không tìm thấy thông tin khoa/phòng ban.');
            }
        } catch (err) {
            setError('Không thể tải thông tin khoa/phòng ban. Vui lòng thử lại.');
            console.error('Error loading department:', err);
            toast.error('Lỗi khi tải thông tin khoa/phòng ban');
        } finally {
            setLoading(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        if (isEditMode) {
            loadDepartment();
        }
    }, [id, isEditMode]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};

        // Name validation
        if (!formData.name.trim()) {
            errors.name = 'Tên khoa/phòng ban là bắt buộc';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Tên khoa/phòng ban phải có ít nhất 2 ký tự';
        } else if (formData.name.trim().length > 255) {
            errors.name = 'Tên khoa/phòng ban không được vượt quá 255 ký tự';
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
            setError(null);

            // Prepare data for API
            const departmentData = {
                name: formData.name.trim()
            };

            // Add ID for edit mode
            if (isEditMode) {
                departmentData.id = formData.id;
            }

            const response = await departmentService.saveDepartment(departmentData);

            if (response.result) {
                toast.success(
                    isEditMode 
                        ? 'Cập nhật khoa/phòng ban thành công!' 
                        : 'Tạo khoa/phòng ban mới thành công!'
                );
                navigate('/admin/academic/departments');
            } else {
                throw new Error('Không nhận được phản hồi từ server');
            }
        } catch (err) {
            console.error('Error saving department:', err);
            setError(
                isEditMode 
                    ? 'Lỗi khi cập nhật khoa/phòng ban. Vui lòng thử lại.' 
                    : 'Lỗi khi tạo khoa/phòng ban. Vui lòng thử lại.'
            );
            toast.error(
                isEditMode 
                    ? 'Lỗi khi cập nhật khoa/phòng ban' 
                    : 'Lỗi khi tạo khoa/phòng ban'
            );
        } finally {
            setSaving(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        if (formData.name.trim() && window.confirm('Bạn có chắc chắn muốn hủy? Các thay đổi sẽ không được lưu.')) {
            navigate('/admin/academic/departments');
        } else if (!formData.name.trim()) {
            navigate('/admin/academic/departments');
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="container-fluid">
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <div className="mt-2 text-muted">Đang tải thông tin khoa/phòng ban...</div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container-fluid">
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold text-primary">
                        <FontAwesomeIcon icon={faBuilding} className="me-2" />
                        {isEditMode ? `Chỉnh Sửa Khoa/Phòng Ban #${id}` : 'Thêm Khoa/Phòng Ban Mới'}
                    </h2>
                    <Button
                        variant="outline-secondary"
                        onClick={() => navigate('/admin/academic/departments')}
                        disabled={saving}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                        Quay lại
                    </Button>
                </div>

                {/* Error Alert */}
                {error && (
                    <Alert variant="danger" className="mb-4">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                        {error}
                    </Alert>
                )}

                <Row>
                    <Col lg={8} className="mx-auto">
                        <Card>
                            <Card.Header>
                                <h5 className="mb-0">
                                    <FontAwesomeIcon icon={isEditMode ? faEdit : faPlus} className="me-2" />
                                    Thông Tin Khoa/Phòng Ban
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="fw-semibold">
                                                    Tên Khoa/Phòng Ban <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="Nhập tên khoa/phòng ban..."
                                                    disabled={saving}
                                                    isInvalid={!!formErrors.name}
                                                    className={formErrors.name ? 'is-invalid' : ''}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formErrors.name}
                                                </Form.Control.Feedback>
                                                <Form.Text className="text-muted">
                                                    Tên khoa/phòng ban phải có từ 2-255 ký tự
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Form Actions */}
                                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                        <Button 
                                            variant="outline-secondary"
                                            onClick={handleCancel}
                                            disabled={saving}
                                        >
                                            Hủy
                                        </Button>
                                        <Button 
                                            variant="success"
                                            type="submit"
                                            disabled={saving || !formData.name.trim()}
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
                                                    {isEditMode ? 'Cập Nhật' : 'Tạo Mới'}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </Form>

                                {/* Help Text */}
                                <div className="mt-4 pt-3 border-top">
                                    <div className="d-flex align-items-start">
                                        <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2 mt-1" />
                                        <div>
                                            <h6 className="mb-1">Lưu ý khi {isEditMode ? 'chỉnh sửa' : 'tạo'} khoa/phòng ban:</h6>
                                            <ul className="mb-0 text-muted small">
                                                <li>Tên khoa/phòng ban phải là duy nhất trong hệ thống</li>
                                                <li>Sau khi tạo, bạn có thể thêm ngành học và thành viên cho khoa</li>
                                                {isEditMode && <li>Việc thay đổi tên có thể ảnh hưởng đến các báo cáo hiện có</li>}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </MainLayout>
    );
};

export default DepartmentUpdate; 