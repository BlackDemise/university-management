import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { navigationManager } from '../services/NavigationManager.js';

const NavigationInitializer = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize the NavigationManager with React Router's navigate function
        navigationManager.setNavigate(navigate);
        
        console.log('🔗 NAVIGATION INITIALIZER: NavigationManager initialized');
    }, [navigate]);

    return children;
};

export default NavigationInitializer; 