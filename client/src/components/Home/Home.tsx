import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const appName = import.meta.env.VITE_APP_NAME;

  return (
    <div className="min-h-screen bg-[var(--color-background)] dark:bg-[var(--color-background-dark)] text-[var(--color-text)] dark:text-[var(--color-text-light)] flex flex-col items-center justify-center gap-4 p-4">
      <div className="card text-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">Welcome to {appName}</h1>
        <p className="text-sm text-[var(--color-text-secondary)] dark:text-[var(--color-text-light)]">
          This is your secure chat hub.
        </p>
      </div>
      <Link to="/logout">
        <button className="btn-primary">Logout</button>
      </Link>
    </div>
  );
};

export default Home;
