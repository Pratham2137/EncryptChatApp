import React, { useEffect, useRef } from "react";
import { useTheme } from "../../utils/ThemeContext";
import { Link } from "react-router-dom";

interface SettingsProps {
  onClose: () => void;
  onSelect: (page: "profile" | "app-settings") => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose, onSelect }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="absolute bottom-10 left-20 transform -translate-x-1/2 w-44 bg-white dark:bg-[var(--color-card-darkmode)] border border-[var(--color-border)] dark:border-[var(--color-border-darkmode)] rounded-lg shadow-lg z-50"
    >
      <ul className="flex flex-col py-2 text-sm text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
        {/* App Settings */}
        <li
          className="px-4 py-2 hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-border-darkmode)] cursor-pointer"
          onClick={() => {
            onSelect("app-settings");
            onClose();
          }}
        >
          ⚙️ App Settings
        </li>
        {/* Profile */}
        <li
          className="px-4 py-2 hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-border-darkmode)] cursor-pointer"
          onClick={() => {
            onSelect("profile");
            onClose();
          }}
        >
          👤 Profile Settings
        </li>
        {/* Divider */}
        <li>
          <hr className="my-1 border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]" />
        </li>
        {/* Theme toggle */}
        <li
          className="px-4 py-2 hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-border-darkmode)] cursor-pointer"
          onClick={() => {
            toggleTheme();
            onClose();
          }}
        >
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </li>
        {/* Logout */}
        <li className="px-4 py-2 hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-border-darkmode)] cursor-pointer text-[var(--color-error)]">
          <Link to="/logout">
            <button className=" w-full h-full text-left">🔓 Logout</button>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Settings;
