import React, { useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import BatchFileUploader from './BatchFileUploader';
import './SmartDocuments.css';

const SmartDocuments = () => {
  const { user } = useAuthenticator();
  const [activeTab, setActiveTab] = useState('dashboard');
  const actorId = user?.username || `actor_${Date.now()}`;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="smart-documents-app">
      <header className="smart-documents-header">
        <div className="smart-documents-logo-section">
          <div className="smart-documents-logo">
            <div className="logo-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <path d="M12 18v-6"/>
                <path d="M9 15l3 3 3-3"/>
              </svg>
            </div>
            <div>
              <span className="smart-documents-logo-text">Smart Documents Processing</span>
              <span className="smart-documents-logo-subtitle">AI-Powered Document Analysis & Validation</span>
            </div>
          </div>
        </div>
        
        <nav className="smart-documents-navigation">
          <button 
            className={`smart-documents-nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </button>
          <button 
            className={`smart-documents-nav-tab ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload Documents
          </button>
        </nav>
      </header>
      
      <main className="smart-documents-main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'upload' && <BatchFileUploader actorId={actorId} />}
      </main>
    </div>
  );
};

export default SmartDocuments;
