import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Badge,
  Dropdown,
  Alert,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPlus,
  faEdit,
  faTrash,
  faEllipsisVertical,
  faUsers,
  faUser,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { departmentMemberService } from "../../../services/apiService.js";
import MainLayout from "../../layout/main/MainLayout.jsx";

const DepartmentMemberDetails = () => {
  const navigate = useNavigate();
  const { id: departmentId } = useParams();

  // State management
  const [departmentMembers, setDepartmentMembers] = useState([]);
  const [departmentInfo, setDepartmentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Member type display mapping with colors (green for FACULTY_HEAD, grey for TEACHER)
  const memberTypeDisplayMap = {
    "Trưởng khoa": "success",
    "Giảng viên": "secondary",
  };

  // Load department details with members
  const loadDepartmentDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await departmentMemberService.getDepartmentDetails(departmentId);

      if (response.result && response.result.length > 0) {
        setDepartmentMembers(response.result);
        // Set department info from first member
        setDepartmentInfo({
          id: response.result[0].departmentId,
          name: response.result[0].departmentName,
        });
      } else {
        // Empty department
        setDepartmentMembers([]);
        setDepartmentInfo({ id: departmentId, name: "Khoa không xác định" });
      }
    } catch (err) {
      setError("Không thể tải thông tin chi tiết khoa. Vui lòng thử lại.");
      console.error("Error loading department details:", err);
      toast.error("Lỗi khi tải thông tin chi tiết khoa");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (departmentId) {
      loadDepartmentDetails();
    }
  }, [departmentId]);

  // Handle member actions
  const handleEditMember = (member) => {
    navigate(`/admin/academic/department-members/edit/${member.id}`);
  };

  const handleDeleteMember = async (member) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa thành viên "${member.teacherName}" khỏi khoa "${departmentInfo?.name}"?`
      )
    ) {
      try {
        await departmentMemberService.deleteDepartmentMember(member.id);
        toast.success("Xóa thành viên thành công");
        loadDepartmentDetails(); // Reload data
      } catch (err) {
        toast.error("Lỗi khi xóa thành viên");
        console.error("Error deleting member:", err);
      }
    }
  };

  const handleAddMember = () => {
    navigate(`/admin/academic/department-members/create?departmentId=${departmentId}`);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  // Get member type badge variant
  const getMemberTypeBadgeVariant = (memberType) => {
    return memberTypeDisplayMap[memberType] || "secondary";
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
                Chi Tiết Thành Viên Khoa
              </h2>
              <p className="text-muted mb-0">
                {departmentInfo?.name} - {departmentMembers.length} thành viên
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={handleAddMember}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faPlus} className="me-1" />
            Thêm Thành Viên
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Department Info Card */}
        {departmentInfo && (
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="d-flex align-items-center mb-3">
                    <FontAwesomeIcon
                      icon={faBuilding}
                      className="text-primary me-2"
                      size="lg"
                    />
                    <h5 className="mb-0">Thông Tin Khoa</h5>
                  </div>
                  <p className="mb-1">
                    <strong>Tên Khoa:</strong> {departmentInfo.name}
                  </p>
                  <p className="mb-0">
                    <strong>Mã Khoa:</strong> {departmentInfo.id}
                  </p>
                </Col>
                <Col md={6}>
                  <div className="d-flex align-items-center mb-3">
                    <FontAwesomeIcon
                      icon={faUsers}
                      className="text-success me-2"
                      size="lg"
                    />
                    <h5 className="mb-0">Thống Kê Thành Viên</h5>
                  </div>
                  <p className="mb-1">
                    <strong>Tổng Thành Viên:</strong>{" "}
                    <Badge bg="success" className="fs-6">
                      {departmentMembers.length}
                    </Badge>
                  </p>
                  <p className="mb-0">
                    <strong>Trưởng Khoa:</strong>{" "}
                    <Badge bg="primary" className="fs-6">
                      {
                        departmentMembers.filter(
                          (m) => m.departmentMemberType === "Trưởng khoa"
                        ).length
                      }
                    </Badge>
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* Members Table */}
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">
                  Đang tải danh sách thành viên...
                </p>
              </div>
            )}

            {/* Table Content */}
            {!loading && (
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="fw-medium text-muted">
                        #
                      </th>
                      <th scope="col" className="fw-medium text-muted">
                        Mã Giảng Viên
                      </th>
                      <th scope="col" className="fw-medium text-muted">
                        Tên Giảng Viên
                      </th>
                      <th scope="col" className="fw-medium text-muted">
                        Loại Thành Viên
                      </th>
                      <th scope="col" className="fw-medium text-muted">
                        Ngày Bắt Đầu
                      </th>
                      <th scope="col" className="fw-medium text-muted">
                        Ngày Kết Thúc
                      </th>
                      <th
                        scope="col"
                        className="fw-medium text-muted text-center"
                      >
                        Thao Tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentMembers.length > 0 ? (
                      departmentMembers.map((member, index) => (
                        <tr key={member.id}>
                          <td className="fw-medium text-muted">
                            {index + 1}
                          </td>
                          <td>
                            <code className="bg-light px-2 py-1 rounded small">
                              {member.teacherCode || "N/A"}
                            </code>
                          </td>
                          <td>
                            <Link
                              to={`/admin/users/details/${member.teacherId}`}
                              className="text-decoration-none"
                            >
                              <FontAwesomeIcon
                                icon={faUser}
                                className="text-primary me-1"
                              />
                              {member.teacherName || "N/A"}
                            </Link>
                          </td>
                          <td>
                            <Badge
                              bg={getMemberTypeBadgeVariant(
                                member.departmentMemberType
                              )}
                            >
                              {member.departmentMemberType || "N/A"}
                            </Badge>
                          </td>
                          <td>{formatDate(member.startDate)}</td>
                          <td>{formatDate(member.endDate)}</td>
                          <td className="text-center">
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="outline-secondary"
                                size="sm"
                                className="border-0"
                              >
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onClick={() => handleEditMember(member)}
                                >
                                  <FontAwesomeIcon
                                    icon={faEdit}
                                    className="me-2"
                                  />
                                  Chỉnh Sửa
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item
                                  className="text-danger"
                                  onClick={() => handleDeleteMember(member)}
                                >
                                  <FontAwesomeIcon
                                    icon={faTrash}
                                    className="me-2"
                                  />
                                  Xóa
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-5 text-muted"
                        >
                          <FontAwesomeIcon
                            icon={faUsers}
                            size="3x"
                            className="mb-3 opacity-50"
                          />
                          <p>Khoa này chưa có thành viên nào</p>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={handleAddMember}
                          >
                            <FontAwesomeIcon icon={faPlus} className="me-1" />
                            Thêm Thành Viên Đầu Tiên
                          </Button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DepartmentMemberDetails; 