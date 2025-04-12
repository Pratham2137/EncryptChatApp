import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
  
    const handleLogout = async () => {
      try {
        setLoading(true);
        await axios.post("http://localhost:3000/api/auth/logout");
        navigate("/login");
      } catch (err) {
        alert("Logout failed.");
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      
    }, []);
  
    return (
      <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow text-center">
        <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
        <p className="mb-6">Are you sure you want to logout?</p>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="bg-red-600 text-white py-2 px-4 rounded mr-4"
        >
          {loading ? "Logging out..." : "Yes, Logout"}
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-300 py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    );
  
}

export default Logout