import React, { useState, useEffect } from 'react';
import './VolunteerExperiencePage.css';

export function VolunteerExperiencePage({ userId }) {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    organization: '',
    role: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    responsibilities: '',
    achievements: '',
    hoursPerWeek: '',
    cause: '',
  });

  useEffect(() => {
    loadVolunteers();
  }, [userId]);

  const loadVolunteers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/volunteer-experiences', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setVolunteers(data || []);
    } catch (error) {
      console.error('Failed to load volunteer experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingId
        ? `/volunteer-experiences/${editingId}`
        : '/volunteer-experiences';
      const method = editingId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      await loadVolunteers();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        organization: '',
        role: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        responsibilities: '',
        achievements: '',
        hoursPerWeek: '',
        cause: '',
      });
    } catch (error) {
      console.error('Failed to save volunteer experience:', error);
    }
  };

  const handleEdit = (volunteer) => {
    setEditingId(volunteer.id);
    setFormData({
      organization: volunteer.organization,
      role: volunteer.role,
      startDate: volunteer.startDate,
      endDate: volunteer.endDate || '',
      isCurrent: volunteer.isCurrent || false,
      description: volunteer.description || '',
      responsibilities: volunteer.responsibilities || '',
      achievements: volunteer.achievements || '',
      hoursPerWeek: volunteer.hoursPerWeek || '',
      cause: volunteer.cause || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this volunteer experience?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`/volunteer-experiences/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadVolunteers();
    } catch (error) {
      console.error('Failed to delete volunteer experience:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      organization: '',
      role: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      responsibilities: '',
      achievements: '',
      hoursPerWeek: '',
      cause: '',
    });
  };

  if (loading) {
    return <div className="volunteer-loading">Loading volunteer experiences...</div>;
  }

  return (
    <div className="volunteer-page">
      <div className="volunteer-header">
        <h1>Volunteer Experience</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Volunteer Experience
        </button>
      </div>

      {showForm && (
        <div className="volunteer-form">
          <h2>{editingId ? 'Edit Volunteer Experience' : 'Add Volunteer Experience'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Organization *</label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Role *</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  disabled={formData.isCurrent}
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isCurrent}
                  onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                />
                {' '}Currently volunteering
              </label>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Describe your volunteer work..."
              />
            </div>

            <div className="form-group">
              <label>Responsibilities</label>
              <textarea
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                rows={3}
                placeholder="List your key responsibilities..."
              />
            </div>

            <div className="form-group">
              <label>Key Achievements</label>
              <textarea
                value={formData.achievements}
                onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                rows={3}
                placeholder="List your achievements in this role..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Hours per Week</label>
                <input
                  type="number"
                  value={formData.hoursPerWeek}
                  onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Cause</label>
                <input
                  type="text"
                  value={formData.cause}
                  onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                  placeholder="e.g., Education, Environment, Health"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Add'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="volunteer-list">
        {volunteers.length === 0 ? (
          <div className="empty-state">No volunteer experiences yet. Add your first experience!</div>
        ) : (
          volunteers.map((volunteer) => (
            <div key={volunteer.id} className="volunteer-card">
              <div className="volunteer-header">
                <h3>{volunteer.organization}</h3>
                <div className="volunteer-actions">
                  <button className="btn-icon" onClick={() => handleEdit(volunteer)}>
                    ✏️
                  </button>
                  <button className="btn-icon" onClick={() => handleDelete(volunteer.id)}>
                    🗑️
                  </button>
                </div>
              </div>
              <div className="volunteer-details">
                <p><strong>Role:</strong> {volunteer.role}</p>
                <p><strong>Duration:</strong> {new Date(volunteer.startDate).toLocaleDateString()} - {volunteer.endDate ? new Date(volunteer.endDate).toLocaleDateString() : (volunteer.isCurrent ? 'Present' : '')}</p>
                {volunteer.description && <p><strong>Description:</strong> {volunteer.description}</p>}
                {volunteer.responsibilities && <p><strong>Responsibilities:</strong> {volunteer.responsibilities}</p>}
                {volunteer.achievements && <p><strong>Achievements:</strong> {volunteer.achievements}</p>}
                {volunteer.hoursPerWeek && <p><strong>Hours per Week:</strong> {volunteer.hoursPerWeek}</p>}
                {volunteer.cause && <p><strong>Cause:</strong> {volunteer.cause}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
