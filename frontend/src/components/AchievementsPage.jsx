import React, { useState, useEffect } from 'react';
import './AchievementsPage.css';

export function AchievementsPage({ userId }) {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    date: '',
    description: '',
    evidenceUrl: '',
    category: 'academic',
    level: 'school',
  });

  useEffect(() => {
    loadAchievements();
  }, [userId]);

  const loadAchievements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/achievements', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAchievements(data || []);
    } catch (error) {
      console.error('Failed to load achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingId
        ? `/achievements/${editingId}`
        : '/achievements';
      const method = editingId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      await loadAchievements();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: '',
        organization: '',
        date: '',
        description: '',
        evidenceUrl: '',
        category: 'academic',
        level: 'school',
      });
    } catch (error) {
      console.error('Failed to save achievement:', error);
    }
  };

  const handleEdit = (achievement) => {
    setEditingId(achievement.id);
    setFormData({
      title: achievement.title,
      organization: achievement.organization,
      date: achievement.date,
      description: achievement.description,
      evidenceUrl: achievement.evidenceUrl || '',
      category: achievement.category,
      level: achievement.level,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`/achievements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadAchievements();
    } catch (error) {
      console.error('Failed to delete achievement:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      organization: '',
      date: '',
      description: '',
      evidenceUrl: '',
      category: 'academic',
      level: 'school',
    });
  };

  if (loading) {
    return <div className="achievements-loading">Loading achievements...</div>;
  }

  return (
    <div className="achievements-page">
      <div className="achievements-header">
        <h1>Achievements</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Achievement
        </button>
      </div>

      {showForm && (
        <div className="achievement-form">
          <h2>{editingId ? 'Edit Achievement' : 'Add Achievement'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

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
              <label>Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="academic">Academic</option>
                <option value="professional">Professional</option>
                <option value="sports">Sports</option>
                <option value="arts">Arts</option>
                <option value="community">Community</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              >
                <option value="school">School</option>
                <option value="district">District</option>
                <option value="province">Province</option>
                <option value="national">National</option>
                <option value="international">International</option>
              </select>
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
              <label>Evidence URL</label>
              <input
                type="url"
                value={formData.evidenceUrl}
                onChange={(e) => setFormData({ ...formData, evidenceUrl: e.target.value })}
                placeholder="https://..."
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

      <div className="achievements-list">
        {achievements.length === 0 ? (
          <div className="empty-state">No achievements yet. Add your first achievement!</div>
        ) : (
          achievements.map((achievement) => (
            <div key={achievement.id} className="achievement-card">
              <div className="achievement-header">
                <h3>{achievement.title}</h3>
                <div className="achievement-actions">
                  <button className="btn-icon" onClick={() => handleEdit(achievement)}>
                    ✏️
                  </button>
                  <button className="btn-icon" onClick={() => handleDelete(achievement.id)}>
                    🗑️
                  </button>
                </div>
              </div>
              <div className="achievement-details">
                <p><strong>Organization:</strong> {achievement.organization}</p>
                <p><strong>Date:</strong> {new Date(achievement.date).toLocaleDateString()}</p>
                <p><strong>Category:</strong> {achievement.category}</p>
                <p><strong>Level:</strong> {achievement.level}</p>
                {achievement.description && <p><strong>Description:</strong> {achievement.description}</p>}
                {achievement.evidenceUrl && (
                  <p><strong>Evidence:</strong> <a href={achievement.evidenceUrl} target="_blank" rel="noopener noreferrer">View</a></p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
