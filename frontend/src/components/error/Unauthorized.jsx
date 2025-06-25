import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext.jsx';
import {isTokenValid} from "../../utils/jwtUtil.js";

const Unauthorized = () => {
    const navigate = useNavigate();
    const {userRole, isAuthenticated, logout} = useAuth();
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleReturnToDashboard = () => {
        console.log('🔍 Return to dashboard clicked');

        const token = localStorage.getItem('accessToken');
        const tokenValid = token ? isTokenValid() : false;

        console.log('🔍 Auth state:', {
            isAuthenticated,
            userRole,
            tokenExists: !!token,
            tokenValid
        });

        // If token is missing or invalid, but AuthContext thinks we're authenticated
        if ((!token || !tokenValid) && isAuthenticated) {
            console.log('🔄 STATE MISMATCH: Clearing AuthContext state');
            logout();
            navigate('/login', { replace: true });
            return;
        }

        if (!isAuthenticated) {
            console.log('❌ Not authenticated - going to login');
            navigate('/login', { replace: true });
            return;
        }

        // Navigate to appropriate dashboard based on user's ACTUAL role
        console.log(`✅ Authenticated as ${userRole} - navigating to appropriate dashboard`);

        if (userRole === 'ADMIN') {
            navigate('/admin-dashboard');
        } else if (userRole === 'TEACHER') {
            navigate('/teacher-dashboard');
        } else if (userRole === 'STUDENT') {
            navigate('/student-dashboard');
        } else {
            console.log('❌ Unknown role - redirecting to login');
            navigate('/login', { replace: true });
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
                                        Không Có Quyền Truy Cập
                                    </h2>
                                    <p className="text-muted mb-4">
                                        Bạn đã đăng nhập thành công nhưng không có quyền truy cập tài nguyên này. 
                                        Vui lòng quay lại trang chủ phù hợp với vai trò của bạn.
                                    </p>
                                    <div className="alert alert-info mb-3" role="alert">
                                        <small>
                                            <strong>Ghi chú:</strong> Đây là vấn đề về phân quyền, không phải đăng nhập.
                                        </small>
                                    </div>
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