import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

export function SearchBar({ onSearch, placeholder = 'Tìm kiếm...', showHistory = true }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (showHistory) {
      loadSearchHistory();
    }

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showHistory]);

  const loadSearchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = JSON.parse(atob(token.split('.')[1])).userId;
      const response = await fetch(`/search-filter/history?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setHistory(data.queries || []);
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  };

  const saveSearchHistory = async (searchQuery) => {
    try {
      const token = localStorage.getItem('token');
      const userId = JSON.parse(atob(token.split('.')[1])).userId;
      await fetch('/search-filter/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, query: searchQuery }),
      });
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  };

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userId = JSON.parse(atob(token.split('.')[1])).userId;

      const response = await fetch(`/search-filter/global?q=${encodeURIComponent(searchQuery)}&userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      setResults(data.results || []);
      setShowResults(true);

      if (showHistory) {
        await saveSearchHistory(searchQuery);
        await loadSearchHistory();
      }

      if (onSearch) {
        onSearch(data);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  const handleHistoryClick = (historyQuery) => {
    setQuery(historyQuery);
    handleSearch(historyQuery);
  };

  const handleClearHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = JSON.parse(atob(token.split('.')[1])).userId;
      await fetch(`/search-filter/history?userId=${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  };

  const getResultIcon = (type) => {
    const icons = {
      profile: '👤',
      project: '📁',
      skill: '⚡',
      certificate: '📜',
      experience: '💼',
    };
    return icons[type] || '📄';
  };

  return (
    <div className="search-bar" ref={searchRef}>
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => history.length > 0 && !query && setShowResults(true)}
        />
        {query && (
          <button className="search-clear" onClick={handleClear}>
            ✕
          </button>
        )}
        <button className="search-button" onClick={() => handleSearch()} disabled={loading}>
          {loading ? '⏳' : '🔍'}
        </button>
      </div>

      {showResults && (
        <div className="search-results">
          {loading && <div className="search-loading">Đang tìm kiếm...</div>}

          {!loading && results.length === 0 && query && (
            <div className="search-no-results">Không tìm thấy kết quả</div>
          )}

          {!loading && history.length > 0 && !query && (
            <div className="search-history">
              <div className="search-history-header">
                <span>Lịch sử tìm kiếm</span>
                <button className="search-history-clear" onClick={handleClearHistory}>
                  Xóa
                </button>
              </div>
              {history.map((h, index) => (
                <div
                  key={index}
                  className="search-history-item"
                  onClick={() => handleHistoryClick(h)}
                >
                  🕐 {h}
                </div>
              ))}
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="search-results-list">
              {results.map((result) => (
                <div key={`${result.type}-${result.id}`} className="search-result-item">
                  <span className="search-result-icon">{getResultIcon(result.type)}</span>
                  <div className="search-result-content">
                    <div className="search-result-title">{result.title}</div>
                    <div className="search-result-subtitle">{result.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
