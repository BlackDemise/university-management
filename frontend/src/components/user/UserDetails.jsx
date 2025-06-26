import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser, faEnvelope, faPhone, faIdCard, faMapMarkerAlt, 
    faArrowLeft, faEdit, faGraduationCap, faChalkboardTeacher,
    faCalendarAlt, faAward, faCertificate, faBook, faUserGraduate, faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import { userService } from "../../services/apiService.js";
import MainLayout from "../layout/main/MainLayout.jsx";

const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State management
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isNotFound, setIsNotFound] = useState(false);

    // Load user details
    const loadUserDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            setIsNotFound(false);

            const response = await userService.getUserById(id);
            
            if (response.result) {
                setUser(response.result);
            } else {
                setUser(response);
            }
        } catch (err) {
            console.error('Error loading user details:', err);
            
            // Check if it's a 404 error (user not found)
            if (err.response && err.response.status === 404) {
                setIsNotFound(true);
                setError(null);
            } else {
                // Other types of errors
                setError('Không thể tải thông tin người dùng. Vui lòng thử lại.');
                setIsNotFound(false);
                toast.error('Lỗi khi tải thông tin người dùng');
            }
        } finally {
            setLoading(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        if (id) {
            loadUserDetails();
        }
    }, [id]);

    // Get role badge variant
    const getRoleBadgeVariant = (role) => {
        switch (role) {
            case 'ADMIN': return 'danger';
            case 'TEACHER': return 'info';
            case 'STUDENT': return 'success';
            default: return 'secondary';
        }
    };

    // Get role display text
    const getRoleDisplayText = (role) => {
        switch (role) {
            case 'ADMIN': return 'Quản Trị Viên';
            case 'TEACHER': return 'Giảng Viên';
            case 'STUDENT': return 'Sinh Viên';
            default: return role;
        }
    };

    // Get role icon
    const getRoleIcon = (role) => {
        switch (role) {
            case 'ADMIN': return faUser;
            case 'TEACHER': return faChalkboardTeacher;
            case 'STUDENT': return faGraduationCap;
            default: return faUser;
        }
    };

    // Format student status
    const formatStudentStatus = (status) => {
        switch (status) {
            case 'ACTIVE': return { text: 'Đang học', variant: 'success' };
            case 'GRADUATED': return { text: 'Đã tốt nghiệp', variant: 'primary' };
            case 'SUSPENDED': return { text: 'Tạm ngưng', variant: 'warning' };
            case 'EXPELLED': return { text: 'Bị loại', variant: 'danger' };
            default: return { text: status, variant: 'secondary' };
        }
    };

    if (loading) {
        return (
            <MainLayout activeMenu="all-users">
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
            <MainLayout activeMenu="all-users">
                <div className="container-fluid pt-3 pb-5">
                    <Alert variant="danger">
                        {error}
                    </Alert>
                    <Button variant="outline-primary" onClick={() => navigate('/admin/users/all')}>
                        <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                        Quay lại danh sách
                    </Button>
                </div>
            </MainLayout>
        );
    }

    if (isNotFound) {
        return (
            <MainLayout activeMenu="all-users">
                <div className="container-fluid pt-3 pb-5">
                    <div className="text-center py-5">
                        <div className="mb-4">
                            <FontAwesomeIcon 
                                icon={faUser} 
                                size="5x" 
                                className="text-muted opacity-50" 
                            />
                        </div>
                        <h3 className="text-muted mb-3">Không Tìm Thấy Người Dùng</h3>
                        <p className="text-muted mb-4">
                            Người dùng với ID <code>#{id}</code> không tồn tại trong hệ thống.
                        </p>
                        <div className="d-flex gap-2 justify-content-center">
                            <Button 
                                variant="primary" 
                                onClick={() => navigate('/admin/users/all')}
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
        <MainLayout activeMenu="all-users">
            <div className="container-fluid pt-3 pb-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="h4 fw-bold text-dark">Chi Tiết Người Dùng</h2>
                        <p className="text-muted mb-0">
                            Thông tin chi tiết của {user.fullName}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-primary"
                            onClick={() => navigate('/admin/users/all')}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                            Quay lại
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => navigate(`/admin/users/edit/${user.id}`)}
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
                                    <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
                                    Thông Tin Cơ Bản
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    {/* Basic User Information - Left Side */}
                                    <Col md={8}>
                                        <Row>
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <label className="text-muted small mb-1">ID</label>
                                                    <div className="fw-medium">#{user.id}</div>
                                                </div>
                                                
                                                <div className="mb-3">
                                                    <label className="text-muted small mb-1">Họ và Tên</label>
                                                    <div className="fw-medium fs-5">{user.fullName}</div>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="text-muted small mb-1">Vai Trò</label>
                                                    <div>
                                                        <Badge bg={getRoleBadgeVariant(user.role)} className="px-3 py-2">
                                                            <FontAwesomeIcon icon={getRoleIcon(user.role)} className="me-2" />
                                                            {getRoleDisplayText(user.role)}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="text-muted small mb-1">
                                                        <FontAwesomeIcon icon={faEnvelope} className="me-1" />
                                                        Email
                                                    </label>
                                                    <div className="text-primary">{user.email}</div>
                                                </div>
                                            </Col>

                                            <Col md={6}>
                                                {user.phone && (
                                                    <div className="mb-3">
                                                        <label className="text-muted small mb-1">
                                                            <FontAwesomeIcon icon={faPhone} className="me-1" />
                                                            Số Điện Thoại
                                                        </label>
                                                        <div>{user.phone}</div>
                                                    </div>
                                                )}

                                                {user.identityNumber && (
                                                    <div className="mb-3">
                                                        <label className="text-muted small mb-1">
                                                            <FontAwesomeIcon icon={faIdCard} className="me-1" />
                                                            CCCD/CMND
                                                        </label>
                                                        <div>{user.identityNumber}</div>
                                                    </div>
                                                )}

                                                {user.permanentAddress && (
                                                    <div className="mb-3">
                                                        <label className="text-muted small mb-1">
                                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" />
                                                            Địa Chỉ Thường Trú
                                                        </label>
                                                        <div>{user.permanentAddress}</div>
                                                    </div>
                                                )}

                                                {user.currentAddress && (
                                                    <div className="mb-3">
                                                        <label className="text-muted small mb-1">
                                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" />
                                                            Địa Chỉ Hiện Tại
                                                        </label>
                                                        <div>{user.currentAddress}</div>
                                                    </div>
                                                )}
                                            </Col>
                                        </Row>
                                    </Col>

                                    {/* User Image Placeholder - Right Side */}
                                    <Col md={4} className="text-center">
                                        <div className="position-relative">
                                            <div 
                                                className="bg-light border rounded d-flex align-items-center justify-content-center"
                                                style={{ width: '150px', height: '180px', margin: '0 auto' }}
                                            >
                                                <div className="text-center text-muted">
                                                    <FontAwesomeIcon icon={faUser} size="3x" className="mb-2" />
                                                    <div className="small">Ảnh đại diện</div>
                                                    <div className="small">(Chưa có)</div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Role-Specific Information - Full Width */}
                    {(user.role === 'STUDENT' && user.studentResponse) && (
                        <Col lg={12} className="mb-4">
                            <Card className="border-0 shadow-sm">
                                <Card.Header className="bg-success bg-opacity-10 border-0">
                                    <h5 className="mb-0 d-flex align-items-center text-success">
                                        <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
                                        Thông Tin Sinh Viên
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={3}>
                                            <div className="mb-3">
                                                <label className="text-muted small mb-1">ID Sinh Viên</label>
                                                <div className="fw-medium">#{user.studentResponse.id}</div>
                                            </div>
                                        </Col>
                                        <Col md={3}>
                                            <div className="mb-3">
                                                <label className="text-muted small mb-1">Mã Sinh Viên</label>
                                                <div className="fw-medium fs-6">{user.studentResponse.studentCode}</div>
                                            </div>
                                        </Col>
                                        <Col md={3}>
                                            {user.studentResponse.birthDate && (
                                                <div className="mb-3">
                                                    <label className="text-muted small mb-1">
                                                        <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                                                        Ngày Sinh
                                                    </label>
                                                    <div>{user.studentResponse.birthDate}</div>
                                                </div>
                                            )}
                                        </Col>
                                        <Col md={3}>
                                            {user.studentResponse.courseYear && (
                                                <div className="mb-3">
                                                    <label className="text-muted small mb-1">
                                                        <FontAwesomeIcon icon={faBook} className="me-1" />
                                                        Khóa Học
                                                    </label>
                                                    <div>Khóa {user.studentResponse.courseYear}</div>
                                                </div>
                                            )}
                                        </Col>
                                    </Row>
                                    {user.studentResponse.studentStatus && (
                                        <Row>
                                            <Col md={12}>
                                                <div className="mb-3">
                                                    <label className="text-muted small mb-1">Trạng Thái Học Tập</label>
                                                    <div>
                                                        <Badge bg={formatStudentStatus(user.studentResponse.studentStatus).variant} className="px-3 py-2">
                                                            {formatStudentStatus(user.studentResponse.studentStatus).text}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    )}

                    {/* Teacher Information - Full Width */}
                    {(user.role === 'TEACHER' && user.teacherResponse) && (
                        <Col lg={12} className="mb-4">
                            <Card className="border-0 shadow-sm">
                                <Card.Header className="bg-info bg-opacity-10 border-0">
                                    <h5 className="mb-0 d-flex align-items-center text-info">
                                        <FontAwesomeIcon icon={faChalkboardTeacher} className="me-2" />
                                        Thông Tin Giảng Viên
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={3}>
                                            <div className="mb-3">
                                                <label className="text-muted small mb-1">ID Giảng Viên</label>
                                                <div className="fw-medium">#{user.teacherResponse.id}</div>
                                            </div>
                                        </Col>
                                        <Col md={3}>
                                            <div className="mb-3">
                                                <label className="text-muted small mb-1">Mã Giảng Viên</label>
                                                <div className="fw-medium fs-6">{user.teacherResponse.teacherCode}</div>
                                            </div>
                                        </Col>
                                        <Col md={3}>
                                            {user.teacherResponse.academicRank && (
                                                <div className="mb-3">
                                                    <label className="text-muted small mb-1">
                                                        <FontAwesomeIcon icon={faAward} className="me-1" />
                                                        Học Hàm
                                                    </label>
                                                    <div>{user.teacherResponse.academicRank}</div>
                                                </div>
                                            )}
                                        </Col>
                                        <Col md={3}>
                                            {user.teacherResponse.degree && (
                                                <div className="mb-3">
                                                    <label className="text-muted small mb-1">
                                                        <FontAwesomeIcon icon={faCertificate} className="me-1" />
                                                        Học Vị
                                                    </label>
                                                    <div>{user.teacherResponse.degree}</div>
                                                </div>
                                            )}
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    )}

                    {/* Admin Information - Full Width */}
                    {user.role === 'ADMIN' && (
                        <Col lg={12} className="mb-4">
                            <Card className="border-0 shadow-sm">
                                <Card.Header className="bg-danger bg-opacity-10 border-0">
                                    <h5 className="mb-0 d-flex align-items-center text-danger">
                                        <FontAwesomeIcon icon={faUser} className="me-2" />
                                        Quyền Quản Trị
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={12}>
                                            <div className="text-muted">
                                                <p className="mb-2">
                                                    <FontAwesomeIcon icon={faAward} className="me-2 text-danger" />
                                                    <strong>Quyền hạn:</strong> Toàn quyền quản lý hệ thống
                                                </p>
                                                <ul className="mb-0">
                                                    <li>Quản lý người dùng (tạo, sửa, xóa tài khoản)</li>
                                                    <li>Quản lý khóa học và chương trình đào tạo</li>
                                                    <li>Quản lý cơ sở vật chất và phòng học</li>
                                                    <li>Cài đặt và cấu hình hệ thống</li>
                                                    <li>Xem báo cáo và thống kê tổng quan</li>
                                                </ul>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    )}
                </Row>
            </div>
        </MainLayout>
    );
};

export default UserDetails; 