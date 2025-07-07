import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  InputGroup,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faEye,
  faGraduationCap,
  faRefresh,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { userService } from "../../../services/apiService";
import toast from "react-hot-toast";
import MainLayout from "../../layout/main/MainLayout.jsx";

const StudentList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("fullName");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchStudents();
  }, [currentPage, searchTerm, searchBy]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        size: pageSize,
        sort: "fullName,asc",
        searchValue: searchTerm || undefined,
        searchCriterion: searchBy,
      };

      const response = await userService.getAllUsers(params);

      // Filter only students from the response
      const studentUsers = response.result.content.filter(
        (user) => user.role === "STUDENT" && user.studentResponse
      );

      setStudents(studentUsers);
      setTotalPages(response.result.totalPages);
      setTotalElements(response.result.totalElements);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Không thể tải danh sách sinh viên");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchStudents();
  };

  const handleViewGrades = (student) => {
    navigate(`/admin/assessment/grade/student/${student.id}/grades`, {
      state: {
        studentName: student.fullName,
        studentCode: student.studentResponse.studentCode,
        studentEmail: student.email,
      },
    });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "primary" : "outline-primary"}
          size="sm"
          className="mx-1"
          onClick={() => setCurrentPage(i)}
        >
          {i + 1}
        </Button>
      );
    }

    return (
      <div className="d-flex justify-content-center align-items-center mt-3">
        <Button
          variant="outline-primary"
          size="sm"
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="me-2"
        >
          Trước
        </Button>
        {pages}
        <Button
          variant="outline-primary"
          size="sm"
          disabled={currentPage === totalPages - 1}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="ms-2"
        >
          Sau
        </Button>
      </div>
    );
  };

  return (
    <MainLayout activeMenu="assessment">
      <div className="container-fluid pt-3 pb-5">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h4 fw-bold text-dark">Quản Lý Điểm Sinh Viên</h2>
            <p className="text-muted mb-0">
              Tổng cộng: {totalElements} sinh viên
              {searchTerm && (
                <span className="text-primary ms-2">
                  (Tìm kiếm: "{searchTerm}")
                </span>
              )}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              onClick={() => {
                setCurrentPage(0);
                fetchStudents();
              }}
            >
              <FontAwesomeIcon icon={faRefresh} className="me-1" />
              Làm mới
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-light border-0">
            <h5 className="mb-0 d-flex align-items-center">
              <FontAwesomeIcon
                icon={faGraduationCap}
                className="me-2 text-primary"
              />
              Danh Sách Sinh Viên
            </h5>
          </Card.Header>

          <Card.Body>
            {/* Search Form */}
            <Form onSubmit={handleSearch} className="mb-4">
              <Row>
                <Col md={4}>
                  <Form.Select
                    value={searchBy}
                    onChange={(e) => setSearchBy(e.target.value)}
                  >
                    <option value="fullName">Tìm theo tên</option>
                    <option value="email">Tìm theo email</option>
                  </Form.Select>
                </Col>
                <Col md={6}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Nhập từ khóa tìm kiếm..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="primary" type="submit">
                      <FontAwesomeIcon icon={faSearch} />
                    </Button>
                  </InputGroup>
                </Col>
                <Col md={2}>
                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      setSearchTerm("");
                      setCurrentPage(0);
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} className="me-1" />
                    Xóa bộ lọc
                  </Button>
                </Col>
              </Row>
            </Form>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">
                  Đang tải danh sách sinh viên...
                </p>
              </div>
            )}

            {/* Table Content */}
            {!loading && (
              <>
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th scope="col" className="fw-medium text-muted">
                          #
                        </th>
                        <th scope="col" className="fw-medium text-muted">
                          Mã SV
                        </th>
                        <th scope="col" className="fw-medium text-muted">
                          Họ và Tên
                        </th>
                        <th scope="col" className="fw-medium text-muted">
                          Email
                        </th>
                        <th scope="col" className="fw-medium text-muted">
                          Năm Học
                        </th>
                        <th scope="col" className="fw-medium text-muted">
                          Trạng Thái
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
                      {students.length > 0 ? (
                        students.map((student, index) => (
                          <tr key={student.id}>
                            <td className="fw-medium text-muted">
                              {currentPage * pageSize + index + 1}
                            </td>
                            <td className="fw-medium">
                              {student.studentResponse?.studentCode || "N/A"}
                            </td>
                            <td>
                              <FontAwesomeIcon
                                icon={faUser}
                                className="me-2 text-primary"
                              />
                              {student.fullName}
                            </td>
                            <td>{student.email}</td>
                            <td>
                              {student.studentResponse?.courseYear || "N/A"}
                            </td>
                            <td>
                              <Badge bg="success">
                                {student.studentResponse?.studentStatus ||
                                  "N/A"}
                              </Badge>
                            </td>
                            <td className="text-center">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleViewGrades(student)}
                                title="Xem điểm"
                              >
                                <FontAwesomeIcon
                                  icon={faEye}
                                  className="me-1"
                                />
                                Chi tiết
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center py-4">
                            <Alert variant="info" className="mb-0">
                              Không tìm thấy sinh viên nào
                            </Alert>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>

                {/* Pagination */}
                {renderPagination()}

                {/* Summary */}
                <div className="mt-3 text-muted small">
                  Hiển thị {students.length} trên tổng số {totalElements} sinh
                  viên
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </div>
    </MainLayout>
  );
};

export default StudentList;
