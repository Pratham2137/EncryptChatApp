import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../features/store";
import { IoSearch } from "react-icons/io5";
import {
  fetchContacts,
  addContact,
  Contact,
} from "../../features/contact/contactSlice";
import axios from "axios";
import { useAuth } from "../../utils/AuthContext";
import { fetchHistory, openChat } from "../../features/chat/chatSlice";

interface Props {
  selectedId: string | null;
  onSelectId: (id: string) => void;
}

const ContactList: React.FC<Props> = ({ selectedId, onSelectId }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch<AppDispatch>();
  const { list: contacts, status } = useSelector(
    (state: RootState) => state.social.contacts
  );
  const { getToken } = useAuth();
  const token = getToken();

  // New‐chat state
  const [isSearching, setIsSearching] = useState(false);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Contact[]>([]);
  const [searchStatus, setSearchStatus] = useState<
    "idle" | "loading" | "failed"
  >("idle");

  // 1) Load your current contacts on mount / token change
  useEffect(() => {
    if (token) dispatch(fetchContacts(token));
  }, [dispatch, token]);

  // 2) Search function (maps _id → id)
  const doSearch = useCallback(async () => {
    if (!term.trim()) {
      setResults([]);
      return;
    }
    setSearchStatus("loading");
    try {
      const resp = await axios.get<{
        users: { _id: string; name: string; avatar: string }[];
      }>(`${apiUrl}/users/search`, {
        params: { term },
        headers: { Authorization: `Bearer ${token}` },
      });
      const mapped = resp.data.users.map((u) => ({
        id: u._id,
        name: u.name,
        avatar: u.avatar,
      }));
      setResults(mapped);
      setSearchStatus("idle");
    } catch {
      setSearchStatus("failed");
    }
  }, [apiUrl, term, token]);

  // 3) Debounce the search so it only fires 300ms after the last keystroke
  useEffect(() => {
    if (!isSearching) return;
    const handle = setTimeout(doSearch, 300);
    return () => clearTimeout(handle);
  }, [term, isSearching, doSearch]);

  // 4) Add a contact & prune it from the results immediately
  const handleAdd = async (id: string) => {
    await dispatch(addContact({ userId: id, token }));
    setResults((r) => r.filter((c) => c.id !== id));
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(term.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-bold">
          {isSearching ? "New Chat" : "Contacts"}
        </h2>
        <button
          className="text-sm font-medium text-[var(--color-primary)]"
          onClick={() => {
            setIsSearching(!isSearching);
            setTerm("");
            setResults([]);
          }}
        >
          {isSearching ? "Back" : "New Chat"}
        </button>
      </div>

      {/* search bar */}
      <div className="px-4 py-2 border-b border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]">
        <div className="flex gap-2">
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && isSearching && doSearch()}
            placeholder={isSearching ? "Search new users…" : "Filter contacts"}
            className="
        flex-1 px-3 py-2 rounded-md
        bg-[var(--color-background)] dark:bg-[var(--color-background-darkmode)]
        border border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]
        text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]
        placeholder:text-[var(--color-text-secondary)] dark:placeholder:text-[var(--color-text-secondary-darkmode)]
        focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-darkmode)]
      "
          />
          {isSearching && (
            <button
              onClick={doSearch}
              className="
          px-4 py-2 rounded-md font-medium
          bg-[var(--color-primary)] dark:bg-[var(--color-primary-darkmode)]
          text-white
          hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)]
        "
            >
              <IoSearch />
            </button>
          )}
        </div>
      </div>

      {/* list or results */}
      <ul className="flex-1 overflow-y-auto space-y-2 p-4">
        {isSearching ? (
          // SEARCH MODE
          searchStatus === "loading" ? (
            <li>Loading…</li>
          ) : results.length === 0 ? (
            <li>No users found.</li>
          ) : (
            results.map((u) => (
              <li
                key={u.id}
                className="
                  flex items-center justify-between gap-3 p-2 rounded-md
                  hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-border-darkmode)]
                "
              >
                <div className="flex items-center gap-3">
                  <img
                      src={u.avatar + `/boy?username=${u.name}`}
                      alt={u.avatar}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  <div className="font-medium text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
                    {u.name}
                  </div>
                </div>
                <button
                  onClick={() => handleAdd(u.id)}
                  className="text-sm font-medium text-[var(--color-primary)]"
                >
                  Add
                </button>
              </li>
            ))
          )
        ) : (
          // CONTACTS MODE
          <>
            {status === "loading" ? (
              <li>Loading contacts…</li>
            ) : filteredContacts.length === 0 ? (
              <li className="text-center text-[var(--color-text-secondary)]">
                No contacts
              </li>
            ) : (
              filteredContacts.map((c) => {
                const active = c._id === selectedId;
                return (
                  <li
                    key={c._id}
                    onClick={() => onSelectId(c._id)}
                    className={`
                      flex items-center gap-3 p-2 rounded-md cursor-pointer transition
                      ${
                        active
                          ? "bg-[var(--color-primary-light)] dark:bg-[var(--color-primary-light-darkmode)]"
                          : "hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-border-darkmode)]"
                      }
                    `}
                  >
                    <img
                      src={c.avatar + `/boy?username=${c.name}`}
                      alt={c.avatar}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="font-medium text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
                      {c.name}
                    </div>
                  </li>
                );
              })
            )}
          </>
        )}
      </ul>
    </div>
  );
};

export default ContactList;
