import { useState, useEffect } from "react";

export default function AchievementForm({ achievement, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    achievementDate: "",
    description: "",
    evidenceUrl: "",
    imageUrl: "",
    category: "Other",
    level: "School",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (achievement) {
      setFormData({
        title: achievement.title || "",
        organization: achievement.organization || "",
        achievementDate: achievement.achievementDate 
          ? achievement.achievementDate.split("T")[0] 
          : "",
        description: achievement.description || "",
        evidenceUrl: achievement.evidenceUrl || "",
        imageUrl: achievement.imageUrl || "",
        category: achievement.category || "Other",
        level: achievement.level || "School",
      });
    }
  }, [achievement]);

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
      newErrors.title = "Tên thành tích là bắt buộc";
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
        achievementDate: formData.achievementDate || null,
      };

      await onSubmit(submitData);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="achievement-form-container">
      <div className="form-header">
        <h2>{achievement ? "Chỉnh sửa thành tích" : "Thêm thành tích mới"}</h2>
        <button className="close-btn" onClick={onCancel}>
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="achievement-form">
        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}

        <div className="form-group">
          <label htmlFor="title">Tên thành tích *</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            disabled={loading}
            placeholder="Nhập tên thành tích"
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="organization">Tổ chức / Đơn vị</label>
          <input
            id="organization"
            name="organization"
            type="text"
            value={formData.organization}
            onChange={handleChange}
            disabled={loading}
            placeholder="Tên tổ chức hoặc đơn vị cấp"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="achievementDate">Ngày đạt được</label>
            <input
              id="achievementDate"
              name="achievementDate"
              type="date"
              value={formData.achievementDate}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Phân loại</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="Academic">Học thuật</option>
              <option value="Professional">Nghề nghiệp</option>
              <option value="Sports">Thể thao</option>
              <option value="Arts">Nghệ thuật</option>
              <option value="Other">Khác</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="level">Cấp độ</label>
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="School">Cấp trường</option>
            <option value="District">Cấp quận/huyện</option>
            <option value="Provincial">Cấp tỉnh/thành phố</option>
            <option value="National">Cấp quốc gia</option>
            <option value="International">Quốc tế</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Mô tả</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            placeholder="Mô tả chi tiết về thành tích"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">URL ảnh minh chứng</label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={handleChange}
            disabled={loading}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="form-group">
          <label htmlFor="evidenceUrl">URL minh chứng / Bằng chứng</label>
          <input
            id="evidenceUrl"
            name="evidenceUrl"
            type="url"
            value={formData.evidenceUrl}
            onChange={handleChange}
            disabled={loading}
            placeholder="https://example.com/certificate.pdf"
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
            {loading ? "Đang lưu..." : achievement ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </form>
    </div>
  );
}
