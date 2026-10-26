import React, { useState, useEffect } from 'react';
import './TechnicalSkills.css';

export default function ToolSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    proficiencyLevel: 'Beginner',
    yearsOfUse: '',
    description: '',
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/tool-skills', {
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
      const url = editingSkill ? `/tool-skills/${editingSkill.id}` : '/tool-skills';
      const method = editingSkill ? 'PUT' : 'POST';
      const submitData = { ...formData, yearsOfUse: formData.yearsOfUse ? parseInt(formData.yearsOfUse) : undefined };
      
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
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
    if (!window.confirm('Bạn có chắc chắn muốn xóa công cụ này?')) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await fetch(`/tool-skills/${id}`, {
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
    setFormData({ name: '', category: '', proficiencyLevel: 'Beginner', yearsOfUse: '', description: '' });
  };

  const getLevelColor = (level) => {
    const colors = { Beginner: '#f59e0b', Intermediate: '#3b82f6', Advanced: '#10b981', Expert: '#8b5cf6' };
    return colors[level] || '#6b7280';
  };

  return (
    <div className="technical-skills">
      <div className="skills-header">
        <h2>Công cụ & Phần mềm</h2>
        <button className="btn-primary" onClick={() => { setShowForm(true); resetForm(); }}>
          + Thêm công cụ
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="skill-form">
          <h3>{editingSkill ? 'Chỉnh sửa công cụ' : 'Thêm công cụ mới'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Tên công cụ *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Danh mục</label>
                <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Ví dụ: IDE, Database, DevOps" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Mức độ thành thạo</label>
                <select value={formData.proficiencyLevel} onChange={(e) => setFormData({ ...formData, proficiencyLevel: e.target.value })}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div className="form-group">
                <label>Số năm sử dụng</label>
                <input type="number" value={formData.yearsOfUse} onChange={(e) => setFormData({ ...formData, yearsOfUse: e.target.value })} min="0" />
              </div>
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
                <span className="skill-level" style={{ backgroundColor: getLevelColor(skill.proficiencyLevel) }}>{skill.proficiencyLevel}</span>
              </div>
              {skill.category && <p className="skill-category">{skill.category}</p>}
              {skill.yearsOfUse && <p className="skill-meta">{skill.yearsOfUse} năm sử dụng</p>}
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
