// src/components/Message/MessageBox.tsx
import React, { useState } from "react";
import {
  FiSearch,
  FiPhone,
  FiVideo,
  FiInfo,
  FiMoreVertical,
  FiSmile,
  FiPaperclip,
  FiSend,
} from "react-icons/fi";

// demo messages keyed by ID
const demoChatMessages: Record<
  string,
  { id: string; from: string; text: string; time: string }[]
> = {
  u1: [
    { id: "m1", from: "Patrick Hendricks", text: "Hey, I'm available now.", time: "02:50 PM" },
    { id: "m2", from: "You", text: "Great—let's catch up.", time: "02:52 PM" },
  ],
  u2: [
    { id: "m3", from: "Mark Messer", text: "Check out these images.", time: "10:30 AM" },
  ],
};

const demoGroupMessages: Record<
  string,
  { id: string; from: string; text: string; time: string }[]
> = {
  g1: [
    { id: "g1m1", from: "Alice Johnson", text: "Project kickoff at 9am.", time: "09:00 AM" },
    { id: "g1m2", from: "Bob Smith", text: "Sounds good 👍", time: "09:05 AM" },
  ],
  g2: [
    { id: "g2m1", from: "Friend", text: "Who's up for movie night?", time: "07:30 PM" },
  ],
};

// map IDs → display name & avatar
const userMap: Record<
  string,
  { name: string; avatar: string }
> = {
  u1: { name: "Patrick Hendricks", avatar: "🧑🏽" },
  u2: { name: "Mark Messer", avatar: "👨🏻" },
  g1: { name: "Project Team", avatar: "👥" },
  g2: { name: "Friends", avatar: "🎉" },
};

interface Props {
  section: "chats" | "contacts" | "groups";
  selectedId: string | null;
}

const MessageBox: React.FC<Props> = ({ section, selectedId }) => {
  // local UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [inputText, setInputText] = useState("");

  if (!selectedId) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]">
        Select a {section.slice(0, -1)} to view messages
      </div>
    );
  }

  // pick messages for this convo
  const allMessages =
    section === "groups"
      ? demoGroupMessages[selectedId] || []
      : demoChatMessages[selectedId] || [];

  // filter by searchTerm
  const messages = allMessages.filter((m) =>
    m.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { name, avatar } = userMap[selectedId] || {
    name: selectedId,
    avatar: "👤",
  };

  return (
    <div className="flex flex-col h-full">
      {/* ───── Top Bar ───── */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]">
        {/* Avatar + Name */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">{avatar}</span>
          <span className="font-semibold text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
            {name}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 relative">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute top-1/2 left-2 -translate-y-1/2 text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search…"
              className="
                w-32 pl-8 pr-2 py-1 rounded-md
                bg-[var(--color-background)] dark:bg-[var(--color-background-darkmode)]
                border border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]
                text-sm text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]
                placeholder:text-[var(--color-text-secondary)] dark:placeholder:text-[var(--color-text-secondary-darkmode)]
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-darkmode)]
              "
            />
          </div>

          <button className="p-1 text-[var(--color-text)] dark:text-[var(--color-text-darkmode)] hover:text-[var(--color-primary)]">
            <FiPhone size={18} />
          </button>
          <button className="p-1 text-[var(--color-text)] dark:text-[var(--color-text-darkmode)] hover:text-[var(--color-primary)]">
            <FiVideo size={18} />
          </button>
          <button className="p-1 text-[var(--color-text)] dark:text-[var(--color-text-darkmode)] hover:text-[var(--color-primary)]">
            <FiInfo size={18} />
          </button>

          {/* three-dots menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-1 text-[var(--color-text)] dark:text-[var(--color-text-darkmode)] hover:text-[var(--color-primary)]"
            >
              <FiMoreVertical size={18} />
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-36 bg-[var(--color-card)] dark:bg-[var(--color-card-darkmode)]
                            border border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]
                            rounded-md shadow-lg z-50"
              >
                <ul className="flex flex-col">
                  <li className="px-4 py-2 hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-border-darkmode)] cursor-pointer">
                    Archive
                  </li>
                  <li className="px-4 py-2 hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-border-darkmode)] cursor-pointer">
                    Mute
                  </li>
                  <li className="px-4 py-2 hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-border-darkmode)] cursor-pointer text-[var(--color-error)]">
                    Delete
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ───── Message Scroll ───── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--color-background)] dark:bg-[var(--color-background-darkmode)]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`
              max-w-xs p-3 rounded-lg
              ${m.from === "You"
                ? "ml-auto bg-[var(--color-primary-light)] dark:bg-[var(--color-primary-light-darkmode)]"
                : "mr-auto bg-[var(--color-card)] dark:bg-[var(--color-card-darkmode)]"
              }
            `}
          >
            <div className="text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
              {m.text}
            </div>
            <div className="mt-1 text-xs text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)] text-right">
              {m.time}
            </div>
          </div>
        ))}
      </div>

      {/* ───── Input Area ───── */}
      <div className="flex items-center gap-3 p-4 border-t border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]">
        <button className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
          <FiSmile size={20} />
        </button>
        <button className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
          <FiPaperclip size={20} />
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message…"
          className="
            flex-1 px-3 py-2 rounded-full
            bg-[var(--color-card)] dark:bg-[var(--color-card-darkmode)]
            border border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]
            text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]
            placeholder:text-[var(--color-text-secondary)] dark:placeholder:text-[var(--color-text-secondary-darkmode)]
            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-darkmode)]
          "
        />
        <button
          onClick={() => {
            /* TODO: send message */
            setInputText("");
          }}
          className="
            p-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] 
            text-white rounded-full transition
          "
        >
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
};

export default MessageBox;
