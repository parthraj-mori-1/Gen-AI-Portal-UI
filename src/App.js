import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import './index.css';

// Import project components
import RecruiterAI from './projects/other/RecruiteAI/RecruiterAI';
import HealthcareReferral from './projects/healthcare/HealthcareReferrel/Homereferrel';
import PatientSummary from './projects/healthcare/PatientSummary/PatientSummary';
import MedicalAssistant from './projects/healthcare/MedicalAssistant/MedicalAssistant';
import Health from './projects/healthcare/Health/Health';
import SmartPolicy from './projects/transportation/SmartPolicy/SmartPolicy';
import ImmigrationInfo from './projects/Education/Immigration/immigrationinfo';
import VoiceBot from './projects/other/VoiceBot/VoiceBot';
import SmartDocuments from './projects/Education/SmartDocuments/SmartDocuments';

// Configure Amplify from environment variables
const amplifyConfig = {
  Auth: {
    Cognito: {
      region: process.env.REACT_APP_AWS_REGION,
      userPoolId: process.env.REACT_APP_USER_POOL_ID,
      userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
    }
  }
};
console.log(amplifyConfig);
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
                  <Route path="/healthcare/patient-summary" element={<PatientSummary />} />
                  <Route path="/healthcare/medical-assistant" element={<MedicalAssistant />} />
                  <Route path="/healthcare/health" element={<Health />} />
                  
                  {/* Data Extraction Projects */}
                  <Route path="/Education/smart-documents" element={<SmartDocuments />} />
                  
                  {/* Other Projects */}
                  <Route path="/other/recruiterai" element={<RecruiterAI />} />
                  <Route path="/Education/immigration" element={<ImmigrationInfo />} />
                  <Route path="/other/voicebot" element={<VoiceBot />} />

                  {/* Transportation Projects */}
                  <Route path="/transportation/smart-policy" element={<SmartPolicy />} />
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