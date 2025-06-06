// src/components/PassphraseModal.tsx
import React, { useState } from "react";

interface Props {
  onSubmit: (passphrase: string) => void;
  onCancel?: () => void;
  errorMessage?: string | null;
}

const PassphraseModal: React.FC<Props> = ({
  onSubmit,
  onCancel,
  errorMessage,
}) => {
  const [passphrase, setPassphrase] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase.trim() !== "") {
      onSubmit(passphrase.trim());
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Enter your passphrase
        </h2>
        {errorMessage && (
          <p className="text-sm text-red-600 mb-2">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            autoFocus
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="Passphrase"
            className="w-full px-3 py-2 mb-4 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 rounded hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
            >
              Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PassphraseModal;
