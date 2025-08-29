import { getInitials, getAvatarColor } from '../../utils/avatarUtils';

/**
 * Avatar component with initials
 * @param {Object} props - Component props
 * @param {string} props.name - The name to generate initials from
 * @param {string} props.size - Size preset ('xs', 'sm', 'md', 'lg', 'xl') or custom classes
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Avatar component
 */
export const InitialsAvatar = ({ name, size = 'md', className = '' }) => {
    const initials = getInitials(name);
    const bgColor = getAvatarColor(name);

    // Complex size mapping system for consistent avatar sizing across the app
    // Maps semantic size names to Tailwind CSS classes for maintainability
    const sizeClasses = {
        xs: 'h-6 w-6 text-xs',     // Very small avatars for lists
        sm: 'h-8 w-8 text-sm',     // Small avatars for compact layouts
        md: 'h-10 w-10 text-sm',   // Default medium size
        lg: 'h-12 w-12 text-base', // Large avatars for profiles
        xl: 'h-16 w-16 text-xl'    // Extra large for main profile displays
    };

    // Flexible sizing: use predefined size preset or allow custom CSS classes
    const avatarSize = sizeClasses[size] || size;

    return (
        <div className={`${avatarSize} ${bgColor} rounded-full flex items-center justify-center text-white font-semibold ${className}`}>
            {initials}
        </div>
    );
};
