import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jobAPI, companyAPI } from '../services/api';
import './Dashboard.css';

const PostJob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        salary: { min: '', max: '' },
        jobType: 'Full-time',
        skills: '',
        minCGPA: '',
        positions: '',
        deadline: ''
    });
    const [loading, setLoading] = useState(false);
    const [checkingCompany, setCheckingCompany] = useState(true);
    const [hasCompany, setHasCompany] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        checkCompany();
    }, []);

    const checkCompany = async () => {
        try {
            const response = await companyAPI.getMyCompany();
            if (response.data) {
                setHasCompany(true);
                setCompanyName(response.data.name);
            }
            setCheckingCompany(false);
        } catch (err) {
            console.error("Error checking company:", err);
            setHasCompany(false);
            setCheckingCompany(false);
            setError('No company profile found for this recruiter. Please create a company profile first.');
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'minSalary' || name === 'maxSalary') {
            setFormData({
                ...formData,
                salary: {
                    ...formData.salary,
                    [name === 'minSalary' ? 'min' : 'max']: value
                }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const dataToSubmit = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()),
                minCGPA: parseFloat(formData.minCGPA),
                positions: parseInt(formData.positions)
            };

            await jobAPI.createJob(dataToSubmit);
            alert('Job posted successfully!');
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to post job';
            setError(msg);
            if (msg.includes('company profile')) {
                setHasCompany(false);
            }
            setLoading(false);
        }
    };

    if (checkingCompany) return <div className="loading">Checking profile...</div>;
    if (loading && !formData.title) return <div className="loading">Posting job...</div>;

    return (

        <div className="dashboard-container">
            <div className="login-card glass" style={{ maxWidth: '800px', margin: '40px auto', border: '1px solid rgba(255,255,255,0.3)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '0.5rem' }}>Post a New Job Opportunity</h2>
                    {hasCompany && (
                        <div className="badge accepted" style={{ display: 'inline-block', padding: '0.5rem 1rem' }}>
                            Posting for: <strong>{companyName}</strong>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="error-message" style={{
                        background: '#fef2f2',
                        color: '#ef4444',
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        border: '1px solid #fee2e2',
                        textAlign: 'center'
                    }}>
                        {error}
                        {!hasCompany && error.includes('company profile') && (
                            <div style={{ marginTop: '0.5rem' }}>
                                <Link to="/create-company" className="btn btn-primary btn-small">
                                    Create Company Profile Now
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label>Job Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="e.g. Senior Frontend Developer"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            rows="5"
                            placeholder="Detailed job description and responsibilities..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="e.g. Bangalore, Remote"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Job Type</label>
                            <select name="jobType" value={formData.jobType} onChange={handleChange}>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Min Salary (₹)</label>
                            <input
                                type="number"
                                name="minSalary"
                                value={formData.salary.min}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Max Salary (₹)</label>
                            <input
                                type="number"
                                name="maxSalary"
                                value={formData.salary.max}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Required Skills (comma separated)</label>
                        <input
                            type="text"
                            name="skills"
                            placeholder="React, Node.js, AWS"
                            value={formData.skills}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Min CGPA</label>
                            <input
                                type="number"
                                step="0.1"
                                name="minCGPA"
                                value={formData.minCGPA}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Positions</label>
                            <input
                                type="number"
                                name="positions"
                                value={formData.positions}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Deadline</label>
                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Posting...' : 'Create Job Listing'}
                    </button>
                    <button type="button" className="btn btn-secondary btn-block" onClick={() => navigate('/dashboard')}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostJob;

