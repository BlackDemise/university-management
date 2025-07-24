import {useState, useEffect} from "react";
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
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
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
import {useNavigate} from "react-router-dom";
import {toast} from "react-hot-toast";
import {majorService} from "../../../services/apiService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

const ProgramCurriculumList = () => {
    const navigate = useNavigate();

    // State management
    const [majorSummaries, setMajorSummaries] = useState([]);
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

    // Load major curriculum summary data
    const loadMajorSummaries = async (
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
                sort: "id,asc",
            };

            // Add search parameters if search term exists
            if (search.trim()) {
                params.searchValue = search.trim();
                params.searchCriterion = searchBy;
            }

            const response = await majorService.getMajorCurriculumSummary(params);

            // Handle response structure
            if (response.result) {
                setMajorSummaries(response.result.content || []);
                setTotalPages(response.result.totalPages || 1);
                setTotalElements(response.result.totalElements || 0);
                setCurrentPage(response.result.number || page);
            } else {
                // Direct array response (fallback)
                setMajorSummaries(response);
                setTotalPages(1);
                setTotalElements(response.length);
                setCurrentPage(page);
            }
        } catch (err) {
            setError("Không thể tải danh sách chương trình đào tạo. Vui lòng thử lại.");
            console.error("Error loading major curriculum summaries:", err);
            toast.error("Lỗi khi tải danh sách chương trình đào tạo");
        } finally {
            setLoading(false);
            setIsSearching(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        loadMajorSummaries();
    }, []);

    // Handle page change
    const handlePageChange = (page) => {
        loadMajorSummaries(page, pageSize, searchTerm, searchType);
    };

    // Handle page size change
    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        loadMajorSummaries(0, newSize, searchTerm, searchType);
    };

    // Search handler functions
    const handleSearchTypeChange = (type) => {
        setSearchType(type);
        if (searchTerm.trim()) {
            setCurrentPage(0);
            loadMajorSummaries(0, pageSize, searchTerm, type);
        }
    };

    const handleSearch = () => {
        setIsSearching(true);
        setCurrentPage(0);
        loadMajorSummaries(0, pageSize, searchTerm, searchType);
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
        loadMajorSummaries(0, pageSize, "", "name");
    };

    // Handle major curriculum actions
    const handleViewMajor = (majorSummary) => {
        navigate(`/admin/academic/program-curriculum/details/${majorSummary.majorId}`);
    };

    const handleEditMajor = (majorSummary) => {
        navigate(`/admin/academic/program-curriculum/edit/${majorSummary.majorId}`);
    };

    const handleDeleteMajor = async (majorSummary) => {
        if (
            window.confirm(
                `Bạn có chắc chắn muốn xóa chương trình đào tạo "${majorSummary.majorName}"?`
            )
        ) {
            try {
                await majorService.deleteMajor(majorSummary.majorId);
                toast.success("Xóa chương trình đào tạo thành công");
                loadMajorSummaries(currentPage, pageSize, searchTerm, searchType);
            } catch (err) {
                toast.error("Lỗi khi xóa chương trình đào tạo");
                console.error("Error deleting major:", err);
            }
        }
    };

    // Get search type display text
    const getSearchTypeDisplayText = (type) => {
        switch (type) {
            case "name":
                return "Tên Ngành";
            default:
                return type;
        }
    };

    // Smart pagination helper
    const getVisiblePageNumbers = () => {
        const maxPages = Math.max(1, totalPages || 1);

        if (maxPages <= 7) {
            return Array.from({length: maxPages}, (_, i) => i);
        }

        const current = currentPage;
        const pages = [];

        if (current <= 3) {
            pages.push(0, 1, 2, 3, 4, "...", maxPages - 1);
        } else if (current >= maxPages - 4) {
            pages.push(0, "...", maxPages - 5, maxPages - 4, maxPages - 3, maxPages - 2, maxPages - 1);
        } else {
            pages.push(0, "...", current - 1, current, current + 1, "...", maxPages - 1);
        }

        return pages.filter((page, index, array) => array.indexOf(page) === index);
    };

    return (
        <MainLayout>
            <div className="container-fluid pt-3 pb-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="mb-0">
                            <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                            Chương Trình Đào Tạo
                        </h2>
                        <p className="text-muted mb-0">
                            Quản lý thông tin tổng hợp các chương trình đào tạo
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-secondary"
                            onClick={() => loadMajorSummaries(currentPage, pageSize, searchTerm, searchType)}
                            disabled={loading}
                        >
                            <FontAwesomeIcon icon={faRefresh} className="me-1" />
                            Làm mới
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => navigate("/admin/academic/program-curriculum/create")}
                        >
                            <FontAwesomeIcon icon={faPlus} className="me-1" />
                            Thêm mới
                        </Button>
                    </div>
                </div>

                {/* Search Section */}
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <Form.Label>Tìm kiếm theo:</Form.Label>
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-secondary" className="w-100">
                                        {getSearchTypeDisplayText(searchType)}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => handleSearchTypeChange("name")}>
                                            Tên Ngành
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div className="col-md-6">
                                <Form.Label>Từ khóa tìm kiếm:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={`Nhập ${getSearchTypeDisplayText(searchType).toLowerCase()}...`}
                                    value={searchTerm}
                                    onChange={handleSearchInputChange}
                                    onKeyPress={handleSearchKeyPress}
                                />
                            </div>
                            <div className="col-md-3 d-flex align-items-end gap-2">
                                <Button
                                    variant="primary"
                                    onClick={handleSearch}
                                    disabled={isSearching}
                                    className="flex-grow-1"
                                >
                                    <FontAwesomeIcon icon={faSearch} className="me-1" />
                                    {isSearching ? "Đang tìm..." : "Tìm kiếm"}
                                </Button>
                                {searchTerm && (
                                    <Button variant="outline-secondary" onClick={handleClearSearch}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <Alert variant="danger" className="mb-4">
                        {error}
                    </Alert>
                )}

                {/* Statistics */}
                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="card bg-light">
                            <div className="card-body text-center">
                                <h5 className="card-title">Tổng số ngành</h5>
                                <h3 className="text-primary">{totalElements}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card bg-light">
                            <div className="card-body text-center">
                                <h5 className="card-title">Đang hiển thị</h5>
                                <h3 className="text-info">
                                    {loading ? "..." : `${majorSummaries.length} / ${totalElements}`}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="card">
                    <div className="card-body">
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2">Đang tải dữ liệu...</p>
                            </div>
                        ) : majorSummaries.length === 0 ? (
                            <div className="text-center py-5">
                                <FontAwesomeIcon icon={faGraduationCap} size="3x" className="text-muted mb-3" />
                                <h5>Không tìm thấy chương trình đào tạo</h5>
                                <p className="text-muted">
                                    {searchTerm ? "Thử thay đổi từ khóa tìm kiếm" : "Chưa có chương trình đào tạo nào"}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Table */}
                                <div className="table-responsive">
                                    <Table striped bordered hover>
                                        <thead className="table-dark">
                                            <tr>
                                                <th>Mã Ngành</th>
                                                <th>Tên Ngành</th>
                                                <th>Tổng số môn học</th>
                                                <th>Tổng tín chỉ lý thuyết</th>
                                                <th>Tổng tín chỉ thực hành</th>
                                                <th>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {majorSummaries.map((majorSummary) => (
                                                <tr key={majorSummary.majorId}>
                                                    <td>
                                                        <Badge bg="secondary">{majorSummary.majorId}</Badge>
                                                    </td>
                                                    <td>
                                                        <strong>{majorSummary.majorName}</strong>
                                                    </td>
                                                    <td>
                                                        <Badge bg="info">{majorSummary.totalCourses}</Badge>
                                                    </td>
                                                    <td>
                                                        <Badge bg="success">{majorSummary.totalTheoryCredits}</Badge>
                                                    </td>
                                                    <td>
                                                        <Badge bg="warning">{majorSummary.totalPracticalCredits}</Badge>
                                                    </td>
                                                    <td>
                                                        <Dropdown>
                                                            <Dropdown.Toggle
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                id={`dropdown-${majorSummary.majorId}`}
                                                            >
                                                                <FontAwesomeIcon icon={faEllipsisVertical} />
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item onClick={() => handleViewMajor(majorSummary)}>
                                                                    <FontAwesomeIcon icon={faEye} className="me-2" />
                                                                    Xem chi tiết
                                                                </Dropdown.Item>
                                                                <Dropdown.Item onClick={() => handleEditMajor(majorSummary)}>
                                                                    <FontAwesomeIcon icon={faEdit} className="me-2" />
                                                                    Chỉnh sửa
                                                                </Dropdown.Item>
                                                                <Dropdown.Divider />
                                                                <Dropdown.Item
                                                                    onClick={() => handleDeleteMajor(majorSummary)}
                                                                    className="text-danger"
                                                                >
                                                                    <FontAwesomeIcon icon={faTrash} className="me-2" />
                                                                    Xóa
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>

                                {/* Pagination Controls */}
                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    <div className="d-flex align-items-center">
                                        <span className="me-2">Hiển thị:</span>
                                        <Form.Select
                                            size="sm"
                                            style={{width: "70px"}}
                                            value={pageSize}
                                            onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                            <option value={50}>50</option>
                                        </Form.Select>
                                        <span className="ms-2">mục mỗi trang</span>
                                    </div>

                                    {totalPages > 1 && (
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
                                                pageNum === "..." ? (
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
                                    )}
                                </div>

                                {/* Info */}
                                <div className="text-muted text-center mt-3">
                                    Hiển thị {currentPage * pageSize + 1} -{" "}
                                    {Math.min((currentPage + 1) * pageSize, totalElements)} trong tổng số{" "}
                                    {totalElements} mục
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ProgramCurriculumList;
