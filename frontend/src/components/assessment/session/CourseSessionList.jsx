import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Button, Alert, Spinner, Card, Badge, Accordion } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import MainLayout from '../../layout/main/MainLayout.jsx';
import { sessionService } from '../../../services/apiService.js';

const CourseSessionList = () => {
    const { courseOfferingId } = useParams();
    const navigate = useNavigate();
    
    // State management
    const [sessions, setSessions] = useState([]);
    const [groupedSessions, setGroupedSessions] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [courseInfo, setCourseInfo] = useState(null);

    // Load sessions data
    const loadSessions = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('📚 Loading sessions for course offering:', courseOfferingId);

            const response = await sessionService.getSessionsByOffering(courseOfferingId);

            if (response.result) {
                setSessions(response.result);
                
                // Extract course info from first session
                if (response.result.length > 0) {
                    const firstSession = response.result[0];
                    setCourseInfo({
                        courseName: firstSession.courseName,
                        courseCode: firstSession.courseCode,
                        semesterName: firstSession.semesterName
                    });
                }
                
                // Group sessions by teacher and semester
                groupSessionsData(response.result);
            } else {
                setSessions([]);
                setGroupedSessions({});
            }
        } catch (err) {
            setError('Không thể tải danh sách phiên học. Vui lòng thử lại.');
            console.error('Error loading sessions:', err);
            toast.error('Lỗi khi tải danh sách phiên học');
        } finally {
            setLoading(false);
        }
    };

    // Group sessions by teacher name, then by semester
    const groupSessionsData = (sessionsData) => {
        const grouped = {};
        
        sessionsData.forEach(session => {
            const teacherKey = session.teacherName || 'Unknown Teacher';
            const semesterKey = session.semesterName || 'Unknown Semester';
            
            if (!grouped[teacherKey]) {
                grouped[teacherKey] = {
                    teacherEmail: session.teacherEmail,
                    semesters: {}
                };
            }
            
            if (!grouped[teacherKey].semesters[semesterKey]) {
                grouped[teacherKey].semesters[semesterKey] = [];
            }
            
            grouped[teacherKey].semesters[semesterKey].push(session);
        });
        
        // Sort sessions within each group by session number
        Object.keys(grouped).forEach(teacherKey => {
            Object.keys(grouped[teacherKey].semesters).forEach(semesterKey => {
                grouped[teacherKey].semesters[semesterKey].sort((a, b) => 
                    (a.sessionNumber || 0) - (b.sessionNumber || 0)
                );
            });
        });
        
        setGroupedSessions(grouped);
    };

    // Load data on component mount
    useEffect(() => {
        if (courseOfferingId) {
            loadSessions();
        }
    }, [courseOfferingId]);

    // Handle navigation
    const handleBack = () => {
        navigate('/admin/assessment/sessions/summary');
    };

    const handleViewSession = (sessionId) => {
        navigate(`/admin/assessment/sessions/details/${sessionId}`);
    };

    const handleEditSession = (sessionId) => {
        navigate(`/admin/assessment/sessions/edit/${sessionId}`);
    };

    const handleCreateSession = () => {
        navigate(`/admin/assessment/sessions/create?courseOfferingId=${courseOfferingId}`);
    };

    const handleDeleteSession = async (sessionId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phiên học này?')) {
            try {
                await sessionService.deleteSession(sessionId);
                toast.success('Xóa phiên học thành công');
                loadSessions(); // Reload data
            } catch (error) {
                console.error('Error deleting session:', error);
                toast.error('Lỗi khi xóa phiên học');
            }
        }
    };

    // Format date time
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleString('vi-VN');
        } catch {
            return dateTimeString;
        }
    };

    return (
        <MainLayout>
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow">
                            <div className="card-header bg-primary text-white">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-0">
                                            <i className="fas fa-list me-2"></i>
                                            Danh Sách Phiên Học
                                        </h5>
                                        {courseInfo && (
                                            <small className="text-light">
                                                {courseInfo.courseCode} - {courseInfo.courseName} 
                                                ({courseInfo.semesterName})
                                            </small>
                                        )}
                                    </div>
                                    <div>
                                        <Button 
                                            variant="success" 
                                            size="sm" 
                                            className="me-2"
                                            onClick={handleCreateSession}
                                        >
                                            <i className="fas fa-plus me-1"></i>
                                            Thêm Phiên Học
                                        </Button>
                                        <Button 
                                            variant="light" 
                                            size="sm"
                                            onClick={handleBack}
                                        >
                                            <i className="fas fa-arrow-left me-1"></i>
                                            Quay Lại
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body">
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

                                {/* Grouped Sessions Display */}
                                {!loading && Object.keys(groupedSessions).length > 0 && (
                                    <Accordion defaultActiveKey="0">
                                        {Object.entries(groupedSessions).map(([teacherName, teacherData], teacherIndex) => (
                                            <Accordion.Item eventKey={teacherIndex.toString()} key={teacherName}>
                                                <Accordion.Header>
                                                    <div className="d-flex justify-content-between align-items-center w-100 me-3">
                                                        <div>
                                                            <strong>{teacherName}</strong>
                                                            {teacherData.teacherEmail && (
                                                                <small className="text-muted ms-2">
                                                                    ({teacherData.teacherEmail})
                                                                </small>
                                                            )}
                                                        </div>
                                                        <Badge bg="primary">
                                                            {Object.values(teacherData.semesters).reduce((total, sessions) => total + sessions.length, 0)} phiên học
                                                        </Badge>
                                                    </div>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    {Object.entries(teacherData.semesters).map(([semesterName, semesterSessions]) => (
                                                        <Card key={semesterName} className="mb-3">
                                                            <Card.Header className="bg-light">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <h6 className="mb-0">
                                                                        <i className="fas fa-calendar me-2"></i>
                                                                        {semesterName}
                                                                    </h6>
                                                                    <Badge bg="info">
                                                                        {semesterSessions.length} phiên học
                                                                    </Badge>
                                                                </div>
                                                            </Card.Header>
                                                            <Card.Body>
                                                                <div className="table-responsive">
                                                                    <Table striped bordered hover size="sm">
                                                                        <thead className="table-secondary">
                                                                            <tr>
                                                                                <th>Phiên</th>
                                                                                <th>Loại</th>
                                                                                <th>Thời Gian Bắt Đầu</th>
                                                                                <th>Thời Gian Kết Thúc</th>
                                                                                <th>Phòng Học</th>
                                                                                <th>Thao Tác</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {semesterSessions.map((session) => (
                                                                                <tr key={session.id}>
                                                                                    <td>
                                                                                        <Badge bg="secondary">
                                                                                            #{session.sessionNumber || 'N/A'}
                                                                                        </Badge>
                                                                                    </td>
                                                                                    <td>
                                                                                        <Badge 
                                                                                            bg={session.sessionType === 'Tiết học lý thuyết' ? 'primary' : 
                                                                                                session.sessionType === 'Tiết học thực hành' ? 'warning' : 'danger'}
                                                                                        >
                                                                                            {session.sessionType || 'N/A'}
                                                                                        </Badge>
                                                                                    </td>
                                                                                    <td>{formatDateTime(session.startTime)}</td>
                                                                                    <td>{formatDateTime(session.endTime)}</td>
                                                                                    <td>
                                                                                        <div>
                                                                                            <strong>{session.classroomName || 'N/A'}</strong>
                                                                                            {session.classroomType && (
                                                                                                <div className="text-muted small">
                                                                                                    {session.classroomType}
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="btn-group" role="group">
                                                                                            <Button
                                                                                                variant="outline-primary"
                                                                                                size="sm"
                                                                                                onClick={() => handleViewSession(session.id)}
                                                                                                title="Xem chi tiết"
                                                                                            >
                                                                                                <i className="fas fa-eye"></i>
                                                                                            </Button>
                                                                                            <Button
                                                                                                variant="outline-warning"
                                                                                                size="sm"
                                                                                                onClick={() => handleEditSession(session.id)}
                                                                                                title="Chỉnh sửa"
                                                                                            >
                                                                                                <i className="fas fa-edit"></i>
                                                                                            </Button>
                                                                                            <Button
                                                                                                variant="outline-danger"
                                                                                                size="sm"
                                                                                                onClick={() => handleDeleteSession(session.id)}
                                                                                                title="Xóa"
                                                                                            >
                                                                                                <i className="fas fa-trash"></i>
                                                                                            </Button>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </Table>
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    ))}
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        ))}
                                    </Accordion>
                                )}

                                {/* No Data Message */}
                                {!loading && Object.keys(groupedSessions).length === 0 && (
                                    <div className="text-center py-5">
                                        <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                                        <h5 className="text-muted">Chưa có phiên học nào</h5>
                                        <p className="text-muted">Nhấn "Thêm Phiên Học" để tạo phiên học đầu tiên.</p>
                                        <Button 
                                            variant="primary" 
                                            onClick={handleCreateSession}
                                        >
                                            <i className="fas fa-plus me-2"></i>
                                            Thêm Phiên Học Đầu Tiên
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default CourseSessionList;
