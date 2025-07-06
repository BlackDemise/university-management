import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Badge, Button, Spinner, Alert, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChalkboardTeacher, faArrowLeft, faEdit, faIdCard, faInfoCircle,
    faGraduationCap, faUser, faCalendarAlt, faUsers, faClock, faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import courseOfferingService from "../../../services/courseOfferingService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";
import { formatDate } from "../../../utils/formatterUtil.js";

const CourseOfferingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State management
    const [courseOffering, setCourseOffering] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isNotFound, setIsNotFound] = useState(false);

    // Load course offering details
    const loadCourseOfferingDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            setIsNotFound(false);

            const response = await courseOfferingService.getCourseOfferingById(id);
            
            if (response.result) {
                setCourseOffering(response.result);
            } else {
                setCourseOffering(response);
            }
        } catch (err) {
            console.error('Error loading course offering details:', err);
            
            // Check if it's a 404 error (course offering not found)
            if (err.response && err.response.status === 404) {
                setIsNotFound(true);
                setError(null);
            } else {
                // Other types of errors
                setError('Không thể tải thông tin khóa học. Vui lòng thử lại.');
                setIsNotFound(false);
                toast.error('Lỗi khi tải thông tin khóa học');
            }
        } finally {
            setLoading(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        if (id) {
            loadCourseOfferingDetails();
        }
    }, [id]);

    // Get course offering status based on registration period
    const getCourseOfferingStatus = (openTime, closeTime, currentStudents, maxStudents) => {
        const now = new Date();
        const open = new Date(openTime);
        const close = new Date(closeTime);
        
        if (currentStudents >= maxStudents) {
            return { status: "Đã đầy", variant: "warning", icon: faUsers };
        } else if (now < open) {
            return { status: "Chưa mở", variant: "secondary", icon: faClock };
        } else if (now > close) {
            return { status: "Đã đóng", variant: "danger", icon: faClock };
        } else {
            return { status: "Đang mở", variant: "success", icon: faUsers };
        }
    };

    // Calculate enrollment percentage
    const calculateEnrollmentPercentage = (current, max) => {
        if (!max || max === 0) return 0;
        return Math.round((current / max) * 100);
    };

    // Calculate remaining time for registration
    const getRegistrationTimeInfo = (openTime, closeTime) => {
        const now = new Date();
        const open = new Date(openTime);
        const close = new Date(closeTime);
        
        if (now < open) {
            const timeToOpen = open.getTime() - now.getTime();
            const days = Math.floor(timeToOpen / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeToOpen % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            return `Mở sau ${days} ngày ${hours} giờ`;
        } else if (now > close) {
            return 'Đã kết thúc';
        } else {
            const timeToClose = close.getTime() - now.getTime();
            const days = Math.floor(timeToClose / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeToClose % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            return `Còn ${days} ngày ${hours} giờ`;
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

    if (error) {
        return (
            <MainLayout activeMenu="enrollment">
                <div className="container-fluid pt-3 pb-5">
                    <Alert variant="danger">
                        {error}
                    </Alert>
                    <Button variant="outline-primary" onClick={() => navigate('/admin/enrollment/course-offerings')}>
                        <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                        Quay lại danh sách
                    </Button>
                </div>
            </MainLayout>
        );
    }

    if (isNotFound) {
        return (
            <MainLayout activeMenu="enrollment">
                <div className="container-fluid pt-3 pb-5">
                    <div className="text-center py-5">
                        <div className="mb-4">
                            <FontAwesomeIcon 
                                icon={faChalkboardTeacher} 
                                size="5x" 
                                className="text-muted opacity-50" 
                            />
                        </div>
                        <h3 className="text-muted mb-3">Không Tìm Thấy Khóa Học</h3>
                        <p className="text-muted mb-4">
                            Khóa học với ID <code>#{id}</code> không tồn tại trong hệ thống.
                        </p>
                        <div className="d-flex gap-2 justify-content-center">
                            <Button 
                                variant="primary" 
                                onClick={() => navigate('/admin/enrollment/course-offerings')}
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

    const status = getCourseOfferingStatus(
        courseOffering.openTime,
        courseOffering.closeTime,
        courseOffering.currentStudents,
        courseOffering.maxStudents
    );

    const enrollmentPercentage = calculateEnrollmentPercentage(
        courseOffering.currentStudents,
        courseOffering.maxStudents
    );

    return (
        <MainLayout activeMenu="enrollment">
            <div className="container-fluid pt-3 pb-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="h4 fw-bold text-dark">Chi Tiết Khóa Học</h2>
                        <p className="text-muted mb-0">
                            Thông tin chi tiết của {courseOffering.courseResponse?.name || 'Khóa học'}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-primary"
                            onClick={() => navigate('/admin/enrollment/course-offerings')}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                            Quay lại
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => navigate(`/admin/enrollment/course-offerings/edit/${courseOffering.id}`)}
                        >
                            <FontAwesomeIcon icon={faEdit} className="me-1" />
                            Chỉnh sửa
                        </Button>
                    </div>
                </div>

                <Row>
                    {/* Main Information */}
                    <Col lg={8} className="mb-4">
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-light border-0">
                                <h5 className="mb-0 d-flex align-items-center">
                                    <FontAwesomeIcon icon={faChalkboardTeacher} className="me-2 text-primary" />
                                    Thông Tin Cơ Bản
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <label className="text-muted small mb-1">
                                                <FontAwesomeIcon icon={faIdCard} className="me-1" />
                                                ID
                                            </label>
                                            <div className="fw-medium">#{courseOffering.id}</div>
                                        </div>
                                        
                                        <div className="mb-3">
                                            <label className="text-muted small mb-1">
                                                <FontAwesomeIcon icon={faGraduationCap} className="me-1" />
                                                Môn Học
                                            </label>
                                            <div className="fw-medium fs-5">
                                                {courseOffering.courseResponse?.name || 'N/A'}
                                            </div>
                                            <div className="text-muted small">
                                                Mã: {courseOffering.courseResponse?.code || 'N/A'}
                                            </div>
                                            <div className="text-muted small">
                                                {courseOffering.courseResponse?.creditsTheory || 0} tín chỉ lý thuyết, {courseOffering.courseResponse?.creditsPractical || 0} tín chỉ thực hành
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="text-muted small mb-1">
                                                <FontAwesomeIcon icon={faUser} className="me-1" />
                                                Giảng Viên
                                            </label>
                                            <div className="fw-medium">
                                                {courseOffering.teacherResponse?.teacherName || 'N/A'}
                                            </div>
                                            <div className="text-muted small">
                                                Mã: {courseOffering.teacherResponse?.teacherCode || 'N/A'}
                                            </div>
                                            <div className="text-muted small">
                                                Email: {courseOffering.teacherResponse?.teacherEmail || 'N/A'}
                                            </div>
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="mb-3">
                                            <label className="text-muted small mb-1">
                                                <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                                                Học Kỳ
                                            </label>
                                            <div className="fw-medium">
                                                {courseOffering.semesterResponse?.name || 'N/A'}
                                            </div>
                                            <div className="text-muted small">
                                                {courseOffering.semesterResponse?.startDate && courseOffering.semesterResponse?.endDate && (
                                                    <>
                                                        Từ {formatDate(courseOffering.semesterResponse.startDate)} 
                                                        đến {formatDate(courseOffering.semesterResponse.endDate)}
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="text-muted small mb-1">
                                                <FontAwesomeIcon icon={faUsers} className="me-1" />
                                                Số Lượng Sinh Viên
                                            </label>
                                            <div className="fw-medium">
                                                {courseOffering.currentStudents || 0} / {courseOffering.maxStudents || 0}
                                            </div>
                                            <ProgressBar 
                                                now={enrollmentPercentage} 
                                                variant={enrollmentPercentage >= 100 ? "warning" : enrollmentPercentage >= 80 ? "warning" : "success"}
                                                className="mt-1"
                                            />
                                            <div className="text-muted small mt-1">
                                                {enrollmentPercentage}% đã đăng ký
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="text-muted small mb-1">
                                                <FontAwesomeIcon icon={faInfoCircle} className="me-1" />
                                                Trạng Thái
                                            </label>
                                            <div>
                                                <Badge bg={status.variant} className="px-3 py-2">
                                                    <FontAwesomeIcon icon={status.icon} className="me-2" />
                                                    {status.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Registration Period */}
                        <Card className="border-0 shadow-sm mt-4">
                            <Card.Header className="bg-light border-0">
                                <h5 className="mb-0 d-flex align-items-center">
                                    <FontAwesomeIcon icon={faClock} className="me-2 text-warning" />
                                    Thời Gian Đăng Ký
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <label className="text-muted small mb-1">Thời Gian Mở</label>
                                            <div className="fw-medium">{formatDate(courseOffering.openTime)}</div>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <label className="text-muted small mb-1">Thời Gian Đóng</label>
                                            <div className="fw-medium">{formatDate(courseOffering.closeTime)}</div>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="bg-light rounded p-3">
                                    <div className="text-center">
                                        <FontAwesomeIcon icon={faClock} className="me-2 text-warning" />
                                        <strong>{getRegistrationTimeInfo(courseOffering.openTime, courseOffering.closeTime)}</strong>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Summary Sidebar */}
                    <Col lg={4}>
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-light border-0">
                                <h5 className="mb-0">
                                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                                    Tóm Tắt
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Trạng thái:</span>
                                        <Badge bg={status.variant}>{status.status}</Badge>
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Đã đăng ký:</span>
                                        <span className="fw-medium">
                                            {courseOffering.currentStudents || 0}/{courseOffering.maxStudents || 0}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Tỷ lệ lấp đầy:</span>
                                        <span className="fw-medium">
                                            {enrollmentPercentage}%
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Còn lại:</span>
                                        <span className="fw-medium">
                                            {Math.max(0, (courseOffering.maxStudents || 0) - (courseOffering.currentStudents || 0))} chỗ
                                        </span>
                                    </div>
                                </div>

                                <div className="border-top pt-3 mt-3">
                                    <small className="text-muted">
                                        <FontAwesomeIcon icon={faClock} className="me-1" />
                                        {getRegistrationTimeInfo(courseOffering.openTime, courseOffering.closeTime)}
                                    </small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </MainLayout>
    );
};

export default CourseOfferingDetails;
