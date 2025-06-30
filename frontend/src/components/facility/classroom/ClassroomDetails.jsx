import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChalkboard, faBuilding, faUsers, faTools,
    faArrowLeft, faEdit, faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import { classroomService } from "../../../services/apiService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

const ClassroomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State management
    const [classroom, setClassroom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isNotFound, setIsNotFound] = useState(false);

    // Load classroom details
    const loadClassroomDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            setIsNotFound(false);

            const response = await classroomService.getClassroomById(id);
            
            if (response.result) {
                setClassroom(response.result);
            } else {
                setClassroom(response);
            }
        } catch (err) {
            console.error('Error loading classroom details:', err);
            
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

    // Load data on component mount
    useEffect(() => {
        if (id) {
            loadClassroomDetails();
        }
    }, [id]);

    // Get classroom type badge variant
    const getClassroomTypeBadgeVariant = (type) => {
        switch (type) {
            case 'LECTURE_HALL': return 'primary';
            case 'COMPUTER_LAB': return 'info';
            case 'SCIENCE_LAB': return 'success';
            case 'SEMINAR_ROOM': return 'warning';
            default: return 'secondary';
        }
    };

    // Format classroom type display
    const formatClassroomType = (type) => {
        switch (type) {
            case 'LECTURE_HALL': return 'Giảng Đường';
            case 'COMPUTER_LAB': return 'Phòng Máy Tính';
            case 'SCIENCE_LAB': return 'Phòng Thí Nghiệm';
            case 'SEMINAR_ROOM': return 'Phòng Hội Thảo';
            default: return type;
        }
    };

    if (loading) {
        return (
            <MainLayout activeMenu="classrooms">
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
            <MainLayout activeMenu="classrooms">
                <div className="container-fluid pt-3 pb-5">
                    <Alert variant="danger">
                        {error}
                    </Alert>
                    <Button variant="outline-primary" onClick={() => navigate('/admin/facility/classrooms')}>
                        <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                        Quay lại danh sách
                    </Button>
                </div>
            </MainLayout>
        );
    }

    if (isNotFound) {
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
                        <h2 className="h4 fw-bold text-dark">Chi Tiết Phòng Học</h2>
                        <p className="text-muted mb-0">
                            Thông tin chi tiết của phòng {classroom.roomNumber}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-primary"
                            onClick={() => navigate('/admin/facility/classrooms')}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                            Quay lại
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => navigate(`/admin/facility/classrooms/edit/${classroom.id}`)}
                        >
                            <FontAwesomeIcon icon={faEdit} className="me-1" />
                            Chỉnh sửa
                        </Button>
                    </div>
                </div>

                <Row>
                    {/* Core Information */}
                    <Col lg={12} className="mb-4">
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-light border-0">
                                <h5 className="mb-0 d-flex align-items-center">
                                    <FontAwesomeIcon icon={faChalkboard} className="me-2 text-primary" />
                                    Thông Tin Cơ Bản
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <label className="text-muted small mb-1">ID</label>
                                            <div className="fw-medium">#{classroom.id}</div>
                                        </div>
                                        
                                        <div className="mb-3">
                                            <label className="text-muted small mb-1">Số Phòng</label>
                                            <div className="fw-medium fs-5">{classroom.roomNumber}</div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="text-muted small mb-1">Loại Phòng</label>
                                            <div>
                                                <Badge bg={getClassroomTypeBadgeVariant(classroom.classroomType)} className="px-3 py-2">
                                                    {formatClassroomType(classroom.classroomType)}
                                                </Badge>
                                            </div>
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="mb-3">
                                            <label className="text-muted small mb-1">
                                                <FontAwesomeIcon icon={faBuilding} className="me-1" />
                                                Tòa Nhà
                                            </label>
                                            <div>{classroom.building}</div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="text-muted small mb-1">
                                                <FontAwesomeIcon icon={faUsers} className="me-1" />
                                                Sức Chứa
                                            </label>
                                            <div>{classroom.capacity} người</div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="text-muted small mb-1">
                                                <FontAwesomeIcon icon={faTools} className="me-1" />
                                                Thiết Bị
                                            </label>
                                            <div style={{ whiteSpace: 'pre-wrap' }}>
                                                {classroom.equipment || '—'}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </MainLayout>
    );
};

export default ClassroomDetails; 