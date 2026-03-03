import React from 'react';

const ProcessingOverlay = ({ selectedPriority }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-xl text-center max-w-lg shadow-2xl">
        <div className="loading-spinner mx-auto mb-4" style={{ width: '48px', height: '48px' }}></div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Processing Resumes</h3>
        <p className="text-gray-600 mb-4">
          Please wait while we process your resumes with parallel processing optimization...
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
          <p className="text-sm font-medium text-blue-800 mb-2">Smart Batch Processing Active:</p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Auto-calculating optimal batch sizes</li>
            <li>• CPU-aware parallel processing</li>
            <li>• Analyzing resume content and extracting experience</li>
            <li>• Evaluating skills against requirements</li>
            <li>• Applying {selectedPriority} priority rules</li>
            <li>• Calculating final scores with AI optimization</li>
          </ul>
        </div>
        <div className="mt-3 text-xs text-gray-500 text-center">
          ⚡ Optimized for faster processing with concurrent analysis
        </div>
      </div>
    </div>
  );
};

export default ProcessingOverlay;
