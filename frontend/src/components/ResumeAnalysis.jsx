import React, { useState, useEffect } from 'react';
import './ResumeAnalysis.css';

export default function ResumeAnalysis({ resumeId }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  const analyzeResume = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/resume-analysis/${resumeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ jobTitle: jobTitle || undefined }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-analysis">
      <div className="analysis-header">
        <h2>Resume Analysis</h2>
        <div className="job-title-input">
          <input
            type="text"
            placeholder="Target job title (optional)"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <button onClick={analyzeResume} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {analysis && (
        <div className="analysis-results">
          {/* Completeness Section */}
          <div className="analysis-section">
            <h3>Completeness Score: {analysis.completeness.score}%</h3>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${analysis.completeness.score}%` }}
              />
            </div>
            <div className="sections-list">
              {analysis.completeness.sections.map((section, index) => (
                <div key={index} className={`section-item ${section.present ? 'present' : 'missing'}`}>
                  <span className="section-name">{section.name}</span>
                  <span className="section-status">
                    {section.present ? '✓ Present' : '✗ Missing'}
                  </span>
                  <span className="section-weight">Weight: {section.weight}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Section */}
          <div className="analysis-section">
            <h3>Quality Score: {analysis.quality.score}%</h3>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${analysis.quality.score}%` }}
              />
            </div>
            <div className="quality-factors">
              {analysis.quality.factors.map((factor, index) => (
                <div key={index} className="quality-factor">
                  <div className="factor-header">
                    <span className="factor-name">{factor.name}</span>
                    <span className="factor-score">{factor.score}%</span>
                  </div>
                  {factor.suggestions.length > 0 && (
                    <ul className="factor-suggestions">
                      {factor.suggestions.map((suggestion, i) => (
                        <li key={i}>{suggestion}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Missing Sections */}
          {analysis.missingSections.length > 0 && (
            <div className="analysis-section warning">
              <h3>Missing Sections</h3>
              <ul>
                {analysis.missingSections.map((section, index) => (
                  <li key={index}>{section}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Keyword Suggestions */}
          {analysis.keywordSuggestions.length > 0 && (
            <div className="analysis-section">
              <h3>Keyword Suggestions</h3>
              {analysis.keywordSuggestions.map((section, index) => (
                <div key={index} className="keyword-section">
                  <h4>{section.section}</h4>
                  <div className="keyword-tags">
                    {section.keywords.map((keyword, i) => (
                      <span key={i} className="keyword-tag">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Job-Oriented Suggestions */}
          {analysis.jobOrientedSuggestions && (
            <div className="analysis-section">
              <h3>Suggestions for {analysis.jobOrientedSuggestions.jobTitle}</h3>
              <ul>
                {analysis.jobOrientedSuggestions.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
