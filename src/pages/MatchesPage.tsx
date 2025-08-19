import React, { useState, useEffect } from "react";
import { MessageCircle, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  lastMessage?: {
    content: string;
    sentAt: string;
    senderId: string;
  };
  commonArtists: string[];
}

interface MatchesPageProps {
  user: User | null;
}

const MatchesPage: React.FC<MatchesPageProps> = ({ user }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        "https://music-matcher-be.onrender.com/api/matching/matches",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const matchData = await response.json();

        const formattedMatches = matchData.map((m: any) => {
          const otherUser = m.user1.id === user.id ? m.user2 : m.user1;
          return {
            id: m.id,
            user: {
              id: otherUser.id,
              displayName: otherUser.displayName,
              images: otherUser.profileImage ? [otherUser.profileImage] : [],
            },
            matchedAt: m.matchedAt,
            lastMessage: null,
            commonArtists: [],
          };
        });

        setMatches(formattedMatches);
        setSelectedMatch(null);
      } else {
        console.error("Failed to fetch matches:", await response.text());
      }
    } catch (error) {
      console.error("Failed to fetch matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProfileImage = (userImages: Array<{ url: string }>) => {
    return userImages && userImages[0]
      ? userImages[0].url
      : `https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours =
      Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-lg">Loading your matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex h-[calc(100vh-8rem)]">
          {/* Matches List */}
          <div className="w-full md:w-1/3 bg-white/10 backdrop-blur-lg rounded-l-2xl border border-white/20 border-r-0">
            <div className="p-6 border-b border-white/20">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <MessageCircle className="h-6 w-6 mr-2 text-purple-400" />
                Matches ({matches.length})
              </h1>
            </div>

            <div className="overflow-y-auto h-full">
              {matches.length === 0 ? (
                <div className="p-6 text-center text-gray-300">
                  <Music className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-lg font-semibold mb-2">No matches yet</h3>
                  <p className="text-sm">
                    Start swiping to find your music soulmates!
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {matches.map((match) => (
                    <div
                      key={match.id}
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          // Mobile: navigate to full-page chat
                          navigate(`/chat/${match.id}`, { state: { match } });
                        } else {
                          // Desktop: open in sidebar
                          setSelectedMatch(match);
                        }
                      }}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedMatch?.id === match.id
                          ? "bg-purple-500/20 border border-purple-400/30"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={getProfileImage(match.user.images)}
                          alt={match.user.displayName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium truncate">
                            {match.user.displayName}
                          </h3>
                          {match.lastMessage ? (
                            <p className="text-gray-400 text-sm truncate">
                              {match.lastMessage.content}
                            </p>
                          ) : (
                            <p className="text-purple-400 text-sm">
                              {match.commonArtists.length} artists in common
                            </p>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(
                            match.lastMessage?.sentAt || match.matchedAt
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Chat Area */}
          <div className="hidden md:flex md:w-2/3 bg-white/5 backdrop-blur-lg rounded-r-2xl border border-white/20 border-l-0 flex-col">
            {selectedMatch ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-white/20 flex items-center">
                  <img
                    src={getProfileImage(selectedMatch.user.images)}
                    alt={selectedMatch.user.displayName}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h2 className="text-white font-semibold">
                      {selectedMatch.user.displayName}
                    </h2>
                    <p className="text-sm text-purple-400">
                      {selectedMatch.commonArtists.length} common artists
                    </p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="text-center mb-6">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 inline-block p-3 rounded-full mb-2">
                      <Music className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-white font-semibold">You matched!</p>
                    <p className="text-gray-400 text-sm">
                      Matched on {formatDate(selectedMatch.matchedAt)}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mt-3">
                      {selectedMatch.commonArtists
                        .slice(0, 3)
                        .map((artist, index) => (
                          <span
                            key={index}
                            className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs"
                          >
                            {artist}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-2xl rounded-bl-md p-4 max-w-xs">
                      <p className="text-white text-sm">
                        Hey! I see we both love indie rock 🎸 What's your
                        favorite album right now?
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Suggested starter
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-white/20">
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
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-gray-400">
                <div>
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-lg font-semibold mb-2">
                    Select a match to start chatting
                  </h3>
                  <p className="text-sm">
                    Choose a conversation from the left to begin
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchesPage;
