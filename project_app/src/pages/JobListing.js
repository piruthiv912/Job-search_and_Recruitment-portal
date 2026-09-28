import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jobAPI, applicationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './JobListing.css';

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeData, setResumeData] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobAPI.getAllJobs();
      setJobs(response.data);
      setError('');
      setLoading(false);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Could not load job listings.');
      setLoading(false);
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Resume file size must be less than 5MB');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setResumeData(reader.result);
      setResumeFileName(file.name);
    };
    reader.onerror = () => {
      alert('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveResume = () => {
    setResumeData('');
    setResumeFileName('');
  };

  const handleApply = async (jobId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!coverLetter.trim()) {
      alert('Please write your cover letter before submitting.');
      return;
    }

    if (!resumeData) {
      alert('Please attach your resume before submitting the application.');
      return;
    }

    try {
      setSubmitting(true);
      await applicationAPI.applyForJob({
        jobId,
        coverletter: coverLetter,
        resume: resumeData,
        resumeName: resumeFileName
      });
      alert('Application submitted successfully!');
      setCoverLetter('');
      setResumeData('');
      setResumeFileName('');
      setSelectedJob(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to apply');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading jobs...</div>;

  return (
    <div className="job-listing-container">
      <h1>Available Placements</h1>
      {error && <div className="jobs-empty error-state">{error}</div>}
      {!error && jobs.length === 0 && (
        <div className="jobs-empty">No open roles right now. Check back soon.</div>
      )}
      <div className="jobs-grid">
        {jobs.map(job => (
          <div key={job._id} className="job-card">
            <div className="job-header">
              <h3>{job.title}</h3>
              {new Date(job.postedDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                <span className="new-badge">New</span>
              )}
            </div>
            <Link to={`/companies/${job.company?._id}`} className="company-link">
              <p className="company">{job.company?.name}</p>
            </Link>
            <p className="description">{job.description}</p>
            <div className="job-details">
              <span>📍 {job.location}</span>
              <span>💼 {job.jobType}</span>
              <span>🎓 {job.experienceLevel}</span>
              <span>💰 ₹{job.salary?.min.toLocaleString()} - ₹{job.salary?.max.toLocaleString()}</span>
              <span className="posted-date">🕒 Posted {new Date(job.postedDate).toLocaleDateString()}</span>
            </div>
            <div className="skills">
              {job.skills?.map((skill, idx) => (
                <span key={idx} className="skill-tag">{skill}</span>
              ))}
            </div>

            {selectedJob === job._id ? (
              <div className="apply-form">
                <label className="apply-field-label">Cover Letter</label>
                <textarea
                  placeholder="Write your cover letter explaining why you are a great fit..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows="4"
                />

                <div className="resume-upload-section">
                  <div className="resume-label">
                    <span>📄 Attach Resume <span className="required-star" style={{ color: '#ef4444' }}>*</span></span>
                    <span className="resume-hint">PDF, DOC, DOCX up to 5MB</span>
                  </div>

                  {!resumeFileName ? (
                    <div className="resume-dropzone">
                      <input
                        type="file"
                        id={`resume-input-${job._id}`}
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeChange}
                        className="resume-file-input"
                      />
                      <label htmlFor={`resume-input-${job._id}`} className="resume-upload-btn">
                        <span>📎 Choose Resume File</span>
                      </label>
                    </div>
                  ) : (
                    <div className="resume-selected-pill">
                      <span className="resume-selected-name">📄 {resumeFileName}</span>
                      <button
                        type="button"
                        className="resume-remove-btn"
                        onClick={handleRemoveResume}
                        title="Remove resume"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button
                    className="submit-btn"
                    onClick={() => handleApply(job._id)}
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setSelectedJob(null);
                      setCoverLetter('');
                      setResumeData('');
                      setResumeFileName('');
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="apply-btn"
                onClick={() => setSelectedJob(job._id)}
              >
                Apply Now
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobListing;

