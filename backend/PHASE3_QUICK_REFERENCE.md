# Phase 3 - Quick Reference Guide

## 🚀 Quick Start

### Start Server
```bash
cd backend
npm run dev
```

---

## 📡 Job API Endpoints (RECRUITER Only)

### Create Job
```bash
POST /api/jobs

Headers:
Authorization: Bearer <recruiter_token>

Body:
{
  "title": "Senior Full Stack Developer",
  "description": "We are looking for...",
  "skills": ["JavaScript", "React", "Node.js"],
  "location": "San Francisco, CA",
  "experience": {
    "min": 3,
    "max": 7
  }
}
```

### Get My Jobs
```bash
GET /api/jobs/my
GET /api/jobs/my?status=ACTIVE
GET /api/jobs/my?status=CLOSED

Headers:
Authorization: Bearer <recruiter_token>
```

### Get Job by ID
```bash
GET /api/jobs/:id

Headers:
Authorization: Bearer <recruiter_token>
```

### Update Job
```bash
PUT /api/jobs/:id

Headers:
Authorization: Bearer <recruiter_token>

Body (all fields optional):
{
  "title": "Updated Title",
  "location": "Remote"
}
```

### Close Job
```bash
PUT /api/jobs/:id/close

Headers:
Authorization: Bearer <recruiter_token>
```

### Delete Job
```bash
DELETE /api/jobs/:id

Headers:
Authorization: Bearer <recruiter_token>
```

---

## 🧪 Testing Commands

### Create Job
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Full Stack Developer",
    "description": "We are looking for an experienced developer...",
    "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
    "location": "San Francisco, CA (Remote)",
    "experience": {"min": 3, "max": 7}
  }'
```

### Get My Jobs
```bash
curl -X GET http://localhost:5000/api/jobs/my \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Active Jobs Only
```bash
curl -X GET "http://localhost:5000/api/jobs/my?status=ACTIVE" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Job
```bash
curl -X PUT http://localhost:5000/api/jobs/JOB_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Senior Full Stack Engineer", "location": "Remote"}'
```

### Close Job
```bash
curl -X PUT http://localhost:5000/api/jobs/JOB_ID/close \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Delete Job
```bash
curl -X DELETE http://localhost:5000/api/jobs/JOB_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔒 Security Rules

1. **Authentication**: All endpoints require valid JWT token
2. **Authorization**: All endpoints require RECRUITER role
3. **Ownership**: Recruiters can only manage their own jobs
4. **Validation**: All fields validated on create/update

---

## 📁 New Files Created

- `models/Job.js` - Job schema with validation
- `controllers/jobController.js` - CRUD operations
- `routes/jobRoutes.js` - Job endpoints
- `JOB_API_DOCUMENTATION.md` - Full API docs

---

## ✅ Phase 3 Complete

**What Works:**
- Create jobs (RECRUITER only)
- List my jobs (with status filter)
- View job details (must own)
- Update jobs (must own)
- Close jobs (must own)
- Delete jobs (must own)
- Ownership validation
- Role-based access control

**Next Phase:**
- Public job listing for candidates (Phase 4)
