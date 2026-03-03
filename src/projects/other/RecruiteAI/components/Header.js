import React from 'react';

const Header = ({ activeSection, user, onNotificationClick, notificationCount = 0 }) => {
  const sectionTitles = {
    dashboard: 'Dashboard',
    submit: 'Submit for Shortlisting',
    'view-resumes': 'View Resume & Reports',
    notifications: 'Notifications'
  };

  const getInitials = () => {
    const name = user?.attributes?.given_name || user?.username || 'U';
    return name.charAt(0).toUpperCase();
  };

  const getDisplayName = () => {
    const name = user?.attributes?.given_name || user?.username || '';
    return name.replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <header className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200/50">
      <h2 className="text-3xl font-bold text-gray-900 select-none tracking-tight">
        {sectionTitles[activeSection]}
      </h2>
      <div className="flex items-center gap-6 select-none">
        <button
          onClick={onNotificationClick}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 relative group"
          aria-label="Notifications"
        >
          <span className="text-xl">🔔</span>
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 cursor-pointer group hover:shadow-md transition-all duration-200">
          <div className="rounded-full w-8 h-8 bg-blue-500 flex items-center justify-center text-white font-bold">
            {getInitials()}
          </div>
          <span className="text-gray-800 font-semibold group-hover:text-blue-700 transition-colors">
            {getDisplayName()}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
