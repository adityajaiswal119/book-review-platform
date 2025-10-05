📚 Book Review Platform – Backend API

A powerful RESTful API built with Node.js, Express, and MongoDB that powers the Book Review Platform.
It handles authentication, book management, and user reviews with full CRUD operations and JWT-based security.

🚀 Features

🔐 User Authentication (Signup / Login / JWT)

📖 Book Management (CRUD operations)

📝 Review Management (CRUD operations)

⭐ Dynamic average rating & review count updates

⚙️ Secure password hashing using bcrypt

🛡️ Middleware-based route protection

🧩 MongoDB schema-based data validation

🔄 Pagination, search, sorting, and filtering for books

🧠 Tech Stack

Backend Framework: Node.js + Express

Database: MongoDB / Mongoose

Authentication: JWT (JSON Web Token)

Environment Management: dotenv

Security: bcrypt for password hashing

Development Tools: Nodemon

⚙️ Setup Instructions
📋 Prerequisites

Ensure you have the following installed:

Node.js (v14 or higher)

MongoDB (local or MongoDB Atlas)

🛠️ Installation

Navigate to backend directory:

cd backend


Install dependencies:

npm install


Create a .env file:

cp .env.example .env


Configure environment variables inside .env:

PORT=5000
PORT=5000
MONGO_URI=mongodb://localhost:27017/book-review-platform
JWT_SECRET=adi1234


▶️ Running the Server
Development mode (auto reload):
npm run dev

Production mode:
npm start


Server runs by default at http://localhost:5000

🧩 API Endpoints
🔑 Authentication Routes
➤ Register User

POST /api/auth/signup
Body:

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}


Response:

{
  "success": true,
  "message": "User registered successfully",
  "token": "<jwt_token>",
  "user": { "id": "123", "name": "John Doe" }
}

➤ Login User

POST /api/auth/login
Body:

{
  "email": "john@example.com",
  "password": "123456"
}


Response:

{
  "success": true,
  "message": "Login successful",
  "token": "<jwt_token>",
  "user": { "id": "123", "name": "John Doe" }
}

➤ Get Current User

GET /api/auth/me
Header: Authorization: Bearer <token>

Response:

{
  "success": true,
  "user": { "id": "123", "name": "John Doe", "email": "john@example.com" }
}

📚 Book Routes
➤ Get All Books

GET /api/books?page=1&limit=5&search=harry&genre=Fiction&sortBy=rating

Response:

{
  "success": true,
  "data": [],
  "pagination": { "page": 1, "limit": 5, "total": 10 }
}

➤ Get Single Book

GET /api/books/:id

➤ Add Book

POST /api/books
Header: Authorization: Bearer <token>
Body:

{
  "title": "Harry Potter",
  "author": "J.K. Rowling",
  "description": "A fantasy novel series",
  "genre": "Fiction",
  "publishedYear": 2000
}

➤ Update Book

PUT /api/books/:id
Header: Authorization: Bearer <token>

➤ Delete Book

DELETE /api/books/:id
Header: Authorization: Bearer <token>

📝 Review Routes
➤ Get Reviews for a Book

GET /api/reviews/book/:bookId

➤ Get Reviews by a User

GET /api/reviews/user/:userId

➤ Add Review

POST /api/reviews
Header: Authorization: Bearer <token>
Body:

{
  "bookId": "653e5c2bff91b3e89d1a7c9b",
  "rating": 5,
  "reviewText": "Amazing read!"
}

➤ Update Review

PUT /api/reviews/:id
Header: Authorization: Bearer <token>

➤ Delete Review

DELETE /api/reviews/:id
Header: Authorization: Bearer <token>

🧱 Database Schema
👤 User
Field	Type	Description
name	String	Required
email	String	Required, unique
password	String	Hashed
createdAt	Date	Auto-generated
📘 Book
Field	Type	Description
title	String	Required
author	String	Required
description	String	Required
genre	String	Enum
publishedYear	Number	Required
addedBy	ObjectId (User)	Reference
averageRating	Number	0–5
reviewCount	Number	Count of reviews
createdAt	Date	Auto-generated
🗒️ Review
Field	Type	Description
bookId	ObjectId (Book)	Reference
userId	ObjectId (User)	Reference
rating	Number	1–5
reviewText	String	Required
createdAt	Date	Auto-generated
🔒 Security Features

Passwords hashed using bcrypt

JWT-based authentication

Protected routes using middleware

Input validation

Centralized error handling

🧪 Testing the API

You can test all routes using:

Postman

Thunder Client (VS Code extension)

cURL

🧰 Folder Structure
backend/
│
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── bookController.js
│   └── reviewController.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── models/
│   ├── User.js
│   ├── Book.js
│   └── Review.js
├── routes/
│   ├── authRoutes.js
│   ├── bookRoutes.js
│   └── reviewRoutes.js
├── server.js
└── .env
