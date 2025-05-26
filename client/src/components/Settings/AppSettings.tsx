import React, { useState } from "react";

const AppSettings: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(false);

  return (
    <div className="p-6 h-full overflow-y-auto flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
        App Settings
      </h2>

      {/* Notifications toggle */}
      <div>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(n => !n)}
            className="form-checkbox h-5 w-5"
          />
          <span className="text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
            Enable notifications
          </span>
        </label>
      </div>

      {/* Auto-update toggle */}
      <div>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={autoUpdate}
            onChange={() => setAutoUpdate(u => !u)}
            className="form-checkbox h-5 w-5"
          />
          <span className="text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
            Auto-update application
          </span>
        </label>
      </div>

      {/* Add more app‐wide settings here */}
    </div>
  );
};

export default AppSettings;
