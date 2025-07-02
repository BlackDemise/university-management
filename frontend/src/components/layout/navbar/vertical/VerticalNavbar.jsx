// frontend/src/components/layout/navbar/vertical/VerticalNavbar.jsx
import { useState, useEffect } from 'react';
import { Nav, Button, Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes, faTachometerAlt, faUsers, faGraduationCap,
    faClipboardList, faBook, faClipboardCheck, faCalendarCheck,
    faChartBar, faCalendar, faCog, faBuilding, faChevronDown, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './VerticalNavbar.module.css';
import {useAuth} from "../../../../contexts/AuthContext.jsx";

function VerticalNavbar({ sidebarCollapsed, toggleSidebar, activeMenu, setActiveMenu }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { userRole } = useAuth();
    const [expandedMenus, setExpandedMenus] = useState({});
    const [submenuToParentMap, setSubmenuToParentMap] = useState({});

    // ========================================
    // NAVIGATION ITEMS BY ROLE
    // ========================================

    const getNavigationItems = () => {
        const commonDashboard = {
            id: 'dashboard',
            icon: faTachometerAlt,
            title: 'Bảng Điều Khiển',
            path: getDashboardPath()
        };

        switch (userRole) {
            case 'ADMIN':
                return [
                    commonDashboard,
                    {
                        id: 'users',
                        icon: faUsers,
                        title: 'Quản Lý Người Dùng',
                        path: '/admin/users/all'
                    },
                    {
                        id: 'academic',
                        icon: faGraduationCap,
                        title: 'Quản Lý Học Vụ',
                        path: '/admin/academic',
                        submenu: [
                            { id: 'departments', title: 'Khoa/Phòng Ban', path: '/admin/academic/departments' },
                            { id: 'majors', title: 'Ngành Học', path: '/admin/academic/majors' },
                            { id: 'courses', title: 'Môn Học', path: '/admin/academic/courses' },
                            { id: 'curriculum', title: 'Chương Trình Đào Tạo', path: '/admin/academic/program-curriculum' },
                            { id: 'prerequisites', title: 'Môn Tiên Quyết', path: '/admin/academic/prerequisites' },
                            { id: 'department-members', title: 'Thành Viên Khoa', path: '/admin/academic/department-members' }
                        ]
                    },
                    {
                        id: 'enrollment',
                        icon: faClipboardList,
                        title: 'Quản Lý Đăng Ký',
                        path: '/admin/enrollment',
                        submenu: [
                            { id: 'semesters', title: 'Học Kỳ', path: '/admin/enrollment/semesters' },
                            { id: 'course-offerings', title: 'Lớp Học Phần', path: '/admin/enrollment/course-offerings' },
                            { id: 'registrations', title: 'Đăng Ký Môn Học', path: '/admin/enrollment/registrations' }
                        ]
                    },
                    {
                        id: 'assessment',
                        icon: faClipboardCheck,
                        title: 'Quản Lý Đánh Giá',
                        path: '/admin/assessment',
                        submenu: [
                            { id: 'grades', title: 'Quản Lý Điểm', path: '/admin/assessment/grades' },
                            { id: 'sessions', title: 'Buổi Học', path: '/admin/assessment/sessions' },
                            { id: 'attendance', title: 'Điểm Danh', path: '/admin/assessment/attendance' }
                        ]
                    },
                    {
                        id: 'facilities',
                        icon: faBuilding,
                        title: 'Quản Lý Cơ Sở',
                        path: '/admin/facilities',
                        submenu: [
                            { id: 'classrooms', title: 'Phòng Học', path: '/admin/facility/classrooms' }
                        ]
                    },
                    {
                        id: 'reports',
                        icon: faChartBar,
                        title: 'Báo Cáo & Thống Kê',
                        path: '/admin/reports',
                        submenu: [
                            { id: 'enrollment-stats', title: 'Thống Kê Đăng Ký', path: '/admin/reports/enrollment' },
                            { id: 'grade-reports', title: 'Báo Cáo Điểm', path: '/admin/reports/grades' },
                            { id: 'attendance-reports', title: 'Báo Cáo Điểm Danh', path: '/admin/reports/attendance' }
                        ]
                    },
                    {
                        id: 'settings',
                        icon: faCog,
                        title: 'Cài Đặt Hệ Thống',
                        path: '/admin/settings'
                    }
                ];

            case 'TEACHER':
                return [
                    commonDashboard,
                    {
                        id: 'my-courses',
                        icon: faBook,
                        title: 'Môn Học Của Tôi',
                        path: '/teacher/courses'
                    },
                    {
                        id: 'grading',
                        icon: faClipboardCheck,
                        title: 'Chấm Điểm',
                        path: '/teacher/grades',
                        submenu: [
                            { id: 'grade-entry', title: 'Nhập Điểm', path: '/teacher/grades/entry' },
                            { id: 'grade-review', title: 'Xem Lại Điểm', path: '/teacher/grades/review' }
                        ]
                    },
                    {
                        id: 'attendance',
                        icon: faCalendarCheck,
                        title: 'Điểm Danh',
                        path: '/teacher/attendance'
                    },
                    {
                        id: 'schedule',
                        icon: faCalendar,
                        title: 'Lịch Giảng Dạy',
                        path: '/teacher/schedule'
                    }
                ];

            case 'STUDENT':
                return [
                    commonDashboard,
                    {
                        id: 'registration',
                        icon: faClipboardList,
                        title: 'Đăng Ký Môn Học',
                        path: '/student/registration'
                    },
                    {
                        id: 'my-grades',
                        icon: faChartBar,
                        title: 'Điểm Số Của Tôi',
                        path: '/student/grades'
                    },
                    {
                        id: 'my-schedule',
                        icon: faCalendar,
                        title: 'Thời Khóa Biểu',
                        path: '/student/schedule'
                    },
                    {
                        id: 'my-courses',
                        icon: faBook,
                        title: 'Môn Học Của Tôi',
                        path: '/student/courses'
                    }
                ];

            default:
                return [commonDashboard];
        }
    };

    const getDashboardPath = () => {
        switch (userRole) {
            case 'ADMIN': return '/admin-dashboard';
            case 'TEACHER': return '/teacher-dashboard';
            case 'STUDENT': return '/student-dashboard';
            default: return '/login';
        }
    };

    // Initialize submenuToParentMap
    useEffect(() => {
        const newSubmenuToParentMap = {};
        getNavigationItems().forEach(item => {
            if (item.submenu) {
                item.submenu.forEach(subItem => {
                    newSubmenuToParentMap[subItem.id] = item.id;
                    newSubmenuToParentMap[subItem.path] = item.id;
                });
            }
        });
        setSubmenuToParentMap(newSubmenuToParentMap);
    }, [userRole]);

    // Handle initial path and navigation changes
    useEffect(() => {
        const currentPath = location.pathname;
        
        // Find matching navigation item
        const allItems = getNavigationItems().flatMap(item => 
            item.submenu ? [...item.submenu, item] : [item]
        );
        
        const activeItem = allItems.find(item => item.path === currentPath);
        
        if (activeItem) {
            setActiveMenu(activeItem.id);
            // If it's a submenu item, expand its parent
            const parentId = submenuToParentMap[activeItem.id] || submenuToParentMap[activeItem.path];
            if (parentId) {
                setExpandedMenus(prev => ({
                    ...prev,
                    [parentId]: true
                }));
            }
        }
    }, [location.pathname, submenuToParentMap]);

    // ========================================
    // EVENT HANDLERS
    // ========================================

    const handleNavigation = (item) => {
        // If it has submenu, toggle expansion instead of navigation
        if (item.submenu && item.submenu.length > 0) {
            toggleSubmenu(item.id);
            return;
        }

        // Navigate to the page
        setActiveMenu(item.id);
        navigate(item.path);
    };

    const handleSubmenuNavigation = (parentId, submenuItem) => {
        setActiveMenu(submenuItem.id);
        // Ensure parent menu is expanded
        setExpandedMenus(prev => ({
            ...prev,
            [parentId]: true
        }));
        navigate(submenuItem.path);
    };

    const toggleSubmenu = (menuId) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    const isMenuActive = (item) => {
        if (item.path === location.pathname) return true;
        if (item.submenu) {
            return item.submenu.some(subItem => 
                subItem.path === location.pathname
            );
        }
        return activeMenu === item.id;
    };

    const navItems = getNavigationItems();

    // ========================================
    // RENDER COMPONENT
    // ========================================

    return (
        <div className={`${styles.sidebar} bg-white shadow-sm ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
            <div className={styles.sidebarSticky}>
                {/* Mobile close button */}
                <div className="d-flex justify-content-end px-3 d-lg-none">
                    <Button
                        variant="light"
                        size="sm"
                        onClick={toggleSidebar}
                        className="mb-3 border-0"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </Button>
                </div>

                {/* Navigation items */}
                <Nav className="flex-column">
                    {navItems.map((item) => (
                        <div key={item.id}>
                            {/* Main menu item */}
                            <Nav.Link
                                className={`${styles.sidebarLink} ${isMenuActive(item) ? styles.sidebarLinkActive : ''}`}
                                onClick={() => handleNavigation(item)}
                            >
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <div className={`${styles.navIcon} ${isMenuActive(item) ? styles.activeIcon : ''}`}>
                                            <FontAwesomeIcon icon={item.icon} />
                                        </div>
                                        <span>{item.title}</span>
                                    </div>

                                    {/* Submenu indicator */}
                                    {item.submenu && item.submenu.length > 0 && (
                                        <FontAwesomeIcon
                                            icon={expandedMenus[item.id] ? faChevronDown : faChevronRight}
                                            size="sm"
                                        />
                                    )}
                                </div>
                                {isMenuActive(item) && <div className={styles.activeIndicator}></div>}
                            </Nav.Link>

                            {/* Submenu items */}
                            {item.submenu && item.submenu.length > 0 && (
                                <Collapse in={expandedMenus[item.id]}>
                                    <div>
                                        {item.submenu.map((submenuItem) => (
                                            <Nav.Link
                                                key={submenuItem.id}
                                                className={`${styles.submenuLink} ${activeMenu === submenuItem.id ? styles.submenuLinkActive : ''}`}
                                                onClick={() => handleSubmenuNavigation(item.id, submenuItem)}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <div className={styles.submenuIcon}>
                                                        <span>•</span>
                                                    </div>
                                                    <span>{submenuItem.title}</span>
                                                </div>
                                            </Nav.Link>
                                        ))}
                                    </div>
                                </Collapse>
                            )}
                        </div>
                    ))}
                </Nav>
            </div>
        </div>
    );
}

export default VerticalNavbar;