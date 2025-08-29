# Blog Management System - MERN Stack

A comprehensive full-stack blog management system built with MongoDB, Express.js, React, and Node.js, featuring JWT authentication, role-based access control, and modern React patterns.

## 🚀 Live Demo

- **Frontend**: [[Deployed URL will be here](https://blog-management-system-mern.vercel.app/)]
- **Backend API**: [[API URL will be here](https://blog-mern-backend-8f5371eb2be4.herokuapp.com/)]

## 📋 Features

### Backend Features
- ✅ **JWT Authentication** with refresh tokens
- ✅ **Role-based Authorization** (Admin/Author)
- ✅ **RESTful API** design following best practices
- ✅ **Post CRUD** operations with proper authorization
- ✅ **Comment System** with moderation
- ✅ **Advanced Search** with MongoDB text index
- ✅ **Pagination** for all listing endpoints
- ✅ **Input Validation** with express-validator
- ✅ **Aggregation Pipeline** for statistics
- ✅ **Error Handling** with proper HTTP status codes

### Frontend Features
- ✅ **Modern React 18** with Hooks and functional components
- ✅ **Protected Routes** with role-specific access control
- ✅ **Custom Hooks** (useAuth, usePosts, useApi)
- ✅ **Context API** for global state management
- ✅ **Form Validation** with React Hook Form + Yup
- ✅ **Rich Text Editor** for blog post creation
- ✅ **Responsive Design** with Tailwind CSS
- ✅ **Optimistic Updates** with error rollback
- ✅ **Loading States** and error boundaries
- ✅ **User Initials Avatars** (no external dependencies)

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication with refresh tokens
- **bcryptjs** - Password hashing with salt
- **express-validator** - Input validation middleware
- **cors** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library with modern hooks
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Performant form handling
- **Yup** - Schema validation
- **React Quill** - Rich text editor
- **Axios** - HTTP client with interceptors
- **React Hot Toast** - Toast notifications

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Git

### Backend Setup
```bash
cd blog-management-system-mern/backend
npm install

# Create .env file
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_DEV_URL=http://localhost:3000

npm run dev  # Server runs on http://localhost:5001
```

### Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file
VITE_API_URL=http://localhost:5001/api

npm run dev  # App runs on http://localhost:3000
```

## 📂 Project Structure

```
blog-management-system-mern/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # JWT auth + refresh tokens
│   │   ├── postController.js       # CRUD + search + pagination
│   │   ├── commentController.js    # Comment management
│   │   └── adminController.js      # Stats with aggregation
│   ├── middleware/
│   │   ├── auth.js                 # JWT protection + RBAC
│   │   └── error.js                # Global error handler
│   ├── models/
│   │   ├── User.js                 # User schema with bcrypt
│   │   ├── Post.js                 # Post with text index
│   │   └── Comment.js              # Comment with moderation
│   ├── routes/
│   │   ├── auth.js                 # /register, /login, /refresh
│   │   ├── posts.js                # Posts + comment endpoints
│   │   ├── comments.js             # Comment management
│   │   └── admin.js                # Admin-only routes
│   └── server.js                   # Express app configuration
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/               # ProtectedRoute, AdminRoute
│   │   │   ├── layout/             # Navbar with role-based menu
│   │   │   └── ui/                 # InitialsAvatar, reusables
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx     # Authentication state
│   │   │   ├── PostsContext.jsx    # Posts state with memoization
│   │   │   └── contexts.js         # Context exports
│   │   ├── hooks/
│   │   │   └── useAuth.js          # Custom hooks
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Public blog listing
│   │   │   ├── Dashboard.jsx       # Role-based dashboard
│   │   │   ├── CreatePost.jsx      # Rich text editor
│   │   │   ├── AdminDashboard.jsx  # Stats + user management
│   │   │   └── [10+ more pages]
│   │   └── utils/
│   │       ├── api.js              # Axios with interceptors
│   │       └── avatarUtils.js      # Initials generation
│   └── [config files]
└── README.md
```

## 🎯 API Endpoints (RESTful Design)

### Authentication
```http
POST   /api/auth/register     # User registration
POST   /api/auth/login        # Login with JWT + refresh token
POST   /api/auth/refresh      # Get new access token
GET    /api/auth/me           # Current user profile
PUT    /api/auth/profile      # Update profile
```

### Posts (with Search & Pagination)
```http
GET    /api/posts             # Public posts (?search=term&page=1&limit=10)
GET    /api/posts/my-posts    # Author's own posts
GET    /api/posts/:id         # Single post view
POST   /api/posts             # Create post (Protected)
PUT    /api/posts/:id         # Update post (Owner/Admin only)
DELETE /api/posts/:id         # Delete post (Owner/Admin only)
```

### Comments
```http
GET    /api/posts/:id/comments # Get post comments (paginated)
POST   /api/posts/:id/comments # Add comment (Protected)
PUT    /api/comments/:id       # Update comment (Owner/Admin)
DELETE /api/comments/:id       # Delete comment (Owner/Admin)
```

### Admin Dashboard
```http
GET    /api/admin/stats       # Site statistics with aggregation
GET    /api/admin/users       # User management (paginated)
PUT    /api/admin/users/:id/role # Change user role
DELETE /api/admin/users/:id   # Delete user
```

## 🔒 Security Implementation

- **JWT with Refresh Tokens** - Secure authentication flow
- **Password Hashing** - bcryptjs with salt rounds
- **Role-Based Access Control** - Admin vs Author permissions
- **Input Validation** - Server-side validation with express-validator
- **CORS Configuration** - Proper origin controls
- **Error Handling** - No sensitive data exposure in responses

## 🎨 UI/UX Excellence

- **Responsive Design** - Mobile-first with Tailwind CSS
- **Name Initials Avatars** - Consistent, colorful, no external requests
- **Rich Text Editor** - React Quill for beautiful blog posts
- **Real-time Validation** - Instant feedback on forms
- **Loading States** - Skeleton loaders and spinners
- **Toast Notifications** - Success/error feedback
- **Protected Routes** - Seamless authentication flow
- **Error Boundaries** - Graceful error handling

## 👥 User Roles & Permissions

### Author Role
- ✅ Create, edit, delete own posts
- ✅ View own dashboard with post analytics
- ✅ Update profile information
- ✅ Comment on any published post

### Admin Role
- ✅ All Author permissions +
- ✅ Manage ALL posts (edit, delete, publish)
- ✅ User management (view, edit roles, delete)
- ✅ Dashboard with site-wide statistics
- ✅ Moderate comments across all posts

## 📈 Performance Optimizations

- **MongoDB Text Indexing** - Fast full-text search
- **Pagination** - Efficient large dataset handling
- **Context Memoization** - useCallback for function stability
- **Axios Interceptors** - Automatic token refresh
- **SVG Avatars** - No image loading delays
- **Code Splitting** - Lazy loading for better performance

## 🚀 Deployment Ready

### Backend (Heroku/Railway)
```bash
# Set environment variables in hosting platform
MONGODB_URI=production_connection_string
JWT_SECRET=production_secret
NODE_ENV=production
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
# Set: VITE_API_URL=https://your-backend-url/api
```
## 👨‍💻 Developer

**Amjad Ali**
- GitHub: [@amjadali070](https://github.com/amjadali070)
- Email: amjadpitafi070@gmail.com
- Portfolio: [Portfolio Link]

Built with ❤️ using the MERN Stack for technical assessment excellence.
