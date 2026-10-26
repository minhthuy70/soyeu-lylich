import React, { useState, useEffect } from 'react';
import './FreelanceProjects.css';

const FreelanceProjects = ({ onClose }) => {
  const [freelanceProjects, setFreelanceProjects] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    clientName: '',
    projectScope: '',
    rate: '',
    budget: '',
    duration: '',
    startDate: '',
    endDate: '',
    technologies: '',
    outcome: '',
    description: '',
  });

  const token = localStorage.getItem('token');
  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    fetchFreelanceProjects();
    fetchTotalEarnings();
  }, []);

  const fetchFreelanceProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/freelance-projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setFreelanceProjects(data.freelanceProjects || []);
    } catch (err) {
      setError('Failed to fetch freelance projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalEarnings = async () => {
    try {
      const response = await fetch(`${API_URL}/freelance-projects/total-earnings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTotalEarnings(data.totalEarnings || 0);
    } catch (err) {
      console.error('Failed to fetch total earnings');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        technologies: formData.technologies.split(',').map((t) => t.trim()).filter((t) => t),
      };

      const url = editingId
        ? `${API_URL}/freelance-projects/${editingId}`
        : `${API_URL}/freelance-projects`;
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
          clientName: '',
          projectScope: '',
          rate: '',
          budget: '',
          duration: '',
          startDate: '',
          endDate: '',
          technologies: '',
          outcome: '',
          description: '',
        });
        setShowForm(false);
        setEditingId(null);
        fetchFreelanceProjects();
        fetchTotalEarnings();
      }
    } catch (err) {
      setError('Failed to save freelance project');
    }
  };

  const handleEdit = (project) => {
    setFormData({
      clientName: project.clientName,
      projectScope: project.projectScope || '',
      rate: project.rate || '',
      budget: project.budget || '',
      duration: project.duration || '',
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      endDate: project.endDate ? project.endDate.split('T')[0] : '',
      technologies: project.technologies ? project.technologies.join(', ') : '',
      outcome: project.outcome || '',
      description: project.description || '',
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this freelance project?')) return;

    try {
      const response = await fetch(`${API_URL}/freelance-projects/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchFreelanceProjects();
        fetchTotalEarnings();
      }
    } catch (err) {
      setError('Failed to delete freelance project');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="freelance-container">
      <div className="freelance-header">
        <h2>Freelance Projects</h2>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {!showForm ? (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Projects</h3>
              <p className="stat-value">{freelanceProjects.length}</p>
            </div>
            <div className="stat-card">
              <h3>Total Earnings</h3>
              <p className="stat-value">${totalEarnings.toLocaleString()}</p>
            </div>
          </div>

          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Add Freelance Project
          </button>

          <div className="freelance-list">
            {freelanceProjects.map((project) => (
              <div key={project.id} className="freelance-card">
                <div className="freelance-main">
                  <h3>{project.clientName}</h3>
                  {project.projectScope && <p className="project-scope">{project.projectScope}</p>}
                  <div className="project-meta">
                    {project.rate && <span className="meta-tag">Rate: {project.rate}</span>}
                    {project.budget && <span className="meta-tag">Budget: {project.budget}</span>}
                    {project.duration && <span className="meta-tag">Duration: {project.duration}</span>}
                  </div>
                  <p className="date-range">
                    {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Start Date'} -{' '}
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'End Date'}
                  </p>
                </div>

                {project.description && (
                  <div className="freelance-details">
                    <h4>Description</h4>
                    <p>{project.description}</p>
                  </div>
                )}

                {project.technologies && project.technologies.length > 0 && (
                  <div className="freelance-details">
                    <h4>Technologies</h4>
                    <div className="tech-tags">
                      {project.technologies.map((t, i) => (
                        <span key={i} className="tech-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.outcome && (
                  <div className="freelance-details">
                    <h4>Outcome</h4>
                    <p>{project.outcome}</p>
                  </div>
                )}

                <div className="freelance-actions">
                  <button className="edit-btn" onClick={() => handleEdit(project)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(project.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <form className="freelance-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Freelance Project' : 'Add New Freelance Project'}</h3>

          <div className="form-group">
            <label>Client Name *</label>
            <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Project Scope</label>
            <textarea
              name="projectScope"
              value={formData.projectScope}
              onChange={handleChange}
              rows="3"
              placeholder="Describe the scope of the project"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rate (hourly/project)</label>
              <input type="text" name="rate" value={formData.rate} onChange={handleChange} placeholder="$50/hour" />
            </div>
            <div className="form-group">
              <label>Budget</label>
              <input type="text" name="budget" value={formData.budget} onChange={handleChange} placeholder="$5000" />
            </div>
          </div>

          <div className="form-group">
            <label>Duration</label>
            <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="3 months" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Technologies Used (comma-separated)</label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="React, Node.js, Python"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Detailed description of the project"
            />
          </div>

          <div className="form-group">
            <label>Outcome / Results</label>
            <textarea
              name="outcome"
              value={formData.outcome}
              onChange={handleChange}
              rows="3"
              placeholder="What was achieved? Client satisfaction? Impact?"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {editingId ? 'Update' : 'Add'} Project
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FreelanceProjects;
