import React, { useState, useEffect } from 'react';
import './TechnicalSkills.css';

export default function LanguageSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  const [formData, setFormData] = useState({
    language: '',
    proficiencyLevel: 'Basic',
    listeningLevel: 'Basic',
    speakingLevel: 'Basic',
    readingLevel: 'Basic',
    writingLevel: 'Basic',
    certificateScore: '',
    certificateInfo: '',
    cefrLevel: '',
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/language-skills', {
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
      const url = editingSkill ? `/language-skills/${editingSkill.id}` : '/language-skills';
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
    if (!window.confirm('Bạn có chắc chắn muốn xóa ngôn ngữ này?')) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await fetch(`/language-skills/${id}`, {
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
    setFormData({
      language: '',
      proficiencyLevel: 'Basic',
      listeningLevel: 'Basic',
      speakingLevel: 'Basic',
      readingLevel: 'Basic',
      writingLevel: 'Basic',
      certificateScore: '',
      certificateInfo: '',
      cefrLevel: '',
    });
  };

  return (
    <div className="technical-skills">
      <div className="skills-header">
        <h2>Ngoại ngữ</h2>
        <button className="btn-primary" onClick={() => { setShowForm(true); resetForm(); }}>
          + Thêm ngôn ngữ
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="skill-form">
          <h3>{editingSkill ? 'Chỉnh sửa ngôn ngữ' : 'Thêm ngôn ngữ mới'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Ngôn ngữ *</label>
              <input type="text" value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Trình độ tổng quát</label>
                <select value={formData.proficiencyLevel} onChange={(e) => setFormData({ ...formData, proficiencyLevel: e.target.value })}>
                  <option value="Basic">Basic</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Professional">Professional</option>
                  <option value="Native">Native</option>
                </select>
              </div>
              <div className="form-group">
                <label>Cấp CEFR</label>
                <select value={formData.cefrLevel} onChange={(e) => setFormData({ ...formData, cefrLevel: e.target.value })}>
                  <option value="">Chọn cấp</option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                  <option value="C2">C2</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Nghe</label>
                <select value={formData.listeningLevel} onChange={(e) => setFormData({ ...formData, listeningLevel: e.target.value })}>
                  <option value="Basic">Basic</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Native">Native</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nói</label>
                <select value={formData.speakingLevel} onChange={(e) => setFormData({ ...formData, speakingLevel: e.target.value })}>
                  <option value="Basic">Basic</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Native">Native</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Đọc</label>
                <select value={formData.readingLevel} onChange={(e) => setFormData({ ...formData, readingLevel: e.target.value })}>
                  <option value="Basic">Basic</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Native">Native</option>
                </select>
              </div>
              <div className="form-group">
                <label>Viết</label>
                <select value={formData.writingLevel} onChange={(e) => setFormData({ ...formData, writingLevel: e.target.value })}>
                  <option value="Basic">Basic</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Native">Native</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Điểm chứng chỉ</label>
                <input type="text" value={formData.certificateScore} onChange={(e) => setFormData({ ...formData, certificateScore: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Thông tin chứng chỉ</label>
                <input type="text" value={formData.certificateInfo} onChange={(e) => setFormData({ ...formData, certificateInfo: e.target.value })} />
              </div>
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
                <h3>{skill.language}</h3>
                {skill.cefrLevel && <span className="skill-level" style={{ backgroundColor: '#10b981' }}>{skill.cefrLevel}</span>}
              </div>
              <p className="skill-category">{skill.proficiencyLevel}</p>
              <div className="skill-details">
                <p><strong>Nghe:</strong> {skill.listeningLevel}</p>
                <p><strong>Nói:</strong> {skill.speakingLevel}</p>
                <p><strong>Đọc:</strong> {skill.readingLevel}</p>
                <p><strong>Viết:</strong> {skill.writingLevel}</p>
              </div>
              {skill.certificateScore && <p className="skill-meta">Điểm: {skill.certificateScore}</p>}
              {skill.certificateInfo && <p className="skill-description">{skill.certificateInfo}</p>}
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
