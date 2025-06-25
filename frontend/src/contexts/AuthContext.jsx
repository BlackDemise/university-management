import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, setToken, isTokenValid, getUserRole, getUserInfo } from '../utils/jwtUtil.js';
import { handleLogout as logoutUser } from '../utils/authUtil.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (token) {
            if (isTokenValid()) {
                setIsAuthenticated(true);
                setUserRole(getUserRole());
                setUser(getUserInfo());
            } else {
                // Token exists but is invalid - clear it
                console.log('🧹 AUTH CONTEXT: Clearing invalid token');
                localStorage.removeItem('accessToken');
                setIsAuthenticated(false);
                setUserRole(null);
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        setToken(token);
        setIsAuthenticated(true);
        setUserRole(getUserRole());
        setUser(getUserInfo());
    };

    const logout = async () => {
        await logoutUser();
        setIsAuthenticated(false);
        setUserRole(null);
        setUser(null);
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <p className="mt-2 text-muted">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};