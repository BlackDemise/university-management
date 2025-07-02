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
    faBook,
    faListUl,
    faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import {toast} from "react-hot-toast";
import {programCurriculumService} from "../../../services/apiService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

const ProgramCurriculumList = () => {
    const navigate = useNavigate();

    // State management
    const [programCurriculums, setProgramCurriculums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Search state
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("majorName");
    const [isSearching, setIsSearching] = useState(false);

    // Load program curriculums data
    const loadProgramCurriculums = async (
        page = 0,
        size = pageSize,
        search = "",
        searchBy = "majorName"
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
                params.search = search.trim();
                params.searchBy = searchBy;
            }

            const response = await programCurriculumService.getAllProgramCurriculums(
                params
            );

            // Handle response structure
            if (response.result) {
                setProgramCurriculums(response.result.content || []);
                setTotalPages(response.result.totalPages || 1);
                setTotalElements(response.result.totalElements || 0);
                setCurrentPage(response.result.number || page);
            } else {
                // Fallback with placeholder data for development
                console.warn(
                    "🚧 Using placeholder program curriculum data - implement backend endpoint"
                );
                const placeholderData = [
                    {
                        id: 1,
                        majorName: "Công nghệ thông tin",
                        majorId: 1,
                        totalCourses: 45,
                        totalCredits: 140,
                        createdAt: "2024-01-15",
                        updatedAt: "2024-01-20",
                    },
                    {
                        id: 2,
                        majorName: "Khoa học máy tính",
                        majorId: 2,
                        totalCourses: 42,
                        totalCredits: 136,
                        createdAt: "2024-01-10",
                        updatedAt: "2024-01-18",
                    },
                    {
                        id: 3,
                        majorName: "Kỹ thuật phần mềm",
                        majorId: 3,
                        totalCourses: 48,
                        totalCredits: 144,
                        createdAt: "2024-01-12",
                        updatedAt: "2024-01-22",
                    },
                    {
                        id: 4,
                        majorName: "Trí tuệ nhân tạo",
                        majorId: 4,
                        totalCourses: 40,
                        totalCredits: 132,
                        createdAt: "2024-01-08",
                        updatedAt: "2024-01-25",
                    },
                ];

                // Apply search filter if needed
                let filteredData = placeholderData;
                if (search.trim()) {
                    filteredData = placeholderData.filter((curriculum) => {
                        const searchValue = search.toLowerCase();
                        switch (searchBy) {
                            case "majorName":
                                return curriculum.majorName
                                    ?.toLowerCase()
                                    .includes(searchValue);
                            case "id":
                                return curriculum.id.toString().includes(searchValue);
                            default:
                                return curriculum.majorName
                                    ?.toLowerCase()
                                    .includes(searchValue);
                        }
                    });
                }

                // Apply pagination to placeholder data
                const startIndex = page * size;
                const endIndex = startIndex + size;
                const paginatedData = filteredData.slice(startIndex, endIndex);

                setProgramCurriculums(paginatedData);
                setTotalPages(Math.ceil(filteredData.length / size));
                setTotalElements(filteredData.length);
                setCurrentPage(page);
            }
        } catch (err) {
            setError(
                "Không thể tải danh sách chương trình đào tạo. Vui lòng thử lại."
            );
            console.error("Error loading program curriculums:", err);
            toast.error("Lỗi khi tải danh sách chương trình đào tạo");
        } finally {
            setLoading(false);
            setIsSearching(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        loadProgramCurriculums();
    }, []);

    // Handle page change
    const handlePageChange = (page) => {
        loadProgramCurriculums(page, pageSize, searchTerm, searchType);
    };

    // Handle page size change
    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        loadProgramCurriculums(0, newSize, searchTerm, searchType); // Reset to first page
    };

    // Search handler functions
    const handleSearchTypeChange = (type) => {
        setSearchType(type);
        if (searchTerm.trim()) {
            // If there's an existing search term, re-search with new type
            setCurrentPage(0);
            loadProgramCurriculums(0, pageSize, searchTerm, type);
        }
    };

    const handleSearch = () => {
        setIsSearching(true);
        setCurrentPage(0);
        loadProgramCurriculums(0, pageSize, searchTerm, searchType);
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
        setSearchType("majorName");
        setCurrentPage(0);
        loadProgramCurriculums(0, pageSize, "", "majorName");
    };

    // Handle program curriculum actions
    const handleViewProgramCurriculum = (curriculum) => {
        navigate(`/admin/academic/program-curriculum/details/${curriculum.id}`);
    };

    const handleEditProgramCurriculum = (curriculum) => {
        navigate(`/admin/academic/program-curriculum/edit/${curriculum.id}`);
    };

    const handleDeleteProgramCurriculum = async (curriculum) => {
        if (
            window.confirm(
                `Bạn có chắc chắn muốn xóa chương trình đào tạo cho ngành "${curriculum.majorName}"?`
            )
        ) {
            try {
                await programCurriculumService.deleteProgramCurriculum(curriculum.id);
                toast.success("Xóa chương trình đào tạo thành công");
                loadProgramCurriculums(currentPage, pageSize, searchTerm, searchType); // Reload current page
            } catch (err) {
                toast.error("Lỗi khi xóa chương trình đào tạo");
                console.error("Error deleting program curriculum:", err);
            }
        }
    };

    // Get search type display text
    const getSearchTypeDisplayText = (type) => {
        switch (type) {
            case "majorName":
                return "Tên Ngành";
            case "id":
                return "ID";
            default:
                return type;
        }
    };

    // Get status badge based on number of courses
    const getStatusBadge = (curriculum) => {
        const totalCourses = curriculum.totalCourses || 0;
        if (totalCourses === 0) {
            return <Badge bg="danger">Chưa có môn học</Badge>;
        } else if (totalCourses >= 40) {
            return <Badge bg="success">Đầy đủ</Badge>;
        } else if (totalCourses >= 30) {
            return <Badge bg="warning">Gần hoàn thành</Badge>;
        } else {
            return <Badge bg="info">Đang xây dựng</Badge>;
        }
    };

    // Smart pagination helper
    const getVisiblePageNumbers = () => {
        const maxPages = Math.max(1, totalPages || 1);

        // If total pages <= 7, show all pages
        if (maxPages <= 7) {
            return Array.from({length: maxPages}, (_, i) => i);
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
        for (
            let i = Math.max(0, current - 1);
            i <= Math.min(maxPages - 1, current + 1);
            i++
        ) {
            pages.add(i);
        }

        // Convert to sorted array
        const sortedPages = Array.from(pages).sort((a, b) => a - b);

        // Insert ellipsis markers
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
        <MainLayout activeMenu="curriculum">
            <div className="container-fluid pt-3 pb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="h4 fw-bold text-dark">
                            Quản Lý Chương Trình Đào Tạo
                        </h2>
                        <p className="text-muted mb-0">
                            Tổng cộng: {totalElements} chương trình đào tạo
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-secondary"
                            onClick={() =>
                                loadProgramCurriculums(
                                    currentPage,
                                    pageSize,
                                    searchTerm,
                                    searchType
                                )
                            }
                            disabled={loading}
                        >
                            <FontAwesomeIcon icon={faRefresh} className="me-1"/>
                            Làm Mới
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() =>
                                navigate("/admin/academic/program-curriculum/create")
                            }
                        >
                            <FontAwesomeIcon icon={faPlus} className="me-1"/>
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
                            style={{width: "150px"}}
                            value={searchType}
                            onChange={(e) => handleSearchTypeChange(e.target.value)}
                        >
                            <option value="name">Tên Chương Trình</option>
                            <option value="code">Mã Chương Trình</option>
                            <option value="majorName">Tên Ngành</option>
                        </Form.Select>
                        <div className="d-flex gap-2">
                            <Form.Control
                                type="text"
                                placeholder="Nhập từ khóa..."
                                value={searchTerm}
                                onChange={handleSearchInputChange}
                                onKeyPress={handleSearchKeyPress}
                                style={{width: "300px"}}
                            />
                            <Button variant="primary" onClick={handleSearch} disabled={isSearching}>
                                {isSearching ? (
                                    <Spinner size="sm" animation="border"/>
                                ) : (
                                    <FontAwesomeIcon icon={faSearch}/>
                                )}
                                <span className="ms-2">Tìm</span>
                            </Button>
                            {searchTerm && (
                                <Button variant="secondary" onClick={handleClearSearch}>
                                    <FontAwesomeIcon icon={faTimes}/>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Page Size Selection - Right Side */}
                    <div className="d-flex align-items-center gap-2">
                        <span>Hiển thị:</span>
                        <Form.Select
                            style={{width: "110px"}}
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

                {/* Program Curriculums Table */}
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-0">
                        {/* Loading State */}
                        {loading && (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary"/>
                                <p className="mt-2 text-muted">
                                    Đang tải danh sách chương trình đào tạo...
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
                                                ID
                                            </th>
                                            <th scope="col" className="fw-medium text-muted">
                                                Tên Ngành
                                            </th>
                                            <th
                                                scope="col"
                                                className="fw-medium text-muted text-center"
                                            >
                                                Số Môn Học
                                            </th>
                                            <th
                                                scope="col"
                                                className="fw-medium text-muted text-center"
                                            >
                                                Tổng Tín Chỉ
                                            </th>
                                            <th scope="col" className="fw-medium text-muted">
                                                Trạng Thái
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
                                        {programCurriculums.length > 0 ? (
                                            programCurriculums.map((curriculum, index) => (
                                                <tr key={curriculum.id}>
                                                    <td className="fw-medium text-muted">
                                                        {currentPage * pageSize + index + 1}
                                                    </td>
                                                    <td className="fw-medium">{curriculum.id}</td>
                                                    <td className="fw-medium">
                                                        <div className="d-flex align-items-center">
                                                            <FontAwesomeIcon
                                                                icon={faGraduationCap}
                                                                className="text-primary me-2"
                                                            />
                                                            {curriculum.majorName}
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <Badge bg="info" className="fs-6">
                                                            <FontAwesomeIcon
                                                                icon={faBook}
                                                                className="me-1"
                                                            />
                                                            {curriculum.totalCourses || 0}
                                                        </Badge>
                                                    </td>
                                                    <td className="text-center fw-medium">
                                                        {curriculum.totalCredits || 0}
                                                    </td>
                                                    <td>{getStatusBadge(curriculum)}</td>
                                                    <td className="text-center">
                                                        <Dropdown>
                                                            <Dropdown.Toggle
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                className="border-0"
                                                            >
                                                                <FontAwesomeIcon icon={faEllipsisVertical}/>
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item
                                                                    onClick={() =>
                                                                        handleViewProgramCurriculum(curriculum)
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
                                                                        handleEditProgramCurriculum(curriculum)
                                                                    }
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={faEdit}
                                                                        className="me-2"
                                                                    />
                                                                    Chỉnh Sửa
                                                                </Dropdown.Item>
                                                                <Dropdown.Divider/>
                                                                <Dropdown.Item
                                                                    className="text-danger"
                                                                    onClick={() =>
                                                                        handleDeleteProgramCurriculum(curriculum)
                                                                    }
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
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="7"
                                                    className="text-center py-5 text-muted"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faListUl}
                                                        size="3x"
                                                        className="mb-3 opacity-50"
                                                    />
                                                    <p>
                                                        Không có chương trình đào tạo nào được tìm thấy
                                                    </p>
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

export default ProgramCurriculumList;
