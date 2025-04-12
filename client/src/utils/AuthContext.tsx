import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "./LoadingOverlay"; // Adjust path if needed

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const refreshTimeout = useRef(null);

  const getToken = () => accessToken;

  const isTokenExpired = (token: string) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  const getRemainingTime = (token: string) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 - Date.now();
    } catch {
      return 0;
    }
  };

  const scheduleTokenRefresh = (token: string) => {
    clearTimeout(refreshTimeout.current);
    const remainingTime = getRemainingTime(token);
    const refreshTime = remainingTime - 60000;
    if (refreshTime > 0) {
      refreshTimeout.current = setTimeout(refreshAuthToken, refreshTime);
    }
  };

  const refreshAuthToken = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/check", {
        method: "GET",
        credentials: "include", // Ensures cookies are sent with request
      });

      if (!response.ok) throw new Error("Refresh failed");
      const data = await response.json();
      setIsAuthenticated(true);
      setAccessToken(data.accessToken);
      scheduleTokenRefresh(data.accessToken);
    } catch {
      logout();
    }
  };

  const initializeAuth = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/check", {
        method: "GET",
        credentials: "include", // THIS is crucial
      });
      if (response.ok) {
        const data = await response.json();
        if (data.accessToken && !isTokenExpired(data.accessToken)) {
          setAccessToken(data.accessToken);
          setIsAuthenticated(true);
          scheduleTokenRefresh(data.token);
          if (["/login", "/register"].includes(window.location.pathname)) {
            navigate("/");
          }
        } else {
          await refreshAuthToken();
        }
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = (token: string) => {
    setAccessToken(token);
    setIsAuthenticated(true);
    scheduleTokenRefresh(token);
    navigate("/"); 
  };
  

  const logout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/logout", null, {
        withCredentials: true,
      });
      clearTimeout(refreshTimeout.current);
      setAccessToken(null); // Ensure accessToken is cleared
      setIsAuthenticated(false); // Set authentication state to false
      navigate("/login"); // Navigate to login page after logging out
    } catch (err) {
      alert("Logout failed.");
    }
  };
  

  useEffect(() => {
    initializeAuth();
    return () => clearTimeout(refreshTimeout.current);
  }, []);

  if (loading) return <LoadingOverlay loading={true} />;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
