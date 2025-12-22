import { useState } from 'react';
import { applicationsAPI } from '../../services/api';
import './Candidate.css';

const JobDetailModal = ({ job, onClose, isApplied, onApplySuccess }) => {
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    if (!job) return null;

    const handleApply = async () => {
        try {
            setApplying(true);
            setError('');
            await applicationsAPI.apply(job._id);
            setSuccessMessage('Application submitted successfully!');
            onApplySuccess(job._id);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to apply.';
            setError(msg);
        } finally {
            setApplying(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content job-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
                    &times;
                </button>

                <div className="job-modal-header-hero">
                    <div className="hero-content">
                        <div className="modal-company-logo-large">
                            {job.recruiterId.companyProfile?.logo ? (
                                <img
                                    src={job.recruiterId.companyProfile.logo}
                                    alt={job.recruiterId.companyProfile.companyName}
                                />
                            ) : (
                                <span className="placeholder">
                                    {job.recruiterId.companyProfile?.companyName?.charAt(0) || 'C'}
                                </span>
                            )}
                        </div>
                        <div className="hero-text">
                            <h2>{job.title}</h2>
                            <div className="hero-company-row">
                                <span className="hero-company">{job.recruiterId.companyProfile?.companyName || 'Confidential'}</span>
                                <span className="divider">•</span>
                                <span className="hero-location">{job.location}</span>
                                <span className="divider">•</span>
                                <span className="hero-posted">Posted recently</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="job-modal-body">
                    {successMessage && <div className="success-message">{successMessage}</div>}
                    {error && <div className="error-message">{error}</div>}

                    <div className="job-highlights">
                        <div className="highlight-item">
                            <span className="icon">💼</span>
                            <div className="meta-text">
                                <span className="label">Experience</span>
                                <span className="value">{job.experience?.min}-{job.experience?.max} years</span>
                            </div>
                        </div>
                        <div className="highlight-item">
                            <span className="icon">💰</span>
                            <div className="meta-text">
                                <span className="label">Salary</span>
                                <span className="value">
                                    {job.salary?.min ? `₹${job.salary.min.toLocaleString()} - ₹${job.salary.max.toLocaleString()} LPA` : 'Not Disclosed'}
                                </span>
                            </div>
                        </div>
                        <div className="highlight-item">
                            <span className="icon">📍</span>
                            <div className="meta-text">
                                <span className="label">Location</span>
                                <span className="value">{job.location}</span>
                            </div>
                        </div>
                        <div className="highlight-item">
                            <span className="icon">📝</span>
                            <div className="meta-text">
                                <span className="label">Job Type</span>
                                <span className="value">{job.type || 'Full Time'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="content-divider"></div>

                    <section className="modal-section">
                        <h3>About the Job</h3>
                        <p className="modal-description">{job.description}</p>
                    </section>

                    <section className="modal-section">
                        <h3>Key Requirements</h3>
                        {job.requirements && job.requirements.length > 0 ? (
                            <ul className="modal-list">
                                {job.requirements.map((req, i) => <li key={i}>{req}</li>)}
                            </ul>
                        ) : (
                            <p className="text-muted">No specific requirements listed.</p>
                        )}
                    </section>

                    <section className="modal-section">
                        <h3>Skills</h3>
                        <div className="skills-display">
                            {job.skills && job.skills.map((skill, i) => (
                                <span key={i} className="skill-pill">{skill}</span>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="job-modal-footer">
                    <div className="footer-info">
                        <span className="text-muted small">Matches your profile</span>
                    </div>
                    {isApplied || successMessage ? (
                        <button className="apply-btn-large applied" disabled>
                            <span>✓ Application Sent</span>
                        </button>
                    ) : (
                        <button
                            className="apply-btn-large primary"
                            onClick={handleApply}
                            disabled={applying}
                        >
                            {applying ? 'Sending Application...' : 'Easy Apply'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetailModal;
