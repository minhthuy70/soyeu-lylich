import { useState, useEffect } from "react";
import {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "../services/achievementService";
import AchievementForm from "./AchievementForm";

export default function AchievementsPage({ onBack, onClose }) {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");

  useEffect(() => {
    loadAchievements();
  }, [filterCategory, filterLevel]);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      setError("");
      
      const category = filterCategory === "all" ? null : filterCategory;
      const level = filterLevel === "all" ? null : filterLevel;
      
      const data = await getAchievements(category, level);
      setAchievements(data.achievements || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAchievement = () => {
    setEditingAchievement(null);
    setShowForm(true);
  };

  const handleEditAchievement = (achievement) => {
    setEditingAchievement(achievement);
    setShowForm(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");

      if (editingAchievement) {
        await updateAchievement(editingAchievement.id, data);
      } else {
        await createAchievement(data);
      }

      setShowForm(false);
      setEditingAchievement(null);
      await loadAchievements();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAchievement = async (achievementId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thành tích này?")) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await deleteAchievement(achievementId);
      await loadAchievements();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Academic": "#3b82f6",
      "Professional": "#10b981",
      "Sports": "#f59e0b",
      "Arts": "#ec4899",
      "Other": "#6b7280",
    };
    return colors[category] || "#6b7280";
  };

  const getCategoryLabel = (category) => {
    const labels = {
      "Academic": "Học thuật",
      "Professional": "Nghề nghiệp",
      "Sports": "Thể thao",
      "Arts": "Nghệ thuật",
      "Other": "Khác",
    };
    return labels[category] || category;
  };

  const getLevelColor = (level) => {
    const colors = {
      "School": "#9ca3af",
      "District": "#60a5fa",
      "Provincial": "#3b82f6",
      "National": "#8b5cf6",
      "International": "#f59e0b",
    };
    return colors[level] || "#6b7280";
  };

  const getLevelLabel = (level) => {
    const labels = {
      "School": "Cấp trường",
      "District": "Cấp quận/huyện",
      "Provincial": "Cấp tỉnh/thành phố",
      "National": "Cấp quốc gia",
      "International": "Quốc tế",
    };
    return labels[level] || level;
  };

  const filteredAchievements = achievements;

  return (
    <div className="achievements-page">
      <div className="page-header">
        <button className="back-btn" onClick={onClose || onBack}>
          ← Quay lại
        </button>
        <h1>Thành tích của tôi</h1>
        <button className="btn-primary" onClick={handleAddAchievement}>
          + Thêm thành tích
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="categoryFilter">Phân loại:</label>
          <select
            id="categoryFilter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="Academic">Học thuật</option>
            <option value="Professional">Nghề nghiệp</option>
            <option value="Sports">Thể thao</option>
            <option value="Arts">Nghệ thuật</option>
            <option value="Other">Khác</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="levelFilter">Cấp độ:</label>
          <select
            id="levelFilter"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="School">Cấp trường</option>
            <option value="District">Cấp quận/huyện</option>
            <option value="Provincial">Cấp tỉnh/thành phố</option>
            <option value="National">Cấp quốc gia</option>
            <option value="International">Quốc tế</option>
          </select>
        </div>
      </div>

      {loading && !showForm && (
        <div className="loading-state">Đang tải...</div>
      )}

      {!loading && filteredAchievements.length === 0 && !showForm && (
        <div className="empty-state">
          <h2>Chưa có thành tích nào</h2>
          <p>Bắt đầu bằng cách thêm thành tích đầu tiên của bạn</p>
          <button className="btn-primary" onClick={handleAddAchievement}>
            + Thêm thành tích
          </button>
        </div>
      )}

      {!showForm && filteredAchievements.length > 0 && (
        <div className="achievements-grid">
          {filteredAchievements.map((achievement) => (
            <div key={achievement.id} className="achievement-card">
              {achievement.imageUrl && (
                <div className="achievement-image">
                  <img src={achievement.imageUrl} alt={achievement.title} />
                </div>
              )}

              <div className="achievement-content">
                <div className="achievement-header">
                  <h3>{achievement.title}</h3>
                  <div className="achievement-badges">
                    <span
                      className="category-badge"
                      style={{ backgroundColor: getCategoryColor(achievement.category) }}
                    >
                      {getCategoryLabel(achievement.category)}
                    </span>
                    <span
                      className="level-badge"
                      style={{ backgroundColor: getLevelColor(achievement.level) }}
                    >
                      {getLevelLabel(achievement.level)}
                    </span>
                  </div>
                </div>

                {achievement.organization && (
                  <div className="achievement-organization">
                    <span className="icon">🏢</span>
                    {achievement.organization}
                  </div>
                )}

                {achievement.achievementDate && (
                  <div className="achievement-date">
                    <span className="icon">📅</span>
                    {new Date(achievement.achievementDate).toLocaleDateString("vi-VN")}
                  </div>
                )}

                {achievement.description && (
                  <div className="achievement-description">
                    {achievement.description}
                  </div>
                )}

                <div className="achievement-actions">
                  {achievement.evidenceUrl && (
                    <a
                      href={achievement.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="evidence-link"
                    >
                      📄 Xem minh chứng
                    </a>
                  )}
                  <button
                    className="action-btn edit"
                    onClick={() => handleEditAchievement(achievement)}
                  >
                    ✏️ Chỉnh sửa
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDeleteAchievement(achievement.id)}
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <AchievementForm
          achievement={editingAchievement}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingAchievement(null);
          }}
        />
      )}
    </div>
  );
}
