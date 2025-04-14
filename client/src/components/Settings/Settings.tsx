import React, { useEffect, useRef } from 'react'

const Settings = ({ onClose, onSelect }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="absolute bottom-10 left-15 transform -translate-x-1/2 mb-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50"
    >
      <ul className="flex flex-col py-2 text-sm text-gray-700">
        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => onSelect("profile")}
        >
          Profile Settings
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            alert("Dark Mode toggle (or any feature)");
            onClose();
          }}
        >
          Theme
        </li>
      </ul>
    </div>
  );
}

export default Settings