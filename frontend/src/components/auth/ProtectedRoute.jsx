import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, userRole, isInitialized } = useAuth();

    console.log('🛡️ PROTECTED ROUTE: Checking access', {
        isAuthenticated,
        userRole,
        requiredRole,
        isInitialized
    });

    // Wait for AuthManager initialization to complete
    if (!isInitialized) {
        console.log('⏳ PROTECTED ROUTE: Waiting for auth initialization...');
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <p className="mt-2 text-muted">Đang kiểm tra quyền truy cập...</p>
                </div>
            </div>
        );
    }

    // Check authentication - AuthManager is the single source of truth
    if (!isAuthenticated) {
        console.log('❌ PROTECTED ROUTE: User not authenticated, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    // Check authorization (role-based access)
    if (requiredRole && userRole !== requiredRole) {
        console.log('🚫 PROTECTED ROUTE: Insufficient permissions', {
            required: requiredRole,
            actual: userRole
        });
        return <Navigate to="/unauthorized" replace />;
    }

    console.log('✅ PROTECTED ROUTE: Access granted');
    return children;
};

export default ProtectedRoute; 