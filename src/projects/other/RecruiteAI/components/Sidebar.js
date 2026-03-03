import React from 'react';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'submit', icon: '📄', label: 'Submit for Shortlisting' },
    { id: 'view-resumes', icon: '📁', label: 'View Resume & Reports' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' }
  ];

  return (
    <aside className="w-72 p-6 flex flex-col gap-8 select-none" style={{
      background: 'linear-gradient(180deg, #1e293b 0%, #334155 100%)',
      borderRight: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
          <span className="text-white text-xl">⚡</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">RecruiterAI</h1>
      </div>
      
      <nav className="flex flex-col gap-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeSection === item.id
                ? 'text-white bg-white/15 backdrop-blur-sm border border-white/20 font-semibold'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
