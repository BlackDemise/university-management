import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setNavigate } from '../services/navigationService';

const NavigationInitializer = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // Set the navigate function for the navigation service
        setNavigate(navigate);
    }, [navigate]);

    return children;
};

export default NavigationInitializer; 