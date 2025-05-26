// Login.tsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { useTheme } from "../../utils/ThemeContext";

const Login = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const appName = import.meta.env.VITE_APP_NAME;
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      login(response.data.accessToken);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] dark:bg-[var(--color-background-darkmode)] flex items-center justify-center px-4">
      <div className="relative w-full max-w-md bg-[var(--color-card)] dark:bg-[var(--color-card-darkmode)] border border-[var(--color-border)] dark:border-[var(--color-border-darkmode)] p-8 rounded-md shadow-lg">

        {/* Dark Mode Toggle */}
        <div className="absolute top-4 right-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            <div className="w-11 h-6 rounded-full transition-colors bg-[var(--color-border)] dark:bg-[var(--color-border-darkmode)] peer-checked:bg-[var(--color-primary)] dark:peer-checked:bg-[var(--color-primary-darkmode)]"></div>
            <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-[var(--color-card)] dark:bg-[var(--color-card-darkmode)] peer-checked:translate-x-5 transition-transform border border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]"></div>
          </label>
        </div>

        <h2 className="text-2xl font-bold text-center text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
          {appName}
        </h2>
        <p className="text-center text-sm mt-1 text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]">
          Sign in to continue to {appName} Inc.
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm mb-1 text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">Email</label>
            <input
              type="email"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md bg-[var(--color-card)] dark:bg-[var(--color-card-darkmode)] border border-[var(--color-border)] dark:border-[var(--color-border-darkmode)] text-[var(--color-text)] dark:text-[var(--color-text-darkmode)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-darkmode)]"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md bg-[var(--color-card)] dark:bg-[var(--color-card-darkmode)] border border-[var(--color-border)] dark:border-[var(--color-border-darkmode)] text-[var(--color-text)] dark:text-[var(--color-text-darkmode)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-darkmode)]"
            />
            <div className="text-right text-sm mt-1">
              <a href="#" className="underline text-[var(--color-primary)] dark:text-[var(--color-primary-darkmode)]">Forgot password?</a>
            </div>
          </div>

          <div className="flex items-center">
            <input type="checkbox" className="form-checkbox border-[var(--color-border)] dark:border-[var(--color-border-darkmode)] text-[var(--color-primary)] dark:text-[var(--color-primary-darkmode)]" />
            <label className="ml-2 text-sm text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]">
              Remember me
            </label>
          </div>

          {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}

          <button type="submit" className="w-full py-2 rounded-md bg-[var(--color-primary)] dark:bg-[var(--color-primary-darkmode)] text-white transition hover:bg-[var(--color-primary-dark)] dark:hover:bg-[var(--color-primary-dark-darkmode)]">
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]">
          Don’t have an account? <Link to="/register" className="underline text-[var(--color-primary)] dark:text-[var(--color-primary-darkmode)]">Signup now</Link>
        </p>
        <p className="mt-4 text-center text-xs text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]">
          © 2025 {appName} Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
