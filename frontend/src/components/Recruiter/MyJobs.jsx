import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recruiterJobsAPI } from '../../services/api';
import './Recruiter.css';

const MyJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await recruiterJobsAPI.getMyJobs();
            if (response.data && response.data.data && Array.isArray(response.data.data.jobs)) {
                setJobs(response.data.data.jobs);
            } else {
                setJobs([]);
                console.error('Unexpected API response structure:', response);
            }
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError('Failed to load your jobs.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (jobId, currentStatus) => {
        try {
            if (currentStatus === 'ACTIVE') {
                await recruiterJobsAPI.closeJob(jobId);
            } else {
                // Re-opening logic if implemented, or just alert
                alert('Re-opening jobs feature is not yet available, or create a new one.');
                return;
            }
            fetchJobs(); // Refresh list
        } catch (err) {
            alert('Failed to update job status.');
        }
    };

    if (loading) return <div className="loading">Loading jobs...</div>;

    return (
        <div className="recruiter-container">
            <div className="page-header">
                <div className="header-actions">
                    <div>
                        <h1>My Job Postings</h1>
                        <p>Manage your job listings and view applications.</p>
                    </div>
                    <Link to="/recruiter/jobs/new" className="btn btn-primary">
                        + Post New Job
                    </Link>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="jobs-list">
                {jobs.length === 0 ? (
                    <div className="empty-state">
                        <h3>You haven't posted any jobs yet.</h3>
                        <p>Create your first job posting to start finding candidates.</p>
                        <Link to="/recruiter/jobs/new" className="btn btn-primary">Post a Job</Link>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <div key={job._id} className={`recruiter-job-card card ${job.status === 'CLOSED' ? 'closed' : ''}`}>
                            <div className="job-content">
                                <div className="job-info">
                                    <h2>{job.title}</h2>
                                    <div className="meta-info">
                                        <span>{job.location}</span> •
                                        <span> Posted {new Date(job.createdAt).toLocaleDateString()}</span> •
                                        <span className={`status-label ${job.status.toLowerCase()}`}>
                                            {job.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="job-stats">
                                    <div className="stat">
                                        <span className="count">{job.applicationCount || 0}</span>
                                        <span className="label">Applications</span>
                                    </div>
                                </div>
                            </div>

                            <div className="job-actions">
                                <Link to={`/recruiter/applications/${job._id}`} className="btn btn-secondary action-btn">
                                    View Applications
                                </Link>

                                {job.status === 'ACTIVE' && (
                                    <button
                                        onClick={() => handleStatusToggle(job._id, job.status)}
                                        className="btn btn-danger action-btn"
                                    >
                                        Close Job
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyJobs;
