import Job from '../models/Job.js';
// Check for salary feature

/**
 * Create a new job posting
 * POST /api/jobs
 * @access Private (RECRUITER only)
 */
export const createJob = async (req, res, next) => {
    try {
        const { title, description, skills, location, experience, salary } = req.body;

        // Phase 9: Enforce mandatory company profile
        if (!req.user.companyProfile || !req.user.companyProfile.companyName) {
            res.status(400);
            throw new Error('Please complete your company profile before posting a job');
        }

        // Validate required fields
        if (!title || !description || !skills || !location || !experience) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: title, description, skills, location, experience',
            });
        }

        // Validate experience object
        if (!experience.min && experience.min !== 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide minimum experience',
            });
        }

        if (!experience.max && experience.max !== 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide maximum experience',
            });
        }

        // Validate skills array
        if (!Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Skills must be a non-empty array',
            });
        }

        // Create job with authenticated recruiter's ID
        const job = await Job.create({
            title,
            description,
            skills,
            location,
            experience: {
                min: experience.min,
                max: experience.max,
            },
            salary: salary ? {
                min: salary.min,
                max: salary.max
            } : undefined,
            recruiterId: req.user._id, // From authenticate middleware
        });

        // Populate recruiter details
        await job.populate('recruiterId', 'name email');

        res.status(201).json({
            success: true,
            message: 'Job created successfully',
            data: { job },
        });
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages,
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating job',
            error: error.message,
        });
    }
};

/**
 * Get all jobs created by the logged-in recruiter
 * GET /api/jobs/my
 * @access Private (RECRUITER only)
 */
export const getMyJobs = async (req, res) => {
    try {
        const { status } = req.query;

        // Build query
        const query = { recruiterId: req.user._id };

        // Filter by status if provided
        if (status) {
            if (!['ACTIVE', 'CLOSED'].includes(status.toUpperCase())) {
                return res.status(400).json({
                    success: false,
                    message: 'Status must be either ACTIVE or CLOSED',
                });
            }
            query.status = status.toUpperCase();
        }

        // Aggregation to get jobs + application count
        const jobs = await Job.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'applications',
                    localField: '_id',
                    foreignField: 'jobId',
                    as: 'applications',
                },
            },
            {
                $addFields: {
                    applicationCount: { $size: '$applications' },
                },
            },
            {
                $project: {
                    applications: 0, // Remove the heavy array, keep only count
                },
            },
            { $sort: { createdAt: -1 } },
        ]);

        // Manually populate recruiterId since aggregate doesn't support mongoose populate directly
        await Job.populate(jobs, { path: 'recruiterId', select: 'name email' });

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: { jobs },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching jobs',
            error: error.message,
        });
    }
};

/**
 * Get a single job by ID
 * GET /api/jobs/:id
 * @access Private (RECRUITER only, must own the job)
 */
export const getJobById = async (req, res) => {
    try {
        // console.log(`[DEBUG] getJobById called for ${req.params.id} by user ${req.user._id}`);
        // Check if the job belongs to the logged-in recruiter using a safe query
        const job = await Job.findOne({ _id: req.params.id, recruiterId: req.user._id }).populate(
            'recruiterId',
            'name email'
        );

        if (!job) {
            // console.log(`[DEBUG] getJobById: Job not found or not owned by user`);
            // If job specific to user not found, check if it exists at all (for 403 vs 404)
            const jobExists = await Job.exists({ _id: req.params.id });
            if (jobExists) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You can only view your own jobs.',
                });
            }
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // console.log(`[DEBUG] getJobById: Success`);
        res.status(200).json({
            success: true,
            data: { job },
        });
    } catch (error) {
        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid job ID',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error fetching job',
            error: error.message,
        });
    }
};

/**
 * Update a job
 * PUT /api/jobs/:id
 * @access Private (RECRUITER only, must own the job)
 */
export const updateJob = async (req, res) => {
    try {
        const { title, description, skills, location, experience } = req.body;

        // Find job
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Check ownership
        if (!job.isOwnedBy(req.user._id)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only update your own jobs.',
            });
        }

        // Update fields if provided
        if (title) job.title = title;
        if (description) job.description = description;
        if (skills) {
            if (!Array.isArray(skills) || skills.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Skills must be a non-empty array',
                });
            }
            job.skills = skills;
        }
        if (location) job.location = location;
        if (experience) {
            if (experience.min !== undefined) job.experience.min = experience.min;
            if (experience.max !== undefined) job.experience.max = experience.max;
        }
        if (req.body.salary) {
            if (!job.salary) job.salary = {};
            if (req.body.salary.min !== undefined) job.salary.min = req.body.salary.min;
            if (req.body.salary.max !== undefined) job.salary.max = req.body.salary.max;
        }

        // Save updated job
        await job.save();

        // Populate recruiter details
        await job.populate('recruiterId', 'name email');

        res.status(200).json({
            success: true,
            message: 'Job updated successfully',
            data: { job },
        });
    } catch (error) {
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

        res.status(500).json({
            success: false,
            message: 'Error updating job',
            error: error.message,
        });
    }
};

/**
 * Close a job (change status to CLOSED)
 * PUT /api/jobs/:id/close
 * @access Private (RECRUITER only, must own the job)
 */
export const closeJob = async (req, res) => {
    try {
        // Find job
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Check ownership
        if (!job.isOwnedBy(req.user._id)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only close your own jobs.',
            });
        }

        // Check if already closed
        if (job.status === 'CLOSED') {
            return res.status(400).json({
                success: false,
                message: 'Job is already closed',
            });
        }

        // Update status
        job.status = 'CLOSED';
        await job.save();

        // Populate recruiter details
        await job.populate('recruiterId', 'name email');

        res.status(200).json({
            success: true,
            message: 'Job closed successfully',
            data: { job },
        });
    } catch (error) {
        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid job ID',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error closing job',
            error: error.message,
        });
    }
};

/**
 * Delete a job
 * DELETE /api/jobs/:id
 * @access Private (RECRUITER only, must own the job)
 */
export const deleteJob = async (req, res) => {
    try {
        // Find job
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Check ownership
        if (!job.isOwnedBy(req.user._id)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only delete your own jobs.',
            });
        }

        // Delete job
        await job.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Job deleted successfully',
        });
    } catch (error) {
        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid job ID',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error deleting job',
            error: error.message,
        });
    }
};
