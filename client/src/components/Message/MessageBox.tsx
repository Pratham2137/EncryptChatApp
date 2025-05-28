// src/components/Message/MessageBox.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../features/store";
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
import { useAuth } from "../../utils/AuthContext";
import { getSocket } from "../../utils/socket";
import { receiveMessage, fetchHistory } from "../../features/chat/chatSlice";
import { nanoid } from "@reduxjs/toolkit";

interface Props {
  section: "chats" | "contacts" | "groups";
  selectedId: string | null;
}

const MessageBox: React.FC<Props> = ({ section, selectedId }) => {
  const dispatch = useDispatch();
  const me = useSelector((s: RootState) => s.userProfile.data)!;
  const history = useSelector((s: RootState) => s.chat.history);
  const partnerId = selectedId;
  const { getToken } = useAuth();
  const token = getToken()!;

  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [text, setText] = useState("");

  // load history when partner changes
  useEffect(() => {
    if (partnerId) {
      dispatch(fetchHistory({ partnerId, token }));
    }
  }, [partnerId, token, dispatch]);

  // real‐time listener
  useEffect(() => {
    if (!partnerId) return;
    const socket = getSocket();
    const handler = (payload: any) => {
      if (payload.sender === partnerId) {
        dispatch(
          receiveMessage({
            id: nanoid(),
            sender: payload.sender,
            text: payload.ciphertext,
            createdAt: payload.createdAt ?? new Date().toISOString(),
          })
        );
      }
    };
    socket.on("receive-message", handler);
    return () => {
      socket.off("receive-message", handler);
    };
  }, [partnerId, dispatch]);

  const send = async () => {
    if (!partnerId || !text.trim()) return;
    const createdAt = new Date().toISOString();

    // emit
    getSocket().emit("send-message", {
      sender: me._id,
      receiver: partnerId,
      ciphertext: text,
      createdAt,
    });

    // optimistic UI
    dispatch(receiveMessage({ sender: me._id, text, createdAt }));
    setText("");

    // persist
    await fetch(`${import.meta.env.VITE_API_URL}/message/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ receiver: partnerId, ciphertext: text }),
    });
  };

  if (!partnerId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a {section.slice(0, -1)} to view messages
      </div>
    );
  }

  // now every message has .text, so this is safe:
  const messages = history.filter((m) =>
    (m.text ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b">
        {/* …controls… */}
      </div>

      {/* Message Scroll */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.map((m, i) => (
          <div
            key={m.id ?? i} // ← unique DB id, or index as a last‐resort
            className={`
      max-w-xs p-3 rounded-lg
      ${m.sender === me._id ? "ml-auto bg-indigo-100" : "mr-auto bg-white"}
    `}
          >
            <div className="text-sm text-gray-800">{m.text}</div>
            <div className="mt-1 text-xs text-gray-500 text-right">
              {new Date(m.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-3 p-4 border-t">
        <FiSmile className="cursor-pointer" />
        <FiPaperclip className="cursor-pointer" />
        <input
          className="flex-1 px-3 py-2 rounded-full border"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
        />
        <button
          onClick={send}
          className="p-2 bg-indigo-600 text-white rounded-full"
        >
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
};

export default MessageBox;
