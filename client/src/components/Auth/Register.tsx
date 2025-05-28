import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

const Register = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const appName = import.meta.env.VITE_APP_NAME;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/auth/register`, {
        name: form.name.trim(),
        username: form.username.trim().toLowerCase(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (res.status === 201) {
        navigate("/login");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] dark:bg-[var(--color-background-darkmode)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-[var(--color-card)] dark:bg-[var(--color-card-darkmode)] border border-[var(--color-border)] dark:border-[var(--color-border-darkmode)] p-8 rounded-md shadow-lg">
        <h2 className="text-2xl font-bold text-center text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
          {appName}
        </h2>
        <p className="text-center text-sm mt-1 text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]">
          Get your {appName} account now.
        </p>

        <form onSubmit={handleRegister} className="mt-6 space-y-6">
          {/* Name */}
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
              Full Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]" />
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 rounded-md bg-[var(--color-card)] dark:bg-[var(--color-card-darkmode)] border border-[var(--color-border)] dark:border-[var(--color-border-darkmode)] text-[var(--color-text)] dark:text-[var(--color-text-darkmode)] placeholder:text-[var(--color-text-secondary)] dark:placeholder:text-[var(--color-text-secondary-darkmode)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-darkmode)]"
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1">
            <label htmlFor="username" className="block text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
              Username
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]" />
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Choose a username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 rounded-md bg-[var(--color-card)] dark:bg-[var(--color-card-darkmode)] border border-[var(--color-border)] dark:border-[var(--color-border-darkmode)] text-[var(--color-text)] dark:text-[var(--color-text-darkmode)] placeholder:text-[var(--color-text-secondary)] dark:placeholder:text-[var(--color-text-secondary-darkmode)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-darkmode)]"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 rounded-md bg-[var(--color-card)] dark:bg-[var(--color-card-darkmode)] border border-[var(--color-border)] dark:border-[var(--color-border-darkmode)] text-[var(--color-text)] dark:text-[var(--color-text-darkmode)] placeholder:text-[var(--color-text-secondary)] dark:placeholder:text-[var(--color-text-secondary-darkmode)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-darkmode)]"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]" />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 rounded-md bg-[var(--color-card)] dark:bg-[var(--color-card-darkmode)] border border-[var(--color-border)] dark:border-[var(--color-border-darkmode)] text-[var(--color-text)] dark:text-[var(--color-text-darkmode)] placeholder:text-[var(--color-text-secondary)] dark:placeholder:text-[var(--color-text-secondary-darkmode)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-darkmode)]"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
              Confirm Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 rounded-md bg-[var(--color-card)] dark:bg-[var(--color-card-darkmode)] border border-[var(--color-border)] dark:border-[var(--color-border-darkmode)] text-[var(--color-text)] dark:text-[var(--color-text-darkmode)] placeholder:text-[var(--color-text-secondary)] dark:placeholder:text-[var(--color-text-secondary-darkmode)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-darkmode)]"
              />
            </div>
          </div>

          {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 rounded-md bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] dark:bg-[var(--color-primary-darkmode)] dark:hover:bg-[var(--color-primary-dark-darkmode)] text-white transition"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]">
          By registering you agree to the {appName}{" "}
          <Link to="#" className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] dark:text-[var(--color-primary-darkmode)] dark:hover:text-[var(--color-primary-dark-darkmode)]">
            Terms of Use
          </Link>
        </p>

        <p className="mt-4 text-center text-sm text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] dark:text-[var(--color-primary-darkmode)] dark:hover:text-[var(--color-primary-dark-darkmode)]">
            Sign in
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]">
          © 2025 {appName}. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Register;
