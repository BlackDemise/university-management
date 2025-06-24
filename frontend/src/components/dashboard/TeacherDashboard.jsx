import { useAuth } from '../../contexts/AuthContext.jsx';
import MainLayout from "../layout/main/MainLayout.jsx";

const TeacherDashboard = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <MainLayout activeMenu="dashboard">
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h1 className="h3 fw-bold text-success">Bảng Điều Khiển Giảng Viên</h1>
                                <p className="text-muted">Chào mừng thầy/cô đến với hệ thống quản lý giảng dạy</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn btn-outline-secondary"
                            >
                                Đăng Xuất
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 col-lg-3 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title text-primary">Môn Học Của Tôi</h5>
                                <p className="card-text text-muted">Quản lý các môn học đang giảng dạy</p>
                                <button className="btn btn-primary btn-sm">Xem Chi Tiết</button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title text-warning">Chấm Điểm</h5>
                                <p className="card-text text-muted">Nhập và quản lý điểm số sinh viên</p>
                                <button className="btn btn-warning btn-sm">Xem Chi Tiết</button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title text-info">Điểm Danh</h5>
                                <p className="card-text text-muted">Theo dõi và ghi nhận sự có mặt của sinh viên</p>
                                <button className="btn btn-info btn-sm">Xem Chi Tiết</button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title text-secondary">Lịch Giảng Dạy</h5>
                                <p className="card-text text-muted">Xem lịch giảng dạy và thời khóa biểu</p>
                                <button className="btn btn-secondary btn-sm">Xem Chi Tiết</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-8 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-light">
                                <h5 className="card-title mb-0">Lớp Học Gần Đây</h5>
                            </div>
                            <div className="card-body">
                                <p className="text-muted">Danh sách các lớp học sắp tới sẽ được hiển thị ở đây</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-light">
                                <h5 className="card-title mb-0">Thông Báo</h5>
                            </div>
                            <div className="card-body">
                                <p className="text-muted">Các thông báo mới nhất từ khoa và trường</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>

    );
};

export default TeacherDashboard;