import React, { useState, useEffect } from 'react';
import './PublicationsPage.css';

export function PublicationsPage({ userId }) {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    journal: '',
    conference: '',
    publicationDate: '',
    coAuthors: '',
    doi: '',
    url: '',
    abstract: '',
  });

  useEffect(() => {
    loadPublications();
  }, [userId]);

  const loadPublications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/publications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPublications(data || []);
    } catch (error) {
      console.error('Failed to load publications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingId
        ? `/publications/${editingId}`
        : '/publications';
      const method = editingId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      await loadPublications();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: '',
        journal: '',
        conference: '',
        publicationDate: '',
        coAuthors: '',
        doi: '',
        url: '',
        abstract: '',
      });
    } catch (error) {
      console.error('Failed to save publication:', error);
    }
  };

  const handleEdit = (publication) => {
    setEditingId(publication.id);
    setFormData({
      title: publication.title,
      journal: publication.journal || '',
      conference: publication.conference || '',
      publicationDate: publication.publicationDate || '',
      coAuthors: publication.coAuthors ? publication.coAuthors.join(', ') : '',
      doi: publication.doi || '',
      url: publication.url || '',
      abstract: publication.abstract || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`/publications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadPublications();
    } catch (error) {
      console.error('Failed to delete publication:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      journal: '',
      conference: '',
      publicationDate: '',
      coAuthors: '',
      doi: '',
      url: '',
      abstract: '',
    });
  };

  if (loading) {
    return <div className="publications-loading">Loading publications...</div>;
  }

  return (
    <div className="publications-page">
      <div className="publications-header">
        <h1>Publications</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Publication
        </button>
      </div>

      {showForm && (
        <div className="publication-form">
          <h2>{editingId ? 'Edit Publication' : 'Add Publication'}</h2>
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
              <label>Journal</label>
              <input
                type="text"
                value={formData.journal}
                onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Conference</label>
              <input
                type="text"
                value={formData.conference}
                onChange={(e) => setFormData({ ...formData, conference: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Publication Date *</label>
              <input
                type="date"
                value={formData.publicationDate}
                onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Co-authors</label>
              <input
                type="text"
                value={formData.coAuthors}
                onChange={(e) => setFormData({ ...formData, coAuthors: e.target.value })}
                placeholder="Separate with commas"
              />
            </div>

            <div className="form-group">
              <label>DOI</label>
              <input
                type="text"
                value={formData.doi}
                onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                placeholder="https://doi.org/..."
              />
            </div>

            <div className="form-group">
              <label>URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="form-group">
              <label>Abstract</label>
              <textarea
                value={formData.abstract}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                rows={5}
                placeholder="Brief summary of the publication..."
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

      <div className="publications-list">
        {publications.length === 0 ? (
          <div className="empty-state">No publications yet. Add your first publication!</div>
        ) : (
          publications.map((publication) => (
            <div key={publication.id} className="publication-card">
              <div className="publication-header">
                <h3>{publication.title}</h3>
                <div className="publication-actions">
                  <button className="btn-icon" onClick={() => handleEdit(publication)}>
                    ✏️
                  </button>
                  <button className="btn-icon" onClick={() => handleDelete(publication.id)}>
                    🗑️
                  </button>
                </div>
              </div>
              <div className="publication-details">
                {publication.journal && <p><strong>Journal:</strong> {publication.journal}</p>}
                {publication.conference && <p><strong>Conference:</strong> {publication.conference}</p>}
                <p><strong>Date:</strong> {new Date(publication.publicationDate).toLocaleDateString()}</p>
                {publication.coAuthors && publication.coAuthors.length > 0 && <p><strong>Co-authors:</strong> {publication.coAuthors.join(', ')}</p>}
                {publication.doi && (
                  <p><strong>DOI:</strong> <a href={publication.doi} target="_blank" rel="noopener noreferrer">{publication.doi}</a></p>
                )}
                {publication.url && (
                  <p><strong>URL:</strong> <a href={publication.url} target="_blank" rel="noopener noreferrer">{publication.url}</a></p>
                )}
                {publication.abstract && <p><strong>Abstract:</strong> {publication.abstract}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
