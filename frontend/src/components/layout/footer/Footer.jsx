import React from 'react';
import styles from './Footer.module.css';

function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <p className="mb-0">© {currentYear} Hệ Thống Quản Lý Trường Đại Học. Tất cả quyền được bảo lưu.</p>
            </div>
        </footer>
    );
}

export default Footer;
