import React, { useState, useEffect } from "react";
import SwipeCard from "../components/SwipeCard";
import { Heart, X, RotateCcw } from "lucide-react";

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

interface PotentialMatch {
  id: string;
  displayName: string;
  images: Array<{ url: string }>;
  topTracks: Array<{
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: { name: string; images: Array<{ url: string }> };
  }>;
  compatibilityScore: number;
  commonArtists: string[];
  commonGenres: string[];
}

interface MatchingPageProps {
  user: User | null;
}

const MatchingPage: React.FC<MatchingPageProps> = ({ user }) => {
  const [potentialMatches, setPotentialMatches] = useState<PotentialMatch[]>(
    []
  );
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    fetchPotentialMatches();
  }, []);

  const fetchPotentialMatches = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("jwtToken");
      console.log(user.spotifyId);
      const response = await fetch(
        `https://music-matcher-backend.onrender.com/api/user/discover`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include", // Ensure cookies are sent with the request
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPotentialMatches(data);
        setCurrentMatchIndex(0); // Reset index when new data loads
      } else {
        console.error("Failed to fetch users:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: "left" | "right") => {
    if (potentialMatches.length === 0) return;

    const currentMatch = potentialMatches[currentMatchIndex];

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch("http://127.0.0.1:5000/api/matches/swipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetUserId: currentMatch.id,
          action: direction === "right" ? "like" : "pass",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.isMatch && direction === "right") {
          setIsMatch(true);
          setTimeout(() => setIsMatch(false), 3000);
        }
      }
    } catch (error) {
      console.error("Swipe action failed:", error);
    }

    // --- Recycling logic: reset index to 0 if we reach the end ---
    setCurrentMatchIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= potentialMatches.length) {
        return 0; // recycle back to first match
      }
      return nextIndex;
    });
  };

  const handleUndo = () => {
    if (currentMatchIndex > 0) {
      setCurrentMatchIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-lg">Finding your music matches...</p>
        </div>
      </div>
    );
  }

  const currentMatch = potentialMatches[currentMatchIndex];

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Match notification */}
        {isMatch && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-8 rounded-2xl text-center text-white transform animate-pulse">
              <Heart className="h-16 w-16 mx-auto mb-4 fill-current" />
              <h2 className="text-2xl font-bold mb-2">It's a Match! 🎵</h2>
              <p>You both love the same music!</p>
            </div>
          </div>
        )}

        {/* --- Render SwipeCard only if there are matches --- */}
        {potentialMatches.length > 0 && currentMatch ? (
          <>
            <SwipeCard match={currentMatch} onSwipe={handleSwipe} />

            {/* Action buttons */}
            <div className="flex justify-center items-center space-x-6 mt-8">
              <button
                onClick={handleUndo}
                disabled={currentMatchIndex === 0}
                className="bg-gray-600/50 backdrop-blur-lg p-4 rounded-full text-gray-300 hover:text-white hover:bg-gray-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="h-6 w-6" />
              </button>

              <button
                onClick={() => handleSwipe("left")}
                className="bg-red-500/20 backdrop-blur-lg p-6 rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/30 transition-all duration-200 transform hover:scale-110"
              >
                <X className="h-8 w-8" />
              </button>

              <button
                onClick={() => handleSwipe("right")}
                className="bg-green-500/20 backdrop-blur-lg p-6 rounded-full text-green-400 hover:text-green-300 hover:bg-green-500/30 transition-all duration-200 transform hover:scale-110"
              >
                <Heart className="h-8 w-8" />
              </button>
            </div>
          </>
        ) : (
          // Show this only if no matches at all (e.g., empty list)
          <div className="text-center text-white py-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4">No Matches Available</h2>
              <p className="text-gray-300 mb-6">
                Check back later for new people!
              </p>
              <button
                onClick={fetchPotentialMatches}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                Refresh Matches
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchingPage;
