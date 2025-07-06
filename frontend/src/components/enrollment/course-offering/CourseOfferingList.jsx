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
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEye,
  faEdit,
  faTrash,
  faEllipsisVertical,
  faRefresh,
  faSearch,
  faTimes,
  faChalkboardTeacher,
  faUsers,
  faCalendarAlt,
  faGraduationCap,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import courseOfferingService from "../../../services/courseOfferingService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";
import { formatDate } from "../../../utils/formatterUtil.js";

const CourseOfferingList = () => {
  const navigate = useNavigate();

  // State management
  const [courseOfferings, setCourseOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("openTime");
  const [isSearching, setIsSearching] = useState(false);

  // Load course offerings data
  const loadCourseOfferings = async (
    page = 0,
    size = pageSize,
    search = "",
    searchBy = "openTime"
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        size,
        sort: "id,desc",
      };

      // Add search parameters if search term exists
      if (search.trim()) {
        params.searchValue = search.trim();
        params.searchCriterion = searchBy;
      }

      const response = await courseOfferingService.getAllCourseOfferings(params);

      // Handle response structure
      if (response.result) {
        setCourseOfferings(response.result.content || []);
        setTotalPages(response.result.totalPages || 1);
        setTotalElements(response.result.totalElements || 0);
        setCurrentPage(response.result.number || page);
      } else {
        // Direct array response (fallback)
        setCourseOfferings(response);
        setTotalPages(1);
        setTotalElements(response.length);
        setCurrentPage(page);
      }
    } catch (err) {
      setError("Không thể tải danh sách khóa học. Vui lòng thử lại.");
      console.error("Error loading course offerings:", err);
      toast.error("Lỗi khi tải danh sách khóa học");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadCourseOfferings();
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    loadCourseOfferings(page, pageSize, searchTerm, searchType);
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    loadCourseOfferings(0, newSize, searchTerm, searchType);
  };

  // Search handler functions
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    if (searchTerm.trim()) {
      setCurrentPage(0);
      loadCourseOfferings(0, pageSize, searchTerm, type);
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    setCurrentPage(0);
    loadCourseOfferings(0, pageSize, searchTerm, searchType);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchType("openTime");
    setCurrentPage(0);
    loadCourseOfferings(0, pageSize, "", "openTime");
  };

  // Handle course offering actions
  const handleViewCourseOffering = (courseOffering) => {
    navigate(`/admin/enrollment/course-offerings/details/${courseOffering.id}`);
  };

  const handleEditCourseOffering = (courseOffering) => {
    navigate(`/admin/enrollment/course-offerings/edit/${courseOffering.id}`);
  };

  const handleDeleteCourseOffering = async (courseOffering) => {
    const courseName = courseOffering.courseResponse?.name || courseOffering.courseResponse?.code || "khóa học này";
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa khóa học "${courseName}"?\n\nLưu ý: Việc xóa khóa học có thể ảnh hưởng đến các đăng ký liên quan.`
      )
    ) {
      try {
        await courseOfferingService.deleteCourseOffering(courseOffering.id);
        toast.success("Xóa khóa học thành công");
        loadCourseOfferings(currentPage, pageSize, searchTerm, searchType);
      } catch (err) {
        toast.error("Lỗi khi xóa khóa học");
        console.error("Error deleting course offering:", err);
      }
    }
  };

  // Get course offering status based on registration period
  const getCourseOfferingStatus = (openTime, closeTime, currentStudents, maxStudents) => {
    const now = new Date();
    const open = new Date(openTime);
    const close = new Date(closeTime);
    
    if (currentStudents >= maxStudents) {
      return { status: "Đã đầy", variant: "warning" };
    } else if (now < open) {
      return { status: "Chưa mở", variant: "secondary" };
    } else if (now > close) {
      return { status: "Đã đóng", variant: "danger" };
    } else {
      return { status: "Đang mở", variant: "success" };
    }
  };

  // Smart pagination helper
  const getVisiblePageNumbers = () => {
    const maxPages = Math.max(1, totalPages || 1);

    if (maxPages <= 7) {
      return Array.from({ length: maxPages }, (_, i) => i);
    }

    const current = currentPage;
    const pages = new Set();

    pages.add(0);
    pages.add(1);
    pages.add(maxPages - 2);
    pages.add(maxPages - 1);

    for (
      let i = Math.max(0, current - 1);
      i <= Math.min(maxPages - 1, current + 1);
      i++
    ) {
      pages.add(i);
    }

    const sortedPages = Array.from(pages).sort((a, b) => a - b);
    const result = [];

    for (let i = 0; i < sortedPages.length; i++) {
      if (i > 0 && sortedPages[i] - sortedPages[i - 1] > 1) {
        result.push("ellipsis");
      }
      result.push(sortedPages[i]);
    }

    return result;
  };

  return (
    <MainLayout activeMenu="course-offerings">
      <div className="container-fluid pt-3 pb-5">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h4 fw-bold text-dark">Quản Lý Khóa Học</h2>
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
                loadCourseOfferings(currentPage, pageSize, searchTerm, searchType)
              }
              disabled={loading}
            >
              <FontAwesomeIcon icon={faRefresh} className="me-1" />
              Làm Mới
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate("/admin/enrollment/course-offerings/create")}
            >
              <FontAwesomeIcon icon={faPlus} className="me-1" />
              Thêm Mới
            </Button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          {/* Search Block - Left Side */}
          <div className="d-flex align-items-center gap-2">
            <span>Tìm kiếm:</span>
            <Form.Select
              style={{ width: "150px" }}
              value={searchType}
              onChange={(e) => handleSearchTypeChange(e.target.value)}
            >
              <option value="openTime">Thời gian mở</option>
            </Form.Select>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Nhập từ khóa..."
                value={searchTerm}
                onChange={handleSearchInputChange}
                onKeyPress={handleSearchKeyPress}
                style={{ width: "300px" }}
              />
              <Button variant="primary" onClick={handleSearch} disabled={isSearching}>
                {isSearching ? (
                  <Spinner size="sm" animation="border" />
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

        {/* Course Offerings Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {/* Loading State */}
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
              </div>
            ) : courseOfferings.length === 0 ? (
              <div className="text-center py-5">
                <FontAwesomeIcon
                  icon={faChalkboardTeacher}
                  size="2x"
                  className="text-muted mb-3"
                />
                <p className="text-muted mb-0">
                  {searchTerm
                    ? "Không tìm thấy khóa học nào."
                    : "Chưa có khóa học nào."}
                </p>
              </div>
            ) : (
              <>
                {/* Table */}
                <Table hover responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">Môn Học</th>
                      <th className="border-0">Giảng Viên</th>
                      <th className="border-0">Học Kỳ</th>
                      <th className="border-0">Số Lượng</th>
                      <th className="border-0">Thời Gian Đăng Ký</th>
                      <th className="border-0">Trạng Thái</th>
                      <th className="border-0" style={{ width: "100px" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseOfferings.map((courseOffering) => {
                      const status = getCourseOfferingStatus(
                        courseOffering.openTime,
                        courseOffering.closeTime,
                        courseOffering.currentStudents,
                        courseOffering.maxStudents
                      );
                      return (
                        <tr key={courseOffering.id}>
                          <td>#{courseOffering.id}</td>
                          <td className="fw-medium">
                            <FontAwesomeIcon
                              icon={faGraduationCap}
                              className="me-2 text-primary"
                            />
                            <div>
                              <div>{courseOffering.courseResponse?.name || 'N/A'}</div>
                              <small className="text-muted">
                                {courseOffering.courseResponse?.code || 'N/A'}
                              </small>
                            </div>
                          </td>
                          <td>
                            <FontAwesomeIcon
                              icon={faUser}
                              className="me-2 text-info"
                            />
                            <div>
                              <div>{courseOffering.teacherResponse?.teacherName || 'N/A'}</div>
                              <small className="text-muted">
                                {courseOffering.teacherResponse?.teacherCode || 'N/A'}
                              </small>
                            </div>
                          </td>
                          <td>
                            <FontAwesomeIcon
                              icon={faCalendarAlt}
                              className="me-2 text-warning"
                            />
                            {courseOffering.semesterResponse?.name || 'N/A'}
                          </td>
                          <td>
                            <FontAwesomeIcon
                              icon={faUsers}
                              className="me-2 text-success"
                            />
                            {courseOffering.currentStudents || 0}/{courseOffering.maxStudents || 0}
                          </td>
                          <td>
                            <div>
                              <small className="text-muted">Mở: </small>
                              {formatDate(courseOffering.openTime)}
                            </div>
                            <div>
                              <small className="text-muted">Đóng: </small>
                              {formatDate(courseOffering.closeTime)}
                            </div>
                          </td>
                          <td>
                            <Badge bg={status.variant}>{status.status}</Badge>
                          </td>
                          <td>
                            <Dropdown align="end">
                              <Dropdown.Toggle
                                variant="light"
                                size="sm"
                                className="border-0"
                              >
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onClick={() => handleViewCourseOffering(courseOffering)}
                                >
                                  <FontAwesomeIcon
                                    icon={faEye}
                                    className="me-2"
                                  />
                                  Xem Chi Tiết
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() => handleEditCourseOffering(courseOffering)}
                                >
                                  <FontAwesomeIcon
                                    icon={faEdit}
                                    className="me-2"
                                  />
                                  Chỉnh Sửa
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item
                                  onClick={() =>
                                    handleDeleteCourseOffering(courseOffering)
                                  }
                                  className="text-danger"
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
                    })}
                  </tbody>
                </Table>

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center p-3 border-top">
                  <div className="text-muted">
                    Hiển thị {currentPage * pageSize + 1} -{" "}
                    {Math.min((currentPage + 1) * pageSize, totalElements)}{" "}
                    trong tổng số {totalElements}
                    {searchTerm && (
                      <span className="text-primary ms-2">
                        kết quả tìm kiếm
                      </span>
                    )}
                  </div>
                  <Pagination className="mb-0">
                    <Pagination.First
                      onClick={() => handlePageChange(0)}
                      disabled={currentPage === 0}
                    />
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                    />

                    {getVisiblePageNumbers().map((pageNumber, index) =>
                      pageNumber === "ellipsis" ? (
                        <Pagination.Ellipsis key={`ellipsis-${index}`} />
                      ) : (
                        <Pagination.Item
                          key={pageNumber}
                          active={pageNumber === currentPage}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber + 1}
                        </Pagination.Item>
                      )
                    )}

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
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CourseOfferingList;
