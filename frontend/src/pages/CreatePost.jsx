/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, FileText, Image, Tag } from 'lucide-react';
import { usePosts } from '../hooks/useAuth';
import { handlePostImageError } from '../utils/imageUtils';

// Validation schema
const schema = yup.object({
    title: yup.string().min(5, 'Title must be at least 5 characters').max(100, 'Title cannot exceed 100 characters').required('Title is required'),
    content: yup.string().min(50, 'Content must be at least 50 characters').required('Content is required'),
    excerpt: yup.string().max(200, 'Excerpt cannot exceed 200 characters'),
    featuredImage: yup.string().url('Must be a valid URL'),
    status: yup.string().oneOf(['draft', 'published'], 'Invalid status').required('Status is required'),
    categories: yup.string(),
    tags: yup.string(),
});

const CreatePost = () => {
    const { createPost, creating } = usePosts();
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState('');

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            status: 'draft',
            featuredImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        },
    });

    const watchedImage = watch('featuredImage');

    const onSubmit = async (data) => {
        try {
            // Process categories and tags
            const processedData = {
                ...data,
                categories: data.categories ? data.categories.split(',').map(cat => cat.trim()) : [],
                tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
            };

            const result = await createPost(processedData);
            if (result.success) {
                navigate('/dashboard');
            }
        } catch (error) { console.error(error) }
    };

    const handleImageChange = (url) => {
        setImagePreview(url);
    };

    // Quill modules configuration
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'script', 'indent', 'direction',
        'color', 'background', 'align', 'link', 'image', 'video'
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <FileText className="h-6 w-6 text-blue-600 mr-2" />
                            <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6"><div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                        </label>
                        <input
                            {...register('title')}
                            type="text"
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.title ? 'border-red-300' : 'border-gray-300'
                                }`}
                            placeholder="Enter post title"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                        )}
                    </div><div>
                            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                                Excerpt
                            </label>
                            <textarea
                                {...register('excerpt')}
                                rows={3}
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.excerpt ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Brief description of your post (optional)"
                            />
                            {errors.excerpt && (
                                <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
                            )}
                        </div><div>
                            <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">
                                <Image className="inline h-4 w-4 mr-1" />
                                Featured Image URL
                            </label>
                            <input
                                {...register('featuredImage')}
                                type="url"
                                onChange={(e) => handleImageChange(e.target.value)}
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.featuredImage ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="https://example.com/image.jpg"
                            />
                            {errors.featuredImage && (
                                <p className="mt-1 text-sm text-red-600">{errors.featuredImage.message}</p>
                            )}
                            {watchedImage && (
                                <div className="mt-2">
                                    <img
                                        src={imagePreview || watchedImage}
                                        alt="Featured image preview"
                                        className="h-32 w-48 object-cover rounded-md border"
                                        onError={handlePostImageError}
                                    />
                                </div>
                            )}
                        </div><div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content *
                            </label>
                            <Controller
                                name="content"
                                control={control}
                                render={({ field }) => (
                                    <ReactQuill
                                        theme="snow"
                                        value={field.value}
                                        onChange={field.onChange}
                                        modules={modules}
                                        formats={formats}
                                        placeholder="Write your post content here..."
                                        className={errors.content ? 'border-red-300' : ''}
                                    />
                                )}
                            />
                            {errors.content && (
                                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                            )}
                        </div><div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="categories" className="block text-sm font-medium text-gray-700 mb-2">
                                    <Tag className="inline h-4 w-4 mr-1" />
                                    Categories
                                </label>
                                <input
                                    {...register('categories')}
                                    type="text"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="e.g., Technology, Web Development"
                                />
                                <p className="mt-1 text-xs text-gray-500">Separate multiple categories with commas</p>
                            </div>

                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                                    <Tag className="inline h-4 w-4 mr-1" />
                                    Tags
                                </label>
                                <input
                                    {...register('tags')}
                                    type="text"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="e.g., react, javascript, tutorial"
                                />
                                <p className="mt-1 text-xs text-gray-500">Separate multiple tags with commas</p>
                            </div>
                        </div><div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                Status *
                            </label>
                            <select
                                {...register('status')}
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.status ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                            )}
                        </div><div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || creating}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting || creating ? (
                                    <div className="spinner mr-2"></div>
                                ) : (
                                    <Save className="h-4 w-4 mr-2" />
                                )}
                                Create Post
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
