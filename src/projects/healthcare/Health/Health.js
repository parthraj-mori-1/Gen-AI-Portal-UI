import { useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate } from 'react-router-dom';
import { ArrowLeft, Heart, ExternalLink } from 'lucide-react';

const Health = () => {
  const { user } = useAuthenticator();

  const openHealthPlatform = () => {
    window.open('https://health.operisoft.com', '_blank', 'noopener,noreferrer');
  };

  // Auto-open on component mount
  useEffect(() => {
    if (user) {
      openHealthPlatform();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

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
                  <h1 className="text-xl font-semibold text-gray-900">Health Platform</h1>
                  <p className="text-sm text-gray-500">Comprehensive healthcare management system</p>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <div className="flex items-center gap-3 text-white">
              <Heart className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Health Platform</h2>
                <p className="text-green-100 mt-1">Access the comprehensive healthcare management system</p>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-8 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <ExternalLink className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Opening Health Platform
              </h3>
              <p className="text-gray-600 mb-6">
                The Health Platform has been opened in a new window. If it didn't open automatically, click the button below.
              </p>
            </div>

            <button
              onClick={openHealthPlatform}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              <ExternalLink className="w-5 h-5" />
              Open Health Platform
            </button>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The Health Platform opens in a new window for the best experience and full functionality.
              </p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              Comprehensive patient management and medical records
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              Real-time health monitoring and analytics
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              Secure healthcare data handling and compliance
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              Integrated appointment scheduling and care coordination
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Health;
