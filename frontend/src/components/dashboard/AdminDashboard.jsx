import { useAuth } from '../../contexts/AuthContext.jsx';
import MainLayout from '../layout/main/MainLayout.jsx';
import TokenDebug from '../debug/TokenDebug.jsx';

const AdminDashboard = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <MainLayout activeMenu="dashboard">
            <div className="container-fluid py-4">
                {/* Your existing dashboard content here */}
                <div className="row">
                    <div className="col-12">
                        <h1 className="h3 fw-bold text-primary">Bảng Điều Khiển Quản Trị Viên</h1>
                        <p className="text-muted">Chào mừng bạn đến với hệ thống quản lý trường đại học</p>
                    </div>
                </div>
                
                {/* Token Debug Component - Remove this in production */}
                <div className="row">
                    <div className="col-12">
                        <TokenDebug />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default AdminDashboard;