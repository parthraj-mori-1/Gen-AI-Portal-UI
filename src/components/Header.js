import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, ChevronDown, Sparkles } from 'lucide-react';

const Header = ({ user, signOut }) => {
  const [profileOpen, setProfileOpen] = useState(false);

  const username = (user?.attributes?.given_name || user?.username || '')
    .replace(/\b\w/g, l => l.toUpperCase());
  const email = user?.attributes?.email || '';
  const initials = username ? username.split(' ').map(n => n[0]).join('').slice(0, 2) : 'U';

  return (
    <header className="sticky top-0 z-50 h-16 bg-white border-b border-gray-200/80" style={{ boxShadow: '0 1px 20px rgba(0,0,0,0.06)' }}>
      <div className="max-w-screen-2xl mx-auto px-6 flex items-center justify-between h-full gap-4">

        {/* Left — Logo */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 cursor-pointer select-none flex-shrink-0"
          onClick={() => window.location.reload()}
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <img src="/Operisoft_title.png" alt="Operisoft" className="h-7 w-auto" />
        </motion.div>

        {/* Center — Platform title */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="absolute left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight" style={{
              background: 'linear-gradient(to right, #000000, #140f0a, #5e452c, #9b6824, #ff9100, #efaf0d)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Operisoft AI
            </span>
          </div>
          <span className="text-xs text-gray-400 font-medium">Gen-AI Enterprise Platform</span>
        </motion.div>

        {/* Right — profile */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-150"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                {initials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800 leading-none">{username || 'User'}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-none max-w-[140px] truncate">{email}</p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-gray-100 overflow-hidden"
                  style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}
                >
                  <div className="p-4 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{username || 'User'}</p>
                        <p className="text-xs text-gray-400 truncate">{email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2.5 border-b border-gray-50 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-gray-500 font-medium">Active session</span>
                  </div>
                  <button onClick={signOut} className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
