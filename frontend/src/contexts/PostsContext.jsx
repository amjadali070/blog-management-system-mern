import { useReducer, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { api } from '../utils/api';
import { PostsContext } from './contexts';

// Posts Actions
const POSTS_ACTIONS = {
    FETCH_POSTS_START: 'FETCH_POSTS_START',
    FETCH_POSTS_SUCCESS: 'FETCH_POSTS_SUCCESS',
    FETCH_POSTS_FAILURE: 'FETCH_POSTS_FAILURE',
    FETCH_POST_START: 'FETCH_POST_START',
    FETCH_POST_SUCCESS: 'FETCH_POST_SUCCESS',
    FETCH_POST_FAILURE: 'FETCH_POST_FAILURE',
    CREATE_POST_START: 'CREATE_POST_START',
    CREATE_POST_SUCCESS: 'CREATE_POST_SUCCESS',
    CREATE_POST_FAILURE: 'CREATE_POST_FAILURE',
    UPDATE_POST_SUCCESS: 'UPDATE_POST_SUCCESS',
    DELETE_POST_SUCCESS: 'DELETE_POST_SUCCESS',
    CLEAR_CURRENT_POST: 'CLEAR_CURRENT_POST',
    SET_SEARCH: 'SET_SEARCH',
    SET_FILTER: 'SET_FILTER',
    CLEAR_ERRORS: 'CLEAR_ERRORS',
};

// Posts Reducer
const postsReducer = (state, action) => {
    switch (action.type) {
        case POSTS_ACTIONS.FETCH_POSTS_START:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case POSTS_ACTIONS.FETCH_POSTS_SUCCESS:
            return {
                ...state,
                loading: false,
                posts: action.payload.posts,
                total: action.payload.total,
                pagination: action.payload.pagination,
                error: null,
            };
        case POSTS_ACTIONS.FETCH_POSTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case POSTS_ACTIONS.FETCH_POST_START:
            return {
                ...state,
                loadingPost: true,
                postError: null,
            };
        case POSTS_ACTIONS.FETCH_POST_SUCCESS:
            return {
                ...state,
                loadingPost: false,
                currentPost: action.payload,
                postError: null,
            };
        case POSTS_ACTIONS.FETCH_POST_FAILURE:
            return {
                ...state,
                loadingPost: false,
                postError: action.payload,
            };
        case POSTS_ACTIONS.CREATE_POST_START:
            return {
                ...state,
                creating: true,
                error: null,
            };
        case POSTS_ACTIONS.CREATE_POST_SUCCESS:
            return {
                ...state,
                creating: false,
                posts: [action.payload, ...state.posts],
                error: null,
            };
        case POSTS_ACTIONS.CREATE_POST_FAILURE:
            return {
                ...state,
                creating: false,
                error: action.payload,
            };
        case POSTS_ACTIONS.UPDATE_POST_SUCCESS:
            // Optimistic update: immediately update post in both lists and current post
            // This provides instant UI feedback before server confirmation
            return {
                ...state,
                posts: state.posts.map(post =>
                    post._id === action.payload._id ? action.payload : post
                ),
                currentPost: action.payload,
            };
        case POSTS_ACTIONS.DELETE_POST_SUCCESS:
            // Remove deleted post from posts array using filter
            return {
                ...state,
                posts: state.posts.filter(post => post._id !== action.payload),
            };
        case POSTS_ACTIONS.CLEAR_CURRENT_POST:
            return {
                ...state,
                currentPost: null,
                postError: null,
            };
        case POSTS_ACTIONS.SET_SEARCH:
            return {
                ...state,
                searchQuery: action.payload,
            };
        case POSTS_ACTIONS.SET_FILTER:
            return {
                ...state,
                filters: { ...state.filters, ...action.payload },
            };
        case POSTS_ACTIONS.CLEAR_ERRORS:
            return {
                ...state,
                error: null,
                postError: null,
            };
        default:
            return state;
    }
};

// Initial State
const initialState = {
    posts: [],
    currentPost: null,
    total: 0,
    pagination: {},
    searchQuery: '',
    filters: {
        status: '',
        category: '',
        author: '',
    },
    loading: false,
    loadingPost: false,
    creating: false,
    error: null,
    postError: null,
};

// Posts Provider Component
export const PostsProvider = ({ children }) => {
    const [state, dispatch] = useReducer(postsReducer, initialState);

    // Fetch Posts with complex query parameter building
    // Dynamically constructs URL parameters based on current search and filter state
    const fetchPosts = async (page = 1, limit = 10) => {
        try {
            dispatch({ type: POSTS_ACTIONS.FETCH_POSTS_START });

            // Build query parameters dynamically based on current state
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });

            // Add search query if present
            if (state.searchQuery) {
                params.append('search', state.searchQuery);
            }

            // Add all active filters to query parameters
            Object.entries(state.filters).forEach(([key, value]) => {
                if (value) {
                    params.append(key, value);
                }
            });

            const response = await api.get(`/posts?${params}`);

            dispatch({
                type: POSTS_ACTIONS.FETCH_POSTS_SUCCESS,
                payload: {
                    posts: response.data.data,
                    total: response.data.total,
                    pagination: response.data.pagination,
                },
            });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch posts';
            dispatch({
                type: POSTS_ACTIONS.FETCH_POSTS_FAILURE,
                payload: message,
            });
            toast.error(message);
        }
    };

    // Memoized function to prevent unnecessary re-renders
    // useCallback ensures function reference stability across renders
    const fetchPost = useCallback(async (id) => {
        try {
            dispatch({ type: POSTS_ACTIONS.FETCH_POST_START });

            const response = await api.get(`/posts/${id}`);

            dispatch({
                type: POSTS_ACTIONS.FETCH_POST_SUCCESS,
                payload: response.data.data,
            });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch post';
            dispatch({
                type: POSTS_ACTIONS.FETCH_POST_FAILURE,
                payload: message,
            });
            toast.error(message);
        }
    }, []);

    // Create Post
    const createPost = async (postData) => {
        try {
            dispatch({ type: POSTS_ACTIONS.CREATE_POST_START });

            const response = await api.post('/posts', postData);

            dispatch({
                type: POSTS_ACTIONS.CREATE_POST_SUCCESS,
                payload: response.data.data,
            });

            toast.success('Post created successfully!');
            return { success: true, data: response.data.data };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to create post';
            dispatch({
                type: POSTS_ACTIONS.CREATE_POST_FAILURE,
                payload: message,
            });
            toast.error(message);
            return { success: false, error: message };
        }
    };

    // Update Post
    const updatePost = async (id, postData) => {
        try {
            const response = await api.put(`/posts/${id}`, postData);

            dispatch({
                type: POSTS_ACTIONS.UPDATE_POST_SUCCESS,
                payload: response.data.data,
            });

            toast.success('Post updated successfully!');
            return { success: true, data: response.data.data };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update post';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    // Delete Post
    const deletePost = async (id) => {
        try {
            await api.delete(`/posts/${id}`);

            dispatch({
                type: POSTS_ACTIONS.DELETE_POST_SUCCESS,
                payload: id,
            });

            toast.success('Post deleted successfully!');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete post';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    // Fetch My Posts
    const fetchMyPosts = async (page = 1, limit = 10, status = '') => {
        try {
            dispatch({ type: POSTS_ACTIONS.FETCH_POSTS_START });

            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });

            if (status) {
                params.append('status', status);
            }

            const response = await api.get(`/posts/my-posts?${params}`);

            dispatch({
                type: POSTS_ACTIONS.FETCH_POSTS_SUCCESS,
                payload: {
                    posts: response.data.data,
                    total: response.data.total,
                    pagination: response.data.pagination || {},
                },
            });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch posts';
            dispatch({
                type: POSTS_ACTIONS.FETCH_POSTS_FAILURE,
                payload: message,
            });
            toast.error(message);
        }
    };

    // Clear Current Post
    const clearCurrentPost = useCallback(() => {
        dispatch({ type: POSTS_ACTIONS.CLEAR_CURRENT_POST });
    }, []);

    // Set Search Query
    const setSearchQuery = (query) => {
        dispatch({ type: POSTS_ACTIONS.SET_SEARCH, payload: query });
    };

    // Set Filters
    const setFilters = (filters) => {
        dispatch({ type: POSTS_ACTIONS.SET_FILTER, payload: filters });
    };

    // Clear Errors
    const clearErrors = () => {
        dispatch({ type: POSTS_ACTIONS.CLEAR_ERRORS });
    };

    // Auto-fetch posts when search or filters change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchPosts();
        }, 500); // Debounce for 500ms

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.searchQuery, state.filters]);

    const value = {
        ...state,
        fetchPosts,
        fetchPost,
        createPost,
        updatePost,
        deletePost,
        fetchMyPosts,
        clearCurrentPost,
        setSearchQuery,
        setFilters,
        clearErrors,
    };

    return (
        <PostsContext.Provider value={value}>
            {children}
        </PostsContext.Provider>
    );
};
