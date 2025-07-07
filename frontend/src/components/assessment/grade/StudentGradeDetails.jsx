import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEdit,
  faTrash,
  faPlus,
  faBook,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import gradeService from "../../../services/gradeService";
import toast from "react-hot-toast";
import MainLayout from "../../layout/main/MainLayout.jsx";

const StudentGradeDetails = () => {
  const { courseRegistrationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [gradeToDelete, setGradeToDelete] = useState(null);

  // Get student and course info from navigation state
  const { studentInfo, courseInfo } = location.state || {};

  useEffect(() => {
    fetchGrades();
  }, [courseRegistrationId]);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const response = await gradeService.getGradesByCourseRegistrationId(
        courseRegistrationId
      );
      setGrades(response);
    } catch (error) {
      console.error("Error fetching grades:", error);
      toast.error("Không thể tải danh sách điểm");
    } finally {
      setLoading(false);
    }
  };

  const handleEditGrade = (grade) => {
    navigate(
      `/admin/assessment/grade/course-registration/${courseRegistrationId}/update`,
      {
        state: {
          studentInfo,
          courseInfo,
          gradeToEdit: grade,
          isCreate: false,
        },
      }
    );
  };

  const handleAddGrade = () => {
    navigate(
      `/admin/assessment/grade/course-registration/${courseRegistrationId}/update`,
      {
        state: {
          studentInfo,
          courseInfo,
          isCreate: true,
        },
      }
    );
  };

  const handleDeleteGrade = async () => {
    try {
      await gradeService.deleteGrade(gradeToDelete.id);
      toast.success("Xóa điểm thành công");
      setShowDeleteModal(false);
      setGradeToDelete(null);
      fetchGrades(); // Refresh the list
    } catch (error) {
      console.error("Error deleting grade:", error);
      toast.error("Không thể xóa điểm");
    }
  };

  const getGradeTypeDisplay = (gradeType) => {
    const gradeTypeMap = {
      MIDTERM: "Giữa kỳ",
      FINAL: "Cuối kỳ",
      QUIZ: "Kiểm tra",
      ASSIGNMENT: "Bài tập",
    };
    return gradeTypeMap[gradeType] || gradeType;
  };

  const getGradeColor = (gradeValue) => {
    if (gradeValue >= 8.5) return "success";
    if (gradeValue >= 7.0) return "info";
    if (gradeValue >= 5.5) return "warning";
    return "danger";
  };

  const calculateAverageGrade = () => {
    if (!grades || grades.length === 0) return null;
    const total = grades.reduce((sum, grade) => sum + grade.gradeValue, 0);
    return (total / grades.length).toFixed(2);
  };

  const goBack = () => {
    if (studentInfo) {
      navigate(
        `/admin/assessment/grade/student/${studentInfo.studentId}/grades`,
        {
          state: {
            studentName: studentInfo.studentName,
            studentCode: studentInfo.studentCode,
            studentEmail: studentInfo.studentEmail,
          },
        }
      );
    } else {
      navigate("/admin/assessment/grade/students");
    }
  };

  if (loading) {
    return (
      <MainLayout activeMenu="assessment">
        <div className="container-fluid pt-3 pb-5">
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Đang tải chi tiết điểm...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout activeMenu="assessment">
      <div className="container-fluid pt-3 pb-5">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h4 fw-bold text-dark">Chi Tiết Điểm Môn Học</h2>
            <p className="text-muted mb-0">
              Quản lý điểm chi tiết cho môn {courseInfo?.courseCode} -{" "}
              {courseInfo?.courseName}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" onClick={goBack}>
              <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
              Quay lại
            </Button>
            <Button variant="primary" onClick={handleAddGrade}>
              <FontAwesomeIcon icon={faPlus} className="me-1" />
              Thêm điểm
            </Button>
          </div>
        </div>

        {/* Student & Course Info Card */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Header className="bg-light border-0">
            <h5 className="mb-0 d-flex align-items-center">
              <FontAwesomeIcon icon={faBook} className="me-2 text-primary" />
              Thông Tin Chi Tiết
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h6 className="text-muted mb-1">Thông tin sinh viên</h6>
                <p className="mb-1">
                  <strong>Họ tên:</strong> {studentInfo?.studentName || "N/A"}
                </p>
                <p className="mb-1">
                  <strong>Mã SV:</strong> {studentInfo?.studentCode || "N/A"}
                </p>
                <p className="mb-0">
                  <strong>Email:</strong> {studentInfo?.studentEmail || "N/A"}
                </p>
              </Col>
              <Col md={6}>
                <h6 className="text-muted mb-1">Thông tin môn học</h6>
                <p className="mb-1">
                  <strong>Mã môn:</strong> {courseInfo?.courseCode || "N/A"}
                </p>
                <p className="mb-1">
                  <strong>Tên môn:</strong> {courseInfo?.courseName || "N/A"}
                </p>
                <p className="mb-0">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                  <strong>Học kỳ:</strong> {courseInfo?.semesterName || "N/A"}
                </p>
              </Col>
            </Row>
            {grades.length > 0 && (
              <Row className="mt-3">
                <Col>
                  <Badge
                    bg={getGradeColor(calculateAverageGrade())}
                    className="fs-6"
                  >
                    Điểm trung bình: {calculateAverageGrade()}
                  </Badge>
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>

        {/* Grades Table */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-light border-0">
            <h5 className="mb-0 d-flex align-items-center">
              <FontAwesomeIcon icon={faBook} className="me-2 text-primary" />
              Danh Sách Điểm
            </h5>
          </Card.Header>
          <Card.Body>
            {grades.length === 0 ? (
              <Alert variant="info">
                <FontAwesomeIcon icon={faBook} className="me-2" />
                Chưa có điểm nào cho môn học này
              </Alert>
            ) : (
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="fw-medium text-muted">
                        #
                      </th>
                      <th scope="col" className="fw-medium text-muted">
                        Loại điểm
                      </th>
                      <th
                        scope="col"
                        className="fw-medium text-muted text-center"
                      >
                        Điểm số
                      </th>
                      <th
                        scope="col"
                        className="fw-medium text-muted text-center"
                      >
                        Đánh giá
                      </th>
                      <th
                        scope="col"
                        className="fw-medium text-muted text-center"
                      >
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((grade, index) => (
                      <tr key={grade.id}>
                        <td className="fw-medium text-muted">{index + 1}</td>
                        <td>{getGradeTypeDisplay(grade.gradeType)}</td>
                        <td className="text-center">
                          <Badge
                            bg={getGradeColor(grade.gradeValue)}
                            className="fs-6"
                          >
                            {grade.gradeValue}
                          </Badge>
                        </td>
                        <td className="text-center">
                          {grade.gradeValue >= 8.5
                            ? "Xuất sắc"
                            : grade.gradeValue >= 7.0
                            ? "Khá"
                            : grade.gradeValue >= 5.5
                            ? "Trung bình"
                            : "Yếu"}
                        </td>
                        <td className="text-center">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEditGrade(grade)}
                            className="me-1"
                            title="Chỉnh sửa"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => {
                              setGradeToDelete(grade);
                              setShowDeleteModal(true);
                            }}
                            title="Xóa"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Bạn có chắc chắn muốn xóa điểm{" "}
            {getGradeTypeDisplay(gradeToDelete?.gradeType)}
            với số điểm {gradeToDelete?.gradeValue}?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDeleteGrade}>
              Xóa
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default StudentGradeDetails;
