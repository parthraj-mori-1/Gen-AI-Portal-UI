import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthenticator } from '@aws-amplify/ui-react';
import Header from './Header';
import ProjectGrid from './ProjectGrid';

const Dashboard = () => {
  const { user, signOut } = useAuthenticator();
  const [selectedSection, setSelectedSection] = useState('all');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 relative flex flex-col">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `url('/bg-genai.jpeg')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      
      <div className="relative z-10 flex flex-col h-screen">
        <Header user={user} signOut={signOut} />
        
        {/* Fixed Sidebar Placeholder */}
        <div className="fixed left-0 top-20 bottom-0 w-16 z-20 bg-transparent pointer-events-none"></div>
        
        <div className="flex flex-1">
          {/* Main Content with consistent margin */}
          <main className="flex-1 overflow-hidden ml-16 transition-all duration-300" style={{
            marginLeft: sidebarExpanded ? '256px' : '64px'
          }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="h-full flex flex-col"
            >
              {/* Projects Grid */}
              <div className="flex-1 pt-4">
                <ProjectGrid 
                  selectedSection={selectedSection} 
                  onSidebarToggle={setSidebarExpanded}
                />
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;