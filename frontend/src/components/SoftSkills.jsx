import React, { useState, useEffect } from 'react';
import './TechnicalSkills.css';

export default function SoftSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    level: 'Beginner',
    description: '',
    progress: 50,
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/soft-skills', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setSkills(data.skills || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = editingSkill ? `/soft-skills/${editingSkill.id}` : '/soft-skills';
      const method = editingSkill ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      setShowForm(false);
      setEditingSkill(null);
      resetForm();
      await loadSkills();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa kỹ năng này?')) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await fetch(`/soft-skills/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadSkills();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', level: 'Beginner', description: '', progress: 50 });
  };

  const getLevelColor = (level) => {
    const colors = { Beginner: '#f59e0b', Intermediate: '#3b82f6', Advanced: '#10b981', Expert: '#8b5cf6' };
    return colors[level] || '#6b7280';
  };

  return (
    <div className="technical-skills">
      <div className="skills-header">
        <h2>Kỹ năng mềm</h2>
        <button className="btn-primary" onClick={() => { setShowForm(true); resetForm(); }}>
          + Thêm kỹ năng
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="skill-form">
          <h3>{editingSkill ? 'Chỉnh sửa kỹ năng' : 'Thêm kỹ năng mới'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tên kỹ năng *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Mức độ</label>
              <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div className="form-group">
              <label>Mức độ ({formData.progress}%)</label>
              <input type="range" min="0" max="100" value={formData.progress} onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Mô tả</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditingSkill(null); }}>Hủy</button>
              <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
            </div>
          </form>
        </div>
      )}

      {loading && !showForm && <div className="loading-state">Đang tải...</div>}

      {!loading && !showForm && (
        <div className="skills-grid">
          {skills.map((skill) => (
            <div key={skill.id} className="skill-card">
              <div className="skill-header">
                <h3>{skill.name}</h3>
                <span className="skill-level" style={{ backgroundColor: getLevelColor(skill.level) }}>{skill.level}</span>
              </div>
              <div className="skill-progress">
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${skill.progress}%` }} /></div>
                <span className="progress-text">{skill.progress}%</span>
              </div>
              {skill.description && <p className="skill-description">{skill.description}</p>}
              <div className="skill-footer">
                <div className="skill-actions">
                  <button onClick={() => { setEditingSkill(skill); setShowForm(true); setFormData(skill); }} className="btn-edit">✏️</button>
                  <button onClick={() => handleDelete(skill.id)} className="btn-delete">🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
