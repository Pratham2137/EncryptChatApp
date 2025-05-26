import React from "react";
import { FiSearch } from "react-icons/fi";
import TooltipWrapper from "../TooltipWrapper";

// TODO: replace with dynamic data
const mockChats = [
  { id: 1, name: "Patrick Hendricks", last: "hey! there I’m available", time: "02:50 PM" },
  { id: 2, name: "Mark Messer", last: "Images", time: "10:30 AM", unread: 2 },
  // …
];

const ChatsSidebar: React.FC = () => (
  <div className="h-full flex flex-col p-4 space-y-4 bg-[var(--color-card)] dark:bg-[var(--color-card-darkmode)]">
    <h2 className="text-lg font-semibold text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">Chats</h2>

    <div className="relative">
      <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]" />
      <input
        type="text"
        placeholder="Search messages or users"
        className="w-full pl-10 pr-3 py-2 rounded-md bg-[var(--color-background)] dark:bg-[var(--color-background-darkmode)] border border-[var(--color-border)] dark:border-[var(--color-border-darkmode)] text-[var(--color-text)] dark:text-[var(--color-text-darkmode)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-darkmode)]"
      />
    </div>

    <div className="flex space-x-3 overflow-x-auto pb-2">
      {mockChats.map(c => (
        <TooltipWrapper title={c.name} key={c.id}>
          <div className="w-12 h-12 rounded-full bg-[var(--color-background)] dark:bg-[var(--color-background-darkmode)] overflow-hidden">
            {/* replace with avatar */}
            <span className="block w-full h-full bg-[var(--color-border)]" />
          </div>
        </TooltipWrapper>
      ))}
    </div>

    <h3 className="mt-2 text-sm font-medium text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]">Recent</h3>

    <ul className="flex-1 overflow-y-auto space-y-3">
      {mockChats.map(c => (
        <li
          key={c.id}
          className="flex items-center justify-between cursor-pointer hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-border-darkmode)] p-2 rounded-md"
        >
          <div>
            <p className="font-medium text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">{c.name}</p>
            <p className="text-xs text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]">{c.last}</p>
          </div>
          <div className="text-xs text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]">
            {c.time}
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default ChatsSidebar;
