import { Navbar, Container, Button, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faKey, faSignOutAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import styles from './HorizontalNavbar.module.css';

function HorizontalNavbar({ toggleSidebar, sidebarCollapsed }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    
    // Get user initials for avatar
    const getUserInitials = () => {
        if (!user || !user.fullName) return 'U';
        return user.fullName
            .split(' ')
            .map(name => name[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <Navbar bg="white" expand="lg" className={`${styles.topNavbar} shadow-sm fixed-top`}>
            <Container fluid className="px-4">
                <div className="d-flex align-items-center">
                    <Button
                        variant={sidebarCollapsed ? "light" : "primary"}
                        className={`${styles.sidebarToggler} me-3 d-flex align-items-center justify-content-center ${sidebarCollapsed ? "border" : "border-0"}`}
                        onClick={toggleSidebar}
                    >
                        <FontAwesomeIcon 
                            icon={sidebarCollapsed ? faBars : faTimes} 
                            className={sidebarCollapsed ? "text-primary" : "text-white"}
                        />
                    </Button>
                    <Navbar.Brand href="/" className="d-flex align-items-center">
                        <div className="brand-icon me-2">
                            <FontAwesomeIcon icon={faHome} className="text-primary" />
                        </div>
                        <div>
                            <h1 className={`${styles.brandName} mb-0`}>Uni</h1>
                        </div>
                    </Navbar.Brand>
                </div>

                <div className="ms-auto d-flex align-items-center">
                    <Dropdown align="end">
                        <Dropdown.Toggle as="div" className={`${styles.dropdownAvatar} dropdownAvatar`}>
                            <div className={styles.avatarCircle}>
                                <span className={styles.initials}>{getUserInitials()}</span>
                            </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="shadow-lg border-0">
                            <Dropdown.Item onClick={() => navigate('/change-password')}>
                                <FontAwesomeIcon icon={faKey} className="me-2 text-primary" />
                                Đổi Mật Khẩu
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleLogout}>
                                <FontAwesomeIcon icon={faSignOutAlt} className="me-2 text-danger" />
                                Đăng Xuất
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Container>
        </Navbar>
    );
}

export default HorizontalNavbar;