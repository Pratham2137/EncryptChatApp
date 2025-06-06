// src/utils/AuthProvider.tsx
import React, { useState, useEffect, useRef, ReactNode } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LoadingOverlay from "./LoadingOverlay";
import PassphraseModal from "../components/Auth/PassphraseModal"; // <--- import our new component
import { AuthContext, AuthContextType } from "./AuthContext";
import {
  generateECDHKeyPair,
  exportPublicKeyBase64,
  exportPrivateKeyJWK,
  importPrivateKeyJWK,
  importPublicKeyFromJWK,
  deriveKeyFromPassphrase,
  encryptAESGCM,
  decryptAESGCM,
} from "./crypto";

export function AuthProvider({ children }: { children: ReactNode }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const refreshTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Once unlocked, we store the user’s ECDH key pair here:
  const [ecdhKeyPair, setECDHKeyPair] = useState<CryptoKeyPair | null>(null);
  // A flag to indicate we just generated a NEW pair (so we must upload its public key):
  const [justCreatedKeyPair, setJustCreatedKeyPair] = useState(false);

  // ────────────────────────────────────────────────────────────────────────────
  // NEW: If `initializeKeyPair()` finds an existing encrypted‐private‐key,
  // we stash it here and ask the user to unlock it via the modal.
  // ────────────────────────────────────────────────────────────────────────────
  const [pendingEncryptedPriv, setPendingEncryptedPriv] = useState<{
    iv: string;
    ciphertext: string;
  } | null>(null);
  const [showPassphraseModal, setShowPassphraseModal] = useState(false);
  const [decryptError, setDecryptError] = useState<string | null>(null);

  // ────────────────────────────────────────────────────────────────────────────
  // Helpers for token expiration & scheduling refresh
  // ────────────────────────────────────────────────────────────────────────────
  const isTokenExpired = (token: string) => {
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };
  const getRemainingTime = (token: string) => {
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return decoded.exp * 1000 - Date.now();
    } catch {
      return 0;
    }
  };
  const scheduleTokenRefresh = (token: string) => {
    clearTimeout(refreshTimeout.current);
    const remaining = getRemainingTime(token);
    // Refresh one minute before expiry:
    const when = remaining - 60_000;
    if (when > 0) {
      refreshTimeout.current = setTimeout(refreshAuthToken, when);
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // Attempt to get a fresh accessToken via the refresh‐cookie
  // ────────────────────────────────────────────────────────────────────────────
  const refreshAuthToken = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/auth/check`, {
        withCredentials: true, // send refresh cookie
      });
      const { success, accessToken: newToken } = data;
      if (!success || !newToken) {
        throw new Error("Could not refresh session");
      }
      setAccessToken(newToken);
      setIsAuthenticated(true);
      scheduleTokenRefresh(newToken);
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 403) {
        toast.error("Session expired, please log in again.");
      }
      logout();
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // Key‐pair initialization (only call this if accessToken is non‐null)
  //   • If `GET /users/encrypted-private/:userId` exists:
  //       → stash that blob in pendingEncryptedPriv and open the modal
  //       → return early (we do not try to decrypt until the user submits passphrase)
  //   • Otherwise (first time):
  //       → generate new ECDH pair → prompt for new passphrase via modal → encrypt & upload
  // ────────────────────────────────────────────────────────────────────────────
  const initializeKeyPair = async (tokenToUse: string) => {
  if (!tokenToUse) {
    throw new Error("No accessToken; cannot initialize key pair");
  }

  // 0) Decode userId from the JWT payload
  let myUserId: string;
  try {
    const decoded = jwtDecode<{ userId: string }>(tokenToUse);
    myUserId = decoded.userId;
  } catch {
    throw new Error("Invalid accessToken");
  }

  // 1) Try fetching an existing encrypted private key from the server
  let encryptedPriv: { iv: string; ciphertext: string } | null = null;
  try {
    const resp = await axios.get(
      `${apiUrl}/users/encrypted-private/${myUserId}`,
      { headers: { Authorization: `Bearer ${tokenToUse}` } }
    );
    encryptedPriv = resp.data; // expects { iv: string, ciphertext: string }
  } catch {
    encryptedPriv = null;
  }

  if (encryptedPriv && !justCreatedKeyPair) {
    setPendingEncryptedPriv(encryptedPriv);
    setDecryptError(null);
    setShowPassphraseModal(true);
    return;
  }

  // Generate a brand-new ECDH pair (first-time path)
  try {
    const brandNewPair = await generateECDHKeyPair();
    setECDHKeyPair(brandNewPair);
    setJustCreatedKeyPair(true);

    // (1) Export & upload public key
    const pubRawBase64 = await exportPublicKeyBase64(brandNewPair.publicKey);
    await axios.post(
      `${apiUrl}/users/public-key`,
      { publicKey: pubRawBase64 },
      { headers: { Authorization: `Bearer ${tokenToUse}` } }
    );

    // (2) Prompt for a new passphrase via modal:
    setPendingEncryptedPriv(null);
    setShowPassphraseModal(true);
    return;
  } catch (genErr) {
    console.error("Failed to generate/upload new ECDH key pair", genErr);
    throw genErr;
  }
};


  // ────────────────────────────────────────────────────────────────────────────
  // Once the user types in their passphrase (either for existing key or new key),
  // we run this helper to finish unlocking (or encrypting & uploading).
  // ────────────────────────────────────────────────────────────────────────────
  const handlePassphraseSubmit = async (passphrase: string) => {
    setDecryptError(null);

    // First, derive a key from the passphrase. For simplicity we use a fixed salt:
    const salt = new TextEncoder().encode("fixed_salt_16bytes");
    let passKey: CryptoKey;
    try {
      passKey = await deriveKeyFromPassphrase(passphrase, salt);
    } catch (derErr) {
      console.error("Failed to derive key from passphrase", derErr);
      setDecryptError("Unable to derive key. Try again.");
      return;
    }

    if (pendingEncryptedPriv) {
      // ─────────────────────────────────────────────────────────────────────
      // A) We have an existing blob fetched from the server. Decrypt it now.
      // ─────────────────────────────────────────────────────────────────────
      try {
        const privateJwkJson = await decryptAESGCM(
          passKey,
          pendingEncryptedPriv.iv,
          pendingEncryptedPriv.ciphertext
        );
        const jwk = JSON.parse(privateJwkJson);
        const privateKey = await importPrivateKeyJWK(jwk);
        const publicKey = await importPublicKeyFromJWK(jwk);
        setECDHKeyPair({ publicKey, privateKey });
        setPendingEncryptedPriv(null);
        setShowPassphraseModal(false);
      } catch (decErr) {
        console.error("Wrong passphrase or corrupted private key", decErr);
        setDecryptError("Wrong passphrase. Please try again.");
      }
    } else {
      // ─────────────────────────────────────────────────────────────────────
      // B) We are generating a brand-new ECDH pair (first-time path).
      //    So at this point `ecdhKeyPair` already holds the newly‐generated pair.
      //    We just need to export its privateJWK → encrypt → upload.
      // ─────────────────────────────────────────────────────────────────────
      if (!ecdhKeyPair) {
        setDecryptError("Internal error: key pair not found.");
        return;
      }

      try {
        // Export private key as JWK JSON
        const privateJwk = await exportPrivateKeyJWK(ecdhKeyPair.privateKey);
        const privateJwkJson = JSON.stringify(privateJwk);

        // Encrypt that JSON under AES-GCM
        const { iv, ciphertext } = await encryptAESGCM(passKey, privateJwkJson);

        // Upload to server
        await axios.post(
          `${apiUrl}/users/encrypted-private`,
          { iv, ciphertext },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        // Clear modal and continue
        setShowPassphraseModal(false);
      } catch (err) {
        console.error("Failed to encrypt+upload new private key", err);
        setDecryptError("Could not protect private key. Try again.");
      }
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // initializeAuth (runs once on mount)
  //   1) Call GET /auth/check (sends the refresh-token cookie)
  //   2) If that returns { success:true, accessToken:<token> } → store token,
  //      set isAuthenticated, schedule refresh, then call initializeKeyPair()
  //   3) If it returns 401 → “not logged in yet” → swallow
  //   4) If it throws any other error (500, etc.) → console.error + logout()
  // ────────────────────────────────────────────────────────────────────────────
  const initializeAuth = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/auth/check`, {
        withCredentials: true,
      });
      const { success, accessToken: newToken } = data;

      if (success && newToken && !isTokenExpired(newToken)) {
        setAccessToken(newToken);
        setIsAuthenticated(true);
        scheduleTokenRefresh(newToken);

        // Only now do we call initializeKeyPair(). That function will either:
        //  • stash pendingEncryptedPriv + show modal, or
        //  • generate a brand-new pair + show modal
          await initializeKeyPair(newToken);

        // try {
        //   await initializeKeyPair();
        // } catch (keyErr) {
        //   // If initializeKeyPair ever throws unexpectedly, we log it but remain “logged in.”
        //   console.error("initializeKeyPair() error:", keyErr);
        // }
      }
      // If success===false, we do nothing (user is not yet authenticated)
    } catch (err: any) {
      if (err.response?.status === 401) {
        // “Not authenticated yet” → swallow silently
      } else {
        console.error("initializeAuth() unexpected error:", err);
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // login(): POST /auth/login → on success store token & call initializeKeyPair()
  // ────────────────────────────────────────────────────────────────────────────
  const login = async (loginData: { email: string; password: string }) => {
    try {
      const { data } = await axios.post(`${apiUrl}/auth/login`, loginData, {
        withCredentials: true,
      });
      const { success, message, accessToken: newToken } = data;
      if (!success || !newToken) {
        throw new Error(message || "Login failed");
      }

      setAccessToken(newToken);
      setIsAuthenticated(true);
      scheduleTokenRefresh(newToken);

      // Now that we have a brand-new JWT, set up the ECDH key-pair:
          await initializeKeyPair(newToken);

      // try {
      //   await initializeKeyPair();
      // } catch (keyErr) {
      //   console.error("initializeKeyPair() error on login:", keyErr);
      // }

      toast.success(message);
      navigate("/");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Login error";
      toast.error(msg);
      setIsAuthenticated(false);
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // logout():
  //   - If we have an accessToken, POST /auth/logout
  //   - If the server returns 400 or 403, ignore
  //   - Clear all client state and navigate to /login
  // ────────────────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      if (accessToken) {
        await axios.post(
          `${apiUrl}/auth/logout`,
          {},
          { withCredentials: true }
        );
      }
    } catch (err: any) {
      const status = err.response?.status;
      if (status !== 400 && status !== 403) {
        console.error("Unexpected error on logout():", err);
      }
    } finally {
      clearTimeout(refreshTimeout.current!);
      setAccessToken(null);
      setIsAuthenticated(false);
      setECDHKeyPair(null);
      setJustCreatedKeyPair(false);
      navigate("/login");
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // Call initializeAuth() exactly once on mount
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    initializeAuth();
    return () => clearTimeout(refreshTimeout.current!);
  }, []);

  // If we are still “loading” (checking /auth/check + possibly waiting on modal), show overlay.
  if (loading) {
    return <LoadingOverlay loading />;
  }

  // If we need a passphrase, show our PassphraseModal on top of everything.
  if (showPassphraseModal) {
    return (
      <PassphraseModal
        onSubmit={handlePassphraseSubmit}
        onCancel={() => {
          // If they cancel, we effectively log them out:
          logout();
        }}
        errorMessage={decryptError}
      />
    );
  }

  // Once loading is false and no passphrase is required, we can render children:
  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    getToken: () => accessToken,
    ecdhKeyPair,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
