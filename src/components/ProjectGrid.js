import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import { FolderOpen, Heart, Database, GraduationCap, Truck } from 'lucide-react';

const ProjectGrid = ({ selectedSection, onSidebarToggle }) => {
  const [activeSection, setActiveSection] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

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
      name: 'Education',
      icon: GraduationCap,
      color: 'bg-blue-500',
      description: 'Education and learning AI applications'
    },
    {
      id: 'other',
      name: 'Other',
      icon: Database,
      color: 'bg-blue-500',
      description: 'Intelligent data processing and extraction'
    },
    {
      id: 'transportation',
      name: 'Transportation',
      icon: Truck,
      color: 'bg-orange-500',
      description: 'Transportation and logistics AI applications'
    }
  ];

  // Mock project data organized by sections
  const projects = [
    // Healthcare Projects
    {
      id: 1,
      title: 'Healthcare Referral',
      description: 'Automated home healthcare referral document processing with intelligent data extraction.',
      section: 'healthcare',
      status: 'active',
      url: '/healthcare/referral',
      lastUpdated: '2 hours ago',
      members: 8,
      tags: ['Healthcare', 'Processing', 'Automation'],
      previewImages: ['/Healthcare_ui.png', '/Healthcare-response.png']
    },
    {
      id: 2,
      title: 'Patient Summary Generator',
      description: 'Generate comprehensive patient discharge summaries in PDF format with secure data handling.',
      section: 'healthcare',
      status: 'active',
      url: '/healthcare/patient-summary',
      lastUpdated: '1 hour ago',
      members: 6,
      tags: ['Patient Care', 'PDF Generation', 'Discharge Summary'],
      previewImages: ['/patient-summary-ui.png', '/patient-summary-pdf.png']
    },
    {
      id: 3,
      title: 'Medical Assistant',
      description: 'AI-powered medical assistant for healthcare professionals with advanced diagnostic support and patient interaction.',
      section: 'healthcare',
      status: 'active',
      url: '/healthcare/medical-assistant',
      lastUpdated: '30 minutes ago',
      members: 12,
      tags: ['AI Assistant', 'Diagnostics', 'Medical Support', 'Patient Care'],
      previewImages: ['/medical-assistant-ui.png', '/medical-assistant-chat.png']
    },
    {
      id: 4,
      title: 'Health Platform',
      description: 'Comprehensive healthcare management system with integrated patient care, medical records, and health monitoring.',
      section: 'healthcare',
      status: 'active',
      url: '/healthcare/health',
      lastUpdated: '15 minutes ago',
      members: 10,
      tags: ['Healthcare Platform', 'Patient Management', 'Medical Records', 'Health Monitoring'],
      previewImages: ['/health-platform-ui.png', '/health-dashboard.png']
    },
    // Data Extraction Projects
    {
      id: 5,
      title: 'Smart Documents Processing',
      description: 'AI-powered document analysis, validation, and automated application processing with real-time dashboard.',
      section: 'data-extraction',
      status: 'active',
      url: '/Education/smart-documents',
      lastUpdated: '1 hour ago',
      members: 8,
      tags: ['AI Processing', 'Validation', 'Document Analysis', 'Dashboard'],
      previewImages: ['/Smart-document.png', '/Smart-document-1.png']
    },


    // Additional projects for "All Projects"
    {
      id: 8,
      title: 'Recruiter AI',
      description: 'Intelligent recruitment platform for resume analysis, candidate matching, and hiring optimization.',
      section: 'other',
      status: 'active',
      url: '/other/recruiterai',
      lastUpdated: '2 hours ago',
      members: 8,
      tags: ['Recruitment', 'HR', 'AI Matching'],
      previewImages: ['/Recruite-ai.png', '/Recruiteai-1.png','/Recruiterai-2.png','/Recruiterai-3.png']
    },
    {
      id: 9,
      title: 'Immigration Extractor',
      description: 'Automated extraction and processing of immigration documents and student information.',
      section: 'other',
      status: 'active',
      url: '/Education/immigration',
      lastUpdated: '3 hours ago',
      members: 6,
      tags: ['Immigration', 'Document Processing', 'Data Extraction'],
      previewImages: ['/Immigration_ui.png']
    },
    {
      id: 10,
      title: 'VoiceBot - CloudTutor',
      description: 'Real-time AI voice assistant powered by Gemini 2.5 Live for Google Cloud Platform tutoring with Indian English accent.',
      section: 'other',
      status: 'active',
      url: '/other/voicebot',
      lastUpdated: '1 hour ago',
      members: 5,
      tags: ['Voice AI', 'Gemini Live', 'Education', 'Real-time'],
      previewImages: ['/Voicbotai.png']
    },
    // Transportation Projects
    {
      id: 11,
      title: 'Smart Policy Processor',
      description: 'AI-powered insurance policy document processor that extracts structured data from PDF policies including vehicle, customer, and premium details.',
      section: 'transportation',
      status: 'active',
      url: '/transportation/smart-policy',
      lastUpdated: '1 hour ago',
      members: 5,
      tags: ['Insurance', 'PDF Extraction', 'Policy Processing', 'Transportation'],
      previewImages: []
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
          transform: 'translate3d(0, 0, 0)', // Force hardware acceleration and prevent shifts
          willChange: 'width', // Optimize for width changes
          backfaceVisibility: 'hidden' // Prevent flickering
        }}
      >
        <div className="p-3 pt-6 h-full">
          <div className="space-y-3">
            {sections.map((section) => (
              <button
                key={section.id}
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
                     section.id === 'data-extraction' ? projects.filter(p => p.section === 'data-extraction').length :
                     section.id === 'transportation' ? projects.filter(p => p.section === 'transportation').length : 0} projects
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - No layout shift */}
      <div className="h-full overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-4">
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id}
                  project={project}
                  onProjectClick={setSelectedProject}
                />
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <FolderOpen className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-500">No projects available for the selected section.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
};

export default ProjectGrid;