import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import './index.css';

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
          <Route path="/*" element={
            <Authenticator.Provider>
              <Authenticator hideSignUp={true} variation="modal">
                <Dashboard />
              </Authenticator>
            </Authenticator.Provider>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;