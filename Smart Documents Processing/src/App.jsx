import React, { useState } from 'react';
import Dashboard from './Dashboard';
import BatchFileUploader from './BatchFileUploader';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const actorId = "actor_123"; // Example actor ID

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-section">
          <div className="logo">
            <span className="logo-text">CHANDIGARH UNIVERSITY</span>
            <span className="logo-subtitle">Discover. Learn. Empower.</span>
          </div>
        </div>
        
        <nav className="main-navigation">
          <button 
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-tab ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            📁 Upload Documents
          </button>
        </nav>
      </header>
      
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'upload' && <BatchFileUploader actorId={actorId} />}
      </main>
    </div>
  );
}

export default App;