import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Music, MessageCircle } from "lucide-react";

interface User {
  id: string;
  displayName: string;
  images: Array<{ url: string }>;
}

interface Match {
  id: string;
  user: User;
  matchedAt: string;
  commonArtists: string[];
}

interface MatchChatPageProps {
  user: User | null;
}

const MatchChatPage: React.FC<MatchChatPageProps> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { match } = location.state as { match: Match };
  const [newMessage, setNewMessage] = useState("");

  if (!match) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center text-white">
        Match not found
      </div>
    );
  }

  const getProfileImage = (userImages: Array<{ url: string }>) =>
    userImages && userImages[0]
      ? userImages[0].url
      : `https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop`;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen pt-20 px-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 bg-white/10 backdrop-blur-lg rounded-2xl mb-4">
        <button
          className="mr-3 text-white md:hidden"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <img
          src={getProfileImage(match.user.images)}
          alt={match.user.displayName}
          className="w-12 h-12 rounded-full object-cover mr-3"
        />
        <div>
          <h2 className="text-white font-semibold">{match.user.displayName}</h2>
          <p className="text-purple-400 text-sm">
            {match.commonArtists.length} common artists
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 bg-white/5 backdrop-blur-lg rounded-2xl overflow-y-auto">
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 inline-block p-3 rounded-full mb-2">
            <Music className="h-6 w-6 text-white" />
          </div>
          <p className="text-white font-semibold">You matched!</p>
          <p className="text-gray-400 text-sm">
            Matched on {formatDate(match.matchedAt)}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {match.commonArtists.slice(0, 3).map((artist, idx) => (
              <span
                key={idx}
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
      <div className="p-4 mt-4">
        <div className="flex space-x-3">
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
    </div>
  );
};

export default MatchChatPage;
