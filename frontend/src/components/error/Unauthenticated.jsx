import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const Unauthenticated = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        // Clear any remaining token data to ensure clean state
        localStorage.removeItem('accessToken');
        navigate('/login', { replace: true });
    };

    return (
        <Container className="min-vh-100 d-flex align-items-center justify-content-center">
            <Card className="text-center shadow" style={{ maxWidth: '400px', width: '100%' }}>
                <Card.Body className="p-5">
                    <div className="mb-4">
                        <FontAwesomeIcon 
                            icon={faExclamationTriangle} 
                            size="3x" 
                            className="text-warning"
                        />
                    </div>
                    
                    <h4 className="text-dark mb-3">Phiên Đăng Nhập Không Hợp Lệ</h4>
                    
                    <p className="text-muted mb-4">
                        Phiên đăng nhập của bạn không hợp lệ hoặc đã bị thay đổi. 
                        Vui lòng đăng nhập lại để đảm bảo an toàn.
                    </p>

                    <div className="alert alert-warning mb-4" role="alert">
                        <small>
                            <strong>Lưu ý:</strong> Việc thay đổi thông tin đăng nhập có thể gây rủi ro bảo mật.
                        </small>
                    </div>

                    <Button 
                        variant="primary" 
                        size="lg" 
                        onClick={handleLogin}
                        className="w-100"
                    >
                        <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                        Đăng Nhập Lại
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Unauthenticated; 