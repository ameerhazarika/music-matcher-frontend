import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      const displayName = searchParams.get("displayName");
      const email = searchParams.get("email");
      const error = searchParams.get("error");

      if (error) {
        console.error("Spotify auth error:", error);
        navigate("/?error=auth_failed");
        return;
      }

      if (token && displayName && email) {
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("userDisplayName", displayName);
        localStorage.setItem("userEmail", email);

        checkAuth(); // this updates shared context state
        navigate("/discover");
      } else {
        navigate("/?error=missing_data");
      }
    };

    handleCallback();
  }, [checkAuth, searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Connecting to Spotify...</h2>
        <p className="text-gray-300">
          Please wait while we set up your music profile
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
