import React, { useState, useEffect } from 'react';
import './Dashboard.css';

export function Dashboard({ userId }) {
  const [overview, setOverview] = useState(null);
  const [activityFeed, setActivityFeed] = useState([]);
  const [completionScore, setCompletionScore] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [upcomingExpiry, setUpcomingExpiry] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');

      const [overviewRes, activityRes, scoreRes, suggestionsRes, expiryRes] = await Promise.all([
        fetch(`/dashboard/overview/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/dashboard/activity/${userId}?limit=10`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/dashboard/score/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/dashboard/suggestions/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/dashboard/certificate-expiry/${userId}?days=30`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const overviewData = await overviewRes.json();
      const activityData = await activityRes.json();
      const scoreData = await scoreRes.json();
      const suggestionsData = await suggestionsRes.json();
      const expiryData = await expiryRes.json();

      setOverview(overviewData);
      setActivityFeed(activityData.activities || []);
      setCompletionScore(scoreData);
      setSuggestions(suggestionsData.suggestions || []);
      setUpcomingExpiry(expiryData.certificates || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Đang tải dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Tổng quan hồ sơ của bạn</p>
      </div>

      {overview && (
        <div className="dashboard-overview">
          <div className="overview-card completion">
            <div className="overview-icon">📊</div>
            <div className="overview-content">
              <div className="overview-label">Độ hoàn thiện</div>
              <div className="overview-value">{overview.completionPercentage}%</div>
              <div className="overview-level">{overview.completionLevel}</div>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon">🎓</div>
            <div className="overview-content">
              <div className="overview-label">Học vấn</div>
              <div className="overview-value">{overview.educationCount}</div>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon">💼</div>
            <div className="overview-content">
              <div className="overview-label">Kinh nghiệm</div>
              <div className="overview-value">{overview.experienceCount}</div>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon">📁</div>
            <div className="overview-content">
              <div className="overview-label">Dự án</div>
              <div className="overview-value">{overview.projectCount}</div>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon">⚡</div>
            <div className="overview-content">
              <div className="overview-label">Kỹ năng</div>
              <div className="overview-value">{overview.skillCount}</div>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon">📜</div>
            <div className="overview-content">
              <div className="overview-label">Chứng chỉ</div>
              <div className="overview-value">{overview.certificateCount}</div>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>Hoạt động gần đây</h2>
          {activityFeed.length > 0 ? (
            <div className="activity-feed">
              {activityFeed.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">📌</div>
                  <div className="activity-content">
                    <div className="activity-title">{activity.title}</div>
                    <div className="activity-time">
                      {new Date(activity.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">Chưa có hoạt động nào</div>
          )}
        </div>

        <div className="dashboard-section">
          <h2>Gợi ý hoàn thiện</h2>
          {suggestions.length > 0 ? (
            <div className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <div key={index} className={`suggestion-item priority-${suggestion.priority}`}>
                  <div className="suggestion-icon">
                    {suggestion.priority === 'high' ? '🔴' : suggestion.priority === 'medium' ? '🟡' : '🟢'}
                  </div>
                  <div className="suggestion-content">
                    <div className="suggestion-message">{suggestion.message}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">Hồ sơ của bạn đã hoàn thiện!</div>
          )}
        </div>

        <div className="dashboard-section">
          <h2>Chứng chỉ sắp hết hạn</h2>
          {upcomingExpiry.length > 0 ? (
            <div className="expiry-list">
              {upcomingExpiry.map((cert) => (
                <div key={cert.id} className="expiry-item">
                  <div className="expiry-icon">⚠️</div>
                  <div className="expiry-content">
                    <div className="expiry-name">{cert.name}</div>
                    <div className="expiry-date">
                      Hết hạn: {new Date(cert.expiryDate).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">Không có chứng chỉ sắp hết hạn</div>
          )}
        </div>

        {completionScore && (
          <div className="dashboard-section">
            <h2>Điểm hoàn thiện</h2>
            <div className="score-display">
              <div className="score-circle">
                <div className="score-value">{completionScore.score}</div>
                <div className="score-max">/ {completionScore.maxScore}</div>
              </div>
              <div className="score-level">{completionScore.level}</div>
              <div className="score-percentage">{completionScore.percentage}%</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
