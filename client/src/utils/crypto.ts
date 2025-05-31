// crypto.ts
import { openDB } from 'idb';

const db = await openDB('chat-crypto', 1, {
  upgrade(db) { db.createObjectStore('keys'); }
});

export async function ensureKeyPair() {
  let kp = await db.get('keys', 'ecdh');
  if (!kp) {
    kp = await crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      ['deriveKey']
    );
    await db.put('keys', kp, 'ecdh');

    // export & POST your public key
    const raw = await crypto.subtle.exportKey('raw', kp.publicKey);
    const pubB64 = btoa(String.fromCharCode(...new Uint8Array(raw)));
    await fetch('/api/users/public-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ publicKey: pubB64 }),
    });
  }
  return kp;
}
export async function deriveChatKey(
  chatId: string,
  theirPubB64: string,
  myPriv: CryptoKey
): Promise<CryptoKey> {
  const raw = Uint8Array.from(atob(theirPubB64), c => c.charCodeAt(0));
  const theirKey = await crypto.subtle.importKey(
    'raw', raw.buffer, { name: 'ECDH', namedCurve: 'P-256' }, false, []
  );

  return crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: new TextEncoder().encode(chatId),
      info: new TextEncoder().encode('AES-GCM chat key'),
    },
    myPriv,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptMessage(key: CryptoKey, text: string, chatId: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));      // 96-bit
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: new TextEncoder().encode(chatId) },
    key,
    new TextEncoder().encode(text)
  );
  return {
    iv: btoa(String.fromCharCode(...iv)),
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(ct))),
  };
}

export async function decryptMessage(key: CryptoKey, ivB64: string, ctB64: string, chatId: string) {
  const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0));
  const ct = Uint8Array.from(atob(ctB64), c => c.charCodeAt(0));
  const pt = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv, additionalData: new TextEncoder().encode(chatId) },
    key,
    ct
  );
  return new TextDecoder().decode(pt);
}