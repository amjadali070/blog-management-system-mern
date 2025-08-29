import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-blue-600">404</h1>
                    <h2 className="text-2xl font-bold text-gray-900 mt-2">Page Not Found</h2>
                    <p className="text-gray-600 mt-4">
                        Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Home className="h-5 w-5 mr-2" />
                        Go Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Go Back
                    </button>
                </div>

                <div className="mt-8 text-sm text-gray-500">
                    <p>
                        If you believe this is an error, please{' '}
                        <a href="mailto:support@bloghub.com" className="text-blue-600 hover:text-blue-500">
                            contact support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
