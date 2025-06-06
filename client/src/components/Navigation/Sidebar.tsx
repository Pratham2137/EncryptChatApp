// src/components/Navigation/Sidebar.tsx
import React, { useState } from "react";
import {
  MdOutlineMessage,
  MdMessage,
  MdOutlineContacts,
  MdContacts,
} from "react-icons/md";
import { GrGroup } from "react-icons/gr";
import { HiMiniUserGroup } from "react-icons/hi2";
import { IoSettingsOutline, IoSettings } from "react-icons/io5";
import { FiGlobe, FiMoon, FiSun } from "react-icons/fi";
import Logo from "../../assets/images/Logo.svg";
import Settings from "../Settings/Settings";
import TooltipWrapper from "../TooltipWrapper";
import { useTheme } from "../../utils/ThemeContext";
// import avatarImg from "../../assets/images/avatar.jpg";
import { RxAvatar } from "react-icons/rx";

interface SidebarProps {
  onSelectPage: (page: string) => void;
  selectedPage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectPage, selectedPage }) => {
  const [showSettings, setShowSettings] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const mainLinks = [
    {
      page: "chats",
      title: "Chats",
      icon: <MdOutlineMessage />,
      iconActive: <MdMessage />,
    },
    {
      page: "contacts",
      title: "Contacts",
      icon: <MdOutlineContacts />,
      iconActive: <MdContacts />,
    },
    // {
    //   page: "groups",
    //   title: "Groups",
    //   icon: <GrGroup />,
    //   iconActive: <HiMiniUserGroup />,
    // },
  ];

  return (
    <nav
      className="
        w-16 flex-shrink-0 h-full flex flex-col justify-between items-center
        bg-[var(--color-card)] dark:bg-[var(--color-card-darkmode)]
        border-r border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]
        py-4
      "
    >
      {/* Logo */}
      <button
        onClick={() => onSelectPage("home")}
        className="
          w-15 h-15 mb-2 object-cover rounded-lg flex items-center justify-center
          hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-border-darkmode)]
          transition
        "
      >
        <img src={Logo} alt="Logo" className="w-12 h-12" />
      </button>

      {/* Main Links */}
      <ul className="flex-1 flex flex-col items-center space-y-4">
        {mainLinks.map((link) => {
          const active = selectedPage === link.page;
          return (
            <li key={link.page} className="relative">
              <TooltipWrapper title={link.title}>
                <button
                  onClick={() => onSelectPage(link.page)}
                  className={`
                    relative z-10 w-12 h-12 flex items-center justify-center text-2xl transition
                    ${active
                      ? `text-[var(--color-primary)] dark:text-[var(--color-primary-darkmode)]`
                      : `text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]
                         hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-darkmode)]`}
                  `}
                >
                  {active ? link.iconActive : link.icon}
                </button>
              </TooltipWrapper>
            </li>
          );
        })}
      </ul>

      {/* Bottom Utilities */}
      <ul className="flex flex-col items-center space-y-4">
        {/* Settings */}
        <li className="relative">
          <TooltipWrapper title="Settings">
            <button
              onClick={() => setShowSettings((v) => !v)}
              className={`
                w-12 h-12 flex items-center justify-center text-2xl transition
                ${showSettings
                  ? `text-[var(--color-primary)] dark:text-[var(--color-primary-darkmode)]`
                  : `text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]
                     hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-darkmode)]`}
              `}
            >
              {showSettings ? <IoSettings /> : <IoSettingsOutline />}
            </button>
          </TooltipWrapper>
          {showSettings && (
            <Settings
              onClose={() => setShowSettings(false)}
              onSelect={(page) => {
                onSelectPage(page);
                setShowSettings(false);
              }}
            />
          )}
        </li>

        {/* Explore/Globe */}
        {/* <li>
          <TooltipWrapper title="Explore">
            <button
              onClick={() => onSelectPage("explore")}
              className="
                w-12 h-12 flex items-center justify-center text-2xl transition
                text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]
                hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-darkmode)]
              "
            >
              <FiGlobe />
            </button>
          </TooltipWrapper>
        </li> */}

        {/* Theme Toggle */}
        <li>
          <TooltipWrapper title={theme === "dark" ? "Light Mode" : "Dark Mode"}>
            <button
              onClick={toggleTheme}
              className="
                w-12 h-12 flex items-center justify-center text-2xl transition
                text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]
                hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-darkmode)]
              "
            >
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </button>
          </TooltipWrapper>
        </li>

        {/* Avatar */}
        <li>
          <TooltipWrapper title="Profile">
            <button
              onClick={() => onSelectPage("profile")}
              className="
                w-12 h-12 rounded-full overflow-hidden border-2
                border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]
                transition hover:border-[var(--color-primary)]
              "
            >
              {/* <img
                src={avatarImg}
                alt="Profile"
                className="w-full h-full object-cover"
              /> */}
              <RxAvatar className="w-full h-full object-cover" />
            </button>
          </TooltipWrapper>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
