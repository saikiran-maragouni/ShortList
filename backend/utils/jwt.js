import jwt from 'jsonwebtoken';

/**
 * Generate JWT token with user data
 * @param {Object} user - User object from database
 * @returns {string} - JWT token
 */
export const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '7d', // Token expires in 7 days
    });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};
