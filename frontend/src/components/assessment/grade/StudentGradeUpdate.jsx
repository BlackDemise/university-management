import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faSave,
  faBook,
  faCalendarAlt,
  faEdit,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import gradeService from "../../../services/gradeService";
import toast from "react-hot-toast";
import MainLayout from "../../layout/main/MainLayout.jsx";

const StudentGradeUpdate = () => {
  const { courseRegistrationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    gradeType: "",
    gradeValue: "",
    courseRegistrationId: courseRegistrationId,
  });
  const [errors, setErrors] = useState({});

  // Get data from navigation state
  const { studentInfo, courseInfo, gradeToEdit, isCreate } =
    location.state || {};

  useEffect(() => {
    if (gradeToEdit && !isCreate) {
      setFormData({
        id: gradeToEdit.id,
        gradeType: gradeToEdit.gradeType,
        gradeValue: gradeToEdit.gradeValue,
        courseRegistrationId: courseRegistrationId,
      });
    }
  }, [gradeToEdit, isCreate, courseRegistrationId]);

  const gradeTypes = [
    { value: "MIDTERM", label: "Giữa kỳ" },
    { value: "FINAL", label: "Cuối kỳ" },
    { value: "QUIZ", label: "Kiểm tra" },
    { value: "ASSIGNMENT", label: "Bài tập" },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.gradeType) {
      newErrors.gradeType = "Vui lòng chọn loại điểm";
    }

    if (!formData.gradeValue) {
      newErrors.gradeValue = "Vui lòng nhập điểm số";
    } else {
      const gradeValue = parseFloat(formData.gradeValue);
      if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 10) {
        newErrors.gradeValue = "Điểm số phải từ 0 đến 10";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const gradeData = {
        ...formData,
        gradeValue: parseFloat(formData.gradeValue),
      };

      await gradeService.saveGrade(gradeData);

      toast.success(
        isCreate ? "Thêm điểm thành công" : "Cập nhật điểm thành công"
      );

      // Navigate back to grade details
      navigate(
        `/admin/assessment/grade/course-registration/${courseRegistrationId}/details`,
        {
          state: {
            studentInfo,
            courseInfo,
          },
        }
      );
    } catch (error) {
      console.error("Error saving grade:", error);
      toast.error(isCreate ? "Không thể thêm điểm" : "Không thể cập nhật điểm");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate(
      `/admin/assessment/grade/course-registration/${courseRegistrationId}/details`,
      {
        state: {
          studentInfo,
          courseInfo,
        },
      }
    );
  };

  const getGradePreview = () => {
    const gradeValue = parseFloat(formData.gradeValue);
    if (isNaN(gradeValue)) return "";

    if (gradeValue >= 8.5) return "Xuất sắc";
    if (gradeValue >= 7.0) return "Khá";
    if (gradeValue >= 5.5) return "Trung bình";
    return "Yếu";
  };

  return (
    <MainLayout activeMenu="assessment">
      <div className="container-fluid pt-3 pb-5">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h4 fw-bold text-dark">
              {isCreate ? "Thêm Điểm Mới" : "Chỉnh Sửa Điểm"}
            </h2>
            <p className="text-muted mb-0">
              {isCreate
                ? `Thêm điểm mới cho môn ${courseInfo?.courseCode} - ${courseInfo?.courseName}`
                : `Cập nhật điểm cho môn ${courseInfo?.courseCode} - ${courseInfo?.courseName}`}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              onClick={goBack}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
              Quay lại
            </Button>
          </div>
        </div>

        <Row className="justify-content-center">
          <Col lg={8}>
            {/* Student & Course Info Card */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-light border-0">
                <h5 className="mb-0 d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={faBook}
                    className="me-2 text-primary"
                  />
                  Thông Tin Chi Tiết
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h6 className="text-muted mb-1">Thông tin sinh viên</h6>
                    <p className="mb-1">
                      <strong>Họ tên:</strong>{" "}
                      {studentInfo?.studentName || "N/A"}
                    </p>
                    <p className="mb-1">
                      <strong>Mã SV:</strong>{" "}
                      {studentInfo?.studentCode || "N/A"}
                    </p>
                    <p className="mb-0">
                      <strong>Email:</strong>{" "}
                      {studentInfo?.studentEmail || "N/A"}
                    </p>
                  </Col>
                  <Col md={6}>
                    <h6 className="text-muted mb-1">Thông tin môn học</h6>
                    <p className="mb-1">
                      <strong>Mã môn:</strong> {courseInfo?.courseCode || "N/A"}
                    </p>
                    <p className="mb-1">
                      <strong>Tên môn:</strong>{" "}
                      {courseInfo?.courseName || "N/A"}
                    </p>
                    <p className="mb-0">
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                      <strong>Học kỳ:</strong>{" "}
                      {courseInfo?.semesterName || "N/A"}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Form */}
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light border-0">
                <h5 className="mb-0 d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={isCreate ? faPlus : faEdit}
                    className="me-2 text-primary"
                  />
                  {isCreate ? "Thông tin điểm mới" : "Chỉnh sửa thông tin điểm"}
                </h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Loại điểm <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="gradeType"
                          value={formData.gradeType}
                          onChange={handleInputChange}
                          isInvalid={!!errors.gradeType}
                        >
                          <option value="">Chọn loại điểm</option>
                          {gradeTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.gradeType}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Điểm số <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          name="gradeValue"
                          value={formData.gradeValue}
                          onChange={handleInputChange}
                          placeholder="Nhập điểm từ 0 đến 10"
                          isInvalid={!!errors.gradeValue}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.gradeValue}
                        </Form.Control.Feedback>
                        {formData.gradeValue && !errors.gradeValue && (
                          <Form.Text className="text-muted">
                            Đánh giá: <strong>{getGradePreview()}</strong>
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Grade Scale Reference */}
                  <Alert variant="info" className="mb-4">
                    <strong>Thang điểm:</strong>
                    <ul className="mb-0 mt-2">
                      <li>8.5 - 10: Xuất sắc</li>
                      <li>7.0 - 8.4: Khá</li>
                      <li>5.5 - 6.9: Trung bình</li>
                      <li>0 - 5.4: Yếu</li>
                    </ul>
                  </Alert>

                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="outline-secondary"
                      onClick={goBack}
                      disabled={loading}
                    >
                      Hủy
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            className="me-2"
                          />
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSave} className="me-1" />
                          {isCreate ? "Thêm điểm" : "Cập nhật"}
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default StudentGradeUpdate;
