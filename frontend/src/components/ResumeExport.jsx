import React, { useState } from 'react';
import './ResumeExport.css';

export function ResumeExport({ resumeId, onImportSuccess }) {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [loading, setLoading] = useState(false);
  const [watermark, setWatermark] = useState('');
  const [pageSize, setPageSize] = useState('A4');
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);

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

      // Decode base64 content
      const binaryString = atob(data.content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Determine MIME type based on format
      const mimeTypes = {
        pdf: 'application/pdf',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        html: 'text/html',
        txt: 'text/plain',
        json: 'application/json',
      };

      const blob = new Blob([bytes], { type: mimeTypes[exportFormat] || 'application/octet-stream' });
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

  const handleImport = async () => {
    if (!importFile) {
      alert('Please select a JSON file to import');
      return;
    }

    setImporting(true);
    try {
      const fileContent = await importFile.text();
      const jsonData = JSON.parse(fileContent);

      const token = localStorage.getItem('token');
      const response = await fetch('/resume-export/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jsonData }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Resume imported successfully!');
        setImportFile(null);
        if (onImportSuccess) {
          onImportSuccess(data.resume);
        }
      } else {
        alert(data.message || 'Import failed');
      }
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed. Please check the file format.');
    } finally {
      setImporting(false);
    }
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

      <div className="import-section">
        <h3>Import Resume</h3>
        <div className="import-options">
          <input
            type="file"
            accept=".json"
            onChange={(e) => setImportFile(e.target.files[0])}
            id="import-file"
            style={{ display: 'none' }}
          />
          <label htmlFor="import-file" className="btn btn-secondary">
            {importFile ? importFile.name : 'Select JSON File'}
          </label>
          <button
            className="btn btn-primary"
            onClick={handleImport}
            disabled={importing || !importFile}
          >
            {importing ? 'Importing...' : 'Import'}
          </button>
        </div>
      </div>
    </div>
  );
}
