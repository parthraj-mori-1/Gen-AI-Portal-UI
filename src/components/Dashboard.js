import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthenticator } from '@aws-amplify/ui-react';
import Header from './Header';
import ProjectGrid from './ProjectGrid';

const Dashboard = () => {
  const { user, signOut } = useAuthenticator();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f5f7' }}>
      {/* Subtle background image */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/bg-genai.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3,
        }}
      />

      <div className="relative z-10 flex flex-col h-screen">
        <Header user={user} signOut={signOut} />
        <div className="flex flex-1 overflow-hidden">
          <main
            className="flex-1 overflow-hidden transition-all duration-300 ease-in-out"
            style={{ marginLeft: sidebarExpanded ? '220px' : '68px' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="h-[calc(100vh-64px)]"
            >
              <ProjectGrid onSidebarToggle={setSidebarExpanded} />
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
