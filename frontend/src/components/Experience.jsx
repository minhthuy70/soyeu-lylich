import React, { useState, useEffect } from 'react';
import './Experience.css';

const Experience = ({ onClose }) => {
  const [experiences, setExperiences] = useState([]);
  const [currentJobs, setCurrentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    position: '',
    employmentType: 'Full-time',
    startDate: '',
    endDate: '',
    currentJobStatus: false,
    jobDescription: '',
    responsibilities: '',
    achievements: '',
    technologiesUsed: '',
    companyWebsite: '',
    companyLogo: '',
    workLocation: '',
    workType: 'Onsite',
    salaryRange: '',
    reasonForLeaving: '',
    supervisorName: '',
  });

  const token = localStorage.getItem('token');
  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    fetchExperiences();
    fetchCurrentJobs();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch(`${API_URL}/experiences`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setExperiences(data.experiences || []);
    } catch {
      setError('Failed to fetch experiences');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentJobs = async () => {
    try {
      const response = await fetch(`${API_URL}/experiences/current`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCurrentJobs(data.currentJobs || []);
    } catch {
      console.error('Failed to fetch current jobs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        responsibilities: formData.responsibilities.split(',').map((r) => r.trim()).filter((r) => r),
        achievements: formData.achievements.split(',').map((a) => a.trim()).filter((a) => a),
        technologiesUsed: formData.technologiesUsed.split(',').map((t) => t.trim()).filter((t) => t),
      };

      const url = editingId
        ? `${API_URL}/experiences/${editingId}`
        : `${API_URL}/experiences`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setFormData({
          companyName: '',
          position: '',
          employmentType: 'Full-time',
          startDate: '',
          endDate: '',
          currentJobStatus: false,
          jobDescription: '',
          responsibilities: '',
          achievements: '',
          technologiesUsed: '',
          companyWebsite: '',
          companyLogo: '',
          workLocation: '',
          workType: 'Onsite',
          salaryRange: '',
          reasonForLeaving: '',
          supervisorName: '',
        });
        setShowForm(false);
        setEditingId(null);
        fetchExperiences();
        fetchCurrentJobs();
      }
    } catch {
      setError('Failed to save experience');
    }
  };

  const handleEdit = (exp) => {
    setFormData({
      companyName: exp.companyName,
      position: exp.position,
      employmentType: exp.employmentType,
      startDate: exp.startDate ? exp.startDate.split('T')[0] : '',
      endDate: exp.endDate ? exp.endDate.split('T')[0] : '',
      currentJobStatus: exp.currentJobStatus,
      jobDescription: exp.jobDescription || '',
      responsibilities: exp.responsibilities ? exp.responsibilities.join(', ') : '',
      achievements: exp.achievements ? exp.achievements.join(', ') : '',
      technologiesUsed: exp.technologiesUsed ? exp.technologiesUsed.join(', ') : '',
      companyWebsite: exp.companyWebsite || '',
      companyLogo: exp.companyLogo || '',
      workLocation: exp.workLocation || '',
      workType: exp.workType || 'Onsite',
      salaryRange: exp.salaryRange || '',
      reasonForLeaving: exp.reasonForLeaving || '',
      supervisorName: exp.supervisorName || '',
    });
    setEditingId(exp.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;

    try {
      const response = await fetch(`${API_URL}/experiences/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchExperiences();
        fetchCurrentJobs();
      }
    } catch {
      setError('Failed to delete experience');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="experience-container">
      <div className="experience-header">
        <h2>Work Experience</h2>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {!showForm ? (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Experiences</h3>
              <p className="stat-value">{experiences.length}</p>
            </div>
            <div className="stat-card">
              <h3>Current Jobs</h3>
              <p className="stat-value">{currentJobs.length}</p>
            </div>
          </div>

          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Add Experience
          </button>

          <div className="experience-list">
            {experiences.map((exp) => (
              <div key={exp.id} className="experience-card">
                <div className="experience-main">
                  <h3>{exp.position}</h3>
                  <p className="company-name">{exp.companyName}</p>
                  <p className="employment-type">{exp.employmentType}</p>
                  <p className="date-range">
                    {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : 'Start Date'} -{' '}
                    {exp.currentJobStatus ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'End Date'}
                  </p>
                  {exp.currentJobStatus && <span className="current-badge">Current</span>}
                </div>

                {exp.jobDescription && (
                  <div className="experience-details">
                    <h4>Description</h4>
                    <p>{exp.jobDescription}</p>
                  </div>
                )}

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="experience-details">
                    <h4>Responsibilities</h4>
                    <ul>
                      {exp.responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="experience-details">
                    <h4>Achievements</h4>
                    <ul>
                      {exp.achievements.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {exp.technologiesUsed && exp.technologiesUsed.length > 0 && (
                  <div className="experience-details">
                    <h4>Technologies</h4>
                    <div className="tech-tags">
                      {exp.technologiesUsed.map((t, i) => (
                        <span key={i} className="tech-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="experience-actions">
                  <button className="edit-btn" onClick={() => handleEdit(exp)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(exp.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <form className="experience-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Experience' : 'Add New Experience'}</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Position *</label>
              <input type="text" name="position" value={formData.position} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Employment Type</label>
              <select name="employmentType" value={formData.employmentType} onChange={handleChange}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
            <div className="form-group">
              <label>Work Type</label>
              <select name="workType" value={formData.workType} onChange={handleChange}>
                <option value="Onsite">Onsite</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={formData.currentJobStatus}
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="currentJobStatus"
                checked={formData.currentJobStatus}
                onChange={handleChange}
              />
              Currently Working Here
            </label>
          </div>

          <div className="form-group">
            <label>Job Description</label>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Responsibilities (comma-separated)</label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              rows="3"
              placeholder="Task 1, Task 2, Task 3"
            />
          </div>

          <div className="form-group">
            <label>Achievements (comma-separated)</label>
            <textarea
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              rows="3"
              placeholder="Achievement 1, Achievement 2, Achievement 3"
            />
          </div>

          <div className="form-group">
            <label>Technologies Used (comma-separated)</label>
            <input
              type="text"
              name="technologiesUsed"
              value={formData.technologiesUsed}
              onChange={handleChange}
              placeholder="React, Node.js, TypeScript"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Company Website</label>
              <input
                type="url"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Work Location</label>
              <input type="text" name="workLocation" value={formData.workLocation} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Salary Range (optional)</label>
              <input type="text" name="salaryRange" value={formData.salaryRange} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Supervisor Name</label>
              <input type="text" name="supervisorName" value={formData.supervisorName} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Reason for Leaving (optional)</label>
            <textarea
              name="reasonForLeaving"
              value={formData.reasonForLeaving}
              onChange={handleChange}
              rows="2"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {editingId ? 'Update' : 'Add'} Experience
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Experience;
