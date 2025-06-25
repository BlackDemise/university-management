import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { authService } from '../../services/apiService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, isAuthenticated, userRole } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            if (userRole === 'ADMIN') {
                navigate('/admin-dashboard');
            } else if (userRole === 'TEACHER') {
                navigate('/teacher-dashboard');
            } else if (userRole === 'STUDENT') {
                navigate('/student-dashboard');
            }
        }
    }, [isAuthenticated, userRole, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('🔐 LOGIN: Attempting login for email:', email);
            
            // Call backend login API
            const data = await authService.login({ email, password });
            console.log('✅ LOGIN: Backend login successful');
            
            // Use new async login function from AuthContext
            const loginSuccess = await login(data.accessToken);
            
            if (loginSuccess) {
                console.log('✅ LOGIN: AuthManager login successful');
                // Navigation will be handled by the useEffect hook when userRole updates
            } else {
                console.log('❌ LOGIN: AuthManager login failed');
                setError('Đăng nhập thất bại. Token không hợp lệ.');
            }
        } catch (err) {
            console.error('❌ LOGIN: Login error:', err);
            setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-4">
            <div className="w-100" style={{ maxWidth: '400px' }}>
                <div className="card shadow">
                    <div className="card-body p-4">
                        <div className="text-center mb-4">
                            <h2 className="h3 fw-bold text-dark">
                                Hệ Thống Quản Lý Trường Đại Học
                            </h2>
                            <p className="text-muted">Vui lòng đăng nhập vào tài khoản của bạn</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    Địa chỉ Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="form-control"
                                    placeholder="Nhập địa chỉ email của bạn"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">
                                    Mật khẩu
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="form-control"
                                    placeholder="Nhập mật khẩu của bạn"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <div className="d-grid">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg"
                                    disabled={loading}
                                >
                                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;