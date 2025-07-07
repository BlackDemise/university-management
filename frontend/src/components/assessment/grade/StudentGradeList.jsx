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
  Accordion,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBook,
  faPlus,
  faEdit,
  faGraduationCap,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import gradeService from "../../../services/gradeService";
import toast from "react-hot-toast";
import MainLayout from "../../layout/main/MainLayout.jsx";

const StudentGradeList = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [gradeDetails, setGradeDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get student info from navigation state
  const studentInfo = location.state || {};

  useEffect(() => {
    fetchStudentGrades();
  }, [studentId]);

  const fetchStudentGrades = async () => {
    try {
      setLoading(true);
      const response = await gradeService.getStudentGradeDetails(studentId);
      setGradeDetails(response);
    } catch (error) {
      console.error("Error fetching student grades:", error);
      toast.error("Không thể tải điểm của sinh viên");
    } finally {
      setLoading(false);
    }
  };

  const handleViewGradeDetails = (courseRegistrationId, courseInfo) => {
    navigate(
      `/admin/assessment/grade/course-registration/${courseRegistrationId}/details`,
      {
        state: {
          studentInfo: gradeDetails,
          courseInfo,
        },
      }
    );
  };

  const handleAddGrade = (courseRegistrationId, courseInfo) => {
    navigate(
      `/admin/assessment/grade/course-registration/${courseRegistrationId}/update`,
      {
        state: {
          studentInfo: gradeDetails,
          courseInfo,
          isCreate: true,
        },
      }
    );
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

  const calculateAverageGrade = (grades) => {
    if (!grades || grades.length === 0) return null;
    const total = grades.reduce((sum, grade) => sum + grade.gradeValue, 0);
    return (total / grades.length).toFixed(2);
  };

  if (loading) {
    return (
      <MainLayout activeMenu="assessment">
        <div className="container-fluid pt-3 pb-5">
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Đang tải điểm của sinh viên...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!gradeDetails) {
    return (
      <MainLayout activeMenu="assessment">
        <div className="container-fluid pt-3 pb-5">
          <Alert variant="danger">
            Không thể tải thông tin điểm của sinh viên
          </Alert>
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
            <h2 className="h4 fw-bold text-dark">Điểm Sinh Viên</h2>
            <p className="text-muted mb-0">
              Xem chi tiết điểm của sinh viên {gradeDetails?.studentName}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              onClick={() => navigate("/admin/assessment/grade/students")}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
              Quay lại
            </Button>
          </div>
        </div>

        {/* Student Info Card */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Header className="bg-light border-0">
            <h5 className="mb-0 d-flex align-items-center">
              <FontAwesomeIcon
                icon={faGraduationCap}
                className="me-2 text-primary"
              />
              Thông Tin Sinh Viên
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p className="mb-1">
                  <strong>Họ tên:</strong> {gradeDetails.studentName}
                </p>
                <p className="mb-1">
                  <strong>Mã SV:</strong> {gradeDetails.studentCode}
                </p>
                <p className="mb-0">
                  <strong>Email:</strong> {gradeDetails.studentEmail}
                </p>
              </Col>
              <Col md={6} className="text-md-end">
                <Badge bg="info" className="fs-6">
                  Tổng số môn học:{" "}
                  {Object.keys(gradeDetails.gradesByCourse || {}).length}
                </Badge>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Grades by Course */}
        {Object.keys(gradeDetails.gradesByCourse || {}).length === 0 ? (
          <Alert variant="info">
            <FontAwesomeIcon icon={faBook} className="me-2" />
            Sinh viên chưa có điểm nào được ghi nhận
          </Alert>
        ) : (
          <Accordion defaultActiveKey="0">
            {Object.entries(gradeDetails.gradesByCourse).map(
              ([courseKey, courseGrades], index) => (
                <Accordion.Item eventKey={index.toString()} key={courseKey}>
                  <Accordion.Header>
                    <div className="w-100 d-flex justify-content-between align-items-center me-3">
                      <div>
                        <FontAwesomeIcon
                          icon={faBook}
                          className="me-2 text-primary"
                        />
                        <strong>{courseGrades.courseCode}</strong> -{" "}
                        {courseGrades.courseName}
                      </div>
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="me-1 text-muted"
                        />
                        <small className="text-muted me-3">
                          {courseGrades.semesterName}
                        </small>
                        {courseGrades.grades &&
                          courseGrades.grades.length > 0 && (
                            <Badge
                              bg={getGradeColor(
                                calculateAverageGrade(courseGrades.grades)
                              )}
                            >
                              TB: {calculateAverageGrade(courseGrades.grades)}
                            </Badge>
                          )}
                      </div>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row className="mb-3">
                      <Col>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() =>
                            handleViewGradeDetails(
                              courseGrades.courseRegistrationId,
                              courseGrades
                            )
                          }
                          className="me-2"
                        >
                          <FontAwesomeIcon icon={faEdit} className="me-1" />
                          Chi tiết
                        </Button>
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() =>
                            handleAddGrade(
                              courseGrades.courseRegistrationId,
                              courseGrades
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faPlus} className="me-1" />
                          Thêm điểm
                        </Button>
                      </Col>
                    </Row>

                    {courseGrades.grades && courseGrades.grades.length > 0 ? (
                      <Table size="sm" className="mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th>Loại điểm</th>
                            <th className="text-center">Điểm số</th>
                            <th className="text-center">Đánh giá</th>
                          </tr>
                        </thead>
                        <tbody>
                          {courseGrades.grades.map((grade) => (
                            <tr key={grade.id}>
                              <td>{getGradeTypeDisplay(grade.gradeType)}</td>
                              <td className="text-center">
                                <Badge bg={getGradeColor(grade.gradeValue)}>
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
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <Alert variant="light" className="mb-0">
                        <small className="text-muted">
                          Chưa có điểm nào cho môn học này
                        </small>
                      </Alert>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              )
            )}
          </Accordion>
        )}
      </div>
    </MainLayout>
  );
};

export default StudentGradeList;
