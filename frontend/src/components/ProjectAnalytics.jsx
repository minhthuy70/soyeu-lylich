import React, { useState, useEffect } from 'react';
import './ProjectAnalytics.css';

export default function ProjectAnalytics({ projectId, onClose }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    loadAnalytics();
  }, [projectId, period]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const url = projectId
        ? `/project-analytics?projectId=${projectId}&period=${period}`
        : `/project-analytics?period=${period}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-analytics-container">
      <div className="analytics-header">
        <h2>Phân tích dự án</h2>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="period-selector">
        <label>Chọn khoảng thời gian:</label>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="week">Tuần</option>
          <option value="month">Tháng</option>
          <option value="year">Năm</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && <div className="loading-state">Đang tải...</div>}

      {!loading && analytics && (
        <div className="analytics-content">
          <div className="analytics-overview">
            <div className="analytics-card">
              <h3>Tổng lượt xem</h3>
              <p className="analytics-value">{analytics.totalViews}</p>
            </div>
            <div className="analytics-card">
              <h3>Khách truy cập duy nhất</h3>
              <p className="analytics-value">{analytics.uniqueVisitors}</p>
            </div>
            <div className="analytics-card">
              <h3>Tổng lượt click</h3>
              <p className="analytics-value">{analytics.totalClicks}</p>
            </div>
          </div>

          {analytics.clickBreakdown && Object.keys(analytics.clickBreakdown).length > 0 && (
            <div className="analytics-section">
              <h3>Phân loại click</h3>
              <div className="click-breakdown">
                {Object.entries(analytics.clickBreakdown).map(([type, count]) => (
                  <div key={type} className="click-item">
                    <span className="click-type">{type}</span>
                    <span className="click-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analytics.mostViewedProjects && analytics.mostViewedProjects.length > 0 && (
            <div className="analytics-section">
              <h3>Dự án được xem nhiều nhất</h3>
              <div className="most-viewed-list">
                {analytics.mostViewedProjects.map((project) => (
                  <div key={project.id} className="most-viewed-item">
                    <span className="project-title">{project.title}</span>
                    <span className="view-count">{project.viewCount} lượt xem</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="analytics-footer">
            <p className="period-info">
              Dữ liệu từ {new Date(analytics.startDate).toLocaleDateString('vi-VN')} đến{' '}
              {new Date(analytics.endDate).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
