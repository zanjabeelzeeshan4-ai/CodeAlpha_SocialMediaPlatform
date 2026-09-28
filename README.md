# CodeAlpha Social Media Platform

A full-stack mini social media platform built as part of the CodeAlpha internship project.

The application allows users to create accounts, manage profiles, create posts, like posts, comment on posts, follow other users, and view public profiles.

## 🚀 Features

* User Registration and Login
* JWT Authentication
* User Profiles
* Edit Profile
* Public Profiles
* Create Posts
* Edit and Delete Posts
* Like / Unlike Posts
* Add Comments
* Edit and Delete Comments
* Follow / Unfollow Users
* Followers and Following
* Protected Routes
* Responsive User Interface
* MongoDB Database
* RESTful API
* Global Error Handling

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API
* Local Storage

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* CORS
* dotenv

## 📁 Project Structure

```text
CodeAlpha_SocialMediaPlatform/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── profile.html
│   └── public-profile.html
│
├── .gitignore
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/zanjabeelzeeshan4-ai/CodeAlpha_SocialMediaPlatform.git
```

### 2. Open the project

```bash
cd CodeAlpha_SocialMediaPlatform
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/CodeAlphaSocialMedia
JWT_SECRET=your_secret_key
```

Do not upload the `.env` file to GitHub.

### 5. Start the backend

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### 6. Start the frontend

Open the `frontend` folder in VS Code and run the project using Live Server.

The frontend will normally run on a URL similar to:

```text
http://127.0.0.1:5500/
```

## 🔐 Authentication

The application uses JWT-based authentication.

After login, the JWT token is stored in the browser's Local Storage and is used to access protected API routes.

## 🔗 Main API Routes

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Users

```text
GET    /api/users/profile/:username
PUT    /api/users/profile
POST   /api/users/:userId/follow
DELETE /api/users/:userId/follow
```

### Posts

```text
GET    /api/posts
GET    /api/posts/:postId
POST   /api/posts
PUT    /api/posts/:postId
DELETE /api/posts/:postId
```

### Likes

```text
POST   /api/posts/:postId/like
DELETE /api/posts/:postId/like
```

### Comments

```text
GET    /api/comments/:postId
POST   /api/comments/:postId
PUT    /api/comments/:commentId
DELETE /api/comments/:commentId
```

## 🧪 Testing

The backend APIs were tested using Postman.

Tested functionality includes:

* Authentication
* User profiles
* Follow / Unfollow
* Posts
* Likes
* Comments
* Error handling

## 🔒 Security

Sensitive environment variables are excluded from GitHub using `.gitignore`.

The application uses:

* Password hashing with bcryptjs
* JWT authentication
* Protected API routes
* Environment variables for configuration

## 📌 Future Improvements

Possible future improvements include:

* Image upload using cloud storage
* Notifications
* Search functionality
* Real-time messaging
* Infinite scrolling
* Better post media support
* Deployment with production database
* Production-level security improvements

## 👨‍💻 Author

**Zanjabeel Zeeshan**

GitHub:
https://github.com/zanjabeelzeeshan4-ai

## 📄 License

This project was developed for educational and internship purposes.
