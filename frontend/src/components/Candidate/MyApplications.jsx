import { useState, useEffect } from 'react';
import { applicationsAPI } from '../../services/api';
import './Candidate.css';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await applicationsAPI.getMyApplications();
            if (response.data && response.data.data && Array.isArray(response.data.data.applications)) {
                setApplications(response.data.data.applications);
            } else {
                setApplications([]);
                console.error('Unexpected API response structure:', response);
            }
        } catch (err) {
            console.error('Error fetching applications:', err);
            setError('Failed to load your applications.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'HIRED': return 'status-hired';
            case 'SHORTLISTED': return 'status-shortlisted';
            case 'INTERVIEW': return 'status-interview';
            case 'REJECTED': return 'status-rejected';
            default: return 'status-applied';
        }
    };

    if (loading) return <div className="loading">Loading applications...</div>;

    return (
        <div className="candidate-container">
            <div className="page-header">
                <h1>My Applications</h1>
                <p>Track the status of your job applications.</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="applications-list">
                {applications.length === 0 ? (
                    <div className="empty-state">
                        <h3>You haven't applied to any jobs yet.</h3>
                        <a href="/candidate/jobs" className="btn btn-primary">Browse Jobs</a>
                    </div>
                ) : (
                    applications.map((app) => (
                        <div key={app._id} className="application-card card">
                            <div className="app-header">
                                <div className="company-info">
                                    {app.jobId.recruiterId?.companyProfile?.logo && (
                                        <img
                                            src={app.jobId.recruiterId.companyProfile.logo}
                                            alt={app.jobId.recruiterId.companyProfile.companyName}
                                            className="company-logo"
                                        />
                                    )}
                                    <div className="title-and-company">
                                        <h2>{app.jobId.title}</h2>
                                        <span className="company-name">
                                            {app.jobId.recruiterId?.companyProfile?.companyName || 'Unknown Company'}
                                        </span>
                                        <div className="app-date">Applied on {new Date(app.appliedAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div className={`status-badge ${getStatusClass(app.status)}`}>
                                    {app.status}
                                </div>
                            </div>

                            <div className="app-details">
                                <div className="detail-item">
                                    <strong>Location:</strong> {app.jobId.location}
                                </div>
                                <div className="detail-item">
                                    <strong>Experience Required:</strong> {app.jobId.experience.min}-{app.jobId.experience.max} years
                                </div>
                            </div>


                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyApplications;
