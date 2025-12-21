import { extractResumeText } from '../utils/resumeExtractor.js';

/**
 * Calculate ATS score for an application
 * @param {Object} profile - Candidate's structured profile
 * @param {Object} job - Job object with requirements
 * @returns {Promise<Object>} - ATS score and breakdown
 */
export const calculateATSScore = async (profile, job) => {
    try {
        const profileSkills = profile?.skills || [];
        const profileHeadline = (profile?.headline || '').toLowerCase();
        const profileAbout = (profile?.about || '').toLowerCase();

        // Initialize scores
        let skillsScore = 0;
        let experienceScore = 0;
        let keywordScore = 0;
        let profileScore = 0;

        // 1. Skills Match (50% weight)
        const requiredSkills = job.skills || [];
        const matchedSkills = [];
        const unmatchedSkills = [];

        requiredSkills.forEach((skill) => {
            const skillLower = skill.toLowerCase();
            const hasSkill = profileSkills.some(s => s.toLowerCase() === skillLower) ||
                profileAbout.includes(skillLower) ||
                profileHeadline.includes(skillLower);

            if (hasSkill) {
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

        // Calculate total years of experience from profile
        let totalMonths = 0;
        if (profile?.experience && Array.isArray(profile.experience)) {
            profile.experience.forEach(exp => {
                const start = new Date(exp.startDate);
                const end = exp.current ? new Date() : new Date(exp.endDate);

                if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
                    totalMonths += Math.max(0, months);
                }
            });
        }

        const foundExperience = Math.round((totalMonths / 12) * 10) / 10; // Round to 1 decimal

        if (foundExperience >= minExp && foundExperience <= maxExp) {
            experienceScore = 30; // Perfect match
        } else if (foundExperience > maxExp) {
            experienceScore = 25; // Overqualified
        } else if (foundExperience >= minExp) {
            experienceScore = 30; // Also perfect if at least min
        } else {
            // Less experience than required
            const ratio = minExp > 0 ? foundExperience / minExp : 1;
            experienceScore = ratio * 30;
        }

        // 3. Keyword Relevance (10% weight)
        // Check headline and about for job-relevant keywords
        const jobKeywords = [
            ...job.title.toLowerCase().split(' '),
            ...(job.location?.toLowerCase().split(' ') || []),
        ].filter((word) => word.length > 3);

        let keywordMatches = 0;
        jobKeywords.forEach((keyword) => {
            if (profileHeadline.includes(keyword) || profileAbout.includes(keyword)) {
                keywordMatches++;
            }
        });

        if (jobKeywords.length > 0) {
            keywordScore = (keywordMatches / jobKeywords.length) * 10;
        }

        // 4. Education/Profile Match (10% weight)
        let educationScoreVal = 0;
        if (profile?.education && Array.isArray(profile.education) && profile.education.length > 0) {
            educationScoreVal = 10; // Basic points for having education
        } else if (profileAbout.includes('degree') || profileAbout.includes('university')) {
            educationScoreVal = 5;
        }

        profileScore = educationScoreVal;

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
        };

        return {
            atsScore: Math.min(100, totalScore),
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
