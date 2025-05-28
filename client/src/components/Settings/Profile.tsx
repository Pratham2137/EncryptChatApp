// src/components/Settings/Profile.tsx
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../features/store";
import { FiUser, FiMail, FiEdit2 } from "react-icons/fi";
import { RiRadioButtonLine } from "react-icons/ri";

export default function Profile() {
  const {
    data: user,
    status,
    error,
  } = useSelector((s: RootState) => s.userProfile);

  if (status === "loading") return <p>Loading your profile…</p>;
  if (status === "failed")  return <p className="text-red-500">Error: {error}</p>;
  if (!user)               return <p>No profile found.</p>;

  return (
    <div className="p-6 h-full overflow-y-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-white text-3xl">
          <FiUser />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <RiRadioButtonLine
              className={`text-lg ${user.isOnline ? "text-green-500" : "text-red-500"}`}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{user.username}
          </p>
        </div>
        <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
          <FiEdit2 className="text-xl text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-y-4">
        {/* Email */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-md flex items-start gap-3">
          <FiMail className="mt-1 text-xl text-gray-600 dark:text-gray-400" />
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Email
            </h3>
            <p className="mt-1 text-gray-800 dark:text-gray-200">
              {user.email}
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-md flex items-start gap-3">
          <FiUser className="mt-1 text-xl text-gray-600 dark:text-gray-400" />
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Bio
            </h3>
            <p className="mt-1 text-gray-800 dark:text-gray-200">
              {user.desc?.trim() || "No bio set."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
