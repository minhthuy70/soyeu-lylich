import React, { useState, useEffect } from 'react';
import './ActivitiesPage.css';

export function ActivitiesPage({ userId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    organization: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
    achievements: '',
    type: 'club',
    memberCount: '',
  });

  useEffect(() => {
    loadActivities();
  }, [userId]);

  const loadActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/activities', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setActivities(data || []);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingId
        ? `/activities/${editingId}`
        : '/activities';
      const method = editingId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      await loadActivities();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        organization: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
        achievements: '',
        type: 'club',
        memberCount: '',
      });
    } catch (error) {
      console.error('Failed to save activity:', error);
    }
  };

  const handleEdit = (activity) => {
    setEditingId(activity.id);
    setFormData({
      organization: activity.organization,
      position: activity.position,
      startDate: activity.startDate,
      endDate: activity.endDate || '',
      description: activity.description,
      achievements: activity.achievements || '',
      type: activity.type,
      memberCount: activity.memberCount || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`/activities/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadActivities();
    } catch (error) {
      console.error('Failed to delete activity:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      organization: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      achievements: '',
      type: 'club',
      memberCount: '',
    });
  };

  if (loading) {
    return <div className="activities-loading">Loading activities...</div>;
  }

  return (
    <div className="activities-page">
      <div className="activities-header">
        <h1>Activities</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Activity
        </button>
      </div>

      {showForm && (
        <div className="activity-form">
          <h2>{editingId ? 'Edit Activity' : 'Add Activity'}</h2>
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
              <label>Position/Role *</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
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
                />
              </div>
            </div>

            <div className="form-group">
              <label>Activity Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="club">Club</option>
                <option value="society">Society</option>
                <option value="organization">Organization</option>
                <option value="team">Team</option>
                <option value="volunteer">Volunteer</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Member Count</label>
              <input
                type="number"
                value={formData.memberCount}
                onChange={(e) => setFormData({ ...formData, memberCount: e.target.value })}
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Key Achievements</label>
              <textarea
                value={formData.achievements}
                onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                rows={3}
                placeholder="List your key achievements in this activity..."
              />
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

      <div className="activities-list">
        {activities.length === 0 ? (
          <div className="empty-state">No activities yet. Add your first activity!</div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="activity-card">
              <div className="activity-header">
                <h3>{activity.organization}</h3>
                <div className="activity-actions">
                  <button className="btn-icon" onClick={() => handleEdit(activity)}>
                    ✏️
                  </button>
                  <button className="btn-icon" onClick={() => handleDelete(activity.id)}>
                    🗑️
                  </button>
                </div>
              </div>
              <div className="activity-details">
                <p><strong>Position:</strong> {activity.position}</p>
                <p><strong>Period:</strong> {new Date(activity.startDate).toLocaleDateString()} - {activity.endDate ? new Date(activity.endDate).toLocaleDateString() : 'Present'}</p>
                <p><strong>Type:</strong> {activity.type}</p>
                {activity.memberCount && <p><strong>Members:</strong> {activity.memberCount}</p>}
                {activity.description && <p><strong>Description:</strong> {activity.description}</p>}
                {activity.achievements && <p><strong>Achievements:</strong> {activity.achievements}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
