import React, { useState } from "react";
import {
  MdOutlineContacts,
  MdContacts,
  MdOutlineMessage,
  MdMessage,
} from "react-icons/md";
import { GrGroup } from "react-icons/gr";
import { HiMiniUserGroup } from "react-icons/hi2";
import { IoSettingsOutline, IoSettings } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/images/templogo.svg";
import Settings from "../Settings/Settings";
import TooltipWrapper from "../TooltipWrapper";

const Sidebar = ({ onSelectPage, selectedPage }) => {
  const appName = import.meta.env.VITE_APP_NAME;

  const links = [
    {
      id: 1,
      title: "Chats",
      url: "/chats",
      icon: <MdOutlineMessage className="cursor-pointer" />,
      icon2: <MdMessage className="cursor-pointer" />,
      page: "chats",
    },
    {
      id: 2,
      title: "Contacts",
      url: "/contacts",
      icon: <MdOutlineContacts className="cursor-pointer" />,
      icon2: <MdContacts className="cursor-pointer" />,
      page: "contacts",
    },
    {
      id: 3,
      title: "Groups",
      url: "/groups",
      icon: <GrGroup className="cursor-pointer" />,
      icon2: <HiMiniUserGroup className="cursor-pointer" />,
      page: "groups",
    },
  ];

  const settings = [
    {
      id: 1,
      title: "Settings",
      url: "/settings",
      icon: <IoSettingsOutline className="cursor-pointer" />,
      icon2: <IoSettings className="cursor-pointer" />,
      page: "settings",
    },
  ];

  const [showSettings, setShowSettings] = useState(false);

  const handleDropdownClose = () => {
    setShowSettings(false);
  };

  const handleSettingsSelect = (page) => {
    onSelectPage(page);
    setShowSettings(false);
  };

  const isActive = (page) => selectedPage === page;

  return (
    <nav
      className={`h-full flex flex-col justify-between items-center bg-background pb-5 pt-2`}
    >
      <div>
        <h1 className="text-2xl font-bold text-text">
          <button
            onClick={() => onSelectPage("home")}
            className="flex items-center gap-x-2"
          >
            <img src={Logo} alt="logo" className="w-10 h-10 cursor-pointer" />
          </button>
        </h1>
      </div>
      <ul className="flex-1 px-2 mt-5 flex flex-col gap-y-5">
        {links.map((link) => (
          <li
            key={link.id}
            className={`relative flex items-center p-3 font-medium rounded-full cursor-pointer transition duration-200`}
          >
            {/* <NavLink to={link.url} className={`text-2xl text-primary`}>
                        {link.icon}
                    </NavLink> */}
            <TooltipWrapper title={link.title}>
              <button
                className={`text-2xl transition duration-200 ${
                  isActive(link.page)
                    ? "text-primary scale-110"
                    : "text-gray-500 hover:text-primary"
                }`}
                onClick={() => onSelectPage(link.page)}
              >
                {isActive(link.page) ? link.icon2 : link.icon}
              </button>
            </TooltipWrapper>
          </li>
        ))}
      </ul>
      <ul className="relative">
        <li>
          <TooltipWrapper title="Settings">
            <button
              className={`text-2xl cursor-pointer transition duration-200 ${
                showSettings
                  ? "text-primary scale-110"
                  : "text-gray-500 hover:text-primary"
              }`}
              onClick={() => setShowSettings((prev) => !prev)}
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
      </ul>
    </nav>
  );
};

export default Sidebar;
