import express from 'express';
import authRoutes from './authRoutes.js';
import protectedExample from './protectedExample.js';
import jobRoutes from './jobRoutes.js';
import publicJobRoutes from './publicJobRoutes.js';
import applicationRoutes from './applicationRoutes.js';
import recruiterApplicationRoutes from './recruiterApplicationRoutes.js';

const router = express.Router();

/**
 * Health check endpoint
 * GET /api/health
 */
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Shortlist API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});

/**
 * Auth routes
 * /api/auth/*
 */
router.use('/auth', authRoutes);

/**
 * Job routes (RECRUITER only)
 * /api/jobs/*
 */
router.use('/jobs', jobRoutes);

/**
 * Public job routes (no authentication required)
 * /api/public/jobs/*
 */
router.use('/public/jobs', publicJobRoutes);

/**
 * Application routes (CANDIDATE only)
 * /api/applications/*
 */
router.use('/applications', applicationRoutes);

/**
 * Recruiter application routes (RECRUITER only)
 * /api/recruiter/applications/*
 */
router.use('/recruiter/applications', recruiterApplicationRoutes);

/**
 * Protected example routes (for testing middleware)
 * /api/protected/*
 */
router.use('/protected', protectedExample);

export default router;
