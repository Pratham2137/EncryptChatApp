import React from "react";
import ChatList from "../Chats/ChatList";
import ContactList from "../Contacts/ContactList";
import GroupList from "../Groups/GroupList";
import Profile from "../Settings/Profile";
import AppSettings from "../Settings/AppSettings";

interface Props {
  section: "chats" | "contacts" | "groups" | "profile" | "app-settings";
  selectedId: string | null;
  onSelectId: (id: string) => void;
}

const ContentArea: React.FC<Props> = ({
  section,
  selectedId,
  onSelectId,
}) => {
  return (
    <div
      className="
        w-80 h-full flex flex-col
        bg-[var(--color-card)] dark:bg-[var(--color-card-darkmode)]
      "
    >
      {section === "chats" && (
        <ChatList selectedId={selectedId} onSelectId={onSelectId} />
      )}
      {section === "contacts" && (
        <ContactList selectedId={selectedId} onSelectId={onSelectId} />
      )}
      {section === "groups" && (
        <GroupList selectedId={selectedId} onSelectId={onSelectId} />
      )}
      {section === "profile" && (
        <div className="flex-1 overflow-y-auto">
          <Profile />
        </div>
      )}
      {section === "app-settings" && (
        <div className="flex-1 overflow-y-auto">
          <AppSettings />
        </div>
      )}
    </div>
  );
};

export default ContentArea;
