import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBook, faCode, faGraduationCap, faArrowLeft, faEdit,
    faInfoCircle, faCalendarAlt, faAward, faCertificate, faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import { courseService } from "../../../services/apiService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State management
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isNotFound, setIsNotFound] = useState(false);

    // Course type display mapping
    const courseTypeDisplayMap = {
        'GENERAL': 'Môn chung',
        'SPECIALIZED': 'Môn chuyên ngành',
        'ELECTIVE': 'Môn tự chọn',
        'CORE': 'Môn cơ sở'
    };

    // Load course details
    const loadCourseDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            setIsNotFound(false);

            const response = await courseService.getCourseById(id);
            
            if (response.result) {
                setCourse(response.result);
            } else {
                setCourse(response);
            }
        } catch (err) {
            console.error('Error loading course details:', err);
            
            // Check if it's a 404 error (course not found)
            if (err.response && err.response.status === 404) {
                setIsNotFound(true);
                setError(null);
            } else {
                // Other types of errors
                setError('Không thể tải thông tin môn học. Vui lòng thử lại.');
                setIsNotFound(false);
                toast.error('Lỗi khi tải thông tin môn học');
            }
        } finally {
            setLoading(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        if (id) {
            loadCourseDetails();
        }
    }, [id]);

    // Get course type badge variant
    const getCourseTypeBadgeVariant = (courseType) => {
        switch (courseType) {
            case 'CORE': return 'danger';
            case 'SPECIALIZED': return 'primary';
            case 'ELECTIVE': return 'success';
            case 'GENERAL': return 'info';
            default: return 'secondary';
        }
    };

    // Get course type icon
    const getCourseTypeIcon = (courseType) => {
        switch (courseType) {
            case 'CORE': return faAward;
            case 'SPECIALIZED': return faCertificate;
            case 'ELECTIVE': return faGraduationCap;
            case 'GENERAL': return faBook;
            default: return faBook;
        }
    };

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

    if (error) {
        return (
            <MainLayout activeMenu="courses">
                <div className="container-fluid pt-3 pb-5">
                    <Alert variant="danger">
                        {error}
                    </Alert>
                    <Button variant="outline-primary" onClick={() => navigate('/admin/academic/courses')}>
                        <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                        Quay lại danh sách
                    </Button>
                </div>
            </MainLayout>
        );
    }

    if (isNotFound) {
        return (
            <MainLayout activeMenu="courses">
                <div className="container-fluid pt-3 pb-5">
                    <div className="text-center py-5">
                        <div className="mb-4">
                            <FontAwesomeIcon 
                                icon={faBook} 
                                size="5x" 
                                className="text-muted opacity-50" 
                            />
                        </div>
                        <h3 className="text-muted mb-3">Không Tìm Thấy Môn Học</h3>
                        <p className="text-muted mb-4">
                            Môn học với ID <code>#{id}</code> không tồn tại trong hệ thống.
                        </p>
                        <div className="d-flex gap-2 justify-content-center">
                            <Button 
                                variant="primary" 
                                onClick={() => navigate('/admin/academic/courses')}
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

    const totalCredits = (course.creditsTheory || 0) + (course.creditsPractical || 0);

    return (
        <MainLayout activeMenu="courses">
            <div className="container-fluid pt-3 pb-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="h4 fw-bold text-dark">Chi Tiết Môn Học</h2>
                        <p className="text-muted mb-0">
                            Thông tin chi tiết của môn học {course.name}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-primary"
                            onClick={() => navigate('/admin/academic/courses')}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                            Quay lại
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => navigate(`/admin/academic/courses/edit/${course.id}`)}
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
                                    <FontAwesomeIcon icon={faBook} className="me-2 text-primary" />
                                    Thông Tin Cơ Bản
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <label className="form-label fw-medium text-secondary">ID Môn Học</label>
                                        <p className="form-control-plaintext fw-bold">{course.id}</p>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <label className="form-label fw-medium text-secondary">Mã Môn Học</label>
                                        <p className="form-control-plaintext">
                                            <code className="bg-white px-2 py-1 rounded border">
                                                {course.code || 'Chưa có mã môn học'}
                                            </code>
                                        </p>
                                    </Col>
                                    <Col xs={12} className="mb-3">
                                        <label className="form-label fw-medium text-secondary">Tên Môn Học</label>
                                        <p className="form-control-plaintext fw-bold text-primary fs-5">
                                            {course.name || 'Chưa có tên môn học'}
                                        </p>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <label className="form-label fw-medium text-secondary">Loại Môn Học</label>
                                        <p className="form-control-plaintext">
                                            <Badge bg={getCourseTypeBadgeVariant(course.courseType)} className="fs-6">
                                                <FontAwesomeIcon 
                                                    icon={getCourseTypeIcon(course.courseType)} 
                                                    className="me-1" 
                                                />
                                                {courseTypeDisplayMap[course.courseType] || course.courseType || 'Chưa xác định'}
                                            </Badge>
                                        </p>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <label className="form-label fw-medium text-secondary">Tổng Số Tín Chỉ</label>
                                        <p className="form-control-plaintext">
                                            <Badge bg="info" className="fs-6">{totalCredits} tín chỉ</Badge>
                                        </p>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <label className="form-label fw-medium text-secondary">Tín Chỉ Lý Thuyết</label>
                                        <p className="form-control-plaintext fw-medium">
                                            {course.creditsTheory || 0} tín chỉ
                                        </p>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <label className="form-label fw-medium text-secondary">Tín Chỉ Thực Hành</label>
                                        <p className="form-control-plaintext fw-medium">
                                            {course.creditsPractical || 0} tín chỉ
                                        </p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    {/* Quick Info Card */}
                    <Col lg={6} className="mb-4">
                        <Card className="border-0 bg-primary text-white h-100">
                            <Card.Header className="bg-transparent border-0">
                                <h5 className="fw-bold mb-0 d-flex align-items-center">
                                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                                    Thông Tin Nhanh
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="mb-3">
                                    <small className="text-white-50">Mã môn học</small>
                                    <p className="fw-bold mb-0">{course.code || 'N/A'}</p>
                                </div>
                                <div className="mb-3">
                                    <small className="text-white-50">Loại môn học</small>
                                    <p className="fw-bold mb-0">
                                        {courseTypeDisplayMap[course.courseType] || 'N/A'}
                                    </p>
                                </div>
                                <div className="mb-3">
                                    <small className="text-white-50">Tổng tín chỉ</small>
                                    <p className="fw-bold mb-0">{totalCredits} tín chỉ</p>
                                </div>
                                <div>
                                    <small className="text-white-50">Cấu trúc tín chỉ</small>
                                    <p className="fw-bold mb-0">
                                        {course.creditsTheory || 0} LT + {course.creditsPractical || 0} TH
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Credit Breakdown Card */}
                    <Col lg={6} className="mb-4">
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Header className="bg-light border-0">
                                <h5 className="fw-bold mb-0 d-flex align-items-center">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-success" />
                                    Phân Bổ Tín Chỉ
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="row text-center">
                                    <div className="col-6">
                                        <div className="border-end pe-3">
                                            <div className="display-6 fw-bold text-primary">
                                                {course.creditsTheory || 0}
                                            </div>
                                            <small className="text-muted">Lý Thuyết</small>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="display-6 fw-bold text-success">
                                            {course.creditsPractical || 0}
                                        </div>
                                        <small className="text-muted">Thực Hành</small>
                                    </div>
                                </div>
                                <hr className="my-3" />
                                <div className="text-center">
                                    <div className="h3 fw-bold text-info mb-1">
                                        {totalCredits}
                                    </div>
                                    <small className="text-muted">Tổng Tín Chỉ</small>
                                </div>
                                {totalCredits > 0 && (
                                    <div className="mt-3">
                                        <div className="progress" style={{ height: '10px' }}>
                                            <div 
                                                className="progress-bar bg-primary" 
                                                style={{ width: `${(course.creditsTheory / totalCredits) * 100}%` }}
                                            ></div>
                                            <div 
                                                className="progress-bar bg-success" 
                                                style={{ width: `${(course.creditsPractical / totalCredits) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="d-flex justify-content-between mt-2">
                                            <small className="text-muted">
                                                {Math.round((course.creditsTheory / totalCredits) * 100)}% LT
                                            </small>
                                            <small className="text-muted">
                                                {Math.round((course.creditsPractical / totalCredits) * 100)}% TH
                                            </small>
                                        </div>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Actions Card */}
                <Row>
                    <Col xs={12}>
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-light border-0">
                                <h5 className="fw-bold mb-0">Thao Tác</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="d-flex gap-2 flex-wrap">
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => navigate('/admin/academic/courses')}
                                    >
                                        <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                                        Quay Lại Danh Sách
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={() => navigate(`/admin/academic/courses/edit/${course.id}`)}
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="me-1" />
                                        Chỉnh Sửa Môn Học
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={loadCourseDetails}
                                    >
                                        <FontAwesomeIcon icon={faRefresh} className="me-1" />
                                        Làm Mới
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </MainLayout>
    );
};

export default CourseDetails; 