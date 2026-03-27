import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const sectionConfig = {
  healthcare:   { color: '#10b981', bg: '#ecfdf5', text: '#065f46', tagBg: '#d1fae5', label: 'Healthcare'    },
  education:    { color: '#3b82f6', bg: '#eff6ff', text: '#1e40af', tagBg: '#dbeafe', label: 'Education'     },
  transportation:{ color: '#f59e0b', bg: '#fffbeb', text: '#78350f', tagBg: '#fef3c7', label: 'Transportation'},
  fintech:      { color: '#ec4899', bg: '#fdf2f8', text: '#831843', tagBg: '#fce7f3', label: 'Fintech'       },
  other:        { color: '#8b5cf6', bg: '#f5f3ff', text: '#4c1d95', tagBg: '#ede9fe', label: 'Other'         },
  security:     { color: '#64748b', bg: '#f1f5f9', text: '#1e293b', tagBg: '#e2e8f0', label: 'Security'      },
};

const ProjectCard = ({ project, onProjectClick }) => {
  const cfg = sectionConfig[project.section] || sectionConfig.other;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.10)' }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={() => onProjectClick(project)}
      className="group bg-white rounded-2xl cursor-pointer flex flex-col"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}
    >
      {/* Colored top accent bar */}
      <div className="h-1 w-full rounded-t-2xl flex-shrink-0" style={{ background: cfg.color }} />

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Badge + status */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: cfg.bg, color: cfg.text }}>
            {cfg.label}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${project.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'}`}>
            ● {project.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-gray-700 transition-colors line-clamp-2">
          {project.title}
        </h3>

        {/* Description — fixed 2 lines */}
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Tags — max 1 row, overflow hidden */}
        <div className="flex flex-wrap gap-1.5 overflow-hidden" style={{ maxHeight: '1.75rem' }}>
          {project.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-md font-medium whitespace-nowrap" style={{ background: cfg.tagBg, color: cfg.text }}>
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 whitespace-nowrap">
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer — always at bottom */}
        <div className="flex items-center justify-end pt-2 border-t border-gray-50 mt-auto">
          <motion.span
            whileHover={{ x: 2 }}
            className="flex items-center gap-0.5 text-xs font-semibold"
            style={{ color: cfg.color }}
          >
            Open <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
