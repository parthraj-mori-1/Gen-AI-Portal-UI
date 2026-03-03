import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import './index.css';

// Import project components
import RecruiterAI from './projects/other/RecruiteAI/RecruiterAI';
import DocumentIntelligence from './projects/data-extraction/DocumentIntelligence';
import HealthcareReferral from './projects/healthcare/HealthcareReferrel/Homereferrel';
import ImmigrationInfo from './projects/other/Immigration/immigrationinfo';
import VoiceBot from './projects/other/VoiceBot/VoiceBot';
import SmartDocuments from './projects/data-extraction/SmartDocuments/SmartDocuments';

// Configure Amplify (you'll need to replace with your actual config)
const amplifyConfig = {
  Auth: {
    Cognito: {
      region: 'ap-south-1', // Replace with your region
      userPoolId: 'ap-south-1_sBSozx8RE', // Replace with your User Pool ID
      userPoolClientId: '6ks7ck0huoeiqblvbd5ba4sume', // Replace with your App Client ID
    }
  }
};

Amplify.configure(amplifyConfig);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes with Authentication */}
          <Route path="/*" element={
            <Authenticator.Provider>
              <Authenticator hideSignUp={true} variation="modal">
                <Routes>
                  {/* Dashboard */}
                  <Route path="/" element={<Dashboard />} />
                  
                  {/* Healthcare Projects */}
                  <Route path="/healthcare/referral" element={<HealthcareReferral />} />
                  
                  {/* Data Extraction Projects */}
                  <Route path="/data-extraction/document-intelligence" element={<DocumentIntelligence />} />
                  <Route path="/data-extraction/smart-documents" element={<SmartDocuments />} />
                  
                  {/* Other Projects */}
                  <Route path="/other/recruiterai" element={<RecruiterAI />} />
                  <Route path="/other/immigration" element={<ImmigrationInfo />} />
                  <Route path="/other/voicebot" element={<VoiceBot />} />
                </Routes>
              </Authenticator>
            </Authenticator.Provider>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;