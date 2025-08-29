import { getInitials, getAvatarColor } from '../../utils/avatarUtils';

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
