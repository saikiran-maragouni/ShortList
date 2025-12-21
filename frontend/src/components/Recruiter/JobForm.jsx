import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recruiterJobsAPI } from '../../services/api';
import './Recruiter.css';

const JobForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        skills: '',
        minExp: '',
        maxExp: '',
        minSalary: '',
        maxSalary: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Format data for API
            const jobData = {
                title: formData.title,
                description: formData.description,
                location: formData.location,
                skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
                experience: {
                    min: Number(formData.minExp),
                    max: Number(formData.maxExp)
                },
                salary: {
                    min: Number(formData.minSalary),
                    max: Number(formData.maxSalary)
                }
            };

            await recruiterJobsAPI.createJob(jobData);
            navigate('/recruiter/jobs');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create job.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recruiter-container">
            <div className="page-header">
                <h1>Post a New Job</h1>
                <p>Find the best talent for your team.</p>
            </div>

            <div className="form-card card">
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Job Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Senior Frontend Developer"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Remote, San Francisco, CA"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Min Experience (Years)</label>
                            <input
                                type="number"
                                name="minExp"
                                value={formData.minExp}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>
                        <div className="form-group half">
                            <label>Max Experience (Years)</label>
                            <input
                                type="number"
                                name="maxExp"
                                value={formData.maxExp}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Min Salary ($)</label>
                            <input
                                type="number"
                                name="minSalary"
                                value={formData.minSalary}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>
                        <div className="form-group half">
                            <label>Max Salary ($)</label>
                            <input
                                type="number"
                                name="maxSalary"
                                value={formData.maxSalary}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Required Skills (Comma separated)</label>
                        <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="e.g. React, Node.js, MongoDB"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Job Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="6"
                            placeholder="Describe the role, responsibilities, and requirements..."
                            required
                        ></textarea>
                    </div>

                    <div className="form-actions-right">
                        <button type="button" onClick={() => navigate('/recruiter/jobs')} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Posting...' : 'Post Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobForm;
