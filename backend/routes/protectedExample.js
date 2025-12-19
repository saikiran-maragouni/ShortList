import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * Example: Protected route (any authenticated user)
 * GET /api/protected/profile
 */
router.get('/profile', authenticate, (req, res) => {
    res.json({
        success: true,
        message: 'This is a protected route',
        user: req.user,
    });
});

/**
 * Example: Recruiter-only route
 * GET /api/protected/recruiter-only
 */
router.get('/recruiter-only', authenticate, authorize('RECRUITER'), (req, res) => {
    res.json({
        success: true,
        message: 'This route is only accessible to recruiters',
        user: req.user,
    });
});

/**
 * Example: Candidate-only route
 * GET /api/protected/candidate-only
 */
router.get('/candidate-only', authenticate, authorize('CANDIDATE'), (req, res) => {
    res.json({
        success: true,
        message: 'This route is only accessible to candidates',
        user: req.user,
    });
});

/**
 * Example: Route accessible to both roles
 * GET /api/protected/both-roles
 */
router.get('/both-roles', authenticate, authorize('RECRUITER', 'CANDIDATE'), (req, res) => {
    res.json({
        success: true,
        message: 'This route is accessible to both recruiters and candidates',
        user: req.user,
    });
});

export default router;
