import { removeToken } from './jwtUtil.js';
import authService from "../services/authService.js";

/**
 * Handles user logout by calling the logout API and removing the token
 * @returns {Promise<boolean>} True if logout was successful, false otherwise
 */
export const handleLogout = async () => {
    try {
        await authService.logout();
        removeToken();
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        removeToken();
        return false;
    }
}; 