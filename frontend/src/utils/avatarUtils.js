/**
 * Generate initials from a name
 * @param {string} name - The full name
 * @returns {string} - The initials (max 2 characters)
 */
export const getInitials = (name) => {
    if (!name) return 'U'; // Default for 'User'

    const words = name.trim().split(' ');
    if (words.length === 1) {
        return words[0].charAt(0).toUpperCase();
    }

    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

/**
 * Get a consistent background color based on the name
 * @param {string} name - The name to generate color for
 * @returns {string} - CSS classes for background color
 */
export const getAvatarColor = (name) => {
    if (!name) return 'bg-gray-500';

    const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-yellow-500',
        'bg-red-500',
        'bg-teal-500',
        'bg-orange-500',
        'bg-cyan-500'
    ];

    // Generate a consistent index based on the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
};
