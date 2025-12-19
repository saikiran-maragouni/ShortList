import express from 'express';
import {
    createJob,
    getMyJobs,
    getJobById,
    updateJob,
    closeJob,
    deleteJob,
} from '../controllers/jobController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * All routes require authentication and RECRUITER role
 */

/**
 * @route   POST /api/jobs
 * @desc    Create a new job posting
 * @access  Private (RECRUITER only)
 */
router.post('/', authenticate, authorize('RECRUITER'), createJob);

/**
 * @route   GET /api/jobs/my
 * @desc    Get all jobs created by the logged-in recruiter
 * @access  Private (RECRUITER only)
 * @query   status - Optional filter by ACTIVE or CLOSED
 */
router.get('/my', authenticate, authorize('RECRUITER'), getMyJobs);

/**
 * @route   GET /api/jobs/:id
 * @desc    Get a single job by ID (must own the job)
 * @access  Private (RECRUITER only)
 */
router.get('/:id', authenticate, authorize('RECRUITER'), getJobById);

/**
 * @route   PUT /api/jobs/:id
 * @desc    Update a job (must own the job)
 * @access  Private (RECRUITER only)
 */
router.put('/:id', authenticate, authorize('RECRUITER'), updateJob);

/**
 * @route   PUT /api/jobs/:id/close
 * @desc    Close a job (change status to CLOSED)
 * @access  Private (RECRUITER only)
 */
router.put('/:id/close', authenticate, authorize('RECRUITER'), closeJob);

/**
 * @route   DELETE /api/jobs/:id
 * @desc    Delete a job (must own the job)
 * @access  Private (RECRUITER only)
 */
router.delete('/:id', authenticate, authorize('RECRUITER'), deleteJob);

export default router;
