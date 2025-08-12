import React, { useState } from "react";
import { Music, Users, TrendingUp } from "lucide-react";

interface PotentialMatch {
  id: string;
  displayName: string;
  profileImage: string; // <-- update here
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

interface SwipeCardProps {
  match: PotentialMatch;
  onSwipe: (direction: "left" | "right") => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ match, onSwipe }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setDragOffset(e.clientX - window.innerWidth / 2);
    }
  };

  const handleMouseUp = () => {
    if (Math.abs(dragOffset) > 100) {
      onSwipe(dragOffset > 0 ? "right" : "left");
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  const getProfileImage = () => {
    return (
      match?.profileImage ||
      "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop"
    );
  };

  const getTopTrackImage = (track: any) => {
    return (
      track?.album?.images?.[0]?.url ||
      "https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"
    );
  };

  return (
    <div
      className={`relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden shadow-2xl transition-transform duration-300 ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{
        transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.1}deg)`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Profile Header */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-br from-purple-500 to-pink-500 relative overflow-hidden">
          <img
            src={getProfileImage()}
            alt={match.displayName}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Compatibility Score */}
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full font-bold">
            {match.compatibilityScore}% Match
          </div>
        </div>

        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold">{match.displayName}</h2>

          {/* ✅ Added null check to prevent runtime error */}
          {match?.commonArtists?.length > 0 && (
            <div className="flex items-center mt-1 text-sm">
              <Users className="h-4 w-4 mr-1" />
              <span>{match.commonArtists.length} artists in common</span>
            </div>
          )}
        </div>
      </div>

      {/* Music Information */}
      <div className="p-6 text-white">
        {/* Common Artists */}
        {/* ✅ Added null check */}
        {match?.commonArtists?.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
              <span className="font-semibold">Common Artists</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {match.commonArtists.slice(0, 3).map((artist, index) => (
                <span
                  key={index}
                  className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm"
                >
                  {artist}
                </span>
              ))}
              {match.commonArtists.length > 3 && (
                <span className="bg-gray-500/20 text-gray-300 px-3 py-1 rounded-full text-sm">
                  +{match.commonArtists.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Top Tracks */}
        <div>
          <div className="flex items-center mb-3">
            <Music className="h-5 w-5 mr-2 text-purple-400" />
            <span className="font-semibold">Current Favorites</span>
          </div>
          <div className="space-y-3">
            {/* ✅ Added null check for topTracks */}
            {match?.topTracks?.slice(0, 3).map((track, index) => (
              <div key={track.id} className="flex items-center space-x-3">
                <img
                  src={getTopTrackImage(track)}
                  alt={track.album.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{track.name}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {track.artists.map((a) => a.name).join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Genres */}
        {/* ✅ Added null check */}
        {match?.commonGenres?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <span className="text-sm text-gray-400">Shared genres: </span>
            <span className="text-sm text-purple-300">
              {match.commonGenres.slice(0, 3).join(", ")}
            </span>
          </div>
        )}
      </div>

      {/* Swipe indicators */}
      {isDragging && (
        <>
          <div
            className={`absolute inset-0 flex items-center justify-center text-6xl font-bold transition-opacity duration-200 ${
              dragOffset > 50 ? "opacity-100 text-green-400" : "opacity-0"
            }`}
          >
            LIKE
          </div>
          <div
            className={`absolute inset-0 flex items-center justify-center text-6xl font-bold transition-opacity duration-200 ${
              dragOffset < -50 ? "opacity-100 text-red-400" : "opacity-0"
            }`}
          >
            PASS
          </div>
        </>
      )}
    </div>
  );
};

export default SwipeCard;
