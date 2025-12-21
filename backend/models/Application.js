import mongoose from 'mongoose';

/**
 * Application Schema
 * Represents a candidate's application to a job
 */
const applicationSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: [true, 'Job ID is required'],
        },
        candidateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Candidate ID is required'],
        },
        resumeUrl: {
            type: String,
            trim: true,
        },
        // Phase 10: Snapshot of the candidate's profile at the time of application
        candidateProfileSnapshot: {
            type: mongoose.Schema.Types.Mixed,
        },
        status: {
            type: String,
            enum: {
                values: ['APPLIED', 'SHORTLISTED', 'REJECTED', 'INTERVIEW', 'HIRED'],
                message: 'Invalid application status',
            },
            default: 'APPLIED',
            uppercase: true,
        },
        appliedAt: {
            type: Date,
            default: Date.now,
        },
        atsScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        atsBreakdown: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

/**
 * Compound index to prevent duplicate applications
 * One candidate can only apply once to a specific job
 */
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

/**
 * Index for efficient queries
 */
applicationSchema.index({ candidateId: 1, status: 1 });
applicationSchema.index({ jobId: 1, status: 1 });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
