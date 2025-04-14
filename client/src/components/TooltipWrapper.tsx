import React, { useState, useRef } from "react";

const TooltipWrapper = ({ title, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const timerRef = useRef(null);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 500); // Show after 2 seconds
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setShowTooltip(false);
  };

  return (
    <div
      className="relative group flex items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {/* Tooltip */}
      <div
        className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 transition-all duration-300 transform whitespace-nowrap 
          bg-gray-800 text-white text-xs rounded px-2 py-1 z-50
          ${showTooltip ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"}`}
      >
        {title}
      </div>
    </div>
  );
};

export default TooltipWrapper;
