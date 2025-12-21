import Application from '../models/Application.js';
import Job from '../models/Job.js';

/**
 * Get all applications for a specific job (RECRUITER only)
 * GET /api/recruiter/applications/job/:jobId
 * @access Private (RECRUITER only, must own the job)
 */
export const getApplicationsForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const recruiterId = req.user._id;


        // Find the job and verify ownership in one query for safety
        let job = await Job.findOne({ _id: jobId, recruiterId: recruiterId });

        if (!job) {
            console.log(`[DEBUG] getApplicationsForJob: Job not found or not owned`);
            // Check if job exists at all to return correct error status
            const jobExists = await Job.exists({ _id: jobId });
            if (jobExists) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You can only view applications for your own jobs.',
                });
            }
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Get optional status filter and sort parameter
        const { status, sortBy } = req.query;
        const query = { jobId };

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

        // Determine sort order
        let sortOptions = { appliedAt: -1 }; // Default: newest first
        if (sortBy === 'atsScore') {
            sortOptions = { atsScore: -1 }; // Highest score first
        }

        // Fetch applications
        const applications = await Application.find(query)
            .populate('candidateId', 'name email')
            .populate('jobId', 'title location experience')
            .sort(sortOptions);

        console.log(`[DEBUG] Found ${applications.length} applications.`);

        res.status(200).json({
            success: true,
            count: applications.length,
            data: { applications },
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
            message: 'Error fetching applications',
            error: error.message,
        });
    }
};

/**
 * Update application status (RECRUITER only)
 * PUT /api/recruiter/applications/:applicationId/status
 * @access Private (RECRUITER only, must own the job)
 */
export const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;
        const recruiterId = req.user._id;

        // Validate status
        const validStatuses = ['APPLIED', 'SHORTLISTED', 'REJECTED', 'INTERVIEW', 'HIRED'];
        if (!status || !validStatuses.includes(status.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: APPLIED, SHORTLISTED, REJECTED, INTERVIEW, HIRED',
            });
        }

        // Find the application
        const application = await Application.findById(applicationId)
            .populate('jobId')
            .populate('candidateId', 'name email');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        // Check if the recruiter owns the job
        if (application.jobId.recruiterId.toString() !== recruiterId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only update applications for your own jobs.',
            });
        }

        // Validate status transition
        const currentStatus = application.status;
        const newStatus = status.toUpperCase();

        // Prevent invalid transitions
        if (currentStatus === 'HIRED' && newStatus !== 'HIRED') {
            return res.status(400).json({
                success: false,
                message: 'Cannot change status of a HIRED candidate',
            });
        }

        if (currentStatus === 'REJECTED' && newStatus === 'HIRED') {
            return res.status(400).json({
                success: false,
                message: 'Cannot hire a rejected candidate. Please shortlist them first.',
            });
        }

        // Update status
        application.status = newStatus;
        await application.save();

        res.status(200).json({
            success: true,
            message: 'Application status updated successfully',
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
            message: 'Error updating application status',
            error: error.message,
        });
    }
};
