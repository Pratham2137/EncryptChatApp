import React, { useState } from "react";

export interface Contact {
  id: string;
  name: string;
  avatar: string;
}

const demoContacts: Contact[] = [
  { id: "c1", name: "Alice Johnson", avatar: "👩🏼" },
  { id: "c2", name: "Bob Smith",      avatar: "👨🏿" },
];

interface Props {
  selectedId: string | null;
  onSelectId: (id: string) => void;
}

const ContactList: React.FC<Props> = ({ selectedId, onSelectId }) => {
  const [search, setSearch] = useState("");

  const filtered = demoContacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">

      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-bold">Contacts</h2>
        <button className="text-sm font-medium text-[var(--color-primary)]">
          New Contact
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2 border-b border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search contacts"
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
              <div className="font-medium text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
                {c.name}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ContactList;
