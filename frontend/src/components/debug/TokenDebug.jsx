import React, { useState, useEffect } from 'react';
import { Button, Card, Alert } from 'react-bootstrap';
import { userService } from '../../services/apiService';
import { authManager } from '../../services/AuthManager.js';

const TokenDebug = () => {
    const [testResult, setTestResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [authState, setAuthState] = useState(authManager.getAuthState());

    useEffect(() => {
        // Subscribe to AuthManager events for real-time updates
        const unsubscribe = authManager.subscribe((event, data) => {
            console.log(`🧪 TOKEN DEBUG: AuthManager event: ${event}`);
            setAuthState(authManager.getAuthState());
        });

        return unsubscribe;
    }, []);

    const getCurrentToken = () => {
        const token = authManager.getToken();
        return token ? `${token.substring(0, 30)}...` : 'No token found';
    };

    const testAPICall = async () => {
        setLoading(true);
        setTestResult(null);
        
        try {
            console.log('🧪 TESTING API CALL - Starting...');
            const response = await userService.getAllUsers({ page: 0, size: 5 });
            
            setTestResult({
                success: true,
                message: 'API call successful!',
                data: response
            });
            console.log('✅ TEST SUCCESS:', response);
        } catch (error) {
            setTestResult({
                success: false,
                message: 'API call failed',
                error: error.message
            });
            console.log('❌ TEST FAILED:', error);
        } finally {
            setLoading(false);
        }
    };

    const expireToken = () => {
        // Set an obviously expired token for testing
        const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.expired';
        authManager.setToken(expiredToken);
        setTestResult({ success: true, message: 'Token set to expired for testing' });
        console.log('🧪 TOKEN DEBUG: Token set to expired for testing');
    };

    const clearToken = () => {
        authManager.removeToken();
        setTestResult({ success: true, message: 'Token cleared' });
        console.log('🧪 TOKEN DEBUG: Token cleared');
    };

    return (
        <Card className="m-3">
            <Card.Header>
                <h5>🧪 Token Refresh Debug Tool</h5>
            </Card.Header>
            <Card.Body>
                <div className="mb-3">
                    <strong>Current Token:</strong><br />
                    <code>{getCurrentToken()}</code>
                </div>

                <div className="mb-3">
                    <strong>AuthManager State:</strong>
                    <div className="bg-light p-2 rounded mt-1">
                        <small>
                            <div>Authenticated: <span className={authState.isAuthenticated ? 'text-success' : 'text-danger'}>{authState.isAuthenticated ? 'Yes' : 'No'}</span></div>
                            <div>Role: <span className="text-primary">{authState.userRole || 'None'}</span></div>
                            <div>User: <span className="text-info">{authState.user?.username || 'None'}</span></div>
                            <div>Refreshing: <span className={authState.isRefreshing ? 'text-warning' : 'text-muted'}>{authState.isRefreshing ? 'Yes' : 'No'}</span></div>
                            <div>Initialized: <span className={authState.isInitialized ? 'text-success' : 'text-warning'}>{authState.isInitialized ? 'Yes' : 'No'}</span></div>
                        </small>
                    </div>
                </div>

                <div className="d-flex gap-2 mb-3 flex-wrap">
                    <Button 
                        variant="primary" 
                        onClick={testAPICall}
                        disabled={loading}
                    >
                        {loading ? 'Testing...' : 'Test API Call'}
                    </Button>
                    
                    <Button 
                        variant="warning" 
                        onClick={expireToken}
                    >
                        Set Expired Token
                    </Button>
                    
                    <Button 
                        variant="danger" 
                        onClick={clearToken}
                    >
                        Clear Token
                    </Button>
                </div>

                {testResult && (
                    <Alert variant={testResult.success ? 'success' : 'danger'}>
                        <strong>{testResult.success ? '✅ Success:' : '❌ Error:'}</strong> {testResult.message}
                        {testResult.error && (
                            <div className="mt-2">
                                <small>Error: {testResult.error}</small>
                            </div>
                        )}
                        {testResult.data && (
                            <div className="mt-2">
                                <small>Response received with {testResult.data.result?.content?.length || 0} users</small>
                            </div>
                        )}
                    </Alert>
                )}

                <div className="mt-3">
                    <h6>🔍 Testing Instructions:</h6>
                    <ol>
                        <li><strong>Normal Test:</strong> Click "Test API Call" with valid token</li>
                        <li><strong>Expired Token Test:</strong> Click "Set Expired Token", then "Test API Call" to trigger refresh</li>
                        <li><strong>No Token Test:</strong> Click "Clear Token", then "Test API Call"</li>
                    </ol>
                    <p className="text-muted">
                        <small>Watch the browser console for detailed logs of the token refresh process!</small>
                    </p>
                </div>
            </Card.Body>
        </Card>
    );
};

export default TokenDebug; 