import React from 'react';

const Dashboard = ({ onSectionChange }) => {
  const dashboardCards = [
    {
      icon: '📤',
      title: 'Submit for Shortlisting',
      description: 'Upload Job & Resume',
      gradient: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:border-blue-300',
      action: () => onSectionChange('submit')
    },
    {
      icon: '📄',
      title: 'View Resume',
      description: 'Preview + QnA results',
      gradient: 'from-green-500 to-green-600',
      hoverColor: 'hover:border-green-300',
      action: () => onSectionChange('view-resumes')
    },
    {
      icon: '📧',
      title: 'Send Email',
      description: 'Send Email',
      gradient: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:border-purple-300',
      action: () => onSectionChange('view-resumes')
    },
    {
      icon: '⬇️',
      title: 'Download Report',
      description: 'Download Report',
      gradient: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:border-orange-300',
      action: () => alert('Download functionality coming soon')
    },
    {
      icon: '👥',
      title: 'Career Opportunities',
      description: 'Join Our Team',
      gradient: 'from-indigo-500 to-indigo-600',
      hoverColor: 'hover:border-indigo-300',
      action: () => window.open('/career.html', '_blank')
    },
    {
      icon: '🌐',
      title: 'Visit Operisoft',
      description: 'Our Company Website',
      gradient: 'from-teal-500 to-teal-600',
      hoverColor: 'hover:border-teal-300',
      action: () => window.open('https://operisoft.com', '_blank')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dashboardCards.map((card, index) => (
        <div
          key={index}
          onClick={card.action}
          className={`group p-6 bg-white rounded-2xl border border-gray-200 cursor-pointer hover:shadow-xl ${card.hoverColor} transition-all duration-300 transform hover:-translate-y-1 select-none`}
        >
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${card.gradient} rounded-2xl text-white shadow-lg group-hover:scale-110 transition-all duration-300`}>
              <span className="text-3xl">{card.icon}</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xl group-hover:text-blue-700 transition-colors">
                {card.title}
              </h3>
              <p className="text-gray-600 mt-1 group-hover:text-gray-700">
                {card.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
