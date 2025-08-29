import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, Eye, Clock } from 'lucide-react';
import { usePosts } from '../hooks/useAuth';
import { format } from 'date-fns';

const Home = () => {
    const {
        posts,
        loading,
        fetchPosts,
        searchQuery,
        setSearchQuery,
        total,
        pagination,
    } = usePosts();
    const [currentPage, setCurrentPage] = useState(1);
    const [localSearch, setLocalSearch] = useState('');

    useEffect(() => {
        fetchPosts(currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    // Complex search handling with local state management
    // Separates UI input (localSearch) from actual search query to prevent unnecessary API calls
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(localSearch);  // Trigger API call with search query
        setCurrentPage(1);            // Reset to first page for new search
    };

    // Handle pagination changes and trigger new data fetch
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });  // Smooth scroll to top on page change
    };

    return (
        <div className="min-h-screen bg-gray-50"><div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
                        Welcome to{' '}
                        <span className="text-blue-600">BlogHub</span>
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Discover amazing stories, insights, and ideas from our community of writers.
                        Join the conversation and share your own thoughts.
                    </p>
                </div>
            </div>
        </div><div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <form onSubmit={handleSearch} className="max-w-xl mx-auto">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search posts..."
                            />
                            <button
                                type="submit"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <Search className="h-5 w-5 text-gray-400 hover:text-blue-500" />
                            </button>
                        </div>
                    </form>
                    {searchQuery && (
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600">
                                Showing results for: <span className="font-semibold">"{searchQuery}"</span>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setLocalSearch('');
                                        setCurrentPage(1);
                                    }}
                                    className="ml-2 text-blue-600 hover:text-blue-500"
                                >
                                    Clear
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            </div><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="spinner"></div>
                    </div>
                ) : posts.length > 0 ? (
                    <>
                        <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                            {posts.map((post) => (
                                <article
                                    key={post._id}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                                >
                                    <Link to={`/post/${post._id}`}>
                                        <img
                                            src={post.featuredImage}
                                            alt={post.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    </Link>

                                    <div className="p-6">
                                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {post.status}
                                            </span>
                                        </div>

                                        <Link to={`/post/${post._id}`}>
                                            <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                                                {post.title}
                                            </h2>
                                        </Link>

                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {post.excerpt}
                                        </p>

                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-1">
                                                    <User className="h-4 w-4" />
                                                    <span>{post.author?.name}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Eye className="h-4 w-4" />
                                                <span>{post.views}</span>
                                            </div>
                                        </div>

                                        {post.categories && post.categories.length > 0 && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {post.categories.slice(0, 3).map((category, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                                    >
                                                        {category}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Complex pagination component with conditional rendering */}
                        {/* Only shows pagination controls when there are multiple pages */}
                        {pagination && (pagination.next || pagination.prev) && (
                            <div className="mt-8 flex justify-center">
                                <nav className="flex items-center space-x-2">
                                    {/* Previous button - only shown if previous page exists */}
                                    {pagination.prev && (
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            Previous
                                        </button>
                                    )}

                                    {/* Current page indicator */}
                                    <span className="px-3 py-2 text-sm text-gray-700">
                                        Page {currentPage}
                                    </span>

                                    {/* Next button - only shown if next page exists */}
                                    {pagination.next && (
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            Next
                                        </button>
                                    )}
                                </nav>
                            </div>
                        )}

                        {/* Results summary display */}
                        <div className="mt-4 text-center text-sm text-gray-600">
                            Showing {posts.length} of {total} posts
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <Clock className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No posts found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchQuery ? 'Try adjusting your search terms.' : 'No posts have been published yet.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
