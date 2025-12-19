import Job from '../models/Job.js';

/**
 * Get all ACTIVE jobs (Public - no authentication required)
 * GET /api/public/jobs
 */
export const getActiveJobs = async (req, res) => {
    try {
        const { location, skills, minExperience, maxExperience } = req.query;

        // Base query - only ACTIVE jobs
        const query = { status: 'ACTIVE' };

        // Filter by location (case-insensitive partial match)
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        // Filter by skills (case-insensitive, matches if any skill in array matches)
        if (skills) {
            const skillsArray = skills.split(',').map((s) => s.trim());
            query.skills = { $in: skillsArray.map((s) => new RegExp(s, 'i')) };
        }

        // Filter by experience range
        if (minExperience !== undefined || maxExperience !== undefined) {
            query['experience.max'] = query['experience.max'] || {};
            query['experience.min'] = query['experience.min'] || {};

            if (minExperience !== undefined) {
                // Job's max experience should be >= candidate's min experience
                query['experience.max'].$gte = parseInt(minExperience);
            }

            if (maxExperience !== undefined) {
                // Job's min experience should be <= candidate's max experience
                query['experience.min'].$lte = parseInt(maxExperience);
            }
        }

        // Fetch jobs and populate only safe recruiter fields
        const jobs = await Job.find(query)
            .populate('recruiterId', 'name') // Only include recruiter name, not email
            .select('-__v') // Exclude version key
            .sort({ createdAt: -1 }); // Most recent first

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
 * Get a single ACTIVE job by ID (Public - no authentication required)
 * GET /api/public/jobs/:id
 */
export const getActiveJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('recruiterId', 'name') // Only include recruiter name
            .select('-__v');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Only return if job is ACTIVE
        if (job.status !== 'ACTIVE') {
            return res.status(404).json({
                success: false,
                message: 'Job not found or no longer available',
            });
        }

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
