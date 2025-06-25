/**
 * NavigationManager - Robust navigation service with queue support
 * 
 * This service ensures navigation always works, even if the router isn't ready yet.
 * It provides a reliable way for the AuthManager to trigger navigation without
 * worrying about React Router initialization timing.
 */
class NavigationManager {
    constructor() {
        this.navigate = null;
        this.pendingNavigation = [];
        this.isReady = false;
        
        console.log('🧭 NAVIGATION MANAGER: Initialized');
    }

    /**
     * Set the navigate function from useNavigate hook
     * @param {Function} navigateFunction - React Router navigate function
     */
    setNavigate(navigateFunction) {
        this.navigate = navigateFunction;
        this.isReady = true;
        
        console.log('🧭 NAVIGATION MANAGER: Navigate function set, router ready');
        
        // Process any pending navigations
        if (this.pendingNavigation.length > 0) {
            console.log(`🧭 NAVIGATION MANAGER: Processing ${this.pendingNavigation.length} pending navigation(s)`);
            
            this.pendingNavigation.forEach(({ path, options }, index) => {
                console.log(`🧭 NAVIGATION MANAGER: Processing pending navigation #${index + 1}: ${path}`);
                this.navigateTo(path, options);
            });
            
            this.pendingNavigation = [];
            console.log('🧭 NAVIGATION MANAGER: All pending navigations processed');
        }
    }

    /**
     * Navigate to a specific path
     * @param {string} path - Path to navigate to
     * @param {Object} options - Navigation options (e.g., replace: true)
     */
    navigateTo(path, options = {}) {
        if (!path) {
            console.warn('⚠️ NAVIGATION MANAGER: No path provided for navigation');
            return;
        }

        if (this.isReady && this.navigate) {
            console.log(`🧭 NAVIGATION MANAGER: Navigating to ${path}`, options);
            try {
                this.navigate(path, options);
            } catch (error) {
                console.error('❌ NAVIGATION MANAGER: Navigation error:', error);
                this._fallbackNavigate(path);
            }
        } else {
            console.log(`🧭 NAVIGATION MANAGER: Router not ready, queueing navigation to ${path}`);
            this.pendingNavigation.push({ path, options });
            
            // As a safety measure, set a timeout to use fallback navigation
            setTimeout(() => {
                if (this.pendingNavigation.some(nav => nav.path === path)) {
                    console.warn('⚠️ NAVIGATION MANAGER: Router still not ready after 2s, using fallback for:', path);
                    this._fallbackNavigate(path);
                    this.pendingNavigation = this.pendingNavigation.filter(nav => nav.path !== path);
                }
            }, 2000);
        }
    }

    /**
     * Replace current route (equivalent to navigate with replace: true)
     * @param {string} path - Path to navigate to
     */
    replaceRoute(path) {
        this.navigateTo(path, { replace: true });
    }

    /**
     * Fallback navigation using window.location
     * @param {string} path - Path to navigate to
     * @private
     */
    _fallbackNavigate(path) {
        console.log(`🧭 NAVIGATION MANAGER: Using fallback navigation to ${path}`);
        
        try {
            // For SPA routing, we need to handle paths correctly
            const baseUrl = window.location.origin;
            const fullUrl = path.startsWith('/') ? `${baseUrl}${path}` : `${baseUrl}/${path}`;
            
            window.location.href = fullUrl;
        } catch (error) {
            console.error('❌ NAVIGATION MANAGER: Fallback navigation failed:', error);
        }
    }

    /**
     * Go back in history
     */
    goBack() {
        if (this.isReady && this.navigate) {
            console.log('🧭 NAVIGATION MANAGER: Going back in history');
            this.navigate(-1);
        } else {
            console.log('🧭 NAVIGATION MANAGER: Using fallback back navigation');
            window.history.back();
        }
    }

    /**
     * Check if navigation is ready
     * @returns {boolean} True if navigation is ready
     */
    isNavigationReady() {
        return this.isReady;
    }

    /**
     * Get number of pending navigations
     * @returns {number} Number of pending navigations
     */
    getPendingNavigationCount() {
        return this.pendingNavigation.length;
    }

    /**
     * Clear all pending navigations (useful for cleanup)
     */
    clearPendingNavigations() {
        const count = this.pendingNavigation.length;
        this.pendingNavigation = [];
        
        if (count > 0) {
            console.log(`🧹 NAVIGATION MANAGER: Cleared ${count} pending navigation(s)`);
        }
    }

    /**
     * Reset the navigation manager (useful for testing)
     */
    reset() {
        this.navigate = null;
        this.isReady = false;
        this.clearPendingNavigations();
        console.log('🔄 NAVIGATION MANAGER: Reset complete');
    }

    /**
     * Cleanup method
     */
    destroy() {
        this.clearPendingNavigations();
        this.navigate = null;
        this.isReady = false;
        console.log('🧹 NAVIGATION MANAGER: Destroyed');
    }
}

// Create singleton instance
export const navigationManager = new NavigationManager();

// Export class for testing
export { NavigationManager }; 