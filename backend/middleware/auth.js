import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (req, res, next) => {
    try {
        // console.log(`[DEBUG] Auth Middleware - Request: ${req.method} ${req.originalUrl}`);
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // console.log('[DEBUG] Auth Middleware - No token provided');
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.',
            });
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = verifyToken(token);

        // Get user from database (excluding password)
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Invalid token.',
            });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token.',
            error: error.message,
        });
    }
};

/**
 * Authorization middleware factory
 * Restricts access to specific roles
 * @param  {...string} allowedRoles - Roles that can access the route
 * @returns {Function} - Express middleware
 */
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.',
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Only ${allowedRoles.join(' or ')} can access this resource.`,
            });
        }

        next();
    };
};
