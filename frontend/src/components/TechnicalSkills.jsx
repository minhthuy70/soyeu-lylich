import React, { useState, useEffect } from 'react';
import './TechnicalSkills.css';

export default function TechnicalSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    level: 'Beginner',
    yearsOfExperience: '',
    description: '',
    progress: 50,
    tags: '',
    portfolioLink: '',
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/skills', {
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
      const submitData = {
        ...formData,
        yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
      };

      if (editingSkill) {
        await fetch(`/skills/${editingSkill.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(submitData),
        });
      } else {
        await fetch('/skills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(submitData),
        });
      }

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
      await fetch(`/skills/${id}`, {
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

  const handleEndorse = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/skills/${id}/endorse`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadSkills();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      level: 'Beginner',
      yearsOfExperience: '',
      description: '',
      progress: 50,
      tags: '',
      portfolioLink: '',
    });
  };

  const getLevelColor = (level) => {
    const colors = {
      Beginner: '#f59e0b',
      Intermediate: '#3b82f6',
      Advanced: '#10b981',
      Expert: '#8b5cf6',
    };
    return colors[level] || '#6b7280';
  };

  return (
    <div className="technical-skills">
      <div className="skills-header">
        <h2>Kỹ năng chuyên môn</h2>
        <button className="btn-primary" onClick={() => { setShowForm(true); resetForm(); }}>
          + Thêm kỹ năng
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="skill-form">
          <h3>{editingSkill ? 'Chỉnh sửa kỹ năng' : 'Thêm kỹ năng mới'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Tên kỹ năng *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Danh mục</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ví dụ: Frontend, Backend, Database"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Mức độ</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div className="form-group">
                <label>Số năm kinh nghiệm</label>
                <input
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                  min="0"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Mức độ ({formData.progress}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Tags (ngăn cách bằng dấu phẩy)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Ví dụ: React, TypeScript, Node.js"
              />
            </div>
            <div className="form-group">
              <label>Portfolio Link</label>
              <input
                type="url"
                value={formData.portfolioLink}
                onChange={(e) => setFormData({ ...formData, portfolioLink: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditingSkill(null); }}>
                Hủy
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
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
                <span className="skill-level" style={{ backgroundColor: getLevelColor(skill.level) }}>
                  {skill.level}
                </span>
              </div>
              {skill.category && <p className="skill-category">{skill.category}</p>}
              <div className="skill-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${skill.progress}%` }} />
                </div>
                <span className="progress-text">{skill.progress}%</span>
              </div>
              {skill.yearsOfExperience && <p className="skill-meta">{skill.yearsOfExperience} năm kinh nghiệm</p>}
              {skill.description && <p className="skill-description">{skill.description}</p>}
              {skill.tags && skill.tags.length > 0 && (
                <div className="skill-tags">
                  {skill.tags.map((tag, idx) => (
                    <span key={idx} className="tag">{tag}</span>
                  ))}
                </div>
              )}
              {skill.portfolioLink && (
                <a href={skill.portfolioLink} target="_blank" rel="noopener noreferrer" className="portfolio-link">
                  Xem Portfolio
                </a>
              )}
              <div className="skill-footer">
                <span className="endorsement-count">👍 {skill.endorsementCount || 0}</span>
                <div className="skill-actions">
                  <button onClick={() => handleEndorse(skill.id)} className="btn-endorse">
                    Endorse
                  </button>
                  <button onClick={() => { setEditingSkill(skill); setShowForm(true); setFormData(skill); }} className="btn-edit">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(skill.id)} className="btn-delete">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
