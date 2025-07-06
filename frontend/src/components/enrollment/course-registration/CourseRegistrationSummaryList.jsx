import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Badge,
  Dropdown,
  Alert,
  Spinner,
  Pagination,
  Form,
  ProgressBar,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEye,
  faTrash,
  faEllipsisVertical,
  faRefresh,
  faSearch,
  faTimes,
  faUserGraduate,
  faUsers,
  faCalendarAlt,
  faGraduationCap,
  faUser,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import courseRegistrationService from "../../../services/courseRegistrationService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

const CourseRegistrationSummaryList = () => {
  const navigate = useNavigate();

  // State management
  const [registrationSummaries, setRegistrationSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("courseName");
  const [isSearching, setIsSearching] = useState(false);

  // Load registration summaries
  const loadRegistrationSummaries = async (
    page,
    size,
    searchValue = "",
    searchCriterion = "courseName"
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        size,
        sort: "cr.courseOffering.id,asc",
        searchValue: searchValue || undefined,
        searchCriterion: searchCriterion || "courseName",
      };

      const response = await courseRegistrationService.getRegistrationSummaries(
        params
      );

      if (response?.result) {
        setRegistrationSummaries(response.result.content || []);
        setTotalPages(response.result.totalPages || 0);
        setTotalElements(response.result.totalElements || 0);
        setCurrentPage(response.result.number || 0);
      }
    } catch (err) {
      console.error("Error loading registration summaries:", err);
      setError("Không thể tải danh sách đăng ký khóa học. Vui lòng thử lại.");
      toast.error("Lỗi khi tải danh sách đăng ký khóa học");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadRegistrationSummaries(currentPage, pageSize, searchTerm, searchType);
  }, [currentPage, pageSize]);

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(0);
    loadRegistrationSummaries(0, newSize, searchTerm, searchType);
  };

  // Handle search
  const handleSearch = () => {
    setIsSearching(true);
    setCurrentPage(0);
    loadRegistrationSummaries(0, pageSize, searchTerm, searchType);
    setTimeout(() => setIsSearching(false), 500);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchType("courseName");
    setCurrentPage(0);
    loadRegistrationSummaries(0, pageSize, "", "courseName");
  };

  // Handle actions
  const handleViewDetails = (summary) => {
    navigate(
      `/admin/enrollment/course-registrations/course-offering/${summary.courseOfferingId}`
    );
  };

  const handleDelete = async (summary) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa tất cả đăng ký cho khóa học "${summary.courseName}"?`
      )
    ) {
      try {
        // Note: This would need a bulk delete endpoint in the backend
        toast.error("Chức năng xóa hàng loạt chưa được triển khai");
      } catch (err) {
        console.error("Error deleting registrations:", err);
        toast.error("Lỗi khi xóa đăng ký khóa học");
      }
    }
  };

  // Helper functions
  const getStatusBadge = (status) => {
    switch (status) {
      case "OPEN":
        return <Badge bg="success">Đang Mở</Badge>;
      case "CLOSED":
        return <Badge bg="secondary">Đã Đóng</Badge>;
      case "FULL":
        return <Badge bg="danger">Đã Đầy</Badge>;
      default:
        return <Badge bg="warning">Không Rõ</Badge>;
    }
  };

  const getRegistrationRate = (current, max) => {
    if (!max || max === 0) return 0;
    return Math.round((current / max) * 100);
  };

  const getProgressVariant = (rate) => {
    if (rate >= 100) return "danger";
    if (rate >= 80) return "warning";
    if (rate >= 50) return "info";
    return "success";
  };

  return (
    <MainLayout activeMenu="course-registrations">
      <div className="container-fluid pt-3 pb-5">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h4 fw-bold text-dark">Quản Lý Đăng Ký Khóa Học</h2>
            <p className="text-muted mb-0">
              Tổng cộng: {totalElements} khóa học
              {searchTerm && (
                <span className="text-primary ms-2">
                  (Tìm kiếm: "{searchTerm}")
                </span>
              )}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              onClick={() =>
                loadRegistrationSummaries(
                  currentPage,
                  pageSize,
                  searchTerm,
                  searchType
                )
              }
              disabled={loading}
            >
              <FontAwesomeIcon icon={faRefresh} />
              <span className="ms-2">Làm mới</span>
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                navigate("/admin/enrollment/course-registrations/create")
              }
            >
              <FontAwesomeIcon icon={faPlus} />
              <span className="ms-2">Thêm Đăng Ký</span>
            </Button>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          {/* Search Section - Left Side */}
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <Form.Select
                style={{ width: "150px" }}
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="courseName">Tên Môn Học</option>
                <option value="courseCode">Mã Môn Học</option>
                <option value="teacherName">Giảng Viên</option>
                <option value="semesterName">Học Kỳ</option>
              </Form.Select>
              <Form.Control
                type="text"
                placeholder="Nhập từ khóa tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                style={{ width: "300px" }}
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
                <span className="ms-2">Tìm</span>
              </Button>
              {searchTerm && (
                <Button variant="secondary" onClick={handleClearSearch}>
                  <FontAwesomeIcon icon={faTimes} />
                </Button>
              )}
            </div>
          </div>

          {/* Page Size Selection - Right Side */}
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
            {/* Registration Summaries Table */}
            <div className="bg-white rounded shadow-sm">
              <Table responsive hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 fw-medium text-muted">
                      <FontAwesomeIcon
                        icon={faGraduationCap}
                        className="me-2"
                      />
                      Môn Học
                    </th>
                    <th className="border-0 fw-medium text-muted">
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                      Học Kỳ
                    </th>
                    <th className="border-0 fw-medium text-muted">
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      Giảng Viên
                    </th>
                    <th className="border-0 fw-medium text-muted">
                      <FontAwesomeIcon icon={faUsers} className="me-2" />
                      Sĩ Số
                    </th>
                    <th className="border-0 fw-medium text-muted">
                      <FontAwesomeIcon icon={faChartBar} className="me-2" />
                      Tỷ Lệ Đăng Ký
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
                  {registrationSummaries.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        <FontAwesomeIcon
                          icon={faUserGraduate}
                          size="2x"
                          className="mb-2 opacity-50"
                        />
                        <p className="mb-0">
                          Không có dữ liệu đăng ký khóa học
                        </p>
                      </td>
                    </tr>
                  ) : (
                    registrationSummaries.map((summary) => {
                      const registrationRate = getRegistrationRate(
                        summary.currentStudents,
                        summary.maxStudents
                      );
                      return (
                        <tr key={summary.courseOfferingId}>
                          <td>
                            <div>
                              <div className="fw-medium text-dark">
                                {summary.courseName || "N/A"}
                              </div>
                              <small className="text-muted">
                                {summary.courseCode || "N/A"}
                              </small>
                            </div>
                          </td>
                          <td>
                            <span className="fw-medium">
                              {summary.semesterName || "N/A"}
                            </span>
                          </td>
                          <td>
                            <span className="fw-medium">
                              {summary.teacherName || "N/A"}
                            </span>
                          </td>
                          <td>
                            <div>
                              <span className="fw-medium">
                                {summary.currentStudents || 0}/
                                {summary.maxStudents || 0}
                              </span>
                              <ProgressBar
                                variant={getProgressVariant(registrationRate)}
                                now={registrationRate}
                                className="mt-1"
                                style={{ height: "4px" }}
                              />
                            </div>
                          </td>
                          <td>
                            <span className="fw-medium">
                              {registrationRate}%
                            </span>
                          </td>
                          <td>{getStatusBadge(summary.registrationStatus)}</td>
                          <td className="text-center">
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="outline-secondary"
                                size="sm"
                                className="border-0"
                              >
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onClick={() => handleViewDetails(summary)}
                                >
                                  <FontAwesomeIcon
                                    icon={faEye}
                                    className="me-2"
                                  />
                                  Xem Chi Tiết
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item
                                  className="text-danger"
                                  onClick={() => handleDelete(summary)}
                                >
                                  <FontAwesomeIcon
                                    icon={faTrash}
                                    className="me-2"
                                  />
                                  Xóa
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      );
                    })
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

export default CourseRegistrationSummaryList;
