import React, { useState, useEffect } from 'react';
import './ResumeBuilder.css';

export function ResumeBuilder({ userId }) {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [viewMode, setViewMode] = useState('desktop'); // desktop, mobile, print
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResumes();
    loadTemplates();
  }, [userId]);

  const loadResumes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/resumes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setResumes(data || []);
      if (data && data.length > 0) {
        setSelectedResume(data[0]);
      }
    } catch (error) {
      console.error('Failed to load resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/resume-templates/public', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTemplates(data || []);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const handleCreateResume = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: 'New Resume',
          isDefault: false,
        }),
      });
      const newResume = await response.json();
      setResumes([...resumes, newResume]);
      setSelectedResume(newResume);
    } catch (error) {
      console.error('Failed to create resume:', error);
    }
  };

  const handleDuplicateResume = async (resumeId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/resumes/${resumeId}/duplicate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const duplicatedResume = await response.json();
      setResumes([...resumes, duplicatedResume]);
    } catch (error) {
      console.error('Failed to duplicate resume:', error);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`/resumes/${resumeId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumes(resumes.filter((r) => r.id !== resumeId));
      if (selectedResume?.id === resumeId) {
        setSelectedResume(resumes[0] || null);
      }
    } catch (error) {
      console.error('Failed to delete resume:', error);
    }
  };

  const handleSetDefault = async (resumeId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/resumes/${resumeId}/set-default`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumes(
        resumes.map((r) => ({
          ...r,
          isDefault: r.id === resumeId,
        })),
      );
    } catch (error) {
      console.error('Failed to set default resume:', error);
    }
  };

  const handleSelectTemplate = async (templateId) => {
    if (!selectedResume) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`/resumes/${selectedResume.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ templateId }),
      });
      setSelectedResume({ ...selectedResume, templateId });
    } catch (error) {
      console.error('Failed to select template:', error);
    }
  };

  if (loading) {
    return <div className="resume-builder-loading">Loading resume builder...</div>;
  }

  return (
    <div className="resume-builder">
      <div className="resume-builder-header">
        <h1>Resume Builder</h1>
        <button className="btn btn-primary" onClick={handleCreateResume}>
          + New Resume
        </button>
      </div>

      <div className="resume-builder-layout">
        <div className="resume-sidebar">
          <h3>My Resumes</h3>
          <div className="resume-list">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className={`resume-item ${selectedResume?.id === resume.id ? 'active' : ''}`}
                onClick={() => setSelectedResume(resume)}
              >
                <div className="resume-item-title">{resume.title}</div>
                <div className="resume-item-actions">
                  {resume.isDefault && <span className="badge badge-default">Default</span>}
                  <button
                    className="btn-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateResume(resume.id);
                    }}
                  >
                    📋
                  </button>
                  <button
                    className="btn-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetDefault(resume.id);
                    }}
                  >
                    ⭐
                  </button>
                  <button
                    className="btn-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteResume(resume.id);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3>Templates</h3>
          <div className="template-list">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`template-item ${selectedResume?.templateId === template.id ? 'active' : ''}`}
                onClick={() => handleSelectTemplate(template.id)}
              >
                <div className="template-preview">
                  <div className="template-icon">📄</div>
                  <div className="template-info">
                    <div className="template-name">{template.name}</div>
                    <div className="template-category">{template.category}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="resume-main">
          {selectedResume ? (
            <>
              <div className="resume-toolbar">
                <div className="view-mode-selector">
                  <button
                    className={`view-mode-btn ${viewMode === 'desktop' ? 'active' : ''}`}
                    onClick={() => setViewMode('desktop')}
                  >
                    Desktop
                  </button>
                  <button
                    className={`view-mode-btn ${viewMode === 'mobile' ? 'active' : ''}`}
                    onClick={() => setViewMode('mobile')}
                  >
                    Mobile
                  </button>
                  <button
                    className={`view-mode-btn ${viewMode === 'print' ? 'active' : ''}`}
                    onClick={() => setViewMode('print')}
                  >
                    Print
                  </button>
                </div>
                <div className="resume-actions">
                  <button className="btn btn-secondary">Auto-save: On</button>
                  <button className="btn btn-primary">Export PDF</button>
                </div>
              </div>

              <div className={`resume-preview resume-preview-${viewMode}`}>
                <div className="resume-paper">
                  <div className="resume-header">
                    <h2>Your Name</h2>
                    <p>Professional Title</p>
                  </div>
                  <div className="resume-section">
                    <h3>Experience</h3>
                    <p>Work experience will appear here...</p>
                  </div>
                  <div className="resume-section">
                    <h3>Education</h3>
                    <p>Education details will appear here...</p>
                  </div>
                  <div className="resume-section">
                    <h3>Skills</h3>
                    <p>Skills will appear here...</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <h3>No resume selected</h3>
              <p>Create a new resume or select one from the sidebar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
