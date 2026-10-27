import React, { useState, useEffect } from 'react';
import './Education.css';

const Education = ({ onClose }) => {
  const [educations, setEducations] = useState([]);
  const [currentStudies, setCurrentStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    schoolName: '',
    major: '',
    degree: '',
    startDate: '',
    endDate: '',
    currentStudyStatus: 'Đã tốt nghiệp',
    gpa: '',
    academicAchievements: '',
    description: '',
    thesisTopic: '',
    relevantCoursework: '',
    studyAbroad: '',
  });

  const token = localStorage.getItem('token');
  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    fetchEducations();
    fetchCurrentStudies();
  }, []);

  const fetchEducations = async () => {
    try {
      const response = await fetch(`${API_URL}/educations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setEducations(data.educations || []);
    } catch {
      setError('Failed to fetch educations');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentStudies = async () => {
    try {
      const response = await fetch(`${API_URL}/educations/current`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCurrentStudies(data.currentStudies || []);
    } catch {
      console.error('Failed to fetch current studies');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        academicAchievements: formData.academicAchievements
          .split(',')
          .map((a) => a.trim())
          .filter((a) => a),
        relevantCoursework: formData.relevantCoursework
          .split(',')
          .map((c) => c.trim())
          .filter((c) => c),
      };

      const url = editingId ? `${API_URL}/educations/${editingId}` : `${API_URL}/educations`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setFormData({
          schoolName: '',
          major: '',
          degree: '',
          startDate: '',
          endDate: '',
          currentStudyStatus: 'Đã tốt nghiệp',
          gpa: '',
          academicAchievements: '',
          description: '',
          thesisTopic: '',
          relevantCoursework: '',
          studyAbroad: '',
        });
        setShowForm(false);
        setEditingId(null);
        fetchEducations();
        fetchCurrentStudies();
      }
    } catch {
      setError('Failed to save education');
    }
  };

  const handleEdit = (edu) => {
    setFormData({
      schoolName: edu.schoolName,
      major: edu.major || '',
      degree: edu.degree || '',
      startDate: edu.startDate ? edu.startDate.split('T')[0] : '',
      endDate: edu.endDate ? edu.endDate.split('T')[0] : '',
      currentStudyStatus: edu.currentStudyStatus || 'Đã tốt nghiệp',
      gpa: edu.gpa || '',
      academicAchievements: edu.academicAchievements ? edu.academicAchievements.join(', ') : '',
      description: edu.description || '',
      thesisTopic: edu.thesisTopic || '',
      relevantCoursework: edu.relevantCoursework ? edu.relevantCoursework.join(', ') : '',
      studyAbroad: edu.studyAbroad || '',
    });
    setEditingId(edu.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this education?')) return;

    try {
      const response = await fetch(`${API_URL}/educations/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchEducations();
        fetchCurrentStudies();
      }
    } catch {
      setError('Failed to delete education');
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
    <div className="education-container">
      <div className="education-header">
        <h2>Education</h2>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {!showForm ? (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Education</h3>
              <p className="stat-value">{educations.length}</p>
            </div>
            <div className="stat-card">
              <h3>Currently Studying</h3>
              <p className="stat-value">{currentStudies.length}</p>
            </div>
          </div>

          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Add Education
          </button>

          <div className="education-list">
            {educations.map((edu) => (
              <div key={edu.id} className="education-card">
                <div className="education-main">
                  <h3>{edu.schoolName}</h3>
                  {edu.degree && <p className="degree">{edu.degree}</p>}
                  {edu.major && <p className="major">{edu.major}</p>}
                  <p className="date-range">
                    {edu.startDate ? new Date(edu.startDate).toLocaleDateString() : 'Start Date'} -{' '}
                    {edu.currentStudyStatus === 'Đang học'
                      ? 'Present'
                      : edu.endDate
                      ? new Date(edu.endDate).toLocaleDateString()
                      : 'End Date'}
                  </p>
                  {edu.currentStudyStatus === 'Đang học' && <span className="current-badge">Current</span>}
                  {edu.gpa && <p className="gpa">GPA: {edu.gpa}</p>}
                </div>

                {edu.description && (
                  <div className="education-details">
                    <h4>Description</h4>
                    <p>{edu.description}</p>
                  </div>
                )}

                {edu.thesisTopic && (
                  <div className="education-details">
                    <h4>Thesis / Graduation Topic</h4>
                    <p>{edu.thesisTopic}</p>
                  </div>
                )}

                {edu.academicAchievements && edu.academicAchievements.length > 0 && (
                  <div className="education-details">
                    <h4>Academic Achievements</h4>
                    <ul>
                      {edu.academicAchievements.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                  <div className="education-details">
                    <h4>Relevant Coursework</h4>
                    <div className="coursework-tags">
                      {edu.relevantCoursework.map((c, i) => (
                        <span key={i} className="coursework-tag">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {edu.studyAbroad && (
                  <div className="education-details">
                    <h4>Study Abroad</h4>
                    <p>{edu.studyAbroad}</p>
                  </div>
                )}

                <div className="education-actions">
                  <button className="edit-btn" onClick={() => handleEdit(edu)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(edu.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <form className="education-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Education' : 'Add New Education'}</h3>

          <div className="form-group">
            <label>School Name *</label>
            <input type="text" name="schoolName" value={formData.schoolName} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Degree</label>
              <input type="text" name="degree" value={formData.degree} onChange={handleChange} placeholder="Bachelor's, Master's, PhD" />
            </div>
            <div className="form-group">
              <label>Major</label>
              <input type="text" name="major" value={formData.major} onChange={handleChange} placeholder="Computer Science" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={formData.currentStudyStatus === 'Đang học'}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Study Status</label>
            <select name="currentStudyStatus" value={formData.currentStudyStatus} onChange={handleChange}>
              <option value="Đang học">Currently Studying</option>
              <option value="Đã tốt nghiệp">Graduated</option>
              <option value="Đã bỏ học">Dropped Out</option>
            </select>
          </div>

          <div className="form-group">
            <label>GPA</label>
            <input type="text" name="gpa" value={formData.gpa} onChange={handleChange} placeholder="3.5/4.0 or 8.5/10" />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Describe your education experience"
            />
          </div>

          <div className="form-group">
            <label>Thesis / Graduation Topic</label>
            <input
              type="text"
              name="thesisTopic"
              value={formData.thesisTopic}
              onChange={handleChange}
              placeholder="Title of your thesis or graduation project"
            />
          </div>

          <div className="form-group">
            <label>Academic Achievements (comma-separated)</label>
            <textarea
              name="academicAchievements"
              value={formData.academicAchievements}
              onChange={handleChange}
              rows="3"
              placeholder="Dean's List, Scholarship, Award"
            />
          </div>

          <div className="form-group">
            <label>Relevant Coursework (comma-separated)</label>
            <input
              type="text"
              name="relevantCoursework"
              value={formData.relevantCoursework}
              onChange={handleChange}
              placeholder="Data Structures, Algorithms, Database Systems"
            />
          </div>

          <div className="form-group">
            <label>Study Abroad Experience</label>
            <textarea
              name="studyAbroad"
              value={formData.studyAbroad}
              onChange={handleChange}
              rows="2"
              placeholder="Exchange program, study abroad semester, etc."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {editingId ? 'Update' : 'Add'} Education
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Education;
