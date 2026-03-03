import { useState, useCallback } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate } from 'react-router-dom';
import useReferralJob from './useReferralJobNew';
import './healthcare.css';

const HomeReferralPage = () => {
  const { user } = useAuthenticator();
  const [s3Paths, setS3Paths] = useState(
    's3://chartmate-idp-deployment-1/inbound+15.pdf\ns3://chartmate-idp-deployment-1/8df068b1-1fab-48e1-83bb-884f92267cb7.pdf'
  );
  const {
    jobId,
    status,
    loading,
    polling,
    error,
    handleSubmit
  } = useReferralJob();

  const [showResult, setShowResult] = useState(true);

  const handleClearAll = () => {
    setS3Paths('');
  };

  const handleAddSample = () => {
    setS3Paths('s3://chartmate-idp-deployment-1/inbound+15.pdf\ns3://chartmate-idp-deployment-1/8df068b1-1fab-48e1-83bb-884f92267cb7.pdf');
  };

  const onSubmit = useCallback(() => {
    console.log('onSubmit called with s3Paths:', s3Paths);
    console.log('s3Paths type:', typeof s3Paths);
    console.log('s3Paths length:', s3Paths?.length);
    handleSubmit(s3Paths);
  }, [s3Paths, handleSubmit]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="healthcare-referral-page">
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
      
      <div className="healthcare-container">
        {/* Header Section */}
        <div className="healthcare-header">
          <div className="header-icon">🏥</div>
          <h1 className="healthcare-title">Home Healthcare Referral</h1>
          <p className="healthcare-subtitle">
            Submit patient referral documents for automated processing
          </p>
        </div>

        {/* Input Section */}
        <div className="input-section">
          <div className="input-header">
            <label htmlFor="s3-input" className="input-label">
              📄 S3 Document Paths
            </label>
            <div className="input-actions">
              <button 
                onClick={handleAddSample} 
                className="action-btn sample-btn"
                type="button"
              >
                📋 Load Sample
              </button>
              <button 
                onClick={handleClearAll} 
                className="action-btn clear-btn"
                type="button"
              >
                🗑️ Clear
              </button>
            </div>
          </div>
          
          <textarea
            id="s3-input"
            rows={8}
            value={s3Paths}
            onChange={(e) => setS3Paths(e.target.value)}
            className="s3-textarea"
            placeholder="Enter S3 paths (one per line)&#10;Example:&#10;s3://bucket-name/document1.pdf&#10;s3://bucket-name/document2.pdf"
          />
          
          <div className="input-info">
            <span className="info-icon">ℹ️</span>
            <span className="info-text">
              Enter one S3 path per line. Each path should point to a valid PDF document.
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          onClick={onSubmit} 
          disabled={loading || polling} 
          className="submit-button"
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Submitting...
            </>
          ) : polling ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            <>
              <span className="button-icon">🚀</span>
              Submit Referral
            </>
          )}
        </button>

        {/* Status Messages */}
        {jobId && !error && (
          <div className="status-message success-message">
            <span className="status-icon">✅</span>
            <div className="status-content">
              <strong>Job Submitted Successfully!</strong>
              <p className="status-detail">Job ID: {jobId}</p>
            </div>
          </div>
        )}

        {polling && (
          <div className="status-message info-message">
            <span className="status-icon">🔄</span>
            <div className="status-content">
              <strong>Processing Your Request</strong>
              <p className="status-detail">Please wait while we process your documents...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="status-message error-message">
            <span className="status-icon">❌</span>
            <div className="status-content">
              <strong>Error</strong>
              <p className="status-detail">{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {status && (
          <div className="results-section">
            <div className="results-header">
              <div className="results-title-wrapper">
                <span className="results-icon">🎉</span>
                <h3 className="results-title">Processing Complete</h3>
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
                  {status.processed_count && (
                    <div className="summary-item">
                      <span className="summary-label">Documents Processed:</span>
                      <span className="summary-value">{status.processed_count}</span>
                    </div>
                  )}
                </div>
                
                <div className="results-data">
                  <h4 className="data-title">📊 Full Response Data</h4>
                  <pre className="data-json">
                    {JSON.stringify(status, null, 2)}
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

export default HomeReferralPage;