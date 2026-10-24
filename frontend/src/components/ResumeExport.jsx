import React, { useState } from 'react';
import './ResumeExport.css';

export function ResumeExport({ resumeId, userId }) {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [loading, setLoading] = useState(false);
  const [watermark, setWatermark] = useState('');
  const [pageSize, setPageSize] = useState('A4');

  const handleExport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/resume-export/${resumeId}/${exportFormat}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          watermark: watermark || undefined,
          pageSize: exportFormat === 'pdf' ? pageSize : undefined,
        }),
      });
      const data = await response.json();

      // Create download link
      const blob = new Blob([data.content], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      alert(`${exportFormat.toUpperCase()} export successful!`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="resume-export">
      <h3>Export Resume</h3>

      <div className="export-options">
        <div className="export-format">
          <label>Format:</label>
          <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX (Word)</option>
            <option value="html">HTML</option>
            <option value="txt">Plain Text</option>
            <option value="json">JSON</option>
          </select>
        </div>

        {exportFormat === 'pdf' && (
          <>
            <div className="export-watermark">
              <label>Watermark (optional):</label>
              <input
                type="text"
                value={watermark}
                onChange={(e) => setWatermark(e.target.value)}
                placeholder="e.g., Draft"
              />
            </div>

            <div className="export-page-size">
              <label>Page Size:</label>
              <select value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
                <option value="A4">A4</option>
                <option value="Letter">Letter</option>
              </select>
            </div>
          </>
        )}
      </div>

      <div className="export-actions">
        <button
          className="btn btn-primary"
          onClick={handleExport}
          disabled={loading}
        >
          {loading ? 'Exporting...' : `Export ${exportFormat.toUpperCase()}`}
        </button>
        <button className="btn btn-secondary" onClick={handlePrint}>
          Print
        </button>
      </div>
    </div>
  );
}
