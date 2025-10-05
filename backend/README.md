# Book Review Platform - Backend API

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Navigate to the backend directory:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env` file based on `.env.example`:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Update the `.env` file with your MongoDB connection string and JWT secret.

### Running the Server

Development mode (with auto-reload):
\`\`\`bash
npm run dev
\`\`\`

Production mode:
\`\`\`bash
npm start
\`\`\`

The server will run on `http://localhost:5000` by default.

## API Documentation

### Authentication Endpoints

#### Register User
- **POST** `/api/auth/signup`
- **Body**: `{ name, email, password }`
- **Response**: `{ success, message, token, user }`

#### Login User
- **POST** `/api/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ success, message, token, user }`

#### Get Current User
- **GET** `/api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, user }`

### Book Endpoints

#### Get All Books (with pagination, search, filter)
- **GET** `/api/books?page=1&limit=5&search=query&genre=Fiction&sortBy=rating`
- **Response**: `{ success, data, pagination }`

#### Get Single Book
- **GET** `/api/books/:id`
- **Response**: `{ success, data }`

#### Add Book
- **POST** `/api/books`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ title, author, description, genre, publishedYear }`
- **Response**: `{ success, message, data }`

#### Update Book
- **PUT** `/api/books/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ title, author, description, genre, publishedYear }`
- **Response**: `{ success, message, data }`

#### Delete Book
- **DELETE** `/api/books/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, message }`

### Review Endpoints

#### Get Reviews for a Book
- **GET** `/api/reviews/book/:bookId`
- **Response**: `{ success, data }`

#### Get Reviews by User
- **GET** `/api/reviews/user/:userId`
- **Response**: `{ success, data }`

#### Add Review
- **POST** `/api/reviews`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ bookId, rating, reviewText }`
- **Response**: `{ success, message, data }`

#### Update Review
- **PUT** `/api/reviews/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ rating, reviewText }`
- **Response**: `{ success, message, data }`

#### Delete Review
- **DELETE** `/api/reviews/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, message }`

## Database Schema

### User
- name: String (required)
- email: String (required, unique)
- password: String (required, hashed)
- createdAt: Date

### Book
- title: String (required)
- author: String (required)
- description: String (required)
- genre: String (enum, required)
- publishedYear: Number (required)
- addedBy: ObjectId (ref: User)
- averageRating: Number (0-5)
- reviewCount: Number
- createdAt: Date
- updatedAt: Date

### Review
- bookId: ObjectId (ref: Book)
- userId: ObjectId (ref: User)
- rating: Number (1-5, required)
- reviewText: String (required)
- createdAt: Date
- updatedAt: Date

## Security Features
- Password hashing with bcrypt
- JWT authentication
- Protected routes with middleware
- Input validation
- Error handling
