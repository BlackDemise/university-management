import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Form, Button, Spinner, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faArrowLeft,
  faSave,
  faEdit,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import departmentService from "../../../services/departmentService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

const DepartmentUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // State management
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    id: null,
    name: "",
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({});

  // Load department data for edit mode
  const loadDepartmentData = async () => {
    if (!isEditMode) return;

    try {
      setLoading(true);
      setError(null);

      const response = await departmentService.getDepartmentById(id);
      const department = response.result || response;

      // Map department data to form
      setFormData({
        id: department.id,
        name: department.name || "",
      });
    } catch (err) {
      setError("Không thể tải thông tin khoa/phòng ban. Vui lòng thử lại.");
      console.error("Error loading department data:", err);
      toast.error("Lỗi khi tải thông tin khoa/phòng ban");
    } finally {
      setLoading(false);
    }
  };

  // Initialize component
  useEffect(() => {
    if (isEditMode) {
      loadDepartmentData();
    }
  }, [id]);

  // Process server-side validation errors
  const processServerErrors = (error) => {
    console.error("Server error:", error);

    if (error.response && error.response.status === 400) {
      const errorData = error.response.data;

      // Check if server returned field-specific errors
      if (errorData.result && typeof errorData.result === "object") {
        // Server returned field-specific errors
        setFormErrors(errorData.result);
        toast.error(
          errorData.message || "Vui lòng kiểm tra lại thông tin đã nhập"
        );
        return true; // Indicates field-specific errors were handled
      }
    }

    return false; // Indicates generic error handling should proceed
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear both client-side AND server-side field errors when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    // Required fields
    if (!formData.name.trim()) {
      errors.name = "Tên khoa/phòng ban là bắt buộc";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Tên khoa/phòng ban phải có ít nhất 2 ký tự";
    } else if (formData.name.trim().length > 255) {
      errors.name = "Tên khoa/phòng ban không được vượt quá 255 ký tự";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous server errors before validation
    setFormErrors({});

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin đã nhập");
      return;
    }

    try {
      setSaving(true);

      // Prepare request data
      const requestData = {
        id: isEditMode ? formData.id : null,
        name: formData.name.trim(),
      };

      await departmentService.saveDepartment(requestData);

      const successMessage = isEditMode
        ? "Cập nhật thông tin khoa/phòng ban thành công"
        : "Tạo khoa/phòng ban mới thành công";

      toast.success(successMessage);
      navigate("/admin/academic/departments");
    } catch (err) {
      // Try to process server-side validation errors first
      const handledAsFieldErrors = processServerErrors(err);

      if (!handledAsFieldErrors) {
        // Fall back to generic error handling
        const errorMessage = isEditMode
          ? "Lỗi khi cập nhật khoa/phòng ban"
          : "Lỗi khi tạo khoa/phòng ban";

        toast.error(errorMessage);
        console.error("Error saving department:", err);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout activeMenu="academic">
        <div className="container-fluid pt-3 pb-5">
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Đang tải thông tin...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout activeMenu="academic">
      <div className="container-fluid pt-3 pb-5">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h4 fw-bold text-dark">
              {isEditMode
                ? "Chỉnh Sửa Khoa/Phòng Ban"
                : "Thêm Khoa/Phòng Ban Mới"}
            </h2>
            <p className="text-muted mb-0">
              {isEditMode
                ? `Cập nhật thông tin khoa/phòng ban #${id}`
                : "Tạo khoa/phòng ban mới trong hệ thống"}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              onClick={() => navigate("/admin/academic/departments")}
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

        <Row>
          <Col lg={8} className="mx-auto">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light border-0">
                <h5 className="mb-0 d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={isEditMode ? faEdit : faPlus}
                    className="me-2 text-primary"
                  />
                  Thông Tin Khoa/Phòng Ban
                </h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-medium">
                          Tên Khoa/Phòng Ban{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="Nhập tên khoa/phòng ban..."
                          disabled={saving}
                          isInvalid={!!formErrors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.name}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          Tên khoa/phòng ban phải có từ 2-255 ký tự
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Form Actions */}
                  <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                    <Button
                      variant="outline-secondary"
                      onClick={() => navigate("/admin/academic/departments")}
                      disabled={saving}
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={saving || !formData.name.trim()}
                    >
                      {saving ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
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
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default DepartmentUpdate;
