# Job Management API Documentation - Phase 3

## Recruiter Job Management

All job management endpoints require:
- Valid JWT token in Authorization header
- User role must be **RECRUITER**

---

## 📝 Job Endpoints

### 1. Create Job

**Endpoint:** `POST /api/jobs`  
**Access:** Private (RECRUITER only)  
**Description:** Create a new job posting

#### Request Headers
```
Authorization: Bearer <recruiter_jwt_token>
Content-Type: application/json
```

#### Request Body

```json
{
  "title": "Senior Full Stack Developer",
  "description": "We are looking for an experienced full stack developer to join our team. You will work on building scalable web applications using modern technologies.",
  "skills": ["JavaScript", "React", "Node.js", "MongoDB", "AWS"],
  "location": "San Francisco, CA (Remote)",
  "experience": {
    "min": 3,
    "max": 7
  }
}
```

| Field       | Type   | Required | Description                           |
|-------------|--------|----------|---------------------------------------|
| title       | String | Yes      | Job title (3-200 characters)          |
| description | String | Yes      | Job description (20-5000 characters)  |
| skills      | Array  | Yes      | Array of required skills (min 1)      |
| location    | String | Yes      | Job location (max 200 characters)     |
| experience  | Object | Yes      | Experience range                      |
| experience.min | Number | Yes   | Minimum years of experience (≥ 0)     |
| experience.max | Number | Yes   | Maximum years of experience (≥ min)   |

#### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Job created successfully",
  "data": {
    "job": {
      "_id": "65abc123def456789",
      "title": "Senior Full Stack Developer",
      "description": "We are looking for an experienced...",
      "skills": ["JavaScript", "React", "Node.js", "MongoDB", "AWS"],
      "location": "San Francisco, CA (Remote)",
      "experience": {
        "min": 3,
        "max": 7
      },
      "recruiterId": {
        "_id": "65abc111def222333",
        "name": "Jane Recruiter",
        "email": "jane@company.com"
      },
      "status": "ACTIVE",
      "createdAt": "2025-12-19T18:30:00.000Z",
      "updatedAt": "2025-12-19T18:30:00.000Z"
    }
  }
}
```

#### Error Responses

**400 Bad Request** - Missing fields
```json
{
  "success": false,
  "message": "Please provide all required fields: title, description, skills, location, experience"
}
```

**400 Bad Request** - Invalid skills
```json
{
  "success": false,
  "message": "Skills must be a non-empty array"
}
```

**401 Unauthorized** - No token
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

**403 Forbidden** - Not a recruiter
```json
{
  "success": false,
  "message": "Access denied. Only RECRUITER can access this resource."
}
```

---

### 2. Get My Jobs

**Endpoint:** `GET /api/jobs/my`  
**Access:** Private (RECRUITER only)  
**Description:** Get all jobs created by the logged-in recruiter

#### Request Headers
```
Authorization: Bearer <recruiter_jwt_token>
```

#### Query Parameters

| Parameter | Type   | Required | Description                    |
|-----------|--------|----------|--------------------------------|
| status    | String | No       | Filter by ACTIVE or CLOSED     |

#### Examples

Get all jobs:
```
GET /api/jobs/my
```

Get only active jobs:
```
GET /api/jobs/my?status=ACTIVE
```

Get only closed jobs:
```
GET /api/jobs/my?status=CLOSED
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "count": 2,
  "data": {
    "jobs": [
      {
        "_id": "65abc123def456789",
        "title": "Senior Full Stack Developer",
        "description": "We are looking for...",
        "skills": ["JavaScript", "React", "Node.js"],
        "location": "San Francisco, CA",
        "experience": { "min": 3, "max": 7 },
        "recruiterId": {
          "_id": "65abc111def222333",
          "name": "Jane Recruiter",
          "email": "jane@company.com"
        },
        "status": "ACTIVE",
        "createdAt": "2025-12-19T18:30:00.000Z",
        "updatedAt": "2025-12-19T18:30:00.000Z"
      },
      {
        "_id": "65abc456def789012",
        "title": "Frontend Developer",
        "description": "Looking for React expert...",
        "skills": ["React", "TypeScript", "CSS"],
        "location": "Remote",
        "experience": { "min": 2, "max": 5 },
        "recruiterId": {
          "_id": "65abc111def222333",
          "name": "Jane Recruiter",
          "email": "jane@company.com"
        },
        "status": "ACTIVE",
        "createdAt": "2025-12-18T10:15:00.000Z",
        "updatedAt": "2025-12-18T10:15:00.000Z"
      }
    ]
  }
}
```

---

### 3. Get Job by ID

**Endpoint:** `GET /api/jobs/:id`  
**Access:** Private (RECRUITER only, must own the job)  
**Description:** Get details of a specific job

#### Request Headers
```
Authorization: Bearer <recruiter_jwt_token>
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "job": {
      "_id": "65abc123def456789",
      "title": "Senior Full Stack Developer",
      "description": "We are looking for...",
      "skills": ["JavaScript", "React", "Node.js"],
      "location": "San Francisco, CA",
      "experience": { "min": 3, "max": 7 },
      "recruiterId": {
        "_id": "65abc111def222333",
        "name": "Jane Recruiter",
        "email": "jane@company.com"
      },
      "status": "ACTIVE",
      "createdAt": "2025-12-19T18:30:00.000Z",
      "updatedAt": "2025-12-19T18:30:00.000Z"
    }
  }
}
```

#### Error Responses

**400 Bad Request** - Invalid ID
```json
{
  "success": false,
  "message": "Invalid job ID"
}
```

**403 Forbidden** - Not the owner
```json
{
  "success": false,
  "message": "Access denied. You can only view your own jobs."
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Job not found"
}
```

---

### 4. Update Job

**Endpoint:** `PUT /api/jobs/:id`  
**Access:** Private (RECRUITER only, must own the job)  
**Description:** Update job details

#### Request Headers
```
Authorization: Bearer <recruiter_jwt_token>
Content-Type: application/json
```

#### Request Body

All fields are optional. Only include fields you want to update.

```json
{
  "title": "Senior Full Stack Engineer",
  "description": "Updated description...",
  "skills": ["JavaScript", "React", "Node.js", "Docker"],
  "location": "Remote",
  "experience": {
    "min": 4,
    "max": 8
  }
}
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Job updated successfully",
  "data": {
    "job": {
      "_id": "65abc123def456789",
      "title": "Senior Full Stack Engineer",
      "description": "Updated description...",
      "skills": ["JavaScript", "React", "Node.js", "Docker"],
      "location": "Remote",
      "experience": { "min": 4, "max": 8 },
      "recruiterId": {
        "_id": "65abc111def222333",
        "name": "Jane Recruiter",
        "email": "jane@company.com"
      },
      "status": "ACTIVE",
      "createdAt": "2025-12-19T18:30:00.000Z",
      "updatedAt": "2025-12-19T19:45:00.000Z"
    }
  }
}
```

#### Error Responses

**403 Forbidden** - Not the owner
```json
{
  "success": false,
  "message": "Access denied. You can only update your own jobs."
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Job not found"
}
```

---

### 5. Close Job

**Endpoint:** `PUT /api/jobs/:id/close`  
**Access:** Private (RECRUITER only, must own the job)  
**Description:** Close a job (change status to CLOSED)

#### Request Headers
```
Authorization: Bearer <recruiter_jwt_token>
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Job closed successfully",
  "data": {
    "job": {
      "_id": "65abc123def456789",
      "title": "Senior Full Stack Developer",
      "description": "We are looking for...",
      "skills": ["JavaScript", "React", "Node.js"],
      "location": "San Francisco, CA",
      "experience": { "min": 3, "max": 7 },
      "recruiterId": {
        "_id": "65abc111def222333",
        "name": "Jane Recruiter",
        "email": "jane@company.com"
      },
      "status": "CLOSED",
      "createdAt": "2025-12-19T18:30:00.000Z",
      "updatedAt": "2025-12-19T20:00:00.000Z"
    }
  }
}
```

#### Error Responses

**400 Bad Request** - Already closed
```json
{
  "success": false,
  "message": "Job is already closed"
}
```

**403 Forbidden** - Not the owner
```json
{
  "success": false,
  "message": "Access denied. You can only close your own jobs."
}
```

---

### 6. Delete Job

**Endpoint:** `DELETE /api/jobs/:id`  
**Access:** Private (RECRUITER only, must own the job)  
**Description:** Permanently delete a job

#### Request Headers
```
Authorization: Bearer <recruiter_jwt_token>
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

#### Error Responses

**403 Forbidden** - Not the owner
```json
{
  "success": false,
  "message": "Access denied. You can only delete your own jobs."
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Job not found"
}
```

---

## 🧪 Testing with cURL

### Create a Job

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Full Stack Developer",
    "description": "We are looking for an experienced full stack developer with expertise in MERN stack.",
    "skills": ["JavaScript", "React", "Node.js", "MongoDB", "AWS"],
    "location": "San Francisco, CA (Remote)",
    "experience": {
      "min": 3,
      "max": 7
    }
  }'
```

### Get My Jobs

```bash
curl -X GET http://localhost:5000/api/jobs/my \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN"
```

### Get My Active Jobs Only

```bash
curl -X GET "http://localhost:5000/api/jobs/my?status=ACTIVE" \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN"
```

### Get Job by ID

```bash
curl -X GET http://localhost:5000/api/jobs/JOB_ID \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN"
```

### Update Job

```bash
curl -X PUT http://localhost:5000/api/jobs/JOB_ID \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Full Stack Engineer",
    "location": "Remote"
  }'
```

### Close Job

```bash
curl -X PUT http://localhost:5000/api/jobs/JOB_ID/close \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN"
```

### Delete Job

```bash
curl -X DELETE http://localhost:5000/api/jobs/JOB_ID \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN"
```

---

## 🔒 Security & Ownership

### Authentication
- All endpoints require valid JWT token
- Token must be in `Authorization: Bearer <token>` header

### Authorization
- All endpoints require **RECRUITER** role
- Candidates cannot access these endpoints

### Ownership Validation
- Recruiters can only view, update, close, or delete **their own jobs**
- Attempting to modify another recruiter's job returns **403 Forbidden**

---

## 📊 Database Schema

### Job Model

```javascript
{
  title: String,           // 3-200 characters
  description: String,     // 20-5000 characters
  skills: [String],        // Array, min 1 skill
  location: String,        // Max 200 characters
  experience: {
    min: Number,           // >= 0
    max: Number            // >= min
  },
  recruiterId: ObjectId,   // Reference to User
  status: String,          // "ACTIVE" or "CLOSED"
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

---

## 🚀 Recruiter Job Flow

```mermaid
graph TD
    A[Recruiter Logs In] --> B[Create Job]
    B --> C[Job Status: ACTIVE]
    C --> D{Actions}
    D --> E[View My Jobs]
    D --> F[Update Job]
    D --> G[Close Job]
    D --> H[Delete Job]
    F --> C
    G --> I[Job Status: CLOSED]
    I --> J[No More Applications]
```

---

## ⚠️ Important Notes

1. **Ownership**: Recruiters can only manage their own jobs
2. **Status**: Jobs are ACTIVE by default, can be closed but not reopened
3. **Validation**: All fields are validated on create and update
4. **Skills**: Must be a non-empty array
5. **Experience**: Max must be >= Min
6. **Deletion**: Permanently removes job from database

---

## 🎯 Next Phase

Phase 4 will implement:
- Public job listing (for candidates)
- Job application system
- Resume upload functionality
