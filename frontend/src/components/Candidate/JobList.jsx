import { useState, useEffect } from 'react';
import { publicJobsAPI, applicationsAPI } from '../../services/api';
import './Candidate.css';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [appliedJobIds, setAppliedJobIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [applyingJobId, setApplyingJobId] = useState(null);
    const [resume, setResume] = useState(null);
    const [uploadError, setUploadError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [jobsResponse, applicationsResponse] = await Promise.all([
                publicJobsAPI.getJobs(),
                applicationsAPI.getMyApplications()
            ]);

            if (jobsResponse.data && jobsResponse.data.data && Array.isArray(jobsResponse.data.data.jobs)) {
                setJobs(jobsResponse.data.data.jobs);
            } else {
                setJobs([]);
            }

            if (applicationsResponse.data && applicationsResponse.data.data && Array.isArray(applicationsResponse.data.data.applications)) {
                const appliedIds = new Set(applicationsResponse.data.data.applications.map(app => app.jobId._id));
                setAppliedJobIds(appliedIds);
            }

        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleApplyClick = (jobId) => {
        setApplyingJobId(jobId);
        setResume(null);
        setUploadError('');
        setSuccessMessage('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setResume(file);
            setUploadError('');
        } else {
            setResume(null);
            setUploadError('Please select a PDF file.');
        }
    };

    const submitApplication = async (e) => {
        e.preventDefault();
        if (!resume) {
            setUploadError('Please upload a resume.');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('resume', resume);

            await applicationsAPI.apply(applyingJobId, formData);
            setSuccessMessage('Application submitted successfully!');

            // Update local state to reflect application
            setAppliedJobIds(prev => new Set(prev).add(applyingJobId));

            setApplyingJobId(null);

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setUploadError(err.response?.data?.message || 'Failed to apply. You may have already applied.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && jobs.length === 0) return <div className="loading">Loading jobs...</div>;

    return (
        <div className="candidate-container">
            <div className="page-header">
                <h1>Open Positions</h1>
                <p>Explore and apply to the latest opportunities.</p>
            </div>

            {successMessage && <div className="success-message">{successMessage}</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="jobs-grid">
                {jobs.length === 0 ? (
                    <div className="empty-state">No active jobs found. Check back soon!</div>
                ) : (
                    jobs.map((job) => (
                        <div key={job._id} className="job-card card">
                            <div className="job-header">
                                <h2>{job.title}</h2>
                                <span className="recruiter-name">By {job.recruiterId.name}</span>
                            </div>

                            <div className="job-details">
                                <div className="detail-item">
                                    <strong>Location:</strong> {job.location}
                                </div>
                                <div className="detail-item">
                                    <strong>Experience:</strong> {job.experience ? `${job.experience.min}-${job.experience.max} years` : 'Not specified'}
                                </div>
                                {job.salary && (
                                    <div className="detail-item">
                                        <strong>Salary:</strong> ${job.salary.min?.toLocaleString()} - ${job.salary.max?.toLocaleString()}
                                    </div>
                                )}
                            </div>

                            <div className="job-description">
                                <p>{job.description.length > 150 ? `${job.description.substring(0, 150)}...` : job.description}</p>
                            </div>

                            <div className="job-skills">
                                {job.skills.map((skill, index) => (
                                    <span key={index} className="skill-tag">{skill}</span>
                                ))}
                            </div>

                            {applyingJobId === job._id ? (
                                <form onSubmit={submitApplication} className="apply-form">
                                    <div className="file-input-group">
                                        <label>Upload Resume (PDF only)</label>
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    {uploadError && <div className="error-text">{uploadError}</div>}
                                    <div className="form-actions">
                                        <button type="submit" className="btn btn-primary" disabled={!resume}>
                                            Submit Application
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setApplyingJobId(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                appliedJobIds.has(job._id) ? (
                                    <button disabled className="btn btn-secondary apply-btn applied">
                                        Applied
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-primary apply-btn"
                                        onClick={() => handleApplyClick(job._id)}
                                    >
                                        Apply Now
                                    </button>
                                )
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default JobList;
