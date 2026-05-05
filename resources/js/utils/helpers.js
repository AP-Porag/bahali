import axios from 'axios';

export async function uploadEditorImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(route('editor.image.upload'), formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
}

/**
 * --------------------------------------------
 * Date & Time Helpers
 * --------------------------------------------
 */

/**
 * Format an ISO date string to US locale format
 *
 * Examples:
 *  - Jan 19, 2026
 *  - January 19, 2026
 *  - 01/19/2026
 *  - Jan 19, 2026, 6:04 PM
 *
 * @param {string|Date|null|undefined} date
 * @param {Object} options Intl.DateTimeFormat options
 * @returns {string}
 */
export function formatDateUS(date, options = {}) {
    if (!date) return '—';

    try {
        const d = date instanceof Date ? date : new Date(date);

        // Invalid date check
        if (isNaN(d.getTime())) return '—';

        return new Intl.DateTimeFormat(
            'en-US',
            {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                ...options,
            }
        ).format(d);
    } catch (error) {
        console.error('formatDateUS error:', error);
        return '—';
    }
}

/**
 * Common US date format presets
 * Use with formatDateUS(date, DATE_PRESETS.X)
 */
export const DATE_PRESETS = {
    /** Jan 19, 2026 */
    SHORT: {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    },

    /** January 19, 2026 */
    LONG: {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
    },

    /** 01/19/2026 */
    SLASH: {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    },

    /** Jan 19, 2026, 6:04 PM */
    DATETIME: {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    },

    /** Jan 19, 2026, 6:04:44 PM */
    DATETIME_WITH_SECONDS: {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
    },
};

/**
 * --------------------------------------------
 * Misc Helpers (future safe)
 * --------------------------------------------
 */

/**
 * Safely format a number as currency (USD by default)
 */
export function formatCurrency(
    value,
    currency = 'USD',
    locale = 'en-US'
) {
    if (value === null || value === undefined || value === '') return '—';

    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
        }).format(value);
    } catch {
        return value;
    }
}

/**
 * Convert snake_case or camelCase to Title Case
 * Example: "interview_scheduled_at" → "Interview Scheduled At"
 */
export function toTitleCase(str) {
    if (!str) return '';

    return str
        .replace(/[_\-]/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\w\S*/g, (txt) =>
            txt.charAt(0).toUpperCase() + txt.slice(1)
        );
}
