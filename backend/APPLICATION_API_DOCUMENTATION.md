# Application API Documentation - Phase 5

## Job Application & Resume Upload

These endpoints allow **CANDIDATE users** to apply to jobs and upload resumes. All endpoints require authentication and CANDIDATE role.

---

## 📝 Application Endpoints

### 1. Apply to a Job

**Endpoint:** `POST /api/applications/:jobId/apply`  
**Access:** Private (CANDIDATE only)  
**Description:** Apply to a job with resume upload

#### URL Parameters

| Parameter | Type   | Required | Description           |
|-----------|--------|----------|-----------------------|
| jobId     | String | Yes      | MongoDB ObjectId of job |

#### Request Headers

```
Authorization: Bearer <candidate_jwt_token>
Content-Type: multipart/form-data
```

#### Request Body (Form Data)

| Field  | Type | Required | Description                          |
|--------|------|----------|--------------------------------------|
| resume | File | Yes      | Resume file (PDF, DOC, or DOCX, max 5MB) |

#### Example Request (cURL)

```bash
curl -X POST http://localhost:5000/api/applications/JOB_ID/apply \
  -H "Authorization: Bearer YOUR_CANDIDATE_TOKEN" \
  -F "resume=@/path/to/your/resume.pdf"
```

#### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "application": {
      "_id": "65abc789def012345",
      "jobId": {
        "_id": "65abc123def456789",
        "title": "Senior Full Stack Developer",
        "location": "San Francisco, CA (Remote)",
        "experience": {
          "min": 3,
          "max": 7
        }
      },
      "candidateId": {
        "_id": "65abc456def789012",
        "name": "John Candidate",
        "email": "john@email.com"
      },
      "resumeUrl": "https://res.cloudinary.com/your-cloud/raw/upload/v1234567890/shortlist/resumes/resume_65abc456def789012_1703012345678.pdf",
      "status": "APPLIED",
      "appliedAt": "2025-12-20T12:30:00.000Z",
      "createdAt": "2025-12-20T12:30:00.000Z",
      "updatedAt": "2025-12-20T12:30:00.000Z"
    }
  }
}
```

#### Error Responses

**400 Bad Request** - No resume uploaded
```json
{
  "success": false,
  "message": "Please upload your resume (PDF, DOC, or DOCX)"
}
```

**400 Bad Request** - Invalid file type
```json
{
  "success": false,
  "message": "Invalid file type. Only PDF, DOC, and DOCX files are allowed."
}
```

**400 Bad Request** - Job is CLOSED
```json
{
  "success": false,
  "message": "This job is no longer accepting applications"
}
```

**401 Unauthorized** - No token
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

**403 Forbidden** - Not a candidate
```json
{
  "success": false,
  "message": "Access denied. Only CANDIDATE can access this resource."
}
```

**404 Not Found** - Job doesn't exist
```json
{
  "success": false,
  "message": "Job not found"
}
```

**409 Conflict** - Already applied
```json
{
  "success": false,
  "message": "You have already applied to this job"
}
```

**413 Payload Too Large** - File too large
```json
{
  "success": false,
  "message": "File too large. Maximum size is 5MB."
}
```

---

### 2. Get My Applications

**Endpoint:** `GET /api/applications/my`  
**Access:** Private (CANDIDATE only)  
**Description:** Get all applications submitted by the logged-in candidate

#### Request Headers

```
Authorization: Bearer <candidate_jwt_token>
```

#### Query Parameters

| Parameter | Type   | Required | Description                                    |
|-----------|--------|----------|------------------------------------------------|
| status    | String | No       | Filter by status (APPLIED, REVIEWING, SHORTLISTED, REJECTED, ACCEPTED) |

#### Examples

**Get all applications:**
```
GET /api/applications/my
```

**Filter by status:**
```
GET /api/applications/my?status=APPLIED
GET /api/applications/my?status=SHORTLISTED
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "count": 2,
  "data": {
    "applications": [
      {
        "_id": "65abc789def012345",
        "jobId": {
          "_id": "65abc123def456789",
          "title": "Senior Full Stack Developer",
          "location": "San Francisco, CA (Remote)",
          "experience": {
            "min": 3,
            "max": 7
          },
          "status": "ACTIVE"
        },
        "candidateId": {
          "_id": "65abc456def789012",
          "name": "John Candidate",
          "email": "john@email.com"
        },
        "resumeUrl": "https://res.cloudinary.com/.../resume.pdf",
        "status": "APPLIED",
        "appliedAt": "2025-12-20T12:30:00.000Z",
        "createdAt": "2025-12-20T12:30:00.000Z",
        "updatedAt": "2025-12-20T12:30:00.000Z"
      }
    ]
  }
}
```

---

### 3. Get Application by ID

**Endpoint:** `GET /api/applications/:id`  
**Access:** Private (CANDIDATE only, must own the application)  
**Description:** Get details of a specific application

#### URL Parameters

| Parameter | Type   | Required | Description                  |
|-----------|--------|----------|------------------------------|
| id        | String | Yes      | MongoDB ObjectId of application |

#### Request Headers

```
Authorization: Bearer <candidate_jwt_token>
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "application": {
      "_id": "65abc789def012345",
      "jobId": {
        "_id": "65abc123def456789",
        "title": "Senior Full Stack Developer",
        "description": "We are looking for...",
        "location": "San Francisco, CA (Remote)",
        "experience": {
          "min": 3,
          "max": 7
        },
        "skills": ["JavaScript", "React", "Node.js"],
        "status": "ACTIVE"
      },
      "candidateId": {
        "_id": "65abc456def789012",
        "name": "John Candidate",
        "email": "john@email.com"
      },
      "resumeUrl": "https://res.cloudinary.com/.../resume.pdf",
      "status": "APPLIED",
      "appliedAt": "2025-12-20T12:30:00.000Z",
      "createdAt": "2025-12-20T12:30:00.000Z",
      "updatedAt": "2025-12-20T12:30:00.000Z"
    }
  }
}
```

#### Error Responses

**403 Forbidden** - Not the owner
```json
{
  "success": false,
  "message": "Access denied. You can only view your own applications."
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Application not found"
}
```

---

## 🔒 Security Features

### Authentication & Authorization

- ✅ **JWT Required** - All endpoints require valid token
- ✅ **CANDIDATE Only** - Recruiters cannot apply to jobs
- ✅ **Ownership Validation** - Can only view own applications

### File Upload Security

- ✅ **File Type Validation** - Only PDF, DOC, DOCX allowed
- ✅ **File Size Limit** - Maximum 5MB
- ✅ **Secure Storage** - Files uploaded to Cloudinary (not local server)
- ✅ **Unique Filenames** - Prevents file conflicts

### Duplicate Prevention

- ✅ **Database Index** - Compound unique index on (jobId, candidateId)
- ✅ **Application Check** - Validates before upload
- ✅ **409 Conflict** - Clear error message for duplicates

### Data Validation

- ✅ **Job Status Check** - Only ACTIVE jobs accept applications
- ✅ **Job Existence** - Validates job exists before applying
- ✅ **Resume Required** - Cannot apply without resume

---

## 📊 Application Status Flow

```
APPLIED → REVIEWING → SHORTLISTED → ACCEPTED
                   ↘ REJECTED
```

**Status Definitions:**
- **APPLIED** - Initial status when candidate applies
- **REVIEWING** - Recruiter is reviewing the application
- **SHORTLISTED** - Candidate passed initial screening
- **REJECTED** - Application rejected
- **ACCEPTED** - Candidate accepted for the position

---

## 🧪 Testing Guide

### Prerequisites

1. **Register as a candidate:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "John Candidate",
       "email": "john@email.com",
       "password": "secure123",
       "role": "CANDIDATE"
     }'
   ```

2. **Save the JWT token from response**

3. **Ensure you have ACTIVE jobs** (created by recruiters in Phase 3)

---

### Test 1: Apply to a Job

```bash
curl -X POST http://localhost:5000/api/applications/JOB_ID/apply \
  -H "Authorization: Bearer YOUR_CANDIDATE_TOKEN" \
  -F "resume=@/path/to/resume.pdf"
```

**Expected:** 201 Created with application details

---

### Test 2: Try to Apply Again (Duplicate)

```bash
curl -X POST http://localhost:5000/api/applications/JOB_ID/apply \
  -H "Authorization: Bearer YOUR_CANDIDATE_TOKEN" \
  -F "resume=@/path/to/resume.pdf"
```

**Expected:** 409 Conflict - "You have already applied to this job"

---

### Test 3: Get My Applications

```bash
curl -X GET http://localhost:5000/api/applications/my \
  -H "Authorization: Bearer YOUR_CANDIDATE_TOKEN"
```

**Expected:** 200 OK with list of applications

---

### Test 4: Filter by Status

```bash
curl -X GET "http://localhost:5000/api/applications/my?status=APPLIED" \
  -H "Authorization: Bearer YOUR_CANDIDATE_TOKEN"
```

**Expected:** 200 OK with filtered applications

---

### Test 5: Try to Apply as Recruiter

```bash
curl -X POST http://localhost:5000/api/applications/JOB_ID/apply \
  -H "Authorization: Bearer RECRUITER_TOKEN" \
  -F "resume=@/path/to/resume.pdf"
```

**Expected:** 403 Forbidden - "Only CANDIDATE can access this resource"

---

## 📁 Resume Upload Details

### Cloudinary Configuration

Resumes are uploaded to Cloudinary with the following settings:

- **Folder:** `shortlist/resumes/`
- **Resource Type:** `raw` (for non-image files)
- **Public ID Format:** `resume_{candidateId}_{timestamp}`
- **Allowed Formats:** PDF, DOC, DOCX
- **Max File Size:** 5MB

### Environment Variables Required

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Resume URL Format

```
https://res.cloudinary.com/{cloud_name}/raw/upload/v{version}/shortlist/resumes/resume_{candidateId}_{timestamp}.pdf
```

---

## ⚠️ Important Notes

1. **File Size Limit:** 5MB maximum
2. **Allowed Formats:** PDF, DOC, DOCX only
3. **One Application Per Job:** Cannot apply twice to the same job
4. **ACTIVE Jobs Only:** Cannot apply to CLOSED jobs
5. **CANDIDATE Role Required:** Recruiters cannot apply
6. **Resume Required:** Cannot submit application without resume

---

## 🎯 Next Phase

Phase 6 will implement:
- Recruiter viewing applications
- Application status updates (RECRUITER only)
- ATS screening logic
