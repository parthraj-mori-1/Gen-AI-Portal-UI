import React from 'react';
import { motion } from 'framer-motion';
import { 
  ExternalLink, 
  Users
} from 'lucide-react';

const ProjectCard = ({ project }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'development':
        return 'bg-yellow-100 text-yellow-800';
      case 'beta':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSectionColor = (section) => {
    switch (section) {
      case 'healthcare':
        return 'bg-gradient-to-r from-green-400 to-emerald-500';
      case 'data-extraction':
        return 'bg-gradient-to-r from-blue-400 to-cyan-500';
      case 'other':
        return 'bg-gradient-to-r from-purple-400 to-pink-500';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  const handleProjectAccess = (e) => {
    e.stopPropagation();
    // Generate secure token and redirect
    const token = generateSecureToken(project.id);
    window.open(`${project.url}?token=${token}`, '_blank');
  };

  const generateSecureToken = (projectId) => {
    // This would be replaced with actual JWT token generation
    return `secure_token_${projectId}_${Date.now()}`;
  };

  return (
    <motion.div
      whileHover={{ y: -4, shadow: "0 15px 35px -5px rgba(0, 0, 0, 0.15)" }}
      className="card p-4 group transition-all duration-300 hover:border-primary-200"
    >
      {/* Project Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${getSectionColor(project.section)} shadow-sm`}></div>
            <span className="text-xs font-medium text-gray-600 capitalize">
              {project.section.replace('-', ' ')}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)} shadow-sm`}>
              {project.status}
            </span>
          </div>
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {project.title}
          </h3>
        </div>
      </div>

      {/* Project Description */}
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {project.description}
      </p>

      {/* Project Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {project.tags.slice(0, 2).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-0.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 text-xs rounded-md border border-gray-200 hover:border-gray-300 transition-colors"
          >
            {tag}
          </span>
        ))}
        {project.tags.length > 2 && (
          <span className="px-2 py-0.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 text-xs rounded-md border border-blue-200">
            +{project.tags.length - 2}
          </span>
        )}
      </div>

      {/* Project Footer */}
      <div className="flex items-center justify-end">
        <button
          onClick={handleProjectAccess}
          className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-xs rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <ExternalLink className="w-3 h-3" />
          <span>Access</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ProjectCard;