import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendarAlt, faArrowLeft, faEdit, faIdCard, faInfoCircle,
    faCalendarDay, faCalendarWeek, faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import semesterService from "../../../services/semesterService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";
import {formatDate, formatDateWithDayMonthYear} from "../../../utils/formatterUtil.js";

const SemesterDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State management
    const [semester, setSemester] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isNotFound, setIsNotFound] = useState(false);

    // Load semester details
    const loadSemesterDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            setIsNotFound(false);

            const response = await semesterService.getSemesterById(id);
            
            if (response.result) {
                setSemester(response.result);
            } else {
                setSemester(response);
            }
        } catch (err) {
            console.error('Error loading semester details:', err);
            
            // Check if it's a 404 error (semester not found)
            if (err.response && err.response.status === 404) {
                setIsNotFound(true);
                setError(null);
            } else {
                // Other types of errors
                setError('Không thể tải thông tin học kỳ. Vui lòng thử lại.');
                setIsNotFound(false);
                toast.error('Lỗi khi tải thông tin học kỳ');
            }
        } finally {
            setLoading(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        if (id) {
            loadSemesterDetails();
        }
    }, [id]);

    // Get semester status based on dates
    const getSemesterStatus = (startDate, endDate) => {
        const today = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (today < start) {
            return { status: "Chưa bắt đầu", variant: "secondary", icon: faCalendarDay };
        } else if (today > end) {
            return { status: "Đã kết thúc", variant: "danger", icon: faCalendarWeek };
        } else {
            return { status: "Đang diễn ra", variant: "success", icon: faCalendarAlt };
        }
    };

    // Calculate semester duration
    const calculateDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 30) {
            return `${diffDays} ngày`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            const remainingDays = diffDays % 30;
            return remainingDays > 0 ? `${months} tháng ${remainingDays} ngày` : `${months} tháng`;
        } else {
            const years = Math.floor(diffDays / 365);
            const remainingDays = diffDays % 365;
            const months = Math.floor(remainingDays / 30);
            return `${years} năm ${months} tháng`;
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
                    <Button variant="outline-primary" onClick={() => navigate('/admin/enrollment/semesters')}>
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
                                icon={faCalendarAlt} 
                                size="5x" 
                                className="text-muted opacity-50" 
                            />
                        </div>
                        <h3 className="text-muted mb-3">Không Tìm Thấy Học Kỳ</h3>
                        <p className="text-muted mb-4">
                            Học kỳ với ID <code>#{id}</code> không tồn tại trong hệ thống.
                        </p>
                        <div className="d-flex gap-2 justify-content-center">
                            <Button 
                                variant="primary" 
                                onClick={() => navigate('/admin/enrollment/semesters')}
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

    const status = getSemesterStatus(semester.startDate, semester.endDate);

    return (
        <MainLayout activeMenu="enrollment">
            <div className="container-fluid pt-3 pb-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="h4 fw-bold text-dark">Chi Tiết Học Kỳ</h2>
                        <p className="text-muted mb-0">
                            Thông tin chi tiết của {semester.name}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-primary"
                            onClick={() => navigate('/admin/enrollment/semesters')}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                            Quay lại
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => navigate(`/admin/enrollment/semesters/edit/${semester.id}`)}
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
                                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-primary" />
                                    Thông Tin Cơ Bản
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    {/* Basic Semester Information - Left Side */}
                                    <Col md={8}>
                                        <Row>
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <label className="text-muted small mb-1">
                                                        <FontAwesomeIcon icon={faIdCard} className="me-1" />
                                                        ID
                                                    </label>
                                                    <div className="fw-medium">#{semester.id}</div>
                                                </div>
                                                
                                                <div className="mb-3">
                                                    <label className="text-muted small mb-1">
                                                        <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                                                        Tên Học Kỳ
                                                    </label>
                                                    <div className="fw-medium fs-5">{semester.name}</div>
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

                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <label className="text-muted small mb-1">
                                                        <FontAwesomeIcon icon={faCalendarDay} className="me-1" />
                                                        Ngày Bắt Đầu
                                                    </label>
                                                    <div className="fw-medium">{formatDateWithDayMonthYear(semester.startDate)}</div>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="text-muted small mb-1">
                                                        <FontAwesomeIcon icon={faCalendarWeek} className="me-1" />
                                                        Ngày Kết Thúc
                                                    </label>
                                                    <div className="fw-medium">{formatDateWithDayMonthYear(semester.endDate)}</div>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="text-muted small mb-1">
                                                        <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                                                        Thời Gian Học
                                                    </label>
                                                    <div className="fw-medium">
                                                        {calculateDuration(semester.startDate, semester.endDate)}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>

                                    {/* Status Summary - Right Side */}
                                    <Col md={4}>
                                        <div className="bg-light rounded p-3 h-100">
                                            <h6 className="mb-3">
                                                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                                                Tóm Tắt
                                            </h6>
                                            
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <span className="text-muted">Trạng thái:</span>
                                                    <Badge bg={status.variant}>{status.status}</Badge>
                                                </div>
                                            </div>
                                            
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <span className="text-muted">Thời gian:</span>
                                                    <span className="fw-medium">
                                                        {calculateDuration(semester.startDate, semester.endDate)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="border-top pt-3 mt-3">
                                                <small className="text-muted">
                                                    <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                                                    Từ {formatDateWithDayMonthYear(semester.startDate)} đến {formatDateWithDayMonthYear(semester.endDate)}
                                                </small>
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

export default SemesterDetails;
