import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Eye, Edit3, Trash2, ArrowLeft, MessageCircle, Send } from 'lucide-react';
import { useAuth, usePosts } from '../hooks/useAuth';
import { format } from 'date-fns';
import { InitialsAvatar } from '../components/ui/InitialsAvatar';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { currentPost, loadingPost, postError, fetchPost, clearCurrentPost, deletePost } = usePosts();

    // Comment state
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    // Fetch comments for the post
    const fetchComments = async () => {
        try {
            setLoadingComments(true);
            const response = await api.get(`/posts/${id}/comments`);
            if (response.data.success) {
                setComments(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchPost(id);
            fetchComments();
        }
        return () => clearCurrentPost();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, fetchPost, clearCurrentPost]);

    // Submit a new comment
    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || !isAuthenticated) return;

        try {
            setSubmittingComment(true);
            const response = await api.post(`/posts/${id}/comments`, {
                content: commentText.trim()
            });

            if (response.data.success) {
                toast.success('Comment added successfully');
                setCommentText('');
                fetchComments(); // Refresh comments
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    // Delete a comment
    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            const response = await api.delete(`/comments/${commentId}`);
            if (response.data.success) {
                toast.success('Comment deleted successfully');
                fetchComments(); // Refresh comments
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete comment');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            const result = await deletePost(id);
            if (result.success) {
                navigate('/dashboard');
            }
        }
    };

    const canEdit = isAuthenticated && user && currentPost && (
        user.role === 'admin' || user.id === currentPost.author._id
    );

    if (loadingPost) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (postError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
                    <p className="text-gray-600">{postError}</p>
                    <Link
                        to="/"
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    if (!currentPost) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h1>
                    <p className="text-gray-600">The post you're looking for doesn't exist.</p>
                    <Link
                        to="/"
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                </button>
            </div><article className="bg-white rounded-lg shadow-sm overflow-hidden">{currentPost.featuredImage && (
                <div className="aspect-w-16 aspect-h-9">
                    <img
                        src={currentPost.featuredImage}
                        alt={currentPost.title}
                        className="w-full h-64 sm:h-80 object-cover"
                    />
                </div>
            )}

                    <div className="p-6 sm:p-8"><div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentPost.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {currentPost.status}
                        </span>

                        <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span>{currentPost.author?.name}</span>
                        </div>

                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{format(new Date(currentPost.createdAt), 'MMMM dd, yyyy')}</span>
                        </div>

                        <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>{currentPost.views} views</span>
                        </div>
                    </div><h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                            {currentPost.title}
                        </h1>{currentPost.excerpt && (
                            <p className="text-lg text-gray-600 mb-6 italic border-l-4 border-blue-500 pl-4">
                                {currentPost.excerpt}
                            </p>
                        )}<div className="flex items-center mb-8 p-4 bg-gray-50 rounded-lg">
                            <InitialsAvatar
                                name={currentPost.author?.name}
                                size="lg"
                                className="mr-4"
                            />
                            <div>
                                <h3 className="font-medium text-gray-900">{currentPost.author?.name}</h3>
                                {currentPost.author?.bio && (
                                    <p className="text-sm text-gray-600">{currentPost.author.bio}</p>
                                )}
                            </div>
                        </div><div
                            className="prose prose-lg max-w-none blog-content"
                            dangerouslySetInnerHTML={{ __html: currentPost.content }}
                        />{(currentPost.categories?.length > 0 || currentPost.tags?.length > 0) && (
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                {currentPost.categories?.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">Categories:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {currentPost.categories.map((category, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                                >
                                                    {category}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {currentPost.tags?.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">Tags:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {currentPost.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}{canEdit && (
                            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center space-x-4">
                                <Link
                                    to={`/edit-post/${currentPost._id}`}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Edit Post
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Post
                                </button>
                            </div>
                        )}
                    </div>
                </article>

                {/* Comments Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
                    <div className="flex items-center mb-6">
                        <MessageCircle className="h-5 w-5 text-gray-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            Comments ({comments.length})
                        </h3>
                    </div>

                    {/* Comment Form */}
                    {isAuthenticated ? (
                        <form onSubmit={handleSubmitComment} className="mb-8">
                            <div className="flex items-start space-x-4">
                                <InitialsAvatar name={user?.name || 'User'} size="sm" />
                                <div className="flex-1">
                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Write a comment..."
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                    <div className="mt-3 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={submittingComment || !commentText.trim()}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {submittingComment ? (
                                                <div className="spinner w-4 h-4 mr-2"></div>
                                            ) : (
                                                <Send className="h-4 w-4 mr-2" />
                                            )}
                                            {submittingComment ? 'Posting...' : 'Post Comment'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-600 text-center">
                                <Link to="/login" className="text-blue-600 hover:text-blue-500">
                                    Sign in
                                </Link>
                                {' '}to post a comment
                            </p>
                        </div>
                    )}

                    {/* Comments List */}
                    {loadingComments ? (
                        <div className="flex justify-center py-8">
                            <div className="spinner"></div>
                        </div>
                    ) : comments.length > 0 ? (
                        <div className="space-y-6">
                            {comments.map((comment) => (
                                <div key={comment._id} className="flex space-x-4">
                                    <InitialsAvatar name={comment.author?.name || 'User'} size="sm" />
                                    <div className="flex-1">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-gray-900">
                                                    {comment.author?.name || 'Anonymous User'}
                                                </h4>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-500">
                                                        {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                                                    </span>
                                                    {(user?.role === 'admin' || user?.id === comment.author._id) && (
                                                        <button
                                                            onClick={() => handleDeleteComment(comment._id)}
                                                            className="text-red-500 hover:text-red-700"
                                                            title="Delete comment"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-gray-700 whitespace-pre-wrap">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to All Posts
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
