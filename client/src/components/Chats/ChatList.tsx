// src/components/Sidebar/ChatList.tsx
import React, { useState, useMemo } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import { useSelector } from "react-redux";
import type { RootState } from "../../features/store";
// import { ChatPartner } from "../../features/chats/chatsSlice";

interface Props {
  selectedId: string | null;
  onSelectId(id: string): void;
  onNewChat(): void; // <-- new!
}

export default function ChatList({ selectedId, onSelectId, onNewChat }: Props) {
  const { list: chats, status } = useSelector((s: RootState) => s.social.chats);
  const [search, setSearch] = useState("");

  // memoize filtered list
  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return chats.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.desc ?? "").toLowerCase().includes(term)
    );
  }, [chats, search]);

  if (status === "loading") return <p className="p-4">Loading chats…</p>;
  if (status === "failed")
    return <p className="p-4 text-red-500">Error loading chats</p>;

  return (
    <div className="flex flex-col h-full bg-[var(--color-card)] dark:bg-[var(--color-card-darkmode)]">
      {/* ─── Header with New Chat ─── */}
      <div className="flex items-center justify-between px-4 py-3  dark:border-[var(--color-border-darkmode)]">
        <h2 className="text-xl font-bold text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
          Chats
        </h2>
        <button
          onClick={onNewChat}
          className="flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary-darkmode)]"
        >
          New Chat
        </button>
      </div>

      {/* ─── Search Box ─── */}
      <div className="px-4 py-2 border-b border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats…"
            className="
              w-full pl-10 pr-3 py-2 rounded-md
              bg-[var(--color-background)] dark:bg-[var(--color-background-darkmode)]
              border border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]
              text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]
              placeholder:text-[var(--color-text-secondary)] dark:placeholder:text-[var(--color-text-secondary-darkmode)]
              focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-darkmode)]
            "
          />
        </div>
      </div>

      {/* ─── List ─── */}
      <ul className="flex-1 overflow-y-auto space-y-1 p-2">
        {filtered.length === 0 ? (
          <li className="text-center text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]">
            No chats found
          </li>
        ) : (
          filtered.map((c) => {
            const active = c._id === selectedId;
            return (
              <li
                key={c._id}
                onClick={() => onSelectId(c._id)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition
                  ${
                    active
                      ? "bg-[var(--color-primary-light)] dark:bg-[var(--color-primary-light-darkmode)]"
                      : "hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-border-darkmode)]"
                  }
                `}
              >
                <img
                  src={c.avatar + `/boy?username=${c.name}`}
                  alt={c.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 overflow-hidden">
                  <div className="font-medium text-[var(--color-text)] dark:text-[var(--color-text-darkmode)] whitespace-nowrap overflow-ellipsis overflow-hidden">
                    {c.name}
                  </div>
                  {c.desc && (
                    <div className="text-xs text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)] whitespace-nowrap overflow-ellipsis overflow-hidden">
                      {c.desc}
                    </div>
                  )}
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
