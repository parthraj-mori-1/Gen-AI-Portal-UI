import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Users, 
  Calendar, 
  Activity,
  Share2,
  Eye,
  Check,
  ArrowRight
} from 'lucide-react';

const ProjectModal = ({ project, onClose }) => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  
  if (!project) return null;

  const handleProjectAccess = () => {
    if (project.url.startsWith('/')) {
      navigate(project.url);
      onClose();
    } else {
      const token = generateSecureToken(project.id);
      window.open(`${project.url}?token=${token}`, '_blank');
    }
  };

  const handleShare = () => {
    const fullUrl = window.location.origin + project.url;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const generateSecureToken = (projectId) => {
    return `secure_token_${projectId}_${Date.now()}`;
  };

  const getSectionGradient = (section) => {
    switch (section) {
      case 'healthcare':
        return 'from-green-500 to-emerald-600';
      case 'data-extraction':
        return 'from-blue-500 to-cyan-600';
      case 'other':
        return 'from-purple-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Background overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-white shadow-2xl rounded-3xl flex flex-col"
        >
          {/* Header with Gradient */}
          <div className={`bg-gradient-to-r ${getSectionGradient(project.section)} p-8 text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10">
              <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-3">
                {project.section.replace('-', ' ').toUpperCase()}
              </div>
              <h3 className="text-3xl font-bold">
                {project.title}
              </h3>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-250px)]">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-5 bg-gradient-to-br from-blue-50 to-blue-50 rounded-2xl border border-blue-200">
                <Users className="w-7 h-7 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">{project.members}</p>
                <p className="text-sm text-gray-600 font-medium">Team Members</p>
              </div>
              <div className="text-center p-5 bg-gradient-to-br from-emerald-50 to-emerald-50 rounded-2xl border border-emerald-200">
                <Activity className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900 capitalize">{project.status}</p>
                <p className="text-sm text-gray-600 font-medium">Status</p>
              </div>
              <div className="text-center p-5 bg-gradient-to-br from-purple-50 to-purple-50 rounded-2xl border border-purple-200">
                <Calendar className="w-7 h-7 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-900">{project.lastUpdated}</p>
                <p className="text-sm text-gray-600 font-medium">Last Updated</p>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-6 bg-primary-600 rounded-full mr-3"></span>
                Technologies & Features
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 text-sm font-medium rounded-xl border border-primary-200 hover:border-primary-300 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Preview Images */}
            {showPreview && project.previewImages && project.previewImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-1 h-6 bg-primary-600 rounded-full mr-3"></span>
                  Project Preview
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {project.previewImages.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-primary-300 transition-all shadow-lg hover:shadow-xl cursor-pointer"
                      onClick={() => handleImageClick(image)}
                    >
                      <img 
                        src={image} 
                        alt={`Preview ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick Start Guide */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-6 bg-primary-600 rounded-full mr-3"></span>
                Quick Start Guide
              </h4>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</span>
                    <p className="text-gray-700 leading-relaxed">Click "Access Project" to open the application in a new window or navigate to the project page.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</span>
                    <p className="text-gray-700 leading-relaxed">Follow the on-screen instructions to configure your settings and upload any required data or files.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</span>
                    <p className="text-gray-700 leading-relaxed">Use the dashboard to monitor progress, view results, and access advanced features as needed.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">4</span>
                    <p className="text-gray-700 leading-relaxed">Export or share your results using the available tools and options within the application.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-5 bg-white border-t-2 border-gray-200 flex items-center justify-between gap-4">
            <div className="flex gap-3">
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2.5 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold shadow-md"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>
              
              {project.previewImages && project.previewImages.length > 0 && (
                <button 
                  onClick={handlePreview}
                  className="flex items-center gap-2 px-5 py-2.5 text-blue-700 bg-blue-50 border-2 border-blue-300 rounded-xl hover:bg-blue-100 hover:border-blue-400 transition-all font-semibold shadow-md"
                >
                  <Eye className="w-5 h-5" />
                  <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
                </button>
              )}
            </div>
            
            <button
              onClick={handleProjectAccess}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <span>Access Project</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Image Lightbox Modal */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80"
            onClick={closeImageModal}
          >
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 p-3 text-white hover:bg-white/20 rounded-full transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage}
              alt="Full size preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default ProjectModal;