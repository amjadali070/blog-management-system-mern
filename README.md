# Blog Management System - MERN Stack

A full-stack blog management system built with MongoDB, Express.js, React, and Node.js. This application features user authentication, role-based access control, post management, and a modern responsive UI.

## 🚀 Features

### Backend Features
- **JWT Authentication** with role-based authorization (Admin/Author)
- **RESTful API** for users, posts, and comments
- **Input validation** and proper error handling
- **Database models** with relationships
- **Search and pagination** functionality
- **Role-based permissions** (Admin vs Author access)

### Frontend Features
- **Authentication flow** with protected routes
- **Post creation/editing** interface with rich text editor
- **Dashboard** with different views for admin/author roles
- **State management** using Context API
- **Custom hooks** implementation
- **Responsive design** with Tailwind CSS
- **Search and pagination** for posts
- **Image upload** support for featured images and avatars

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **React Quill** - Rich text editor
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Yup** - Schema validation
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **date-fns** - Date formatting

## 📁 Project Structure

```
blog-management-system-mern/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   └── postController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── error.js
│   ├── models/
│   │   ├── Comment.js
│   │   ├── Post.js
│   │   └── User.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   └── posts.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   └── layout/
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── PostsContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EditPost.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── PostDetail.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Register.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-management-system-mern
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/blogmanagement
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

## 👥 User Roles

### Author
- Create, edit, and delete their own posts
- View their dashboard with post statistics
- Update their profile
- Publish or save posts as drafts

### Admin
- All author permissions
- View and manage all posts from all users
- Access to admin dashboard with system-wide statistics
- Delete any post
- Manage all user content

## 🔐 Authentication

The application uses JWT-based authentication with the following endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

## 📝 API Endpoints

### Posts
- `GET /api/posts` - Get all published posts (with search & pagination)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (authenticated)
- `PUT /api/posts/:id` - Update post (authenticated, owner/admin only)
- `DELETE /api/posts/:id` - Delete post (authenticated, owner/admin only)
- `GET /api/posts/my-posts` - Get user's posts (authenticated)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/profile` - Update user profile

## 🎨 Design Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern UI** - Clean and professional interface
- **Dark/Light Theme Support** - Consistent color scheme
- **Loading States** - Proper loading indicators
- **Error Handling** - User-friendly error messages
- **Form Validation** - Client-side and server-side validation
- **Rich Text Editor** - Full-featured post editor
- **Image Support** - Featured images and avatars

## 🔧 Development Features

- **Hot Reload** - Both frontend and backend support hot reloading
- **ESLint** - Code linting for consistent code style
- **Error Boundaries** - Graceful error handling in React
- **Custom Hooks** - Reusable logic with React hooks
- **Context API** - Global state management
- **Axios Interceptors** - Automatic token handling
- **Form Handling** - React Hook Form with Yup validation

## 📦 Build and Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

### Build for Production
```bash
# Backend
cd backend
npm start

# Frontend (serve built files)
cd frontend
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🐛 Known Issues

- None currently identified

## 🚀 Future Enhancements

- Comment system implementation
- Social media integration
- Email notifications
- Advanced search filters
- Post categories management
- User following system
- Newsletter subscription
- SEO optimization
- Performance improvements

## 📞 Support

For support, email support@bloghub.com or create an issue in the repository.

---

**Developed by**: Amjad Ali  
**Stack**: MERN (MongoDB, Express.js, React, Node.js)  
**Duration**: 2-hour assessment project
