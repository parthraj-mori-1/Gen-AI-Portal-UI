import React, { useState } from 'react';
import './BatchFileUploader.css';

const BatchFileUploader = ({ actorId }) => {
  const [files, setFiles] = useState([]);
  const [sessionId] = useState(`sess_${Date.now()}`);
  const [status, setStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setStatus('');
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const startUpload = async () => {
    if (files.length === 0) {
      alert("Please select files first!");
      return;
    }

    setIsUploading(true);
    setStatus(`Getting permission for ${files.length} files...`);
    setUploadProgress(0);

    try {
      // 1. Trigger API Gateway (Lambda 1) to register session and get URLs
      const response = await fetch(`${process.env.REACT_APP_SMART_DOCS_API_URL || 'https://s6ctgi38yi.execute-api.ap-south-1.amazonaws.com/dev'}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actor_id: actorId,
          session_id: sessionId,
          file_names: files.map(f => f.name)
        })
      });

      const { uploadUrls } = await response.json();
      console.log(uploadUrls)

      // 2. Perform Parallel Uploads directly to S3
      setStatus(`Uploading ${files.length} files to S3 in parallel...`);
      
      const uploadPromises = files.map((file, index) => {
        return fetch(uploadUrls[index], {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': 'application/pdf' }
        });
      });

      await Promise.all(uploadPromises);
      setUploadProgress(100);
      setStatus(`Success! All ${files.length} files uploaded to S3. Textract processing started.`);
      
    } catch (err) {
      console.error(err);
      setStatus('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="batch-uploader">
      <div className="uploader-header">
        <div className="header-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        </div>
        <h2>Document Upload Center</h2>
        <p>Upload multiple PDF documents for automated processing and analysis</p>
      </div>

      <div className="upload-section">
        <div className="file-input-wrapper">
          <input
            type="file"
            multiple
            onChange={onFileChange}
            accept="application/pdf"
            className="file-input"
            id="file-upload"
            disabled={isUploading}
          />
          <label htmlFor="file-upload" className="file-input-label">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7,10 12,15 17,10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Choose PDF Files
          </label>
        </div>

        {files.length > 0 && (
          <div className="file-list">
            <h3>Selected Files ({files.length})</h3>
            {files.map((file, index) => (
              <div key={index} className="file-item">
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{formatFileSize(file.size)}</span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="remove-btn"
                  disabled={isUploading}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={startUpload}
          disabled={files.length === 0 || isUploading}
          className="upload-btn"
        >
          {isUploading ? 'Uploading...' : `Upload ${files.length} Files`}
        </button>
      </div>

      {status && (
        <div className={`status-section ${status.includes('Success') ? 'success' : status.includes('failed') ? 'error' : 'info'}`}>
          <p>{status}</p>
          {isUploading && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          )}
        </div>
      )}

      <div className="session-info">
        <small>Session ID: {sessionId}</small>
      </div>
    </div>
  );
};

export default BatchFileUploader;