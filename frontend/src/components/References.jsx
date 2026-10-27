import React, { useState, useEffect } from 'react';
import './References.css';

const References = ({ onClose }) => {
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    contact: '',
    relationship: '',
  });

  const token = localStorage.getItem('token');
  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    fetchReferences();
  }, []);

  const fetchReferences = async () => {
    try {
      const response = await fetch(`${API_URL}/references`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setReferences(data.references || []);
    } catch {
      setError('Failed to fetch references');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API_URL}/references/${editingId}` : `${API_URL}/references`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          name: '',
          position: '',
          company: '',
          contact: '',
          relationship: '',
        });
        setShowForm(false);
        setEditingId(null);
        fetchReferences();
      }
    } catch {
      setError('Failed to save reference');
    }
  };

  const handleEdit = (ref) => {
    setFormData({
      name: ref.name,
      position: ref.position || '',
      company: ref.company || '',
      contact: ref.contact || '',
      relationship: ref.relationship || '',
    });
    setEditingId(ref.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reference?')) return;

    try {
      const response = await fetch(`${API_URL}/references/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchReferences();
      }
    } catch {
      setError('Failed to delete reference');
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
    <div className="references-container">
      <div className="references-header">
        <h2>References</h2>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {!showForm ? (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total References</h3>
              <p className="stat-value">{references.length}</p>
            </div>
          </div>

          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Add Reference
          </button>

          <div className="references-list">
            {references.map((ref) => (
              <div key={ref.id} className="reference-card">
                <div className="reference-main">
                  <h3>{ref.name}</h3>
                  {ref.position && <p className="position">{ref.position}</p>}
                  {ref.company && <p className="company">{ref.company}</p>}
                  {ref.contact && <p className="contact">{ref.contact}</p>}
                  {ref.relationship && <p className="relationship">Relationship: {ref.relationship}</p>}
                </div>

                <div className="reference-actions">
                  <button className="edit-btn" onClick={() => handleEdit(ref)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(ref.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <form className="reference-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Reference' : 'Add New Reference'}</h3>

          <div className="form-group">
            <label>Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Position</label>
            <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Job Title" />
          </div>

          <div className="form-group">
            <label>Company</label>
            <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company Name" />
          </div>

          <div className="form-group">
            <label>Contact (Phone/Email)</label>
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="contact@example.com" />
          </div>

          <div className="form-group">
            <label>Relationship</label>
            <input
              type="text"
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              placeholder="Former Manager, Colleague, Professor, etc."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {editingId ? 'Update' : 'Add'} Reference
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default References;
