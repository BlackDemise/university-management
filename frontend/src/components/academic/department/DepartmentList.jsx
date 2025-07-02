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
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import departmentService from "../../../services/departmentService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

const DepartmentList = () => {
  const navigate = useNavigate();

  // State management
  const [departments, setDepartments] = useState([]);
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

  // Load departments data
  const loadDepartments = async (
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

      const response = await departmentService.getAllDepartments(params);

      // Handle response structure
      if (response.result) {
        setDepartments(response.result.content || []);
        setTotalPages(response.result.totalPages || 1);
        setTotalElements(response.result.totalElements || 0);
        setCurrentPage(response.result.number || page);
      } else {
        // Direct array response (fallback)
        setDepartments(response);
        setTotalPages(1);
        setTotalElements(response.length);
        setCurrentPage(page);
      }
    } catch (err) {
      setError("Không thể tải danh sách khoa/phòng ban. Vui lòng thử lại.");
      console.error("Error loading departments:", err);
      toast.error("Lỗi khi tải danh sách khoa/phòng ban");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadDepartments();
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    loadDepartments(page, pageSize, searchTerm, searchType);
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    loadDepartments(0, newSize, searchTerm, searchType);
  };

  // Search handler functions
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    if (searchTerm.trim()) {
      setCurrentPage(0);
      loadDepartments(0, pageSize, searchTerm, type);
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    setCurrentPage(0);
    loadDepartments(0, pageSize, searchTerm, searchType);
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
    loadDepartments(0, pageSize, "", "name");
  };

  // Handle department actions
  const handleViewDepartment = (department) => {
    navigate(`/admin/academic/departments/details/${department.id}`);
  };

  const handleEditDepartment = (department) => {
    navigate(`/admin/academic/departments/edit/${department.id}`);
  };

  const handleDeleteDepartment = async (department) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa khoa/phòng ban "${department.name}"?\n\nLưu ý: Việc xóa khoa/phòng ban có thể ảnh hưởng đến các ngành học và thành viên liên quan.`
      )
    ) {
      try {
        await departmentService.deleteDepartment(department.id);
        toast.success("Xóa khoa/phòng ban thành công");
        loadDepartments(currentPage, pageSize, searchTerm, searchType);
      } catch (err) {
        toast.error("Lỗi khi xóa khoa/phòng ban");
        console.error("Error deleting department:", err);
      }
    }
  };

  // Get search type display text
  const getSearchTypeDisplayText = (type) => {
    switch (type) {
      case "name":
        return "Tên Khoa/Phòng Ban";
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
    <MainLayout activeMenu="academic">
      <div className="container-fluid pt-3 pb-5">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h4 fw-bold text-dark">Quản Lý Khoa/Phòng Ban</h2>
            <p className="text-muted mb-0">
              Tổng cộng: {totalElements} khoa/phòng ban
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
                loadDepartments(currentPage, pageSize, searchTerm, searchType)
              }
              disabled={loading}
            >
              <FontAwesomeIcon icon={faRefresh} className="me-1" />
              Làm Mới
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate("/admin/academic/departments/create")}
            >
              <FontAwesomeIcon icon={faPlus} className="me-1" />
              Thêm Mới
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Departments Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {/* Search and Page Size Controls */}
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom flex-wrap gap-3">
              <div
                className="d-flex gap-2 flex-grow-1"
                style={{ maxWidth: "500px" }}
              >
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm khoa/phòng ban..."
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleSearchKeyPress}
                />
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
                {searchTerm && (
                  <Button
                    variant="outline-secondary"
                    onClick={handleClearSearch}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </Button>
                )}
              </div>
              <Form.Select
                style={{ width: "auto" }}
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                disabled={loading}
              >
                <option value="5">5 hàng</option>
                <option value="10">10 hàng</option>
                <option value="25">25 hàng</option>
                <option value="50">50 hàng</option>
              </Form.Select>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
              </div>
            ) : departments.length === 0 ? (
              <div className="text-center py-5">
                <FontAwesomeIcon
                  icon={faBuilding}
                  size="2x"
                  className="text-muted mb-3"
                />
                <p className="text-muted mb-0">
                  {searchTerm
                    ? "Không tìm thấy khoa/phòng ban nào."
                    : "Chưa có khoa/phòng ban nào."}
                </p>
              </div>
            ) : (
              <>
                {/* Table */}
                <Table hover responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">Tên Khoa/Phòng Ban</th>
                      <th className="border-0">Trạng Thái</th>
                      <th className="border-0" style={{ width: "100px" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((department) => (
                      <tr key={department.id}>
                        <td>#{department.id}</td>
                        <td className="fw-medium">
                          <FontAwesomeIcon
                            icon={faBuilding}
                            className="me-2 text-primary"
                          />
                          {department.name}
                        </td>
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
                                onClick={() => handleViewDepartment(department)}
                              >
                                <FontAwesomeIcon
                                  icon={faEye}
                                  className="me-2"
                                />
                                Xem Chi Tiết
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleEditDepartment(department)}
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
                                  handleDeleteDepartment(department)
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

export default DepartmentList;
