import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Configure Cloudinary with environment variables
 */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload resume to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} candidateId - Candidate's user ID
 * @returns {Promise<string>} - Cloudinary URL of uploaded resume
 */
export const uploadResume = (fileBuffer, candidateId) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'shortlist/resumes',
                resource_type: 'raw', // For PDF, DOC, DOCX files
                public_id: `resume_${candidateId}_${Date.now()}`,
                allowed_formats: ['pdf', 'doc', 'docx'],
            },
            (error, result) => {
                if (error) {
                    reject(new Error('Resume upload failed: ' + error.message));
                } else {
                    resolve(result.secure_url);
                }
            }
        );

        uploadStream.end(fileBuffer);
    });
};

/**
 * Delete resume from Cloudinary
 * @param {string} resumeUrl - Cloudinary URL of the resume
 * @returns {Promise<void>}
 */
export const deleteResume = async (resumeUrl) => {
    try {
        // Extract public_id from URL
        const urlParts = resumeUrl.split('/');
        const fileNameWithExtension = urlParts[urlParts.length - 1];
        const publicId = `shortlist/resumes/${fileNameWithExtension.split('.')[0]}`;

        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    } catch (error) {
        console.error('Error deleting resume:', error.message);
        // Don't throw error - deletion failure shouldn't block the application
    }
};

export default cloudinary;
