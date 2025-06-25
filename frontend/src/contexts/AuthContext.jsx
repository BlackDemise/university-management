import { createContext, useContext, useState, useEffect } from 'react';
import { authManager } from '../services/AuthManager.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Initialize state from AuthManager
    const [authState, setAuthState] = useState(() => {
        const currentState = authManager.getAuthState();
        console.log('🔄 AUTH CONTEXT: Initialized with AuthManager state:', currentState);
        return currentState;
    });

    useEffect(() => {
        console.log('🔄 AUTH CONTEXT: Setting up AuthManager event subscriptions...');
        
        // Subscribe to AuthManager events
        const unsubscribe = authManager.subscribe((event, data) => {
            console.log(`📡 AUTH CONTEXT: Received AuthManager event: ${event}`, data);
            
            switch (event) {
                case 'AUTH_STATE_CHANGED':
                    console.log('🔄 AUTH CONTEXT: Updating state from AuthManager');
                    setAuthState(data);
                    break;
                    
                case 'AUTH_INITIALIZED':
                    console.log('🚀 AUTH CONTEXT: AuthManager initialization complete');
                    setAuthState(data);
                    break;
                    
                case 'TOKEN_REFRESHED':
                    console.log('🔄 AUTH CONTEXT: Token refreshed successfully');
                    // State will be updated via AUTH_STATE_CHANGED event
                    break;
                    
                case 'TOKEN_REFRESH_FAILED':
                    console.log('❌ AUTH CONTEXT: Token refresh failed');
                    // State will be updated via AUTH_STATE_CHANGED event
                    break;
                    
                default:
                    // Log other events for debugging but don't handle them
                    console.log(`📝 AUTH CONTEXT: Observed event: ${event}`);
                    break;
            }
        });

        console.log('✅ AUTH CONTEXT: Event subscriptions established');

        // Cleanup subscription on unmount
        return () => {
            console.log('🧹 AUTH CONTEXT: Cleaning up event subscriptions');
            unsubscribe();
        };
    }, []);

    // Login function - delegate to AuthManager
    const login = async (token) => {
        console.log('🔐 AUTH CONTEXT: Login requested, delegating to AuthManager');
        const success = await authManager.login(token);
        
        if (success) {
            console.log('✅ AUTH CONTEXT: Login successful');
        } else {
            console.log('❌ AUTH CONTEXT: Login failed');
        }
        
        return success;
    };

    // Logout function - delegate to AuthManager
    const logout = async () => {
        console.log('🚪 AUTH CONTEXT: Logout requested, delegating to AuthManager');
        
        try {
            await authManager.logout();
            console.log('✅ AUTH CONTEXT: Logout successful');
        } catch (error) {
            console.error('❌ AUTH CONTEXT: Logout error:', error);
        }
    };

    // Show loading spinner while AuthManager is initializing
    if (!authState.isInitialized) {
        console.log('⏳ AUTH CONTEXT: Waiting for AuthManager initialization...');
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <p className="mt-2 text-muted">Đang khởi tạo xác thực...</p>
                </div>
            </div>
        );
    }

    // Extract values for cleaner provider value
    const { isAuthenticated, user, userRole } = authState;

    const contextValue = {
        // Auth state (reactive to AuthManager)
        isAuthenticated,
        userRole,
        user,
        
        // Auth actions (delegate to AuthManager)
        login,
        logout,
        
        // Additional state for components that might need it
        isRefreshing: authState.isRefreshing,
        isInitialized: authState.isInitialized
    };

    console.log('🎯 AUTH CONTEXT: Providing context value:', {
        isAuthenticated,
        userRole,
        username: user?.username,
        isRefreshing: authState.isRefreshing
    });

    return (
        <AuthContext.Provider value={contextValue}>
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