import { useState, useEffect } from 'react';
import HorizontalNavbar from "../navbar/horizontal/HorizontalNavbar.jsx";
import VerticalNavbar from "../navbar/vertical/VerticalNavbar.jsx";
import Footer from "../footer/Footer.jsx";
import styles from './MainLayout.module.css';

function MainLayout({ children, activeMenu = 'dashboard' }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [localActiveMenu, setLocalActiveMenu] = useState(activeMenu);

    useEffect(() => {
        setLocalActiveMenu(activeMenu);
    }, [activeMenu]);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className={styles.layoutWrapper}>
            {/* Top Navbar */}
            <HorizontalNavbar 
                toggleSidebar={toggleSidebar} 
                sidebarCollapsed={sidebarCollapsed} 
            />

            {/* Sidebar */}
            <VerticalNavbar
                sidebarCollapsed={sidebarCollapsed}
                toggleSidebar={toggleSidebar}
                activeMenu={localActiveMenu}
                setActiveMenu={setLocalActiveMenu}
            />

            {/* Main Content */}
            <div 
                className={`${styles.mainContent} ${sidebarCollapsed ? styles.mainContentExpanded : ''}`}
            >
                {children}
                
                {/* Footer */}
                <div className={styles.footerContainer}>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default MainLayout; 