import { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate } from 'react-router-dom';
import './RecruiterAI.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SubmitSection from './components/SubmitSection';
import ViewResumesSection from './components/ViewResumesSection';
import NotificationsSection from './components/NotificationsSection';
import PriorityModal from './components/PriorityModal';
import ProcessingOverlay from './components/ProcessingOverlay';

const RecruiterAI = () => {
  const { user } = useAuthenticator();
  
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedPriority, setSelectedPriority] = useState('experience');
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setShowPriorityModal(true);
  }, []);

  useEffect(() => {
    // Update shortlisted candidates when lastResponse changes
    if (lastResponse) {
      const { shortlisted = [], special_consideration = [], rejected = [] } = lastResponse;
      
      const allCandidates = [];
      
      // Add regular shortlisted
      shortlisted.forEach(candidate => {
        const isSpecialConsideration = candidate.shortlist_reason && 
          candidate.shortlist_reason.includes("Experience criteria not matching, but all must-have skills are present");
        
        if (!isSpecialConsideration) {
          allCandidates.push({
            filename: candidate.filename,
            email: candidate.email || "Not Found",
            phone: candidate.phone || "Not Found",
            isSpecialConsideration: false
          });
        }
      });
      
      // Add special consideration from shortlisted
      shortlisted.forEach(candidate => {
        const isSpecialConsideration = candidate.shortlist_reason && 
          candidate.shortlist_reason.includes("Experience criteria not matching, but all must-have skills are present");
        
        if (isSpecialConsideration) {
          allCandidates.push({
            filename: candidate.filename,
            email: candidate.email || "Not Found",
            phone: candidate.phone || "Not Found",
            isSpecialConsideration: true
          });
        }
      });
      
      // Add from special_consideration array
      if (special_consideration) {
        special_consideration.forEach(candidate => {
          allCandidates.push({
            filename: candidate.filename,
            email: candidate.email || "Not Found",
            phone: candidate.phone || "Not Found",
            isSpecialConsideration: true
          });
        });
      }
      
      // Add from rejected array
      if (rejected) {
        rejected.forEach(candidate => {
          if (candidate.reason && 
              candidate.reason.includes("Experience criteria not matching, but all must-have skills are present")) {
            allCandidates.push({
              filename: candidate.filename,
              email: candidate.email || "Not Found",
              phone: candidate.phone || "Not Found",
              isSpecialConsideration: true
            });
          }
        });
      }
      
      setShortlistedCandidates(allCandidates);
    }
  }, [lastResponse]);

  const handlePrioritySelect = (priority) => {
    setSelectedPriority(priority);
    setShowPriorityModal(false);
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen recruiter-ai-container">
      <div className="app-container">
        <main className="flex w-full overflow-hidden">
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
          
          <section id="main-content" className="flex-grow p-8 flex flex-col overflow-y-auto">
            <Header 
              activeSection={activeSection}
              user={user}
              onNotificationClick={() => setActiveSection('notifications')}
              notificationCount={shortlistedCandidates.length}
            />

            {activeSection === 'dashboard' && (
              <Dashboard onSectionChange={setActiveSection} />
            )}

            {activeSection === 'submit' && (
              <SubmitSection
                selectedPriority={selectedPriority}
                onReselectPriority={() => setShowPriorityModal(true)}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
                setLastResponse={setLastResponse}
                setActiveSection={setActiveSection}
              />
            )}

            {activeSection === 'view-resumes' && (
              <ViewResumesSection
                lastResponse={lastResponse}
              />
            )}

            {activeSection === 'notifications' && (
              <NotificationsSection
                shortlistedCandidates={shortlistedCandidates}
              />
            )}
          </section>
        </main>
      </div>

      {showPriorityModal && (
        <PriorityModal
          selectedPriority={selectedPriority}
          onSelect={handlePrioritySelect}
          onClose={() => setShowPriorityModal(false)}
        />
      )}

      {isSubmitting && <ProcessingOverlay selectedPriority={selectedPriority} />}
    </div>
  );
};

export default RecruiterAI;
