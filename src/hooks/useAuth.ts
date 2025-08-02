// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from "react";

export interface User {
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

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(() => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const displayName = localStorage.getItem("userDisplayName");
        const email = localStorage.getItem("userEmail");

        if (displayName && email) {
          const userData: User = {
            id: "temp-id",
            spotifyId: "temp-spotify-id",
            displayName,
            email,
            images: [],
            topTracks: [],
          };
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("jwtToken");
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = () => {
    window.location.href = "http://127.0.0.1:8080/api/auth/login";
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuth,
  };
};
