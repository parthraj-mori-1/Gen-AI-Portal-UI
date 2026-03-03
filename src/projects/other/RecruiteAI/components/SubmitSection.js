import React, { useState, useRef } from 'react';
import ReviewModal from './ReviewModal';

const API_BASE = process.env.REACT_APP_RECRUITERAI_API_URL;

const SubmitSection = ({
  selectedPriority,
  onReselectPriority,
  isSubmitting,
  setIsSubmitting,
  setLastResponse,
  setActiveSection
}) => {
  const [formData, setFormData] = useState({
    designation: '',
    top_candidates: '10',
    min_threshold: '50',
    min_experience: '0',
    max_experience: '10',
    must_have_skills: '',
    nice_to_have_skills: '',
    jd_requirements: '',
    gd: '',
    s3_path: ''
  });
  
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [resultMessage, setResultMessage] = useState('');
  const [isGeneratingJD, setIsGeneratingJD] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  const resumeFilesInputRef = useRef(null);
  const resumeFolderInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).filter(
      file => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    );
    setUploadedFiles(files);
  };

  const handleFolderSelect = (e) => {
    const files = Array.from(e.target.files).filter(
      file => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    );
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!formData.s3_path.trim()) {
      e.currentTarget.classList.add('dropzone-active');
    }
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('dropzone-active');
  };

  const handleDrop = (e, isFolder = false) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dropzone-active');
    
    if (formData.s3_path.trim()) return;
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    );
    
    if (isFolder) {
      setUploadedFiles(prev => [...prev, ...files]);
    } else {
      setUploadedFiles(files);
    }
  };

  const handleGenerateJD = async () => {
    if (!formData.jd_requirements.trim()) {
      setResultMessage('<p class="text-red-600">Please provide job requirements for AI-generated JD.</p>');
      return;
    }

    setIsGeneratingJD(true);
    try {
      const response = await fetch(`${API_BASE}/generate-jd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requirements: formData.jd_requirements,
          designation: formData.designation || 'Data Engineer'
        })
      });

      const data = await response.json();
      
      if (data.error) {
        setResultMessage(`<p class="text-red-600">Error: ${data.error}</p>`);
        return;
      }

      setFormData(prev => ({ ...prev, gd: data.job_description }));
      setResultMessage('<p class="text-green-600">Job description generated successfully!</p>');
    } catch (error) {
      setResultMessage(`<p class="text-red-600">Error generating JD: ${error.message}</p>`);
    } finally {
      setIsGeneratingJD(false);
    }
  };

  const handleReview = (e) => {
    e.preventDefault();
    setResultMessage('');
    
    // Basic validation before showing review
    if (!formData.gd.trim()) {
      setResultMessage('<p class="text-red-600">Please provide a job description.</p>');
      return;
    }

    if (!formData.s3_path.trim() && uploadedFiles.length === 0) {
      setResultMessage('<p class="text-red-600">Please upload resume files or provide an S3 path.</p>');
      return;
    }

    if (!formData.must_have_skills.trim()) {
      setResultMessage('<p class="text-red-600">⚠️ Please fill the Must-Have Skills section.</p>');
      return;
    }

    setShowReviewModal(true);
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isSubmitting) return;
    
    setResultMessage('');
    setShowReviewModal(false);
    
    // Validation
    if (!formData.gd.trim()) {
      setResultMessage('<p class="text-red-600">Please provide a job description.</p>');
      return;
    }

    if (!formData.s3_path.trim() && uploadedFiles.length === 0) {
      setResultMessage('<p class="text-red-600">Please upload resume files or provide an S3 path.</p>');
      return;
    }

    if (selectedPriority !== 'internship') {
      const minExp = parseInt(formData.min_experience);
      const maxExp = parseInt(formData.max_experience);
      if (minExp === 0 && maxExp === 0) {
        setResultMessage('<p class="text-red-600">⚠️ Please set the Job Designation Relevant Experience range.</p>');
        return;
      }
      if (minExp >= maxExp) {
        setResultMessage('<p class="text-red-600">⚠️ Maximum experience must be greater than minimum.</p>');
        return;
      }
    }

    if (!formData.must_have_skills.trim()) {
      setResultMessage('<p class="text-red-600">⚠️ Please fill the Must-Have Skills section.</p>');
      return;
    }

    setIsSubmitting(true);

    try {
      const submitFormData = new FormData();
      submitFormData.append('gd', formData.gd);
      submitFormData.append('designation', formData.designation);
      submitFormData.append('top_candidates', formData.top_candidates);
      submitFormData.append('min_threshold', formData.min_threshold);
      submitFormData.append('priority', selectedPriority);  // Changed from priority_mode to priority
      submitFormData.append('min_experience', formData.min_experience);
      submitFormData.append('max_experience', formData.max_experience);
      submitFormData.append('must_have_skills', formData.must_have_skills);
      submitFormData.append('nice_to_have_skills', formData.nice_to_have_skills);

      if (formData.s3_path.trim()) {
        submitFormData.append('s3_path', formData.s3_path);
      } else {
        uploadedFiles.forEach(file => {
          submitFormData.append('resume_files', file);
        });
      }

      // Log form data for debugging
      console.log('Submitting form with:');
      console.log('- Designation:', formData.designation);
      console.log('- Priority Mode:', selectedPriority);
      console.log('- Experience Range:', formData.min_experience, '-', formData.max_experience);
      console.log('- Must Have Skills:', formData.must_have_skills);
      console.log('- Nice to Have Skills:', formData.nice_to_have_skills);
      console.log('- Top Candidates:', formData.top_candidates);
      console.log('- Min Threshold:', formData.min_threshold);
      console.log('- Files:', uploadedFiles.length);
      console.log('- S3 Path:', formData.s3_path);

      const response = await fetch(`${API_BASE}/shortlist`, {
        method: 'POST',
        body: submitFormData
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        setResultMessage(`<p class="text-red-600">Server error: ${response.status} ${response.statusText}</p>`);
        return;
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.error) {
        setResultMessage(`<p class="text-red-600">Error: ${data.error}</p>`);
        return;
      }

      console.log('Setting lastResponse with data:', data);
      setLastResponse(data);
      setResultMessage('<p class="text-green-600">✅ Processing complete! View results in the "View Resume & Reports" section.</p>');
      setTimeout(() => setActiveSection('view-resumes'), 2000);
    } catch (error) {
      setResultMessage(`<p class="text-red-600">Error: ${error.message}</p>`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isS3PathEntered = formData.s3_path.trim() !== '';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Job Shortlisting Configuration</h3>
        <button
          onClick={onReselectPriority}
          className="btn-primary px-4 py-2 rounded-lg text-sm"
          type="button"
        >
          🔄 Change Priority
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
              👨‍💻 Job Designation
            </label>
            <input
              type="text"
              name="designation"
              id="designation"
              value={formData.designation}
              onChange={handleInputChange}
              placeholder="e.g., Senior Data Engineer"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              required
            />
          </div>
          <div>
            <label htmlFor="top_candidates" className="block text-sm font-medium text-gray-700 mb-1">
              🔢 Top Candidates to Show
            </label>
            <input
              type="number"
              name="top_candidates"
              id="top_candidates"
              value={formData.top_candidates}
              onChange={handleInputChange}
              min="1"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="min_threshold" className="block text-sm font-medium text-gray-700 mb-1">
              📊 Minimum Match Threshold (%)
            </label>
            <input
              type="number"
              name="min_threshold"
              id="min_threshold"
              value={formData.min_threshold}
              onChange={handleInputChange}
              min="0"
              max="100"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            />
          </div>
        </div>

        {selectedPriority !== 'internship' && (
          <div className="p-4 rounded-lg border border-gray-200 bg-white">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📅 Experience (Years)
            </label>
            <div className="flex items-center space-x-3">
              <span className="text-gray-700 font-semibold">{formData.min_experience}</span>
              <input
                type="range"
                name="min_experience"
                value={formData.min_experience}
                onChange={handleInputChange}
                min="0"
                max="30"
                className="w-1/3 accent-purple-500"
              />
              <span className="text-gray-600">to</span>
              <input
                type="range"
                name="max_experience"
                value={formData.max_experience}
                onChange={handleInputChange}
                min="0"
                max="30"
                className="w-1/3 accent-purple-500"
              />
              <span className="text-gray-700 font-semibold">{formData.max_experience}</span>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="must_have_skills" className="block text-sm font-medium text-gray-700 mb-1">
            🔑 Must-Have Skills
          </label>
          <textarea
            name="must_have_skills"
            id="must_have_skills"
            value={formData.must_have_skills}
            onChange={handleInputChange}
            placeholder="e.g., Python, SQL, AWS"
            rows="2"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
          />
        </div>

        <div>
          <label htmlFor="nice_to_have_skills" className="block text-sm font-medium text-gray-700 mb-1">
            🌟 Nice-to-Have Skills
          </label>
          <textarea
            name="nice_to_have_skills"
            id="nice_to_have_skills"
            value={formData.nice_to_have_skills}
            onChange={handleInputChange}
            placeholder="e.g., Docker, Kubernetes"
            rows="2"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          />
        </div>

        <div>
          <label htmlFor="jd_requirements" className="block text-sm font-medium text-gray-700 mb-1">
            ✨ AI-Generated Job Description
          </label>
          <textarea
            name="jd_requirements"
            id="jd_requirements"
            value={formData.jd_requirements}
            onChange={handleInputChange}
            placeholder="Enter job requirements, skills, experience, etc."
            rows="4"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          />
          <button
            type="button"
            onClick={handleGenerateJD}
            disabled={isGeneratingJD}
            className="btn-primary w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center mt-2"
          >
            {isGeneratingJD ? (
              <>
                <span className="loading-spinner mr-2"></span>
                Generating JD...
              </>
            ) : (
              '✨ Generate AI Job Description'
            )}
          </button>
        </div>

        <div>
          <label htmlFor="gd" className="block text-sm font-medium text-gray-700 mb-1">
            📝 Job Description
          </label>
          <textarea
            name="gd"
            id="gd"
            value={formData.gd}
            onChange={handleInputChange}
            placeholder="Paste job description here or use AI-generated JD above..."
            rows="3"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          />
        </div>

        <div>
          <label htmlFor="s3_path" className="block text-sm font-medium text-gray-700 mb-1">
            ☁️ S3 Bucket Path (or upload resumes below)
          </label>
          <input
            type="text"
            name="s3_path"
            id="s3_path"
            value={formData.s3_path}
            onChange={handleInputChange}
            placeholder="s3://bucket-name/path/to/resumes/"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          />
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 font-medium">OR</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            📄 Upload Resumes (if not using S3)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className={`mt-2 p-8 dropzone rounded-lg text-center cursor-pointer ${isS3PathEntered ? 'disabled' : ''}`}
              onClick={() => !isS3PathEntered && resumeFilesInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, false)}
            >
              <span className="text-4xl">📤</span>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-medium text-indigo-600">Click to upload files</span> or drag and drop PDF files
              </p>
              <input
                ref={resumeFilesInputRef}
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                disabled={isS3PathEntered}
              />
            </div>
            <div
              className={`mt-2 p-8 dropzone rounded-lg text-center cursor-pointer ${isS3PathEntered ? 'disabled' : ''}`}
              onClick={() => !isS3PathEntered && resumeFolderInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, true)}
            >
              <span className="text-4xl">📁</span>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-medium text-indigo-600">Click to upload folder</span> with PDF resumes
              </p>
              <input
                ref={resumeFolderInputRef}
                type="file"
                webkitdirectory="true"
                directory="true"
                onChange={handleFolderSelect}
                className="hidden"
                disabled={isS3PathEntered}
              />
            </div>
          </div>
          {uploadedFiles.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-gray-600">
              {uploadedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleReview}
              disabled={isSubmitting}
              className="flex-1 btn-primary py-3 px-6 rounded-lg font-medium flex items-center justify-center"
            >
              🔍 Review Submission
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-primary py-3 px-6 rounded-lg font-medium flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner mr-2"></span>
                  Processing...
                </>
              ) : (
                '🚀 Submit for Shortlisting'
              )}
            </button>
          </div>
        </div>
      </form>

      {resultMessage && (
        <div className="mt-6" dangerouslySetInnerHTML={{ __html: resultMessage }} />
      )}

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onConfirm={handleSubmit}
        formData={formData}
        selectedPriority={selectedPriority}
        uploadedFiles={uploadedFiles}
      />
    </div>
  );
};

export default SubmitSection;
