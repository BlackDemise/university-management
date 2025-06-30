import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Badge, Button, Spinner, Alert, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faGraduationCap, faBook, faInfoCircle, faArrowLeft, faEdit,
    faCalendarAlt, faAward, faCertificate, faRefresh, faListUl,
    faCheckCircle, faTimesCircle, faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import { programCurriculumService } from "../../../services/apiService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

const ProgramCurriculumDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State management
    const [programCurriculum, setProgramCurriculum] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isNotFound, setIsNotFound] = useState(false);

    // Course type display mapping
    const courseTypeDisplayMap = {
        'GENERAL': 'Môn chung',
        'SPECIALIZED': 'Môn chuyên ngành',
        'ELECTIVE': 'Môn tự chọn',
        'CORE': 'Môn cơ sở'
    };

    // Load program curriculum details
    const loadProgramCurriculumDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            setIsNotFound(false);

            // 🚧 PLACEHOLDER DATA - Replace when backend is ready
            console.warn('🚧 Using placeholder program curriculum details data - implement backend endpoint');
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Placeholder curriculum data
            const placeholderCurriculum = {
                id: parseInt(id),
                majorName: "Công nghệ thông tin",
                majorId: 1,
                majorDescription: "Chương trình đào tạo bằng cử nhân Công nghệ thông tin nhằm trang bị cho sinh viên kiến thức cơ bản và chuyên sâu về công nghệ thông tin, phát triển kỹ năng lập trình, thiết kế hệ thống và quản lý dự án phần mềm.",
                totalCourses: 45,
                totalCredits: 140,
                mandatoryCourses: 35,
                electiveCourses: 10,
                departmentName: "Khoa Công nghệ thông tin",
                createdAt: "2024-01-15",
                updatedAt: "2024-01-20",
                status: "ACTIVE"
            };

            if (placeholderCurriculum.id === parseInt(id)) {
                setProgramCurriculum(placeholderCurriculum);
                // Load courses for this curriculum
                await loadCurriculumCourses();
            } else {
                setIsNotFound(true);
            }

        } catch (err) {
            console.error('Error loading program curriculum details:', err);
            
            // Check if it's a 404 error
            if (err.response && err.response.status === 404) {
                setIsNotFound(true);
                setError(null);
            } else {
                setError('Không thể tải thông tin chương trình đào tạo. Vui lòng thử lại.');
                setIsNotFound(false);
                toast.error('Lỗi khi tải thông tin chương trình đào tạo');
            }
        } finally {
            setLoading(false);
        }
    };

    // Load courses in curriculum
    const loadCurriculumCourses = async () => {
        try {
            setCoursesLoading(true);
            
            const response = await programCurriculumService.getCurriculumCourses(id);
            
            if (response.result) {
                setCourses(response.result);
            } else {
                setCourses(response || []);
            }
        } catch (err) {
            console.error('Error loading curriculum courses:', err);
            toast.error('Lỗi khi tải danh sách môn học');
        } finally {
            setCoursesLoading(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        if (id) {
            loadProgramCurriculumDetails();
        }
    }, [id]);

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

    // Get course type icon
    const getCourseTypeIcon = (courseType) => {
        switch (courseType) {
            case 'CORE': return faAward;
            case 'SPECIALIZED': return faCertificate;
            case 'ELECTIVE': return faGraduationCap;
            case 'GENERAL': return faBook;
            default: return faBook;
        }
    };

    // Get mandatory status icon and text
    const getMandatoryStatus = (isMandatory) => {
        return isMandatory ? {
            icon: faCheckCircle,
            text: 'Bắt buộc',
            variant: 'success'
        } : {
            icon: faTimesCircle,
            text: 'Tự chọn',
            variant: 'warning'
        };
    };

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

    if (error) {
        return (
            <MainLayout activeMenu="curriculum">
                <div className="container-fluid pt-3 pb-5">
                    <Alert variant="danger">
                        {error}
                    </Alert>
                    <Button variant="outline-primary" onClick={() => navigate('/admin/academic/program-curriculum')}>
                        <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                        Quay lại danh sách
                    </Button>
                </div>
            </MainLayout>
        );
    }

    if (isNotFound) {
        return (
            <MainLayout activeMenu="curriculum">
                <div className="container-fluid pt-3 pb-5">
                    <div className="text-center py-5">
                        <div className="mb-4">
                            <FontAwesomeIcon 
                                icon={faGraduationCap} 
                                size="5x" 
                                className="text-muted opacity-50" 
                            />
                        </div>
                        <h3 className="text-muted mb-3">Không Tìm Thấy Chương Trình Đào Tạo</h3>
                        <p className="text-muted mb-4">
                            Chương trình đào tạo với ID <code>#{id}</code> không tồn tại trong hệ thống.
                        </p>
                        <div className="d-flex gap-2 justify-content-center">
                            <Button 
                                variant="primary" 
                                onClick={() => navigate('/admin/academic/program-curriculum')}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                                Quay Lại Danh Sách
                            </Button>
                            <Button 
                                variant="outline-secondary" 
                                onClick={() => window.location.reload()}
                            >
                                <FontAwesomeIcon icon={faRefresh} className="me-1" />
                                Thử Lại
                            </Button>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const mandatoryCoursesCount = courses.filter(course => course.isMandatory).length;
    const electiveCoursesCount = courses.filter(course => !course.isMandatory).length;
    const totalCreditsCalculated = courses.reduce((sum, course) => 
        sum + (course.creditsTheory || 0) + (course.creditsPractical || 0), 0
    );

    return (
        <MainLayout activeMenu="curriculum">
            <div className="container-fluid pt-3 pb-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="h4 fw-bold text-dark">Chi Tiết Chương Trình Đào Tạo</h2>
                        <p className="text-muted mb-0">
                            Chương trình đào tạo cho ngành {programCurriculum.majorName}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-primary"
                            onClick={() => navigate('/admin/academic/program-curriculum')}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                            Quay lại
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => navigate(`/admin/academic/program-curriculum/edit/${programCurriculum.id}`)}
                        >
                            <FontAwesomeIcon icon={faEdit} className="me-1" />
                            Chỉnh sửa
                        </Button>
                    </div>
                </div>

                <Row>
                    {/* Major Information */}
                    <Col xs={12} className="mb-4">
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-light border-0">
                                <h5 className="mb-0 d-flex align-items-center">
                                    <FontAwesomeIcon icon={faGraduationCap} className="me-2 text-primary" />
                                    Thông Tin Ngành Học
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={8}>
                                        <div className="mb-3">
                                            <label className="form-label fw-medium text-secondary">Tên Ngành</label>
                                            <p className="form-control-plaintext fw-bold text-primary fs-5">
                                                {programCurriculum.majorName}
                                            </p>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-medium text-secondary">Mô Tả</label>
                                            <p className="form-control-plaintext">
                                                {programCurriculum.majorDescription || 'Chưa có mô tả'}
                                            </p>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-medium text-secondary">Khoa</label>
                                            <p className="form-control-plaintext fw-medium">
                                                {programCurriculum.departmentName || 'Chưa xác định'}
                                            </p>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <Card className="border-0 bg-primary text-white h-100">
                                            <Card.Body>
                                                <div className="text-center">
                                                    <div className="display-6 fw-bold mb-2">
                                                        {courses.length}
                                                    </div>
                                                    <small>Tổng Môn Học</small>
                                                </div>
                                                <hr className="my-3 border-light" />
                                                <div className="row text-center">
                                                    <div className="col-6">
                                                        <div className="h4 fw-bold">{mandatoryCoursesCount}</div>
                                                        <small>Bắt buộc</small>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="h4 fw-bold">{electiveCoursesCount}</div>
                                                        <small>Tự chọn</small>
                                                    </div>
                                                </div>
                                                <hr className="my-3 border-light" />
                                                <div className="text-center">
                                                    <div className="h4 fw-bold">{totalCreditsCalculated}</div>
                                                    <small>Tổng Tín Chỉ</small>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Courses Table */}
                <Row>
                    <Col xs={12}>
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-light border-0">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0 d-flex align-items-center">
                                        <FontAwesomeIcon icon={faBook} className="me-2 text-success" />
                                        Danh Sách Môn Học
                                    </h5>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={loadCurriculumCourses}
                                        disabled={coursesLoading}
                                    >
                                        <FontAwesomeIcon icon={faRefresh} className="me-1" />
                                        Làm Mới
                                    </Button>
                                </div>
                            </Card.Header>
                            <Card.Body className="p-0">
                                {/* Loading State */}
                                {coursesLoading && (
                                    <div className="text-center py-5">
                                        <Spinner animation="border" variant="primary" />
                                        <p className="mt-2 text-muted">Đang tải danh sách môn học...</p>
                                    </div>
                                )}

                                {/* Table Content */}
                                {!coursesLoading && (
                                    <>
                                        {courses.length > 0 ? (
                                            <div className="table-responsive">
                                                <Table hover className="mb-0">
                                                    <thead className="bg-light">
                                                        <tr>
                                                            <th scope="col" className="fw-medium text-muted">#</th>
                                                            <th scope="col" className="fw-medium text-muted">Mã MH</th>
                                                            <th scope="col" className="fw-medium text-muted">Tên Môn Học</th>
                                                            <th scope="col" className="fw-medium text-muted">Loại</th>
                                                            <th scope="col" className="fw-medium text-muted text-center">TC LT</th>
                                                            <th scope="col" className="fw-medium text-muted text-center">TC TH</th>
                                                            <th scope="col" className="fw-medium text-muted text-center">Tổng TC</th>
                                                            <th scope="col" className="fw-medium text-muted text-center">Bắt Buộc</th>
                                                            <th scope="col" className="fw-medium text-muted text-center">HK Đề Xuất</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {courses.map((course, index) => {
                                                            const totalCredits = (course.creditsTheory || 0) + (course.creditsPractical || 0);
                                                            const mandatoryStatus = getMandatoryStatus(course.isMandatory);
                                                            
                                                            return (
                                                                <tr key={course.id}>
                                                                    <td className="fw-medium text-muted">{index + 1}</td>
                                                                    <td>
                                                                        <code className="bg-light px-2 py-1 rounded small">
                                                                            {course.code}
                                                                        </code>
                                                                    </td>
                                                                    <td className="fw-medium">{course.name}</td>
                                                                    <td>
                                                                        <Badge bg={getCourseTypeBadgeVariant(course.courseType)}>
                                                                            <FontAwesomeIcon 
                                                                                icon={getCourseTypeIcon(course.courseType)} 
                                                                                className="me-1" 
                                                                            />
                                                                            {courseTypeDisplayMap[course.courseType] || course.courseType}
                                                                        </Badge>
                                                                    </td>
                                                                    <td className="text-center">{course.creditsTheory || 0}</td>
                                                                    <td className="text-center">{course.creditsPractical || 0}</td>
                                                                    <td className="text-center fw-medium">{totalCredits}</td>
                                                                    <td className="text-center">
                                                                        <Badge bg={mandatoryStatus.variant}>
                                                                            <FontAwesomeIcon 
                                                                                icon={mandatoryStatus.icon} 
                                                                                className="me-1" 
                                                                            />
                                                                            {mandatoryStatus.text}
                                                                        </Badge>
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <Badge bg="secondary">
                                                                            HK {course.semesterRecommended || 'N/A'}
                                                                        </Badge>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-5 text-muted">
                                                <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="mb-3 opacity-50" />
                                                <h5>Chưa có môn học nào</h5>
                                                <p>Chương trình đào tạo này chưa được cấu hình với các môn học.</p>
                                                <Button 
                                                    variant="primary" 
                                                    onClick={() => navigate(`/admin/academic/program-curriculum/edit/${programCurriculum.id}`)}
                                                >
                                                    <FontAwesomeIcon icon={faEdit} className="me-1" />
                                                    Thêm Môn Học
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Summary Statistics */}
                {courses.length > 0 && (
                    <Row className="mt-4">
                        <Col xs={12}>
                            <Card className="border-0 shadow-sm">
                                <Card.Header className="bg-light border-0">
                                    <h5 className="mb-0 d-flex align-items-center">
                                        <FontAwesomeIcon icon={faInfoCircle} className="me-2 text-info" />
                                        Thống Kê Tóm Tắt
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <Row className="text-center">
                                        <Col md={3}>
                                            <div className="border-end pe-3">
                                                <div className="display-6 fw-bold text-primary">{courses.length}</div>
                                                <small className="text-muted">Tổng Môn Học</small>
                                            </div>
                                        </Col>
                                        <Col md={3}>
                                            <div className="border-end pe-3">
                                                <div className="display-6 fw-bold text-success">{mandatoryCoursesCount}</div>
                                                <small className="text-muted">Môn Bắt Buộc</small>
                                            </div>
                                        </Col>
                                        <Col md={3}>
                                            <div className="border-end pe-3">
                                                <div className="display-6 fw-bold text-warning">{electiveCoursesCount}</div>
                                                <small className="text-muted">Môn Tự Chọn</small>
                                            </div>
                                        </Col>
                                        <Col md={3}>
                                            <div className="display-6 fw-bold text-info">{totalCreditsCalculated}</div>
                                            <small className="text-muted">Tổng Tín Chỉ</small>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </div>
        </MainLayout>
    );
};

export default ProgramCurriculumDetails; 