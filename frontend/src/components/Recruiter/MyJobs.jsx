import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { recruiterJobsAPI, profileAPI } from '../../services/api';
import './Recruiter.css';

const MyJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkProfileAndFetchJobs = async () => {
            try {
                // Phase 9: Enforce mandatory company profile
                const profileRes = await profileAPI.getCompanyProfile();
                if (!profileRes.data.data.companyName) {
                    navigate('/recruiter/profile', {
                        state: { message: 'Please complete your company profile before managing jobs.' }
                    });
                    return;
                }

                await fetchJobs();
            } catch (err) {
                console.error('Error initializing recruiter dashboard:', err);
                setError('Failed to initialize dashboard.');
                setLoading(false);
            }
        };

        checkProfileAndFetchJobs();
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

    // Calculate stats
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(job => job.status === 'ACTIVE').length;
    const totalApplications = jobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0);

    if (loading) return <div className="loading">Loading dashboard...</div>;

    return (
        <div className="recruiter-container">
            <div className="page-header">
                <div className="header-actions">
                    <div className="header-title-group">
                        <h1>Recruiter Dashboard</h1>
                        <p>Overview of your hiring pipeline</p>
                    </div>
                    <div className="header-buttons">
                        <Link to="/recruiter/profile" className="btn btn-secondary header-btn">
                            🏢 Company Info
                        </Link>
                        <Link to="/recruiter/jobs/new" className="btn btn-primary header-btn">
                            + Post New Job
                        </Link>
                    </div>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Metrics Grid */}
            <div className="dashboard-stats">
                <div className="stat-card primary">
                    <div className="stat-icon">📊</div>
                    <div className="stat-title">Active Jobs</div>
                    <div className="stat-value">{activeJobs}</div>
                </div>
                <div className="stat-card info">
                    <div className="stat-icon">👥</div>
                    <div className="stat-title">Total Applications</div>
                    <div className="stat-value">{totalApplications}</div>
                </div>
                <div className="stat-card success">
                    <div className="stat-icon">📝</div>
                    <div className="stat-title">Total Posts</div>
                    <div className="stat-value">{totalJobs}</div>
                </div>
            </div>

            <div className="jobs-section-header">
                <h2>Recent Job Postings</h2>
            </div>

            {jobs.length === 0 ? (
                <div className="dashboard-empty">
                    <h3>No jobs posted yet</h3>
                    <p>Get started by creating your first job listing to attract top talent.</p>
                    <Link to="/recruiter/jobs/new" className="btn btn-primary">Create Job Post</Link>
                </div>
            ) : (
                <div className="jobs-table-container">
                    <table className="jobs-table">
                        <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Posted Date</th>
                                <th>Location</th>
                                <th>Applications</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((job) => (
                                <tr key={job._id}>
                                    <td className="job-title-cell">
                                        <h3>{job.title}</h3>
                                        <span className="job-meta-cell">{job.experience ? `${job.experience.min}-${job.experience.max} yrs` : ''}</span>
                                    </td>
                                    <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                                    <td>{job.location}</td>
                                    <td>
                                        <strong>{job.applicationCount || 0}</strong> applicants
                                    </td>
                                    <td>
                                        <span className={`status-badge ${job.status.toLowerCase()}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <Link
                                                to={`/recruiter/applications/${job._id}`}
                                                className="btn btn-primary btn-sm"
                                                title="View Applications"
                                            >
                                                View Apps
                                            </Link>

                                            {job.status === 'ACTIVE' && (
                                                <button
                                                    onClick={() => handleStatusToggle(job._id, job.status)}
                                                    className="btn btn-secondary btn-sm"
                                                    title="Close Job"
                                                >
                                                    Close
                                                </button>
                                            )}
                                            {job.status === 'CLOSED' && (
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    disabled
                                                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                                                >
                                                    Closed
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyJobs;
