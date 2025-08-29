// Base64 encoded SVG avatar fallback to prevent infinite loading loops
export const DEFAULT_AVATAR_FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiA0MEMzNy41MjI4IDQwIDQyIDM1LjUyMjggNDIgMzBDNDIgMjQuNDc3MiAzNy41MjI4IDIwIDMyIDIwQzI2LjQ3NzIgMjAgMjIgMjQuNDc3MiAyMiAzMEMyMiAzNS41MjI4IDI2LjQ3NzIgNDAgMzIgNDAiIGZpbGw9IiM5Q0E2QUYiLz4KPHA4dGggZD0iTTMyIDQ0QzM5LjMxMzcgNDQgNDUuNDE2NyA0Ny42MDMzIDQ3Ljc2MzEgNTMuMDc0N0M0Ny45OTQgNTMuNjgzNyA0OCA1NC4zMjg2IDQ4IDU1SDE2QzE2IDU0LjMyODYgMTYuMDA2IDUzLjY4MzcgMTYuMjM2OSA1My4wNzQ3QzE4LjU4MzMgNDcuNjAzMyAyNC42ODYzIDQ0IDMyIDQ0WiIgZmlsbD0iIzlDQTZBRiIvPgo8L3N2Zz4K';

// Base64 encoded SVG image fallback
export const DEFAULT_IMAGE_FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwTDE2MCA4MEwyNDAgODBMMjAwIDEwMFpNMTYwIDEyMEgxODBWMTQwSDE2MFYxMjBaTTIyMCAxMjBIMjQwVjE0MEgyMjBWMTIwWiIgZmlsbD0iIzlDQTZBRiIvPgo8dGV4dCB4PSIyMDAiIHk9IjEwNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZCNzI4MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KPC9zdmc+';

/**
 * Safe image error handler that prevents infinite loading loops
 * @param {Event} e - The error event
 * @param {string} fallback - The fallback image URL (optional)
 */
export const handleImageError = (e, fallback = DEFAULT_AVATAR_FALLBACK) => {
    // Prevent infinite loop by checking if already set to fallback
    if (e.target.src !== fallback) {
        e.target.src = fallback;
    }
};

/**
 * Safe avatar error handler
 * @param {Event} e - The error event
 */
export const handleAvatarError = (e) => {
    handleImageError(e, DEFAULT_AVATAR_FALLBACK);
};

/**
 * Safe post image error handler
 * @param {Event} e - The error event
 */
export const handlePostImageError = (e) => {
    handleImageError(e, DEFAULT_IMAGE_FALLBACK);
};
