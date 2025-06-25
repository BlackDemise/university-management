import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {getToken, isTokenValid} from '../../utils/jwtUtil.js';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, userRole } = useAuth();
    const token = getToken();

    // If we have a token but it's invalid (malformed), clear it first
    if (token && !isTokenValid()) {
        localStorage.removeItem('accessToken');
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute; 