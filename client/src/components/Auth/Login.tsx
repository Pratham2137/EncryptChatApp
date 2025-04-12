import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
  
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const response = await axios.post("http://localhost:3000/api/auth/login", {
            email,
            password,
          }, {
            withCredentials: true, // Make sure cookies are included with the request
          });
      
          if (response.status === 200) {
            navigate("/"); // Redirect to home
          }
        } catch (err: any) {
          setError(err.response?.data?.message || "Login failed");
        }
      };
      
  
    return (
      <div className="max-w-sm mx-auto mt-20 p-6 border rounded shadow">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Don't have an account? <Link to="/register" className="text-blue-600">Register</Link>
        </p>
      </div>
    );
};

export default Login;
