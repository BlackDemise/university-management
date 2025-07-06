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
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import semesterService from "../../../services/semesterService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";
import { formatDate } from "../../../utils/formatterUtil.js";

const SemesterList = () => {
  const navigate = useNavigate();

  // State management
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [isSearching, setIsSearching] = useState(false);

  // Load semesters data
  const loadSemesters = async (
    page = 0,
    size = pageSize,
    search = "",
    searchBy = "name"
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

      const response = await semesterService.getAllSemesters(params);

      // Handle response structure
      if (response.result) {
        setSemesters(response.result.content || []);
        setTotalPages(response.result.totalPages || 1);
        setTotalElements(response.result.totalElements || 0);
        setCurrentPage(response.result.number || page);
      } else {
        // Direct array response (fallback)
        setSemesters(response);
        setTotalPages(1);
        setTotalElements(response.length);
        setCurrentPage(page);
      }
    } catch (err) {
      setError("Không thể tải danh sách học kỳ. Vui lòng thử lại.");
      console.error("Error loading semesters:", err);
      toast.error("Lỗi khi tải danh sách học kỳ");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadSemesters();
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    loadSemesters(page, pageSize, searchTerm, searchType);
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    loadSemesters(0, newSize, searchTerm, searchType);
  };

  // Search handler functions
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    if (searchTerm.trim()) {
      setCurrentPage(0);
      loadSemesters(0, pageSize, searchTerm, type);
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    setCurrentPage(0);
    loadSemesters(0, pageSize, searchTerm, searchType);
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
    setSearchType("name");
    setCurrentPage(0);
    loadSemesters(0, pageSize, "", "name");
  };

  // Handle semester actions
  const handleViewSemester = (semester) => {
    navigate(`/admin/enrollment/semesters/details/${semester.id}`);
  };

  const handleEditSemester = (semester) => {
    navigate(`/admin/enrollment/semesters/edit/${semester.id}`);
  };

  const handleDeleteSemester = async (semester) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa học kỳ "${semester.name}"?\n\nLưu ý: Việc xóa học kỳ có thể ảnh hưởng đến các khóa học và đăng ký liên quan.`
      )
    ) {
      try {
        await semesterService.deleteSemester(semester.id);
        toast.success("Xóa học kỳ thành công");
        loadSemesters(currentPage, pageSize, searchTerm, searchType);
      } catch (err) {
        toast.error("Lỗi khi xóa học kỳ");
        console.error("Error deleting semester:", err);
      }
    }
  };

  // Get semester status based on dates
  const getSemesterStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (today < start) {
      return { status: "Chưa bắt đầu", variant: "secondary" };
    } else if (today > end) {
      return { status: "Đã kết thúc", variant: "danger" };
    } else {
      return { status: "Đang diễn ra", variant: "success" };
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
    <MainLayout activeMenu="semesters">
      <div className="container-fluid pt-3 pb-5">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h4 fw-bold text-dark">Quản Lý Học Kỳ</h2>
            <p className="text-muted mb-0">
              Tổng cộng: {totalElements} học kỳ
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
                loadSemesters(currentPage, pageSize, searchTerm, searchType)
              }
              disabled={loading}
            >
              <FontAwesomeIcon icon={faRefresh} className="me-1" />
              Làm Mới
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate("/admin/enrollment/semesters/create")}
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
              <option value="name">Tên Học Kỳ</option>
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

        {/* Semesters Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {/* Loading State */}
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
              </div>
            ) : semesters.length === 0 ? (
              <div className="text-center py-5">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  size="2x"
                  className="text-muted mb-3"
                />
                <p className="text-muted mb-0">
                  {searchTerm
                    ? "Không tìm thấy học kỳ nào."
                    : "Chưa có học kỳ nào."}
                </p>
              </div>
            ) : (
              <>
                {/* Table */}
                <Table hover responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">Tên Học Kỳ</th>
                      <th className="border-0">Ngày Bắt Đầu</th>
                      <th className="border-0">Ngày Kết Thúc</th>
                      <th className="border-0">Trạng Thái</th>
                      <th className="border-0" style={{ width: "100px" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {semesters.map((semester) => {
                      const status = getSemesterStatus(semester.startDate, semester.endDate);
                      return (
                        <tr key={semester.id}>
                          <td>#{semester.id}</td>
                          <td className="fw-medium">
                            <FontAwesomeIcon
                              icon={faCalendarAlt}
                              className="me-2 text-primary"
                            />
                            {semester.name}
                          </td>
                          <td>{formatDate(semester.startDate)}</td>
                          <td>{formatDate(semester.endDate)}</td>
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
                                  onClick={() => handleViewSemester(semester)}
                                >
                                  <FontAwesomeIcon
                                    icon={faEye}
                                    className="me-2"
                                  />
                                  Xem Chi Tiết
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() => handleEditSemester(semester)}
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
                                    handleDeleteSemester(semester)
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

export default SemesterList;
