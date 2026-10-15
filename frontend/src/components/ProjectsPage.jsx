import { useState, useEffect } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} from "../services/projectService";
import ProjectForm from "./ProjectForm";
import ProjectGallery from "./ProjectGallery";

export default function ProjectsPage({ onBack }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showGallery, setShowGallery] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProjects();
      setProjects(data.projects || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");

      if (editingProject) {
        await updateProject(editingProject.id, data);
      } else {
        await createProject(data);
      }

      setShowForm(false);
      setEditingProject(null);
      await loadProjects();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa dự án này? Hành động này không thể hoàn tác.")) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await deleteProject(projectId);
      await loadProjects();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExpand = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const handleOpenGallery = (projectId) => {
    setShowGallery(projectId);
  };

  const getStatusColor = (status) => {
    const colors = {
      "Planning": "#f59e0b",
      "In Progress": "#3b82f6",
      "Completed": "#10b981",
      "On Hold": "#6b7280",
      "Cancelled": "#ef4444",
    };
    return colors[status] || "#6b7280";
  };

  const getStatusLabel = (status) => {
    const labels = {
      "Planning": "Đang lên kế hoạch",
      "In Progress": "Đang thực hiện",
      "Completed": "Đã hoàn thành",
      "On Hold": "Tạm dừng",
      "Cancelled": "Đã hủy",
    };
    return labels[status] || status;
  };

  return (
    <div className="projects-page">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>
          ← Quay lại
        </button>
        <h1>Dự án của tôi</h1>
        <button className="btn-primary" onClick={handleAddProject}>
          + Thêm dự án mới
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && !showForm && !showGallery && (
        <div className="loading-state">Đang tải...</div>
      )}

      {!loading && projects.length === 0 && !showForm && !showGallery && (
        <div className="empty-state">
          <h2>Chưa có dự án nào</h2>
          <p>Bắt đầu bằng cách thêm dự án đầu tiên của bạn</p>
          <button className="btn-primary" onClick={handleAddProject}>
            + Thêm dự án
          </button>
        </div>
      )}

      {!showForm && !showGallery && projects.length > 0 && (
        <div className="projects-list">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`project-card ${expandedProject === project.id ? "expanded" : ""}`}
            >
              <div className="project-header" onClick={() => handleToggleExpand(project.id)}>
                <div className="project-title-section">
                  <h3>{project.title}</h3>
                  {project.role && <span className="project-role">{project.role}</span>}
                </div>
                <div className="project-status">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(project.status) }}
                  >
                    {getStatusLabel(project.status)}
                  </span>
                  <span className="expand-icon">
                    {expandedProject === project.id ? "▼" : "▶"}
                  </span>
                </div>
              </div>

              {expandedProject === project.id && (
                <div className="project-details">
                  {project.description && (
                    <div className="detail-section">
                      <h4>Mô tả</h4>
                      <p>{project.description}</p>
                    </div>
                  )}

                  {(project.startDate || project.endDate) && (
                    <div className="detail-section">
                      <h4>Thời gian</h4>
                      <p>
                        {project.startDate && new Date(project.startDate).toLocaleDateString("vi-VN")}
                        {project.startDate && project.endDate && " - "}
                        {project.endDate && new Date(project.endDate).toLocaleDateString("vi-VN")}
                        {!project.endDate && " (Đang thực hiện)"}
                      </p>
                    </div>
                  )}

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="detail-section">
                      <h4>Công nghệ</h4>
                      <div className="tech-tags">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.githubUrl && (
                    <div className="detail-section">
                      <h4>GitHub</h4>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-btn"
                      >
                        {project.githubUrl}
                      </a>
                    </div>
                  )}

                  {project.demoUrl && (
                    <div className="detail-section">
                      <h4>Demo</h4>
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-btn"
                      >
                        {project.demoUrl}
                      </a>
                    </div>
                  )}

                  {project.highlights && project.highlights.length > 0 && (
                    <div className="detail-section">
                      <h4>Điểm nổi bật</h4>
                      <ul>
                        {project.highlights.map((highlight, index) => (
                          <li key={index}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.challenges && (
                    <div className="detail-section">
                      <h4>Thách thức</h4>
                      <p>{project.challenges}</p>
                    </div>
                  )}

                  {project.solutions && (
                    <div className="detail-section">
                      <h4>Giải pháp</h4>
                      <p>{project.solutions}</p>
                    </div>
                  )}

                  {project.impact && (
                    <div className="detail-section">
                      <h4>Tác động</h4>
                      <p>{project.impact}</p>
                    </div>
                  )}

                  <div className="project-actions">
                    <button
                      className="btn-secondary"
                      onClick={() => handleOpenGallery(project.id)}
                    >
                      🖼️ Quản lý ảnh ({project.projectImages?.length || 0})
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => handleEditProject(project)}
                    >
                      ✏️ Chỉnh sửa
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ProjectForm
          project={editingProject}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingProject(null);
          }}
        />
      )}

      {showGallery && (
        <ProjectGallery
          projectId={showGallery}
          onClose={() => setShowGallery(null)}
        />
      )}
    </div>
  );
}
