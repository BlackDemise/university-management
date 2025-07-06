import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Badge, Button, Spinner, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEdit,
  faIdCard,
  faInfoCircle,
  faGraduationCap,
  faUser,
  faCalendarAlt,
  faUsers,
  faClock,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import courseRegistrationService from "../../../services/courseRegistrationService.js";
import courseOfferingService from "../../../services/courseOfferingService.js";
import userService from "../../../services/userService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";
import { formatDate } from "../../../utils/formatterUtil.js";

const CourseRegistrationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State management
  const [registration, setRegistration] = useState(null);
  const [courseOffering, setCourseOffering] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load registration details
  const loadRegistrationDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load registration details
      const registrationResponse =
        await courseRegistrationService.getRegistrationById(id);
      if (registrationResponse?.result) {
        const regData = registrationResponse.result;
        setRegistration(regData);

        // Load course offering details
        if (regData.courseOfferingId) {
          const courseOfferingResponse =
            await courseOfferingService.getCourseOfferingById(
              regData.courseOfferingId
            );
          if (courseOfferingResponse?.result) {
            setCourseOffering(courseOfferingResponse.result);
          }
        }

        // Load student details
        if (regData.studentId) {
          try {
            const studentResponse = await userService.getUserById(
              regData.studentId
            );
            if (studentResponse?.result) {
              setStudent(studentResponse.result);
            }
          } catch (err) {
            console.warn("Could not load student details:", err);
            // Continue without student details
          }
        }
      }
    } catch (err) {
      console.error("Error loading registration details:", err);
      setError("Không thể tải thông tin đăng ký. Vui lòng thử lại.");
      toast.error("Lỗi khi tải thông tin đăng ký");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (id) {
      loadRegistrationDetails();
    }
  }, [id]);

  // Helper functions
  const getStatusBadge = (status) => {
    switch (status) {
      case "REGISTERED":
        return <Badge bg="success">Đã Đăng Ký</Badge>;
      case "PENDING":
        return <Badge bg="warning">Chờ Duyệt</Badge>;
      case "CANCELLED":
        return <Badge bg="danger">Đã Hủy</Badge>;
      case "COMPLETED":
        return <Badge bg="info">Hoàn Thành</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getRegistrationTimeInfo = (openTime, closeTime) => {
    const now = new Date();
    const open = new Date(openTime);
    const close = new Date(closeTime);

    if (now < open) {
      return "Chưa mở đăng ký";
    } else if (now > close) {
      return "Đã đóng đăng ký";
    } else {
      return "Đang mở đăng ký";
    }
  };

  if (loading) {
    return (
      <MainLayout activeMenu="course-registrations">
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
      <MainLayout activeMenu="course-registrations">
        <div className="container-fluid pt-3 pb-5">
          <Alert variant="danger">{error}</Alert>
          <Button
            variant="outline-primary"
            onClick={() => navigate("/admin/enrollment/course-registrations")}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
            Quay lại danh sách
          </Button>
        </div>
      </MainLayout>
    );
  }

  if (!registration) {
    return (
      <MainLayout activeMenu="course-registrations">
        <div className="container-fluid pt-3 pb-5">
          <Alert variant="warning">Không tìm thấy thông tin đăng ký.</Alert>
          <Button
            variant="outline-primary"
            onClick={() => navigate("/admin/enrollment/course-registrations")}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
            Quay lại danh sách
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout activeMenu="course-registrations">
      <div className="container-fluid pt-3 pb-5">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h4 fw-bold text-dark">Chi Tiết Đăng Ký</h2>
            <p className="text-muted mb-0">
              Thông tin chi tiết đăng ký #{registration.id}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              onClick={() => loadRegistrationDetails()}
            >
              <FontAwesomeIcon icon={faRefresh} className="me-1" />
              Làm mới
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => {
                if (courseOffering) {
                  navigate(
                    `/admin/enrollment/course-registrations/course-offering/${courseOffering.id}`
                  );
                } else {
                  navigate("/admin/enrollment/course-registrations");
                }
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
              Quay lại
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                navigate(
                  `/admin/enrollment/course-registrations/edit/${registration.id}`
                )
              }
            >
              <FontAwesomeIcon icon={faEdit} className="me-1" />
              Chỉnh sửa
            </Button>
          </div>
        </div>

        <Row>
          <Col lg={8}>
            {/* Registration Information */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-light border-0">
                <h5 className="mb-0 d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={faIdCard}
                    className="me-2 text-primary"
                  />
                  Thông Tin Đăng Ký
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="text-muted small mb-1">
                        ID Đăng Ký
                      </label>
                      <div className="fw-medium">#{registration.id}</div>
                    </div>
                    <div className="mb-3">
                      <label className="text-muted small mb-1">
                        Ngày Đăng Ký
                      </label>
                      <div className="fw-medium">
                        {formatDate(registration.registrationDate)}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="text-muted small mb-1">
                        Trạng Thái
                      </label>
                      <div>
                        {getStatusBadge(registration.courseRegistrationStatus)}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="text-muted small mb-1">
                        ID Sinh Viên
                      </label>
                      <div className="fw-medium">{registration.studentId}</div>
                    </div>
                    <div className="mb-3">
                      <label className="text-muted small mb-1">
                        ID Khóa Học
                      </label>
                      <div className="fw-medium">
                        {registration.courseOfferingId}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Student Information */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-light border-0">
                <h5 className="mb-0 d-flex align-items-center">
                  <FontAwesomeIcon icon={faUser} className="me-2 text-info" />
                  Thông Tin Sinh Viên
                </h5>
              </Card.Header>
              <Card.Body>
                {student ? (
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <label className="text-muted small mb-1">
                          Họ và Tên
                        </label>
                        <div className="fw-medium">
                          {student.fullName || "N/A"}
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small mb-1">Email</label>
                        <div className="fw-medium">
                          {student.email || "N/A"}
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <label className="text-muted small mb-1">
                          Số Điện Thoại
                        </label>
                        <div className="fw-medium">
                          {student.phone || "N/A"}
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small mb-1">Số CCCD</label>
                        <div className="fw-medium">
                          {student.identityNumber || "N/A"}
                        </div>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <div className="text-center py-3 text-muted">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    Không thể tải thông tin sinh viên
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* Course Offering Information */}
            {courseOffering && (
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                  <h5 className="mb-0 d-flex align-items-center">
                    <FontAwesomeIcon
                      icon={faGraduationCap}
                      className="me-2 text-success"
                    />
                    Thông Tin Khóa Học
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <label className="text-muted small mb-1">Tên Môn Học</label>
                    <div className="fw-medium">
                      {courseOffering.courseResponse?.name || "N/A"}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small mb-1">Mã Môn Học</label>
                    <div className="fw-medium">
                      {courseOffering.courseResponse?.code || "N/A"}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small mb-1">Học Kỳ</label>
                    <div className="fw-medium">
                      {courseOffering.semesterResponse?.name || "N/A"}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small mb-1">Giảng Viên</label>
                    <div className="fw-medium">
                      {courseOffering.teacherResponse?.fullName || "N/A"}
                    </div>
                  </div>
                  <div className="border-top pt-3 mt-3">
                    <div className="mb-2">
                      <div className="d-flex justify-content-between">
                        <span className="text-muted small">Sĩ số tối đa:</span>
                        <span className="fw-medium">
                          {courseOffering.maxStudents || 0}
                        </span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="d-flex justify-content-between">
                        <span className="text-muted small">Đã đăng ký:</span>
                        <span className="fw-medium">
                          {courseOffering.currentStudents || 0}
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span className="text-muted small">Còn lại:</span>
                        <span className="fw-medium">
                          {Math.max(
                            0,
                            (courseOffering.maxStudents || 0) -
                              (courseOffering.currentStudents || 0)
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="border-top pt-2">
                      <small className="text-muted">
                        <FontAwesomeIcon icon={faClock} className="me-1" />
                        {getRegistrationTimeInfo(
                          courseOffering.openTime,
                          courseOffering.closeTime
                        )}
                      </small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Registration Period */}
            {courseOffering && (
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-light border-0">
                  <h5 className="mb-0 d-flex align-items-center">
                    <FontAwesomeIcon
                      icon={faClock}
                      className="me-2 text-warning"
                    />
                    Thời Gian Đăng Ký
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <label className="text-muted small mb-1">
                      Thời Gian Mở
                    </label>
                    <div className="fw-medium">
                      {formatDate(courseOffering.openTime)}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small mb-1">
                      Thời Gian Đóng
                    </label>
                    <div className="fw-medium">
                      {formatDate(courseOffering.closeTime)}
                    </div>
                  </div>
                  <div className="bg-light rounded p-3">
                    <div className="text-center">
                      <small className="text-muted">Trạng thái hiện tại</small>
                      <div className="fw-medium mt-1">
                        {getRegistrationTimeInfo(
                          courseOffering.openTime,
                          courseOffering.closeTime
                        )}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default CourseRegistrationDetails;
