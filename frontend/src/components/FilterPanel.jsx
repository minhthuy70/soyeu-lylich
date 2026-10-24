import React, { useState, useEffect } from 'react';
import './FilterPanel.css';

export function FilterPanel({ type, onFilterChange, onPresetSave, userId }) {
  const [filters, setFilters] = useState({});
  const [presets, setPresets] = useState([]);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [presetName, setPresetName] = useState('');

  useEffect(() => {
    loadPresets();
  }, [type, userId]);

  const loadPresets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/search-filter/presets?userId=${userId}&type=${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPresets(data || []);
    } catch (error) {
      console.error('Failed to load presets:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleApplyFilters = async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`/search-filter/${type}?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (onFilterChange) {
        onFilterChange(data);
      }
    } catch (error) {
      console.error('Failed to apply filters:', error);
    }
  };

  const handleClearFilters = () => {
    setFilters({});
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  const handleSavePreset = async () => {
    if (!presetName.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await fetch('/search-filter/presets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          preset: {
            name: presetName,
            type,
            filters,
          },
        },
      });
      await loadPresets();
      setShowPresetModal(false);
      setPresetName('');
    } catch (error) {
      console.error('Failed to save preset:', error);
    }
  };

  const handleLoadPreset = (preset) => {
    setFilters(preset.filters);
    if (onFilterChange) {
      onFilterChange(preset.filters);
    }
  };

  const handleDeletePreset = async (presetId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/search-filter/presets/${presetId}?userId=${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadPresets();
    } catch (error) {
      console.error('Failed to delete preset:', error);
    }
  };

  const renderFilters = () => {
    switch (type) {
      case 'projects':
        return (
          <>
            <div className="filter-group">
              <label>Công nghệ:</label>
              <input
                type="text"
                placeholder="React, Node.js, ..."
                value={filters.technologies || ''}
                onChange={(e) => handleFilterChange('technologies', e.target.value.split(','))}
              />
            </div>
            <div className="filter-group">
              <label>Ngày bắt đầu:</label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Ngày kết thúc:</label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Trạng thái:</label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="active">Đang thực hiện</option>
                <option value="completed">Đã hoàn thành</option>
                <option value="planned">Lên kế hoạch</option>
              </select>
            </div>
          </>
        );
      case 'experience':
        return (
          <>
            <div className="filter-group">
              <label>Ngày bắt đầu:</label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Ngày kết thúc:</label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>
                <input
                  type="checkbox"
                  checked={filters.currentPosition || false}
                  onChange={(e) => handleFilterChange('currentPosition', e.target.checked)}
                />
                Vị trí hiện tại
              </label>
            </div>
          </>
        );
      case 'certificates':
        return (
          <>
            <div className="filter-group">
              <label>Tổ chức:</label>
              <input
                type="text"
                placeholder="Tên tổ chức"
                value={filters.organization || ''}
                onChange={(e) => handleFilterChange('organization', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Ngày cấp:</label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Ngày hết hạn:</label>
              <input
                type="date"
                value={filters.expiryDate || ''}
                onChange={(e) => handleFilterChange('expiryDate', e.target.value)}
              />
            </div>
          </>
        );
      case 'skills':
        return (
          <>
            <div className="filter-group">
              <label>Danh mục:</label>
              <input
                type="text"
                placeholder="Frontend, Backend, ..."
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Trình độ:</label>
              <select
                value={filters.proficiency || ''}
                onChange={(e) => handleFilterChange('proficiency', e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="beginner">Cơ bản</option>
                <option value="intermediate">Trung cấp</option>
                <option value="advanced">Nâng cao</option>
                <option value="expert">Chuyên gia</option>
              </select>
            </div>
          </>
        );
      default:
        return <div>Không có bộ lọc cho loại này</div>;
    }
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Bộ lọc</h3>
        <div className="filter-actions">
          <button className="filter-btn clear" onClick={handleClearFilters}>
            Xóa bộ lọc
          </button>
          <button className="filter-btn apply" onClick={handleApplyFilters}>
            Áp dụng
          </button>
          <button className="filter-btn save" onClick={() => setShowPresetModal(true)}>
            Lưu preset
          </button>
        </div>
      </div>

      <div className="filter-body">{renderFilters()}</div>

      {presets.length > 0 && (
        <div className="filter-presets">
          <h4>Bộ lọc đã lưu</h4>
          {presets.map((preset) => (
            <div key={preset.id} className="preset-item">
              <span className="preset-name" onClick={() => handleLoadPreset(preset)}>
                {preset.name}
              </span>
              <button
                className="preset-delete"
                onClick={() => handleDeletePreset(preset.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {showPresetModal && (
        <div className="preset-modal">
          <div className="preset-modal-content">
            <h3>Lưu bộ lọc</h3>
            <input
              type="text"
              placeholder="Tên preset"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
            />
            <div className="preset-modal-actions">
              <button onClick={() => setShowPresetModal(false)}>Hủy</button>
              <button onClick={handleSavePreset}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
