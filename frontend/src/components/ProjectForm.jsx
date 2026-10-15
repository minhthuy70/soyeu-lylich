import { useState, useEffect } from "react";

export default function ProjectForm({ project, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    role: "",
    startDate: "",
    endDate: "",
    technologies: "",
    githubUrl: "",
    demoUrl: "",
    status: "Planning",
    category: "",
    teamSize: "",
    highlights: "",
    challenges: "",
    solutions: "",
    impact: "",
    client: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        role: project.role || "",
        startDate: project.startDate ? project.startDate.split("T")[0] : "",
        endDate: project.endDate ? project.endDate.split("T")[0] : "",
        technologies: project.technologies ? project.technologies.join(", ") : "",
        githubUrl: project.githubUrl || "",
        demoUrl: project.demoUrl || "",
        status: project.status || "Planning",
        category: project.category || "",
        teamSize: project.teamSize || "",
        highlights: project.highlights ? project.highlights.join("\n") : "",
        challenges: project.challenges || "",
        solutions: project.solutions || "",
        impact: project.impact || "",
        client: project.client || "",
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tên dự án là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        ...formData,
        technologies: formData.technologies
          ? formData.technologies.split(",").map((t) => t.trim()).filter((t) => t)
          : [],
        highlights: formData.highlights
          ? formData.highlights.split("\n").map((h) => h.trim()).filter((h) => h)
          : [],
        teamSize: formData.teamSize ? parseInt(formData.teamSize) : null,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      };

      await onSubmit(submitData);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-form-container">
      <div className="form-header">
        <h2>{project ? "Chỉnh sửa dự án" : "Thêm dự án mới"}</h2>
        <button className="close-btn" onClick={onCancel}>
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="project-form">
        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Tên dự án *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              disabled={loading}
              placeholder="Nhập tên dự án"
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="role">Vai trò của bạn</label>
            <input
              id="role"
              name="role"
              type="text"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              placeholder="Ví dụ: Frontend Developer, Project Manager"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Mô tả dự án</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            placeholder="Mô tả chi tiết về dự án"
            rows={4}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Ngày bắt đầu</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">Ngày kết thúc</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Trạng thái</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="Planning">Đang lên kế hoạch</option>
              <option value="In Progress">Đang thực hiện</option>
              <option value="Completed">Đã hoàn thành</option>
              <option value="On Hold">Tạm dừng</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">Danh mục</label>
            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
              placeholder="Ví dụ: Web, Mobile, AI, etc."
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="technologies">Công nghệ sử dụng</label>
          <input
            id="technologies"
            name="technologies"
            type="text"
            value={formData.technologies}
            onChange={handleChange}
            disabled={loading}
            placeholder="Ngăn cách bằng dấu phẩy (ví dụ: React, Node.js, PostgreSQL)"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="githubUrl">GitHub URL</label>
            <input
              id="githubUrl"
              name="githubUrl"
              type="url"
              value={formData.githubUrl}
              onChange={handleChange}
              disabled={loading}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="demoUrl">Demo URL</label>
            <input
              id="demoUrl"
              name="demoUrl"
              type="url"
              value={formData.demoUrl}
              onChange={handleChange}
              disabled={loading}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="teamSize">Quy mô nhóm</label>
            <input
              id="teamSize"
              name="teamSize"
              type="number"
              min="1"
              value={formData.teamSize}
              onChange={handleChange}
              disabled={loading}
              placeholder="Số thành viên"
            />
          </div>

          <div className="form-group">
            <label htmlFor="client">Khách hàng / Công ty</label>
            <input
              id="client"
              name="client"
              type="text"
              value={formData.client}
              onChange={handleChange}
              disabled={loading}
              placeholder="Tên khách hàng hoặc công ty"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="highlights">Điểm nổi bật</label>
          <textarea
            id="highlights"
            name="highlights"
            value={formData.highlights}
            onChange={handleChange}
            disabled={loading}
            placeholder="Mỗi điểm nổi bật trên một dòng"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="challenges">Thách thức gặp phải</label>
          <textarea
            id="challenges"
            name="challenges"
            value={formData.challenges}
            onChange={handleChange}
            disabled={loading}
            placeholder="Mô tả các thách thức trong dự án"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="solutions">Giải pháp áp dụng</label>
          <textarea
            id="solutions"
            name="solutions"
            value={formData.solutions}
            onChange={handleChange}
            disabled={loading}
            placeholder="Mô tả cách bạn giải quyết các thách thức"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="impact">Tác động / Kết quả</label>
          <textarea
            id="impact"
            name="impact"
            value={formData.impact}
            onChange={handleChange}
            disabled={loading}
            placeholder="Mô tả kết quả và tác động của dự án"
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Hủy
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Đang lưu..." : project ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </form>
    </div>
  );
}
