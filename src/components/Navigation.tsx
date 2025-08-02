import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Music, User, Heart, LogOut, Menu, X } from 'lucide-react';

interface User {
  id: string;
  displayName: string;
  images: Array<{ url: string }>;
}

interface NavigationProps {
  user: User | null;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getProfileImage = () => {
    return user?.images && user.images[0] 
      ? user.images[0].url 
      : `https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`;
  };

  const navItems = [
    { path: '/discover', icon: Music, label: 'Discover' },
    { path: '/matches', icon: Heart, label: 'Matches' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Music className="h-6 w-6 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold text-white">TuneMatch</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <img
              src={getProfileImage()}
              alt={user?.displayName}
              className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
            />
            <span className="text-white font-medium">{user?.displayName}</span>
            <button
              onClick={onLogout}
              className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/40 backdrop-blur-lg border-t border-white/10">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
            
            <div className="border-t border-white/10 pt-4 mt-4">
              <div className="flex items-center space-x-3 px-4 py-2">
                <img
                  src={getProfileImage()}
                  alt={user?.displayName}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                />
                <span className="text-white font-medium">{user?.displayName}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;