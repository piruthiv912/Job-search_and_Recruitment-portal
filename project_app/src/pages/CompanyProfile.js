import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { companyAPI } from '../services/api';
import './CompanyProfile.css';

const CompanyProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await companyAPI.getCompanyById(id);
                setCompany(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching company:', err);
                setError('Failed to load company details.');
                setLoading(false);
            }
        };
        fetchCompany();
    }, [id]);

    if (loading) return <div className="loading">Loading company details...</div>;
    if (error) return <div className="error-container">{error}</div>;
    if (!company) return <div className="error-container">Company not found.</div>;

    return (
        <div className="company-profile-container">
            <button className="back-btn" onClick={() => navigate(-1)}>
                ← Back to Jobs
            </button>

            <div className="company-header">
                <div className="company-logo-large">
                    {company.name.charAt(0)}
                </div>
                <div className="company-title-section">
                    <h1>{company.name}</h1>
                    <span className="industry-badge">{company.industry}</span>
                </div>
            </div>

            <div className="company-content">
                <div className="info-section">
                    <h2>About Us</h2>
                    <p className="description-text">{company.description}</p>
                </div>

                <div className="details-grid">
                    <div className="detail-item">
                        <span className="label">Location</span>
                        <span className="value">📍 {company.location}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Website</span>
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="website-link">
                            🌐 {company.website}
                        </a>
                    </div>
                    <div className="detail-item">
                        <span className="label">Joined</span>
                        <span className="value">📅 {new Date(company.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfile;
