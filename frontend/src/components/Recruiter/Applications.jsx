import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { recruiterApplicationsAPI, recruiterJobsAPI } from '../../services/api';
import './Recruiter.css';

const Applications = () => {
    const { jobId } = useParams();
    const [applications, setApplications] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState('appliedAt'); // 'appliedAt' or 'atsScore'
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedProfile, setSelectedProfile] = useState(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await recruiterJobsAPI.getJobById(jobId);
                setJob(response.data.data.job);
            } catch (err) {
                console.error('Error fetching job details:', err);
            }
        };

        const fetchApplications = async () => {
            try {
                const response = await recruiterApplicationsAPI.getApplicationsForJob(jobId, { sortBy, status: statusFilter });
                if (response.data && response.data.data && Array.isArray(response.data.data.applications)) {
                    setApplications(response.data.data.applications);
                } else {
                    setApplications([]);
                }
            } catch (err) {
                console.error('Error fetching applications:', err);
                setError('Failed to load applications.');
            } finally {
                setLoading(false);
            }
        };

        if (jobId) {
            setLoading(true);
            // Run in parallel but handle independently to prevent blocking
            Promise.allSettled([fetchJobDetails(), fetchApplications()]);
        }
    }, [jobId, sortBy, statusFilter]);

    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            await recruiterApplicationsAPI.updateApplicationStatus(appId, newStatus);

            // Update local state without reload
            setApplications(prev => prev.map(app =>
                app._id === appId ? { ...app, status: newStatus } : app
            ));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    const getATSColor = (score) => {
        if (score >= 80) return 'score-high';
        if (score >= 50) return 'score-medium';
        return 'score-low';
    };

    if (loading) return <div className="loading">Loading applications...</div>;

    return (
        <div className="recruiter-container">
            <Link to="/recruiter/jobs" className="back-link">← Back to Jobs</Link>

            <div className="page-header">
                <h1>{job?.title} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}> - Content Designer</span></h1>
                <p>Manage and review candidate applications</p>
            </div>

            <div className="filters-bar">
                <div className="filter-group">
                    <label>Sort By:</label>
                    <div className="select-wrapper">
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="appliedAt">Date Applied (Newest)</option>
                            <option value="atsScore">ATS Score (Highest)</option>
                        </select>
                    </div>
                </div>

                <div className="filter-group">
                    <label>Filter Status:</label>
                    <div className="select-wrapper">
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">All Statuses</option>
                            <option value="APPLIED">Applied</option>
                            <option value="SHORTLISTED">Shortlisted</option>
                            <option value="INTERVIEW">Interview</option>
                            <option value="HIRED">Hired</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="apps-list">
                {applications.length === 0 ? (
                    <div className="empty-state">
                        <h3>No applications found</h3>
                        <p>Try adjusting your search filters or wait for more candidates to apply.</p>
                    </div>
                ) : (
                    applications.map((app) => (
                        <div key={app._id} className="app-row card">
                            <div className="app-main">
                                <div className="ats-score-box">
                                    <div className={`score-circle ${getATSColor(app.atsScore)}`}>
                                        {app.atsScore}
                                    </div>
                                    <span className="score-label">ATS Match</span>
                                </div>

                                <div className="candidate-info">
                                    <h3>{app.candidateId.name}</h3>
                                    <a href={`mailto:${app.candidateId.email}`} className="email-link">{app.candidateId.email}</a>

                                    <div className="applied-date">
                                        Applied about {Math.ceil((new Date() - new Date(app.appliedAt)) / (1000 * 60 * 60 * 24))} days ago
                                    </div>

                                    {app.atsBreakdown && (
                                        <div className="ats-breakdown-mini">
                                            <span><strong>Skills:</strong> {app.atsBreakdown.skillsScore}/50</span> &bull;
                                            <span><strong>Exp:</strong> {app.atsBreakdown.experienceScore}/30</span> &bull;
                                            <span><strong>Keywords:</strong> {app.atsBreakdown.keywordScore}/10</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="app-actions">
                                <div className="status-control">
                                    <label>Status</label>
                                    <select
                                        value={app.status}
                                        onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                                        className={`status-select ${app.status.toLowerCase()}`}
                                        disabled={app.status === 'HIRED'}
                                    >
                                        <option value="APPLIED">Applied</option>
                                        <option value="SHORTLISTED">Shortlisted</option>
                                        <option value="INTERVIEW">Interview</option>
                                        <option value="HIRED">Hired</option>
                                        <option value="REJECTED">Rejected</option>
                                    </select>
                                </div>

                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => setSelectedProfile({
                                        ...app.candidateProfileSnapshot,
                                        candidateName: app.candidateId.name,
                                        candidateEmail: app.candidateId.email
                                    })}
                                    style={{ width: '100%' }}
                                >
                                    View Full Profile
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Profile Preview Modal */}
            {selectedProfile && (
                <div className="modal-overlay" onClick={() => setSelectedProfile(null)}>
                    <div className="modal-content profile-preview-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h2>Candidate Profile</h2>
                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Snapshot at time of application</p>
                            </div>
                            <button className="close-btn" onClick={() => setSelectedProfile(null)}>×</button>
                        </div>
                        <div className="modal-body profile-preview">
                            <div className="preview-section header-section">
                                <div className="flex-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{selectedProfile.candidateName}</h3>
                                        <p style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{selectedProfile.headline || 'Open to work'}</p>
                                    </div>
                                    <a href={`mailto:${selectedProfile.candidateEmail}`} className="btn btn-secondary btn-sm">
                                        📧 Contact Candidate
                                    </a>
                                </div>
                                <div className="about-text" style={{ background: 'var(--bg-page)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                    {selectedProfile.about || 'No summary provided.'}
                                </div>
                            </div>

                            {selectedProfile.skills?.length > 0 && (
                                <div className="preview-section">
                                    <h4>Key Skills</h4>
                                    <div className="skills-display">
                                        {selectedProfile.skills.map(skill => (
                                            <span key={skill} className="skill-tag">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="split-view" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                                {selectedProfile.experience?.length > 0 && (
                                    <div className="preview-section">
                                        <h4>Work Experience</h4>
                                        {selectedProfile.experience.map((exp, i) => (
                                            <div key={i} className="preview-item">
                                                <strong>{exp.title}</strong>
                                                <div className="item-meta">{exp.company} • {new Date(exp.startDate).toLocaleDateString()} - {exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString()}</div>
                                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {selectedProfile.education?.length > 0 && (
                                    <div className="preview-section">
                                        <h4>Education</h4>
                                        {selectedProfile.education.map((edu, i) => (
                                            <div key={i} className="preview-item">
                                                <strong>{edu.degree} in {edu.fieldOfStudy}</strong>
                                                <div className="item-meta">{edu.school}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setSelectedProfile(null)}>Close Preview</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Applications;
