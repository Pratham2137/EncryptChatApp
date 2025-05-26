// src/components/Settings/Profile.tsx
import React, { useState } from "react";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";

interface User {
  avatarUrl?: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  description: string;
}

const mockUser: User = {
  // avatarUrl: "https://example.com/avatar.jpg",
  name: "John Doe",
  username: "johndoe123",
  email: "john.doe@example.com",
  phone: "+1 234 567 890",
  description:
    "Full-stack developer passionate about secure messaging. In my free time, I love hiking and photography.",
};

const Profile: React.FC = () => {
  const [user] = useState<User>(mockUser);

  return (
    <div className="p-6 h-full overflow-y-auto flex flex-col gap-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
        Profile
      </h2>

      {/* Avatar + Name */}
      <div className="flex items-center gap-4">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-white text-3xl">
            <FiUser />
          </div>
        )}
        <div>
          <div className="text-xl font-semibold text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
            {user.name}
          </div>
          <div className="text-sm text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]">
            @{user.username}
          </div>
        </div>
      </div>

      {/* Details Card */}
      <div
        className="
          bg-[var(--color-card)] dark:bg-[var(--color-card-darkmode)]
          border border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]
          p-4 rounded-md flex flex-col gap-4
        "
      >
        {/* Email */}
        <div>
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]">
            Email
          </h3>
          <p
            className="
              mt-1 flex items-center gap-2 
              text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]
            "
          >
            <FiMail /> {user.email}
          </p>
        </div>

        {/* Phone */}
        <div>
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]">
            Phone
          </h3>
          <p
            className="
              mt-1 flex items-center gap-2 
              text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]
            "
          >
            <FiPhone /> {user.phone}
          </p>
        </div>

        {/* About / Bio */}
        <div>
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]">
            About
          </h3>
          <p className="mt-1 text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
            {user.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
