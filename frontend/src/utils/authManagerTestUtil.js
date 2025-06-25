import { authManager } from '../services/AuthManager.js';

/**
 * Utility functions for testing AuthManager functionality during development
 * This file helps verify that the new AuthManager is working correctly
 */

/**
 * Test AuthManager initialization and basic functionality
 */
export const testAuthManager = () => {
    console.log('🧪 TESTING AUTH MANAGER...');
    
    // Test 1: Check initialization
    console.log('📋 Test 1: Initialization');
    console.log('- Auth State:', authManager.getAuthState());
    console.log('- Is Authenticated:', authManager.isAuthenticated());
    console.log('- User Role:', authManager.getUserRole());
    console.log('- Is Initialized:', authManager.isInitialized());
    
    // Test 2: Event system
    console.log('📋 Test 2: Event System');
    const unsubscribe = authManager.subscribe((event, data) => {
        console.log(`🎉 AUTH EVENT: ${event}`, data);
    });
    
    // Test 3: Token validation
    console.log('📋 Test 3: Token Validation');
    const currentToken = authManager.getToken();
    console.log('- Current Token:', currentToken ? 'Present' : 'None');
    console.log('- Token Valid:', authManager.isTokenValid());
    
    // Test 4: User extraction
    console.log('📋 Test 4: User Extraction');
    const user = authManager.getUserFromToken();
    console.log('- User from Token:', user);
    
    console.log('✅ AUTH MANAGER TESTS COMPLETE');
    
    // Return unsubscribe function for cleanup
    return unsubscribe;
};

/**
 * Test error scenarios
 */
export const testAuthManagerErrors = () => {
    console.log('🧪 TESTING AUTH MANAGER ERROR SCENARIOS...');
    
    // Test malformed token
    console.log('📋 Test: Malformed Token');
    localStorage.setItem('accessToken', 'invalid-token');
    console.log('- Is Valid:', authManager.isTokenValid());
    
    // Test expired token (this would need a real expired token)
    console.log('📋 Test: Token Validation Edge Cases');
    console.log('- Empty Token Valid:', authManager.isTokenValid(''));
    console.log('- Null Token Valid:', authManager.isTokenValid(null));
    
    // Clean up
    localStorage.removeItem('accessToken');
    console.log('✅ ERROR SCENARIO TESTS COMPLETE');
};

/**
 * Monitor AuthManager events for debugging
 */
export const monitorAuthEvents = () => {
    console.log('👀 MONITORING AUTH EVENTS...');
    
    const unsubscribe = authManager.subscribe((event, data) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`🕐 [${timestamp}] AUTH EVENT: ${event}`, data);
        
        // Log specific event types with more detail
        switch (event) {
            case 'AUTH_STATE_CHANGED':
                console.log('   → Auth State:', data.isAuthenticated);
                console.log('   → User Role:', data.userRole);
                console.log('   → User:', data.user?.username);
                break;
            case 'TOKEN_REFRESHING':
                console.log('   → Refreshing:', data);
                break;
            case 'TOKEN_REFRESHED':
                console.log('   → New Token Length:', data?.length);
                break;
            case 'NAVIGATE_TO':
                console.log('   → Navigation Target:', data);
                break;
        }
    });
    
    console.log('📡 Event monitoring started. Call the returned function to stop.');
    return unsubscribe;
};

/**
 * Simulate different auth scenarios for testing
 */
export const simulateAuthScenarios = {
    /**
     * Simulate a successful login
     */
    login: async () => {
        console.log('🎭 SIMULATING: Login scenario');
        // This would need a valid token from your backend
        console.log('ℹ️ Note: Need a real token from backend for full test');
    },
    
    /**
     * Simulate a logout
     */
    logout: async () => {
        console.log('🎭 SIMULATING: Logout scenario');
        await authManager.logout();
    },
    
    /**
     * Simulate token expiration
     */
    tokenExpiration: () => {
        console.log('🎭 SIMULATING: Token expiration');
        // Create an expired token for testing
        const expiredPayload = {
            sub: 'test-user',
            role: 'STUDENT',
            email: 'test@example.com',
            exp: Math.floor(Date.now() / 1000) - 3600 // Expired 1 hour ago
        };
        
        // Note: This is just for demonstration - real JWT creation would need proper signing
        console.log('ℹ️ Expired token simulation (would need real JWT for full test)');
    },
    
    /**
     * Simulate malformed token (punishment flow)
     */
    malformedToken: () => {
        console.log('🎭 SIMULATING: Malformed token (punishment flow)');
        localStorage.setItem('accessToken', 'malformed-token');
        
        // Test validation
        const isValid = authManager.isTokenValid();
        console.log('- Malformed token validation result:', isValid);
        console.log('💀 Any API call should now trigger /unauthenticated + logout');
        
        // Cleanup after delay
        setTimeout(() => {
            localStorage.removeItem('accessToken');
            console.log('🧹 Malformed token cleaned up');
        }, 5000);
    },

    /**
     * Simulate artificially expired token (like TokenDebug button) - punishment flow
     */
    artificiallyExpiredToken: () => {
        console.log('🎭 SIMULATING: Artificially expired token (like TokenDebug "Set Expired Token" button)');
        
        // Use the same token as TokenDebug component
        const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.expired';
        authManager.setToken(expiredToken);
        
        // Test validation
        const isValid = authManager.isTokenValid();
        console.log('- Artificially expired token validation result:', isValid);
        console.log('💀 This should trigger /unauthenticated + logout (not /unauthorized)');
        
        // Make a test API call to trigger the flow
        console.log('🔥 Making test API call to verify punishment flow...');
        import('../services/apiService.js').then(({ userService }) => {
            userService.getAllUsers().catch((error) => {
                console.log('✅ Expected error, should trigger punishment flow:', error.message);
            });
        });
    },

    /**
     * Simulate no token scenario (punishment flow)
     */
    noToken: async () => {
        console.log('🎭 SIMULATING: No token (punishment flow)');
        
        // Remove any existing token
        localStorage.removeItem('accessToken');
        console.log('❌ Token removed - any API call should now trigger /unauthenticated + logout');
        
        // Make a test API call to trigger the flow
        console.log('🔥 Making test API call to trigger punishment flow...');
        try {
            const { userService } = await import('../services/apiService.js');
            await userService.getAllUsers();
        } catch (error) {
            console.log('✅ Expected error triggered punishment flow:', error.message);
        }
    },
    
    /**
     * Test API interceptor integration
     */
    testApiIntegration: async () => {
        console.log('🎭 SIMULATING: API Interceptor integration test');
        
        try {
            // Import API service
            const { userService } = await import('../services/apiService.js');
            
            console.log('📡 Making test API call to trigger interceptors...');
            const response = await userService.getAllUsers({ page: 0, size: 1 });
            
            console.log('✅ API call successful - interceptors working properly');
            console.log('📊 Response:', { 
                status: 'success', 
                userCount: response.result?.content?.length || 0 
            });
            
        } catch (error) {
            console.log('❌ API call failed:', error.message);
            console.log('🔍 This might trigger AuthManager error handling...');
        }
    }
};

/**
 * Get current auth manager state summary
 */
export const getAuthSummary = () => {
    const state = authManager.getAuthState();
    const token = authManager.getToken();
    
    return {
        isAuthenticated: state.isAuthenticated,
        userRole: state.userRole,
        username: state.user?.username,
        hasToken: !!token,
        tokenValid: authManager.isTokenValid(),
        isInitialized: state.isInitialized,
        isRefreshing: state.isRefreshing
    };
};

// Auto-start monitoring in development
if (import.meta.env.DEV) {
    console.log('🔧 DEV MODE: AuthManager test utilities available');
    console.log('💡 Use: testAuthManager(), monitorAuthEvents(), getAuthSummary()');
    
    // Expose functions globally for easy testing in browser console
    window.authManagerTest = {
        test: testAuthManager,
        testErrors: testAuthManagerErrors,
        monitor: monitorAuthEvents,
        simulate: simulateAuthScenarios,
        summary: getAuthSummary,
        manager: authManager
    };
    
    console.log('🌐 Test functions available globally as window.authManagerTest');
} 