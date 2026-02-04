import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { FolderOpen, Heart, Database } from 'lucide-react';

const ProjectGrid = ({ selectedSection, onSidebarToggle }) => {
  const [activeSection, setActiveSection] = useState('all');

  const handleMouseEnter = () => {
    onSidebarToggle(true);
  };

  const handleMouseLeave = () => {
    onSidebarToggle(false);
  };

  // Project sections
  const sections = [
    {
      id: 'all',
      name: 'All Projects',
      icon: FolderOpen,
      color: 'bg-gray-500',
      description: 'View all available projects'
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: Heart,
      color: 'bg-green-500',
      description: 'Healthcare and wellness AI applications'
    },
    {
      id: 'data-extraction',
      name: 'Data Extraction',
      icon: Database,
      color: 'bg-blue-500',
      description: 'Intelligent data processing and extraction'
    },
    {
      id: 'other',
      name: 'Other',
      icon: Database,
      color: 'bg-blue-500',
      description: 'Intelligent data processing and extraction'
    }
  ];

  // Mock project data organized by sections
  const projects = [
    // Healthcare Projects
    {
      id: 1,
      title: 'Medical Diagnosis AI',
      description: 'Advanced medical imaging analysis and diagnosis assistance system for healthcare professionals.',
      section: 'healthcare',
      status: 'active',
      url: 'https://medical-ai.company.com',
      lastUpdated: '5 hours ago',
      members: 12,
      tags: ['Medical', 'Diagnosis', 'Imaging']
    },
    {
      id: 2,
      title: 'Patient Care Assistant',
      description: 'Intelligent patient care management system with predictive analytics for better health outcomes.',
      section: 'healthcare',
      status: 'active',
      url: 'https://patient-care.company.com',
      lastUpdated: '1 hour ago',
      members: 7,
      tags: ['Patient Care', 'Analytics', 'Health']
    },
    {
      id: 3,
      title: 'Drug Discovery Platform',
      description: 'AI-accelerated drug discovery and development platform for pharmaceutical research.',
      section: 'healthcare',
      status: 'development',
      url: 'https://drug-discovery.company.com',
      lastUpdated: '2 days ago',
      members: 15,
      tags: ['Drug Discovery', 'Research', 'Pharma']
    },

    // Data Extraction Projects
    {
      id: 4,
      title: 'Document Intelligence',
      description: 'Intelligent document processing and data extraction from various file formats and sources.',
      section: 'data-extraction',
      status: 'active',
      url: 'https://doc-intel.company.com',
      lastUpdated: '4 hours ago',
      members: 6,
      tags: ['Document Processing', 'OCR', 'Data Mining']
    },
    {
      id: 5,
      title: 'Web Data Harvester',
      description: 'Automated web scraping and data extraction platform with intelligent content recognition.',
      section: 'data-extraction',
      status: 'active',
      url: 'https://web-harvester.company.com',
      lastUpdated: '30 minutes ago',
      members: 9,
      tags: ['Web Scraping', 'Data Collection', 'Automation']
    },
    {
      id: 6,
      title: 'Database Analyzer',
      description: 'Advanced database analysis and insight extraction tool for large-scale data processing.',
      section: 'data-extraction',
      status: 'active',
      url: 'https://db-analyzer.company.com',
      lastUpdated: '6 hours ago',
      members: 11,
      tags: ['Database', 'Analytics', 'Big Data']
    },

    // Additional projects for "All Projects"
    {
      id: 7,
      title: 'Customer Insights AI',
      description: 'Advanced analytics platform for customer behavior prediction and segmentation.',
      section: 'other',
      status: 'active',
      url: 'https://insights.company.com',
      lastUpdated: '2 hours ago',
      members: 8,
      tags: ['Analytics', 'ML', 'Customer Data']
    },
    {
      id: 8,
      title: 'Content Generator Pro',
      description: 'AI-powered content creation tool for marketing campaigns and social media.',
      section: 'other',
      status: 'active',
      url: 'https://content.company.com',
      lastUpdated: '1 day ago',
      members: 5,
      tags: ['Content', 'NLP', 'Marketing']
    }
  ];

  const getFilteredProjects = () => {
    if (activeSection === 'all') {
      return projects;
    }
    return projects.filter(project => project.section === activeSection);
  };

  const filteredProjects = getFilteredProjects();

  return (
    <>
      {/* Fixed Expandable Vertical Toolbar - Immediate positioning */}
      <div 
        className="fixed left-0 top-20 bottom-0 z-30 w-16 hover:w-64 bg-gradient-to-b from-gray-50 to-white shadow-xl border-r border-gray-200 transition-all duration-300 group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ 
          transform: 'translateZ(0)', // Force hardware acceleration
          willChange: 'width' // Optimize for width changes
        }}
      >
        <div className="p-3 pt-6 h-full">
          <div className="space-y-3">
            {sections.map((section, index) => (
              <motion.button
                key={section.id}
                initial={false} // Prevent initial animation on mount
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center rounded-xl transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:shadow-md'
                }`}
              >
                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <section.icon className={`w-5 h-5 ${
                    activeSection === section.id ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden min-w-0">
                  <p className={`font-semibold text-sm ${
                    activeSection === section.id ? 'text-white' : 'text-gray-800'
                  }`}>
                    {section.name}
                  </p>
                  <p className={`text-xs ${
                    activeSection === section.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {section.id === 'all' ? projects.length : 
                     section.id === 'healthcare' ? projects.filter(p => p.section === 'healthcare').length :
                     section.id === 'other' ? projects.filter(p => p.section === 'other').length :
                     section.id === 'data-extraction' ? projects.filter(p => p.section === 'data-extraction').length : 0} projects
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - No layout shift */}
      <div className="h-full overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-4">
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={false} // Prevent layout shift on mount
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <ProjectCard 
                    project={project}
                  />
                </motion.div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <motion.div
                initial={false}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-gray-400 mb-4">
                  <FolderOpen className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-500">No projects available for the selected section.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectGrid;