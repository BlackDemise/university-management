import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Pagination, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import MainLayout from '../../layout/main/MainLayout.jsx';
import { sessionService } from '../../../services/apiService.js';

const CourseSessionSummary = () => {
    const navigate = useNavigate();
    
    // State management
    const [sessionSummaries, setSessionSummaries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    
    // Search state
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Load session summaries data
    const loadSessionSummaries = async (page = 0, size = pageSize, search = '') => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page,
                size,
                sort: 'courseOfferingId,asc'
            };

            console.log('📊 Loading session summaries with params:', params);

            const response = await sessionService.getOptimizedSessionSummary(params);

            // Handle response structure
            if (response.result) {
                setSessionSummaries(response.result.content || []);
                setTotalPages(response.result.totalPages || 1);
                setTotalElements(response.result.totalElements || 0);
                setCurrentPage(response.result.number || page);
            } else {
                // Direct array response (fallback)
                setSessionSummaries(response);
                setTotalPages(1);
                setTotalElements(response.length);
                setCurrentPage(page);
            }
        } catch (err) {
            setError('Không thể tải danh sách tóm tắt phiên học. Vui lòng thử lại.');
            console.error('Error loading session summaries:', err);
            toast.error('Lỗi khi tải danh sách tóm tắt phiên học');
        } finally {
            setLoading(false);
            setIsSearching(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        loadSessionSummaries();
    }, []);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        loadSessionSummaries(page, pageSize, searchTerm);
    };

    // Handle page size change
    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value);
        setPageSize(newSize);
        setCurrentPage(0);
        loadSessionSummaries(0, newSize, searchTerm);
    };

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        setIsSearching(true);
        setCurrentPage(0);
        loadSessionSummaries(0, pageSize, searchTerm);
    };

    // Handle view sessions for a course offering
    const handleViewSessions = (courseOfferingId) => {
        navigate(`/admin/assessment/sessions/course-offering/${courseOfferingId}`);
    };

    // Generate pagination items
    const generatePaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;
        const startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

        for (let page = startPage; page <= endPage; page++) {
            items.push(
                <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => handlePageChange(page)}
                >
                    {page + 1}
                </Pagination.Item>
            );
        }
        return items;
    };

    return (
        <MainLayout>
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow">
                            <div className="card-header bg-primary text-white">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">
                                        <i className="fas fa-calendar-alt me-2"></i>
                                        Tóm Tắt Phiên Học Theo Khóa Học
                                    </h5>
                                </div>
                            </div>

                            <div className="card-body">
                                {/* Search Form */}
                                <Form onSubmit={handleSearch} className="mb-4">
                                    <Row className="g-3 align-items-end">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Tìm kiếm</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Tìm theo tên khóa học, mã khóa học, giảng viên..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label>Số dòng mỗi trang</Form.Label>
                                                <Form.Select value={pageSize} onChange={handlePageSizeChange}>
                                                    <option value={5}>5</option>
                                                    <option value={10}>10</option>
                                                    <option value={20}>20</option>
                                                    <option value={50}>50</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Button 
                                                type="submit" 
                                                variant="outline-primary" 
                                                disabled={isSearching}
                                                className="w-100"
                                            >
                                                {isSearching ? (
                                                    <>
                                                        <Spinner size="sm" className="me-2" />
                                                        Đang tìm...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-search me-2"></i>
                                                        Tìm kiếm
                                                    </>
                                                )}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>

                                {/* Error Alert */}
                                {error && (
                                    <Alert variant="danger" className="mb-4">
                                        <i className="fas fa-exclamation-triangle me-2"></i>
                                        {error}
                                    </Alert>
                                )}

                                {/* Loading Spinner */}
                                {loading && (
                                    <div className="text-center py-4">
                                        <Spinner animation="border" variant="primary" />
                                        <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
                                    </div>
                                )}

                                {/* Data Table */}
                                {!loading && (
                                    <>
                                        <div className="table-responsive">
                                            <Table striped bordered hover>
                                                <thead className="table-dark">
                                                    <tr>
                                                        <th>ID Khóa Học</th>
                                                        <th>Mã Khóa Học</th>
                                                        <th>Tên Khóa Học</th>
                                                        <th>Học Kỳ</th>
                                                        <th>Giảng Viên</th>
                                                        <th>Tổng Phiên Học</th>
                                                        <th>Thao Tác</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sessionSummaries.length > 0 ? (
                                                        sessionSummaries.map((summary) => (
                                                            <tr key={summary.courseOfferingId}>
                                                                <td>{summary.courseOfferingId}</td>
                                                                <td>
                                                                    <span className="badge bg-secondary">
                                                                        {summary.courseCode || 'N/A'}
                                                                    </span>
                                                                </td>
                                                                <td>{summary.courseName || 'Unknown Course'}</td>
                                                                <td>
                                                                    <span className="badge bg-info">
                                                                        {summary.semesterName || 'N/A'}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <div>
                                                                        <strong>{summary.teacherName || 'Unknown Teacher'}</strong>
                                                                        {summary.teacherEmail && (
                                                                            <div className="text-muted small">
                                                                                {summary.teacherEmail}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <span className="badge bg-success fs-6">
                                                                        {summary.totalSessionsRecorded || 0}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <Button
                                                                        variant="primary"
                                                                        size="sm"
                                                                        onClick={() => handleViewSessions(summary.courseOfferingId)}
                                                                    >
                                                                        <i className="fas fa-eye me-1"></i>
                                                                        Chi Tiết
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="7" className="text-center py-4 text-muted">
                                                                <i className="fas fa-inbox fa-2x mb-3 d-block"></i>
                                                                Không có dữ liệu phiên học nào
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>

                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <div className="d-flex justify-content-between align-items-center mt-4">
                                                <div className="text-muted">
                                                    Hiển thị {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalElements)} 
                                                    trong tổng số {totalElements} kết quả
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
                                                    {generatePaginationItems()}
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
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default CourseSessionSummary;
