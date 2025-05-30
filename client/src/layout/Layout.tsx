import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Sidebar from "../components/Navigation/Sidebar";
import ContentArea from "../components/ContextSidebar/ContentArea";
import MessageBox from "../components/Message/MessageBox";
import { useAuth } from "../utils/AuthContext";
import { fetchUserProfile } from "../features/userProfile/userProfileSlice";
import {  fetchContacts, fetchMyChats, fetchMyGroups } from "../features/social/socialSlice";

const Layout: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, getToken } = useAuth();
  const token = getToken();

  useEffect(() => {
    if (isAuthenticated) {
      if (token) {
        dispatch(fetchUserProfile(token));
        dispatch(fetchContacts(token));
        dispatch(fetchMyChats(token));
        dispatch(fetchMyGroups(token));
      }
    }
  }, [isAuthenticated, dispatch, token]);

  if (["/login", "/register", "/logout"].includes(location.pathname)) {
    return (
      <div className="h-screen bg-[var(--color-background)] dark:bg-[var(--color-background-darkmode)]">
        <Outlet />
      </div>
    );
  }

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
      {/* Sidebar */}
      <div className="flex-shrink-0 h-full">
        <Sidebar onSelectPage={handleSelectPage} selectedPage={selectedPage} />
      </div>

      {/* Context sidebar */}
      <div className="w-80 flex-shrink-0 h-full border-r border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]">
        <ContentArea
          section={selectedPage}
          selectedId={selectedId}
          onSelectId={setSelectedId}
          onSelectPage={handleSelectPage}
        />
      </div>

      {/* Message pane */}
      <div className="flex-1 h-full">
        {selectedPage === "app-settings" ? (
          <div className="h-full flex items-center justify-center text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]">
            Select an application setting to configure
          </div>
        ) : (
          <MessageBox
            section={selectedPage as "chats" | "contacts" | "groups"}
            selectedId={selectedId}
          />
        )}
      </div>
    </div>
  );
};

export default Layout;
