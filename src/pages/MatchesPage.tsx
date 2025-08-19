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
          headers: { Authorization: `Bearer ${token}` },
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
            commonArtists: m.commonArtists || [],
          };
        });
        setMatches(formattedMatches);
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
                      onClick={() =>
                        navigate(`/chat/${match.id}`, { state: { match } })
                      }
                      className="p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/5"
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
                          <p className="text-purple-400 text-sm">
                            {match.commonArtists.length} artists in common
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(match.matchedAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchesPage;
