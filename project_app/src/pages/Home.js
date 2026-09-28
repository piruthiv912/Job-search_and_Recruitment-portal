import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  return (
    <div className="home-container">

      <div className="hero-section">
        <div className="hero-content">
          <h1 className="animate-fade-in">Bridge the Gap Between <span className="gradient-text">Ambition</span> and <span className="gradient-text">Opportunity</span></h1>
          <p className="hero-subtitle">The all-in-one placement management system for elite universities and top-tier recruiters.</p>
          <div className="cta-buttons">
            {token ? (
              <>
                <button className="btn btn-primary pulse" onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </button>
                <button className="btn btn-outline" onClick={() => navigate('/jobs')}>
                  View Openings
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-primary pulse" onClick={() => navigate('/login')}>
                  Get Started
                </button>
                <button className="btn btn-outline" onClick={() => navigate('/register')}>
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
        <div className="hero-image-placeholder">
          {/* A visual representation or illustration could go here */}
          <div className="floating-card c1">🚀 500+ Hired</div>
          <div className="floating-card c2">🏢 50+ Partners</div>
        </div>
      </div>

      <section className="info-grid">
        <div className="info-card">
          <div className="icon-circle">🎓</div>
          <h3>For Students</h3>
          <p>Build your professional profile, showcase your skills, and get discovered by top companies with automated application tracking.</p>
        </div>
        <div className="info-card">
          <div className="icon-circle">💼</div>
          <h3>For Recruiters</h3>
          <p>Streamline your hiring loop. Post openings, manage talent pipelines, and communicate with candidates in real-time.</p>
        </div>
        <div className="info-card">
          <div className="icon-circle">📊</div>
          <h3>For Admins</h3>
          <p>Gain deep insights into placement statistics, manage batch performance, and oversee the entire campus recruitment cycle.</p>
        </div>
      </section>

      <div className="featured-companies">
        <h4>Trusted by Industry Leaders</h4>
        <div className="company-logos">
          {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'].map(c => (
            <span key={c} className="logo-text">{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
