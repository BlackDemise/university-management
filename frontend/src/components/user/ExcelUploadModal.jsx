import { useState, useRef } from "react";
import {
  Modal,
  Button,
  Form,
  Alert,
  Table,
  Badge,
  Spinner,
  ProgressBar,
  Row,
  Col,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faDownload,
  faFileExcel,
  faCheck,
  faTimes,
  faExclamationTriangle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import { userService } from "../../services/apiService.js";

const ExcelUploadModal = ({ show, onHide, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [step, setStep] = useState("upload"); // upload, preview, importing, result
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.name.toLowerCase().endsWith(".xlsx")) {
        toast.error("Vui lòng chọn file Excel (.xlsx)");
        return;
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File không được vượt quá 10MB");
        return;
      }

      setFile(selectedFile);
      setValidationResult(null);
      setImportResult(null);
      setStep("upload");
    }
  };

  const handleValidate = async () => {
    if (!file) {
      toast.error("Vui lòng chọn file Excel");
      return;
    }

    setIsValidating(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await userService.validateExcelFile(formData);
      console.log(response);

      setValidationResult(response.result);

      if (response.result.valid) {
        setStep("preview");
        toast.success("Validation thành công! Có thể tiến hành import.");
      } else {
        setStep("preview");
        toast.error(`Có ${response.result.errorCount} lỗi cần sửa`);
      }
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("Lỗi khi validate file Excel");
    } finally {
      setIsValidating(false);
    }
  };

  const handleImport = async () => {
    if (!file || !validationResult || !validationResult.valid) {
      toast.error("Vui lòng validate file trước khi import");
      return;
    }

    setIsImporting(true);
    setStep("importing");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await userService.importUsersFromExcel(formData);
      setImportResult(response.result);
      setStep("result");

      if (response.result.successCount > 0) {
        toast.success(
          `Import thành công ${response.result.successCount} người dùng`
        );
        if (onSuccess) {
          onSuccess();
        }
      }

      if (response.result.failureCount > 0) {
        toast.warning(
          `${response.result.failureCount} người dùng import thất bại`
        );
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Lỗi khi import file Excel");
      setStep("preview");
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await userService.downloadExcelTemplate();

      // Create blob and download
      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "user-import-template.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Đã tải xuống file mẫu");
    } catch (error) {
      console.error("Download template error:", error);
      toast.error("Lỗi khi tải file mẫu");
    }
  };

  const handleClose = () => {
    setFile(null);
    setValidationResult(null);
    setImportResult(null);
    setStep("upload");
    setIsValidating(false);
    setIsImporting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onHide();
  };

  const renderUploadStep = () => (
    <div className="text-center">
      <div className="mb-4">
        <FontAwesomeIcon
          icon={faFileExcel}
          size="3x"
          className="text-success mb-3"
        />
        <h5>Tải lên file Excel</h5>
        <p className="text-muted">
          Chọn file Excel (.xlsx) chứa thông tin người dùng cần import
        </p>
      </div>

      <Form.Group className="mb-3">
        <Form.Control
          type="file"
          accept=".xlsx"
          onChange={handleFileSelect}
          ref={fileInputRef}
        />
        <Form.Text className="text-muted">
          Chỉ chấp nhận file .xlsx, tối đa 10MB
        </Form.Text>
      </Form.Group>

      {file && (
        <Alert variant="info" className="mb-3">
          <FontAwesomeIcon icon={faFileExcel} className="me-2" />
          Đã chọn: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </Alert>
      )}

      <div className="d-flex gap-2 justify-content-center">
        <Button variant="outline-primary" onClick={handleDownloadTemplate}>
          <FontAwesomeIcon icon={faDownload} className="me-1" />
          Tải file mẫu
        </Button>
        <Button
          variant="primary"
          onClick={handleValidate}
          disabled={!file || isValidating}
        >
          {isValidating ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className="me-1" />
              Đang kiểm tra...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCheck} className="me-1" />
              Kiểm tra dữ liệu
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Kết quả kiểm tra</h5>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => setStep("upload")}
        >
          Chọn file khác
        </Button>
      </div>

      {validationResult && (
        <>
          <Row className="mb-3">
            <Col md={3}>
              <div className="text-center p-3 border rounded">
                <div className="h4 text-primary">
                  {validationResult.totalRows}
                </div>
                <small className="text-muted">Tổng số dòng</small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center p-3 border rounded">
                <div className="h4 text-success">
                  {validationResult.validCount}
                </div>
                <small className="text-muted">Dòng hợp lệ</small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center p-3 border rounded">
                <div className="h4 text-danger">
                  {validationResult.errorCount}
                </div>
                <small className="text-muted">Dòng có lỗi</small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center p-3 border rounded">
                <Badge
                  bg={validationResult.isValid ? "success" : "danger"}
                  className="p-2"
                >
                  {validationResult.isValid ? "Có thể import" : "Cần sửa lỗi"}
                </Badge>
              </div>
            </Col>
          </Row>

          {validationResult.errors && validationResult.errors.length > 0 && (
            <div className="mb-3">
              <h6 className="text-danger">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="me-1"
                />
                Danh sách lỗi cần sửa:
              </h6>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Dòng</th>
                      <th>Trường</th>
                      <th>Giá trị</th>
                      <th>Lỗi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validationResult.errors.map((error, index) => (
                      <tr key={index}>
                        <td>{error.rowNumber}</td>
                        <td>{error.field}</td>
                        <td
                          className="text-truncate"
                          style={{ maxWidth: "100px" }}
                        >
                          {error.value || "-"}
                        </td>
                        <td>{error.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          )}

          <div className="d-flex gap-2 justify-content-end">
            <Button
              variant="outline-secondary"
              onClick={() => setStep("upload")}
            >
              Quay lại
            </Button>
            <Button
              variant="success"
              onClick={handleImport}
              disabled={!validationResult.valid || isImporting}
            >
              <FontAwesomeIcon icon={faUpload} className="me-1" />
              Import dữ liệu
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const renderImportingStep = () => (
    <div className="text-center">
      <Spinner animation="border" variant="primary" className="mb-3" />
      <h5>Đang import dữ liệu...</h5>
      <p className="text-muted">
        Vui lòng đợi, quá trình này có thể mất vài phút
      </p>
      <ProgressBar animated now={100} className="mb-3" />
    </div>
  );

  const renderResultStep = () => (
    <div>
      <div className="text-center mb-4">
        <FontAwesomeIcon
          icon={importResult?.successCount > 0 ? faCheck : faTimes}
          size="3x"
          className={
            importResult?.successCount > 0 ? "text-success" : "text-danger"
          }
        />
        <h5 className="mt-2">Kết quả import</h5>
      </div>

      {importResult && (
        <>
          <Row className="mb-3">
            <Col md={4}>
              <div className="text-center p-3 border rounded">
                <div className="h4 text-primary">
                  {importResult.totalProcessed}
                </div>
                <small className="text-muted">Tổng xử lý</small>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center p-3 border rounded">
                <div className="h4 text-success">
                  {importResult.successCount}
                </div>
                <small className="text-muted">Thành công</small>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center p-3 border rounded">
                <div className="h4 text-danger">
                  {importResult.failureCount}
                </div>
                <small className="text-muted">Thất bại</small>
              </div>
            </Col>
          </Row>

          {importResult.failedUsers && importResult.failedUsers.length > 0 && (
            <div className="mb-3">
              <h6 className="text-danger">Danh sách import thất bại:</h6>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Dòng</th>
                      <th>Họ tên</th>
                      <th>Email</th>
                      <th>Lỗi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importResult.failedUsers.map((failed, index) => (
                      <tr key={index}>
                        <td>{failed.rowNumber}</td>
                        <td>{failed.fullName}</td>
                        <td>{failed.email}</td>
                        <td>{failed.errorMessage}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          )}

          <div className="text-center">
            <Button variant="primary" onClick={handleClose}>
              Hoàn thành
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faFileExcel} className="me-2" />
          Import người dùng từ Excel
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {step === "upload" && renderUploadStep()}
        {step === "preview" && renderPreviewStep()}
        {step === "importing" && renderImportingStep()}
        {step === "result" && renderResultStep()}
      </Modal.Body>
    </Modal>
  );
};

export default ExcelUploadModal;
