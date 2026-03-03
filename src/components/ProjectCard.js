import { motion } from 'framer-motion';
import { 
  ExternalLink
} from 'lucide-react';

const ProjectCard = ({ project, onProjectClick }) => {
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
    if (onProjectClick) {
      onProjectClick(project);
    }
  };

  const handleCardClick = () => {
    if (onProjectClick) {
      onProjectClick(project);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card p-4 group transition-all duration-300 hover:border-primary-200 cursor-pointer h-full flex flex-col"
      onClick={handleCardClick}
    >
      {/* Project Header */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${getSectionColor(project.section)}`}></div>
          <span className="text-xs font-medium text-gray-600 capitalize">
            {project.section.replace('-', ' ')}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
          {project.title}
        </h3>
      </div>

      {/* Project Description */}
      <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-2">
        {project.description}
      </p>

      {/* Project Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {project.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
          >
            {tag}
          </span>
        ))}
        {project.tags.length > 3 && (
          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">
            +{project.tags.length - 3}
          </span>
        )}
      </div>

      {/* Project Footer */}
      <div className="flex items-center justify-end mt-auto">
        <button
          onClick={handleProjectAccess}
          className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          <span>View Details</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ProjectCard;