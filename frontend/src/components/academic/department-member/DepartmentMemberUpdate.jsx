import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  Alert,
  Spinner,
  Row,
  Col,
  Table,
  Badge,
} from "react-bootstrap";
import { DatePicker } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faSave,
  faSearch,
  faUsers,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import { departmentMemberService } from "../../../services/apiService.js";
import departmentService from "../../../services/departmentService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

// Custom CSS for antd DatePicker to match Bootstrap form styling
const datePickerStyle = {
  width: "100%",
  height: "38px",
  fontSize: "16px",
  borderRadius: "0.375rem",
  border: "1px solid #ced4da",
  padding: "0.375rem 0.75rem",
};

const DepartmentMemberUpdate = () => {
  const navigate = useNavigate();
  const { id: memberId } = useParams();
  const [searchParams] = useSearchParams();
  const departmentIdFromQuery = searchParams.get("departmentId");

  // Determine if this is create or edit mode
  const isEditMode = !!memberId;
  const isCreateMode = !memberId;

  // State management
  const [formData, setFormData] = useState({
    id: null,
    departmentId: departmentIdFromQuery || "",
    teacherId: "",
    departmentMemberType: "",
    startDate: null,
    endDate: null,
  });

  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [memberTypes, setMemberTypes] = useState({});
  const [existingMembers, setExistingMembers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [teacherSearchTerm, setTeacherSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [teachersError, setTeachersError] = useState(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load member data if in edit mode
  useEffect(() => {
    if (isEditMode && memberId) {
      loadMemberData();
    }
  }, [isEditMode, memberId]);

  // Load existing members when department changes
  useEffect(() => {
    if (formData.departmentId) {
      loadExistingMembers();
    }
  }, [formData.departmentId]);

  // Filter teachers based on search term
  useEffect(() => {
    if (teacherSearchTerm.trim()) {
      const filtered = teachers.filter(
        (teacher) =>
          teacher.teacherName
            .toLowerCase()
            .includes(teacherSearchTerm.toLowerCase()) ||
          teacher.teacherCode
            .toLowerCase()
            .includes(teacherSearchTerm.toLowerCase())
      );
      setFilteredTeachers(filtered);
    } else {
      setFilteredTeachers(teachers);
    }
  }, [teacherSearchTerm, teachers]);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Load departments, member types, and teachers in parallel
      const [departmentsResponse, memberTypesResponse, teachersResponse] =
        await Promise.allSettled([
          departmentService.getAllDepartments({}),
          departmentMemberService.getMemberTypes(),
          departmentMemberService.getAvailableTeachers(),
        ]);

      // Handle departments
      if (departmentsResponse.status === "fulfilled") {
        const deptData = departmentsResponse.value;
        setDepartments(deptData.result?.content || deptData.result || []);
      }

      // Handle member types
      if (memberTypesResponse.status === "fulfilled") {
        const typesData = memberTypesResponse.value;
        setMemberTypes(typesData.result || {});
      }

      // Handle teachers
      if (teachersResponse.status === "fulfilled") {
        const teachersData = teachersResponse.value;
        setTeachers(teachersData.result || []);
        setTeachersError(null);
      } else {
        setTeachersError(
          "Không thể kết nối đến hệ thống quản lý người dùng. Vui lòng thử lại sau."
        );
        setTeachers([]);
      }
    } catch (err) {
      setError("Không thể tải dữ liệu ban đầu. Vui lòng thử lại.");
      console.error("Error loading initial data:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMemberData = async () => {
    try {
      const response = await departmentMemberService.getDepartmentMemberById(
        memberId
      );
      const member = response.result;

      setFormData({
        id: member.id,
        departmentId: member.departmentId,
        teacherId: member.teacherId,
        departmentMemberType: member.departmentMemberType,
        startDate: member.startDate ? dayjs(member.startDate) : null,
        endDate: member.endDate ? dayjs(member.endDate) : null,
      });
    } catch (err) {
      setError("Không thể tải thông tin thành viên. Vui lòng thử lại.");
      console.error("Error loading member data:", err);
    }
  };

  const loadExistingMembers = async () => {
    try {
      const response = await departmentMemberService.getDepartmentDetails(
        formData.departmentId
      );
      setExistingMembers(response.result || []);
    } catch (err) {
      console.error("Error loading existing members:", err);
      setExistingMembers([]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTeacherSelect = (teacher) => {
    // Check for duplicate teacher in the department (excluding current member in edit mode)
    const isDuplicate = existingMembers.some(
      (member) =>
        member.teacherId === teacher.teacherId &&
        (!isEditMode || member.id !== formData.id)
    );

    if (isDuplicate) {
      toast.warning("Giảng viên này đã là thành viên của khoa!");
      return;
    }

    handleInputChange("teacherId", teacher.teacherId);
    setTeacherSearchTerm(
      `${teacher.teacherCode} - ${teacher.teacherName}`
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.departmentId) {
      toast.error("Vui lòng chọn khoa");
      return;
    }
    if (!formData.teacherId) {
      toast.error("Vui lòng chọn giảng viên");
      return;
    }
    if (!formData.departmentMemberType) {
      toast.error("Vui lòng chọn loại thành viên");
      return;
    }
    if (!formData.startDate) {
      toast.error("Vui lòng chọn ngày bắt đầu");
      return;
    }

    // Additional validation: end date should be after start date
    if (formData.endDate && formData.startDate.isAfter(formData.endDate)) {
      toast.error("Ngày kết thúc phải sau ngày bắt đầu");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...formData,
        startDate: formData.startDate.format("YYYY-MM-DD"),
        endDate: formData.endDate
          ? formData.endDate.format("YYYY-MM-DD")
          : null,
      };

      await departmentMemberService.saveDepartmentMember(payload);

      toast.success(
        isEditMode
          ? "Cập nhật thành viên thành công"
          : "Thêm thành viên thành công"
      );

      // Navigate back to department details
      navigate(
        `/admin/academic/department-members/details/${formData.departmentId}`
      );
    } catch (err) {
      toast.error(
        isEditMode
          ? "Lỗi khi cập nhật thành viên"
          : "Lỗi khi thêm thành viên"
      );
      console.error("Error saving member:", err);
    } finally {
      setSaving(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return dayjs(dateString).format("DD/MM/YYYY");
    } catch {
      return dateString;
    }
  };

  return (
    <MainLayout activeMenu="department-members">
      <div className="container-fluid pt-3 pb-5">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/admin/academic/department-members")}
              className="me-3"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
              Quay Lại
            </Button>
            <div>
              <h2 className="h4 fw-bold text-dark mb-0">
                {isEditMode ? "Chỉnh Sửa Thành Viên" : "Thêm Thành Viên Mới"}
              </h2>
              <p className="text-muted mb-0">
                {isEditMode
                  ? "Cập nhật thông tin thành viên khoa"
                  : "Thêm thành viên vào khoa"}
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Teachers Error Alert */}
        {teachersError && (
          <Alert variant="warning" className="mb-4">
            {teachersError}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <Row>
            <Col lg={8}>
              {/* Member Form */}
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                  <h5 className="card-title mb-4">
                    {isEditMode ? "Thông Tin Thành Viên" : "Thông Tin Thành Viên Mới"}
                  </h5>

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      {/* Department Selection */}
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Khoa <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            value={formData.departmentId}
                            onChange={(e) =>
                              handleInputChange("departmentId", e.target.value)
                            }
                            disabled={isEditMode}
                            required
                          >
                            <option value="">Chọn khoa...</option>
                            {departments.map((dept) => (
                              <option key={dept.id} value={dept.id}>
                                {dept.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      {/* Member Type Selection */}
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Loại Thành Viên <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            value={formData.departmentMemberType}
                            onChange={(e) =>
                              handleInputChange(
                                "departmentMemberType",
                                e.target.value
                              )
                            }
                            required
                          >
                            <option value="">Chọn loại thành viên...</option>
                            {Object.entries(memberTypes).map(([key, value]) => (
                              <option key={key} value={value}>
                                {value}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      {/* Teacher Search */}
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Giảng Viên <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="d-flex gap-2">
                            <Form.Control
                              type="text"
                              placeholder="Tìm kiếm theo tên hoặc mã giảng viên..."
                              value={teacherSearchTerm}
                              onChange={(e) =>
                                setTeacherSearchTerm(e.target.value)
                              }
                              disabled={teachersError}
                            />
                            <Button
                              variant="outline-primary"
                              disabled={teachersError}
                            >
                              <FontAwesomeIcon icon={faSearch} />
                            </Button>
                          </div>
                          {formData.teacherId && (
                            <div className="mt-2">
                              <Badge bg="success">
                                Đã chọn giảng viên ID: {formData.teacherId}
                              </Badge>
                            </div>
                          )}
                        </Form.Group>
                      </Col>

                      {/* Date Selection */}
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Ngày Bắt Đầu <span className="text-danger">*</span>
                          </Form.Label>
                          <div>
                            <DatePicker
                              value={formData.startDate}
                              onChange={(date) => handleInputChange("startDate", date)}
                              format="DD/MM/YYYY"
                              placeholder="Chọn ngày bắt đầu"
                              style={datePickerStyle}
                              className="form-control-styled"
                              allowClear={false}
                            />
                          </div>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Ngày Kết Thúc</Form.Label>
                          <div>
                            <DatePicker
                              value={formData.endDate}
                              onChange={(date) => handleInputChange("endDate", date)}
                              format="DD/MM/YYYY"
                              placeholder="Chọn ngày kết thúc (tùy chọn)"
                              style={datePickerStyle}
                              className="form-control-styled"
                              disabledDate={(current) => 
                                formData.startDate && current && current.isBefore(formData.startDate, 'day')
                              }
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Action Buttons */}
                    <div className="d-flex gap-2 mt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={saving || teachersError || !formData.teacherId}
                      >
                        {saving ? (
                          <Spinner size="sm" animation="border" className="me-1" />
                        ) : (
                          <FontAwesomeIcon icon={faSave} className="me-1" />
                        )}
                        {isEditMode ? "Cập Nhật" : "Thêm Thành Viên"}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                          navigate("/admin/academic/department-members")
                        }
                      >
                        Hủy
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* Teacher Selection List */}
              {!teachersError && (
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Body>
                    <h6 className="card-title">
                      Danh Sách Giảng Viên ({filteredTeachers.length})
                    </h6>
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                      {filteredTeachers.length > 0 ? (
                        filteredTeachers.map((teacher) => (
                          <div
                            key={teacher.teacherId}
                            className={`p-2 border rounded mb-2 cursor-pointer ${
                              formData.teacherId === teacher.teacherId
                                ? "border-primary bg-light"
                                : "border-light"
                            }`}
                            onClick={() => handleTeacherSelect(teacher)}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="d-flex align-items-center">
                              <FontAwesomeIcon
                                icon={faUser}
                                className="text-primary me-2"
                              />
                              <div>
                                <div className="fw-medium">
                                  {teacher.teacherName}
                                </div>
                                <small className="text-muted">
                                  {teacher.teacherCode} • {teacher.teacherEmail}
                                </small>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted text-center py-3">
                          Không tìm thấy giảng viên nào
                        </p>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              )}

              {/* Existing Members */}
              {formData.departmentId && existingMembers.length > 0 && (
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    <h6 className="card-title">
                      Thành Viên Hiện Tại ({existingMembers.length})
                    </h6>
                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                      <Table size="sm" className="mb-0">
                        <tbody>
                          {existingMembers.map((member) => (
                            <tr key={member.id}>
                              <td>
                                <div className="fw-medium">
                                  {member.teacherName}
                                </div>
                                <small className="text-muted">
                                  {member.teacherCode}
                                </small>
                              </td>
                              <td>
                                <Badge
                                  bg={
                                    member.departmentMemberType === "Trưởng khoa"
                                      ? "success"
                                      : "secondary"
                                  }
                                  className="small"
                                >
                                  {member.departmentMemberType}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        )}
      </div>
    </MainLayout>
  );
};

export default DepartmentMemberUpdate; 