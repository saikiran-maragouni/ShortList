# Phase 6 - Quick Reference Guide

## 🚀 Quick Start

### Start Server
```bash
cd backend
npm run dev
```

---

## 📡 Application Tracking Endpoints

### Recruiter Endpoints (RECRUITER Only)

#### Get Applications for My Job
```bash
GET /api/recruiter/applications/job/:jobId
GET /api/recruiter/applications/job/:jobId?status=SHORTLISTED

Headers:
Authorization: Bearer <recruiter_token>
```

#### Update Application Status
```bash
PUT /api/recruiter/applications/:applicationId/status

Headers:
Authorization: Bearer <recruiter_token>
Content-Type: application/json

Body:
{
  "status": "SHORTLISTED"
}
```

### Candidate Endpoints (CANDIDATE Only)

#### Get My Applications
```bash
GET /api/applications/my
GET /api/applications/my?status=INTERVIEW

Headers:
Authorization: Bearer <candidate_token>
```

---

## 📊 Application Status Lifecycle

```
APPLIED → SHORTLISTED → INTERVIEW → HIRED
       ↘ REJECTED
```

**Valid Statuses:**
- `APPLIED` - Initial status
- `SHORTLISTED` - Passed screening
- `REJECTED` - Application rejected
- `INTERVIEW` - Scheduled for interview
- `HIRED` - Accepted for position

---

## 🧪 Testing Commands

### Recruiter: Get Applications for Job
```bash
curl -X GET http://localhost:5000/api/recruiter/applications/job/JOB_ID \
  -H "Authorization: Bearer RECRUITER_TOKEN"
```

### Recruiter: Update Status to SHORTLISTED
```bash
curl -X PUT http://localhost:5000/api/recruiter/applications/APP_ID/status \
  -H "Authorization: Bearer RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "SHORTLISTED"}'
```

### Recruiter: Update Status to INTERVIEW
```bash
curl -X PUT http://localhost:5000/api/recruiter/applications/APP_ID/status \
  -H "Authorization: Bearer RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "INTERVIEW"}'
```

### Candidate: View My Applications
```bash
curl -X GET http://localhost:5000/api/applications/my \
  -H "Authorization: Bearer CANDIDATE_TOKEN"
```

---

## 🔒 Security Features

1. **Job Ownership** - Recruiters can only see applications for their own jobs
2. **Role Separation** - Recruiters and candidates have different endpoints
3. **Status Validation** - Invalid transitions prevented
4. **No Cross-Access** - Cannot access other users' data

---

## 📁 New Files Created

- `controllers/recruiterApplicationController.js` - Recruiter application logic
- `routes/recruiterApplicationRoutes.js` - Recruiter endpoints
- `RECRUITER_APPLICATION_API_DOCUMENTATION.md` - Full API docs

---

## 📝 Updated Files

- `models/Application.js` - Updated status enum
- `controllers/applicationController.js` - Updated valid statuses
- `routes/index.js` - Added recruiter routes

---

## ✅ Phase 6 Complete

**What Works:**
- Recruiters view applications for their jobs
- Recruiters update application status
- Status transition validation
- Candidates view their applications
- Job ownership validation

**Next Phase:**
- ATS scoring logic (Phase 7)
