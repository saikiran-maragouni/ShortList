# 🎯 Shortlist - AI-Powered Recruitment & ATS Platform

A modern, full-stack MERN application for recruitment and applicant tracking, featuring an **AI-powered ATS scoring engine** to help recruiters filter candidates efficiently.

## 🚀 Features

### For Recruiters 👔
-   **Dashboard**: View active jobs, total applications, and recent activity.
-   **Job Management**: Post, edit, and close job listings.
-   **Application Tracking**: centralized view of all candidates for a job.
-   **ATS Scoring 🤖**: Automatically parses resumes (PDF) and scores them (0-100) based on:
    -   Skill Match
    -   Experience Match
    -   Keyword Frequency
    -   Profile Alignment
-   **Status Workflow**: Move candidates through stages (Applied → Shortlisted → Interview → Hired).

### For Candidates 👨‍💻
-   **Job Search**: Browse active job listings with filters (Location, Role, Skills).
-   **Easy Apply**: Submit text-based applications or upload resumes.
-   **Application Tracking**: Monitor the status of all submitted applications.
-   **Smart Alerts**: duplicate application prevention and real-time status updates.

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), CSS Modules, Context API
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB Atlas (Mongoose ODM)
-   **Authentication**: JWT with Role-Based Access Control (RBAC)
-   **File Storage**: Cloudinary (Mock/Real)
-   **Parsing**: `pdf-parse` for resume text extraction

## 📋 Project Status

**Current Phase: Phase 8 - COMPLETE ✅**

All core modules are implemented and verified:
1.  **Foundation**: Server & Client setup.
2.  **Auth**: Secure Register/Login with BCrypt & JWT.
3.  **Job System**: CRUD operations for jobs with ownership validation.
4.  **Public View**: Optimized public job feed.
5.  **Applications**: Robust application submission flow.
6.  **Tracking**: Recruiter dashboard & candidate status updates.
7.  **ATS Engine**: Intelligent scoring algorithm.
8.  **Polish**: Frontend integration & deployment readiness.

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18+)
-   MongoDB Atlas connection string
-   Cloudinary Account (Optional - supports mock mode)

### Backend Setup

1.  Navigate to `backend`:
    ```bash
    cd backend
    npm install
    ```
2.  Create `.env`:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_secure_secret
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_key
    CLOUDINARY_API_SECRET=your_secret
    ```
3.  Start Server:
    ```bash
    npm run dev
    ```

### Frontend Setup

1.  Navigate to `frontend`:
    ```bash
    cd frontend
    npm install
    ```
2.  Create `.env`:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
3.  Start Client:
    ```bash
    npm run dev
    ```

## 🧪 Testing

-   **Candidate Flow**: Register as candidate -> View Jobs -> Apply.
-   **Recruiter Flow**: Register as recruiter -> Post Job -> View Applications -> Check ATS Scores.
-   **ATS**: Upload a PDF resume to see the auto-generated score.

## 📄 License

ISC
