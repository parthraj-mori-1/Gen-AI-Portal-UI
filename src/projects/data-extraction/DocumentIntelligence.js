import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate } from 'react-router-dom';

const DocumentIntelligence = () => {
  const { user } = useAuthenticator();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Your Document Intelligence HTML content goes here */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Document Intelligence - Data Extraction
        </h1>
        <p className="text-gray-600 mb-6">
          Welcome, {user?.attributes?.given_name || user?.username}
        </p>
        
        {/* Add your existing HTML content here */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Project Content</h2>
          <p>Your Document Intelligence application content goes here...</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentIntelligence;
