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

    // Debug logging (remove in production)
    if (!name) {
        console.log('InitialsAvatar: No name provided', { name, initials, bgColor });
    }

    // Size mappings for different avatar sizes
    const sizeClasses = {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-xl'
    };

    // Use predefined size or custom classes
    const avatarSize = sizeClasses[size] || size;

    return (
        <div className={`${avatarSize} ${bgColor} rounded-full flex items-center justify-center text-white font-semibold ${className}`}>
            {initials}
        </div>
    );
};
