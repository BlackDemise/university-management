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
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { departmentMemberService } from "../../../services/apiService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

const DepartmentMemberList = () => {
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
  const [searchType, setSearchType] = useState("departmentName");
  const [isSearching, setIsSearching] = useState(false);

  // Load departments summary data
  const loadDepartmentsSummary = async (
    page = 0,
    size = pageSize,
    search = "",
    searchBy = "departmentName"
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        size,
        sort: "department.id,asc",
      };

      // Add search parameters if search term exists
      if (search.trim()) {
        params.searchValue = search.trim();
        params.searchCriterion = searchBy;
      }

      const response = await departmentMemberService.getDepartmentsSummary(
        params
      );

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
      setError("Không thể tải danh sách khoa và thành viên. Vui lòng thử lại.");
      console.error("Error loading departments summary:", err);
      toast.error("Lỗi khi tải danh sách khoa và thành viên");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadDepartmentsSummary();
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    loadDepartmentsSummary(page, pageSize, searchTerm, searchType);
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    loadDepartmentsSummary(0, newSize, searchTerm, searchType);
  };

  // Search handler functions
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    if (searchTerm.trim()) {
      setCurrentPage(0);
      loadDepartmentsSummary(0, pageSize, searchTerm, type);
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    setCurrentPage(0);
    loadDepartmentsSummary(0, pageSize, searchTerm, searchType);
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
    setSearchType("departmentName");
    setCurrentPage(0);
    loadDepartmentsSummary(0, pageSize, "", "departmentName");
  };

  // Handle department member actions
  const handleViewDepartment = (department) => {
    navigate(
      `/admin/academic/department-members/details/${department.departmentId}`
    );
  };

  const handleEditDepartment = (department) => {
    navigate(
      `/admin/academic/department-members/edit/${department.departmentId}`
    );
  };

  const handleDeleteDepartment = async (department) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa tất cả thành viên của khoa "${department.departmentName}"?\n\nLưu ý: Việc này sẽ xóa toàn bộ ${department.totalMembers} thành viên trong khoa.`
      )
    ) {
      try {
        await departmentMemberService.deleteAllDepartmentMembers(
          department.departmentId
        );
        toast.success("Xóa tất cả thành viên khoa thành công");
        loadDepartmentsSummary(currentPage, pageSize, searchTerm, searchType);
      } catch (err) {
        toast.error("Lỗi khi xóa thành viên khoa");
        console.error("Error deleting department members:", err);
      }
    }
  };

  // Get member count badge variant
  const getMemberCountBadgeVariant = (count) => {
    if (count === 0) return "secondary";
    if (count <= 5) return "warning";
    if (count <= 10) return "info";
    return "success";
  };

  // Get search type display text
  const getSearchTypeDisplayText = (type) => {
    switch (type) {
      case "departmentName":
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

    // Always show first two and last two pages
    pages.add(0);
    pages.add(1);
    pages.add(maxPages - 2);
    pages.add(maxPages - 1);

    // Add pages around current page
    for (
      let i = Math.max(0, current - 1);
      i <= Math.min(maxPages - 1, current + 1);
      i++
    ) {
      pages.add(i);
    }

    // Convert to sorted array and add ellipsis
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
    <MainLayout activeMenu="department-members">
      <div className="container-fluid pt-3 pb-5">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h4 fw-bold text-dark">Quản Lý Thành Viên Khoa</h2>
            <p className="text-muted mb-0">
              Tổng cộng: {totalElements} khoa
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
                loadDepartmentsSummary(
                  currentPage,
                  pageSize,
                  searchTerm,
                  searchType
                )
              }
              disabled={loading}
            >
              <FontAwesomeIcon icon={faRefresh} className="me-1" />
              Làm Mới
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                navigate("/admin/academic/department-members/create")
              }
            >
              <FontAwesomeIcon icon={faPlus} className="me-1" />
              Thêm Thành Viên
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
              <option value="departmentName">Tên Khoa</option>
            </Form.Select>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Nhập tên khoa..."
                value={searchTerm}
                onChange={handleSearchInputChange}
                onKeyPress={handleSearchKeyPress}
                style={{ width: "300px" }}
              />
              <Button
                variant="primary"
                onClick={handleSearch}
                disabled={isSearching}
              >
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

        {/* Departments Summary Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">
                  Đang tải danh sách khoa và thành viên...
                </p>
              </div>
            )}

            {/* Table Content */}
            {!loading && (
              <>
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th scope="col" className="fw-medium text-muted">
                          #
                        </th>
                        <th scope="col" className="fw-medium text-muted">
                          Tên Khoa
                        </th>
                        <th
                          scope="col"
                          className="fw-medium text-muted text-center"
                        >
                          Tổng Thành Viên
                        </th>
                        <th
                          scope="col"
                          className="fw-medium text-muted text-center"
                        >
                          Thao Tác
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.length > 0 ? (
                        departments.map((department, index) => (
                          <tr key={department.departmentId}>
                            <td className="fw-medium text-muted">
                              {currentPage * pageSize + index + 1}
                            </td>
                            <td className="fw-medium">
                              {department.departmentName || "N/A"}
                            </td>
                            <td className="text-center">
                              <Badge
                                bg={getMemberCountBadgeVariant(
                                  department.totalMembers
                                )}
                                className="fs-6"
                              >
                                {department.totalMembers || 0}
                              </Badge>
                            </td>
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
                                    onClick={() =>
                                      handleViewDepartment(department)
                                    }
                                  >
                                    <FontAwesomeIcon
                                      icon={faEye}
                                      className="me-2"
                                    />
                                    Xem Chi Tiết
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() =>
                                      handleEditDepartment(department)
                                    }
                                  >
                                    <FontAwesomeIcon
                                      icon={faEdit}
                                      className="me-2"
                                    />
                                    Quản Lý Thành Viên
                                  </Dropdown.Item>
                                  <Dropdown.Divider />
                                  <Dropdown.Item
                                    className="text-danger"
                                    onClick={() =>
                                      handleDeleteDepartment(department)
                                    }
                                    disabled={department.totalMembers === 0}
                                  >
                                    <FontAwesomeIcon
                                      icon={faTrash}
                                      className="me-2"
                                    />
                                    Xóa Tất Cả Thành Viên
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="text-center py-5 text-muted"
                          >
                            <FontAwesomeIcon
                              icon={faUsers}
                              size="3x"
                              className="mb-3 opacity-50"
                            />
                            <p>Không có khoa nào được tìm thấy</p>
                            {searchTerm && (
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={handleClearSearch}
                              >
                                Xóa bộ lọc
                              </Button>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
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

                      {getVisiblePageNumbers().map((pageNum, index) =>
                        pageNum === "ellipsis" ? (
                          <Pagination.Ellipsis
                            key={`ellipsis-${index}`}
                            disabled
                          />
                        ) : (
                          <Pagination.Item
                            key={pageNum}
                            active={pageNum === currentPage}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum + 1}
                          </Pagination.Item>
                        )
                      )}

                      <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                      />
                      <Pagination.Last
                        onClick={() => handlePageChange(totalPages - 1)}
                        disabled={currentPage >= totalPages - 1}
                      />
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DepartmentMemberList;
