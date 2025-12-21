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
    const [previewUrl, setPreviewUrl] = useState(null);

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
            <div className="page-header">
                <Link to="/recruiter/jobs" className="back-link">← Back to Jobs</Link>
                <h1>Applications for: {job?.title}</h1>
            </div>

            <div className="filters-bar card">
                <div className="filter-group">
                    <label>Sort By:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="appliedAt">Date Applied (Newest)</option>
                        <option value="atsScore">ATS Score (Highest)</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Filter Status:</label>
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

            {error && <div className="error-message">{error}</div>}

            <div className="apps-list">
                {applications.length === 0 ? (
                    <div className="empty-state">No applications found matching your criteria.</div>
                ) : (
                    applications.map((app) => (
                        <div key={app._id} className="app-row card">
                            <div className="app-main">
                                <div className="candidate-info">
                                    <h3>{app.candidateId.name}</h3>
                                    <a href={`mailto:${app.candidateId.email}`} className="email-link">{app.candidateId.email}</a>
                                    <div className="applied-date">Applied: {new Date(app.appliedAt).toLocaleDateString()}</div>
                                </div>

                                <div className="ats-score-box">
                                    <div className={`score-circle ${getATSColor(app.atsScore)}`}>
                                        {app.atsScore}
                                    </div>
                                    <span className="score-label">ATS Score</span>
                                </div>
                            </div>

                            <div className="app-actions">
                                <div className="status-control">
                                    <label>Status:</label>
                                    <select
                                        value={app.status}
                                        onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                                        className={`status-select ${app.status.toLowerCase()}`}
                                        disabled={app.status === 'HIRED'}
                                    >
                                        <option value="APPLIED">APPLIED</option>
                                        <option value="SHORTLISTED">SHORTLISTED</option>
                                        <option value="INTERVIEW">INTERVIEW</option>
                                        <option value="HIRED">HIRED</option>
                                        <option value="REJECTED">REJECTED</option>
                                    </select>
                                </div>


                            </div>

                            {app.atsBreakdown && (
                                <div className="ats-breakdown-mini">
                                    <small>
                                        Skills: {app.atsBreakdown.skillsScore}/50 •
                                        Exp: {app.atsBreakdown.experienceScore}/30 •
                                        Keywords: {app.atsBreakdown.keywordScore}/10 •
                                        Profile: {app.atsBreakdown.profileScore}/10
                                    </small>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Resume Preview Modal */}
            {previewUrl && (
                <div className="modal-overlay" onClick={() => setPreviewUrl(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Resume Preview</h2>
                            <button className="close-btn" onClick={() => setPreviewUrl(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <iframe
                                src={previewUrl.includes('mock-url.com')
                                    ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
                                    : previewUrl}
                                title="Resume Preview"
                                width="100%"
                                height="600px"
                                style={{ border: 'none' }}
                            />
                        </div>
                        <div className="modal-footer">
                            <a
                                href={previewUrl.includes('mock-url.com')
                                    ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
                                    : previewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                            >
                                Download / Open in New Tab
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Applications;
