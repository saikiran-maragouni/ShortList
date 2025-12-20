# Phase 5 - Quick Reference Guide

## 🚀 Quick Start

### Install New Dependencies
```bash
cd backend
npm install
```

### Configure Cloudinary

1. **Sign up for Cloudinary** (free tier): https://cloudinary.com/
2. **Get your credentials** from dashboard
3. **Update `.env` file:**
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Start Server
```bash
npm run dev
```

---

## 📡 Application API Endpoints (CANDIDATE Only)

### Apply to a Job
```bash
POST /api/applications/:jobId/apply

Headers:
Authorization: Bearer <candidate_token>
Content-Type: multipart/form-data

Body (Form Data):
resume: <file> (PDF, DOC, or DOCX, max 5MB)
```

### Get My Applications
```bash
GET /api/applications/my
GET /api/applications/my?status=APPLIED

Headers:
Authorization: Bearer <candidate_token>
```

### Get Application by ID
```bash
GET /api/applications/:id

Headers:
Authorization: Bearer <candidate_token>
```

---

## 🧪 Testing Commands

### Apply to a Job
```bash
curl -X POST http://localhost:5000/api/applications/JOB_ID/apply \
  -H "Authorization: Bearer YOUR_CANDIDATE_TOKEN" \
  -F "resume=@/path/to/your/resume.pdf"
```

### Get My Applications
```bash
curl -X GET http://localhost:5000/api/applications/my \
  -H "Authorization: Bearer YOUR_CANDIDATE_TOKEN"
```

### Filter by Status
```bash
curl -X GET "http://localhost:5000/api/applications/my?status=APPLIED" \
  -H "Authorization: Bearer YOUR_CANDIDATE_TOKEN"
```

---

## 🔒 Security Features

1. **CANDIDATE Only** - Recruiters cannot apply
2. **Duplicate Prevention** - One application per job per candidate
3. **File Validation** - Only PDF, DOC, DOCX (max 5MB)
4. **Secure Upload** - Cloudinary cloud storage
5. **ACTIVE Jobs Only** - Cannot apply to CLOSED jobs

---

## 📁 New Files Created

- `models/Application.js` - Application schema
- `controllers/applicationController.js` - Application logic
- `routes/applicationRoutes.js` - Application endpoints
- `utils/cloudinary.js` - Resume upload utility
- `middleware/upload.js` - Multer file validation
- `APPLICATION_API_DOCUMENTATION.md` - Full API docs

---

## 📦 New Dependencies

- `cloudinary` - Cloud file storage
- `multer` - File upload handling

---

## ✅ Phase 5 Complete

**What Works:**
- Apply to jobs with resume upload
- Duplicate application prevention
- View my applications
- Filter applications by status
- Secure file upload to Cloudinary
- CANDIDATE-only access

**Next Phase:**
- Recruiter viewing applications (Phase 6)
