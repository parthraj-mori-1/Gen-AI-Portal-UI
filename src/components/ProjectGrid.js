import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import { LayoutGrid, Heart, GraduationCap, Database, Coins, ShieldCheck } from 'lucide-react';

const sections = [
  { id: 'all',            name: 'All Projects',  icon: LayoutGrid,    color: '#6366f1', bg: '#eef2ff' },
  { id: 'healthcare',     name: 'Healthcare',    icon: Heart,         color: '#10b981', bg: '#ecfdf5' },
  { id: 'education',      name: 'Education',     icon: GraduationCap, color: '#3b82f6', bg: '#eff6ff' },
  { id: 'fintech',        name: 'Fintech',       icon: Coins,         color: '#ec4899', bg: '#fdf2f8' },
  { id: 'security',       name: 'Security',      icon: ShieldCheck,   color: '#64748b', bg: '#f1f5f9' },  
  { id: 'other',          name: 'Other',         icon: Database,      color: '#8b5cf6', bg: '#f5f3ff' },
];

const projects = [
  { id: 1,  title: 'Healthcare Referral',       section: 'healthcare',     status: 'Active', url: '/healthcare/referral',          tags: ['Healthcare','Processing','Automation'],                         description: 'Automated home healthcare referral document processing with intelligent data extraction.',                                previewImages: ['/Healthcare_ui.png','/Healthcare-response.png'], lastUpdated: '2 hours ago', members: 8  },
  { id: 2,  title: 'Patient Summary Generator', section: 'healthcare',     status: 'Active', url: '/healthcare/patient-summary',   tags: ['Patient Care','PDF Generation','Discharge Summary'],            description: 'Generate comprehensive patient discharge summaries in PDF format with secure data handling.',                             previewImages: [],                                                lastUpdated: '1 hour ago',  members: 6  },
  { id: 3,  title: 'Medical Assistant',         section: 'healthcare',     status: 'Active', url: '/healthcare/medical-assistant', tags: ['AI Assistant','Diagnostics','Medical Support'],                 description: 'AI-powered medical assistant for healthcare professionals with advanced diagnostic support.',                             previewImages: [],                                                lastUpdated: '30 min ago',  members: 12 },
  { id: 4,  title: 'Health Platform',           section: 'healthcare',     status: 'Active', url: '/healthcare/health',            tags: ['Healthcare Platform','Patient Management','Health Monitoring'], description: 'Comprehensive healthcare management system with integrated patient care and medical records.',                            previewImages: [],                                                lastUpdated: '15 min ago',  members: 10 },
  { id: 5,  title: 'Smart Documents',           section: 'education',      status: 'Inactive', url: '/Education/smart-documents',    tags: ['AI Processing','Validation','Document Analysis'],               description: 'AI-powered document analysis, validation, and automated application processing with real-time dashboard.',               previewImages: ['/Smart-document.png','/Smart-document-1.png'],   lastUpdated: '1 hour ago',  members: 8  },
  { id: 9,  title: 'Immigration Extractor',     section: 'education',      status: 'Active', url: '/Education/immigration',        tags: ['Immigration','Document Processing','Data Extraction'],          description: 'Automated extraction and processing of immigration documents and student information.',                                  previewImages: ['/Immigration_ui.png'],                           lastUpdated: '3 hours ago', members: 6  },
  { id: 8,  title: 'Recruiter AI',              section: 'other',          status: 'Active', url: '/other/recruiterai',            tags: ['Recruitment','HR','AI Matching'],                               description: 'Intelligent recruitment platform for resume analysis, candidate matching, and hiring optimization.',                     previewImages: ['/Recruite-ai.png','/Recruiteai-1.png'],          lastUpdated: '2 hours ago', members: 8  },
  { id: 10, title: 'VoiceBot - CloudTutor',     section: 'other',          status: 'Active', url: '/other/voicebot',               tags: ['Voice AI','Gemini Live','Education','Real-time'],               description: 'Real-time AI voice assistant powered by Gemini 2.5 Live for Google Cloud Platform tutoring.',                            previewImages: ['/Voicbotai.png'],                                lastUpdated: '1 hour ago',  members: 5  },
  { id: 11, title: 'Smart Policy Processor',    section: 'fintech',        status: 'Active', url: '/transportation/smart-policy',  tags: ['Insurance','PDF Extraction','Policy Processing'],               description: 'AI-powered insurance policy document processor that extracts structured data from PDF policies.',                        previewImages: [],                                                lastUpdated: '1 hour ago',  members: 5  },
  { id: 12, title: 'Security Platform',         section: 'security',       status: 'Active', url: '/other/security',                tags: ['Security','Monitoring','AI Analysis'],                           description: 'AI-powered security monitoring and analysis platform for threat detection and incident response.',                       previewImages: [],                                                lastUpdated: '1 hour ago',  members: 6  },
  { id: 13, title: 'ConvoGen AI',               section: 'other',          status: 'Active', url: '/other/convogenai',              tags: ['Conversational AI','NLP','Generation'],                          description: 'AI-powered conversational generation platform for building intelligent dialogue systems.',                              previewImages: [],                                                lastUpdated: '1 hour ago',  members: 5  },
];

const Divider = () => (
  <div className="mx-3 my-1" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }} />
);

const ProjectGrid = ({ onSidebarToggle }) => {
  const [activeSection, setActiveSection] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [hovered, setHovered] = useState(false);

  const filtered = activeSection === 'all' ? projects : projects.filter(p => p.section === activeSection);
  const count = (id) => id === 'all' ? projects.length : projects.filter(p => p.section === id).length;
  const activeData = sections.find(s => s.id === activeSection);

  return (
    <>
      {/* Sidebar */}
      <motion.div
        animate={{ width: hovered ? 220 : 68 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="fixed left-0 top-16 bottom-0 z-30 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)', boxShadow: '4px 0 24px rgba(0,0,0,0.15)' }}
        onMouseEnter={() => { setHovered(true); onSidebarToggle(true); }}
        onMouseLeave={() => { setHovered(false); onSidebarToggle(false); }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #6366f1, transparent)' }} />

        <div className="p-2.5 pt-4 h-full flex flex-col" style={{ gap: 2 }}>
          {sections.map((s, i) => {
            const active = activeSection === s.id;
            return (
              <div key={s.id}>
                {/* Dots separator after "All Projects" */}
                {i === 1 && (
                  <div className="mx-2 my-2">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, di) => (
                        <div key={di} className="rounded-full" style={{
                          width:  di === 2 ? 6 : di === 1 || di === 3 ? 4 : 3,
                          height: di === 2 ? 6 : di === 1 || di === 3 ? 4 : 3,
                          background: di === 2 ? 'rgba(99,102,241,0.7)' : 'rgba(255,255,255,0.15)',
                        }} />
                      ))}
                    </div>
                    <AnimatePresence>
                      {hovered && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="text-xs font-bold tracking-widest px-1 mb-1"
                          style={{ color: 'rgba(255,255,255,0.25)' }}>
                          CATEGORIES
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Gradient line between categories */}
                {i > 1 && <Divider />}

                <motion.button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full flex items-center gap-3 rounded-xl overflow-hidden relative"
                  style={{
                    minHeight: 48,
                    background: active ? `${s.color}22` : 'transparent',
                    border: active ? `1px solid ${s.color}44` : '1px solid transparent',
                  }}
                >
                  {active && (
                    <motion.div layoutId="activeBar" className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full" style={{ background: s.color }} />
                  )}
                  <div className="w-[48px] h-[48px] flex-shrink-0 flex items-center justify-center">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200" style={{
                      background: active ? `linear-gradient(135deg, ${s.color}, ${s.color}cc)` : 'rgba(255,255,255,0.07)',
                      boxShadow: active ? `0 4px 12px ${s.color}55` : 'none',
                    }}>
                      <s.icon className="w-4 h-4" style={{ color: active ? 'white' : 'rgba(255,255,255,0.45)' }} />
                    </div>
                  </div>
                  <AnimatePresence>
                    {hovered && (
                      <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.14 }} className="whitespace-nowrap text-left flex-1 pr-2">
                        <p className="text-sm font-semibold leading-none" style={{ color: active ? s.color : 'rgba(255,255,255,0.75)' }}>{s.name}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-xs px-1.5 py-0.5 rounded-md font-medium" style={{ background: active ? `${s.color}33` : 'rgba(255,255,255,0.08)', color: active ? s.color : 'rgba(255,255,255,0.4)' }}>
                            {count(s.id)}
                          </span>
                          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>projects</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            );
          })}

          {/* Bottom branding */}
          <AnimatePresence>
            {hovered && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-auto pb-2 px-2">
                <div className="rounded-xl p-3" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <p className="text-xs font-semibold" style={{
                    background: 'linear-gradient(to right, #9b6824, #ff9100, #efaf0d)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>Operisoft AI</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Gen-AI Enterprise Platform</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="h-full overflow-y-auto">
        <div className="p-6 max-w-screen-2xl">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection + 'h'} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="mb-6 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: activeData?.color }}>
                {activeData && <activeData.icon className="w-[18px] h-[18px] text-white" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-none">{activeData?.name}</h2>
                <p className="text-xs text-gray-400 mt-1">{filtered.length} project{filtered.length !== 1 ? 's' : ''} available</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((project, i) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.045, duration: 0.28, ease: 'easeOut' }}>
                  <ProjectCard project={project} onProjectClick={setSelectedProject} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </>
  );
};

export default ProjectGrid;

