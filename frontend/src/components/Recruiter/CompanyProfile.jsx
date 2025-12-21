import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { profileAPI } from '../../services/api';
import './Recruiter.css';

const CompanyProfile = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        companyName: '',
        website: '',
        location: '',
        industry: '',
        employeeCount: '',
        description: '',
        logo: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (location.state?.message) {
            setError(location.state.message);
        }

        const fetchProfile = async () => {
            try {
                const response = await profileAPI.getCompanyProfile();
                if (response.data && response.data.data) {
                    const data = response.data.data;
                    setFormData({
                        companyName: data.companyName || '',
                        website: data.website || '',
                        location: data.location || '',
                        industry: data.industry || '',
                        employeeCount: data.employeeCount || '',
                        description: data.description || '',
                        logo: data.logo || ''
                    });
                }
            } catch (err) {
                console.error('Failed to fetch profile', err);
                // Don't show error if it's just empty (404 for profile data logic if implemented that way, but controller returns partial)
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');

        try {
            await profileAPI.updateCompanyProfile(formData);
            setMessage('Company profile updated successfully!');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading">Loading profile...</div>;

    return (
        <div className="recruiter-container">
            <div className="page-header">
                <h1>Company Profile</h1>
                <p className="subtitle">Manage your company branding for job postings</p>
            </div>

            <div className="form-card">
                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Company Name *</label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Acme Corp"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Website</label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://example.com"
                            />
                        </div>
                        <div className="form-group half">
                            <label>Logo URL (Image Link)</label>
                            <input
                                type="url"
                                name="logo"
                                value={formData.logo}
                                onChange={handleChange}
                                placeholder="https://example.com/logo.png"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Industry</label>
                            <input
                                type="text"
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                placeholder="e.g. Technology, Finance"
                            />
                        </div>
                        <div className="form-group half">
                            <label>Employee Count</label>
                            <select
                                name="employeeCount"
                                value={formData.employeeCount}
                                onChange={handleChange}
                            >
                                <option value="">Select Size</option>
                                <option value="1-10">1-10</option>
                                <option value="11-50">11-50</option>
                                <option value="51-200">51-200</option>
                                <option value="201-500">201-500</option>
                                <option value="500+">500+</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Location (Headquarters)</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. San Francisco, CA"
                        />
                    </div>

                    <div className="form-group">
                        <label>About Company</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="5"
                            placeholder="Tell candidates about your company culture and mission..."
                        />
                    </div>

                    <div className="form-actions-right">
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompanyProfile;
