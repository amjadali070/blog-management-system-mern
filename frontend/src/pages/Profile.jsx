import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { InitialsAvatar } from '../components/ui/InitialsAvatar';

// Validation schema
const schema = yup.object({
    name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
    bio: yup.string().max(500, 'Bio cannot exceed 500 characters'),
});

const Profile = () => {
    const { user, updateProfile } = useAuth();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: user?.name || '',
            bio: user?.bio || '',
        },
    });

    const onSubmit = async (data) => {
        await updateProfile(data);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <User className="h-6 w-6 text-blue-600 mr-2" />
                            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6"><div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-4">
                                <InitialsAvatar
                                    name={user?.name}
                                    size="h-16 w-16"
                                    textSize="text-xl"
                                />
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{user?.name}</h3>
                                    <p className="text-sm text-gray-600">{user?.email}</p>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {user?.role}
                                    </span>
                                </div>
                            </div>
                        </div><div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Name *
                            </label>
                            <input
                                {...register('name')}
                                type="text"
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.name ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div><div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                                Bio
                            </label>
                            <textarea
                                {...register('bio')}
                                rows={4}
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.bio ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Tell us about yourself..."
                            />
                            {errors.bio && (
                                <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                {watch('bio')?.length || 0}/500 characters
                            </p>
                        </div><div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                        {user?.email}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Role
                                    </label>
                                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md capitalize">
                                        {user?.role}
                                    </p>
                                </div>
                            </div>
                        </div><div className="flex items-center justify-end pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <div className="spinner mr-2"></div>
                                ) : (
                                    <Save className="h-4 w-4 mr-2" />
                                )}
                                Update Profile
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
