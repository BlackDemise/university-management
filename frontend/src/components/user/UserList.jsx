import { useState, useEffect } from 'react';
import { Table, Button, Badge, Dropdown, Alert, Spinner, Pagination, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus, faEye, faEdit, faUserSlash,
    faEllipsisVertical, faRefresh, faSearch, faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {userService} from "../../services/apiService.js";
import MainLayout from "../layout/main/MainLayout.jsx";

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
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('fullName');
    const [isSearching, setIsSearching] = useState(false);

    // Load users data
    const loadUsers = async (page = 0, size = pageSize, search = '', searchBy = 'fullName') => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page,
                size,
                sort: 'id,desc'
            };

            // Add search parameters if search term exists
            if (search.trim()) {
                params.search = search.trim();
                params.searchBy = searchBy;
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
            setError('Không thể tải danh sách người dùng. Vui lòng thử lại.');
            console.error('Error loading users:', err);
            toast.error('Lỗi khi tải danh sách người dùng');
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
        loadUsers(0, newSize, searchTerm, searchType); // Reset to first page
    };

    // Search handler functions
    const handleSearchTypeChange = (type) => {
        setSearchType(type);
        if (searchTerm.trim()) {
            // If there's an existing search term, re-search with new type
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
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setSearchType('fullName');
        setCurrentPage(0);
        loadUsers(0, pageSize, '', 'fullName');
    };

    // Handle user actions
    const handleViewUser = (user) => {
        navigate(`/admin/users/details/${user.id}`);
    };

    const handleEditUser = (user) => {
        navigate(`/admin/users/edit/${user.id}`);
    };

    const handleDeactivateUser = async (user) => {
        if (window.confirm(`Bạn có chắc chắn muốn vô hiệu hóa người dùng "${user.fullName}"?`)) {
            try {
                await userService.deleteUser(user.id);
                toast.success('Vô hiệu hóa người dùng thành công');
                loadUsers(currentPage, pageSize, searchTerm, searchType); // Reload current page
            } catch (err) {
                toast.error('Lỗi khi vô hiệu hóa người dùng');
                console.error('Error deactivating user:', err);
            }
        }
    };

    // Get role badge variant
    const getRoleBadgeVariant = (role) => {
        switch (role) {
            case 'ADMIN': return 'danger';
            case 'TEACHER': return 'info';
            case 'STUDENT': return 'success';
            default: return 'secondary';
        }
    };

    // Get search type display text
    const getSearchTypeDisplayText = (type) => {
        switch (type) {
            case 'fullName': return 'Họ và Tên';
            case 'email': return 'Email';
            default: return type;
        }
    };

    // Smart pagination helper
    const getVisiblePageNumbers = () => {
        const maxPages = Math.max(1, totalPages || 1); // 🔧 Use different variable name

        // If total pages <= 7, show all pages
        if (maxPages <= 7) {
            return Array.from({ length: maxPages }, (_, i) => i);
        }

        const current = currentPage;
        // Always show first 2, last 2, and current with neighbors
        const pages = new Set();

        // First 2 pages
        pages.add(0);
        pages.add(1);

        // Last 2 pages
        pages.add(maxPages - 2);
        pages.add(maxPages - 1);

        // Current page and its neighbors
        for (let i = Math.max(0, current - 1); i <= Math.min(maxPages - 1, current + 1); i++) {
            pages.add(i);
        }

        // Convert to sorted array
        const sortedPages = Array.from(pages).sort((a, b) => a - b);

        // Insert ellipsis markers
        const result = [];
        for (let i = 0; i < sortedPages.length; i++) {
            if (i > 0 && sortedPages[i] - sortedPages[i - 1] > 1) {
                result.push('ellipsis');
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
                            onClick={() => loadUsers(currentPage, pageSize, searchTerm, searchType)}
                            disabled={loading}
                        >
                            <FontAwesomeIcon icon={faRefresh} className="me-1" />
                            Làm Mới
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => navigate('/admin/users/create')}
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

                {/* Users Table */}
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-0">
                        {/* Search and Page Size Controls */}
                        <div className="d-flex justify-content-between align-items-center p-3 border-bottom flex-wrap gap-3">
                            {/* Search Section - Left Side */}
                            <div className="d-flex align-items-center gap-3">
                                {/* Search Type Dropdown */}
                                <div className="d-flex align-items-center">
                                    <span className="text-muted me-2">Tìm kiếm:</span>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="outline-secondary" size="sm">
                                            {getSearchTypeDisplayText(searchType)}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                onClick={() => handleSearchTypeChange('fullName')}
                                                active={searchType === 'fullName'}
                                            >
                                                Họ và Tên
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                onClick={() => handleSearchTypeChange('email')}
                                                active={searchType === 'email'}
                                            >
                                                Email
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>

                                {/* Search Input */}
                                <div className="d-flex align-items-center">
                                    <Form.Control
                                        type="text"
                                        placeholder={`Nhập ${getSearchTypeDisplayText(searchType).toLowerCase()}...`}
                                        value={searchTerm}
                                        onChange={handleSearchInputChange}
                                        onKeyPress={handleSearchKeyPress}
                                        size="sm"
                                        style={{ width: '250px' }}
                                        disabled={loading || isSearching}
                                    />
                                </div>

                                {/* Search Actions */}
                                <div className="d-flex gap-2">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={handleSearch}
                                        disabled={loading || isSearching || !searchTerm.trim()}
                                    >
                                        {isSearching ? (
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                className="me-1"
                                            />
                                        ) : (
                                            <FontAwesomeIcon icon={faSearch} className="me-1" />
                                        )}
                                        Tìm
                                    </Button>
                                    
                                    {searchTerm && (
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={handleClearSearch}
                                            disabled={loading || isSearching}
                                        >
                                            <FontAwesomeIcon icon={faTimes} className="me-1" />
                                            Xóa
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Page Size Selector - Right Side */}
                            <div className="d-flex align-items-center">
                                <span className="text-muted me-2">Hiển thị:</span>
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-secondary" size="sm">
                                        {pageSize} dòng
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {[5, 10, 25, 50].map(size => (
                                            <Dropdown.Item
                                                key={size}
                                                onClick={() => handlePageSizeChange(size)}
                                                active={pageSize === size}
                                            >
                                                {size} dòng
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
                            </div>
                        ) : (
                            <>
                                {/* Table */}
                                <Table responsive hover className="mb-0">
                                    <thead className="bg-light">
                                    <tr>
                                        <th className="border-0">ID</th>
                                        <th className="border-0">Họ và Tên</th>
                                        <th className="border-0">Email</th>
                                        <th className="border-0">Vai Trò</th>
                                        <th className="border-0 text-center">Thao Tác</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <tr key={user.id}>
                                                <td className="fw-medium">#{user.id}</td>
                                                <td>
                                                    <div>
                                                        <div className="fw-medium">{user.fullName}</div>
                                                        {user.phone && (
                                                            <small className="text-muted">{user.phone}</small>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="text-primary">{user.email}</span>
                                                </td>
                                                <td>
                                                    <Badge bg={getRoleBadgeVariant(user.role)} className="px-2 py-1">
                                                        {user.displayedRole}
                                                    </Badge>
                                                </td>
                                                <td className="text-center">
                                                    <Dropdown>
                                                        <Dropdown.Toggle
                                                            variant="light"
                                                            size="sm"
                                                            className="border-0"
                                                        >
                                                            <FontAwesomeIcon icon={faEllipsisVertical} />
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu align="end">
                                                            <Dropdown.Item onClick={() => handleViewUser(user)}>
                                                                <FontAwesomeIcon icon={faEye} className="me-2" />
                                                                Chi Tiết
                                                            </Dropdown.Item>
                                                            <Dropdown.Item onClick={() => handleEditUser(user)}>
                                                                <FontAwesomeIcon icon={faEdit} className="me-2" />
                                                                Chỉnh Sửa
                                                            </Dropdown.Item>
                                                            <Dropdown.Divider />
                                                            <Dropdown.Item
                                                                onClick={() => handleDeactivateUser(user)}
                                                                className="text-danger"
                                                            >
                                                                <FontAwesomeIcon icon={faUserSlash} className="me-2" />
                                                                Vô Hiệu Hóa
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4">
                                                <div className="text-muted">
                                                    {searchTerm ? 
                                                        `Không tìm thấy kết quả cho "${searchTerm}"` : 
                                                        'Không có dữ liệu người dùng'
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </Table>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-between align-items-center p-3 border-top">
                                        <div className="text-muted">
                                            Hiển thị {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalElements)} trong tổng số {totalElements}
                                            {searchTerm && (
                                                <span className="text-primary ms-2">
                                                    kết quả tìm kiếm
                                                </span>
                                            )}
                                        </div>
                                        <Pagination className="mb-0">
                                            {/* First and Previous buttons */}
                                            <Pagination.First
                                                disabled={currentPage === 0}
                                                onClick={() => handlePageChange(0)}
                                            />
                                            <Pagination.Prev
                                                disabled={currentPage === 0}
                                                onClick={() => handlePageChange(currentPage - 1)}
                                            />

                                            {/* Page numbers with ellipsis */}
                                            {getVisiblePageNumbers().map((pageNum, index) => {
                                                if (pageNum === 'ellipsis') {
                                                    return (
                                                        <Pagination.Ellipsis
                                                            key={`ellipsis-${index}`}
                                                            disabled
                                                        />
                                                    );
                                                }

                                                return (
                                                    <Pagination.Item
                                                        key={pageNum}
                                                        active={pageNum === currentPage}
                                                        onClick={() => handlePageChange(pageNum)}
                                                    >
                                                        {pageNum + 1}
                                                    </Pagination.Item>
                                                );
                                            })}

                                            {/* Next and Last buttons */}
                                            <Pagination.Next
                                                disabled={currentPage === totalPages - 1}
                                                onClick={() => handlePageChange(currentPage + 1)}
                                            />
                                            <Pagination.Last
                                                disabled={currentPage === totalPages - 1}
                                                onClick={() => handlePageChange(totalPages - 1)}
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

export default UsersList;