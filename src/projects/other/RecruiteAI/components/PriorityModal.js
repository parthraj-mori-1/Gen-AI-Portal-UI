import React, { useEffect, useRef } from 'react';

const PriorityModal = ({ selectedPriority, onSelect, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const priorities = [
    {
      id: 'experience',
      icon: '📅',
      title: 'Experience Priority',
      description: 'Shortlist by Experience first, then Must-Have Skills. Recommended for senior/professional roles.',
      color: 'purple'
    },
    {
      id: 'skills',
      icon: '🔑',
      title: 'Skills Priority',
      description: 'Shortlist by Must-Have Skills first, then Experience. Recommended for technical/skills-based roles.',
      color: 'blue'
    },
    {
      id: 'internship',
      icon: '🧑‍🎓',
      title: 'Internship',
      description: 'For Internship roles: No experience required, only skills considered. Experience section will be disabled.',
      color: 'green'
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        ref={modalRef}
        className="glass-card-priority max-w-md w-full p-8 rounded-xl shadow-2xl relative animate-fadeInScale"
        style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)',
          outline: 'none'
        }}
        tabIndex={0}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">
          Shortlisting Priority
        </h2>
        <p className="mb-6 text-gray-700 text-center">
          How would you like to prioritize candidate shortlisting?
        </p>
        <div className="space-y-4">
          {priorities.map(priority => (
            <button
              key={priority.id}
              type="button"
              onClick={() => onSelect(priority.id)}
              className={`w-full py-3 px-4 rounded-lg border-2 font-semibold transition flex items-center justify-between focus:ring-2 ${
                selectedPriority === priority.id
                  ? `border-${priority.color}-500 bg-${priority.color}-100 text-${priority.color}-700`
                  : `border-${priority.color}-500 bg-${priority.color}-50 hover:bg-${priority.color}-100 text-${priority.color}-700`
              }`}
              style={{
                borderColor: priority.color === 'purple' ? '#a855f7' : priority.color === 'blue' ? '#3b82f6' : '#10b981',
                backgroundColor: selectedPriority === priority.id 
                  ? (priority.color === 'purple' ? '#f3e8ff' : priority.color === 'blue' ? '#eff6ff' : '#ecfdf5')
                  : (priority.color === 'purple' ? '#faf5ff' : priority.color === 'blue' ? '#eff6ff' : '#f0fdf4')
              }}
            >
              <span>
                <span className="inline-block mr-2">{priority.icon}</span>
                {priority.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriorityModal;
