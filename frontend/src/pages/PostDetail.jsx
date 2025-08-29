import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Eye, Edit3, Trash2, ArrowLeft } from 'lucide-react';
import { useAuth, usePosts } from '../hooks/useAuth';
import { format } from 'date-fns';
import { InitialsAvatar } from '../components/ui/InitialsAvatar';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { currentPost, loadingPost, postError, fetchPost, clearCurrentPost, deletePost } = usePosts();

    useEffect(() => {
        if (id) {
            fetchPost(id);
        }
        return () => clearCurrentPost();
    }, [id, fetchPost, clearCurrentPost]);

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
                                size="h-12 w-12"
                                textSize="text-lg"
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
                </article><div className="mt-8 text-center">
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
