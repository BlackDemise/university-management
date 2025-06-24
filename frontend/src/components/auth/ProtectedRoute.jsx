import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isTokenValid } from '../../utils/jwtUtil.js';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, userRole } = useAuth();

    if (!isAuthenticated || !isTokenValid()) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute; 