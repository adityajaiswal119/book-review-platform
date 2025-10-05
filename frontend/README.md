# 📚 Book Review Platform

A full-stack **MERN (MongoDB, Express, React, Node.js)** web application that allows users to **discover books, write reviews, and manage their reading experience**.

This platform includes:
- 🖥️ **Frontend** built with React, Vite, React Router, and Tailwind CSS  
- ⚙️ **Backend API** built with Express.js and MongoDB  
- 🔐 **JWT authentication**, **review management**, and **book CRUD operations**

---

## 🚀 Features

### 👤 User Authentication
- Sign up, login, and logout with JWT  
- Password hashing with bcrypt  
- Protected routes (only logged-in users can post reviews or add books)

### 📚 Books Management
- Add, edit, delete, and view books  
- Search by title or author  
- Filter by genre  
- Sort by rating or publish year  
- Pagination support

### ✍️ Review System
- Write, edit, and delete reviews  
- Book’s average rating updates automatically  
- User profile showing all reviews

### 🌗 UI/UX Features
- Responsive design  
- Light/Dark mode toggle  
- Smooth animations and transitions  
- Interactive charts (Recharts)

---

## 🧠 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React 18, Vite, React Router v6, Tailwind CSS, Axios, Lucide Icons, Recharts |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **Authentication** | JSON Web Token (JWT) |
| **Styling** | Tailwind CSS |
| **Deployment** | Render / Vercel / Railway |

---

## 🗂️ Project Structure

book-review-platform/
├── frontend/ # React + Vite frontend
├── backend/ # Express + MongoDB backend
└── README.md # You're reading this :)

yaml
Copy code

---

# 🖥️ Frontend Setup

### 📦 1. Navigate to frontend folder
```bash
cd frontend

📥 2. Install dependencies
npm install

⚙️ 3. Environment setup
Create a .env file:

VITE_API_URL=http://localhost:5000/api

▶️ 4. Run development server
npm run dev
App will run on 👉 http://localhost:3000

🏗️ 5. Build for production
npm run build
