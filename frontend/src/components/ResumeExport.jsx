import React, { useState } from 'react';
import './ResumeExport.css';

export default function ResumeExport({ resumeId, resumeTitle }) {
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState(null);
  const [message, setMessage] = useState('');
  const [pdfOptions, setPdfOptions] = useState({
    watermark: '',
    pageSize: 'A4',
  });
  const [showPdfOptions, setShowPdfOptions] = useState(false);

  const exportResume = async (format) => {
    setExporting(true);
    setExportFormat(format);
    setMessage('');

    try {
      let url = `/api/resume-export/${resumeId}/${format}`;
      let body = {};

      if (format === 'pdf') {
        body = pdfOptions;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();

        // Create download link
        const blob = new Blob([data.content], { type: 'text/plain' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        setMessage(`Successfully exported to ${format.toUpperCase()}`);
      } else {
        setMessage(`Failed to export to ${format.toUpperCase()}`);
      }
    } catch (error) {
      setMessage(`Error exporting to ${format.toUpperCase()}`);
    } finally {
      setExporting(false);
      setExportFormat(null);
    }
  };

  const exportAllFormats = async () => {
    setExporting(true);
    setExportFormat('all');
    setMessage('');

    const formats = ['pdf', 'docx', 'txt', 'json', 'html'];
    let successCount = 0;

    for (const format of formats) {
      try {
        let url = `/api/resume-export/${resumeId}/${format}`;
        let body = {};

        if (format === 'pdf') {
          body = pdfOptions;
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const data = await response.json();
          const blob = new Blob([data.content], { type: 'text/plain' });
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = data.filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);
          successCount++;
        }
      } catch (error) {
        console.error(`Error exporting to ${format}:`, error);
      }
    }

    setExporting(false);
    setExportFormat(null);
    setMessage(`Exported ${successCount}/${formats.length} formats`);
  };

  return (
    <div className="resume-export">
      <div className="export-header">
        <h3>Export Resume</h3>
        <p className="resume-title">{resumeTitle}</p>
      </div>

      <div className="export-options">
        <div className="export-formats">
          <h4>Export Format</h4>
          <div className="format-buttons">
            <button
              onClick={() => exportResume('pdf')}
              disabled={exporting}
              className={exporting && exportFormat === 'pdf' ? 'loading' : ''}
            >
              {exporting && exportFormat === 'pdf' ? 'Exporting...' : '📄 PDF'}
            </button>
            <button
              onClick={() => exportResume('docx')}
              disabled={exporting}
              className={exporting && exportFormat === 'docx' ? 'loading' : ''}
            >
              {exporting && exportFormat === 'docx' ? 'Exporting...' : '📝 DOCX'}
            </button>
            <button
              onClick={() => exportResume('txt')}
              disabled={exporting}
              className={exporting && exportFormat === 'txt' ? 'loading' : ''}
            >
              {exporting && exportFormat === 'txt' ? 'Exporting...' : '📃 TXT'}
            </button>
            <button
              onClick={() => exportResume('json')}
              disabled={exporting}
              className={exporting && exportFormat === 'json' ? 'loading' : ''}
            >
              {exporting && exportFormat === 'json' ? 'Exporting...' : '🔧 JSON'}
            </button>
            <button
              onClick={() => exportResume('html')}
              disabled={exporting}
              className={exporting && exportFormat === 'html' ? 'loading' : ''}
            >
              {exporting && exportFormat === 'html' ? 'Exporting...' : '🌐 HTML'}
            </button>
          </div>
        </div>

        <div className="pdf-options">
          <h4>
            PDF Options
            <button
              className="toggle-btn"
              onClick={() => setShowPdfOptions(!showPdfOptions)}
            >
              {showPdfOptions ? '▼' : '▶'}
            </button>
          </h4>
          {showPdfOptions && (
            <div className="pdf-options-content">
              <div className="form-group">
                <label>Watermark (optional)</label>
                <input
                  type="text"
                  value={pdfOptions.watermark}
                  onChange={(e) => setPdfOptions({ ...pdfOptions, watermark: e.target.value })}
                  placeholder="e.g., CONFIDENTIAL"
                />
              </div>
              <div className="form-group">
                <label>Page Size</label>
                <select
                  value={pdfOptions.pageSize}
                  onChange={(e) => setPdfOptions({ ...pdfOptions, pageSize: e.target.value })}
                >
                  <option value="A4">A4</option>
                  <option value="Letter">Letter</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="batch-export">
          <h4>Batch Export</h4>
          <button
            onClick={exportAllFormats}
            disabled={exporting}
            className={exporting && exportFormat === 'all' ? 'loading' : ''}
          >
            {exporting && exportFormat === 'all' ? 'Exporting...' : '📦 Export All Formats'}
          </button>
        </div>
      </div>

      {message && <div className="message">{message}</div>}

      <div className="export-info">
        <p>
          <strong>Note:</strong> PDF and DOCX exports use mock implementations.
          In production, these will be generated using proper libraries (puppeteer, docx).
        </p>
      </div>
    </div>
  );
}
