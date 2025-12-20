import express from 'express';
import {
    getApplicationsForJob,
    updateApplicationStatus,
} from '../controllers/recruiterApplicationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * All routes require authentication and RECRUITER role
 */

/**
 * @route   GET /api/recruiter/applications/job/:jobId
 * @desc    Get all applications for a specific job (must own the job)
 * @access  Private (RECRUITER only)
 * @query   status - Optional filter by application status
 */
router.get(
    '/job/:jobId',
    authenticate,
    authorize('RECRUITER'),
    getApplicationsForJob
);

/**
 * @route   PUT /api/recruiter/applications/:applicationId/status
 * @desc    Update application status (must own the job)
 * @access  Private (RECRUITER only)
 */
router.put(
    '/:applicationId/status',
    authenticate,
    authorize('RECRUITER'),
    updateApplicationStatus
);

export default router;
