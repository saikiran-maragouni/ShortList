# 🎯 Shortlist - Recruitment & ATS Platform

A modern, full-stack MERN application for recruitment and applicant tracking.

## 📋 Project Status

**Current Phase: Phase 1 - Foundation Complete ✅**

This is a modular build. Each phase will be completed and verified before moving to the next.

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Auth**: JWT (role-based)
- **Module System**: ES Modules (import/export)

## 📁 Project Structure

```
ShortList/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   └── errorHandler.js       # Error handling middleware
│   ├── routes/
│   │   └── index.js              # API routes
│   ├── models/                   # (Phase 2)
│   ├── controllers/              # (Phase 2)
│   ├── .env.example              # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   └── server.js                 # Express server entry point
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/           # (Phase 2+)
    │   ├── pages/                # (Phase 2+)
    │   ├── services/             # (Phase 2+)
    │   ├── utils/                # (Phase 2+)
    │   ├── App.jsx               # Main App component
    │   ├── App.css
    │   ├── main.jsx              # React entry point
    │   └── index.css
    ├── .env.example
    ├── .gitignore
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from template:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your MongoDB Atlas credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?appName=<appname>
   JWT_SECRET=your_secure_jwt_secret_here
   FRONTEND_URL=http://localhost:3000
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from template:
   ```bash
   cp .env.example .env
   ```

4. Update `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

   The app will run on `http://localhost:3000`

## 🧪 Testing the Setup

### Backend Health Check

Visit: `http://localhost:5000/api/health`

Expected response:
```json
{
  "success": true,
  "message": "Shortlist API is running",
  "timestamp": "2025-12-19T...",
  "environment": "development"
}
```

### MongoDB Connection

Check your terminal for:
```
✅ MongoDB Connected: shortlist-cluster.softgwc.mongodb.net
📊 Database: shortlist_db
```

### Frontend

Visit: `http://localhost:3000`

You should see the Shortlist landing page with "Phase 1: Foundation Complete" badge.

## 🌐 Deployment Ready

### Backend (Render)

- Uses environment variables (no hardcoded secrets)
- ES modules configured
- Error handling middleware in place
- CORS configured for production

### Frontend (Vercel)

- Vite build system
- Environment variables via `VITE_` prefix
- Production-ready build command: `npm run build`

## 📝 Phase 1 Checklist

- ✅ Backend folder structure created
- ✅ Frontend folder structure created
- ✅ Express server with ES modules
- ✅ MongoDB Atlas connection configured
- ✅ Environment variables setup
- ✅ CORS and middleware configured
- ✅ Health check endpoint
- ✅ Error handling
- ✅ Deploy-ready configuration
- ✅ .gitignore files (secrets protected)

## 🎯 Next Phases (Not Started)

- **Phase 2**: Authentication & User Management
- **Phase 3**: Job Posting & Management
- **Phase 4**: Application System
- **Phase 5**: ATS Screening Logic
- **Phase 6**: UI/UX Enhancement

## ⚠️ Important Notes

- **DO NOT** commit `.env` files
- **DO NOT** hardcode MongoDB credentials
- MongoDB Atlas connection string is loaded from environment variables only
- This is Phase 1 only - no auth, jobs, or applications yet

## 📄 License

ISC
