import { useState, useEffect } from 'react';
import { profileAPI } from '../../services/api';
import './Candidate.css';

const CandidateProfile = () => {
    const [formData, setFormData] = useState({
        headline: '',
        about: '',
        skills: [],
        experience: [],
        education: [],
        links: []
    });
    const [userInfo, setUserInfo] = useState({ name: '', email: '' });
    const [newSkill, setNewSkill] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await profileAPI.getCandidateProfile();
                if (response.data && response.data.data) {
                    const data = response.data.data;
                    setFormData({
                        headline: data.headline || '',
                        about: data.about || '',
                        skills: data.skills || [],
                        experience: data.experience || [],
                        education: data.education || [],
                        links: data.links || []
                    });
                    setUserInfo({
                        name: data.name || '',
                        email: data.email || ''
                    });
                }
            } catch (err) {
                console.error('Failed to fetch profile', err);
                setError('Failed to load profile data.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skillToRemove)
        }));
    };

    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [...prev.experience, {
                title: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: ''
            }]
        }));
    };

    const handleExperienceChange = (index, field, value) => {
        const updatedExp = [...formData.experience];
        updatedExp[index][field] = value;
        setFormData(prev => ({ ...prev, experience: updatedExp }));
    };

    const removeExperience = (index) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    const addEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [...prev.education, {
                school: '',
                degree: '',
                fieldOfStudy: '',
                startDate: '',
                endDate: '',
                description: ''
            }]
        }));
    };

    const handleEducationChange = (index, field, value) => {
        const updatedEdu = [...formData.education];
        updatedEdu[index][field] = value;
        setFormData(prev => ({ ...prev, education: updatedEdu }));
    };

    const removeEducation = (index) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');

        try {
            await profileAPI.updateCandidateProfile(formData);
            setMessage('Profile updated successfully!');
            // Scroll to top to see message
            window.scrollTo(0, 0);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading">Loading profile...</div>;

    return (
        <div className="candidate-container">
            <div className="page-header">
                <h1>Professional Profile</h1>
                <p>Build your profile to stand out to recruiters.</p>
            </div>

            <div className="profile-form-container">
                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Basic Info Card */}
                    <section className="form-section">
                        <h3>Basic Information</h3>
                        <div className="form-row">
                            <div className="form-group half">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={userInfo.name}
                                    disabled
                                />
                            </div>
                            <div className="form-group half">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={userInfo.email}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Professional Headline</label>
                            <input
                                type="text"
                                name="headline"
                                value={formData.headline}
                                onChange={handleChange}
                                placeholder="e.g. Senior Full Stack Developer | React & Node.js Specialist"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>About Me</label>
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                rows="8"
                                placeholder="Tell recruiters about your background, key achievements, and career goals..."
                            ></textarea>
                        </div>
                    </section>

                    {/* Skills Card */}
                    <section className="form-section">
                        <h3>Key Skills</h3>
                        <div className="skills-input-group">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                placeholder="Add a new skill (e.g. React, Python, AWS)"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill(e)}
                            />
                            <button type="button" onClick={handleAddSkill} className="btn btn-primary">Add</button>
                        </div>
                        <div className="skills-display">
                            {formData.skills.map(skill => (
                                <span key={skill} className="skill-tag">
                                    {skill}
                                    <button type="button" onClick={() => removeSkill(skill)} className="remove-btn" title="Remove skill">×</button>
                                </span>
                            ))}
                            {formData.skills.length === 0 && (
                                <p className="text-muted" style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>No skills added yet. Add skills to get matched with jobs.</p>
                            )}
                        </div>
                    </section>

                    {/* Experience Card */}
                    <section className="form-section">
                        <h3>
                            Work Experience
                            <button type="button" onClick={addExperience} className="btn btn-secondary btn-sm">+ Add Role</button>
                        </h3>
                        {formData.experience.length === 0 && (
                            <div className="empty-state" style={{ padding: '2rem' }}>
                                <p>No experience listed. Add your past roles to showcase your career history.</p>
                            </div>
                        )}
                        {formData.experience.map((exp, index) => (
                            <div key={index} className="nested-form-item">
                                <div className="item-header">
                                    <h4>Role #{index + 1}</h4>
                                    <button type="button" onClick={() => removeExperience(index)} className="btn-text-danger">Remove</button>
                                </div>
                                <div className="form-row">
                                    <div className="form-group half">
                                        <label>Job Title</label>
                                        <input
                                            type="text"
                                            value={exp.title}
                                            onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                                            placeholder="e.g. Software Engineer"
                                            required
                                        />
                                    </div>
                                    <div className="form-group half">
                                        <label>Company</label>
                                        <input
                                            type="text"
                                            value={exp.company}
                                            onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                            placeholder="e.g. Tech Corp"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group half">
                                        <label>Start Date</label>
                                        <input
                                            type="date"
                                            value={exp.startDate ? exp.startDate.substring(0, 10) : ''}
                                            onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group half">
                                        <label>End Date</label>
                                        <input
                                            type="date"
                                            value={exp.endDate ? exp.endDate.substring(0, 10) : ''}
                                            onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                                            disabled={exp.current}
                                        />
                                        <label className="checkbox-label" style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <input
                                                type="checkbox"
                                                checked={exp.current}
                                                onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)}
                                            /> Currently working here
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        value={exp.description}
                                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                        rows="3"
                                        placeholder="Describe your responsibilities and achievements..."
                                    ></textarea>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Education Card */}
                    <section className="form-section">
                        <h3>
                            Education
                            <button type="button" onClick={addEducation} className="btn btn-secondary btn-sm">+ Add Education</button>
                        </h3>
                        {formData.education.length === 0 && (
                            <div className="empty-state" style={{ padding: '2rem' }}>
                                <p>No education listed. Add your degrees and certifications.</p>
                            </div>
                        )}
                        {formData.education.map((edu, index) => (
                            <div key={index} className="nested-form-item">
                                <div className="item-header">
                                    <h4>Education #{index + 1}</h4>
                                    <button type="button" onClick={() => removeEducation(index)} className="btn-text-danger">Remove</button>
                                </div>
                                <div className="form-row">
                                    <div className="form-group half">
                                        <label>School / University</label>
                                        <input
                                            type="text"
                                            value={edu.school}
                                            onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                                            placeholder="e.g. Stanford University"
                                            required
                                        />
                                    </div>
                                    <div className="form-group half">
                                        <label>Degree / Certificate</label>
                                        <input
                                            type="text"
                                            value={edu.degree}
                                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                            placeholder="e.g. Bachelor of Science"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Field of Study</label>
                                    <input
                                        type="text"
                                        value={edu.fieldOfStudy}
                                        onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                                        placeholder="e.g. Computer Science"
                                    />
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Sticky Action Bar */}
                    <div className="form-actions-right">
                        <button type="submit" className="btn btn-primary" disabled={saving} style={{ minWidth: '150px' }}>
                            {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CandidateProfile;
