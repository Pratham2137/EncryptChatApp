import React, { useState } from "react";

export interface Chat {
  id: string;
  name: string;
  last: string;
  avatar: string;
}

const demoChats: Chat[] = [
  { id: "u1", name: "Patrick Hendricks", last: "hey! there I’m available", avatar: "🧑🏽" },
  { id: "u2", name: "Mark Messer",       last: "Images",                     avatar: "👨🏻" },
];

interface Props {
  selectedId: string | null;
  onSelectId: (id: string) => void;
  onNewChat: () => void;
}

const ChatList: React.FC<Props> = ({ selectedId, onSelectId, onNewChat }) => {
  const [search, setSearch] = useState("");

  const filtered = demoChats.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.last.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-bold">Chats</h2>
        <button
          onClick={onNewChat}
          className="text-[var(--color-primary)]"
        >
          New chat
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2 border-b border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search messages or users"
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

      {/* List */}
      <ul className="flex-1 overflow-y-auto space-y-2 p-4">
        {filtered.map(c => {
          const active = c.id === selectedId;
          return (
            <li
              key={c.id}
              onClick={() => onSelectId(c.id)}
              className={`
                flex items-center gap-3 p-2 rounded-md cursor-pointer transition
                ${active
                  ? "bg-[var(--color-primary-light)] dark:bg-[var(--color-primary-light-darkmode)]"
                  : "hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-border-darkmode)]"}
              `}
            >
              <span className="text-2xl">{c.avatar}</span>
              <div className="flex-1">
                <div className="font-medium text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
                  {c.name}
                </div>
                <div className="text-xs text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]">
                  {c.last}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatList;
