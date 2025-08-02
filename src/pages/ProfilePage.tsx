import React, { useState } from 'react';
import { Edit3, Music, Calendar, MapPin, Settings } from 'lucide-react';

interface User {
  id: string;
  spotifyId: string;
  displayName: string;
  email: string;
  images: Array<{ url: string }>;
  topTracks: Array<{
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: { name: string; images: Array<{ url: string }> };
  }>;
}

interface ProfilePageProps {
  user: User | null;
  setUser: (user: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('Music is my language 🎵');
  const [location, setLocation] = useState('New York, NY');

  const getProfileImage = () => {
    return user?.images && user.images[0] 
      ? user.images[0].url 
      : `https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop`;
  };

  const getTrackImage = (track: any) => {
    return track.album.images && track.album.images[0]
      ? track.album.images[0].url
      : `https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop`;
  };

  const refreshSpotifyData = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('http://127.0.0.1:8080/api/user/refresh-spotify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Failed to refresh Spotify data:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden mb-6">
          <div className="relative">
            <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500">
              <img
                src={getProfileImage()}
                alt={user.displayName}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            
            <div className="absolute -bottom-12 left-6">
              <img
                src={getProfileImage()}
                alt={user.displayName}
                className="w-24 h-24 rounded-full border-4 border-white/20 object-cover"
              />
            </div>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="absolute top-4 right-4 bg-black/40 backdrop-blur-lg p-2 rounded-full text-white hover:bg-black/60 transition-all duration-200"
            >
              <Edit3 className="h-5 w-5" />
            </button>
          </div>
          
          <div className="pt-16 p-6 text-white">
            <h1 className="text-2xl font-bold mb-1">{user.displayName}</h1>
            <p className="text-gray-300 mb-4">{user.email}</p>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-black/20 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-black/20 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-all duration-200"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-300">{bio}</p>
                <div className="flex items-center text-sm text-gray-400">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{location}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Music Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 text-center text-white">
            <div className="text-2xl font-bold text-green-400">{user.topTracks?.length || 0}</div>
            <div className="text-sm text-gray-300">Top Tracks</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 text-center text-white">
            <div className="text-2xl font-bold text-purple-400">92%</div>
            <div className="text-sm text-gray-300">Music Score</div>
          </div>
        </div>

        {/* Top Tracks */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-white">
              <Music className="h-6 w-6 mr-2 text-purple-400" />
              <h2 className="text-xl font-bold">Your Top Tracks</h2>
            </div>
            <button
              onClick={refreshSpotifyData}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
            >
              Refresh
            </button>
          </div>
          
          <div className="space-y-4">
            {user.topTracks?.slice(0, 10).map((track, index) => (
              <div key={track.id} className="flex items-center space-x-4">
                <div className="text-gray-400 font-mono text-sm w-6 text-center">
                  {index + 1}
                </div>
                <img
                  src={getTrackImage(track)}
                  alt={track.album.name}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">{track.name}</h3>
                  <p className="text-gray-400 text-sm truncate">
                    {track.artists.map(a => a.name).join(', ')}
                  </p>
                  <p className="text-gray-500 text-xs truncate">{track.album.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
          <div className="flex items-center text-white mb-4">
            <Settings className="h-6 w-6 mr-2 text-gray-400" />
            <h2 className="text-xl font-bold">Settings</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white">Discovery Radius</span>
              <select className="bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white text-sm">
                <option>25 miles</option>
                <option>50 miles</option>
                <option>100 miles</option>
                <option>Global</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white">Age Range</span>
              <select className="bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white text-sm">
                <option>18-25</option>
                <option>25-35</option>
                <option>35-45</option>
                <option>45+</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white">Show me on TuneMatch</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;