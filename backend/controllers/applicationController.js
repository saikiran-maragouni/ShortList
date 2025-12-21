import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { uploadResume } from '../utils/cloudinary.js';
import { calculateATSScore } from '../services/atsScoring.js';

/**
 * Apply to a job
 * POST /api/applications/:jobId/apply
 * @access Private (CANDIDATE only)
 */
export const applyToJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const candidateId = req.user._id;

        // Check if resume file is uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload your resume (PDF, DOC, or DOCX)',
            });
        }

        // Find the job
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Check if job is ACTIVE
        if (job.status !== 'ACTIVE') {
            return res.status(400).json({
                success: false,
                message: 'This job is no longer accepting applications',
            });
        }

        // Check for duplicate application
        const existingApplication = await Application.findOne({
            jobId,
            candidateId,
        });

        if (existingApplication) {
            return res.status(409).json({
                success: false,
                message: 'You have already applied to this job',
            });
        }

        // Upload resume to Cloudinary
        const resumeUrl = await uploadResume(req.file.buffer, candidateId);

        // Calculate ATS score
        const { atsScore, atsBreakdown } = await calculateATSScore(resumeUrl, job);

        // Create application
        const application = await Application.create({
            jobId,
            candidateId,
            resumeUrl,
            status: 'APPLIED',
            atsScore,
            atsBreakdown,
        });

        // Populate job and candidate details
        await application.populate([
            { path: 'jobId', select: 'title location experience' },
            { path: 'candidateId', select: 'name email' },
        ]);

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: { application },
        });
    } catch (error) {
        // Handle duplicate key error (in case index constraint is triggered)
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'You have already applied to this job',
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages,
            });
        }

        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid job ID',
            });
        }

        console.error('Apply Error details:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting application',
            error: error.message,
        });
    }
};

/**
 * Get all applications by the logged-in candidate
 * GET /api/applications/my
 * @access Private (CANDIDATE only)
 */
export const getMyApplications = async (req, res) => {
    try {
        const candidateId = req.user._id;
        const { status } = req.query;

        // Build query
        const query = { candidateId };

        // Filter by status if provided
        if (status) {
            const validStatuses = ['APPLIED', 'SHORTLISTED', 'REJECTED', 'INTERVIEW', 'HIRED'];
            if (!validStatuses.includes(status.toUpperCase())) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status. Must be one of: APPLIED, SHORTLISTED, REJECTED, INTERVIEW, HIRED',
                });
            }
            query.status = status.toUpperCase();
        }

        // Fetch applications
        const applications = await Application.find(query)
            .populate('jobId', 'title location experience status')
            .populate('candidateId', 'name email')
            .sort({ appliedAt: -1 }); // Most recent first

        res.status(200).json({
            success: true,
            count: applications.length,
            data: { applications },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message,
        });
    }
};

/**
 * Get a single application by ID
 * GET /api/applications/:id
 * @access Private (CANDIDATE only, must own the application)
 */
export const getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('jobId', 'title description location experience skills status')
            .populate('candidateId', 'name email');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        // Check if the application belongs to the logged-in candidate
        if (application.candidateId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only view your own applications.',
            });
        }

        res.status(200).json({
            success: true,
            data: { application },
        });
    } catch (error) {
        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid application ID',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error fetching application',
            error: error.message,
        });
    }
};
