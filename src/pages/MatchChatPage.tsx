import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Music, ArrowLeft } from "lucide-react";

interface Match {
  id: string;
  user: {
    id: string;
    displayName: string;
    images: Array<{ url: string }>;
  };
  matchedAt: string;
  commonArtists: string[];
}

const MatchChatPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const match: Match | undefined = location.state?.match;

  const [newMessage, setNewMessage] = useState("");

  if (!match) {
    // fallback if someone navigates here directly
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Match not found. Go back to matches.</p>
        <button
          onClick={() => navigate("/matches")}
          className="ml-4 px-4 py-2 bg-purple-500 rounded"
        >
          Back
        </button>
      </div>
    );
  }

  const getProfileImage = (images: Array<{ url: string }>) => {
    return images && images[0]
      ? images[0].url
      : `https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop`;
  };

  return (
    <div className="min-h-screen bg-white/5 backdrop-blur-lg flex flex-col">
      {/* Chat Header */}
      <div className="p-4 flex items-center border-b border-white/20">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 p-1 rounded hover:bg-white/10"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <img
          src={getProfileImage(match.user.images)}
          alt={match.user.displayName}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div>
          <h2 className="text-white font-semibold">{match.user.displayName}</h2>
          <p className="text-sm text-purple-400">
            {match.commonArtists.length} common artists
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 inline-block p-3 rounded-full mb-2">
            <Music className="h-6 w-6 text-white" />
          </div>
          <p className="text-white font-semibold">You matched!</p>
          <p className="text-gray-400 text-sm">
            Matched on {new Date(match.matchedAt).toLocaleDateString()}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {match.commonArtists.slice(0, 3).map((artist, index) => (
              <span
                key={index}
                className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs"
              >
                {artist}
              </span>
            ))}
          </div>
        </div>

        {/* Starter message */}
        <div className="space-y-4">
          <div className="bg-white/10 rounded-2xl rounded-bl-md p-4 max-w-xs">
            <p className="text-white text-sm">
              Hey! I see we both love music 🎸 What's your favorite album?
            </p>
            <p className="text-xs text-gray-400 mt-1">Suggested starter</p>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-white/20 flex space-x-3">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Send a message..."
          className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
        />
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
          Send
        </button>
      </div>
    </div>
  );
};

export default MatchChatPage;
