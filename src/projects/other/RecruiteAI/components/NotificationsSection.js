import React from 'react';

const NotificationsSection = ({ shortlistedCandidates }) => {
  const handleSendEmail = (candidate, isSpecialConsideration) => {
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

  if (shortlistedCandidates.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold mb-4">Notifications</h3>
        <p className="text-gray-600">No shortlisted candidates yet.</p>
      </div>
    );
  }

  const regularCandidates = shortlistedCandidates.filter(c => !c.isSpecialConsideration);
  const specialCandidates = shortlistedCandidates.filter(c => c.isSpecialConsideration);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Shortlisted Candidates</h2>
      
      {regularCandidates.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            ✅ Regular Shortlisted ({regularCandidates.length})
          </h3>
          <div className="space-y-3">
            {regularCandidates.map(candidate => (
              <div
                key={candidate.filename}
                className="candidate-card p-4 rounded-lg border border-green-200 bg-green-50 flex justify-between items-center"
              >
                <div>
                  <h4 className="text-lg font-medium text-gray-800">{candidate.filename}</h4>
                  <p className="text-sm text-gray-600">
                    📧 {candidate.email || 'Not Found'} | 📞 {candidate.phone || 'Not Found'}
                  </p>
                </div>
                <button 
                  onClick={() => handleSendEmail(candidate, false)}
                  className="btn-success px-4 py-2 rounded-lg text-sm"
                >
                  📧 Send Email
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {specialCandidates.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-orange-800 mb-3">
            ⚠️ Special Consideration ({specialCandidates.length})
          </h3>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
            <p className="text-orange-800 text-sm">
              <strong>Note:</strong> These candidates have all required skills but don't meet experience criteria.
            </p>
          </div>
          <div className="space-y-3">
            {specialCandidates.map(candidate => (
              <div
                key={candidate.filename}
                className="candidate-card p-4 rounded-lg border border-orange-200 bg-orange-50 flex justify-between items-center"
              >
                <div>
                  <h4 className="text-lg font-medium text-gray-800">{candidate.filename}</h4>
                  <p className="text-sm text-gray-600">
                    📧 {candidate.email || 'Not Found'} | 📞 {candidate.phone || 'Not Found'}
                  </p>
                </div>
                <button 
                  onClick={() => handleSendEmail(candidate, true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  📧 Send Special Email
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsSection;
