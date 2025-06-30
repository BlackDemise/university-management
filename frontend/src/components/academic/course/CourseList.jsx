import { useState, useEffect } from 'react';
import { Table, Button, Badge, Dropdown, Alert, Spinner, Pagination, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus, faEye, faEdit, faTrash,
    faEllipsisVertical, faRefresh, faSearch, faTimes, faBook
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { courseService } from "../../../services/apiService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

const CourseList = () => {
    const navigate = useNavigate();

    // State management
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    
    // Search state
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('name');
    const [isSearching, setIsSearching] = useState(false);

    // Course type display mapping
    const courseTypeDisplayMap = {
        'GENERAL': 'Môn chung',
        'SPECIALIZED': 'Môn chuyên ngành',
        'ELECTIVE': 'Môn tự chọn',
        'CORE': 'Môn cơ sở'
    };

    // Load courses data
    const loadCourses = async (page = 0, size = pageSize, search = '', searchBy = 'name') => {
        try {
            setLoading(true);
            setError(null);

            const response = await courseService.getAllCourses();

            // Handle response structure
            if (response.result) {
                let courseList = response.result || [];
                
                // Filter by search term if provided
                if (search.trim()) {
                    courseList = courseList.filter(course => {
                        const searchValue = search.toLowerCase();
                        switch (searchBy) {
                            case 'name':
                                return course.name?.toLowerCase().includes(searchValue);
                            case 'code':
                                return course.code?.toLowerCase().includes(searchValue);
                            case 'courseType':
                                return courseTypeDisplayMap[course.courseType]?.toLowerCase().includes(searchValue);
                            default:
                                return course.name?.toLowerCase().includes(searchValue);
                        }
                    });
                }

                // Calculate pagination
                const startIndex = page * size;
                const endIndex = startIndex + size;
                const paginatedCourses = courseList.slice(startIndex, endIndex);
                
                setCourses(paginatedCourses);
                setTotalPages(Math.ceil(courseList.length / size));
                setTotalElements(courseList.length);
                setCurrentPage(page);
            } else {
                // Direct array response (fallback)
                setCourses(response || []);
                setTotalPages(1);
                setTotalElements((response || []).length);
                setCurrentPage(page);
            }
        } catch (err) {
            setError('Không thể tải danh sách môn học. Vui lòng thử lại.');
            console.error('Error loading courses:', err);
            toast.error('Lỗi khi tải danh sách môn học');
        } finally {
            setLoading(false);
            setIsSearching(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        loadCourses();
    }, []);

    // Handle page change
    const handlePageChange = (page) => {
        loadCourses(page, pageSize, searchTerm, searchType);
    };

    // Handle page size change
    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        loadCourses(0, newSize, searchTerm, searchType); // Reset to first page
    };

    // Search handler functions
    const handleSearchTypeChange = (type) => {
        setSearchType(type);
        if (searchTerm.trim()) {
            // If there's an existing search term, re-search with new type
            setCurrentPage(0);
            loadCourses(0, pageSize, searchTerm, type);
        }
    };

    const handleSearch = () => {
        setIsSearching(true);
        setCurrentPage(0);
        loadCourses(0, pageSize, searchTerm, searchType);
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
        setSearchType('name');
        setCurrentPage(0);
        loadCourses(0, pageSize, '', 'name');
    };

    // Handle course actions
    const handleViewCourse = (course) => {
        navigate(`/admin/academic/courses/details/${course.id}`);
    };

    const handleEditCourse = (course) => {
        navigate(`/admin/academic/courses/edit/${course.id}`);
    };

    const handleDeleteCourse = async (course) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa môn học "${course.name}"?`)) {
            try {
                await courseService.deleteCourse(course.id);
                toast.success('Xóa môn học thành công');
                loadCourses(currentPage, pageSize, searchTerm, searchType); // Reload current page
            } catch (err) {
                toast.error('Lỗi khi xóa môn học');
                console.error('Error deleting course:', err);
            }
        }
    };

    // Get course type badge variant
    const getCourseTypeBadgeVariant = (courseType) => {
        switch (courseType) {
            case 'CORE': return 'danger';
            case 'SPECIALIZED': return 'primary';
            case 'ELECTIVE': return 'success';
            case 'GENERAL': return 'info';
            default: return 'secondary';
        }
    };

    // Get search type display text
    const getSearchTypeDisplayText = (type) => {
        switch (type) {
            case 'name': return 'Tên Môn Học';
            case 'code': return 'Mã Môn Học';
            case 'courseType': return 'Loại Môn Học';
            default: return type;
        }
    };

    // Get status badge based on credits
    const getStatusBadge = (course) => {
        const totalCredits = (course.creditsTheory || 0) + (course.creditsPractical || 0);
        if (totalCredits === 0) {
            return <Badge bg="warning">Không có tín chỉ</Badge>;
        } else if (totalCredits >= 4) {
            return <Badge bg="success">Tín chỉ cao</Badge>;
        } else {
            return <Badge bg="info">Tín chỉ thường</Badge>;
        }
    };

    // Smart pagination helper (same as UserList)
    const getVisiblePageNumbers = () => {
        const maxPages = Math.max(1, totalPages || 1);

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
        <MainLayout activeMenu="courses">
            <div className="container-fluid pt-3 pb-5">
                {/* Page Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="h4 fw-bold text-dark">Quản Lý Môn Học</h2>
                        <p className="text-muted mb-0">
                            Tổng cộng: {totalElements} môn học
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
                            onClick={() => loadCourses(currentPage, pageSize, searchTerm, searchType)}
                            disabled={loading}
                        >
                            <FontAwesomeIcon icon={faRefresh} className="me-1" />
                            Làm Mới
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => navigate('/admin/academic/courses/create')}
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

                {/* Courses Table */}
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-0">
                        {/* Search and Page Size Controls */}
                        <div className="d-flex justify-content-between align-items-center p-3 border-bottom flex-wrap gap-3">
                            {/* Search Section - Left Side */}
                            <div className="d-flex align-items-center gap-3">
                                <div className="d-flex align-items-center">
                                    <span className="text-muted me-2">Tìm kiếm:</span>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="light" size="sm" className="text-dark">
                                            {getSearchTypeDisplayText(searchType)}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => handleSearchTypeChange('name')}>
                                                Tên Môn Học
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleSearchTypeChange('code')}>
                                                Mã Môn Học
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleSearchTypeChange('courseType')}>
                                                Loại Môn Học
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>

                                {/* Search Input */}
                                <div className="d-flex align-items-center">
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập từ khóa tìm kiếm..."
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

                            {/* Page Size Control - Right Side */}
                            <div className="d-flex align-items-center gap-2">
                                <span className="text-muted">Hiển thị:</span>
                                <Form.Select
                                    size="sm"
                                    value={pageSize}
                                    onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                                    style={{ width: 'auto' }}
                                    disabled={loading}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                </Form.Select>
                                <span className="text-muted">mục</span>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2 text-muted">Đang tải danh sách môn học...</p>
                            </div>
                        )}

                        {/* Table Content */}
                        {!loading && (
                            <>
                                <div className="table-responsive">
                                    <Table hover className="mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th scope="col" className="fw-medium text-muted">#</th>
                                                <th scope="col" className="fw-medium text-muted">Mã Môn Học</th>
                                                <th scope="col" className="fw-medium text-muted">Tên Môn Học</th>
                                                <th scope="col" className="fw-medium text-muted">Loại</th>
                                                <th scope="col" className="fw-medium text-muted text-center">Tín Chỉ LT</th>
                                                <th scope="col" className="fw-medium text-muted text-center">Tín Chỉ TH</th>
                                                <th scope="col" className="fw-medium text-muted text-center">Tổng TC</th>
                                                <th scope="col" className="fw-medium text-muted">Trạng Thái</th>
                                                <th scope="col" className="fw-medium text-muted text-center">Thao Tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courses.length > 0 ? (
                                                courses.map((course, index) => {
                                                    const totalCredits = (course.creditsTheory || 0) + (course.creditsPractical || 0);
                                                    return (
                                                        <tr key={course.id}>
                                                            <td className="fw-medium text-muted">
                                                                {currentPage * pageSize + index + 1}
                                                            </td>
                                                            <td>
                                                                <code className="bg-light px-2 py-1 rounded small">
                                                                    {course.code || 'N/A'}
                                                                </code>
                                                            </td>
                                                            <td className="fw-medium">{course.name || 'N/A'}</td>
                                                            <td>
                                                                <Badge bg={getCourseTypeBadgeVariant(course.courseType)}>
                                                                    {courseTypeDisplayMap[course.courseType] || course.courseType || 'N/A'}
                                                                </Badge>
                                                            </td>
                                                            <td className="text-center">{course.creditsTheory || 0}</td>
                                                            <td className="text-center">{course.creditsPractical || 0}</td>
                                                            <td className="text-center fw-medium">{totalCredits}</td>
                                                            <td>{getStatusBadge(course)}</td>
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
                                                                        <Dropdown.Item onClick={() => handleViewCourse(course)}>
                                                                            <FontAwesomeIcon icon={faEye} className="me-2" />
                                                                            Xem Chi Tiết
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => handleEditCourse(course)}>
                                                                            <FontAwesomeIcon icon={faEdit} className="me-2" />
                                                                            Chỉnh Sửa
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Divider />
                                                                        <Dropdown.Item 
                                                                            className="text-danger"
                                                                            onClick={() => handleDeleteCourse(course)}
                                                                        >
                                                                            <FontAwesomeIcon icon={faTrash} className="me-2" />
                                                                            Xóa
                                                                        </Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="9" className="text-center py-5 text-muted">
                                                        <FontAwesomeIcon icon={faBook} size="3x" className="mb-3 opacity-50" />
                                                        <p>Không có môn học nào được tìm thấy</p>
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
                                        <div className="text-muted small">
                                            Hiển thị {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalElements)} của {totalElements} môn học
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

                                            {getVisiblePageNumbers().map((pageNum, index) => (
                                                pageNum === 'ellipsis' ? (
                                                    <Pagination.Ellipsis key={`ellipsis-${index}`} disabled />
                                                ) : (
                                                    <Pagination.Item
                                                        key={pageNum}
                                                        active={pageNum === currentPage}
                                                        onClick={() => handlePageChange(pageNum)}
                                                    >
                                                        {pageNum + 1}
                                                    </Pagination.Item>
                                                )
                                            ))}

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

export default CourseList; 