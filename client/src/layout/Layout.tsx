import React, { useState } from "react";
import Sidebar from "../components/Navigation/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import Home from "../components/Home/Home";
import Chats from "../components/Chats/Chats";
import Contacts from "../components/Contacts/Contacts";
import Groups from "../components/Groups/Groups";
import Settings from "../components/Settings/Settings";
import Profile from "../components/Settings/Profile";

const layout = () => {
  const location = useLocation();
  const [selectedPage, setSelectedPage] = useState("home");

  const isLoginPage = location.pathname === "/login";
  const isLogoutPage = location.pathname === "/logout";
  const isRegisterPage = location.pathname === "/register";

  const showSidebarAndNavbar = !isLoginPage && !isLogoutPage && !isRegisterPage;

  const renderPage = () => {
    switch (selectedPage) {
      case "home":
        return <Home />;
      case "chats":
        return <Chats />;
      case "contacts":
        return <Contacts />;
      case "groups":
        return <Groups />;
      case "settings":
        return <Settings />;
      case "profile":
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-primary-light flex">
      {showSidebarAndNavbar && (
        <div className="fixed left-0 top-0 h-full z-10 transition-all w-20">
          <Sidebar onSelectPage={setSelectedPage} selectedPage={selectedPage} />
        </div>
      )}
      <main className={`flex-grow transition-all ml-20 p-2`}>
        {renderPage()}
      </main>
    </div>
  );
};

export default layout;
