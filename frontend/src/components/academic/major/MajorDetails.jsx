import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faGraduationCap, faArrowLeft, faEdit, faIdCard, faInfoCircle,
    faBuilding, faBook, faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import { majorService } from "../../../services/apiService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

const MajorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State management
    const [major, setMajor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isNotFound, setIsNotFound] = useState(false);

    // Load major details
    const loadMajorDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            setIsNotFound(false);

            const response = await majorService.getMajorById(id);
            
            if (response.result) {
                setMajor(response.result);
            } else {
                setMajor(response);
            }
        } catch (err) {
            console.error('Error loading major details:', err);
            
            // Check if it's a 404 error (major not found)
            if (err.response && err.response.status === 404) {
                setIsNotFound(true);
                setError(null);
            } else {
                // Other types of errors
                setError('Không thể tải thông tin ngành học. Vui lòng thử lại.');
                setIsNotFound(false);
                toast.error('Lỗi khi tải thông tin ngành học');
            }
        } finally {
            setLoading(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        if (id) {
            loadMajorDetails();
        }
    }, [id]);

    if (loading) {
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

    if (error) {
        return (
            <MainLayout activeMenu="academic">
                <div className="container-fluid pt-3 pb-5">
                    <Alert variant="danger">
                        {error}
                    </Alert>
                    <Button variant="outline-primary" onClick={() => navigate('/admin/academic/majors')}>
                        <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                        Quay lại danh sách
                    </Button>
                </div>
            </MainLayout>
        );
    }

    if (isNotFound) {
        return (
            <MainLayout activeMenu="academic">
                <div className="container-fluid pt-3 pb-5">
                    <div className="text-center py-5">
                        <div className="mb-4">
                            <FontAwesomeIcon 
                                icon={faGraduationCap} 
                                size="5x" 
                                className="text-muted opacity-50" 
                            />
                        </div>
                        <h3 className="text-muted mb-3">Không Tìm Thấy Ngành Học</h3>
                        <p className="text-muted mb-4">
                            Ngành học với ID <code>#{id}</code> không tồn tại trong hệ thống.
                        </p>
                        <div className="d-flex gap-2 justify-content-center">
                            <Button 
                                variant="primary" 
                                onClick={() => navigate('/admin/academic/majors')}
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
        <MainLayout activeMenu="academic">
            <div className="container-fluid pt-3 pb-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="h4 fw-bold text-dark">Chi Tiết Ngành Học</h2>
                        <p className="text-muted mb-0">
                            Thông tin chi tiết của {major.name}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-primary"
                            onClick={() => navigate('/admin/academic/majors')}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                            Quay lại
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => navigate(`/admin/academic/majors/edit/${major.id}`)}
                        >
                            <FontAwesomeIcon icon={faEdit} className="me-1" />
                            Chỉnh sửa
                        </Button>
                    </div>
                </div>

                <Row>
                    {/* Core Information - Full Width */}
                    <Col lg={12} className="mb-4">
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-light border-0">
                                <h5 className="mb-0 d-flex align-items-center">
                                    <FontAwesomeIcon icon={faGraduationCap} className="me-2 text-primary" />
                                    Thông Tin Cơ Bản
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    {/* Basic Major Information - Left Side */}
                                    <Col md={8}>
                                        <Row>
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <label className="text-muted small mb-1">ID</label>
                                                    <div className="fw-medium">#{major.id}</div>
                                                </div>
                                                
                                                <div className="mb-3">
                                                    <label className="text-muted small mb-1">Tên Ngành Học</label>
                                                    <div className="fw-medium fs-5">{major.name}</div>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="text-muted small mb-1">
                                                        <FontAwesomeIcon icon={faBuilding} className="me-1" />
                                                        Khoa
                                                    </label>
                                                    <div className="text-primary">
                                                        {major.departmentResponse?.name || 'Chưa xác định'}
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="text-muted small mb-1">Trạng Thái</label>
                                                    <div>
                                                        <Badge bg="success" className="px-3 py-2">
                                                            <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                                                            Hoạt động
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <label className="text-muted small mb-1">
                                                        <FontAwesomeIcon icon={faBook} className="me-1" />
                                                        Tổng Số Tín Chỉ Yêu Cầu
                                                    </label>
                                                    <div>
                                                        <Badge bg="info" className="px-3 py-2">
                                                            {major.totalCreditsRequired || 0} tín chỉ
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="text-muted small mb-1">
                                                        <FontAwesomeIcon icon={faIdCard} className="me-1" />
                                                        ID Khoa
                                                    </label>
                                                    <div className="text-muted">
                                                        #{major.departmentResponse?.id || 'N/A'}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>

                                    {/* Quick Info - Right Side */}
                                    <Col md={4}>
                                        <div className="bg-light rounded p-3">
                                            <h6 className="fw-bold mb-3">
                                                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                                                Thông Tin Tóm Tắt
                                            </h6>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="text-muted small">ID:</span>
                                                <Badge bg="primary">#{major.id}</Badge>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="text-muted small">Trạng thái:</span>
                                                <Badge bg="success">Hoạt động</Badge>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="text-muted small">Tín chỉ:</span>
                                                <Badge bg="info">{major.totalCreditsRequired || 0}</Badge>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="text-muted small">Khoa:</span>
                                                <span className="small text-truncate" style={{maxWidth: '100px'}}>
                                                    {major.departmentResponse?.name || '-'}
                                                </span>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Related Information - Placeholders for future implementation */}
                    <Col lg={6} className="mb-4">
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-light border-0">
                                <h5 className="mb-0 d-flex align-items-center">
                                    <FontAwesomeIcon icon={faBook} className="me-2 text-primary" />
                                    Chương Trình Đào Tạo
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="text-center py-4">
                                    <FontAwesomeIcon icon={faBook} size="2x" className="text-muted mb-2" />
                                    <p className="text-muted mb-0">Danh sách chương trình đào tạo sẽ được hiển thị sau khi ProgramCurriculum service được tích hợp</p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={6} className="mb-4">
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-light border-0">
                                <h5 className="mb-0 d-flex align-items-center">
                                    <FontAwesomeIcon icon={faGraduationCap} className="me-2 text-primary" />
                                    Sinh Viên
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="text-center py-4">
                                    <FontAwesomeIcon icon={faGraduationCap} size="2x" className="text-muted mb-2" />
                                    <p className="text-muted mb-0">Danh sách sinh viên thuộc ngành học sẽ được hiển thị sau khi User service được tích hợp</p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </MainLayout>
    );
};

export default MajorDetails; 