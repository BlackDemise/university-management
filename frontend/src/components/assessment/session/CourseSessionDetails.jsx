import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import MainLayout from '../../layout/main/MainLayout.jsx';
import { sessionService } from '../../../services/apiService.js';

const CourseSessionDetails = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    
    // State management
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load session data
    const loadSession = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('📖 Loading session details for ID:', sessionId);

            const response = await sessionService.getSessionById(sessionId);

            if (response.result) {
                setSession(response.result);
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

    // Load data on component mount
    useEffect(() => {
        if (sessionId) {
            loadSession();
        }
    }, [sessionId]);

    // Handle navigation
    const handleBack = () => {
        if (session?.courseOfferingId) {
            navigate(`/admin/assessment/sessions/course-offering/${session.courseOfferingId}`);
        } else {
            navigate('/admin/assessment/sessions/summary');
        }
    };

    const handleEdit = () => {
        navigate(`/admin/assessment/sessions/edit/${sessionId}`);
    };

    const handleDelete = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phiên học này?')) {
            try {
                await sessionService.deleteSession(sessionId);
                toast.success('Xóa phiên học thành công');
                handleBack();
            } catch (error) {
                console.error('Error deleting session:', error);
                toast.error('Lỗi khi xóa phiên học');
            }
        }
    };

    // Format date time
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleString('vi-VN');
        } catch {
            return dateTimeString;
        }
    };

    // Get session type badge variant
    const getSessionTypeBadgeVariant = (sessionType) => {
        switch (sessionType) {
            case 'Tiết học lý thuyết':
                return 'primary';
            case 'Tiết học thực hành':
                return 'warning';
            case 'Thời gian thi':
                return 'danger';
            default:
                return 'secondary';
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
                                        <i className="fas fa-info-circle me-2"></i>
                                        Chi Tiết Phiên Học
                                    </h5>
                                    <div>
                                        {session && (
                                            <>
                                                <Button 
                                                    variant="warning" 
                                                    size="sm" 
                                                    className="me-2"
                                                    onClick={handleEdit}
                                                >
                                                    <i className="fas fa-edit me-1"></i>
                                                    Chỉnh Sửa
                                                </Button>
                                                <Button 
                                                    variant="danger" 
                                                    size="sm" 
                                                    className="me-2"
                                                    onClick={handleDelete}
                                                >
                                                    <i className="fas fa-trash me-1"></i>
                                                    Xóa
                                                </Button>
                                            </>
                                        )}
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

                                {/* Session Details */}
                                {!loading && session && (
                                    <Row>
                                        <Col lg={8}>
                                            <Card className="mb-4">
                                                <Card.Header className="bg-light">
                                                    <h6 className="mb-0">
                                                        <i className="fas fa-calendar-alt me-2"></i>
                                                        Thông Tin Phiên Học
                                                    </h6>
                                                </Card.Header>
                                                <Card.Body>
                                                    <Row className="mb-3">
                                                        <Col sm={4}>
                                                            <strong>ID Phiên Học:</strong>
                                                        </Col>
                                                        <Col sm={8}>
                                                            <Badge bg="secondary">{session.id}</Badge>
                                                        </Col>
                                                    </Row>

                                                    <Row className="mb-3">
                                                        <Col sm={4}>
                                                            <strong>Số Phiên:</strong>
                                                        </Col>
                                                        <Col sm={8}>
                                                            <Badge bg="info">#{session.sessionNumber || 'N/A'}</Badge>
                                                        </Col>
                                                    </Row>

                                                    <Row className="mb-3">
                                                        <Col sm={4}>
                                                            <strong>Loại Phiên Học:</strong>
                                                        </Col>
                                                        <Col sm={8}>
                                                            <Badge bg={getSessionTypeBadgeVariant(session.sessionType)}>
                                                                {session.sessionType || 'N/A'}
                                                            </Badge>
                                                        </Col>
                                                    </Row>

                                                    <Row className="mb-3">
                                                        <Col sm={4}>
                                                            <strong>Thời Gian Bắt Đầu:</strong>
                                                        </Col>
                                                        <Col sm={8}>
                                                            {formatDateTime(session.startTime)}
                                                        </Col>
                                                    </Row>

                                                    <Row className="mb-3">
                                                        <Col sm={4}>
                                                            <strong>Thời Gian Kết Thúc:</strong>
                                                        </Col>
                                                        <Col sm={8}>
                                                            {formatDateTime(session.endTime)}
                                                        </Col>
                                                    </Row>

                                                    <Row className="mb-3">
                                                        <Col sm={4}>
                                                            <strong>ID Khóa Học:</strong>
                                                        </Col>
                                                        <Col sm={8}>
                                                            <Badge bg="primary">{session.courseOfferingId}</Badge>
                                                        </Col>
                                                    </Row>

                                                    <Row className="mb-3">
                                                        <Col sm={4}>
                                                            <strong>ID Phòng Học:</strong>
                                                        </Col>
                                                        <Col sm={8}>
                                                            <Badge bg="success">{session.classroomId}</Badge>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Col>

                                        <Col lg={4}>
                                            <Card className="mb-4">
                                                <Card.Header className="bg-light">
                                                    <h6 className="mb-0">
                                                        <i className="fas fa-book me-2"></i>
                                                        Thông Tin Khóa Học
                                                    </h6>
                                                </Card.Header>
                                                <Card.Body>
                                                    <div className="mb-3">
                                                        <strong>Mã Khóa Học:</strong>
                                                        <div className="mt-1">
                                                            <Badge bg="secondary">{session.courseCode || 'N/A'}</Badge>
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <strong>Tên Khóa Học:</strong>
                                                        <div className="mt-1">{session.courseName || 'Unknown Course'}</div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <strong>Học Kỳ:</strong>
                                                        <div className="mt-1">
                                                            <Badge bg="info">{session.semesterName || 'N/A'}</Badge>
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>

                                            <Card className="mb-4">
                                                <Card.Header className="bg-light">
                                                    <h6 className="mb-0">
                                                        <i className="fas fa-user me-2"></i>
                                                        Thông Tin Giảng Viên
                                                    </h6>
                                                </Card.Header>
                                                <Card.Body>
                                                    <div className="mb-3">
                                                        <strong>Tên Giảng Viên:</strong>
                                                        <div className="mt-1">{session.teacherName || 'Unknown Teacher'}</div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <strong>Email:</strong>
                                                        <div className="mt-1">
                                                            {session.teacherEmail ? (
                                                                <a href={`mailto:${session.teacherEmail}`} className="text-decoration-none">
                                                                    {session.teacherEmail}
                                                                </a>
                                                            ) : (
                                                                'N/A'
                                                            )}
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>

                                            <Card>
                                                <Card.Header className="bg-light">
                                                    <h6 className="mb-0">
                                                        <i className="fas fa-door-open me-2"></i>
                                                        Thông Tin Phòng Học
                                                    </h6>
                                                </Card.Header>
                                                <Card.Body>
                                                    <div className="mb-3">
                                                        <strong>Tên Phòng:</strong>
                                                        <div className="mt-1">{session.classroomName || 'Unknown Classroom'}</div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <strong>Loại Phòng:</strong>
                                                        <div className="mt-1">
                                                            <Badge bg="warning">{session.classroomType || 'N/A'}</Badge>
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                )}

                                {/* No Data Message */}
                                {!loading && !session && !error && (
                                    <div className="text-center py-5">
                                        <i className="fas fa-search fa-3x text-muted mb-3"></i>
                                        <h5 className="text-muted">Không tìm thấy phiên học</h5>
                                        <p className="text-muted">Phiên học với ID {sessionId} không tồn tại.</p>
                                        <Button variant="primary" onClick={handleBack}>
                                            <i className="fas fa-arrow-left me-2"></i>
                                            Quay Lại Danh Sách
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default CourseSessionDetails;
