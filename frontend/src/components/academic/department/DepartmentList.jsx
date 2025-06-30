import { useState, useEffect } from 'react';
import { Table, Button, Badge, Dropdown, Alert, Spinner, Pagination, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus, faEye, faEdit, faTrash,
    faEllipsisVertical, faRefresh, faSearch, faTimes, faBuilding
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import departmentService from "../../../services/departmentService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

const DepartmentList = () => {
    const navigate = useNavigate();

    // State management
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Search state
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Load departments data
    const loadDepartments = async (search = '') => {
        try {
            setLoading(true);
            setError(null);

            const response = await departmentService.getAllDepartments();

            if (response.result) {
                let departmentList = response.result || [];
                
                // Filter by search term if provided
                if (search.trim()) {
                    departmentList = departmentList.filter(dept =>
                        dept.name.toLowerCase().includes(search.toLowerCase())
                    );
                }
                
                setDepartments(departmentList);
            } else {
                // Direct array response (fallback)
                setDepartments(response || []);
            }
        } catch (err) {
            setError('Không thể tải danh sách khoa/phòng ban. Vui lòng thử lại.');
            console.error('Error loading departments:', err);
            toast.error('Lỗi khi tải danh sách khoa/phòng ban');
        } finally {
            setLoading(false);
            setIsSearching(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        loadDepartments();
    }, []);

    // Search handler functions
    const handleSearch = () => {
        setIsSearching(true);
        loadDepartments(searchTerm);
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
        loadDepartments('');
    };

    // Handle department actions
    const handleViewDepartment = (department) => {
        navigate(`/admin/academic/departments/details/${department.id}`);
    };

    const handleEditDepartment = (department) => {
        navigate(`/admin/academic/departments/edit/${department.id}`);
    };

    const handleDeleteDepartment = async (department) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa khoa/phòng ban "${department.name}"?\n\nLưu ý: Việc xóa khoa/phòng ban có thể ảnh hưởng đến các ngành học và thành viên liên quan.`)) {
            try {
                await departmentService.deleteDepartment(department.id);
                toast.success('Xóa khoa/phòng ban thành công');
                loadDepartments(searchTerm); // Reload with current search
            } catch (err) {
                toast.error('Lỗi khi xóa khoa/phòng ban');
                console.error('Error deleting department:', err);
            }
        }
    };

    return (
        <MainLayout activeMenu="academic">
            <div className="container-fluid pt-3 pb-5">
                {/* Page Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="h4 fw-bold text-dark">Quản Lý Khoa/Phòng Ban</h2>
                        <p className="text-muted mb-0">
                            Tổng cộng: {departments.length} khoa/phòng ban
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
                            onClick={() => loadDepartments(searchTerm)}
                            disabled={loading}
                        >
                            <FontAwesomeIcon icon={faRefresh} className="me-1" />
                            Làm Mới
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => navigate('/admin/academic/departments/create')}
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
                        {/* Search Controls */}
                        <div className="d-flex justify-content-between align-items-center p-3 border-bottom flex-wrap gap-3">
                            {/* Search Section - Left Side */}
                            <div className="d-flex align-items-center gap-3">
                                <div className="d-flex align-items-center">
                                    <span className="text-muted me-2">Tìm kiếm:</span>
                                    <span className="badge bg-light text-dark">Tên khoa/phòng ban</span>
                                </div>

                                {/* Search Input */}
                                <div className="d-flex align-items-center">
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập tên khoa/phòng ban..."
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

                            {/* Right Side - Future features */}
                            <div className="d-flex align-items-center">
                                <span className="text-muted me-2">Hiển thị:</span>
                                <span className="badge bg-light text-dark">{departments.length} khoa/phòng ban</span>
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
                                        <th className="border-0">Tên Khoa/Phòng Ban</th>
                                        <th className="border-0">Trạng Thái</th>
                                        <th className="border-0 text-center">Thao Tác</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {departments.length > 0 ? (
                                        departments.map((department) => (
                                            <tr key={department.id}>
                                                <td className="fw-medium">#{department.id}</td>
                                                <td>
                                                    <div>
                                                        <div className="fw-medium">{department.name}</div>
                                                        <small className="text-muted">
                                                            <FontAwesomeIcon icon={faBuilding} className="me-1" />
                                                            Khoa/Phòng Ban
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <Badge bg="success" className="px-2 py-1">
                                                        Hoạt động
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
                                                            <Dropdown.Item onClick={() => handleViewDepartment(department)}>
                                                                <FontAwesomeIcon icon={faEye} className="me-2" />
                                                                Chi Tiết
                                                            </Dropdown.Item>
                                                            <Dropdown.Item onClick={() => handleEditDepartment(department)}>
                                                                <FontAwesomeIcon icon={faEdit} className="me-2" />
                                                                Chỉnh Sửa
                                                            </Dropdown.Item>
                                                            <Dropdown.Divider />
                                                            <Dropdown.Item
                                                                onClick={() => handleDeleteDepartment(department)}
                                                                className="text-danger"
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} className="me-2" />
                                                                Xóa
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4">
                                                <div className="text-muted">
                                                    {searchTerm ? 
                                                        `Không tìm thấy kết quả cho "${searchTerm}"` : 
                                                        'Không có dữ liệu khoa/phòng ban'
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </Table>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default DepartmentList; 