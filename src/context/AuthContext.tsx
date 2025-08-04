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
    // window.location.href = "http://127.0.0.1:5000/api/auth/login";
    window.location.href =
      "https://music-matcher-backend.onrender.com/api/auth/login";
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
