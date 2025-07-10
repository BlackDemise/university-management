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
  faUserSlash,
  faEllipsisVertical,
  faRefresh,
  faSearch,
  faTimes,
  faUser,
  faFileExcel,
  faKeyboard,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { userService } from "../../services/apiService.js";
import MainLayout from "../layout/main/MainLayout.jsx";
import ExcelUploadModal from "./ExcelUploadModal.jsx";

const UsersList = () => {
  const navigate = useNavigate();

  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("fullName");
  const [isSearching, setIsSearching] = useState(false);

  // Excel upload modal state
  const [showExcelModal, setShowExcelModal] = useState(false);

  // Load users data
  const loadUsers = async (
    page = 0,
    size = pageSize,
    search = "",
    searchBy = "fullName"
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        size,
        sort: "id,asc",
      };

      // Add search parameters if search term exists
      if (search.trim()) {
        params.searchValue = search.trim();
        params.searchCriterion = searchBy;
      }

      const response = await userService.getAllUsers(params);

      // Handle response structure
      if (response.result) {
        setUsers(response.result.content || []);
        setTotalPages(response.result.totalPages || 1);
        setTotalElements(response.result.totalElements || 0);
        setCurrentPage(response.result.number || page);
      } else {
        // Direct array response (fallback)
        setUsers(response);
        setTotalPages(1);
        setTotalElements(response.length);
        setCurrentPage(page);
      }
    } catch (err) {
      setError("Không thể tải danh sách người dùng. Vui lòng thử lại.");
      console.error("Error loading users:", err);
      toast.error("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    loadUsers(page, pageSize, searchTerm, searchType);
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    loadUsers(0, newSize, searchTerm, searchType);
  };

  // Search handler functions
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    if (searchTerm.trim()) {
      setCurrentPage(0);
      loadUsers(0, pageSize, searchTerm, type);
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    setCurrentPage(0);
    loadUsers(0, pageSize, searchTerm, searchType);
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
    setSearchType("fullName");
    setCurrentPage(0);
    loadUsers(0, pageSize, "", "fullName");
  };

  // Handle successful Excel import
  const handleExcelImportSuccess = () => {
    setShowExcelModal(false);
    // Reload the user list to show newly imported users
    loadUsers(currentPage, pageSize, searchTerm, searchType);
    toast.success("Import Excel thành công!");
  };

  // Handle user actions
  const handleViewUser = (user) => {
    navigate(`/admin/users/details/${user.id}`);
  };

  const handleEditUser = (user) => {
    navigate(`/admin/users/edit/${user.id}`);
  };

  const handleDeactivateUser = async (user) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn vô hiệu hóa người dùng "${user.fullName}"?`
      )
    ) {
      try {
        await userService.deleteUser(user.id);
        toast.success("Vô hiệu hóa người dùng thành công");
        loadUsers(currentPage, pageSize, searchTerm, searchType);
      } catch (err) {
        toast.error("Lỗi khi vô hiệu hóa người dùng");
        console.error("Error deactivating user:", err);
      }
    }
  };

  // Get role badge variant
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "ADMIN":
        return "danger";
      case "TEACHER":
        return "info";
      case "STUDENT":
        return "success";
      default:
        return "secondary";
    }
  };

  // Get search type display text
  const getSearchTypeDisplayText = (type) => {
    switch (type) {
      case "fullName":
        return "Họ và Tên";
      case "email":
        return "Email";
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
    <MainLayout activeMenu="users">
      <div className="container-fluid pt-3 pb-5">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h4 fw-bold text-dark">Quản Lý Người Dùng</h2>
            <p className="text-muted mb-0">
              Tổng cộng: {totalElements} người dùng
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
                loadUsers(currentPage, pageSize, searchTerm, searchType)
              }
              disabled={loading}
            >
              <FontAwesomeIcon icon={faRefresh} className="me-1" />
              Làm Mới
            </Button>
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="add-user-dropdown">
                <FontAwesomeIcon icon={faPlus} className="me-1" />
                Thêm Mới
                <FontAwesomeIcon icon={faChevronDown} className="ms-1" />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => navigate("/admin/users/create")}>
                  <FontAwesomeIcon icon={faKeyboard} className="me-2" />
                  Nhập thủ công
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setShowExcelModal(true)}>
                  <FontAwesomeIcon icon={faFileExcel} className="me-2" />
                  Tải tệp lên
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
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
              <option value="fullName">Họ và Tên</option>
              <option value="email">Email</option>
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

        {/* Users Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {/* Loading State */}
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-5">
                <FontAwesomeIcon
                  icon={faUser}
                  size="2x"
                  className="text-muted mb-3"
                />
                <p className="text-muted mb-0">
                  {searchTerm
                    ? "Không tìm thấy người dùng nào."
                    : "Chưa có người dùng nào."}
                </p>
              </div>
            ) : (
              <>
                {/* Table */}
                <Table hover responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">Họ và Tên</th>
                      <th className="border-0">Email</th>
                      <th className="border-0">Vai Trò</th>
                      <th className="border-0" style={{ width: "100px" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td className="fw-medium">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="me-2 text-primary"
                          />
                          {user.fullName}
                          {user.phone && (
                            <div>
                              <small className="text-muted">{user.phone}</small>
                            </div>
                          )}
                        </td>
                        <td>
                          <span className="text-primary">{user.email}</span>
                        </td>
                        <td>
                          <Badge
                            bg={getRoleBadgeVariant(user.role)}
                            className="px-2 py-1"
                          >
                            {user.displayedRole}
                          </Badge>
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
                                onClick={() => handleViewUser(user)}
                              >
                                <FontAwesomeIcon
                                  icon={faEye}
                                  className="me-2"
                                />
                                Xem Chi Tiết
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleEditUser(user)}
                              >
                                <FontAwesomeIcon
                                  icon={faEdit}
                                  className="me-2"
                                />
                                Chỉnh Sửa
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item
                                onClick={() => handleDeactivateUser(user)}
                                className="text-danger"
                              >
                                <FontAwesomeIcon
                                  icon={faUserSlash}
                                  className="me-2"
                                />
                                Vô Hiệu Hóa
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

      {/* Excel Upload Modal */}
      <ExcelUploadModal
        show={showExcelModal}
        onHide={() => setShowExcelModal(false)}
        onSuccess={handleExcelImportSuccess}
      />
    </MainLayout>
  );
};

export default UsersList;
