import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, ExternalLink } from 'lucide-react';

const ConvoGenAI = () => {
  const { user } = useAuthenticator();

  if (!user) return <Navigate to="/login" replace />;

  const openConvoGenAI = () => {
    window.open('https://convogenai.operisoft.com/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => window.history.back()} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-100 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">ConvoGen AI</h1>
                  <p className="text-sm text-gray-500">AI-powered conversational generation platform</p>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">Welcome, {user?.attributes?.email || user?.username}</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-8 py-6">
            <div className="flex items-center gap-3 text-white">
              <MessageCircle className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">ConvoGen AI</h2>
                <p className="text-violet-100 mt-1">Click below to launch the platform</p>
              </div>
            </div>
          </div>

          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-violet-100 rounded-full mb-6">
              <ExternalLink className="w-10 h-10 text-violet-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Launch ConvoGen AI</h3>
            <p className="text-gray-500 mb-8">Click the button below to open ConvoGen AI in a new window.</p>

            <button
              onClick={openConvoGenAI}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              <ExternalLink className="w-5 h-5" />
              Open ConvoGen AI
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2"><span className="text-violet-600 font-bold">•</span>AI-powered conversational content generation</li>
            <li className="flex items-start gap-2"><span className="text-violet-600 font-bold">•</span>Natural language processing and understanding</li>
            <li className="flex items-start gap-2"><span className="text-violet-600 font-bold">•</span>Multi-turn dialogue management</li>
            <li className="flex items-start gap-2"><span className="text-violet-600 font-bold">•</span>Customizable conversation flows and templates</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConvoGenAI;
