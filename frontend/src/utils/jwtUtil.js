import { jwtDecode } from 'jwt-decode';

/**
 * Get the access token from local storage
 * @returns {string|null} The access token or null if not found
 */
export const getToken = () => {
    return localStorage.getItem('accessToken');
};

/**
 * Set the access token in local storage
 * @param {string} token - The access token to store
 */
export const setToken = (token) => {
    localStorage.setItem('accessToken', token);
};

/**
 * Remove the access token from local storage
 */
export const removeToken = () => {
    localStorage.removeItem('accessToken');
};

/**
 * Check if the current token is valid (not expired)
 * @returns {boolean} True if the token is valid, false otherwise
 */
export const isTokenValid = () => {
    const token = getToken();
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    } catch {
        return false;
    }
};

/**
 * Get the user role from the JWT token
 * @returns {string|null} The user role or null if not available
 */
export const getUserRole = () => {
    const token = getToken();
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.role;
    } catch {
        return null;
    }
};

/**
 * Get user information from the JWT token
 * @returns {Object|null} User information object or null if not available
 */
export const getUserInfo = () => {
    const token = getToken();
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return {
            username: decoded.sub, // JWT standard uses 'sub' for subject/username
            role: decoded.role,
            email: decoded.email
        };
    } catch {
        return null;
    }
}; 