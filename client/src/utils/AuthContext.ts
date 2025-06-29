// src/utils/AuthContext.ts
import { createContext, useContext } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (data: { identifier: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => string | null;
  ecdhKeyPair: CryptoKeyPair | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
