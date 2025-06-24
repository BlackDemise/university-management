/**
 * Format a date string or object to a localized date format
 * @param {string|Date} dateString - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
    if (!dateString) return 'N/A';
    
    const defaultOptions = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit'
    };
    
    const dateOptions = { ...defaultOptions, ...options };
    
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', dateOptions).format(date);
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
};

/**
 * Format price with currency
 * @param {number} price - The price to format
 * @param {string} currency - Currency code
 * @param {boolean} showZeroWhenNull - Whether to show '0' or 'Chưa có giá' when price is null/undefined
 * @returns {string} Formatted price with currency
 */
export const formatPrice = (price, currency = 'VND', showZeroWhenNull = false) => {
    if (price === null || price === undefined || price === '') {
        return showZeroWhenNull ? '0 ' + currency : 'Chưa có giá';
    }
    if (price === 0) return '0 ' + currency;
    return new Intl.NumberFormat('vi-VN').format(price) + ' ' + currency;
};

/**
 * Truncate text to a specific length and add ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncating
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}; 