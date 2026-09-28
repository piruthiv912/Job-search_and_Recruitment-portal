import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyAPI } from '../services/api';
import './Auth.css'; // Reuse auth/form styles

const CreateCompany = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        website: '',
        location: '',
        industry: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await companyAPI.createCompany(formData);
            alert('Company profile created successfully!');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create company profile');
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form" style={{ maxWidth: '600px' }}>
                <h2>Create Company Profile</h2>
                <p className="subtitle">You need a company profile before you can post job opportunities.</p>
                {error && <div className="error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Company Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="e.g. Acme Corporation"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            placeholder="Tell us about your company..."
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Industry</label>
                            <input
                                type="text"
                                name="industry"
                                placeholder="e.g. Technology"
                                value={formData.industry}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="e.g. San Francisco, CA"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Website URL</label>
                        <input
                            type="url"
                            name="website"
                            placeholder="https://example.com"
                            value={formData.website}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Company Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateCompany;
