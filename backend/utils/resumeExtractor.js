import https from 'https';
import pdfParse from 'pdf-parse';

/**
 * Extract text from PDF resume
 * @param {string} resumeUrl - Cloudinary URL of the resume
 * @returns {Promise<string>} - Extracted text content
 */
export const extractTextFromPDF = async (resumeUrl) => {
    return new Promise((resolve, reject) => {
        https.get(resumeUrl, (response) => {
            const chunks = [];

            response.on('data', (chunk) => {
                chunks.push(chunk);
            });

            response.on('end', async () => {
                try {
                    const buffer = Buffer.concat(chunks);
                    const data = await pdfParse(buffer);
                    resolve(data.text);
                } catch (error) {
                    reject(new Error('Failed to parse PDF: ' + error.message));
                }
            });

            response.on('error', (error) => {
                reject(new Error('Failed to download resume: ' + error.message));
            });
        });
    });
};

/**
 * Extract text from resume (supports PDF only for now)
 * @param {string} resumeUrl - Cloudinary URL of the resume
 * @returns {Promise<string>} - Extracted text content
 */
export const extractResumeText = async (resumeUrl) => {
    try {
        // Check file extension
        const extension = resumeUrl.split('.').pop().toLowerCase();

        if (extension === 'pdf') {
            return await extractTextFromPDF(resumeUrl);
        }

        // For DOC/DOCX, return a message (would need additional libraries)
        // For MVP, we'll focus on PDF support
        throw new Error('Only PDF resumes are supported for ATS scoring at this time');
    } catch (error) {
        throw new Error('Resume text extraction failed: ' + error.message);
    }
};
