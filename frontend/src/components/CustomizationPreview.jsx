import './CustomizationPreview.css';

export default function CustomizationPreview({ theme = 'light', accentColor = '#007bff', fontSize = 'medium', borderRadius = 'medium', spacing = 'medium' }) {
  const previewData = {
    name: 'John Doe',
    title: 'Software Engineer',
    summary: 'Passionate developer with 5+ years of experience in building web applications.',
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'preview--font-small';
      case 'large': return 'preview--font-large';
      default: return 'preview--font-medium';
    }
  };

  const getBorderRadiusClass = () => {
    switch (borderRadius) {
      case 'small': return 'preview--radius-small';
      case 'large': return 'preview--radius-large';
      default: return 'preview--radius-medium';
    }
  };

  const getSpacingClass = () => {
    switch (spacing) {
      case 'small': return 'preview--spacing-small';
      case 'large': return 'preview--spacing-large';
      default: return 'preview--spacing-medium';
    }
  };

  return (
    <div className={`customization-preview ${theme === 'dark' ? 'customization-preview--dark' : ''} ${getFontSizeClass()} ${getBorderRadiusClass()} ${getSpacingClass()}`}>
      <div className="preview-header">
        <h3>Preview</h3>
      </div>
      <div className="preview-content">
        <div className="preview-card">
          <div className="preview-avatar" style={{ backgroundColor: accentColor }}>
            {previewData.name.charAt(0)}
          </div>
          <h2 className="preview-name">{previewData.name}</h2>
          <p className="preview-title" style={{ color: accentColor }}>{previewData.title}</p>
          <p className="preview-summary">{previewData.summary}</p>
          <button className="preview-button" style={{ backgroundColor: accentColor }}>
            Contact Me
          </button>
        </div>
      </div>
    </div>
  );
}
