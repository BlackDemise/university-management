import { useAuth } from '../../contexts/AuthContext.jsx';
import MainLayout from "../layout/main/MainLayout.jsx";

const StudentDashboard = () => {
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
                                <h1 className="h3 fw-bold text-info">Bảng Điều Khiển Sinh Viên</h1>
                                <p className="text-muted">Chào mừng bạn đến với hệ thống quản lý học tập</p>
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
                                <h5 className="card-title text-primary">Đăng Ký Môn Học</h5>
                                <p className="card-text text-muted">Đăng ký các môn học trong học kỳ</p>
                                <button className="btn btn-primary btn-sm">Xem Chi Tiết</button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title text-success">Điểm Số</h5>
                                <p className="card-text text-muted">Xem điểm số và kết quả học tập</p>
                                <button className="btn btn-success btn-sm">Xem Chi Tiết</button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title text-warning">Thời Khóa Biểu</h5>
                                <p className="card-text text-muted">Xem lịch học và thời gian biểu</p>
                                <button className="btn btn-warning btn-sm">Xem Chi Tiết</button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title text-secondary">Học Phí</h5>
                                <p className="card-text text-muted">Thông tin học phí và thanh toán</p>
                                <button className="btn btn-secondary btn-sm">Xem Chi Tiết</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-8 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-light">
                                <h5 className="card-title mb-0">Môn Học Đang Học</h5>
                            </div>
                            <div className="card-body">
                                <p className="text-muted">Danh sách các môn học đang theo học trong học kỳ hiện tại</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-light">
                                <h5 className="card-title mb-0">Thông Báo Quan Trọng</h5>
                            </div>
                            <div className="card-body">
                                <p className="text-muted">Các thông báo và tin tức mới nhất từ trường</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-light">
                                <h5 className="card-title mb-0">Tiến Độ Học Tập</h5>
                            </div>
                            <div className="card-body">
                                <p className="text-muted">Theo dõi tiến độ hoàn thành chương trình học</p>
                                <div className="progress">
                                    <div className="progress-bar bg-info" role="progressbar" style={{width: '65%'}} aria-valuenow="65" aria-valuemin="0" aria-valuemax="100">65%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-light">
                                <h5 className="card-title mb-0">GPA Tích Lũy</h5>
                            </div>
                            <div className="card-body">
                                <h3 className="text-primary mb-0">3.45</h3>
                                <small className="text-muted">Điểm trung bình tích lũy</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default StudentDashboard;