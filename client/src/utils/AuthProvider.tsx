// src/utils/AuthProvider.tsx
import React, { useState, useEffect, useRef, ReactNode } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LoadingOverlay from "./LoadingOverlay";
import { AuthContext, AuthContextType } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const refreshTimeout = useRef<ReturnType<typeof setTimeout>>();

  const isTokenExpired = (token: string) => {
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  const getRemainingTime = (token: string) => {
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return decoded.exp * 1000 - Date.now();
    } catch {
      return 0;
    }
  };

  const scheduleTokenRefresh = (token: string) => {
    clearTimeout(refreshTimeout.current);
    const remaining = getRemainingTime(token);
    const when = remaining - 60_000; // 1 minute before expiry
    if (when > 0) {
      refreshTimeout.current = setTimeout(refreshAuthToken, when);
    }
  };

  const refreshAuthToken = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/auth/check`, {
        withCredentials: true,
      });
      const { success, message, accessToken } = data;

      if (!success || !accessToken) {
        throw new Error(message || "Could not refresh session");
      }

      setAccessToken(accessToken);
      setIsAuthenticated(true);
      scheduleTokenRefresh(accessToken);

    } catch (err: any) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;

      if (status === 403) {
        toast.error(msg || "Session expired, please log in again.");
      }
      // 401 ("No refresh token provided") or any other error just force logout
      logout();
    }
  };

  const initializeAuth = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/auth/check`, {
        withCredentials: true,
      });
      const { success, message, accessToken } = data;

      if (success && accessToken && !isTokenExpired(accessToken)) {
        setAccessToken(accessToken);
        setIsAuthenticated(true);
        scheduleTokenRefresh(accessToken);

        if (["/login", "/register"].includes(window.location.pathname)) {
          navigate("/");
        }
      } else {
        await refreshAuthToken();
      }

    } catch {
      // any failure here (400, 401, 403, network) → log out
      logout();

    } finally {
      setLoading(false);
    }
  };

  const login = async (loginData: { email: string; password: string }) => {
    try {
      const { data } = await axios.post(
        `${apiUrl}/auth/login`,
        loginData,
        { withCredentials: true }
      );
      const { success, message, accessToken } = data;

      if (!success || !accessToken) {
        throw new Error(message || "Login failed");
      }

      setAccessToken(accessToken);
      setIsAuthenticated(true);
      scheduleTokenRefresh(accessToken);
      
      toast.success(message);
      navigate("/");

    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Login error";
      toast.error(msg);
      setIsAuthenticated(false);
    }
  };

  const logout = async () => {
    try {
      const { data } = await axios.post(
        `${apiUrl}/auth/logout`,
        null,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message || "Logout failed");
      }

    } catch (err: any) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;

      // 400 → no refresh token, 403 → invalid/expired token
      if (status === 403) {
        toast.error(msg || "Session already expired");
      }
      // swallow 400 (“No refresh token provided”)
    } finally {
      clearTimeout(refreshTimeout.current);
      setAccessToken(null);
      setIsAuthenticated(false);
      navigate("/login");
    }
  };

  useEffect(() => {
    initializeAuth();
    return () => clearTimeout(refreshTimeout.current);
  }, []);

  if (loading) {
    return <LoadingOverlay loading />;
  }

  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    getToken: () => accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
