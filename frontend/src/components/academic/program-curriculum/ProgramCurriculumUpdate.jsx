import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Form, Button, Spinner, Alert, Badge, Table, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGraduationCap, faBook, faSearch, faArrowLeft, faSave,
    faPlus, faEdit, faTrash, faCheckCircle, faTimesCircle,
    faExclamationTriangle, faInfoCircle, faTimes
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import { programCurriculumService } from "../../../services/apiService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

const ProgramCurriculumUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // State management
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // Form data state
    const [selectedMajor, setSelectedMajor] = useState(null);
    const [curriculumCourses, setCurriculumCourses] = useState([]);

    // Major search state
    const [majorSearchTerm, setMajorSearchTerm] = useState('');
    const [majorSearchResults, setMajorSearchResults] = useState([]);
    const [majorSearchLoading, setMajorSearchLoading] = useState(false);
    const [showMajorSearch, setShowMajorSearch] = useState(false);

    // Course search state
    const [courseSearchTerm, setCourseSearchTerm] = useState('');
    const [courseSearchResults, setCourseSearchResults] = useState([]);
    const [courseSearchLoading, setCourseSearchLoading] = useState(false);
    const [showCourseSearch, setShowCourseSearch] = useState(false);

    // Validation state
    const [formErrors, setFormErrors] = useState({});

    // Course type display mapping
    const courseTypeDisplayMap = {
        'GENERAL': 'Môn chung',
        'SPECIALIZED': 'Môn chuyên ngành',
        'ELECTIVE': 'Môn tự chọn',
        'CORE': 'Môn cơ sở'
    };

    // Load program curriculum data for edit mode
    const loadProgramCurriculumData = async () => {
        if (!isEditMode) return;

        try {
            setLoading(true);
            setError(null);

            // 🚧 PLACEHOLDER DATA - Replace when backend is ready
            console.warn('🚧 Using placeholder program curriculum edit data - implement backend endpoint');
            
            const placeholderData = {
                id: parseInt(id),
                major: {
                    id: 1,
                    name: "Công nghệ thông tin",
                    description: "Chương trình đào tạo Công nghệ thông tin"
                },
                courses: [
                    {
                        id: 1,
                        code: "CS101",
                        name: "Lập trình căn bản",
                        creditsTheory: 2,
                        creditsPractical: 1,
                        courseType: "CORE",
                        isMandatory: true,
                        semesterRecommended: 1
                    },
                    {
                        id: 2,
                        code: "MATH101", 
                        name: "Toán cao cấp 1",
                        creditsTheory: 3,
                        creditsPractical: 0,
                        courseType: "GENERAL",
                        isMandatory: true,
                        semesterRecommended: 1
                    }
                ]
            };

            setSelectedMajor(placeholderData.major);
            setCurriculumCourses(placeholderData.courses);

        } catch (err) {
            setError('Không thể tải thông tin chương trình đào tạo. Vui lòng thử lại.');
            console.error('Error loading program curriculum data:', err);
            toast.error('Lỗi khi tải thông tin chương trình đào tạo');
        } finally {
            setLoading(false);
        }
    };

    // Initialize component
    useEffect(() => {
        if (isEditMode) {
            loadProgramCurriculumData();
        }
    }, [id]);

    // Search majors
    const searchMajors = async (searchTerm) => {
        if (!searchTerm.trim() || searchTerm.length < 2) {
            setMajorSearchResults([]);
            return;
        }

        try {
            setMajorSearchLoading(true);
            const response = await programCurriculumService.searchMajors(searchTerm);
            
            if (response.result) {
                setMajorSearchResults(response.result);
            } else {
                setMajorSearchResults(response || []);
            }
        } catch (err) {
            console.error('Error searching majors:', err);
            toast.error('Lỗi khi tìm kiếm ngành học');
            setMajorSearchResults([]);
        } finally {
            setMajorSearchLoading(false);
        }
    };

    // Search courses
    const searchCourses = async (searchTerm) => {
        if (!searchTerm.trim() || searchTerm.length < 2) {
            setCourseSearchResults([]);
            return;
        }

        try {
            setCourseSearchLoading(true);
            const response = await programCurriculumService.searchCourses(searchTerm);
            
            if (response.result) {
                // Filter out courses already in curriculum
                const existingCourseIds = curriculumCourses.map(c => c.id);
                const filteredCourses = response.result.filter(course => 
                    !existingCourseIds.includes(course.id)
                );
                setCourseSearchResults(filteredCourses);
            } else {
                setCourseSearchResults(response || []);
            }
        } catch (err) {
            console.error('Error searching courses:', err);
            toast.error('Lỗi khi tìm kiếm môn học');
            setCourseSearchResults([]);
        } finally {
            setCourseSearchLoading(false);
        }
    };

    // Handle major search input change
    const handleMajorSearchChange = (e) => {
        const value = e.target.value;
        setMajorSearchTerm(value);
        setShowMajorSearch(true);
        
        // Debounce search
        const timeoutId = setTimeout(() => {
            searchMajors(value);
        }, 300);

        return () => clearTimeout(timeoutId);
    };

    // Handle course search input change
    const handleCourseSearchChange = (e) => {
        const value = e.target.value;
        setCourseSearchTerm(value);
        setShowCourseSearch(true);
        
        // Debounce search
        const timeoutId = setTimeout(() => {
            searchCourses(value);
        }, 300);

        return () => clearTimeout(timeoutId);
    };

    // Select major
    const selectMajor = (major) => {
        setSelectedMajor(major);
        setMajorSearchTerm(major.name);
        setShowMajorSearch(false);
        setMajorSearchResults([]);
        
        // Clear any major-related errors
        if (formErrors.major) {
            setFormErrors(prev => ({ ...prev, major: null }));
        }
    };

    // Add course to curriculum
    const addCourse = (course) => {
        const courseWithDefaults = {
            ...course,
            isMandatory: true, // Default to mandatory
            semesterRecommended: 1 // Default to semester 1
        };
        
        setCurriculumCourses(prev => [...prev, courseWithDefaults]);
        setCourseSearchTerm('');
        setShowCourseSearch(false);
        setCourseSearchResults([]);
        
        toast.success(`Đã thêm môn học "${course.name}"`);
    };

    // Remove course from curriculum
    const removeCourse = (courseId) => {
        setCurriculumCourses(prev => prev.filter(course => course.id !== courseId));
        toast.success('Đã xóa môn học khỏi chương trình đào tạo');
    };

    // Update course in curriculum
    const updateCourse = (courseId, field, value) => {
        setCurriculumCourses(prev => prev.map(course => 
            course.id === courseId 
                ? { ...course, [field]: value }
                : course
        ));
    };

    // Form validation
    const validateForm = () => {
        const errors = {};

        if (!selectedMajor) {
            errors.major = 'Vui lòng chọn ngành học';
        }

        if (curriculumCourses.length === 0) {
            errors.courses = 'Vui lòng thêm ít nhất một môn học';
        }

        // Validate semester recommendations
        const invalidSemesters = curriculumCourses.filter(course => 
            !course.semesterRecommended || course.semesterRecommended < 1 || course.semesterRecommended > 8
        );

        if (invalidSemesters.length > 0) {
            errors.semesters = 'Học kỳ đề xuất phải từ 1 đến 8';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra và sửa các lỗi trong form');
            return;
        }

        try {
            setSaving(true);

            const submitData = {
                majorId: selectedMajor.id,
                courses: curriculumCourses.map(course => ({
                    courseId: course.id,
                    isMandatory: course.isMandatory,
                    semesterRecommended: course.semesterRecommended
                }))
            };

            if (isEditMode) {
                submitData.id = parseInt(id);
            }

            // 🚧 PLACEHOLDER - Replace when backend is ready
            console.warn('🚧 Saving program curriculum data (placeholder):', submitData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const successMessage = isEditMode ? 'Cập nhật chương trình đào tạo thành công!' : 'Tạo chương trình đào tạo mới thành công!';
            toast.success(successMessage);
            navigate('/admin/academic/program-curriculum');

        } catch (err) {
            console.error('Error saving program curriculum:', err);
            const errorMessage = isEditMode ? 'Lỗi khi cập nhật chương trình đào tạo' : 'Lỗi khi tạo chương trình đào tạo mới';
            toast.error(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    // Calculate statistics
    const mandatoryCoursesCount = curriculumCourses.filter(course => course.isMandatory).length;
    const electiveCoursesCount = curriculumCourses.filter(course => !course.isMandatory).length;
    const totalCredits = curriculumCourses.reduce((sum, course) => 
        sum + (course.creditsTheory || 0) + (course.creditsPractical || 0), 0
    );

    if (loading) {
        return (
            <MainLayout activeMenu="curriculum">
                <div className="container-fluid pt-3 pb-5">
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted">Đang tải thông tin chương trình đào tạo...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout activeMenu="curriculum">
            <div className="container-fluid pt-3 pb-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="h4 fw-bold text-dark">
                            {isEditMode ? 'Chỉnh Sửa Chương Trình Đào Tạo' : 'Tạo Chương Trình Đào Tạo Mới'}
                        </h2>
                        <p className="text-muted mb-0">
                            {isEditMode ? 'Cập nhật danh sách môn học và cấu hình chương trình đào tạo' : 'Tạo chương trình đào tạo mới cho ngành học'}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-secondary"
                            onClick={() => navigate('/admin/academic/program-curriculum')}
                            disabled={saving}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                            Quay lại
                        </Button>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <Alert variant="danger" dismissible onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Row>
                        {/* Main Form - Left Side */}
                        <Col lg={8} className="mb-4">
                            {/* Major Selection */}
                            <Card className="border-0 shadow-sm mb-4">
                                <Card.Header className="bg-light border-0">
                                    <h5 className="mb-0 d-flex align-items-center">
                                        <FontAwesomeIcon icon={faGraduationCap} className="me-2 text-primary" />
                                        Chọn Ngành Học
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <Form.Group className="position-relative">
                                        <Form.Label className="fw-medium">
                                            Ngành Học <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Tìm kiếm ngành học..."
                                            value={majorSearchTerm}
                                            onChange={handleMajorSearchChange}
                                            onFocus={() => setShowMajorSearch(true)}
                                            isInvalid={!!formErrors.major}
                                            disabled={saving}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.major}
                                        </Form.Control.Feedback>

                                        {/* Major Search Results */}
                                        {showMajorSearch && (
                                            <Card className="position-absolute w-100 mt-1 shadow border" style={{ zIndex: 1000 }}>
                                                <Card.Body className="p-2">
                                                    {majorSearchLoading ? (
                                                        <div className="text-center py-2">
                                                            <Spinner size="sm" animation="border" />
                                                            <small className="ms-2 text-muted">Đang tìm kiếm...</small>
                                                        </div>
                                                    ) : majorSearchResults.length > 0 ? (
                                                        <div className="max-height-200 overflow-auto">
                                                            {majorSearchResults.map(major => (
                                                                <div
                                                                    key={major.id}
                                                                    className="d-flex align-items-center p-2 border rounded mb-1 cursor-pointer hover-bg-light"
                                                                    onClick={() => selectMajor(major)}
                                                                    style={{ cursor: 'pointer' }}
                                                                >
                                                                    <FontAwesomeIcon icon={faGraduationCap} className="text-primary me-2" />
                                                                    <div className="flex-grow-1">
                                                                        <div className="fw-medium">{major.name}</div>
                                                                        {major.description && (
                                                                            <small className="text-muted">{major.description}</small>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : majorSearchTerm.length >= 2 ? (
                                                        <div className="text-center py-2 text-muted">
                                                            <small>Không tìm thấy ngành học nào</small>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-2 text-muted">
                                                            <small>Nhập ít nhất 2 ký tự để tìm kiếm</small>
                                                        </div>
                                                    )}
                                                </Card.Body>
                                            </Card>
                                        )}
                                    </Form.Group>

                                    {/* Selected Major Display */}
                                    {selectedMajor && (
                                        <div className="mt-3 p-3 bg-light rounded">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div className="d-flex align-items-center">
                                                    <FontAwesomeIcon icon={faGraduationCap} className="text-primary me-2" />
                                                    <div>
                                                        <div className="fw-bold">{selectedMajor.name}</div>
                                                        {selectedMajor.description && (
                                                            <small className="text-muted">{selectedMajor.description}</small>
                                                        )}
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedMajor(null);
                                                        setMajorSearchTerm('');
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>

                            {/* Course Selection */}
                            {selectedMajor && (
                                <Card className="border-0 shadow-sm mb-4">
                                    <Card.Header className="bg-light border-0">
                                        <h5 className="mb-0 d-flex align-items-center">
                                            <FontAwesomeIcon icon={faBook} className="me-2 text-success" />
                                            Thêm Môn Học
                                        </h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Form.Group className="position-relative">
                                            <Form.Label className="fw-medium">Tìm Kiếm Môn Học</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Tìm kiếm môn học theo tên hoặc mã..."
                                                value={courseSearchTerm}
                                                onChange={handleCourseSearchChange}
                                                onFocus={() => setShowCourseSearch(true)}
                                                disabled={saving}
                                            />

                                            {/* Course Search Results */}
                                            {showCourseSearch && (
                                                <Card className="position-absolute w-100 mt-1 shadow border" style={{ zIndex: 999 }}>
                                                    <Card.Body className="p-2">
                                                        {courseSearchLoading ? (
                                                            <div className="text-center py-2">
                                                                <Spinner size="sm" animation="border" />
                                                                <small className="ms-2 text-muted">Đang tìm kiếm...</small>
                                                            </div>
                                                        ) : courseSearchResults.length > 0 ? (
                                                            <div className="max-height-300 overflow-auto">
                                                                {courseSearchResults.map(course => {
                                                                    const totalCredits = (course.creditsTheory || 0) + (course.creditsPractical || 0);
                                                                    return (
                                                                        <div
                                                                            key={course.id}
                                                                            className="d-flex align-items-center justify-content-between p-2 border rounded mb-1 cursor-pointer hover-bg-light"
                                                                            onClick={() => addCourse(course)}
                                                                            style={{ cursor: 'pointer' }}
                                                                        >
                                                                            <div className="d-flex align-items-center flex-grow-1">
                                                                                <FontAwesomeIcon icon={faBook} className="text-success me-2" />
                                                                                <div className="flex-grow-1">
                                                                                    <div className="fw-medium">{course.name}</div>
                                                                                    <small className="text-muted">
                                                                                        {course.code} • {totalCredits} tín chỉ • {courseTypeDisplayMap[course.courseType]}
                                                                                    </small>
                                                                                </div>
                                                                            </div>
                                                                            <Button variant="outline-primary" size="sm">
                                                                                <FontAwesomeIcon icon={faPlus} />
                                                                            </Button>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : courseSearchTerm.length >= 2 ? (
                                                            <div className="text-center py-2 text-muted">
                                                                <small>Không tìm thấy môn học nào</small>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-2 text-muted">
                                                                <small>Nhập ít nhất 2 ký tự để tìm kiếm</small>
                                                            </div>
                                                        )}
                                                    </Card.Body>
                                                </Card>
                                            )}
                                        </Form.Group>

                                        {formErrors.courses && (
                                            <div className="text-danger mt-2">
                                                <small>{formErrors.courses}</small>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            )}

                            {/* Curriculum Courses Table */}
                            {curriculumCourses.length > 0 && (
                                <Card className="border-0 shadow-sm">
                                    <Card.Header className="bg-light border-0">
                                        <h5 className="mb-0 d-flex align-items-center">
                                            <FontAwesomeIcon icon={faBook} className="me-2 text-info" />
                                            Danh Sách Môn Học Trong Chương Trình
                                        </h5>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        <div className="table-responsive">
                                            <Table hover className="mb-0">
                                                <thead className="bg-light">
                                                    <tr>
                                                        <th scope="col" className="fw-medium text-muted">#</th>
                                                        <th scope="col" className="fw-medium text-muted">Mã MH</th>
                                                        <th scope="col" className="fw-medium text-muted">Tên Môn Học</th>
                                                        <th scope="col" className="fw-medium text-muted text-center">TC</th>
                                                        <th scope="col" className="fw-medium text-muted text-center">Bắt Buộc</th>
                                                        <th scope="col" className="fw-medium text-muted text-center">HK Đề Xuất</th>
                                                        <th scope="col" className="fw-medium text-muted text-center">Thao Tác</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {curriculumCourses.map((course, index) => {
                                                        const totalCredits = (course.creditsTheory || 0) + (course.creditsPractical || 0);
                                                        return (
                                                            <tr key={course.id}>
                                                                <td className="fw-medium text-muted">{index + 1}</td>
                                                                <td>
                                                                    <code className="bg-light px-2 py-1 rounded small">
                                                                        {course.code}
                                                                    </code>
                                                                </td>
                                                                <td className="fw-medium">{course.name}</td>
                                                                <td className="text-center">{totalCredits}</td>
                                                                <td className="text-center">
                                                                    <Form.Check
                                                                        type="switch"
                                                                        checked={course.isMandatory}
                                                                        onChange={(e) => updateCourse(course.id, 'isMandatory', e.target.checked)}
                                                                        disabled={saving}
                                                                        className="d-flex justify-content-center"
                                                                    />
                                                                </td>
                                                                <td className="text-center">
                                                                    <Form.Select
                                                                        size="sm"
                                                                        value={course.semesterRecommended || 1}
                                                                        onChange={(e) => updateCourse(course.id, 'semesterRecommended', parseInt(e.target.value))}
                                                                        disabled={saving}
                                                                        style={{ width: '80px' }}
                                                                    >
                                                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(semester => (
                                                                            <option key={semester} value={semester}>
                                                                                HK {semester}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Select>
                                                                </td>
                                                                <td className="text-center">
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                        onClick={() => removeCourse(course.id)}
                                                                        disabled={saving}
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </Table>
                                        </div>

                                        {formErrors.semesters && (
                                            <div className="p-3 border-top">
                                                <div className="text-danger">
                                                    <small>{formErrors.semesters}</small>
                                                </div>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            )}
                        </Col>

                        {/* Summary Panel - Right Side */}
                        <Col lg={4} className="mb-4">
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Header className="bg-light border-0">
                                    <h5 className="mb-0 d-flex align-items-center">
                                        <FontAwesomeIcon icon={faInfoCircle} className="me-2 text-info" />
                                        Tóm Tắt Chương Trình
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    {selectedMajor ? (
                                        <>
                                            <div className="mb-3">
                                                <small className="text-muted">Ngành học</small>
                                                <p className="fw-bold mb-0">{selectedMajor.name}</p>
                                            </div>
                                            
                                            <div className="mb-3">
                                                <small className="text-muted">Tổng môn học</small>
                                                <p className="fw-bold mb-0">
                                                    <Badge bg="primary" className="fs-6">
                                                        {curriculumCourses.length} môn học
                                                    </Badge>
                                                </p>
                                            </div>

                                            <div className="mb-3">
                                                <small className="text-muted">Môn bắt buộc</small>
                                                <p className="fw-bold mb-0">
                                                    <Badge bg="success" className="fs-6">
                                                        {mandatoryCoursesCount} môn
                                                    </Badge>
                                                </p>
                                            </div>

                                            <div className="mb-3">
                                                <small className="text-muted">Môn tự chọn</small>
                                                <p className="fw-bold mb-0">
                                                    <Badge bg="warning" className="fs-6">
                                                        {electiveCoursesCount} môn
                                                    </Badge>
                                                </p>
                                            </div>

                                            <div className="mb-3">
                                                <small className="text-muted">Tổng tín chỉ</small>
                                                <p className="fw-bold mb-0">
                                                    <Badge bg="info" className="fs-6">
                                                        {totalCredits} tín chỉ
                                                    </Badge>
                                                </p>
                                            </div>

                                            {curriculumCourses.length > 0 && (
                                                <div className="mt-4">
                                                    <small className="text-muted">Phân bố môn học</small>
                                                    <div className="progress mt-1" style={{ height: '8px' }}>
                                                        <div 
                                                            className="progress-bar bg-success" 
                                                            style={{ width: `${(mandatoryCoursesCount / curriculumCourses.length) * 100}%` }}
                                                        ></div>
                                                        <div 
                                                            className="progress-bar bg-warning" 
                                                            style={{ width: `${(electiveCoursesCount / curriculumCourses.length) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-1">
                                                        <small className="text-muted">
                                                            {Math.round((mandatoryCoursesCount / curriculumCourses.length) * 100)}% Bắt buộc
                                                        </small>
                                                        <small className="text-muted">
                                                            {Math.round((electiveCoursesCount / curriculumCourses.length) * 100)}% Tự chọn
                                                        </small>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-5 text-muted">
                                            <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="mb-3 opacity-50" />
                                            <p>Vui lòng chọn ngành học để tiếp tục</p>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Form Actions */}
                    <Row>
                        <Col xs={12}>
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="text-muted">
                                            <small>
                                                <span className="text-danger">*</span> Các trường bắt buộc
                                            </small>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="outline-secondary"
                                                onClick={() => navigate('/admin/academic/program-curriculum')}
                                                disabled={saving}
                                            >
                                                <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                                                Hủy
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                disabled={saving || !selectedMajor || curriculumCourses.length === 0}
                                            >
                                                {saving ? (
                                                    <>
                                                        <Spinner
                                                            as="span"
                                                            animation="border"
                                                            size="sm"
                                                            role="status"
                                                            className="me-1"
                                                        />
                                                        Đang lưu...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon 
                                                            icon={isEditMode ? faEdit : faPlus} 
                                                            className="me-1" 
                                                        />
                                                        {isEditMode ? 'Cập Nhật' : 'Tạo Mới'}
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </form>
            </div>
        </MainLayout>
    );
};

export default ProgramCurriculumUpdate; 