import express from 'express';
import {
    applyToJob,
    getMyApplications,
    getApplicationById,
} from '../controllers/applicationController.js';
import { authenticate, authorize } from '../middleware/auth.js';
// import upload from '../middleware/upload.js';

const router = express.Router();

/**
 * All routes require authentication and CANDIDATE role
 */

/**
 * @route   POST /api/applications/:jobId/apply
 * @desc    Apply to a job with resume upload
 * @access  Private (CANDIDATE only)
 */
router.post(
    '/:jobId/apply',
    authenticate,
    authorize('CANDIDATE'),
    // upload.single('resume'),
    applyToJob
);

/**
 * @route   GET /api/applications/my
 * @desc    Get all applications by the logged-in candidate
 * @access  Private (CANDIDATE only)
 * @query   status - Optional filter by application status
 */
router.get('/my', authenticate, authorize('CANDIDATE'), getMyApplications);

/**
 * @route   GET /api/applications/:id
 * @desc    Get a single application by ID (must own the application)
 * @access  Private (CANDIDATE only)
 */
router.get('/:id', authenticate, authorize('CANDIDATE'), getApplicationById);

export default router;
