import express from 'express';
import {
    updateCompanyProfile,
    getCompanyProfile,
    updateCandidateProfile,
    getCandidateProfile
} from '../controllers/profileController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Common Profile Routes
router.use(authenticate); // All profile routes require login

// Recruiter Company Profile Routes
router.route('/company')
    .get(authorize('RECRUITER'), getCompanyProfile)
    .put(authorize('RECRUITER'), updateCompanyProfile);

// Candidate Profile Routes
router.route('/candidate')
    .get(authorize('CANDIDATE'), getCandidateProfile)
    .put(authorize('CANDIDATE'), updateCandidateProfile);

export default router;
