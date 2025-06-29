import { useState, useEffect } from 'react';
import { Table, Button, Alert, Spinner, Form, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus, faEye, faEdit, faTrash,
    faRefresh, faSearch, faTimes, faBuilding
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

    const handleRefresh = () => {
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
            <div className="container-fluid">
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold text-primary">
                        <FontAwesomeIcon icon={faBuilding} className="me-2" />
                        Quản Lý Khoa/Phòng Ban
                    </h2>
                    <Button
                        variant="success"
                        onClick={() => navigate('/admin/academic/departments/create')}
                    >
                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                        Thêm Khoa/Phòng Ban
                    </Button>
                </div>

                {/* Search and Filter Section */}
                <Row className="mb-4">
                    <Col md={6}>
                        <Form className="d-flex">
                            <Form.Control
                                type="text"
                                placeholder="Tìm kiếm theo tên khoa/phòng ban..."
                                value={searchTerm}
                                onChange={handleSearchInputChange}
                                onKeyPress={handleSearchKeyPress}
                                className="me-2"
                            />
                            <Button
                                variant="outline-primary"
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="me-2"
                            >
                                {isSearching ? (
                                    <Spinner as="span" animation="border" size="sm" />
                                ) : (
                                    <FontAwesomeIcon icon={faSearch} />
                                )}
                            </Button>
                            {searchTerm && (
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleClearSearch}
                                    title="Xóa tìm kiếm"
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </Button>
                            )}
                        </Form>
                    </Col>
                    <Col md={6} className="text-end">
                        <Button
                            variant="outline-info"
                            onClick={handleRefresh}
                            disabled={loading}
                        >
                            <FontAwesomeIcon icon={faRefresh} className="me-2" />
                            Làm mới
                        </Button>
                    </Col>
                </Row>

                {/* Results Summary */}
                {!loading && (
                    <div className="mb-3">
                        <small className="text-muted">
                            {searchTerm ? (
                                <>Tìm thấy <strong>{departments.length}</strong> khoa/phòng ban với từ khóa "<em>{searchTerm}</em>"</>
                            ) : (
                                <>Hiển thị tất cả <strong>{departments.length}</strong> khoa/phòng ban</>
                            )}
                        </small>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <Alert variant="danger" className="d-flex align-items-center">
                        <div className="flex-grow-1">{error}</div>
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={handleRefresh}
                        >
                            <FontAwesomeIcon icon={faRefresh} className="me-1" />
                            Thử lại
                        </Button>
                    </Alert>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <div className="mt-2 text-muted">Đang tải danh sách khoa/phòng ban...</div>
                    </div>
                )}

                {/* Table Section */}
                {!loading && !error && (
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead className="table-dark">
                                <tr>
                                    <th style={{ width: '10%' }}>ID</th>
                                    <th style={{ width: '70%' }}>Tên Khoa/Phòng Ban</th>
                                    <th style={{ width: '20%' }}>Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departments.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="text-center text-muted py-4">
                                            {searchTerm ? 
                                                'Không tìm thấy khoa/phòng ban nào phù hợp với từ khóa tìm kiếm.' :
                                                'Chưa có khoa/phòng ban nào được tạo.'
                                            }
                                        </td>
                                    </tr>
                                ) : (
                                    departments.map((department) => (
                                        <tr key={department.id}>
                                            <td>
                                                <span className="fw-bold text-primary">#{department.id}</span>
                                            </td>
                                            <td>
                                                <div className="fw-semibold">{department.name}</div>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <Button
                                                        variant="outline-info"
                                                        size="sm"
                                                        onClick={() => handleViewDepartment(department)}
                                                        title="Xem chi tiết"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </Button>
                                                    <Button
                                                        variant="outline-warning"
                                                        size="sm"
                                                        onClick={() => handleEditDepartment(department)}
                                                        title="Chỉnh sửa"
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDeleteDepartment(department)}
                                                        title="Xóa"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default DepartmentList; 