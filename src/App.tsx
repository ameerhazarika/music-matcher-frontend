import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MatchingPage from "./pages/MatchingPage";
import ProfilePage from "./pages/ProfilePage";
import MatchesPage from "./pages/MatchesPage";
import Navigation from "./components/Navigation";
import AuthCallback from "./components/AuthCallback";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, isAuthenticated, loading, login, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin h-12 w-12 border-4 border-purple-400 rounded-full"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {isAuthenticated && <Navigation user={user} onLogout={logout} />}

        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/discover" replace />
              ) : (
                <LandingPage onLogin={login} />
              )
            }
          />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/discover"
            element={
              isAuthenticated ? (
                <MatchingPage user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <ProfilePage user={user} setUser={() => {}} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/matches"
            element={
              isAuthenticated ? (
                <MatchesPage user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
