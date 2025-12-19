import mongoose from 'mongoose';

/**
 * Job Schema
 * Jobs are created and managed by recruiters
 */
const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true,
            minlength: [3, 'Job title must be at least 3 characters'],
            maxlength: [200, 'Job title cannot exceed 200 characters'],
        },
        description: {
            type: String,
            required: [true, 'Job description is required'],
            trim: true,
            minlength: [20, 'Job description must be at least 20 characters'],
            maxlength: [5000, 'Job description cannot exceed 5000 characters'],
        },
        skills: {
            type: [String],
            required: [true, 'At least one skill is required'],
            validate: {
                validator: function (skills) {
                    return skills && skills.length > 0;
                },
                message: 'At least one skill is required',
            },
        },
        location: {
            type: String,
            required: [true, 'Job location is required'],
            trim: true,
            maxlength: [200, 'Location cannot exceed 200 characters'],
        },
        experience: {
            min: {
                type: Number,
                required: [true, 'Minimum experience is required'],
                min: [0, 'Minimum experience cannot be negative'],
            },
            max: {
                type: Number,
                required: [true, 'Maximum experience is required'],
                validate: {
                    validator: function (value) {
                        return value >= this.experience.min;
                    },
                    message: 'Maximum experience must be greater than or equal to minimum experience',
                },
            },
        },
        recruiterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Recruiter ID is required'],
        },
        status: {
            type: String,
            enum: {
                values: ['ACTIVE', 'CLOSED'],
                message: 'Status must be either ACTIVE or CLOSED',
            },
            default: 'ACTIVE',
            uppercase: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

/**
 * Index for efficient queries
 */
jobSchema.index({ recruiterId: 1, status: 1 });
jobSchema.index({ status: 1, createdAt: -1 });

/**
 * Instance method to check if job is owned by a specific recruiter
 * @param {string} recruiterId - Recruiter ID to check
 * @returns {boolean} - True if job belongs to recruiter
 */
jobSchema.methods.isOwnedBy = function (recruiterId) {
    return this.recruiterId.toString() === recruiterId.toString();
};

const Job = mongoose.model('Job', jobSchema);

export default Job;
