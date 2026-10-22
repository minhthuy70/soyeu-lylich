import React, { useState } from 'react';
import './AIAssistant.css';

export default function AIAssistant() {
  const [activeFeature, setActiveFeature] = useState('summary');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [targetRole, setTargetRole] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [targetTone, setTargetTone] = useState('professional');

  const features = [
    { id: 'summary', label: 'Generate Summary', icon: '📝' },
    { id: 'objective', label: 'Career Objective', icon: '🎯' },
    { id: 'project', label: 'Improve Project', icon: '🚀' },
    { id: 'experience', label: 'Improve Experience', icon: '💼' },
    { id: 'skills', label: 'Suggest Skills', icon: '🔧' },
    { id: 'grammar', label: 'Grammar Check', icon: '✅' },
    { id: 'writing', label: 'Writing Tips', icon: '💡' },
    { id: 'translate', label: 'Translate', icon: '🌐' },
    { id: 'tone', label: 'Adjust Tone', icon: '🎨' },
    { id: 'bullets', label: 'Generate Bullets', icon: '•' },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setResult('');

    try {
      let endpoint = '';
      let body = {};

      switch (activeFeature) {
        case 'summary':
          endpoint = '/api/ai-assistant/generate-summary';
          body = { profile: JSON.parse(input) };
          break;
        case 'objective':
          endpoint = '/api/ai-assistant/generate-objective';
          body = { profile: JSON.parse(input), targetRole };
          break;
        case 'project':
          endpoint = '/api/ai-assistant/improve-project';
          body = { project: JSON.parse(input) };
          break;
        case 'experience':
          endpoint = '/api/ai-assistant/improve-experience';
          body = { experience: JSON.parse(input) };
          break;
        case 'skills':
          endpoint = '/api/ai-assistant/suggest-skills';
          body = { profile: JSON.parse(input), jobTitle: targetRole };
          break;
        case 'grammar':
          endpoint = '/api/ai-assistant/correct-grammar';
          body = { text: input };
          break;
        case 'writing':
          endpoint = '/api/ai-assistant/writing-suggestions';
          body = { text: input, section: 'summary' };
          break;
        case 'translate':
          endpoint = '/api/ai-assistant/translate';
          body = { text: input, targetLanguage };
          break;
        case 'tone':
          endpoint = '/api/ai-assistant/adjust-tone';
          body = { text: input, targetTone };
          break;
        case 'bullets':
          endpoint = '/api/ai-assistant/generate-bullets';
          body = { experience: JSON.parse(input) };
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI response');
      }

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderInputArea = () => {
    switch (activeFeature) {
      case 'summary':
      case 'objective':
      case 'project':
      case 'experience':
      case 'skills':
      case 'bullets':
        return (
          <textarea
            placeholder="Enter JSON data (profile, project, experience, etc.)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
          />
        );
      case 'grammar':
      case 'writing':
      case 'translate':
      case 'tone':
        return (
          <textarea
            placeholder="Enter text to process"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
          />
        );
      default:
        return null;
    }
  };

  const renderAdditionalInputs = () => {
    if (activeFeature === 'objective' || activeFeature === 'skills') {
      return (
        <input
          type="text"
          placeholder="Target job title (optional)"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
        />
      );
    }
    if (activeFeature === 'translate') {
      return (
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
        >
          <option value="">Select language</option>
          <option value="spanish">Spanish</option>
          <option value="french">French</option>
          <option value="german">German</option>
          <option value="japanese">Japanese</option>
        </select>
      );
    }
    if (activeFeature === 'tone') {
      return (
        <select
          value={targetTone}
          onChange={(e) => setTargetTone(e.target.value)}
        >
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
          <option value="professional">Professional</option>
        </select>
      );
    }
    return null;
  };

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <h2>AI Resume Assistant</h2>
        <p>Leverage AI to enhance your resume</p>
      </div>

      <div className="ai-content">
        <div className="ai-sidebar">
          {features.map((feature) => (
            <button
              key={feature.id}
              className={`feature-btn ${activeFeature === feature.id ? 'active' : ''}`}
              onClick={() => setActiveFeature(feature.id)}
            >
              <span className="feature-icon">{feature.icon}</span>
              <span className="feature-label">{feature.label}</span>
            </button>
          ))}
        </div>

        <div className="ai-main">
          <div className="ai-input-section">
            <h3>
              {features.find((f) => f.id === activeFeature)?.label}
            </h3>
            {renderAdditionalInputs()}
            {renderInputArea()}
            <button onClick={handleGenerate} disabled={loading}>
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>

          {result && (
            <div className="ai-result-section">
              <h3>Result</h3>
              <pre>{result}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
