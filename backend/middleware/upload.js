import multer from 'multer';

/**
 * Multer configuration for resume upload
 * Stores files in memory as Buffer for Cloudinary upload
 */
const storage = multer.memoryStorage();

/**
 * File filter to accept only PDF, DOC, and DOCX files
 */
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'),
            false
        );
    }
};

/**
 * Multer upload middleware
 * - Max file size: 5MB
 * - Allowed formats: PDF, DOC, DOCX
 */
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

export default upload;
