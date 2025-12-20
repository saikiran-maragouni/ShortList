# Application Tracking API Documentation - Phase 6

## Recruiter Application Management

These endpoints allow **RECRUITER users** to view and manage applications for their job postings. All endpoints require authentication and RECRUITER role.

---

## 📝 Recruiter Endpoints

### 1. Get Applications for a Job

**Endpoint:** `GET /api/recruiter/applications/job/:jobId`  
**Access:** Private (RECRUITER only, must own the job)  
**Description:** View all applications for a specific job

#### URL Parameters

| Parameter | Type   | Required | Description           |
|-----------|--------|----------|-----------------------|
| jobId     | String | Yes      | MongoDB ObjectId of job |

#### Query Parameters

| Parameter | Type   | Required | Description                                    |
|-----------|--------|----------|------------------------------------------------|
| status    | String | No       | Filter by status (APPLIED, SHORTLISTED, REJECTED, INTERVIEW, HIRED) |

#### Request Headers

```
Authorization: Bearer <recruiter_jwt_token>
```

#### Examples

**Get all applications for a job:**
```
GET /api/recruiter/applications/job/JOB_ID
```

**Filter by status:**
```
GET /api/recruiter/applications/job/JOB_ID?status=SHORTLISTED
GET /api/recruiter/applications/job/JOB_ID?status=INTERVIEW
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
          }
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

#### Error Responses

**403 Forbidden** - Not the job owner
```json
{
  "success": false,
  "message": "Access denied. You can only view applications for your own jobs."
}
```

**404 Not Found** - Job doesn't exist
```json
{
  "success": false,
  "message": "Job not found"
}
```

---

### 2. Update Application Status

**Endpoint:** `PUT /api/recruiter/applications/:applicationId/status`  
**Access:** Private (RECRUITER only, must own the job)  
**Description:** Update the status of an application

#### URL Parameters

| Parameter     | Type   | Required | Description                  |
|---------------|--------|----------|------------------------------|
| applicationId | String | Yes      | MongoDB ObjectId of application |

#### Request Headers

```
Authorization: Bearer <recruiter_jwt_token>
Content-Type: application/json
```

#### Request Body

| Field  | Type   | Required | Description                                    |
|--------|--------|----------|------------------------------------------------|
| status | String | Yes      | New status (APPLIED, SHORTLISTED, REJECTED, INTERVIEW, HIRED) |

#### Example Request

```bash
curl -X PUT http://localhost:5000/api/recruiter/applications/APP_ID/status \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "SHORTLISTED"}'
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Application status updated successfully",
  "data": {
    "application": {
      "_id": "65abc789def012345",
      "jobId": {
        "_id": "65abc123def456789",
        "title": "Senior Full Stack Developer",
        "recruiterId": "65abc111def222333"
      },
      "candidateId": {
        "_id": "65abc456def789012",
        "name": "John Candidate",
        "email": "john@email.com"
      },
      "resumeUrl": "https://res.cloudinary.com/.../resume.pdf",
      "status": "SHORTLISTED",
      "appliedAt": "2025-12-20T12:30:00.000Z",
      "createdAt": "2025-12-20T12:30:00.000Z",
      "updatedAt": "2025-12-20T14:00:00.000Z"
    }
  }
}
```

#### Error Responses

**400 Bad Request** - Invalid status
```json
{
  "success": false,
  "message": "Invalid status. Must be one of: APPLIED, SHORTLISTED, REJECTED, INTERVIEW, HIRED"
}
```

**400 Bad Request** - Invalid transition (HIRED cannot be changed)
```json
{
  "success": false,
  "message": "Cannot change status of a HIRED candidate"
}
```

**400 Bad Request** - Invalid transition (REJECTED to HIRED)
```json
{
  "success": false,
  "message": "Cannot hire a rejected candidate. Please shortlist them first."
}
```

**403 Forbidden** - Not the job owner
```json
{
  "success": false,
  "message": "Access denied. You can only update applications for your own jobs."
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

## 📊 Application Status Lifecycle

```
APPLIED → SHORTLISTED → INTERVIEW → HIRED
       ↘ REJECTED
```

**Status Definitions:**
- **APPLIED** - Initial status when candidate applies
- **SHORTLISTED** - Candidate passed initial screening
- **REJECTED** - Application rejected
- **INTERVIEW** - Candidate scheduled for interview
- **HIRED** - Candidate accepted for the position

**Status Transition Rules:**
- ✅ Can move from APPLIED to any status
- ✅ Can move from SHORTLISTED to INTERVIEW, HIRED, or REJECTED
- ✅ Can move from INTERVIEW to HIRED or REJECTED
- ❌ Cannot change status once HIRED
- ❌ Cannot move from REJECTED directly to HIRED (must SHORTLIST first)

---

## 🔒 Security Features

### Authentication & Authorization

- ✅ **JWT Required** - All endpoints require valid token
- ✅ **RECRUITER Only** - Candidates cannot access these endpoints
- ✅ **Job Ownership** - Can only view/update applications for own jobs

### Data Protection

- ✅ **Ownership Validation** - Verified on every request
- ✅ **Status Validation** - Only valid statuses accepted
- ✅ **Transition Rules** - Invalid transitions prevented

---

## 🧪 Testing Guide

### Prerequisites

1. **Register as a recruiter:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Jane Recruiter",
       "email": "jane@company.com",
       "password": "secure123",
       "role": "RECRUITER"
     }'
   ```

2. **Create a job** (Phase 3)
3. **Have candidates apply** (Phase 5)
4. **Save the recruiter JWT token**

---

### Test 1: Get Applications for Your Job

```bash
curl -X GET http://localhost:5000/api/recruiter/applications/job/YOUR_JOB_ID \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN"
```

**Expected:** 200 OK with list of applications

---

### Test 2: Filter by Status

```bash
curl -X GET "http://localhost:5000/api/recruiter/applications/job/YOUR_JOB_ID?status=APPLIED" \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN"
```

**Expected:** 200 OK with filtered applications

---

### Test 3: Update Application Status

```bash
curl -X PUT http://localhost:5000/api/recruiter/applications/APP_ID/status \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "SHORTLISTED"}'
```

**Expected:** 200 OK with updated application

---

### Test 4: Try to Access Another Recruiter's Applications

```bash
curl -X GET http://localhost:5000/api/recruiter/applications/job/OTHER_RECRUITER_JOB_ID \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN"
```

**Expected:** 403 Forbidden - "You can only view applications for your own jobs"

---

### Test 5: Try Invalid Status Transition

```bash
# First, reject a candidate
curl -X PUT http://localhost:5000/api/recruiter/applications/APP_ID/status \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "REJECTED"}'

# Then try to hire them directly
curl -X PUT http://localhost:5000/api/recruiter/applications/APP_ID/status \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "HIRED"}'
```

**Expected:** 400 Bad Request - "Cannot hire a rejected candidate"

---

## 📋 Candidate vs Recruiter Access

### Candidate Endpoints (Phase 5)
- `POST /api/applications/:jobId/apply` - Apply to job
- `GET /api/applications/my` - View my applications
- `GET /api/applications/:id` - View application details

### Recruiter Endpoints (Phase 6)
- `GET /api/recruiter/applications/job/:jobId` - View applications for my job
- `PUT /api/recruiter/applications/:applicationId/status` - Update status

**Key Differences:**
- Candidates can only see their own applications
- Recruiters can only see applications for their own jobs
- Only recruiters can update application status
- Candidates cannot change status

---

## ⚠️ Important Notes

1. **Job Ownership Required** - Recruiters can only manage applications for jobs they posted
2. **Status Validation** - Invalid statuses are rejected
3. **Transition Rules** - Some status changes are prevented (e.g., HIRED cannot be changed)
4. **No Cross-Access** - Recruiters cannot see other recruiters' applications
5. **Read-Only for Candidates** - Candidates cannot update their application status

---

## 🎯 Next Phase

Phase 7 will implement:
- ATS scoring logic
- Automated screening
- Skill matching algorithms
