import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Cloud, RefreshCw, AlertCircle, Info, X, Zap, Building2, TrendingUp, BookOpen } from 'lucide-react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate } from 'react-router-dom';
import { GeminiLiveService } from './services/geminiLiveService';
import Visualizer from './components/Visualizer';
import './VoiceBot.css';

const LiveStatus = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error',
};

const VoiceBot = () => {
  const { user } = useAuthenticator();
  const [status, setStatus] = useState(LiveStatus.DISCONNECTED);
  const [error, setError] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  
  const serviceRef = useRef(null);

  // Initialize service ref on mount, cleanup on unmount
  useEffect(() => {
    return () => {
      if (serviceRef.current) {
        serviceRef.current.disconnect();
      }
    };
  }, []);

  const handleToggleConnection = async () => {
    if (status === LiveStatus.CONNECTED || status === LiveStatus.CONNECTING) {
      // Disconnect
      if (serviceRef.current) {
        await serviceRef.current.disconnect();
      }
      setStatus(LiveStatus.DISCONNECTED);
      setAnalyser(null);
    } else {
      // Connect
      setError(null);
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      
      if (!apiKey) {
        setError("API Key not found in environment variables. Please add REACT_APP_GEMINI_API_KEY to your .env file.");
        return;
      }

      serviceRef.current = new GeminiLiveService(apiKey);
      await serviceRef.current.connect({
        onStatusChange: setStatus,
        onAudioData: setAnalyser,
        onError: (msg) => setError(msg),
      });
    }
  };

  const isConnected = status === LiveStatus.CONNECTED;
  const isConnecting = status === LiveStatus.CONNECTING;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="voicebot-container">
      
      {/* Header */}
      <header className="voicebot-header">
        <div className="voicebot-header-left">
          <div className="voicebot-logo">
            <Cloud className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="voicebot-title">
              CloudTutor India
            </h1>
            <p className="voicebot-subtitle">
              Powered by Gemini 2.5 Live
            </p>
          </div>
        </div>
        <div className="voicebot-header-right">
            <button 
              onClick={() => setShowAbout(true)}
              className="voicebot-about-btn"
            >
              <Info className="w-4 h-4" />
              About & Use Cases
            </button>
            <div className="voicebot-voice-indicator">
              <span className="voicebot-pulse"></span>
              Voice: Indian English (Female)
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="voicebot-main">
        
        {/* Background Decorations */}
        <div className="voicebot-bg-decoration voicebot-bg-decoration-1" />
        <div className="voicebot-bg-decoration voicebot-bg-decoration-2" />

        {/* Status Indicator */}
        <div className="voicebot-status-container">
          <div className={`voicebot-status voicebot-status-${status}`}>
            {status === LiveStatus.DISCONNECTED && 'Ready to Start'}
            {status === LiveStatus.CONNECTING && 'Connecting...'}
            {status === LiveStatus.CONNECTED && 'Live Session Active'}
            {status === LiveStatus.ERROR && 'Connection Error'}
          </div>
          
          {error && (
            <div className="voicebot-error">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm text-left">{error}</p>
            </div>
          )}
        </div>

        {/* Central Interaction Area */}
        <div className="voicebot-mic-container">
          {/* Ripple Effects when Active */}
          {isConnected && (
            <>
               <div className="voicebot-ripple voicebot-ripple-1" />
               <div className="voicebot-ripple voicebot-ripple-2" />
            </>
          )}

          <button
            onClick={handleToggleConnection}
            disabled={isConnecting}
            className={`voicebot-mic-button ${isConnected ? 'voicebot-mic-active' : ''} ${isConnecting ? 'voicebot-mic-connecting' : ''}`}
          >
            {isConnecting ? (
              <RefreshCw className="w-12 h-12 text-white animate-spin" />
            ) : isConnected ? (
              <MicOff className="w-12 h-12 text-white" />
            ) : (
              <Mic className="w-12 h-12 text-white" />
            )}
          </button>
        </div>

        {/* Visualizer & Instructions */}
        <div className="voicebot-visualizer-section">
          <div className="voicebot-visualizer-card">
             <div className="voicebot-visualizer-header">
                <span className="voicebot-visualizer-label">Audio Stream</span>
                {isConnected && (
                  <span className="voicebot-live-indicator">
                    <span className="voicebot-live-dot"/> Live
                  </span>
                )}
             </div>
             <Visualizer analyser={analyser} isActive={isConnected} />
          </div>

          {!isConnected && !error && (
            <div className="voicebot-info-box">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Meet Dhvani, your Cloud Tutor</p>
                <p>Click the microphone to start a real-time conversation. Dhvani can explain complex Google Cloud concepts using simple analogies from Indian daily life.</p>
              </div>
            </div>
          )}
          
           {/* Mobile About Button */}
           <button 
              onClick={() => setShowAbout(true)}
              className="voicebot-about-btn-mobile"
            >
              <Info className="w-4 h-4" />
              About & Industry Use Cases
            </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="voicebot-footer">
        <p>&copy; {new Date().getFullYear()} CloudTutor India Demo. Built by Operisoft.com and AI expert team.</p>
      </footer>

      {/* About Modal */}
      {showAbout && (
        <div className="voicebot-modal-overlay">
          <div className="voicebot-modal">
            
            {/* Modal Header */}
            <div className="voicebot-modal-header">
              <h2 className="voicebot-modal-title">
                <Cloud className="w-6 h-6 text-blue-600" />
                About Gemini Live
              </h2>
              <button 
                onClick={() => setShowAbout(false)}
                className="voicebot-modal-close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="voicebot-modal-content">
              
              {/* Technology Section */}
              <section className="voicebot-modal-section">
                <h3 className="voicebot-modal-section-title">
                  <Zap className="w-5 h-5 text-amber-500" />
                  The Technology
                </h3>
                <div className="voicebot-modal-tech-info">
                  <p><span className="font-semibold text-slate-900">AI Model:</span> Google Gemini 2.5 Flash</p>
                  <p><span className="font-semibold text-slate-900">Specific Model ID:</span> <code className="voicebot-code">gemini-2.5-flash-native-audio-preview-09-2025</code></p>
                  <p className="leading-relaxed mt-2">
                    This demo leverages the <strong>Live API (Native Audio)</strong>. Unlike traditional voice assistants that transcode Audio to Text to Audio (latency heavy), this model accepts and generates raw audio streams directly, enabling split-second responses and natural "barge-in" interruptions.
                  </p>
                </div>
              </section>

              {/* Industry Use Cases */}
              <section className="voicebot-modal-section">
                 <h3 className="voicebot-modal-section-title">
                  <Building2 className="w-5 h-5 text-indigo-500" />
                  Industry Use Cases
                </h3>
                <div className="voicebot-use-cases-grid">
                  <div className="voicebot-use-case voicebot-use-case-edtech">
                    <div className="voicebot-use-case-title">
                      <BookOpen className="w-4 h-4" /> EdTech
                    </div>
                    <p className="text-sm text-slate-600">
                      Personalized 1:1 tutors (like CloudTutor) that adapt to a student's pace, accent, and cultural context for language learning or technical skill development.
                    </p>
                  </div>
                  <div className="voicebot-use-case voicebot-use-case-support">
                    <div className="voicebot-use-case-title">
                      <Info className="w-4 h-4" /> Customer Support
                    </div>
                    <p className="text-sm text-slate-600">
                      Next-gen IVR systems that can handle complex troubleshooting, interruptions, and frustration detection without robotic menu trees.
                    </p>
                  </div>
                   <div className="voicebot-use-case voicebot-use-case-sales">
                    <div className="voicebot-use-case-title">
                      <TrendingUp className="w-4 h-4" /> Sales & Retail
                    </div>
                    <p className="text-sm text-slate-600">
                      Interactive shopping assistants that can discuss product features, handle negotiations, and guide users through purchases via voice.
                    </p>
                  </div>
                   <div className="voicebot-use-case voicebot-use-case-field">
                    <div className="voicebot-use-case-title">
                      <Cloud className="w-4 h-4" /> Field Operations
                    </div>
                    <p className="text-sm text-slate-600">
                      Hands-free assistants for technicians who need to query manuals or log data while their hands are busy with repairs.
                    </p>
                  </div>
                </div>
              </section>

              {/* Business Impact */}
              <section className="voicebot-modal-section">
                <h3 className="voicebot-modal-section-title">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Business Impact
                </h3>
                <ul className="voicebot-impact-list">
                  <li className="voicebot-impact-item">
                    <span className="voicebot-impact-number">1</span>
                    <div>
                      <strong className="text-slate-900">Ultra-Low Latency:</strong> Near-human response times (&lt;500ms) create emotional connection and trust that chatbots lack.
                    </div>
                  </li>
                  <li className="voicebot-impact-item">
                    <span className="voicebot-impact-number">2</span>
                    <div>
                      <strong className="text-slate-900">Cost Efficiency:</strong> The "Flash" tier offers high intelligence and speed at a fraction of the cost of "Pro" models, making mass deployment viable.
                    </div>
                  </li>
                  <li className="voicebot-impact-item">
                    <span className="voicebot-impact-number">3</span>
                    <div>
                      <strong className="text-slate-900">Global Reach:</strong> Native support for diverse accents and languages allows businesses to scale support globally without hiring local teams for every region.
                    </div>
                  </li>
                </ul>
              </section>
            </div>
            
            <div className="voicebot-modal-footer">
              <button 
                onClick={() => setShowAbout(false)}
                className="voicebot-modal-close-btn"
              >
                Close & Return to Demo
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceBot;
