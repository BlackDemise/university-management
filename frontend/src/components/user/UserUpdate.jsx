import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faIdCard,
  faMapMarkerAlt,
  faArrowLeft,
  faSave,
  faGraduationCap,
  faChalkboardTeacher,
  faCalendarAlt,
  faAward,
  faCertificate,
  faBook,
  faUserGraduate,
  faPlus,
  faEdit,
  faCamera,
  faUpload,
  faImage,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import { userService } from "../../services/apiService.js";
import MainLayout from "../layout/main/MainLayout.jsx";
import roleService from "../../services/roleService.js";

const UserUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // State management
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [error, setError] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);

  // Avatar upload state
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUploadSuccess, setAvatarUploadSuccess] = useState(false);
  const [avatarSignedUrl, setAvatarSignedUrl] = useState(null);
  const [loadingAvatarUrl, setLoadingAvatarUrl] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    // User core information
    id: null,
    fullName: "",
    email: "",
    phone: "",
    identityNumber: "",
    permanentAddress: "",
    currentAddress: "",
    role: "",
    avatarUrl: "",
    birthDate: "",

    // Student specific information
    studentCode: "",
    courseYear: "",
    studentStatus: "ACTIVE",

    // Teacher specific information
    teacherCode: "",
    academicRank: "",
    degree: "",
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({});

  // Load available roles
  const loadRoles = async () => {
    try {
      setLoadingRoles(true);

      const response = await roleService.getAllRoles();

      setAvailableRoles(response.result);
    } catch (err) {
      console.error("Error loading roles:", err);
      toast.error("Lỗi khi tải danh sách vai trò");
      // Fallback to hardcoded roles
      setAvailableRoles([
        { value: "ADMIN", label: "Quản Trị Viên" },
        { value: "TEACHER", label: "Giảng Viên" },
        { value: "STUDENT", label: "Sinh Viên" },
      ]);
    } finally {
      setLoadingRoles(false);
    }
  };

  // Load signed URL for avatar
  const loadAvatarSignedUrl = async (fileName) => {
    if (!fileName) {
      setAvatarSignedUrl(null);
      return;
    }

    try {
      setLoadingAvatarUrl(true);
      const response = await userService.getSignedUrlForUserAvatar(fileName);
      setAvatarSignedUrl(response.result || response);
    } catch (err) {
      console.error("Error loading avatar signed URL:", err);
      setAvatarSignedUrl(null);
    } finally {
      setLoadingAvatarUrl(false);
    }
  };

  // Load user data for edit mode
  const loadUserData = async () => {
    if (!isEditMode) return;

    try {
      setLoading(true);
      setError(null);

      const response = await userService.getUserById(id);
      const user = response.result || response;

      console.log("🔍 DEBUG - User data:", user);
      console.log("🔍 DEBUG - Available roles:", availableRoles);

      // Map user data to form
      setFormData({
        id: user.id,
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        identityNumber: user.identityNumber || "",
        permanentAddress: user.permanentAddress || "",
        currentAddress: user.currentAddress || "",
        role: user.role || "",
        avatarUrl: user.avatarUrl || "",
        birthDate: user.birthDate || "",

        // Student data
        studentId: user.studentResponse?.id,
        studentCode: user.studentResponse?.studentCode || "",
        courseYear: user.studentResponse?.courseYear || "",
        studentStatus: user.studentResponse?.studentStatus || "ACTIVE",

        // Teacher data
        teacherId: user.teacherResponse?.id,
        teacherCode: user.teacherResponse?.teacherCode || "",
        academicRank: user.teacherResponse?.academicRank || "",
        degree: user.teacherResponse?.degree || "",
      });

      // Load avatar signed URL if user has an avatar
      if (user.avatarUrl) {
        await loadAvatarSignedUrl(user.avatarUrl);
      }
    } catch (err) {
      setError("Không thể tải thông tin người dùng. Vui lòng thử lại.");
      console.error("Error loading user data:", err);
      toast.error("Lỗi khi tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert display role to enum (same as UserDetails)
  const getRoleEnum = (displayRole) => {
    const roleMap = {
      "Quản Trị Viên": "ADMIN",
      "Quản trị viên": "ADMIN", // Handle case variations
      "Giảng Viên": "TEACHER",
      "Giảng viên": "TEACHER",
      "Sinh Viên": "STUDENT",
      "Sinh viên": "STUDENT",
    };
    return roleMap[displayRole] || displayRole;
  };

  // Initialize component
  useEffect(() => {
    const initializeComponent = async () => {
      await loadRoles();
      if (isEditMode) {
        await loadUserData();
      }
    };

    initializeComponent();
  }, [id]);

  // Avatar upload handlers
  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn tệp hình ảnh hợp lệ");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước tệp không được vượt quá 5MB");
        return;
      }

      setAvatarFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Reset upload status
      setAvatarUploadSuccess(false);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile || !isEditMode) {
      toast.error(
        "Vui lòng chọn ảnh và đảm bảo đang chỉnh sửa người dùng hiện có"
      );
      return;
    }

    try {
      setAvatarUploading(true);

      const formDataUpload = new FormData();
      formDataUpload.append("file", avatarFile);

      const response = await userService.uploadAvatar(
        formData.id,
        formDataUpload
      );

      toast.success("Tải ảnh đại diện thành công!");
      setAvatarUploadSuccess(true);

      // Reload user data to get updated avatar URL
      await loadUserData();

      // Clear file selection
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err) {
      console.error("Error uploading avatar:", err);
      toast.error("Lỗi, xin vui lòng thử lại");
    } finally {
      setAvatarUploading(false);
    }
  };

  const clearAvatarSelection = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarUploadSuccess(false);

    // Clear file input
    const fileInput = document.getElementById("avatarFileInput");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Map server field names to frontend form field names
  const mapServerErrorsToFormFields = (serverErrors) => {
    const fieldMapping = {
      // Map server field names to frontend form field names
      "studentRequest.studentCode": "studentCode",
      "teacherRequest.teacherCode": "teacherCode",
      "studentRequest.courseYear": "courseYear",
      "teacherRequest.academicRank": "academicRank",
      "teacherRequest.degree": "degree",
      // Add more mappings as needed
    };

    const mappedErrors = {};
    Object.entries(serverErrors).forEach(([serverField, message]) => {
      const frontendField = fieldMapping[serverField] || serverField;
      mappedErrors[frontendField] = message;
    });

    return mappedErrors;
  };

  // Process server-side validation errors
  const processServerErrors = (error) => {
    console.error("Server error:", error);

    if (error.response && error.response.status === 400) {
      const errorData = error.response.data;

      // Check if server returned field-specific errors
      if (errorData.result && typeof errorData.result === "object") {
        // Map server field names to frontend field names
        const mappedErrors = mapServerErrorsToFormFields(errorData.result);

        // Server returned field-specific errors
        setFormErrors(mappedErrors);
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
    if (!formData.fullName.trim()) {
      errors.fullName = "Họ và tên là bắt buộc";
    }

    if (!formData.email.trim()) {
      errors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!formData.role) {
      errors.role = "Vai trò là bắt buộc";
    }

    // Role-specific validation
    if (formData.role === "STUDENT") {
      if (!formData.studentCode.trim()) {
        errors.studentCode = "Mã sinh viên là bắt buộc";
      }
    }

    if (formData.role === "TEACHER") {
      if (!formData.teacherCode.trim()) {
        errors.teacherCode = "Mã giảng viên là bắt buộc";
      }
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
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        identityNumber: formData.identityNumber.trim() || null,
        permanentAddress: formData.permanentAddress.trim() || null,
        currentAddress: formData.currentAddress.trim() || null,
        role: formData.role,
        birthDate: formData.birthDate || null,
      };

      // Add role-specific data
      if (formData.role === "STUDENT") {
        requestData.studentRequest = {
          id: formData.studentId,
          studentCode: formData.studentCode.trim(),
          courseYear: formData.courseYear || null,
          studentStatus: formData.studentStatus,
        };
      } else if (formData.role === "TEACHER") {
        requestData.teacherRequest = {
          id: formData.teacherId,
          teacherCode: formData.teacherCode.trim(),
          academicRank: formData.academicRank.trim() || null,
          degree: formData.degree.trim() || null,
        };
      }

      await userService.saveUser(requestData);

      const successMessage = isEditMode
        ? "Cập nhật thông tin người dùng thành công"
        : "Tạo người dùng mới thành công";

      toast.success(successMessage);

      // Navigate back to user list or details
      if (isEditMode) {
        navigate(`/admin/users/details/${id}`);
      } else {
        navigate("/admin/users/all");
      }
    } catch (err) {
      // Try to process server-side validation errors first
      const handledAsFieldErrors = processServerErrors(err);

      if (!handledAsFieldErrors) {
        // Fall back to generic error handling
        console.error("Error saving user:", err);
        const errorMessage = isEditMode
          ? "Lỗi khi cập nhật thông tin người dùng"
          : "Lỗi khi tạo người dùng mới";
        toast.error(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  // Get student status options
  const getStudentStatusOptions = () => [
    { value: "ACTIVE", label: "Đang học", variant: "success" },
    { value: "GRADUATED", label: "Đã tốt nghiệp", variant: "primary" },
    { value: "SUSPENDED", label: "Tạm ngưng", variant: "warning" },
    { value: "EXPELLED", label: "Bị loại", variant: "danger" },
  ];

  if (loading || loadingRoles) {
    return (
      <MainLayout activeMenu="all-users">
        <div className="container-fluid pt-3 pb-5">
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Đang tải thông tin...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout activeMenu="all-users">
        <div className="container-fluid pt-3 pb-5">
          <Alert variant="danger">{error}</Alert>
          <Button
            variant="outline-primary"
            onClick={() => navigate("/admin/users/all")}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
            Quay lại danh sách
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout activeMenu="all-users">
      <div className="container-fluid pt-3 pb-5">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h4 fw-bold text-dark">
              {isEditMode ? "Chỉnh Sửa Người Dùng" : "Tạo Người Dùng Mới"}
            </h2>
            <p className="text-muted mb-0">
              {isEditMode
                ? `Cập nhật thông tin cho: ${formData.fullName}`
                : "Nhập thông tin để tạo tài khoản người dùng mới"}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              onClick={() =>
                navigate(
                  isEditMode ? `/admin/users/details/${id}` : "/admin/users/all"
                )
              }
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={saving}>
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
                  <FontAwesomeIcon icon={faSave} className="me-1" />
                  {isEditMode ? "Cập nhật" : "Tạo mới"}
                </>
              )}
            </Button>
          </div>
        </div>

        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Avatar Upload Section - Only for Edit Mode */}
            {isEditMode && (
              <Col lg={12} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-primary bg-opacity-10 border-0">
                    <h5 className="mb-0 d-flex align-items-center text-primary">
                      <FontAwesomeIcon icon={faCamera} className="me-2" />
                      Ảnh Đại Diện
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      {/* Current Avatar Display */}
                      <Col md={4} className="text-center">
                        <div className="mb-3">
                          <label className="text-muted small mb-2 d-block">
                            Ảnh hiện tại
                          </label>
                          <div
                            className="bg-light border rounded d-flex align-items-center justify-content-center"
                            style={{
                              width: "120px",
                              height: "120px",
                              margin: "0 auto",
                            }}
                          >
                            {loadingAvatarUrl ? (
                              <Spinner
                                animation="border"
                                variant="primary"
                                size="sm"
                              />
                            ) : avatarSignedUrl ? (
                              <img
                                src={avatarSignedUrl}
                                alt="Current avatar"
                                className="rounded"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "block";
                                }}
                              />
                            ) : null}

                            <div
                              className="text-center text-muted"
                              style={{
                                display:
                                  avatarSignedUrl && !loadingAvatarUrl
                                    ? "none"
                                    : "block",
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faUser}
                                size="2x"
                                className="mb-1"
                              />
                              <div className="small">
                                {loadingAvatarUrl
                                  ? "Đang tải..."
                                  : "Chưa có ảnh"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>

                      {/* Avatar Preview */}
                      {avatarPreview && (
                        <Col md={4} className="text-center">
                          <div className="mb-3">
                            <label className="text-muted small mb-2 d-block">
                              Xem trước
                            </label>
                            <div
                              className="bg-light border rounded d-flex align-items-center justify-content-center"
                              style={{
                                width: "120px",
                                height: "120px",
                                margin: "0 auto",
                              }}
                            >
                              <img
                                src={avatarPreview}
                                alt="Avatar preview"
                                className="rounded"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          </div>
                        </Col>
                      )}

                      {/* Upload Controls */}
                      <Col md={avatarPreview ? 4 : 8}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FontAwesomeIcon icon={faImage} className="me-1" />
                            Chọn ảnh mới
                          </Form.Label>
                          <Form.Control
                            id="avatarFileInput"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarFileChange}
                            disabled={avatarUploading}
                          />
                          <Form.Text className="text-muted">
                            Hỗ trợ định dạng: JPG, PNG, GIF. Tối đa 5MB.
                          </Form.Text>
                        </Form.Group>

                        {avatarFile && (
                          <div className="d-flex gap-2 mb-3">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={handleAvatarUpload}
                              disabled={avatarUploading}
                            >
                              {avatarUploading ? (
                                <>
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    className="me-1"
                                  />
                                  Đang tải...
                                </>
                              ) : (
                                <>
                                  <FontAwesomeIcon
                                    icon={faUpload}
                                    className="me-1"
                                  />
                                  Tải lên
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={clearAvatarSelection}
                              disabled={avatarUploading}
                            >
                              Hủy
                            </Button>
                          </div>
                        )}

                        {avatarUploadSuccess && (
                          <Alert variant="success" className="mb-0">
                            <FontAwesomeIcon icon={faCheck} className="me-1" />
                            Tải ảnh đại diện thành công!
                          </Alert>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            )}

            {/* Core Information */}
            <Col lg={12} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-light border-0">
                  <h5 className="mb-0 d-flex align-items-center">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="me-2 text-primary"
                    />
                    Thông Tin Cơ Bản
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Họ và Tên <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.fullName}
                          onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                          }
                          isInvalid={!!formErrors.fullName}
                          placeholder="Nhập họ và tên đầy đủ"
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.fullName}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FontAwesomeIcon icon={faEnvelope} className="me-1" />
                          Email <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          isInvalid={!!formErrors.email}
                          placeholder="example@university.edu.vn"
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.email}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FontAwesomeIcon icon={faPhone} className="me-1" />
                          Số Điện Thoại
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="0123456789"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="me-1"
                          />
                          Ngày Sinh
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) =>
                            handleInputChange("birthDate", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FontAwesomeIcon icon={faIdCard} className="me-1" />
                          CCCD/CMND
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.identityNumber}
                          onChange={(e) =>
                            handleInputChange("identityNumber", e.target.value)
                          }
                          placeholder="012345678901"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FontAwesomeIcon
                            icon={faMapMarkerAlt}
                            className="me-1"
                          />
                          Địa Chỉ Thường Trú
                        </Form.Label>
                        <Form.Control
                          as="input"
                          rows={2}
                          value={formData.permanentAddress}
                          onChange={(e) =>
                            handleInputChange(
                              "permanentAddress",
                              e.target.value
                            )
                          }
                          placeholder="Nhập địa chỉ thường trú"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FontAwesomeIcon
                            icon={faMapMarkerAlt}
                            className="me-1"
                          />
                          Địa Chỉ Hiện Tại
                        </Form.Label>
                        <Form.Control
                          as="input"
                          rows={2}
                          value={formData.currentAddress}
                          onChange={(e) =>
                            handleInputChange("currentAddress", e.target.value)
                          }
                          placeholder="Nhập địa chỉ hiện tại"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Vai Trò <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={formData.role}
                          onChange={(e) =>
                            handleInputChange("role", e.target.value)
                          }
                          isInvalid={!!formErrors.role}
                        >
                          <option value="">Chọn vai trò</option>
                          {availableRoles.map((role) => (
                            <option key={role.label} value={role.label}>
                              {role.value}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {formErrors.role}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            {/* Student Information */}
            {formData.role === "STUDENT" && (
              <Col lg={12} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-success bg-opacity-10 border-0">
                    <h5 className="mb-0 d-flex align-items-center text-success">
                      <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
                      Thông Tin Sinh Viên
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Mã Sinh Viên <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.studentCode}
                            onChange={(e) =>
                              handleInputChange("studentCode", e.target.value)
                            }
                            isInvalid={!!formErrors.studentCode}
                            placeholder="SV123456"
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors.studentCode}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FontAwesomeIcon icon={faBook} className="me-1" />
                            Khóa Học
                          </Form.Label>
                          <Form.Control
                            type="number"
                            value={formData.courseYear}
                            onChange={(e) =>
                              handleInputChange("courseYear", e.target.value)
                            }
                            placeholder="2024"
                            min="2000"
                            max="2030"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Trạng Thái Học Tập</Form.Label>
                          <Form.Select
                            value={formData.studentStatus}
                            onChange={(e) =>
                              handleInputChange("studentStatus", e.target.value)
                            }
                          >
                            {getStudentStatusOptions().map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            )}

            {/* Teacher Information */}
            {formData.role === "TEACHER" && (
              <Col lg={12} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-info bg-opacity-10 border-0">
                    <h5 className="mb-0 d-flex align-items-center text-info">
                      <FontAwesomeIcon
                        icon={faChalkboardTeacher}
                        className="me-2"
                      />
                      Thông Tin Giảng Viên
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Mã Giảng Viên <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.teacherCode}
                            onChange={(e) =>
                              handleInputChange("teacherCode", e.target.value)
                            }
                            isInvalid={!!formErrors.teacherCode}
                            placeholder="GV123456"
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors.teacherCode}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FontAwesomeIcon icon={faAward} className="me-1" />
                            Học Hàm
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.academicRank}
                            onChange={(e) =>
                              handleInputChange("academicRank", e.target.value)
                            }
                            placeholder="Phó Giáo Sư, Giáo Sư..."
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FontAwesomeIcon
                              icon={faCertificate}
                              className="me-1"
                            />
                            Học Vị
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.degree}
                            onChange={(e) =>
                              handleInputChange("degree", e.target.value)
                            }
                            placeholder="Tiến sĩ, Thạc sĩ, Cử nhân..."
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            )}

            {/* Admin Information */}
            {formData.role === "ADMIN" && (
              <Col lg={12} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-danger bg-opacity-10 border-0">
                    <h5 className="mb-0 d-flex align-items-center text-danger">
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      Quyền Quản Trị
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="text-muted">
                      <p className="mb-2">
                        <FontAwesomeIcon
                          icon={faAward}
                          className="me-2 text-danger"
                        />
                        <strong>Quyền hạn:</strong> Toàn quyền quản lý hệ thống
                      </p>
                      <ul className="mb-0">
                        <li>Quản lý người dùng (tạo, sửa, xóa tài khoản)</li>
                        <li>Quản lý khóa học và chương trình đào tạo</li>
                        <li>Quản lý cơ sở vật chất và phòng học</li>
                        <li>Cài đặt và cấu hình hệ thống</li>
                        <li>Xem báo cáo và thống kê tổng quan</li>
                      </ul>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </Form>
      </div>
    </MainLayout>
  );
};

export default UserUpdate;
