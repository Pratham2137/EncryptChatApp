import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    const [error, setError] = useState("");
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  
    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
  
      try {
        const response = await axios.post("http://localhost:3000/api/auth/register", {
          name: form.name,
          email: form.email,
          password: form.password,
        });
  
        if (response.status === 200) {
          navigate("/"); // Redirect to home
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Registration failed");
      }
    };
  
    return (
      <div className="max-w-sm mx-auto mt-20 p-6 border rounded shadow">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </div>
    );
}

export default Register