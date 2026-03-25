import { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate } from 'react-router-dom';
import { 
  Download, 
  RefreshCw, 
  User, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader,
  ArrowLeft,
  Heart
} from 'lucide-react';
import axios from 'axios';
import './PatientSummary.css';

const API_BASE = process.env.REACT_APP_PATIENT_SUMMARY_API_URL || 'https://ripex6wqerwbl3ayfb4veorav40iswyi.lambda-url.ap-south-1.on.aws/api';

const PatientSummary = () => {
  const { user } = useAuthenticator();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [status, setStatus] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const loadPatients = async () => {
    setLoading(true);
    setStatus({ message: '', type: '' });
    
    try {
      const response = await axios.get(`${API_BASE}/patients`);
      setPatients(response.data);
      setStatus({ 
        message: `Successfully loaded ${response.data.length} patients`, 
        type: 'success' 
      });
    } catch (error) {
      console.error('Error fetching patients:', error);
      setStatus({ 
        message: 'Failed to load patients. Please check if the backend is running.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!selectedPatient) {
      setStatus({ 
        message: 'Please select a patient first.', 
        type: 'error' 
      });
      return;
    }

    setDownloading(true);
    setStatus({ 
      message: 'Generating PDF... Please wait...', 
      type: 'loading' 
    });

    try {
      const pdfUrl = `${API_BASE}/summary/${selectedPatient}/pdf`;
      console.log('Downloading PDF from:', pdfUrl);
      
      const response = await axios.get(pdfUrl, {
        responseType: 'blob',
        timeout: 60000
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `discharge_summary_patient_${selectedPatient}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      setStatus({ 
        message: 'PDF downloaded successfully!', 
        type: 'success' 
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      
      let errorMessage = 'Failed to download PDF. ';
      if (error.code === 'ECONNABORTED') {
        errorMessage += 'Request timed out. PDF generation is taking too long.';
      } else if (error.response) {
        errorMessage += `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage += 'No response from server.';
      } else {
        errorMessage += error.message;
      }
      
      setStatus({ 
        message: errorMessage, 
        type: 'error' 
      });
    } finally {
      setDownloading(false);
    }
  };

  const getSelectedPatientInfo = () => {
    if (!selectedPatient) return null;
    return patients.find(p => p.patient_id === selectedPatient);
  };

  const selectedPatientInfo = getSelectedPatientInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Patient Discharge Summary</h1>
                  <p className="text-sm text-gray-500">Generate and download patient discharge reports</p>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Welcome, {user?.attributes?.email || user?.username}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <div className="flex items-center gap-3 text-white">
              <FileText className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Discharge Summary Generator</h2>
                <p className="text-green-100 mt-1">Select a patient and download their complete discharge PDF</p>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-8">
            {/* Patient Selection */}
            <div className="mb-8">
              <label htmlFor="patientDropdown" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Select Patient
              </label>
              <div className="relative">
                <select
                  id="patientDropdown"
                  value={selectedPatient}
                  onChange={(e) => {
                    setSelectedPatient(e.target.value);
                    if (e.target.value) {
                      setStatus({ message: '', type: '' });
                    }
                  }}
                  disabled={loading}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loading ? 'Loading patients...' : '-- Select a Patient --'}
                  </option>
                  {patients.map((patient) => (
                    <option key={patient.patient_id} value={patient.patient_id}>
                      {`${patient.first_name} ${patient.last_name}`.trim()} (ID: {patient.patient_id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Patient Info */}
            {selectedPatientInfo && (
              <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  Selected Patient Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Full Name:</span>
                    <p className="text-gray-900 font-semibold">
                      {`${selectedPatientInfo.first_name} ${selectedPatientInfo.last_name}`.trim()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Patient ID:</span>
                    <p className="text-gray-900 font-semibold">{selectedPatientInfo.patient_id}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={loadPatients}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh Patients'}
              </button>
              
              <button 
                onClick={downloadPDF}
                disabled={!selectedPatient || downloading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {downloading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Discharge PDF
                  </>
                )}
              </button>
            </div>

            {/* Status Messages */}
            {status.message && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${
                status.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : status.type === 'error'
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}>
                {status.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                {status.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                {status.type === 'loading' && <Loader className="w-5 h-5 animate-spin text-blue-600" />}
                <span className="font-medium">{status.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">How it Works</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                Select a patient from the dropdown list
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                Click "Download Discharge PDF" button
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                Wait for PDF generation and download
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Features</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                Complete patient discharge summaries
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                Professional PDF format
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                Secure patient data handling
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSummary;
