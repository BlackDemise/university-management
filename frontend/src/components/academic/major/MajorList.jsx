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
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { majorService } from "../../../services/apiService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

const MajorList = () => {
  const navigate = useNavigate();

  // State management
  const [majors, setMajors] = useState([]);
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

  // Load majors data
  const loadMajors = async (
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

      const response = await majorService.getAllMajors(params);

      // Handle response structure
      if (response.result) {
        setMajors(response.result.content || []);
        setTotalPages(response.result.totalPages || 1);
        setTotalElements(response.result.totalElements || 0);
        setCurrentPage(response.result.number || page);
      } else {
        // Direct array response (fallback)
        setMajors(response);
        setTotalPages(1);
        setTotalElements(response.length);
        setCurrentPage(page);
      }
    } catch (err) {
      setError("Không thể tải danh sách ngành học. Vui lòng thử lại.");
      console.error("Error loading majors:", err);
      toast.error("Lỗi khi tải danh sách ngành học");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadMajors();
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    loadMajors(page, pageSize, searchTerm, searchType);
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    loadMajors(0, newSize, searchTerm, searchType);
  };

  // Search handler functions
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    if (searchTerm.trim()) {
      setCurrentPage(0);
      loadMajors(0, pageSize, searchTerm, type);
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    setCurrentPage(0);
    loadMajors(0, pageSize, searchTerm, searchType);
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
    loadMajors(0, pageSize, "", "name");
  };

  // Handle major actions
  const handleViewMajor = (major) => {
    navigate(`/admin/academic/majors/details/${major.id}`);
  };

  const handleEditMajor = (major) => {
    navigate(`/admin/academic/majors/edit/${major.id}`);
  };

  const handleDeleteMajor = async (major) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ngành học "${major.name}"?\n\nLưu ý: Việc xóa ngành học có thể ảnh hưởng đến các chương trình đào tạo liên quan.`
      )
    ) {
      try {
        await majorService.deleteMajor(major.id);
        toast.success("Xóa ngành học thành công");
        loadMajors(currentPage, pageSize, searchTerm, searchType);
      } catch (err) {
        toast.error("Lỗi khi xóa ngành học");
        console.error("Error deleting major:", err);
      }
    }
  };

  // Get search type display text
  const getSearchTypeDisplayText = (type) => {
    switch (type) {
      case "name":
        return "Tên Ngành Học";
      case "departmentResponse.name":
        return "Tên Khoa";
      default:
        return type;
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
    <MainLayout activeMenu="majors">
      <div className="container-fluid pt-3 pb-5">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h4 fw-bold text-dark">Quản Lý Ngành Học</h2>
            <p className="text-muted mb-0">
              Tổng cộng: {totalElements} ngành học
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
                loadMajors(currentPage, pageSize, searchTerm, searchType)
              }
              disabled={loading}
            >
              <FontAwesomeIcon icon={faRefresh} className="me-1" />
              Làm Mới
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate("/admin/academic/majors/create")}
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
              <option value="name">Tên Ngành</option>
              <option value="departmentName">Tên Khoa</option>
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

        {/* Majors Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {/* Loading State */}
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
              </div>
            ) : majors.length === 0 ? (
              <div className="text-center py-5">
                <FontAwesomeIcon
                  icon={faGraduationCap}
                  size="2x"
                  className="text-muted mb-3"
                />
                <p className="text-muted mb-0">
                  {searchTerm
                    ? "Không tìm thấy ngành học nào."
                    : "Chưa có ngành học nào."}
                </p>
              </div>
            ) : (
              <>
                {/* Table */}
                <Table hover responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">Tên Ngành Học</th>
                      <th className="border-0">Khoa</th>
                      <th className="border-0">Tín Chỉ</th>
                      <th className="border-0">Trạng Thái</th>
                      <th className="border-0" style={{ width: "100px" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {majors.map((major) => (
                      <tr key={major.id}>
                        <td>#{major.id}</td>
                        <td className="fw-medium">
                          <FontAwesomeIcon
                            icon={faGraduationCap}
                            className="me-2 text-primary"
                          />
                          {major.name}
                        </td>
                        <td>{major.departmentResponse?.name || "—"}</td>
                        <td>{major.totalCreditsRequired} tín chỉ</td>
                        <td>
                          <Badge bg="success">Hoạt động</Badge>
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
                                onClick={() => handleViewMajor(major)}
                              >
                                <FontAwesomeIcon
                                  icon={faEye}
                                  className="me-2"
                                />
                                Xem Chi Tiết
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleEditMajor(major)}
                              >
                                <FontAwesomeIcon
                                  icon={faEdit}
                                  className="me-2"
                                />
                                Chỉnh Sửa
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item
                                onClick={() => handleDeleteMajor(major)}
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
                    ))}
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

export default MajorList;
