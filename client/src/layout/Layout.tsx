import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/Navigation/Sidebar";
import ContentArea from "../components/ContextSidebar/ContentArea";
import MessageBox from "../components/Message/MessageBox";

const Layout: React.FC = () => {
  const location = useLocation();

  // On auth routes, just render the page
  if (["/login", "/register", "/logout"].includes(location.pathname)) {
    return (
      <div className="h-screen bg-[var(--color-background)] dark:bg-[var(--color-background-darkmode)]">
        <Outlet />
      </div>
    );
  }

  // Main section (tabs) and selected item
  const [selectedPage, setSelectedPage] = useState<
    "chats" | "contacts" | "groups" | "profile" | "app-settings"
  >("chats");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelectPage = (
    page: "chats" | "contacts" | "groups" | "profile" | "app-settings"
  ) => {
    setSelectedPage(page);
    setSelectedId(null);
  };

  return (
    <div className="h-screen flex bg-[var(--color-background)] dark:bg-[var(--color-background-darkmode)]">
      {/* 1️⃣ Icon sidebar */}
      <div className="flex-shrink-0 h-full">
        <Sidebar
          onSelectPage={handleSelectPage}
          selectedPage={selectedPage}
        />
      </div>

      {/* 2️⃣ Context area (list or profile or app settings) */}
      <div className="w-80 flex-shrink-0 h-full border-r border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]">
        <ContentArea
          section={selectedPage}
          selectedId={selectedId}
          onSelectId={setSelectedId}
        />
      </div>

      {/* 3️⃣ Message pane (hidden during app-settings) */}
      <div className="flex-1 h-full">
        {selectedPage === "app-settings" ? (
          <div className="h-full flex items-center justify-center text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]">
            Select an application setting to configure
          </div>
        ) : (
          <MessageBox section={selectedPage} selectedId={selectedId} />
        )}
      </div>
    </div>
  );
};

export default Layout;
