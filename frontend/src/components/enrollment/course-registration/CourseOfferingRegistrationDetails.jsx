import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Badge,
  Button,
  Spinner,
  Alert,
  Table,
  Pagination,
  Form,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEdit,
  faTrash,
  faEye,
  faPlus,
  faRefresh,
  faSearch,
  faTimes,
  faGraduationCap,
  faUser,
  faCalendarAlt,
  faUsers,
  faClock,
  faUserGraduate,
  faEllipsisVertical,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import courseRegistrationService from "../../../services/courseRegistrationService.js";
import courseOfferingService from "../../../services/courseOfferingService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";
import { formatDate } from "../../../utils/formatterUtil.js";

const CourseOfferingRegistrationDetails = () => {
  const { courseOfferingId } = useParams();
  const navigate = useNavigate();

  // State management
  const [courseOffering, setCourseOffering] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Load course offering details
  const loadCourseOffering = async () => {
    try {
      const response = await courseOfferingService.getCourseOfferingById(
        courseOfferingId
      );
      if (response?.result) {
        setCourseOffering(response.result);
      }
    } catch (err) {
      console.error("Error loading course offering:", err);
      setError("Không thể tải thông tin khóa học. Vui lòng thử lại.");
    }
  };

  // Load registrations for this course offering
  const loadRegistrations = async (page, size, searchValue = "") => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        size,
        sort: "registrationDate,desc",
      };

      // Add search if provided
      if (searchValue) {
        params.searchValue = searchValue;
      }

      const response =
        await courseRegistrationService.getRegistrationsByCourseOfferingWithPaging(
          courseOfferingId,
          params
        );

      if (response?.result) {
        setRegistrations(response.result.content || []);
        setTotalPages(response.result.totalPages || 0);
        setTotalElements(response.result.totalElements || 0);
        setCurrentPage(response.result.number || 0);
      }
    } catch (err) {
      console.error("Error loading registrations:", err);
      setError("Không thể tải danh sách đăng ký. Vui lòng thử lại.");
      toast.error("Lỗi khi tải danh sách đăng ký");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (courseOfferingId) {
      loadCourseOffering();
      loadRegistrations(currentPage, pageSize, searchTerm);
    }
  }, [courseOfferingId, currentPage, pageSize]);

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(0);
    loadRegistrations(0, newSize, searchTerm);
  };

  // Handle search
  const handleSearch = () => {
    setIsSearching(true);
    setCurrentPage(0);
    loadRegistrations(0, pageSize, searchTerm);
    setTimeout(() => setIsSearching(false), 500);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(0);
    loadRegistrations(0, pageSize, "");
  };

  // Handle actions
  const handleViewRegistrationDetails = (registration) => {
    navigate(
      `/admin/enrollment/course-registrations/details/${registration.id}`
    );
  };

  const handleEditRegistration = (registration) => {
    navigate(`/admin/enrollment/course-registrations/edit/${registration.id}`);
  };

  const handleDeleteRegistration = async (registration) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa đăng ký này?`)) {
      try {
        await courseRegistrationService.deleteRegistration(registration.id);
        toast.success("Xóa đăng ký thành công");
        loadRegistrations(currentPage, pageSize, searchTerm);
        loadCourseOffering(); // Refresh course offering to update current students count
      } catch (err) {
        console.error("Error deleting registration:", err);
        toast.error("Lỗi khi xóa đăng ký");
      }
    }
  };

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

  if (loading && !courseOffering) {
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

  if (error && !courseOffering) {
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

  return (
    <MainLayout activeMenu="course-registrations">
      <div className="container-fluid pt-3 pb-5">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h4 fw-bold text-dark">Chi Tiết Đăng Ký Khóa Học</h2>
            <p className="text-muted mb-0">
              Danh sách đăng ký cho{" "}
              {courseOffering?.courseResponse?.name || "Khóa học"}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              onClick={() => navigate("/admin/enrollment/course-registrations")}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
              Quay lại
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                navigate(
                  `/admin/enrollment/course-registrations/create?courseOfferingId=${courseOfferingId}`
                )
              }
            >
              <FontAwesomeIcon icon={faPlus} className="me-1" />
              Thêm Đăng Ký
            </Button>
          </div>
        </div>

        {/* Course Offering Information */}
        {courseOffering && (
          <Row className="mb-4">
            <Col lg={8}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-light border-0">
                  <h5 className="mb-0 d-flex align-items-center">
                    <FontAwesomeIcon
                      icon={faGraduationCap}
                      className="me-2 text-primary"
                    />
                    Thông Tin Khóa Học
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <label className="text-muted small mb-1">
                          Tên Môn Học
                        </label>
                        <div className="fw-medium">
                          {courseOffering.courseResponse?.name || "N/A"}
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small mb-1">
                          Mã Môn Học
                        </label>
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
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <label className="text-muted small mb-1">
                          Giảng Viên
                        </label>
                        <div className="fw-medium">
                          {courseOffering.teacherResponse?.fullName || "N/A"}
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small mb-1">
                          Thời Gian Mở Đăng Ký
                        </label>
                        <div className="fw-medium">
                          {formatDate(courseOffering.openTime)}
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small mb-1">
                          Thời Gian Đóng Đăng Ký
                        </label>
                        <div className="fw-medium">
                          {formatDate(courseOffering.closeTime)}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-light border-0">
                  <h5 className="mb-0 d-flex align-items-center">
                    <FontAwesomeIcon
                      icon={faUsers}
                      className="me-2 text-info"
                    />
                    Thống Kê Đăng Ký
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Sĩ số tối đa:</span>
                      <span className="fw-medium">
                        {courseOffering.maxStudents || 0}
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Đã đăng ký:</span>
                      <span className="fw-medium">
                        {courseOffering.currentStudents || 0}
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Còn lại:</span>
                      <span className="fw-medium">
                        {Math.max(
                          0,
                          (courseOffering.maxStudents || 0) -
                            (courseOffering.currentStudents || 0)
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="border-top pt-3 mt-3">
                    <small className="text-muted">
                      <FontAwesomeIcon icon={faClock} className="me-1" />
                      {getRegistrationTimeInfo(
                        courseOffering.openTime,
                        courseOffering.closeTime
                      )}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Search and Controls */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-3">
            <h5 className="mb-0">Danh Sách Đăng Ký ({totalElements})</h5>
            {searchTerm && (
              <span className="text-primary">(Tìm kiếm: "{searchTerm}")</span>
            )}
          </div>
          <div className="d-flex align-items-center gap-2">
            <Form.Control
              type="text"
              placeholder="Tìm kiếm sinh viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              style={{ width: "250px" }}
            />
            <Button
              variant="primary"
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <FontAwesomeIcon icon={faSearch} />
              )}
            </Button>
            {searchTerm && (
              <Button variant="secondary" onClick={handleClearSearch}>
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            )}
            <Button
              variant="outline-secondary"
              onClick={() =>
                loadRegistrations(currentPage, pageSize, searchTerm)
              }
              disabled={loading}
            >
              <FontAwesomeIcon icon={faRefresh} />
            </Button>
          </div>
        </div>

        {/* Page Size Selection */}
        <div className="d-flex justify-content-end align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <span>Hiển thị:</span>
            <Form.Select
              style={{ width: "110px" }}
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            >
              <option value={5}>5 dòng</option>
              <option value={10}>10 dòng</option>
              <option value={20}>20 dòng</option>
              <option value={50}>50 dòng</option>
            </Form.Select>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            {/* Registrations Table */}
            <div className="bg-white rounded shadow-sm">
              <Table responsive hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 fw-medium text-muted">ID</th>
                    <th className="border-0 fw-medium text-muted">
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      Sinh Viên
                    </th>
                    <th className="border-0 fw-medium text-muted">
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                      Ngày Đăng Ký
                    </th>
                    <th className="border-0 fw-medium text-muted">
                      Trạng Thái
                    </th>
                    <th className="border-0 fw-medium text-muted text-center">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        <FontAwesomeIcon
                          icon={faUserGraduate}
                          size="2x"
                          className="mb-2 opacity-50"
                        />
                        <p className="mb-0">
                          Chưa có đăng ký nào cho khóa học này
                        </p>
                      </td>
                    </tr>
                  ) : (
                    registrations.map((registration) => (
                      <tr key={registration.id}>
                        <td>
                          <span className="fw-medium">#{registration.id}</span>
                        </td>
                        <td>
                          <div>
                            <div className="fw-medium text-dark">
                              {/* Note: Student name would come from S2S call */}
                              Sinh viên ID: {registration.studentId}
                            </div>
                            <small className="text-muted">
                              {/* Note: Student email would come from S2S call */}
                              Email: student{registration.studentId}
                              @university.edu
                            </small>
                          </div>
                        </td>
                        <td>
                          <span className="fw-medium">
                            {formatDate(registration.registrationDate)}
                          </span>
                        </td>
                        <td>
                          {getStatusBadge(
                            registration.courseRegistrationStatus
                          )}
                        </td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-1">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() =>
                                handleViewRegistrationDetails(registration)
                              }
                              title="Xem chi tiết"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() =>
                                handleEditRegistration(registration)
                              }
                              title="Chỉnh sửa"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() =>
                                handleDeleteRegistration(registration)
                              }
                              title="Xóa"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination>
                  <Pagination.First
                    onClick={() => handlePageChange(0)}
                    disabled={currentPage === 0}
                  />
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                  />

                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index}
                      active={index === currentPage}
                      onClick={() => handlePageChange(index)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}

                  <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                  />
                  <Pagination.Last
                    onClick={() => handlePageChange(totalPages - 1)}
                    disabled={currentPage === totalPages - 1}
                  />
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default CourseOfferingRegistrationDetails;
