# 🚀 Deployment Guide for ShortList

This guide explains how to deploy the **ShortList** MERN application. The project is structured for separate deployment: **Backend** (Node.js/Express) and **Frontend** (React/Vite).

## 📋 Prerequisites
-   **Node.js** (v18+)
-   **MongoDB Atlas** Cluster (Connection URI)
-   **GitHub Repository** (Project pushed to GitHub)
-   **Render** Account (for Backend)
-   **Vercel** Account (for Frontend)

---

## 1️⃣ Backend Deployment (Render)

We will deploy the `backend` folder as a Web Service.

1.  **Push Code to GitHub**: Ensure your project is on GitHub.
2.  **Dashboard**: Go to [Render Dashboard](https://dashboard.render.com/).
3.  **New Web Service**: Click **New +** -> **Web Service**.
4.  **Connect Repo**: Select your GitHub repository.
5.  **Settings**:
    -   **Root Directory**: `backend` (Important!)
    -   **Build Command**: `npm install`
    -   **Start Command**: `npm start`
    -   **Instance Type**: Free
6.  **Environment Variables**:
    Add the following variables in the "Environment" tab:
    -   `NODE_ENV`: `production`
    -   `PORT`: `5000` (Render might override this, which is fine)
    -   `MONGODB_URI`: `mongodb+srv://...` (Your Atlas Connection String)
    -   `JWT_SECRET`: `(A long, secure random string)`
    -   `FRONTEND_URL`: `https://your-frontend-app.vercel.app` (You'll get this URL after deploying Frontend, come back and update it!)
7.  **Deploy**: Click **Create Web Service**.
8.  **Copy URL**: Once deployed, copy the backend URL (e.g., `https://shortlist-backend.onrender.com`).

---

## 2️⃣ Frontend Deployment (Vercel)

We will deploy the `frontend` folder.

1.  **Dashboard**: Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  **Add New**: Click **Add New...** -> **Project**.
3.  **Import Repo**: Select your GitHub repository.
4.  **Configure Project**:
    -   **Framework Preset**: Vite
    -   **Root Directory**: Click "Edit" and select `frontend`.
5.  **Environment Variables**:
    Add the following:
    -   `VITE_API_URL`: `https://shortlist-backend.onrender.com/api` (Use the Backend URL from Step 1)
6.  **Deploy**: Click **Deploy**.
7.  **Finalize**:
    -   Copy the generated Vercel URL (e.g., `https://shortlist-frontend.vercel.app`).
    -   **Update Backend**: Go back to Render -> Environment Variables and update `FRONTEND_URL` with this Vercel link.
    -   **Redeploy Backend**: Trigger a manual deploy in Render so it picks up the new CORS origin.

---

## 🧹 Maintenance & Cleanup

The project has been cleaned up for production:
-   **Unused Files**: Removed `resumeExtractor.js` and `cloudinary.js` (backend utils) as the system now uses Profile-Based logic.
-   **Dependencies**: Removed `pdf-parse`, `multer`, and `cloudinary` from backend as they are no longer needed.
-   **Logs**: Removed `[DEBUG]` console logs from key controllers.

### Critical Files
-   `backend/utils/jwt.js`: Handles token generation. **Do not delete.**
-   `backend/config/db.js`: Database connection.

---

## ✅ Verification
1.  Open your Vercel URL.
2.  Register as a **Recruiter**.
3.  Complete the **Company Profile**.
4.  Post a Job.
5.  Register as a **Candidate** (in Incognito).
6.  Build a **Candidate Profile**.
7.  Apply to the job.
8.  Login as Recruiter and check the **Applications** tab.
