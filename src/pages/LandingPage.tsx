import React from 'react';
import { Music, Heart, Users, Headphones } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo and Header */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full">
              <Music className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            TuneMatch
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Find your perfect music match. Connect with people who share your musical soul through Spotify-powered compatibility.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="bg-green-500 p-3 rounded-full w-fit mx-auto mb-4">
              <Headphones className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Music DNA Analysis</h3>
            <p className="text-gray-300">
              We analyze your Spotify listening history to understand your unique musical taste.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="bg-pink-500 p-3 rounded-full w-fit mx-auto mb-4">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
            <p className="text-gray-300">
              Our algorithm finds people with compatible music taste for meaningful connections.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="bg-blue-500 p-3 rounded-full w-fit mx-auto mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Music Communities</h3>
            <p className="text-gray-300">
              Join a community of music lovers and discover new artists together.
            </p>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={onLogin}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>Continue with Spotify</span>
          </div>
        </button>

        <p className="text-sm text-gray-400 mt-4">
          We'll access your Spotify listening history to create your music profile
        </p>
      </div>
    </div>
  );
};

export default LandingPage;