import React, { useState, useEffect } from 'react';
import './PatentsPage.css';

export function PatentsPage({ userId }) {
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    patentNumber: '',
    title: '',
    filingDate: '',
    status: 'Pending',
    description: '',
  });

  useEffect(() => {
    loadPatents();
  }, [userId]);

  const loadPatents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/patents', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPatents(data || []);
    } catch (error) {
      console.error('Failed to load patents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingId
        ? `/patents/${editingId}`
        : '/patents';
      const method = editingId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      await loadPatents();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        patentNumber: '',
        title: '',
        filingDate: '',
        status: 'Pending',
        description: '',
      });
    } catch (error) {
      console.error('Failed to save patent:', error);
    }
  };

  const handleEdit = (patent) => {
    setEditingId(patent.id);
    setFormData({
      patentNumber: patent.patentNumber,
      title: patent.title,
      filingDate: patent.filingDate,
      status: patent.status,
      description: patent.description,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this patent?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`/patents/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadPatents();
    } catch (error) {
      console.error('Failed to delete patent:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      patentNumber: '',
      title: '',
      filingDate: '',
      status: 'pending',
      description: '',
    });
  };

  if (loading) {
    return <div className="patents-loading">Loading patents...</div>;
  }

  return (
    <div className="patents-page">
      <div className="patents-header">
        <h1>Patents & Intellectual Property</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Patent
        </button>
      </div>

      {showForm && (
        <div className="patent-form">
          <h2>{editingId ? 'Edit Patent' : 'Add Patent'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Patent Number/Title *</label>
              <input
                type="text"
                value={formData.patentNumber}
                onChange={(e) => setFormData({ ...formData, patentNumber: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Patent Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Filing Date *</label>
              <input
                type="date"
                value={formData.filingDate}
                onChange={(e) => setFormData({ ...formData, filingDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="Granted">Granted</option>
                <option value="Rejected">Rejected</option>
                <option value="Abandoned">Abandoned</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Brief description of the patent..."
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

      <div className="patents-list">
        {patents.length === 0 ? (
          <div className="empty-state">No patents yet. Add your first patent!</div>
        ) : (
          patents.map((patent) => (
            <div key={patent.id} className="patent-card">
              <div className="patent-header">
                <h3>{patent.title}</h3>
                <div className="patent-actions">
                  <button className="btn-icon" onClick={() => handleEdit(patent)}>
                    ✏️
                  </button>
                  <button className="btn-icon" onClick={() => handleDelete(patent.id)}>
                    🗑️
                  </button>
                </div>
              </div>
              <div className="patent-details">
                <p><strong>Patent Number:</strong> {patent.patentNumber}</p>
                <p><strong>Filing Date:</strong> {new Date(patent.filingDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span className={`status-badge status-${patent.status.toLowerCase()}`}>{patent.status}</span></p>
                {patent.description && <p><strong>Description:</strong> {patent.description}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
