import User from '../models/User.js';

/**
 * @desc    Update recruiter company profile
 * @route   PUT /api/profile/company
 * @access  Private (Recruiter)
 */
export const updateCompanyProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { companyName, website, location, description, logo, industry, employeeCount } = req.body;

        // Ensure user is a recruiter (double check, though middleware handles auth)
        if (req.user.role !== 'RECRUITER') {
            res.status(403);
            throw new Error('Only recruiters can have a company profile');
        }

        const user = await User.findById(userId);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Update fields
        user.companyProfile = {
            companyName: companyName || user.companyProfile?.companyName,
            website: website || user.companyProfile?.website,
            location: location || user.companyProfile?.location,
            description: description || user.companyProfile?.description,
            logo: logo || user.companyProfile?.logo,
            industry: industry || user.companyProfile?.industry,
            employeeCount: employeeCount || user.companyProfile?.employeeCount,
        };

        await user.save();

        res.status(200).json({
            success: true,
            data: user.companyProfile,
            message: 'Company profile updated successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current recruiter company profile
 * @route   GET /api/profile/company
 * @access  Private (Recruiter)
 */
export const getCompanyProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select('companyProfile email name role');

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Handle case where companyProfile might be undefined for new users
        const profileData = user.companyProfile && user.companyProfile.toObject
            ? user.companyProfile.toObject()
            : {};

        res.status(200).json({
            success: true,
            data: {
                ...profileData,
                email: user.email,
                recruiterName: user.name
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update candidate profile
 * @route   PUT /api/profile/candidate
 * @access  Private (Candidate)
 */
export const updateCandidateProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { headline, about, skills, experience, education, links } = req.body;

        // Ensure user is a candidate
        if (req.user.role !== 'CANDIDATE') {
            res.status(403);
            throw new Error('Only candidates can have a candidate profile');
        }

        const user = await User.findById(userId);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Update fields
        user.candidateProfile = {
            headline: headline !== undefined ? headline : user.candidateProfile?.headline,
            about: about !== undefined ? about : user.candidateProfile?.about,
            skills: skills !== undefined ? skills : user.candidateProfile?.skills,
            experience: experience !== undefined ? experience : user.candidateProfile?.experience,
            education: education !== undefined ? education : user.candidateProfile?.education,
            links: links !== undefined ? links : user.candidateProfile?.links,
        };

        await user.save();

        res.status(200).json({
            success: true,
            data: user.candidateProfile,
            message: 'Candidate profile updated successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current candidate profile
 * @route   GET /api/profile/candidate
 * @access  Private (Candidate)
 */
export const getCandidateProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select('candidateProfile email name role');

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Handle case where candidateProfile might be undefined for new users
        const profileData = user.candidateProfile && user.candidateProfile.toObject
            ? user.candidateProfile.toObject()
            : {};

        res.status(200).json({
            success: true,
            data: {
                ...profileData,
                email: user.email,
                name: user.name,
                role: user.role
            },
        });
    } catch (error) {
        next(error);
    }
};
