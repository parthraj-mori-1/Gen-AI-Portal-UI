import React from 'react';

const ReviewModal = ({ isOpen, onClose, onConfirm, formData, selectedPriority, uploadedFiles }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Review Submission</h3>
          
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Job Designation</p>
              <p className="text-gray-900">{formData.designation || 'Not specified'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Top Candidates</p>
                <p className="text-gray-900">{formData.top_candidates}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Min Threshold</p>
                <p className="text-gray-900">{formData.min_threshold}%</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Priority Mode</p>
              <p className="text-gray-900 capitalize">{selectedPriority}</p>
            </div>
            
            {selectedPriority !== 'internship' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Experience Range</p>
                <p className="text-gray-900">{formData.min_experience} - {formData.max_experience} years</p>
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Must-Have Skills</p>
              <p className="text-gray-900">{formData.must_have_skills || 'None'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Nice-to-Have Skills</p>
              <p className="text-gray-900">{formData.nice_to_have_skills || 'None'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Job Description</p>
              <p className="text-gray-900 text-sm max-h-32 overflow-y-auto">
                {formData.gd || 'None'}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Resume Source</p>
              {formData.s3_path ? (
                <p className="text-gray-900 text-sm break-all">{formData.s3_path}</p>
              ) : (
                <p className="text-gray-900">
                  {uploadedFiles.length} file(s) uploaded
                  {uploadedFiles.length > 0 && (
                    <span className="block text-xs text-gray-600 mt-1">
                      {uploadedFiles.slice(0, 3).map(f => f.name).join(', ')}
                      {uploadedFiles.length > 3 && ` and ${uploadedFiles.length - 3} more...`}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Edit
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Confirm & Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
