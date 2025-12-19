import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: name, email, password, role',
            });
        }

        // Validate role
        if (!['RECRUITER', 'CANDIDATE'].includes(role.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: 'Role must be either RECRUITER or CANDIDATE',
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists',
            });
        }

        // Create new user (password will be hashed by pre-save middleware)
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            role: role.toUpperCase(),
        });

        // Generate JWT token
        const token = generateToken(user);

        // Return user data and token
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt,
                },
                token,
            },
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

        // Handle other errors
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message,
        });
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        // Find user by email (include password for comparison)
        const user = await User.findOne({ email: email.toLowerCase() }).select(
            '+password'
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Generate JWT token
        const token = generateToken(user);

        // Return user data and token
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt,
                },
                token,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message,
        });
    }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
    try {
        // req.user is set by authenticate middleware
        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: req.user._id,
                    name: req.user.name,
                    email: req.user.email,
                    role: req.user.role,
                    createdAt: req.user.createdAt,
                    updatedAt: req.user.updatedAt,
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user profile',
            error: error.message,
        });
    }
};
