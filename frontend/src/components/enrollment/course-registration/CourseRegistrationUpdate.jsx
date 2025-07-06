import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Card, Row, Col, Form, Button, Spinner, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faSave,
  faEdit,
  faPlus,
  faUserGraduate,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import courseRegistrationService from "../../../services/courseRegistrationService.js";
import courseOfferingService from "../../../services/courseOfferingService.js";
import userService from "../../../services/userService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

const CourseRegistrationUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = !!id;
  const preselectedCourseOfferingId = searchParams.get("courseOfferingId");

  // State management
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Dropdown data states
  const [courseOfferings, setCourseOfferings] = useState([]);
  const [students, setStudents] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  // Form data state
  const [formData, setFormData] = useState({
    id: null,
    studentId: "",
    courseOfferingId: preselectedCourseOfferingId || "",
    courseRegistrationStatus: "REGISTERED",
    registrationDate: new Date().toISOString().slice(0, 16), // Format for datetime-local input
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({});

  // Load dropdown data
  const loadDropdownData = async () => {
    try {
      setLoadingDropdowns(true);

      // Load course offerings
      const courseOfferingsResponse =
        await courseOfferingService.getAllCourseOfferings();
      if (courseOfferingsResponse?.result) {
        setCourseOfferings(courseOfferingsResponse.result);
      }

      // Load students (this would need a proper endpoint in the backend)
      try {
        const studentsResponse = await userService.getAllUsers({
          role: "STUDENT",
        });
        if (studentsResponse?.result) {
          // Filter only students
          const studentUsers = studentsResponse.result.filter(
            (user) => user.role?.title === "STUDENT" || user.student
          );
          setStudents(studentUsers);
        }
      } catch (err) {
        console.warn("Could not load students:", err);
        // Continue without students data
      }
    } catch (err) {
      console.error("Error loading dropdown data:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoadingDropdowns(false);
    }
  };

  // Load existing registration data for edit mode
  const loadRegistrationData = async () => {
    if (!isEditMode) return;

    try {
      setLoading(true);
      const response = await courseRegistrationService.getRegistrationById(id);

      if (response?.result) {
        const registration = response.result;
        setFormData({
          id: registration.id,
          studentId: registration.studentId || "",
          courseOfferingId: registration.courseOfferingId || "",
          courseRegistrationStatus:
            registration.courseRegistrationStatus || "REGISTERED",
          registrationDate: registration.registrationDate
            ? new Date(registration.registrationDate).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),
        });
      }
    } catch (err) {
      console.error("Error loading registration data:", err);
      setError("Không thể tải thông tin đăng ký. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadDropdownData();
    loadRegistrationData();
  }, [id]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.studentId) {
      errors.studentId = "Vui lòng chọn sinh viên";
    }

    if (!formData.courseOfferingId) {
      errors.courseOfferingId = "Vui lòng chọn khóa học";
    }

    if (!formData.courseRegistrationStatus) {
      errors.courseRegistrationStatus = "Vui lòng chọn trạng thái";
    }

    if (!formData.registrationDate) {
      errors.registrationDate = "Vui lòng chọn ngày đăng ký";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    try {
      setSaving(true);

      const submitData = {
        ...formData,
        registrationDate: new Date(formData.registrationDate).toISOString(),
      };

      let response;
      if (isEditMode) {
        response = await courseRegistrationService.updateRegistration(
          submitData
        );
        toast.success("Cập nhật đăng ký thành công");
      } else {
        response = await courseRegistrationService.createRegistration(
          submitData
        );
        toast.success("Tạo đăng ký mới thành công");
      }

      // Navigate back to appropriate page
      if (preselectedCourseOfferingId) {
        navigate(
          `/admin/enrollment/course-registrations/course-offering/${preselectedCourseOfferingId}`
        );
      } else {
        navigate("/admin/enrollment/course-registrations");
      }
    } catch (err) {
      console.error("Error saving registration:", err);
      toast.error(
        isEditMode ? "Lỗi khi cập nhật đăng ký" : "Lỗi khi tạo đăng ký"
      );
    } finally {
      setSaving(false);
    }
  };

  // Get selected course offering details
  const getSelectedCourseOffering = () => {
    return courseOfferings.find(
      (co) => co.id === parseInt(formData.courseOfferingId)
    );
  };

  // Get selected student details
  const getSelectedStudent = () => {
    return students.find((s) => s.id === parseInt(formData.studentId));
  };

  if (loadingDropdowns) {
    return (
      <MainLayout activeMenu="course-registrations">
        <div className="container-fluid pt-3 pb-5">
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout activeMenu="course-registrations">
      <div className="container-fluid pt-3 pb-5">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h4 fw-bold text-dark">
              {isEditMode ? "Chỉnh Sửa Đăng Ký" : "Thêm Đăng Ký Mới"}
            </h2>
            <p className="text-muted mb-0">
              {isEditMode
                ? `Cập nhật thông tin đăng ký #${id}`
                : "Tạo đăng ký khóa học mới trong hệ thống"}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              onClick={() => {
                if (preselectedCourseOfferingId) {
                  navigate(
                    `/admin/enrollment/course-registrations/course-offering/${preselectedCourseOfferingId}`
                  );
                } else {
                  navigate("/admin/enrollment/course-registrations");
                }
              }}
              disabled={saving}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
              Quay lại
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Row>
          <Col lg={10} className="mx-auto">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light border-0">
                <h5 className="mb-0 d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={isEditMode ? faEdit : faPlus}
                    className="me-2 text-primary"
                  />
                  Thông Tin Đăng Ký
                </h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    {/* Student Selection */}
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-medium">
                          <FontAwesomeIcon
                            icon={faUserGraduate}
                            className="me-2"
                          />
                          Sinh Viên <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={formData.studentId}
                          onChange={(e) =>
                            handleInputChange("studentId", e.target.value)
                          }
                          isInvalid={!!formErrors.studentId}
                          disabled={saving}
                        >
                          <option value="">-- Chọn sinh viên --</option>
                          {students.map((student) => (
                            <option key={student.id} value={student.id}>
                              {student.fullName} ({student.email})
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {formErrors.studentId}
                        </Form.Control.Feedback>
                        {getSelectedStudent() && (
                          <Form.Text className="text-muted">
                            Đã chọn: {getSelectedStudent().fullName} -{" "}
                            {getSelectedStudent().email}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>

                    {/* Course Offering Selection */}
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-medium">
                          <FontAwesomeIcon
                            icon={faGraduationCap}
                            className="me-2"
                          />
                          Khóa Học <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={formData.courseOfferingId}
                          onChange={(e) =>
                            handleInputChange(
                              "courseOfferingId",
                              e.target.value
                            )
                          }
                          isInvalid={!!formErrors.courseOfferingId}
                          disabled={saving || !!preselectedCourseOfferingId}
                        >
                          <option value="">-- Chọn khóa học --</option>
                          {courseOfferings.map((courseOffering) => (
                            <option
                              key={courseOffering.id}
                              value={courseOffering.id}
                            >
                              {courseOffering.courseResponse?.name} -{" "}
                              {courseOffering.semesterResponse?.name}
                              {courseOffering.teacherResponse?.fullName &&
                                ` (${courseOffering.teacherResponse.fullName})`}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {formErrors.courseOfferingId}
                        </Form.Control.Feedback>
                        {getSelectedCourseOffering() && (
                          <Form.Text className="text-muted">
                            Đã chọn:{" "}
                            {getSelectedCourseOffering().courseResponse?.name} -
                            {getSelectedCourseOffering().semesterResponse?.name}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>

                    {/* Registration Status */}
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-medium">
                          Trạng Thái <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={formData.courseRegistrationStatus}
                          onChange={(e) =>
                            handleInputChange(
                              "courseRegistrationStatus",
                              e.target.value
                            )
                          }
                          isInvalid={!!formErrors.courseRegistrationStatus}
                          disabled={saving}
                        >
                          <option value="REGISTERED">Đã Đăng Ký</option>
                          <option value="PENDING">Chờ Duyệt</option>
                          <option value="CANCELLED">Đã Hủy</option>
                          <option value="COMPLETED">Hoàn Thành</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {formErrors.courseRegistrationStatus}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Registration Date */}
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-medium">
                          Ngày Đăng Ký <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={formData.registrationDate}
                          onChange={(e) =>
                            handleInputChange(
                              "registrationDate",
                              e.target.value
                            )
                          }
                          isInvalid={!!formErrors.registrationDate}
                          disabled={saving}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.registrationDate}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Course Offering Details */}
                  {getSelectedCourseOffering() && (
                    <Row className="mt-4">
                      <Col>
                        <div className="bg-light rounded p-3">
                          <h6 className="fw-medium mb-3">Chi Tiết Khóa Học</h6>
                          <Row>
                            <Col md={3}>
                              <small className="text-muted">Mã môn học:</small>
                              <div className="fw-medium">
                                {getSelectedCourseOffering().courseResponse
                                  ?.code || "N/A"}
                              </div>
                            </Col>
                            <Col md={3}>
                              <small className="text-muted">
                                Sĩ số tối đa:
                              </small>
                              <div className="fw-medium">
                                {getSelectedCourseOffering().maxStudents || 0}
                              </div>
                            </Col>
                            <Col md={3}>
                              <small className="text-muted">Đã đăng ký:</small>
                              <div className="fw-medium">
                                {getSelectedCourseOffering().currentStudents ||
                                  0}
                              </div>
                            </Col>
                            <Col md={3}>
                              <small className="text-muted">Còn lại:</small>
                              <div className="fw-medium">
                                {Math.max(
                                  0,
                                  (getSelectedCourseOffering().maxStudents ||
                                    0) -
                                    (getSelectedCourseOffering()
                                      .currentStudents || 0)
                                )}
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  )}

                  {/* Submit Buttons */}
                  <Row className="mt-4">
                    <Col>
                      <div className="d-flex gap-2 justify-content-end">
                        <Button
                          variant="outline-secondary"
                          onClick={() => {
                            if (preselectedCourseOfferingId) {
                              navigate(
                                `/admin/enrollment/course-registrations/course-offering/${preselectedCourseOfferingId}`
                              );
                            } else {
                              navigate(
                                "/admin/enrollment/course-registrations"
                              );
                            }
                          }}
                          disabled={saving}
                        >
                          Hủy
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <Spinner
                                animation="border"
                                size="sm"
                                className="me-2"
                              />
                              {isEditMode ? "Đang cập nhật..." : "Đang tạo..."}
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faSave} className="me-2" />
                              {isEditMode ? "Cập nhật" : "Tạo mới"}
                            </>
                          )}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default CourseRegistrationUpdate;
