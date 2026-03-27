import React, { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_RECRUITERAI_API_URL || 'https://k2nk7twzmhibdtkvwzuxtproxu0fqlwa.lambda-url.ap-south-1.on.aws';

const PdfViewerModal = ({ isOpen, onClose, candidate }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    // Set pdf.js worker
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
    }
  }, []);

  useEffect(() => {
    if (isOpen && candidate) {
      loadPdf();
    }
    return () => {
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, candidate]);

  const loadPdf = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading PDF for:', candidate.filename);
      
      let resolvedUrl = null;
      
      if (candidate.s3_url && candidate.s3_url.startsWith('s3://')) {
        // Parse S3 URL
        const withoutScheme = candidate.s3_url.replace('s3://', '');
        const firstSlash = withoutScheme.indexOf('/');
        const bucket = withoutScheme.substring(0, firstSlash);
        const s3Key = withoutScheme.substring(firstSlash + 1);
        
        // Call backend API to get presigned URL or PDF blob
        const params = new URLSearchParams({
          filename: candidate.filename,
          bucket: bucket,
          s3_key: s3Key
        });
        
        const response = await fetch(`${API_BASE}/view-resume?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load resume: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await response.json();
          if (data.error) {
            throw new Error(data.message || data.error);
          }
          resolvedUrl = data.url;
        } else {
          const blob = await response.blob();
          resolvedUrl = URL.createObjectURL(blob);
        }
      } else if (!candidate.s3_url || candidate.s3_url === 'null' || candidate.s3_url === '') {
        // No S3 URL, try to get from backend
        const params = new URLSearchParams({ filename: candidate.filename });
        const response = await fetch(`${API_BASE}/view-resume?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load resume: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await response.json();
          if (data.error) {
            throw new Error(data.message || data.error);
          }
          resolvedUrl = data.url;
        } else {
          const blob = await response.blob();
          resolvedUrl = URL.createObjectURL(blob);
        }
      } else if (candidate.s3_url.startsWith('http')) {
        // Direct HTTP URL (presigned)
        resolvedUrl = candidate.s3_url;
      } else {
        throw new Error('Unsupported resume URL format');
      }
      
      setPdfUrl(resolvedUrl);
      
      // Load PDF with pdf.js
      if (window.pdfjsLib) {
        const loadingTask = window.pdfjsLib.getDocument(resolvedUrl);
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
      } else {
        // Fallback: open in new tab
        window.open(resolvedUrl, '_blank');
        onClose();
      }
      
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderPage = async (pageNum) => {
    if (!pdfDoc || !canvas) return;
    
    try {
      const page = await pdfDoc.getPage(pageNum);
      const context = canvas.getContext('2d');
      const viewport = page.getViewport({ scale: 1.5 });
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
    } catch (err) {
      console.error('Error rendering page:', err);
    }
  };

  useEffect(() => {
    if (pdfDoc && canvas && currentPage) {
      renderPage(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfDoc, canvas, currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-white rounded-lg shadow-2xl w-[90%] max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gray-100 p-4 flex justify-between items-center rounded-t-lg border-b">
          <h3 className="font-semibold text-gray-900">{candidate?.filename}</h3>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
        
        {/* PDF Controls */}
        {pdfDoc && (
          <div className="flex justify-center items-center p-3 bg-gray-200 border-b">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
            >
              Prev
            </button>
            <span className="px-4 py-2 bg-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
            >
              Next
            </button>
          </div>
        )}
        
        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center p-4">
          {loading && (
            <div className="flex flex-col items-center">
              <div className="loading-spinner mb-4" style={{ width: '48px', height: '48px' }}></div>
              <p className="text-gray-600">Loading resume...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center">
              <p className="text-red-600 mb-4">Failed to load PDF: {error}</p>
              <button
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          )}
          
          {!loading && !error && pdfDoc && (
            <canvas
              ref={setCanvas}
              className="max-w-full shadow-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfViewerModal;
