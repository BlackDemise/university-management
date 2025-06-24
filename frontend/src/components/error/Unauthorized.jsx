import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const Unauthorized = () => {
    const navigate = useNavigate();
    const { userRole, isAuthenticated, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleReturnToDashboard = () => {
        if (userRole === 'ADMIN') {
            navigate('/admin-dashboard');
        } else if (userRole === 'TEACHER') {
            navigate('/teacher-dashboard');
        } else if (userRole === 'STUDENT') {
            navigate('/student-dashboard');
        }
    };

    return (
        <div className="min-vh-100 bg-light d-flex flex-column justify-content-center py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="card shadow">
                            <div className="card-body p-4">
                                <div className="text-center">
                                    <h2 className="h3 fw-bold text-danger mb-4">
                                        Truy Cập Bị Từ Chối
                                    </h2>
                                    <p className="text-muted mb-4">
                                        Bạn không có quyền truy cập trang này. Vui lòng liên hệ với quản trị viên nếu bạn cho rằng đây là một sai sót.
                                    </p>
                                    <div className="d-grid gap-2">
                                        {isAuthenticated ? (
                                            <>
                                                <button
                                                    onClick={handleReturnToDashboard}
                                                    className="btn btn-primary"
                                                >
                                                    Quay Lại Trang Chủ
                                                </button>
                                                <button
                                                    onClick={handleLogout}
                                                    className="btn btn-outline-secondary"
                                                >
                                                    Đăng Xuất
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => navigate('/login')}
                                                className="btn btn-primary"
                                            >
                                                Đăng Nhập
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;