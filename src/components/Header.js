import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LogOut, 
  User,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

const Header = ({ user, signOut }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.location.reload()}>
              <img 
                src="/operisoft_title.png" 
                alt="Operisoft GenAI Portal" 
                className="h-12 w-auto"
              />
            </div>
          </div>

          {/* Center Text */}
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
            <div className="relative px-6 py-2 bg-gradient-to-r from-blue-50/30 via-white/20 to-blue-50/30 rounded-xl shadow-lg border border-blue-100/40 backdrop-blur-sm">
              {/* Decorative elements */}
              <div className="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-60"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-60"></div>
              
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-900 to-gray-800 bg-clip-text text-transparent leading-tight drop-shadow-sm">
                Gen-AI Solutions
              </h1>
              <p className="text-sm text-gray-600 leading-tight font-medium">
                Enterprise AI Platform
              </p>
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-blue-400/5 rounded-xl blur-sm -z-10"></div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {(user?.attributes?.given_name || user?.username || '').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.attributes?.email}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                >
                  {/* <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </button>
                  <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Bell className="w-4 h-4 mr-3" />
                    Settings
                  </button> */}
                  {/* <hr className="my-1" /> */}
                  <button
                    onClick={signOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <div className="space-y-4">
              <p className="text-gray-600 px-4">Mobile menu options</p>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;