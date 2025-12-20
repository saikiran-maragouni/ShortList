import { extractResumeText } from './resumeExtractor.js';

/**
 * Calculate ATS score for an application
 * @param {string} resumeUrl - Cloudinary URL of the resume
 * @param {Object} job - Job object with requirements
 * @returns {Promise<Object>} - ATS score and breakdown
 */
export const calculateATSScore = async (resumeUrl, job) => {
    try {
        // Extract text from resume
        const resumeText = await extractResumeText(resumeUrl);
        const resumeLower = resumeText.toLowerCase();

        // Initialize scores
        let skillsScore = 0;
        let experienceScore = 0;
        let keywordScore = 0;
        let profileScore = 0;

        // 1. Skills Match (50% weight)
        const requiredSkills = job.skills || [];
        let matchedSkills = [];
        let unmatchedSkills = [];

        requiredSkills.forEach((skill) => {
            if (resumeLower.includes(skill.toLowerCase())) {
                matchedSkills.push(skill);
            } else {
                unmatchedSkills.push(skill);
            }
        });

        if (requiredSkills.length > 0) {
            skillsScore = (matchedSkills.length / requiredSkills.length) * 50;
        }

        // 2. Experience Match (30% weight)
        const minExp = job.experience?.min || 0;
        const maxExp = job.experience?.max || 100;

        // Extract years of experience from resume (simple pattern matching)
        const expPatterns = [
            /(\d+)\+?\s*years?\s+(?:of\s+)?experience/gi,
            /experience[:\s]+(\d+)\+?\s*years?/gi,
            /(\d+)\+?\s*yrs?\s+(?:of\s+)?experience/gi,
        ];

        let foundExperience = null;
        for (const pattern of expPatterns) {
            const match = resumeText.match(pattern);
            if (match) {
                const years = parseInt(match[0].match(/\d+/)[0]);
                if (!isNaN(years)) {
                    foundExperience = years;
                    break;
                }
            }
        }

        if (foundExperience !== null) {
            if (foundExperience >= minExp && foundExperience <= maxExp) {
                experienceScore = 30; // Perfect match
            } else if (foundExperience >= minExp) {
                experienceScore = 25; // More experience than required
            } else {
                // Less experience than required
                const ratio = foundExperience / minExp;
                experienceScore = ratio * 30;
            }
        } else {
            // No experience found, give partial score
            experienceScore = 10;
        }

        // 3. Keyword Relevance (10% weight)
        const jobKeywords = [
            ...job.title.toLowerCase().split(' '),
            ...(job.location?.toLowerCase().split(' ') || []),
        ].filter((word) => word.length > 3); // Filter short words

        let keywordMatches = 0;
        jobKeywords.forEach((keyword) => {
            if (resumeLower.includes(keyword)) {
                keywordMatches++;
            }
        });

        if (jobKeywords.length > 0) {
            keywordScore = (keywordMatches / jobKeywords.length) * 10;
        }

        // 4. Education/Profile Match (10% weight)
        const educationKeywords = [
            'bachelor',
            'master',
            'phd',
            'degree',
            'university',
            'college',
            'certification',
            'certified',
        ];

        let educationMatches = 0;
        educationKeywords.forEach((keyword) => {
            if (resumeLower.includes(keyword)) {
                educationMatches++;
            }
        });

        profileScore = Math.min((educationMatches / 3) * 10, 10); // Cap at 10

        // Calculate total score
        const totalScore = Math.round(
            skillsScore + experienceScore + keywordScore + profileScore
        );

        // Create breakdown
        const breakdown = {
            skillsScore: Math.round(skillsScore),
            skillsWeight: 50,
            matchedSkills,
            unmatchedSkills,
            experienceScore: Math.round(experienceScore),
            experienceWeight: 30,
            foundExperience,
            requiredExperience: { min: minExp, max: maxExp },
            keywordScore: Math.round(keywordScore),
            keywordWeight: 10,
            keywordMatches,
            totalKeywords: jobKeywords.length,
            profileScore: Math.round(profileScore),
            profileWeight: 10,
            educationMatches,
        };

        return {
            atsScore: totalScore,
            atsBreakdown: breakdown,
        };
    } catch (error) {
        console.error('ATS scoring error:', error.message);
        // Return default score if extraction fails
        return {
            atsScore: 0,
            atsBreakdown: {
                error: error.message,
                skillsScore: 0,
                experienceScore: 0,
                keywordScore: 0,
                profileScore: 0,
            },
        };
    }
};
