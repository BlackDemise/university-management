let navigate = null;

export const setNavigate = (navigateFunction) => {
    navigate = navigateFunction;
    console.log('🧭 NAVIGATION SERVICE: Navigate function initialized');
};

export const navigateTo = (path, options = {}) => {
    if (navigate) {
        console.log(`🧭 NAVIGATION SERVICE: Navigating to ${path}`);
        navigate(path, options);
    } else {
        console.warn('⚠️ NAVIGATION SERVICE: navigate function not set, falling back to window.location');
        window.location.href = path;
    }
};

export const replaceRoute = (path) => {
    if (navigate) {
        console.log(`🧭 NAVIGATION SERVICE: Replacing route to ${path}`);
        navigate(path, { replace: true });
    } else {
        console.warn('⚠️ NAVIGATION SERVICE: navigate function not set, falling back to window.location');
        window.location.replace(path);
    }
}; 