// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

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

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const displayName = localStorage.getItem("userDisplayName");
        const email = localStorage.getItem("userEmail");

        if (displayName && email) {
          const response = await fetch(
            "https://music-matcher-be.onrender.com/api/user/me",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          const userDetails = await response.json();
          const userData: User = {
            id: userDetails.id, // ideally replace with real user data from backend or JWT
            spotifyId: userDetails.spotifyId,
            displayName,
            email,
            images: [],
            topTracks: [],
          };
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("jwtToken");
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.clear();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = () => {
    window.location.href =
      "https://music-matcher-be.onrender.com/api/auth/login";
    //or your deployed backend url
    //  window.location.href = "http://localhost:5000/api/auth/login";
    // // or your deployed backend url
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to consume the AuthContext state and methods
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
