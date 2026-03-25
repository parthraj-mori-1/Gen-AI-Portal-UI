import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedApplicationJSON, setSelectedApplicationJSON] = useState(null);
  const [selectedMissingDocs, setSelectedMissingDocs] = useState(null);
  const [selectedValidationResults, setSelectedValidationResults] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRecommendation, setFilterRecommendation] = useState('all');

  // API Configuration - Replace with your actual API Gateway URLs
  const API_BASE_URL = 'https://s6ctgi38yi.execute-api.ap-south-1.amazonaws.com/dev';
  useEffect(() => {
    fetchDashboardData();
    fetchApplications();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: 100,
        status: filterStatus,
        recommendation: filterRecommendation
      });
      
      const response = await fetch(`${API_BASE_URL}/api/applications?${params}`);
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationDetails = async (actorId, sessionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/${actorId}/${sessionId}`);
      const data = await response.json();
      setSelectedApplication(data);
    } catch (error) {
      console.error('Error fetching application details:', error);
    }
  };

  const viewApplicationJSON = async (actorId, sessionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/${actorId}/${sessionId}`);
      const data = await response.json();
      setSelectedApplicationJSON(data);
    } catch (error) {
      console.error('Error fetching application JSON:', error);
    }
  };

  const viewMissingDocuments = async (actorId, sessionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/${actorId}/${sessionId}/missing-docs`);
      const data = await response.json();
      setSelectedMissingDocs(data);
    } catch (error) {
      console.error('Error fetching missing documents:', error);
    }
  };

  const viewValidationResults = async (actorId, sessionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/${actorId}/${sessionId}/validation-results`);
      const data = await response.json();
      setSelectedValidationResults(data);
    } catch (error) {
      console.error('Error fetching validation results:', error);
    }
  };

  const searchApplications = async () => {
    if (!searchTerm.trim()) {
      fetchApplications();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/applications/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: searchTerm,
          application_number: searchTerm,
          eligibility_status: filterStatus !== 'all' ? filterStatus.toUpperCase() : '',
          recommendation: filterRecommendation !== 'all' ? filterRecommendation.toUpperCase() : ''
        })
      });
      
      const data = await response.json();
      setApplications(data.results || []);
    } catch (error) {
      console.error('Error searching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ELIGIBLE': return '#10b981';
      case 'NOT_ELIGIBLE': return '#ef4444';
      case 'PENDING': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'APPROVE': return '#10b981';
      case 'HOLD_FOR_VERIFICATION': return '#f59e0b';
      case 'REVIEW_REQUIRED': return '#3b82f6';
      case 'REJECT': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchApplications();
  }, [filterStatus, filterRecommendation]);

  if (loading && !dashboardData) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>CHANDIGARH UNIVERSITY</h1>
        {/* <p>Real-time application processing and validation status</p> */}
      </div>

      {/* Statistics Cards */}
      {dashboardData && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{dashboardData.overview.total_applications}</h3>
              <p>Total Applications</p>
            </div>
          </div>
          
          <div className="stat-card eligible">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{dashboardData.overview.eligible_applications}</h3>
              <p>Eligible Applications</p>
              <span className="stat-percentage">{dashboardData.overview.eligibility_rate}%</span>
            </div>
          </div>
          
          <div className="stat-card approved">
            <div className="stat-icon">🎓</div>
            <div className="stat-content">
              <h3>{dashboardData.overview.approved_applications}</h3>
              <p>Approved</p>
              <span className="stat-percentage">{dashboardData.overview.approval_rate}%</span>
            </div>
          </div>
          
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{dashboardData.overview.hold_for_verification + dashboardData.overview.review_required}</h3>
              <p>Pending Review</p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="dashboard-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search by name or application number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={searchApplications} className="search-btn">
            🔍 Search
          </button>
        </div>
        
        <div className="filter-section">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="eligible">Eligible</option>
            <option value="not_eligible">Not Eligible</option>
            <option value="pending">Pending</option>
          </select>
          
          <select 
            value={filterRecommendation} 
            onChange={(e) => setFilterRecommendation(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Recommendations</option>
            <option value="approve">Approved</option>
            <option value="hold">Hold for Verification</option>
            <option value="review">Review Required</option>
            <option value="reject">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="applications-section">
        <h2>Applications ({applications.length})</h2>
        
        {loading ? (
          <div className="table-loading">
            <div className="loading-spinner"></div>
            <p>Loading applications...</p>
          </div>
        ) : (
          <div className="applications-table-container">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Applicant Name</th>
                  <th>Application #</th>
                  <th>Program</th>
                  <th>Eligibility</th>
                  <th>Recommendation</th>
                  <th>CGPA</th>
                  <th>Processed</th>
                  <th>Actions</th>
                  <th>View JSON</th>
                  <th>Missing Docs</th>
                  <th>Validation</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr key={index} className="application-row">
                    <td className="applicant-name">
                      <div>
                        <strong>{app.applicant_name}</strong>
                        <small>{app.actor_id}</small>
                      </div>
                    </td>
                    <td>{app.application_number}</td>
                    <td className="program-cell">
                      <span className="program-name">{app.program}</span>
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(app.eligibility_status) }}
                      >
                        {app.eligibility_status}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="recommendation-badge"
                        style={{ backgroundColor: getRecommendationColor(app.final_recommendation) }}
                      >
                        {app.final_recommendation}
                      </span>
                    </td>
                    <td>
                      {app.academic_performance?.average_cgpa ? (
                        <div className="cgpa-cell">
                          <strong>{app.academic_performance.average_cgpa}</strong>
                          {app.academic_performance.converted_percentage && (
                            <small>({app.academic_performance.converted_percentage}%)</small>
                          )}
                        </div>
                      ) : (
                        <span className="no-data">N/A</span>
                      )}
                    </td>
                    <td>{formatDate(app.processing_timestamp)}</td>
                    <td>
                      <button
                        onClick={() => fetchApplicationDetails(app.actor_id, app.session_id)}
                        className="view-details-btn"
                      >
                        View Details
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => viewApplicationJSON(app.actor_id, app.session_id)}
                        className="view-json-btn"
                      >
                        View JSON
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => viewMissingDocuments(app.actor_id, app.session_id)}
                        className="missing-docs-btn"
                      >
                        Missing Docs
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => viewValidationResults(app.actor_id, app.session_id)}
                        className="validation-results-btn"
                      >
                        Validation
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {applications.length === 0 && (
              <div className="no-applications">
                <p>No applications found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Application Details</h2>
              <button 
                className="modal-close"
                onClick={() => setSelectedApplication(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              {selectedApplication.data?.final_response && (
                <div className="application-details">
                  <div className="detail-section">
                    <h3>Basic Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Name:</label>
                        <span>{selectedApplication.data.final_response.applicant_name}</span>
                      </div>
                      <div className="detail-item">
                        <label>Application Number:</label>
                        <span>{selectedApplication.data.final_response.application_number}</span>
                      </div>
                      <div className="detail-item">
                        <label>Program:</label>
                        <span>{selectedApplication.data.final_response.program}</span>
                      </div>
                      <div className="detail-item">
                        <label>Processing Date:</label>
                        <span>{formatDate(selectedApplication.data.final_response.processing_timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h3>Assessment Results</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Eligibility Status:</label>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(selectedApplication.data.final_response.eligibility_status) }}
                        >
                          {selectedApplication.data.final_response.eligibility_status}
                        </span>
                      </div>
                      <div className="detail-item">
                        <label>Final Recommendation:</label>
                        <span 
                          className="recommendation-badge"
                          style={{ backgroundColor: getRecommendationColor(selectedApplication.data.final_response.final_recommendation) }}
                        >
                          {selectedApplication.data.final_response.final_recommendation}
                        </span>
                      </div>
                      <div className="detail-item">
                        <label>Confidence Level:</label>
                        <span>{selectedApplication.data.final_response.confidence_level}</span>
                      </div>
                      <div className="detail-item">
                        <label>Action Required:</label>
                        <span>{selectedApplication.data.final_response.action_required}</span>
                      </div>
                    </div>
                  </div>

                  {selectedApplication.data.final_response.academic_performance && (
                    <div className="detail-section">
                      <h3>Academic Performance</h3>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <label>Average CGPA:</label>
                          <span>{selectedApplication.data.final_response.academic_performance.average_cgpa}</span>
                        </div>
                        <div className="detail-item">
                          <label>Converted Percentage:</label>
                          <span>{selectedApplication.data.final_response.academic_performance.converted_percentage}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedApplication.data.final_response.processing_statistics && (
                    <div className="detail-section">
                      <h3>Processing Statistics</h3>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <label>Documents Processed:</label>
                          <span>{selectedApplication.data.final_response.processing_statistics.documents_processed}</span>
                        </div>
                        <div className="detail-item">
                          <label>Validation Matches:</label>
                          <span>{selectedApplication.data.final_response.processing_statistics.validation_matches}</span>
                        </div>
                        <div className="detail-item">
                          <label>Critical Issues:</label>
                          <span>{selectedApplication.data.final_response.processing_statistics.critical_issues}</span>
                        </div>
                        <div className="detail-item">
                          <label>Minor Issues:</label>
                          <span>{selectedApplication.data.final_response.processing_statistics.minor_issues}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Application JSON Modal */}
      {selectedApplicationJSON && (
        <div className="modal-overlay" onClick={() => setSelectedApplicationJSON(null)}>
          <div className="modal-content json-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Complete Application JSON</h2>
              <div className="json-modal-actions">
                <button 
                  className="copy-json-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(selectedApplicationJSON, null, 2));
                    alert('JSON copied to clipboard!');
                  }}
                >
                  📋 Copy JSON
                </button>
                <button 
                  className="download-json-btn"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(selectedApplicationJSON, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `application_${selectedApplicationJSON.actor_id}_${selectedApplicationJSON.session_id}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  💾 Download
                </button>
                <button 
                  className="modal-close"
                  onClick={() => setSelectedApplicationJSON(null)}
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="modal-body json-modal-body">
              <pre className="json-display">
                {JSON.stringify(selectedApplicationJSON, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Missing Documents Modal */}
      {selectedMissingDocs && (
        <div className="modal-overlay" onClick={() => setSelectedMissingDocs(null)}>
          <div className="modal-content missing-docs-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Missing Documents Report</h2>
              <div className="missing-docs-actions">
                <button 
                  className="download-report-btn"
                  onClick={() => {
                    const reportText = `Missing Documents Report
Application: ${selectedMissingDocs.applicant_name || 'Unknown'} (${selectedMissingDocs.application_number || 'Unknown'})
Actor ID: ${selectedMissingDocs.actor_id}
Session ID: ${selectedMissingDocs.session_id}
Generated: ${new Date().toLocaleString()}

=== MISSING DOCUMENTS ===
${selectedMissingDocs.missing_documents?.map((doc, index) => `${index + 1}. ${doc}`).join('\n') || 'No missing documents found'}

=== AVAILABLE DOCUMENTS ===
${selectedMissingDocs.available_documents?.map((doc, index) => `${index + 1}. ${doc}`).join('\n') || 'No available documents listed'}

=== VALIDATION SUMMARY ===
${selectedMissingDocs.validation_warnings?.map((warning, index) => `${index + 1}. ${warning}`).join('\n') || 'No validation warnings'}

=== DETAILED WARNINGS ===
${selectedMissingDocs.detailed_warnings?.map((warning, index) => `${index + 1}. ${warning}`).join('\n') || 'No detailed warnings available'}

=== PROCESSING STATISTICS ===
Critical Issues: ${selectedMissingDocs.processing_statistics?.critical_issues || 0}
Minor Issues: ${selectedMissingDocs.processing_statistics?.minor_issues || 0}
Total Warnings: ${selectedMissingDocs.processing_statistics?.warnings || 0}
Validation Status: ${selectedMissingDocs.overall_status || 'UNKNOWN'}
`;
                    const blob = new Blob([reportText], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `missing_docs_${selectedMissingDocs.actor_id}_${selectedMissingDocs.session_id}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  📄 Download Report
                </button>
                <button 
                  className="modal-close"
                  onClick={() => setSelectedMissingDocs(null)}
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="modal-body">
              <div className="missing-docs-content">
                <div className="missing-docs-section">
                  <h3>❌ Missing Documents</h3>
                  {selectedMissingDocs.missing_documents && selectedMissingDocs.missing_documents.length > 0 ? (
                    <ul className="missing-docs-list">
                      {selectedMissingDocs.missing_documents.map((doc, index) => (
                        <li key={index} className="missing-doc-item">
                          <span className="missing-icon">❌</span>
                          {doc}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="no-missing-docs">
                      <span className="success-icon">✅</span>
                      All required documents are present
                    </div>
                  )}
                </div>

                {selectedMissingDocs.available_documents && selectedMissingDocs.available_documents.length > 0 && (
                  <div className="missing-docs-section available-docs-section">
                    <h3>✅ Available Documents</h3>
                    <ul className="available-docs-list">
                      {selectedMissingDocs.available_documents.map((doc, index) => (
                        <li key={index} className="available-doc-item">
                          <span className="available-icon">✅</span>
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedMissingDocs.validation_warnings && selectedMissingDocs.validation_warnings.length > 0 && (
                  <div className="missing-docs-section">
                    <h3>⚠️ Validation Summary</h3>
                    <ul className="warnings-list">
                      {selectedMissingDocs.validation_warnings.map((warning, index) => (
                        <li key={index} className="warning-item">
                          <span className="warning-icon">⚠️</span>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedMissingDocs.detailed_warnings && selectedMissingDocs.detailed_warnings.length > 0 && (
                  <div className="missing-docs-section">
                    <h3>🔍 Detailed Validation Warnings</h3>
                    <ul className="warnings-list">
                      {selectedMissingDocs.detailed_warnings.map((warning, index) => (
                        <li key={index} className="warning-item detailed-warning">
                          <span className="warning-icon">🔍</span>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="missing-docs-section">
                  <h3>📊 Document Status Summary</h3>
                  <div className="status-summary">
                    <div className="status-item">
                      <span className="status-label">Missing Documents:</span>
                      <span className="status-value missing">{selectedMissingDocs.missing_documents?.length || 0}</span>
                    </div>
                    <div className="status-item">
                      <span className="status-label">Available Documents:</span>
                      <span className="status-value available">{selectedMissingDocs.available_documents?.length || 0}</span>
                    </div>
                    <div className="status-item">
                      <span className="status-label">Validation Status:</span>
                      <span className={`status-value ${selectedMissingDocs.overall_status?.toLowerCase()}`}>
                        {selectedMissingDocs.overall_status || 'UNKNOWN'}
                      </span>
                    </div>
                    {selectedMissingDocs.processing_statistics && (
                      <>
                        <div className="status-item">
                          <span className="status-label">Critical Issues:</span>
                          <span className="status-value critical">{selectedMissingDocs.processing_statistics.critical_issues || 0}</span>
                        </div>
                        <div className="status-item">
                          <span className="status-label">Minor Issues:</span>
                          <span className="status-value minor">{selectedMissingDocs.processing_statistics.minor_issues || 0}</span>
                        </div>
                        <div className="status-item">
                          <span className="status-label">Total Warnings:</span>
                          <span className="status-value warning">{selectedMissingDocs.processing_statistics.warnings || 0}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Results Modal */}
      {selectedValidationResults && (
        <div className="modal-overlay" onClick={() => setSelectedValidationResults(null)}>
          <div className="modal-content validation-results-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Validation Results</h2>
              <div className="validation-results-actions">
                <button 
                  className="download-validation-btn"
                  onClick={() => {
                    const reportText = `Validation Results Report
Application: ${selectedValidationResults.applicant_name || 'Unknown'} (${selectedValidationResults.application_number || 'Unknown'})
Actor ID: ${selectedValidationResults.actor_id}
Session ID: ${selectedValidationResults.session_id}
Generated: ${new Date().toLocaleString()}

=== VALIDATION SUMMARY ===
Overall Status: ${selectedValidationResults.overall_status || 'UNKNOWN'}
Total Matches: ${selectedValidationResults.matches?.length || 0}
Total Discrepancies: ${selectedValidationResults.discrepancies?.length || 0}
Total Warnings: ${selectedValidationResults.warnings?.length || 0}

=== VALIDATION MATCHES ===
${selectedValidationResults.matches?.map((match, index) => `${index + 1}. ${match.field}: "${match.application_value}" matches "${match.document_value}" (Confidence: ${match.confidence || 'N/A'})`).join('\n') || 'No matches found'}

=== DISCREPANCIES ===
${selectedValidationResults.discrepancies?.map((disc, index) => `${index + 1}. [${disc.severity}] ${disc.field}: Application="${disc.application_value}" vs Document="${disc.document_value}" (${disc.description || 'No description'})`).join('\n') || 'No discrepancies found'}

=== WARNINGS ===
${selectedValidationResults.warnings?.map((warning, index) => `${index + 1}. ${warning}`).join('\n') || 'No warnings found'}

=== ELIGIBILITY RESULTS ===
${selectedValidationResults.eligibility_results ? `
Status: ${selectedValidationResults.eligibility_results.eligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
Requirements Met: ${selectedValidationResults.eligibility_results.requirements_met?.length || 0}
Requirements Not Met: ${selectedValidationResults.eligibility_results.requirements_not_met?.length || 0}
Warnings: ${selectedValidationResults.eligibility_results.warnings?.length || 0}
` : 'No eligibility results available'}
`;
                    const blob = new Blob([reportText], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `validation_results_${selectedValidationResults.actor_id}_${selectedValidationResults.session_id}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  📄 Download Report
                </button>
                <button 
                  className="modal-close"
                  onClick={() => setSelectedValidationResults(null)}
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="modal-body">
              <div className="validation-results-content">
                <div className="validation-section">
                  <h3>📊 Validation Summary</h3>
                  <div className="validation-summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">Overall Status:</span>
                      <span className={`summary-value ${selectedValidationResults.overall_status?.toLowerCase()}`}>
                        {selectedValidationResults.overall_status || 'UNKNOWN'}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Total Matches:</span>
                      <span className="summary-value matches">{selectedValidationResults.matches?.length || 0}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Discrepancies:</span>
                      <span className="summary-value discrepancies">{selectedValidationResults.discrepancies?.length || 0}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Warnings:</span>
                      <span className="summary-value warnings">{selectedValidationResults.warnings?.length || 0}</span>
                    </div>
                  </div>
                </div>

                {selectedValidationResults.matches && selectedValidationResults.matches.length > 0 && (
                  <div className="validation-section matches-section">
                    <h3>✅ Validation Matches</h3>
                    <div className="validation-items">
                      {selectedValidationResults.matches.map((match, index) => (
                        <div key={index} className="validation-item match-item">
                          <div className="validation-item-header">
                            <span className="validation-icon">✅</span>
                            <strong>{match.field}</strong>
                            {match.confidence && (
                              <span className="confidence-badge">{match.confidence}% confidence</span>
                            )}
                          </div>
                          <div className="validation-item-content">
                            <div className="value-comparison">
                              <span className="value-label">Application:</span>
                              <span className="value-text">{match.application_value}</span>
                            </div>
                            <div className="value-comparison">
                              <span className="value-label">Document:</span>
                              <span className="value-text">{match.document_value}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedValidationResults.discrepancies && selectedValidationResults.discrepancies.length > 0 && (
                  <div className="validation-section discrepancies-section">
                    <h3>❌ Discrepancies</h3>
                    <div className="validation-items">
                      {selectedValidationResults.discrepancies.map((disc, index) => (
                        <div key={index} className={`validation-item discrepancy-item ${disc.severity?.toLowerCase()}`}>
                          <div className="validation-item-header">
                            <span className="validation-icon">❌</span>
                            <strong>{disc.field}</strong>
                            <span className={`severity-badge ${disc.severity?.toLowerCase()}`}>
                              {disc.severity || 'UNKNOWN'}
                            </span>
                          </div>
                          <div className="validation-item-content">
                            <div className="value-comparison">
                              <span className="value-label">Application:</span>
                              <span className="value-text">{disc.application_value}</span>
                            </div>
                            <div className="value-comparison">
                              <span className="value-label">Document:</span>
                              <span className="value-text">{disc.document_value}</span>
                            </div>
                            {disc.description && (
                              <div className="discrepancy-description">
                                <span className="value-label">Description:</span>
                                <span className="value-text">{disc.description}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedValidationResults.warnings && selectedValidationResults.warnings.length > 0 && (
                  <div className="validation-section warnings-section">
                    <h3>⚠️ Validation Warnings</h3>
                    <div className="validation-items">
                      {selectedValidationResults.warnings.map((warning, index) => (
                        <div key={index} className="validation-item warning-item">
                          <span className="validation-icon">⚠️</span>
                          <span className="warning-text">{warning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedValidationResults.eligibility_results && (
                  <div className="validation-section eligibility-section">
                    <h3>🎓 Eligibility Assessment</h3>
                    <div className="eligibility-status">
                      <span className="eligibility-label">Status:</span>
                      <span className={`eligibility-value ${selectedValidationResults.eligibility_results.eligible ? 'eligible' : 'not-eligible'}`}>
                        {selectedValidationResults.eligibility_results.eligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                      </span>
                    </div>
                    
                    {selectedValidationResults.eligibility_results.requirements_met && selectedValidationResults.eligibility_results.requirements_met.length > 0 && (
                      <div className="requirements-section">
                        <h4>✅ Requirements Met</h4>
                        <ul className="requirements-list met">
                          {selectedValidationResults.eligibility_results.requirements_met.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {selectedValidationResults.eligibility_results.requirements_not_met && selectedValidationResults.eligibility_results.requirements_not_met.length > 0 && (
                      <div className="requirements-section">
                        <h4>❌ Requirements Not Met</h4>
                        <ul className="requirements-list not-met">
                          {selectedValidationResults.eligibility_results.requirements_not_met.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {selectedValidationResults.eligibility_results.warnings && selectedValidationResults.eligibility_results.warnings.length > 0 && (
                      <div className="requirements-section">
                        <h4>⚠️ Eligibility Warnings</h4>
                        <ul className="requirements-list warnings">
                          {selectedValidationResults.eligibility_results.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;