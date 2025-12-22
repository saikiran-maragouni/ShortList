import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicJobsAPI, applicationsAPI } from '../../services/api';
import JobDetailModal from './JobDetailModal';
import './Candidate.css';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [appliedJobIds, setAppliedJobIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [applyingJobId, setApplyingJobId] = useState(null);
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

    const handleApply = async (jobId) => {
        try {
            setApplyingJobId(jobId);
            setLoading(true);
            setError('');

            await applicationsAPI.apply(jobId);
            setSuccessMessage('Application submitted successfully using your profile!');

            // Update local state to reflect application
            setAppliedJobIds(prev => new Set(prev).add(jobId));

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to apply.';
            setError(msg);
            if (msg.includes('profile')) {
                // We'll handle navigation to profile in the UI
            }
        } finally {
            setLoading(false);
            setApplyingJobId(null);
        }
    };

    const [selectedJob, setSelectedJob] = useState(null);

    const handleApplySuccess = (jobId) => {
        setAppliedJobIds(prev => new Set(prev).add(jobId));
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.recruiterId.companyProfile?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = locationFilter ? job.location.toLowerCase().includes(locationFilter.toLowerCase()) : true;
        return matchesSearch && matchesLocation;
    });

    if (loading && jobs.length === 0) return <div className="loading">Loading jobs...</div>;

    return (
        <div className="candidate-container">
            <div className="page-header">
                <h1>Find Your Next Role</h1>
                <p>Browse thousands of job openings from top companies.</p>
            </div>

            <div className="search-container">
                <div className="search-input-group">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search by job title or company..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <select
                        className="filter-select"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                    >
                        <option value="">All Locations</option>
                        <option value="Remote">Remote</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Pune">Pune</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi</option>
                    </select>
                </div>

                {selectedJob && (
                    <JobDetailModal
                        job={selectedJob}
                        onClose={() => setSelectedJob(null)}
                        isApplied={appliedJobIds.has(selectedJob._id)}
                        onApplySuccess={handleApplySuccess}
                    />
                )}
            </div>

            {successMessage && <div className="success-message">{successMessage}</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="jobs-grid">
                {filteredJobs.length === 0 ? (
                    <div className="empty-state">
                        <h3>No jobs found</h3>
                        <p>Try adjusting your search criteria.</p>
                    </div>
                ) : (
                    filteredJobs.map((job) => (
                        <div
                            key={job._id}
                            className="job-card clickable-card"
                            onClick={() => setSelectedJob(job)}
                        >
                            <div className="job-header">
                                <div className="company-logo-placeholder">
                                    {job.recruiterId.companyProfile?.logo ? (
                                        <img
                                            src={job.recruiterId.companyProfile.logo}
                                            alt={job.recruiterId.companyProfile.companyName}
                                            className="company-logo-img"
                                        />
                                    ) : (
                                        job.recruiterId.companyProfile?.companyName?.charAt(0) || 'C'
                                    )}
                                </div>
                                <div className="job-title-section">
                                    <div className="job-title-link">
                                        <h2>{job.title}</h2>
                                    </div>
                                    <span className="company-name">
                                        {job.recruiterId.companyProfile?.companyName || 'Confidential'}
                                    </span>
                                </div>
                            </div>

                            <div className="job-meta">
                                <span className="meta-tag">📍 {job.location}</span>
                                <span className="meta-tag">💼 {job.experience ? `${job.experience.min}-${job.experience.max} yrs` : 'Exp N/A'}</span>
                            </div>

                            <div className="job-description">
                                <p>{job.description.length > 100 ? `${job.description.substring(0, 100)}...` : job.description}</p>
                            </div>

                            <div className="job-footer">
                                <div className="salary-tag">
                                    {(job.salary && job.salary.min && job.salary.max)
                                        ? `₹${job.salary.min.toLocaleString()} - ₹${job.salary.max.toLocaleString()} LPA`
                                        : 'Salary not disclosed'}
                                </div>

                                {appliedJobIds.has(job._id) ? (
                                    <button disabled className="apply-btn applied">
                                        ✓ Applied
                                    </button>
                                ) : (
                                    <span className="status-text view-details">View Details &rarr;</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default JobList;
