import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, PenTool, Home, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { InitialsAvatar } from '../ui/InitialsAvatar';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsProfileOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16"><div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <PenTool className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-800">BlogHub</span>
                        </Link>
                    </div><div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
                                }`}
                        >
                            <Home className="h-4 w-4" />
                            <span>Home</span>
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
                                        }`}
                                >
                                    <Settings className="h-4 w-4" />
                                    <span>Dashboard</span>
                                </Link>

                                <Link
                                    to="/create-post"
                                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/create-post') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
                                        }`}
                                >
                                    <PenTool className="h-4 w-4" />
                                    <span>Write</span>
                                </Link>

                                {user?.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
                                            }`}
                                    >
                                        <Shield className="h-4 w-4" />
                                        <span>Admin</span>
                                    </Link>
                                )}<div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
                                    >
                                        <InitialsAvatar
                                            name={user?.name}
                                            size="h-8 w-8"
                                            textSize="text-xs"
                                        />
                                        <span className="text-sm font-medium">{user?.name}</span>
                                    </button>

                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                            <Link
                                                to="/profile"
                                                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <User className="h-4 w-4" />
                                                <span>Profile</span>
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div><div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700 hover:text-blue-600 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>{isOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                            <Link
                                to="/"
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                <Home className="h-5 w-5" />
                                <span>Home</span>
                            </Link>

                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${isActive('/dashboard') ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                                            }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Settings className="h-5 w-5" />
                                        <span>Dashboard</span>
                                    </Link>

                                    <Link
                                        to="/create-post"
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${isActive('/create-post') ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                                            }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <PenTool className="h-5 w-5" />
                                        <span>Write</span>
                                    </Link>

                                    {user?.role === 'admin' && (
                                        <Link
                                            to="/admin"
                                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${isActive('/admin') ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                                                }`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Shield className="h-5 w-5" />
                                            <span>Admin</span>
                                        </Link>
                                    )}

                                    <Link
                                        to="/profile"
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${isActive('/profile') ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                                            }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <User className="h-5 w-5" />
                                        <span>Profile</span>
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span>Sign Out</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
