import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Row, Col, Alert, Spinner, Badge, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBuilding, faArrowLeft, faEdit, faIdCard, 
    faGraduationCap, faUsers, faCalendarAlt, faInfoCircle 
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import departmentService from "../../../services/departmentService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

const DepartmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State management
    const [department, setDepartment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load department data
    const loadDepartment = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await departmentService.getDepartmentById(id);
            
            if (response.result) {
                setDepartment(response.result);
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
        if (id) {
            loadDepartment();
        }
    }, [id]);

    const handleEdit = () => {
        navigate(`/admin/academic/departments/edit/${id}`);
    };

    const handleRetry = () => {
        loadDepartment();
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

    if (error) {
        return (
            <MainLayout>
                <div className="container-fluid">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold text-primary">
                            <FontAwesomeIcon icon={faBuilding} className="me-2" />
                            Chi Tiết Khoa/Phòng Ban
                        </h2>
                        <Button
                            variant="outline-secondary"
                            onClick={() => navigate('/admin/academic/departments')}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                            Quay lại
                        </Button>
                    </div>

                    <Alert variant="danger" className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                        <div className="flex-grow-1">{error}</div>
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={handleRetry}
                        >
                            Thử lại
                        </Button>
                    </Alert>
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
                        Chi Tiết Khoa/Phòng Ban
                    </h2>
                    <div className="d-flex gap-2">
                        <Button
                            variant="warning"
                            onClick={handleEdit}
                        >
                            <FontAwesomeIcon icon={faEdit} className="me-2" />
                            Chỉnh sửa
                        </Button>
                        <Button
                            variant="outline-secondary"
                            onClick={() => navigate('/admin/academic/departments')}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                            Quay lại
                        </Button>
                    </div>
                </div>

                <Row>
                    <Col lg={8}>
                        {/* Main Information Card */}
                        <Card className="mb-4">
                            <Card.Header>
                                <h5 className="mb-0">
                                    <FontAwesomeIcon icon={faIdCard} className="me-2" />
                                    Thông Tin Cơ Bản
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">ID Khoa/Phòng Ban</label>
                                            <div className="fw-bold text-primary fs-5">#{department.id}</div>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">Tên Khoa/Phòng Ban</label>
                                            <div className="fw-bold fs-5">{department.name}</div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Related Information - Placeholders for future implementation */}
                        <Card className="mb-4">
                            <Card.Header>
                                <h5 className="mb-0">
                                    <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                                    Ngành Học Thuộc Khoa
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="text-center py-4">
                                    <FontAwesomeIcon icon={faGraduationCap} size="2x" className="text-muted mb-2" />
                                    <p className="text-muted mb-0">Danh sách ngành học sẽ được hiển thị sau khi Major service được tích hợp</p>
                                </div>
                            </Card.Body>
                        </Card>

                        <Card>
                            <Card.Header>
                                <h5 className="mb-0">
                                    <FontAwesomeIcon icon={faUsers} className="me-2" />
                                    Thành Viên Khoa
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="text-center py-4">
                                    <FontAwesomeIcon icon={faUsers} size="2x" className="text-muted mb-2" />
                                    <p className="text-muted mb-0">Danh sách thành viên khoa sẽ được hiển thị sau khi DepartmentMember service được tích hợp</p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4}>
                        {/* Quick Info Card */}
                        <Card className="mb-4">
                            <Card.Header>
                                <h6 className="mb-0">
                                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                                    Thông Tin Tóm Tắt
                                </h6>
                            </Card.Header>
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-muted">ID:</span>
                                    <Badge bg="primary" className="fs-6">#{department.id}</Badge>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-muted">Trạng thái:</span>
                                    <Badge bg="success">Hoạt động</Badge>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-muted">Ngành học:</span>
                                    <span className="fw-semibold">-</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-muted">Thành viên:</span>
                                    <span className="fw-semibold">-</span>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Action Card */}
                        <Card>
                            <Card.Header>
                                <h6 className="mb-0">Thao Tác</h6>
                            </Card.Header>
                            <Card.Body>
                                <div className="d-grid gap-2">
                                    <Button 
                                        variant="warning" 
                                        onClick={handleEdit}
                                        className="w-100"
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="me-2" />
                                        Chỉnh Sửa Thông Tin
                                    </Button>
                                    <Button 
                                        variant="outline-info" 
                                        disabled
                                        className="w-100"
                                    >
                                        <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                                        Xem Ngành Học
                                    </Button>
                                    <Button 
                                        variant="outline-info" 
                                        disabled
                                        className="w-100"
                                    >
                                        <FontAwesomeIcon icon={faUsers} className="me-2" />
                                        Quản Lý Thành Viên
                                    </Button>
                                </div>
                                <small className="text-muted mt-2 d-block">
                                    * Một số tính năng sẽ được bổ sung sau
                                </small>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </MainLayout>
    );
};

export default DepartmentDetails; 