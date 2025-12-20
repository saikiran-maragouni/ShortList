# Phase 7 - Quick Reference Guide

## 🚀 Quick Start

### Install New Dependency
```bash
cd backend
npm install
```

### Start Server
```bash
npm run dev
```

---

## 🎯 ATS Scoring Overview

**Automatic scoring when candidates apply:**
- Skills Match: 50%
- Experience Match: 30%
- Keyword Relevance: 10%
- Profile Match: 10%

**Total Score: 0-100**

---

## 📡 Updated Endpoints

### Recruiter: Get Applications with ATS Scores
```bash
# Default sorting (newest first)
GET /api/recruiter/applications/job/:jobId

# Sort by ATS score (highest first)
GET /api/recruiter/applications/job/:jobId?sortBy=atsScore

# Filter and sort
GET /api/recruiter/applications/job/:jobId?status=APPLIED&sortBy=atsScore

Headers:
Authorization: Bearer <recruiter_token>
```

### Candidate: Apply (Automatic ATS Scoring)
```bash
POST /api/applications/:jobId/apply

Headers:
Authorization: Bearer <candidate_token>
Content-Type: multipart/form-data

Body:
resume: <PDF file>

# Response includes atsScore and atsBreakdown
```

---

## 🧪 Testing Commands

### Apply with Resume (ATS scores automatically)
```bash
curl -X POST http://localhost:5000/api/applications/JOB_ID/apply \
  -H "Authorization: Bearer CANDIDATE_TOKEN" \
  -F "resume=@resume.pdf"
```

### View Applications Sorted by ATS Score
```bash
curl -X GET "http://localhost:5000/api/recruiter/applications/job/JOB_ID?sortBy=atsScore" \
  -H "Authorization: Bearer RECRUITER_TOKEN"
```

---

## 📊 ATS Score Breakdown

Each application includes:
```json
{
  "atsScore": 75,
  "atsBreakdown": {
    "skillsScore": 40,
    "matchedSkills": ["JavaScript", "React"],
    "unmatchedSkills": ["AWS"],
    "experienceScore": 25,
    "foundExperience": 4,
    "keywordScore": 7,
    "profileScore": 3
  }
}
```

---

## 📁 New Files Created

- `utils/resumeExtractor.js` - PDF text extraction
- `services/atsScoring.js` - Scoring logic
- `ATS_SCORING_DOCUMENTATION.md` - Full documentation

---

## 📝 Updated Files

- `models/Application.js` - Added atsScore, atsBreakdown
- `controllers/applicationController.js` - ATS integration
- `controllers/recruiterApplicationController.js` - Sorting
- `package.json` - Added pdf-parse

---

## 🔍 Scoring Logic

**Skills (50%):**
- Matches required skills in resume
- Case-insensitive matching

**Experience (30%):**
- Extracts years from resume
- Compares with job requirements

**Keywords (10%):**
- Job title and location keywords
- Partial matching

**Profile (10%):**
- Education keywords
- Certifications

---

## ⚠️ Current Limitations

- ✅ PDF resumes only
- ❌ DOC/DOCX not yet supported
- ✅ English language
- ✅ Rule-based (not AI)

---

## ✅ Phase 7 Complete

**What Works:**
- Automatic ATS scoring on application
- Resume text extraction (PDF)
- Rule-based scoring (0-100)
- Detailed score breakdown
- Sorting by ATS score
- Transparent scoring logic

**Next Phase:**
- Email notifications (Phase 8)
