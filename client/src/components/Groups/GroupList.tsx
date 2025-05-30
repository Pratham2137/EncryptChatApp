import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../features/store";

export interface Group {
  id: string;
  name: string;
  avatar: string;
}

interface Props {
  selectedId: string | null;
  onSelectId: (id: string) => void;
}

const GroupList: React.FC<Props> = ({ selectedId, onSelectId }) => {
  const [search, setSearch] = useState("");
  const { list: groups, status } = useSelector(
    (s: RootState) => s.social.groups
  );

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-bold">Groups</h2>
        <button className="text-sm font-medium text-[var(--color-primary)]">
          Create Group
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2 border-b border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search groups"
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
        {filtered.map((g) => {
          const active = g.id === selectedId;
          return (
            <li
              key={g.id}
              onClick={() => onSelectId(g.id)}
              className={`
                flex items-center gap-3 p-2 rounded-md cursor-pointer transition
                ${
                  active
                    ? "bg-[var(--color-primary-light)] dark:bg-[var(--color-primary-light-darkmode)]"
                    : "hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-border-darkmode)]"
                }
              `}
            >
              <span className="text-2xl">{g.avatar}</span>
              <div className="font-medium text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
                {g.name}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default GroupList;
