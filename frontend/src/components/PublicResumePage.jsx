import React, { useState, useEffect } from 'react';
import './PublicResumePage.css';

export function PublicResumePage({ slug }) {
  const [resume, setResume] = useState(null);
  const [password, setPassword] = useState('');
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResume();
  }, [slug]);

  const loadResume = async (pwd = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/resume-export/public/${slug}${pwd ? `?password=${encodeURIComponent(pwd)}` : ''}`);
      const data = await response.json();

      if (data.requiresPassword) {
        setRequiresPassword(true);
        setLoading(false);
        return;
      }

      if (response.ok) {
        setResume(data);
        setRequiresPassword(false);
      } else {
        setError(data.message || 'Failed to load resume');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    loadResume(password);
  };

  if (loading) {
    return (
      <div className="public-resume-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-resume-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (requiresPassword) {
    return (
      <div className="public-resume-container">
        <div className="password-protected">
          <h2>Password Protected Resume</h2>
          <p>This resume is password protected. Please enter the password to view it.</p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="password-input"
            />
            <button type="submit" className="btn btn-primary">
              View Resume
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="public-resume-container">
        <div className="error-message">Resume not found</div>
      </div>
    );
  }

  return (
    <div className="public-resume-container">
      <div className="public-resume-header">
        <h1>{resume.title}</h1>
        {resume.user?.profile?.fullName && (
          <p className="resume-author">By {resume.user.profile.fullName}</p>
        )}
      </div>

      <div className="public-resume-content">
        {/* Profile Information */}
        {resume.user?.profile && (
          <section className="resume-section">
            <h2>Personal Information</h2>
            <div className="profile-info">
              {resume.user.profile.fullName && (
                <div className="info-item">
                  <label>Name:</label>
                  <span>{resume.user.profile.fullName}</span>
                </div>
              )}
              {resume.user.profile.email && (
                <div className="info-item">
                  <label>Email:</label>
                  <span>{resume.user.profile.email}</span>
                </div>
              )}
              {resume.user.profile.phoneNumber && (
                <div className="info-item">
                  <label>Phone:</label>
                  <span>{resume.user.profile.phoneNumber}</span>
                </div>
              )}
              {resume.user.profile.currentAddress && (
                <div className="info-item">
                  <label>Address:</label>
                  <span>{resume.user.profile.currentAddress}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Experience */}
        {resume.experiences && resume.experiences.length > 0 && (
          <section className="resume-section">
            <h2>Work Experience</h2>
            {resume.experiences.map((exp) => (
              <div key={exp.id} className="experience-item">
                <h3>{exp.position} at {exp.companyName}</h3>
                <p className="period">
                  {exp.startDate && new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                </p>
                {exp.jobDescription && <p className="description">{exp.jobDescription}</p>}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul>
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {resume.educations && resume.educations.length > 0 && (
          <section className="resume-section">
            <h2>Education</h2>
            {resume.educations.map((edu) => (
              <div key={edu.id} className="education-item">
                <h3>{edu.schoolName}</h3>
                <p className="degree">{edu.degree} in {edu.major}</p>
                <p className="period">
                  {edu.startDate && new Date(edu.startDate).toLocaleDateString()} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                </p>
                {edu.gpa && <p className="gpa">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <section className="resume-section">
            <h2>Skills</h2>
            <div className="skills-grid">
              {resume.skills.map((skill) => (
                <div key={skill.id} className="skill-item">
                  <span className="skill-name">{skill.name}</span>
                  {skill.level && <span className="skill-level">{skill.level}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <section className="resume-section">
            <h2>Projects</h2>
            {resume.projects.map((project) => (
              <div key={project.id} className="project-item">
                <h3>{project.title}</h3>
                {project.description && <p className="description">{project.description}</p>}
                {project.role && <p className="role">Role: {project.role}</p>}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="technologies">
                    <strong>Technologies:</strong>
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                    View on GitHub
                  </a>
                )}
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                    Live Demo
                  </a>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Certificates */}
        {resume.certificates && resume.certificates.length > 0 && (
          <section className="resume-section">
            <h2>Certificates</h2>
            {resume.certificates.map((cert) => (
              <div key={cert.id} className="certificate-item">
                <h3>{cert.name}</h3>
                <p className="issuer">{cert.issuingOrganization}</p>
                <p className="date">
                  {cert.issueDate && new Date(cert.issueDate).toLocaleDateString()}
                  {cert.expiryDate && ` - ${new Date(cert.expiryDate).toLocaleDateString()}`}
                </p>
                {cert.certificateUrl && (
                  <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer" className="certificate-link">
                    View Certificate
                  </a>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Achievements */}
        {resume.achievements && resume.achievements.length > 0 && (
          <section className="resume-section">
            <h2>Achievements</h2>
            {resume.achievements.map((achievement) => (
              <div key={achievement.id} className="achievement-item">
                <h3>{achievement.title}</h3>
                {achievement.organization && <p className="organization">{achievement.organization}</p>}
                {achievement.achievementDate && (
                  <p className="date">{new Date(achievement.achievementDate).toLocaleDateString()}</p>
                )}
                {achievement.description && <p className="description">{achievement.description}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Publications */}
        {resume.publications && resume.publications.length > 0 && (
          <section className="resume-section">
            <h2>Publications</h2>
            {resume.publications.map((pub) => (
              <div key={pub.id} className="publication-item">
                <h3>{pub.title}</h3>
                {pub.journal && <p className="journal">{pub.journal}</p>}
                {pub.conference && <p className="conference">{pub.conference}</p>}
                {pub.publicationDate && (
                  <p className="date">{new Date(pub.publicationDate).toLocaleDateString()}</p>
                )}
                {pub.url && (
                  <a href={pub.url} target="_blank" rel="noopener noreferrer" className="publication-link">
                    Read More
                  </a>
                )}
              </div>
            ))}
          </section>
        )}
      </div>

      <div className="public-resume-footer">
        <p>Powered by SoYeuLyLich</p>
      </div>
    </div>
  );
}
