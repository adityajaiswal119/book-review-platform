# BookReview Frontend

React frontend for the Book Review Platform built with Vite, React Router, and Tailwind CSS.

## Features

- User authentication (signup/login)
- Browse books with search, filter, and pagination
- View book details with reviews and rating charts
- Add, edit, and delete books
- Write and manage reviews
- User profile with statistics
- Dark/light mode toggle
- Responsive design

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Create `.env` file:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Update the API URL in `.env` if needed (default: http://localhost:5000/api)

4. Start development server:
\`\`\`bash
npm run dev
\`\`\`

The app will run on http://localhost:3000

## Build for Production

\`\`\`bash
npm run build
\`\`\`

The build output will be in the `dist` folder.

## Tech Stack

- React 18
- Vite
- React Router v6
- Axios
- Tailwind CSS
- Recharts
- Lucide React Icons
\`\`\`

```typescriptreact file="app/page.tsx" isDeleted="true"
...deleted...
