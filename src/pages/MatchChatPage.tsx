// MatchChatPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Music, MessageCircle } from "lucide-react";

interface User {
  id: string;
  displayName: string;
  images: Array<{ url: string }>;
}

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

interface MatchChatPageProps {
  user: User | null;
}

const MatchChatPage: React.FC<MatchChatPageProps> = ({ user }) => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();

  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchMatch();
  }, [matchId, user]);

  const fetchMatch = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `http://127.0.0.1:5000/api/matching/matches/${matchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const m = await response.json();
        const otherUser = m.user1.id === user!.id ? m.user2 : m.user1;

        setMatch({
          id: m.id,
          user: {
            id: otherUser.id,
            displayName: otherUser.displayName,
            images: otherUser.profileImage ? [otherUser.profileImage] : [],
          },
          matchedAt: m.matchedAt,
          commonArtists: m.commonArtists || [],
        });
      } else {
        console.error("Failed to fetch match:", await response.text());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getProfileImage = (images: Array<{ url: string }>) =>
    images && images[0]
      ? images[0].url
      : `https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop`;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-400 mb-4"></div>
        <p>Loading chat...</p>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center text-white">
        <p>Match not found.</p>
        <button
          className="ml-4 px-4 py-2 bg-purple-500 rounded"
          onClick={() => navigate("/matches")}
        >
          Back to Matches
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white/5 backdrop-blur-lg">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-white/20">
        <button
          className="mr-4 text-white md:hidden"
          onClick={() => navigate("/matches")}
        >
          ← Back
        </button>
        <img
          src={getProfileImage(match.user.images)}
          alt={match.user.displayName}
          className="w-12 h-12 rounded-full object-cover mr-3"
        />
        <div>
          <h2 className="text-white font-semibold">{match.user.displayName}</h2>
          <p className="text-sm text-purple-400">
            {match.commonArtists.length} common artists
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        <div className="text-center mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 inline-block p-3 rounded-full mb-2">
            <Music className="h-6 w-6 text-white" />
          </div>
          <p className="text-white font-semibold">You matched!</p>
          <p className="text-gray-400 text-sm">
            Matched on {formatDate(match.matchedAt)}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
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

        {/* Placeholder message */}
        <div className="bg-white/10 rounded-2xl p-4 max-w-xs">
          <p className="text-white text-sm">
            Hey! I see we both love music 🎶 What's your favorite album right
            now?
          </p>
          <p className="text-xs text-gray-400 mt-1">Suggested starter</p>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-white/20 flex space-x-2">
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
