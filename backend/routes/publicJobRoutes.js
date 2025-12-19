import express from 'express';
import { getActiveJobs, getActiveJobById } from '../controllers/publicJobController.js';

const router = express.Router();

/**
 * Public job routes - No authentication required
 * These routes are accessible to anyone (candidates, visitors)
 */

/**
 * @route   GET /api/public/jobs
 * @desc    Get all ACTIVE job listings
 * @access  Public
 * @query   location - Filter by location (partial match)
 * @query   skills - Filter by skills (comma-separated)
 * @query   minExperience - Minimum years of experience
 * @query   maxExperience - Maximum years of experience
 */
router.get('/', getActiveJobs);

/**
 * @route   GET /api/public/jobs/:id
 * @desc    Get a single ACTIVE job by ID
 * @access  Public
 */
router.get('/:id', getActiveJobById);

export default router;
