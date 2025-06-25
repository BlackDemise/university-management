import React, { useState } from 'react';
import { Button, Card, Alert } from 'react-bootstrap';
import { userService } from '../../services/apiService';

const TokenDebug = () => {
    const [testResult, setTestResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const getCurrentToken = () => {
        const token = localStorage.getItem('accessToken');
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
        localStorage.setItem('accessToken', expiredToken);
        setTestResult({ success: true, message: 'Token set to expired for testing' });
        console.log('🧪 TOKEN SET TO EXPIRED FOR TESTING');
    };

    const clearToken = () => {
        localStorage.removeItem('accessToken');
        setTestResult({ success: true, message: 'Token cleared' });
        console.log('🧪 TOKEN CLEARED');
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