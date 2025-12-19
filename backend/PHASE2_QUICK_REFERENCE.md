# Phase 2 - Quick Reference Guide

## 🚀 Quick Start

### 1. Install Dependencies (if not done)
```bash
cd backend
npm install
```

### 2. Start Server
```bash
npm run dev
```

---

## 📡 API Endpoints

### Register User
```bash
POST /api/auth/register

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123",
  "role": "RECRUITER"  # or "CANDIDATE"
}
```

### Login
```bash
POST /api/auth/login

Body:
{
  "email": "john@example.com",
  "password": "secure123"
}
```

### Get Profile (Protected)
```bash
GET /api/auth/me

Headers:
Authorization: Bearer <your_token>
```

---

## 🧪 Testing Commands

### Register Recruiter
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Recruiter","email":"jane@company.com","password":"secure123","role":"RECRUITER"}'
```

### Register Candidate
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Candidate","email":"john@email.com","password":"secure123","role":"CANDIDATE"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@company.com","password":"secure123"}'
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Recruiter-Only Route
```bash
curl -X GET http://localhost:5000/api/protected/recruiter-only \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN"
```

---

## 🔐 Middleware Usage

### Protect Route (Any Authenticated User)
```javascript
import { authenticate } from '../middleware/auth.js';

router.get('/route', authenticate, controller);
```

### Protect Route (Specific Role)
```javascript
import { authenticate, authorize } from '../middleware/auth.js';

router.post('/jobs', authenticate, authorize('RECRUITER'), createJob);
```

### Protect Route (Multiple Roles)
```javascript
router.get('/jobs', authenticate, authorize('RECRUITER', 'CANDIDATE'), getJobs);
```

---

## 📁 New Files Created

- `models/User.js` - User schema with password hashing
- `controllers/authController.js` - Register, login, profile
- `middleware/auth.js` - Authentication & authorization
- `routes/authRoutes.js` - Auth endpoints
- `routes/protectedExample.js` - Example protected routes
- `utils/jwt.js` - Token generation/verification
- `API_DOCUMENTATION.md` - Full API docs

---

## ✅ Phase 2 Complete

**What Works:**
- User registration (RECRUITER/CANDIDATE)
- User login with JWT
- Password hashing with bcrypt
- Protected routes
- Role-based authorization
- Profile retrieval

**Next Phase:**
- Job posting APIs (Phase 3)
