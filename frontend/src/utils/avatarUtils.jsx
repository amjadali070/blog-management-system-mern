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

/**
 * Avatar component with initials
 * @param {Object} props - Component props
 * @param {string} props.name - The name to generate initials from
 * @param {string} props.size - Size classes (e.g., 'h-16 w-16')
 * @param {string} props.textSize - Text size classes (e.g., 'text-xl')
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Avatar component
 */
export const InitialsAvatar = ({ name, size = 'h-10 w-10', textSize = 'text-sm', className = '' }) => {
    const initials = getInitials(name);
    const bgColor = getAvatarColor(name);

    return (
        <div className={`${size} ${bgColor} rounded-full flex items-center justify-center text-white font-semibold ${textSize} ${className}`}>
            {initials}
        </div>
    );
};
