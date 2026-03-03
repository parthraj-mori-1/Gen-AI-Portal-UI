import React, { useState } from 'react';
import PdfViewerModal from './PdfViewerModal';

const ViewResumesSection = ({ lastResponse }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  
  console.log('ViewResumesSection - lastResponse:', lastResponse);

  if (!lastResponse) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold mb-4">Resume & Reports</h3>
        <p className="text-gray-600">No results yet. Please submit a job for shortlisting first.</p>
      </div>
    );
  }

  const { shortlisted = [], special_consideration = [], rejected = [], summary = {} } = lastResponse;
  
  console.log('Shortlisted:', shortlisted.length);
  console.log('Special consideration:', special_consideration.length);
  console.log('Rejected:', rejected.length);
  
  // Process regular shortlisted candidates (exclude special consideration from shortlisted array)
  const regularShortlisted = shortlisted.filter(candidate => {
    const isSpecialConsideration = candidate.shortlist_reason && 
      candidate.shortlist_reason.includes("Experience criteria not matching, but all must-have skills are present");
    return !isSpecialConsideration;
  });
  
  // Collect all special consideration candidates
  const specialConsiderationCandidates = [
    // From shortlisted array
    ...shortlisted.filter(candidate => 
      candidate.shortlist_reason && 
      candidate.shortlist_reason.includes("Experience criteria not matching, but all must-have skills are present")
    ),
    // From special_consideration array
    ...(special_consideration || []),
    // From rejected array
    ...(rejected || []).filter(candidate => 
      candidate.reason && 
      candidate.reason.includes("Experience criteria not matching, but all must-have skills are present")
    ).map(candidate => ({
      filename: candidate.filename,
      percent: candidate.score || 0,
      shortlist_reason: candidate.reason,
      rejection_reason: candidate.reason,
      experience_check: { job_relevant_years: candidate.experience_years || "N/A" },
      must_have_matched: candidate.skills_matched || [],
      must_have_missing: candidate.skills_missing || [],
      nice_to_have_matched: [],
      email: candidate.email || "Not Found",
      phone: candidate.phone || "Not Found",
      name: candidate.name || "Not Found",
      s3_url: candidate.s3_url || "",
      resume_text: candidate.resume_text || ""
    }))
  ];

  const handleViewResume = (candidate) => {
    setSelectedCandidate(candidate);
    setShowPdfModal(true);
  };

  const handleSendNotification = (candidate, isSpecialConsideration) => {
    const subject = isSpecialConsideration 
      ? 'Special Consideration - Job Application' 
      : 'Congratulations - You are Shortlisted!';
    
    const body = isSpecialConsideration
      ? `Dear Candidate,\n\nWe have reviewed your application for the position and would like to give you special consideration.\n\nWhile your experience level may not fully match our initial criteria, your skills are impressive and we would like to discuss this opportunity with you.\n\nPlease let us know if you are interested.\n\nBest regards`
      : `Dear Candidate,\n\nCongratulations! You have been shortlisted for the position.\n\nWe were impressed with your qualifications and would like to proceed to the next stage of the interview process.\n\nWe will contact you soon with further details.\n\nBest regards`;
    
    if (candidate.email && candidate.email !== 'Not Found') {
      window.location.href = `mailto:${candidate.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      alert('Email address not available for this candidate.');
    }
  };

  const renderCandidateCard = (candidate, isSpecialConsideration) => {
    const cardClass = isSpecialConsideration 
      ? "candidate-card p-4 rounded-lg border border-orange-300 bg-orange-50" 
      : "candidate-card p-4 rounded-lg border";
    
    return (
      <div key={candidate.filename} className={cardClass}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-gray-800">{candidate.filename}</h3>
          <span className="match-badge px-3 py-1 rounded-full text-sm font-medium">
            {candidate.percent}% Match
          </span>
        </div>
        
        <div className={`mb-3 p-3 rounded-lg ${
          isSpecialConsideration 
            ? 'bg-orange-100 border border-orange-300' 
            : 'bg-green-50 border border-green-200'
        }`}>
          <p className={`font-semibold ${
            isSpecialConsideration ? 'text-orange-800' : 'text-green-800'
          }`}>
            {isSpecialConsideration ? '⚠️ SPECIAL CONSIDERATION' : '✅ SHORTLISTED'}
          </p>
          <p className={`text-sm ${
            isSpecialConsideration ? 'text-orange-700' : 'text-green-700'
          }`}>
            <strong>Reason:</strong> {candidate.shortlist_reason || candidate.reason || 'Shortlisted'}
          </p>
          {candidate.rejection_reason && (
            <p className="text-sm text-red-600">
              <strong>Details:</strong> {candidate.rejection_reason}
            </p>
          )}
        </div>
        
        <p><strong>Name:</strong> {candidate.name || 'Not Found'}</p>
        <p><strong>Email:</strong> {candidate.email || 'Not Found'}</p>
        <p><strong>Phone:</strong> {candidate.phone || 'Not Found'}</p>
        <p><strong>Final Score:</strong> {candidate.percent}%</p>
        
        {candidate.experience_check && candidate.experience_check.job_relevant_years !== undefined && (
          <div className="mt-2 p-2 bg-gray-50 rounded">
            <p><strong>Job-Relevant Experience:</strong> {candidate.experience_check.job_relevant_years} years</p>
            {candidate.experience_check.confidence && (
              <p className="text-xs text-gray-600">Confidence: {candidate.experience_check.confidence}</p>
            )}
          </div>
        )}
        
        {candidate.must_have_matched && candidate.must_have_matched.length > 0 && (
          <div className="mt-2 p-2 bg-gray-50 rounded">
            <p className="text-green-700 text-sm">✅ Skills Found: {candidate.must_have_matched.join(', ')}</p>
          </div>
        )}
        
        {candidate.must_have_missing && candidate.must_have_missing.length > 0 && (
          <div className="mt-2 p-2 bg-gray-50 rounded">
            <p className="text-red-700 text-sm">❌ Skills Missing: {candidate.must_have_missing.join(', ')}</p>
          </div>
        )}
        
        {candidate.nice_to_have_matched && candidate.nice_to_have_matched.length > 0 && (
          <div className="mt-2 p-2 bg-blue-50 rounded">
            <p className="text-blue-700 text-sm">🌟 Bonus Skills: {candidate.nice_to_have_matched.join(', ')}</p>
          </div>
        )}
        
        <div className="mt-3 flex space-x-2">
          <button 
            onClick={() => handleViewResume(candidate)}
            className="btn-primary px-4 py-2 rounded-lg text-sm"
          >
            📄 View Resume
          </button>
          <button 
            onClick={() => handleSendNotification(candidate, isSpecialConsideration)}
            className={`px-4 py-2 rounded-lg text-sm ${
              isSpecialConsideration 
                ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                : 'btn-success'
            }`}
          >
            📧 Send Notification
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Shortlisting Results</h2>
      
      {/* Summary Section */}
      {summary && Object.keys(summary).length > 0 && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <p><strong>Total Resumes:</strong> {summary.total_resumes || 0}</p>
          <p><strong>Role-Relevant:</strong> {summary.role_relevant || 0}</p>
          <p><strong>Processed:</strong> {summary.processed || 0}</p>
          <p><strong>Shortlisted:</strong> {summary.shortlisted || 0}</p>
          <p><strong>Top Candidates:</strong> {summary.top_returned || 0}</p>
        </div>
      )}
      
      {regularShortlisted.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3">
              ✅ {regularShortlisted.length}
            </span>
            Shortlisted Candidates
          </h3>
          <div className="space-y-4">
            {regularShortlisted.map(candidate => renderCandidateCard(candidate, false))}
          </div>
        </div>
      )}
      
      {specialConsiderationCandidates.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-orange-800 mb-4 mt-6 flex items-center">
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mr-3">
              ⚠️ {specialConsiderationCandidates.length}
            </span>
            Special Consideration
          </h3>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
            <p className="text-orange-800 text-sm">
              <strong>Note:</strong> These candidates have all required skills but don't meet experience criteria.
            </p>
          </div>
          <div className="space-y-4">
            {specialConsiderationCandidates.map(candidate => renderCandidateCard(candidate, true))}
          </div>
        </div>
      )}
      
      {regularShortlisted.length === 0 && specialConsiderationCandidates.length === 0 && (
        <div className="text-center py-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 text-lg mb-4">No candidates met the shortlisting criteria.</p>
          {summary && (
            <div className="mt-4 text-sm text-gray-500">
              <p>Total resumes processed: {summary.total_resumes || 0}</p>
              <p>Role-relevant: {summary.role_relevant || 0}</p>
            </div>
          )}
        </div>
      )}
      
      <PdfViewerModal
        isOpen={showPdfModal}
        onClose={() => {
          setShowPdfModal(false);
          setSelectedCandidate(null);
        }}
        candidate={selectedCandidate}
      />
    </div>
  );
};

export default ViewResumesSection;
