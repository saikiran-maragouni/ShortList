# Public Job Listings API Documentation - Phase 4

## Public Job Endpoints

These endpoints are **publicly accessible** and do **NOT require authentication**. They allow candidates and visitors to browse ACTIVE job listings.

---

## 📝 Public Job Endpoints

### 1. Get All Active Jobs

**Endpoint:** `GET /api/public/jobs`  
**Access:** Public (no authentication required)  
**Description:** Get all ACTIVE job listings with optional filtering

#### Query Parameters

| Parameter     | Type   | Required | Description                                    |
|---------------|--------|----------|------------------------------------------------|
| location      | String | No       | Filter by location (partial, case-insensitive) |
| skills        | String | No       | Filter by skills (comma-separated)             |
| minExperience | Number | No       | Minimum years of experience                    |
| maxExperience | Number | No       | Maximum years of experience                    |

#### Examples

**Get all active jobs:**
```
GET /api/public/jobs
```

**Filter by location:**
```
GET /api/public/jobs?location=San Francisco
GET /api/public/jobs?location=Remote
```

**Filter by skills:**
```
GET /api/public/jobs?skills=JavaScript,React
GET /api/public/jobs?skills=Python
```

**Filter by experience:**
```
GET /api/public/jobs?minExperience=2&maxExperience=5
```

**Combined filters:**
```
GET /api/public/jobs?location=Remote&skills=React,Node.js&minExperience=3&maxExperience=7
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
        "description": "We are looking for an experienced full stack developer...",
        "skills": ["JavaScript", "React", "Node.js", "MongoDB", "AWS"],
        "location": "San Francisco, CA (Remote)",
        "experience": {
          "min": 3,
          "max": 7
        },
        "recruiterId": {
          "_id": "65abc111def222333",
          "name": "Jane Recruiter"
        },
        "status": "ACTIVE",
        "createdAt": "2025-12-19T18:30:00.000Z",
        "updatedAt": "2025-12-19T18:30:00.000Z"
      },
      {
        "_id": "65abc456def789012",
        "title": "Frontend Developer",
        "description": "Looking for a React expert to build modern UIs...",
        "skills": ["React", "TypeScript", "CSS", "Redux"],
        "location": "Remote",
        "experience": {
          "min": 2,
          "max": 5
        },
        "recruiterId": {
          "_id": "65abc111def222333",
          "name": "Jane Recruiter"
        },
        "status": "ACTIVE",
        "createdAt": "2025-12-18T10:15:00.000Z",
        "updatedAt": "2025-12-18T10:15:00.000Z"
      }
    ]
  }
}
```

#### Empty Results (200 OK)

```json
{
  "success": true,
  "count": 0,
  "data": {
    "jobs": []
  }
}
```

---

### 2. Get Job by ID

**Endpoint:** `GET /api/public/jobs/:id`  
**Access:** Public (no authentication required)  
**Description:** Get details of a specific ACTIVE job

#### URL Parameters

| Parameter | Type   | Required | Description           |
|-----------|--------|----------|-----------------------|
| id        | String | Yes      | MongoDB ObjectId of job |

#### Example

```
GET /api/public/jobs/65abc123def456789
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "job": {
      "_id": "65abc123def456789",
      "title": "Senior Full Stack Developer",
      "description": "We are looking for an experienced full stack developer with expertise in MERN stack. You will work on building scalable web applications using modern technologies. Responsibilities include designing APIs, building responsive UIs, and collaborating with cross-functional teams.",
      "skills": ["JavaScript", "React", "Node.js", "MongoDB", "AWS"],
      "location": "San Francisco, CA (Remote)",
      "experience": {
        "min": 3,
        "max": 7
      },
      "recruiterId": {
        "_id": "65abc111def222333",
        "name": "Jane Recruiter"
      },
      "status": "ACTIVE",
      "createdAt": "2025-12-19T18:30:00.000Z",
      "updatedAt": "2025-12-19T18:30:00.000Z"
    }
  }
}
```

#### Error Responses

**400 Bad Request** - Invalid ID format
```json
{
  "success": false,
  "message": "Invalid job ID"
}
```

**404 Not Found** - Job doesn't exist or is CLOSED
```json
{
  "success": false,
  "message": "Job not found or no longer available"
}
```

---

## 🔒 Security & Privacy

### What's Exposed

✅ **Public Information:**
- Job title, description, skills
- Location and experience requirements
- Job status (only ACTIVE jobs shown)
- Recruiter name (for transparency)
- Creation and update timestamps

### What's Protected

❌ **Hidden Information:**
- Recruiter email address
- Recruiter password (never stored in plain text)
- CLOSED jobs (not visible to public)
- Internal database fields (`__v`)

### Key Security Features

1. **No Authentication Required** - Anyone can browse jobs
2. **Only ACTIVE Jobs** - CLOSED jobs are automatically filtered out
3. **Limited Recruiter Data** - Only recruiter name is shown (no email)
4. **Read-Only Access** - Public endpoints cannot modify data

---

## 🧪 Testing with cURL

### Get All Active Jobs

```bash
curl -X GET http://localhost:5000/api/public/jobs
```

### Filter by Location

```bash
curl -X GET "http://localhost:5000/api/public/jobs?location=Remote"
```

### Filter by Skills

```bash
curl -X GET "http://localhost:5000/api/public/jobs?skills=JavaScript,React"
```

### Filter by Experience

```bash
curl -X GET "http://localhost:5000/api/public/jobs?minExperience=2&maxExperience=5"
```

### Combined Filters

```bash
curl -X GET "http://localhost:5000/api/public/jobs?location=San%20Francisco&skills=React,Node.js&minExperience=3&maxExperience=7"
```

### Get Job by ID

```bash
curl -X GET http://localhost:5000/api/public/jobs/JOB_ID_HERE
```

---

## 🔍 Filtering Logic

### Location Filter

- **Case-insensitive** partial match
- Example: `location=remote` matches "Remote", "Remote Worldwide", "San Francisco (Remote)"

### Skills Filter

- **Comma-separated** list of skills
- **Case-insensitive** matching
- Returns jobs that have **any** of the specified skills
- Example: `skills=React,Vue` returns jobs with React OR Vue

### Experience Filter

- **Range-based** matching
- `minExperience`: Candidate's minimum experience
- `maxExperience`: Candidate's maximum experience
- Logic: Job's experience range should overlap with candidate's range

**Example:**
- Candidate: 3-5 years experience
- Query: `minExperience=3&maxExperience=5`
- Matches jobs requiring: 2-4 years, 3-7 years, 4-6 years
- Does NOT match: 0-2 years, 6-10 years

---

## 📊 Response Format

### Success Response Structure

```json
{
  "success": true,
  "count": <number>,        // Total jobs returned
  "data": {
    "jobs": [<job objects>]
  }
}
```

### Single Job Response Structure

```json
{
  "success": true,
  "data": {
    "job": <job object>
  }
}
```

### Error Response Structure

```json
{
  "success": false,
  "message": "<error message>",
  "error": "<technical error details>"  // Only in development
}
```

---

## 🎯 Use Cases

### For Candidates

1. **Browse All Jobs**
   ```
   GET /api/public/jobs
   ```

2. **Find Remote Jobs**
   ```
   GET /api/public/jobs?location=Remote
   ```

3. **Find Jobs Matching Skills**
   ```
   GET /api/public/jobs?skills=React,JavaScript
   ```

4. **Find Jobs for Experience Level**
   ```
   GET /api/public/jobs?minExperience=2&maxExperience=4
   ```

5. **View Job Details**
   ```
   GET /api/public/jobs/:id
   ```

---

## 🚀 Integration Examples

### JavaScript/Fetch

```javascript
// Get all active jobs
fetch('http://localhost:5000/api/public/jobs')
  .then(res => res.json())
  .then(data => console.log(data.data.jobs));

// Filter by skills
fetch('http://localhost:5000/api/public/jobs?skills=React,Node.js')
  .then(res => res.json())
  .then(data => console.log(data.data.jobs));

// Get job by ID
fetch('http://localhost:5000/api/public/jobs/65abc123def456789')
  .then(res => res.json())
  .then(data => console.log(data.data.job));
```

### Axios

```javascript
import axios from 'axios';

// Get all active jobs
const jobs = await axios.get('/api/public/jobs');
console.log(jobs.data.data.jobs);

// Filter by location and experience
const filteredJobs = await axios.get('/api/public/jobs', {
  params: {
    location: 'Remote',
    minExperience: 3,
    maxExperience: 7
  }
});
console.log(filteredJobs.data.data.jobs);
```

---

## ⚠️ Important Notes

1. **No Authentication** - These endpoints are completely public
2. **Only ACTIVE Jobs** - CLOSED jobs are never returned
3. **Read-Only** - Cannot create, update, or delete jobs via these endpoints
4. **Recruiter Privacy** - Only recruiter name is exposed (no email)
5. **Filtering is Optional** - All parameters are optional
6. **Case-Insensitive** - Location and skills filters are case-insensitive

---

## 🎯 Next Phase

Phase 5 will implement:
- Job application system (CANDIDATE only)
- Resume upload functionality
- Application tracking
