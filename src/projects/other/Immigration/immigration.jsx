import { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import './immigration.css';

const ImmigrationExtractor = () => {
  const { user } = useAuthenticator();
  const [s3Path, setS3Path] = useState(
    process.env.REACT_APP_IMMIGRATION_S3_BUCKET || 'https://genai-konze-student-documents.s3.ap-south-1.amazonaws.com/Gopi+CHATTI+2/'
  );
  const [jobId, setJobId] = useState('');
  const [statusMessages, setStatusMessages] = useState([]);
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showResult, setShowResult] = useState(true);

  const MAX_ATTEMPTS = 10;

  const handleSubmit = async () => {
    if (!s3Path.trim()) {
      setError('Please enter a valid S3 path.');
      return;
    }

    const SUBMIT_URL = process.env.REACT_APP_IMMIGRATION_SUBMIT_URL || 
      'https://ol9jaj3n8e.execute-api.ap-south-1.amazonaws.com/Stage/requestapi';

    console.log('Immigration Submit URL:', SUBMIT_URL);
    console.log('S3 Path:', s3Path);

    setIsSubmitting(true);
    setError('');
    setResult(null);
    setStatusMessages([]);
    setAttempts(0);

    try {
      const response = await axios.post(
        SUBMIT_URL,
        { link: s3Path },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Submit Response:', response);

      if (response.status === 200) {
        setJobId(response.data);
        setAttempts(1);
      }
    } catch (err) {
      console.error('Submit Error:', err);
      setError(`Submission failed: ${err.response?.data || err.message}`);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      if (!jobId || attempts > MAX_ATTEMPTS) return;

      try {
        const response = await axios.post(
          process.env.REACT_APP_IMMIGRATION_STATUS_URL,
          { job_id: jobId },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.status === 200) {
          setResult(response.data);
          setIsSubmitting(false);
        } else if (response.status === 202) {
          const message = response.data.message || 'Processing...';
          setStatusMessages(prev => {
            if (!prev.includes(message)) {
              return [...prev, message];
            }
            return prev;
          });
          setTimeout(() => setAttempts(a => a + 1), attempts === 1 ? 6000 : 15000);
        }
      } catch (err) {
        setError(`Error fetching status: ${err.response?.data || err.message}`);
        setIsSubmitting(false);
      }
    };

    checkStatus();
  }, [jobId, attempts]);

  const handleClear = () => {
    setS3Path('');
  };

  const handleLoadSample = () => {
    setS3Path('https://genai-konze-student-documents.s3.ap-south-1.amazonaws.com/Gopi+CHATTI+2/');
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="immigration-page">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `url('/bg-genai.jpeg')`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          zIndex: 0
        }}
      />
      
      <div className="immigration-container">
        {/* Header Section */}
        <div className="immigration-header">
          <div className="header-icon">🌍</div>
          <h1 className="immigration-title">Immigration Information Extraction</h1>
          <p className="immigration-subtitle">
            Automated extraction of immigration documents and student information
          </p>
        </div>

        {/* Input Section */}
        <div className="input-section">
          <div className="input-header">
            <label htmlFor="s3-input" className="input-label">
              📁 S3 Student Folder Path
            </label>
            <div className="input-actions">
              <button 
                onClick={handleLoadSample} 
                className="action-btn sample-btn"
                type="button"
              >
                📋 Load Sample
              </button>
              <button 
                onClick={handleClear} 
                className="action-btn clear-btn"
                type="button"
              >
                🗑️ Clear
              </button>
            </div>
          </div>
          
          <textarea
            id="s3-input"
            rows={4}
            value={s3Path}
            onChange={(e) => setS3Path(e.target.value)}
            className="s3-textarea"
            placeholder="Enter S3 folder path&#10;Example: s3://bucket-name/student-folder/"
          />
          
          <div className="input-info">
            <span className="info-icon">ℹ️</span>
            <span className="info-text">
              Enter the S3 path to the folder containing student immigration documents.
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting} 
          className="submit-button"
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            <>
              <span className="button-icon">🚀</span>
              Extract Information
            </>
          )}
        </button>

        {/* Status Messages */}
        {jobId && !error && !result && (
          <div className="status-message success-message">
            <span className="status-icon">✅</span>
            <div className="status-content">
              <strong>Job Submitted Successfully!</strong>
              <p className="status-detail">Job ID: {jobId}</p>
            </div>
          </div>
        )}

        {statusMessages.map((msg, index) => (
          <div key={index} className="status-message info-message">
            <span className="status-icon">🔄</span>
            <div className="status-content">
              <strong>Processing</strong>
              <p className="status-detail">{msg}</p>
            </div>
          </div>
        ))}

        {error && (
          <div className="status-message error-message">
            <span className="status-icon">❌</span>
            <div className="status-content">
              <strong>Error</strong>
              <p className="status-detail">{error}</p>
            </div>
          </div>
        )}

        {attempts >= MAX_ATTEMPTS && !result && (
          <div className="status-message warning-message">
            <span className="status-icon">⚠️</span>
            <div className="status-content">
              <strong>Still Processing</strong>
              <p className="status-detail">Job is taking longer than expected. Please check again later.</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="results-section">
            <div className="results-header">
              <div className="results-title-wrapper">
                <span className="results-icon">🎉</span>
                <h3 className="results-title">Extraction Complete</h3>
              </div>
              <button
                className="toggle-results-btn"
                onClick={() => setShowResult(!showResult)}
                type="button"
              >
                {showResult ? '👁️ Hide' : '👁️‍🗨️ Show'} Details
              </button>
            </div>

            {showResult && (
              <div className="results-content">
                <div className="results-summary">
                  <div className="summary-item">
                    <span className="summary-label">Status:</span>
                    <span className="summary-value success">Completed</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Job ID:</span>
                    <span className="summary-value">{jobId}</span>
                  </div>
                  {result.student_count && (
                    <div className="summary-item">
                      <span className="summary-label">Students Processed:</span>
                      <span className="summary-value">{result.student_count}</span>
                    </div>
                  )}
                </div>
                
                <div className="results-data">
                  <h4 className="data-title">📊 Extracted Data</h4>
                  <pre className="data-json">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImmigrationExtractor;