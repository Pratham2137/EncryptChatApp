// src/components/ContextSidebar/ContextSidebar.tsx
import React from "react";
import Profile from "../Settings/Profile";

// Demo data
const demoChats = [
  { id: "u1", name: "Patrick Hendricks", last: "hey! there I’m available", avatar: "🧑🏽" },
  { id: "u2", name: "Mark Messer", last: "Images", avatar: "👨🏻" },
];

const demoContacts = [
  { id: "c1", name: "Alice Johnson", avatar: "👩🏼" },
  { id: "c2", name: "Bob Smith",   avatar: "👨🏿" },
];

const demoGroups = [
  { id: "g1", name: "Project Team", avatar: "👥" },
  { id: "g2", name: "Friends",      avatar: "🎉" },
];

interface Props {
  section: "chats" | "contacts" | "groups" | "profile";
  selectedId: string | null;
  onSelectId: (id: string) => void;
}

const ContextSidebar: React.FC<Props> = React.memo(
  ({ section, selectedId, onSelectId }) => {
    // Renders any list of items (chats / contacts / groups)
    const renderList = (
      items: { id: string; name: string; last?: string; avatar: string }[]
    ) => (
      <ul className="flex-1 overflow-y-auto space-y-2 p-4">
        {items.map((item) => {
          const active = item.id === selectedId;
          return (
            <li
              key={item.id}
              onClick={() => onSelectId(item.id)}
              className={`
                flex items-center gap-3 p-2 rounded-md cursor-pointer transition
                ${active
                  ? "bg-[var(--color-primary-light)] dark:bg-[var(--color-primary-light-darkmode)]"
                  : "hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-border-darkmode)]"}
              `}
            >
              <span className="text-2xl">{item.avatar}</span>
              <div className="flex-1">
                <div className="font-medium text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
                  {item.name}
                </div>
                {item.last && (
                  <div className="text-xs text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]">
                    {item.last}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );

    return (
      <div
        className="
          w-80 h-full flex flex-col
          bg-[var(--color-card)] dark:bg-[var(--color-card-darkmode)]
          border-r border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]
        "
      >
        {/* Header */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </h2>
        </div>

        {/* Search input (omit for profile) */}
        {(section === "chats" ||
          section === "contacts" ||
          section === "groups") && (
          <div className="px-4 pb-2">
            <input
              type="text"
              placeholder={
                section === "chats"
                  ? "Search messages or users"
                  : section === "contacts"
                  ? "Search contacts"
                  : "Search groups"
              }
              className="
                w-full px-3 py-2 rounded-md
                bg-[var(--color-background)] dark:bg-[var(--color-background-darkmode)]
                border border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]
                text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]
                placeholder:text-[var(--color-text-secondary)] dark:placeholder:text-[var(--color-text-secondary-darkmode)]
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-darkmode)]
              "
            />
          </div>
        )}

        {/* List or Profile panel */}
        {section === "chats" && renderList(demoChats)}
        {section === "contacts" && renderList(demoContacts)}
        {section === "groups" && renderList(demoGroups)}
        {section === "profile" && (
          <div className="flex-1 overflow-y-auto">
            <Profile />
          </div>
        )}
      </div>
    );
  }
);

export default ContextSidebar;
