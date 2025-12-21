import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema
 * Supports two roles: RECRUITER and CANDIDATE
 */
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Don't return password by default in queries
        },
        role: {
            type: String,
            enum: {
                values: ['RECRUITER', 'CANDIDATE'],
                message: 'Role must be either RECRUITER or CANDIDATE',
            },
            required: [true, 'Role is required'],
            uppercase: true,
        },
        // Phase 9: Company Profile for Recruiters
        companyProfile: {
            companyName: { type: String, trim: true },
            website: { type: String, trim: true },
            location: { type: String, trim: true },
            description: { type: String, trim: true },
            logo: { type: String, trim: true }, // URL to logo
            industry: { type: String, trim: true },
            employeeCount: { type: String, trim: true },
        },
        // Phase 10: Candidate Profile
        candidateProfile: {
            headline: { type: String, trim: true },
            about: { type: String, trim: true },
            skills: { type: [String], default: [] },
            experience: [{
                title: String,
                company: String,
                location: String,
                startDate: Date,
                endDate: Date,
                current: Boolean,
                description: String
            }],
            education: [{
                school: String,
                degree: String,
                fieldOfStudy: String,
                startDate: Date,
                endDate: Date,
                description: String
            }],
            links: [{
                platform: String,
                url: String
            }]
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

/**
 * Pre-save middleware to hash password before saving
 * Only hashes if password is modified
 */
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Instance method to compare password for login
 * @param {string} candidatePassword - Password to compare
 * @returns {Promise<boolean>} - True if password matches
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

/**
 * Instance method to generate user response object (without password)
 * @returns {Object} - Safe user object
 */
userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

const User = mongoose.model('User', userSchema);

export default User;
