# Shortlist API Documentation - Phase 2

## Authentication & Authorization

All authentication endpoints use JWT (JSON Web Tokens) for secure access.

---

## 📝 Authentication Endpoints

### 1. Register User

**Endpoint:** `POST /api/auth/register`  
**Access:** Public  
**Description:** Register a new user as either a Recruiter or Candidate

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "RECRUITER"
}
```

| Field    | Type   | Required | Description                           |
|----------|--------|----------|---------------------------------------|
| name     | String | Yes      | User's full name (2-100 characters)   |
| email    | String | Yes      | Valid email address (unique)          |
| password | String | Yes      | Password (minimum 6 characters)       |
| role     | String | Yes      | Either "RECRUITER" or "CANDIDATE"     |

#### Success Response (201 Created)

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65abc123def456789",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "RECRUITER",
      "createdAt": "2025-12-19T18:15:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses

**400 Bad Request** - Missing fields
```json
{
  "success": false,
  "message": "Please provide all required fields: name, email, password, role"
}
```

**400 Bad Request** - Invalid role
```json
{
  "success": false,
  "message": "Role must be either RECRUITER or CANDIDATE"
}
```

**409 Conflict** - Email already exists
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

### 2. Login User

**Endpoint:** `POST /api/auth/login`  
**Access:** Public  
**Description:** Login with email and password to receive JWT token

#### Request Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

| Field    | Type   | Required | Description      |
|----------|--------|----------|------------------|
| email    | String | Yes      | User's email     |
| password | String | Yes      | User's password  |

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "65abc123def456789",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "RECRUITER",
      "createdAt": "2025-12-19T18:15:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses

**400 Bad Request** - Missing credentials
```json
{
  "success": false,
  "message": "Please provide email and password"
}
```

**401 Unauthorized** - Invalid credentials
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Get Current User Profile

**Endpoint:** `GET /api/auth/me`  
**Access:** Private (requires authentication)  
**Description:** Get the profile of the currently authenticated user

#### Request Headers

```
Authorization: Bearer <your_jwt_token>
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65abc123def456789",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "RECRUITER",
      "createdAt": "2025-12-19T18:15:00.000Z",
      "updatedAt": "2025-12-19T18:15:00.000Z"
    }
  }
}
```

#### Error Responses

**401 Unauthorized** - No token provided
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

**401 Unauthorized** - Invalid token
```json
{
  "success": false,
  "message": "Invalid or expired token."
}
```

---

## 🔒 Protected Route Examples

These are example routes demonstrating how authentication and authorization work.

### 1. Any Authenticated User

**Endpoint:** `GET /api/protected/profile`  
**Access:** Private (any authenticated user)  
**Headers:** `Authorization: Bearer <token>`

```json
{
  "success": true,
  "message": "This is a protected route",
  "user": {
    "id": "65abc123def456789",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "RECRUITER"
  }
}
```

---

### 2. Recruiter Only

**Endpoint:** `GET /api/protected/recruiter-only`  
**Access:** Private (RECRUITER role only)  
**Headers:** `Authorization: Bearer <token>`

```json
{
  "success": true,
  "message": "This route is only accessible to recruiters",
  "user": { ... }
}
```

**403 Forbidden** - If candidate tries to access:
```json
{
  "success": false,
  "message": "Access denied. Only RECRUITER can access this resource."
}
```

---

### 3. Candidate Only

**Endpoint:** `GET /api/protected/candidate-only`  
**Access:** Private (CANDIDATE role only)  
**Headers:** `Authorization: Bearer <token>`

```json
{
  "success": true,
  "message": "This route is only accessible to candidates",
  "user": { ... }
}
```

---

### 4. Both Roles

**Endpoint:** `GET /api/protected/both-roles`  
**Access:** Private (RECRUITER or CANDIDATE)  
**Headers:** `Authorization: Bearer <token>`

```json
{
  "success": true,
  "message": "This route is accessible to both recruiters and candidates",
  "user": { ... }
}
```

---

## 🔑 How JWT Authentication Works

### 1. Token Structure

The JWT token contains the following payload:

```json
{
  "id": "65abc123def456789",
  "email": "john@example.com",
  "role": "RECRUITER",
  "iat": 1703012100,
  "exp": 1703617900
}
```

- **id**: User's MongoDB ObjectId
- **email**: User's email address
- **role**: User's role (RECRUITER or CANDIDATE)
- **iat**: Issued at timestamp
- **exp**: Expiration timestamp (7 days from issue)

### 2. Using the Token

Include the token in the `Authorization` header for all protected routes:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Token Expiration

- Tokens expire after **7 days**
- After expiration, users must login again to get a new token

---

## 🛡️ Role-Based Access Control

### How Roles Work

1. **RECRUITER** - Can post jobs, view applications, screen candidates
2. **CANDIDATE** - Can view jobs, apply to jobs, upload resumes

### Middleware Usage

#### Protect any route (authentication only):
```javascript
router.get('/route', authenticate, controller);
```

#### Protect route for specific role:
```javascript
router.get('/route', authenticate, authorize('RECRUITER'), controller);
```

#### Protect route for multiple roles:
```javascript
router.get('/route', authenticate, authorize('RECRUITER', 'CANDIDATE'), controller);
```

---

## 🧪 Testing with cURL

### Register a Recruiter

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

### Register a Candidate

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

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@company.com",
    "password": "secure123"
  }'
```

### Get Profile (with token)

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Protected Route

```bash
curl -X GET http://localhost:5000/api/protected/recruiter-only \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📊 Database Schema

### User Model

```javascript
{
  name: String,        // 2-100 characters
  email: String,       // Unique, lowercase
  password: String,    // Hashed with bcrypt (min 6 chars)
  role: String,        // "RECRUITER" or "CANDIDATE"
  createdAt: Date,     // Auto-generated
  updatedAt: Date      // Auto-generated
}
```

---

## ⚠️ Security Notes

1. **Passwords** are hashed using bcrypt with salt rounds of 10
2. **Passwords** are never returned in API responses
3. **JWT Secret** must be set in `.env` file
4. **Tokens** expire after 7 days
5. **Email addresses** are stored in lowercase
6. **Role validation** ensures only RECRUITER or CANDIDATE values

---

## 🚀 Next Phase

Phase 3 will implement:
- Job posting APIs (RECRUITER only)
- Job listing APIs (public/authenticated)
- Job management (update, delete)
