import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, BarChart3, Headphones, Code, Palette } from 'lucide-react';

const TeamSection = ({ selectedTeam, onTeamChange }) => {
  const teams = [
    { id: 'all', name: 'All Teams', icon: Users, count: 24, color: 'bg-gray-500' },
    { id: 'sales', name: 'Sales', icon: Briefcase, count: 8, color: 'bg-blue-500' },
    { id: 'marketing', name: 'Marketing', icon: BarChart3, count: 6, color: 'bg-green-500' },
    { id: 'support', name: 'Support', icon: Headphones, count: 4, color: 'bg-purple-500' },
    { id: 'engineering', name: 'Engineering', icon: Code, count: 5, color: 'bg-orange-500' },
    { id: 'design', name: 'Design', icon: Palette, count: 1, color: 'bg-pink-500' }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Teams & Projects</h2>
      <div className="flex flex-wrap gap-3">
        {teams.map((team, index) => (
          <motion.button
            key={team.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => onTeamChange(team.id)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg border transition-all duration-200 ${
              selectedTeam === team.id
                ? 'bg-primary-50 border-primary-200 text-primary-700'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className={`p-2 rounded-lg ${team.color}`}>
              <team.icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium">{team.name}</p>
              <p className="text-sm text-gray-500">{team.count} projects</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default TeamSection;