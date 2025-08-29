import { useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../utils/api';
import { AuthContext } from './contexts';

// Auth Actions
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    LOAD_USER: 'LOAD_USER',
    CLEAR_ERRORS: 'CLEAR_ERRORS',
};

// Auth Reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case AUTH_ACTIONS.LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                error: null,
            };
        case AUTH_ACTIONS.LOAD_USER:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload,
            };
        case AUTH_ACTIONS.LOGIN_FAILURE:
        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                token: null,
                error: action.payload,
            };
        case AUTH_ACTIONS.CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

// Initial State
const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    error: null,
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Set auth token in axios headers
    useEffect(() => {
        if (state.token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
            localStorage.setItem('token', state.token);
        } else {
            delete api.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [state.token]);

    // Load user if token exists
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await api.get('/auth/me');
                    dispatch({
                        type: AUTH_ACTIONS.LOAD_USER,
                        payload: response.data.data.user,
                    });
                } catch (error) {
                    console.error('Load user error:', error);
                    dispatch({ type: AUTH_ACTIONS.LOGOUT });
                }
            } else {
                dispatch({ type: AUTH_ACTIONS.LOGOUT });
            }
        };

        loadUser();
    }, []);

    // Login
    const login = async (email, password) => {
        try {
            dispatch({ type: AUTH_ACTIONS.LOGIN_START });

            const response = await api.post('/auth/login', { email, password });

            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: response.data.data,
            });

            toast.success('Login successful!');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: message,
            });
            toast.error(message);
            return { success: false, error: message };
        }
    };

    // Register
    const register = async (userData) => {
        try {
            dispatch({ type: AUTH_ACTIONS.LOGIN_START });

            const response = await api.post('/auth/register', userData);

            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: response.data.data,
            });

            toast.success('Registration successful!');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: message,
            });
            toast.error(message);
            return { success: false, error: message };
        }
    };

    // Logout
    const logout = () => {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
        toast.success('Logged out successfully');
    };

    // Update Profile
    const updateProfile = async (profileData) => {
        try {
            const response = await api.put('/auth/profile', profileData);

            dispatch({
                type: AUTH_ACTIONS.LOAD_USER,
                payload: response.data.data.user,
            });

            toast.success('Profile updated successfully!');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Profile update failed';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    // Clear Errors
    const clearErrors = () => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERRORS });
    };

    const value = {
        ...state,
        login,
        register,
        logout,
        updateProfile,
        clearErrors,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
