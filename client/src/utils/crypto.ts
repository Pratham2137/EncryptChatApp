
export async function generateECDHKeyPair(): Promise<CryptoKeyPair> {
  return window.crypto.subtle.generateKey(
    {
      name:       "ECDH",
      namedCurve: "P-256",      
    },
    true,                      
    ["deriveKey"]              
  );
}


export async function exportPublicKeyBase64(pubKey: CryptoKey): Promise<string> {
  const raw = await window.crypto.subtle.exportKey("raw", pubKey);
  const bytes = new Uint8Array(raw);
  const b64   = btoa(String.fromCharCode(...bytes));
  return b64;
}


export async function importPeerPublicKey(base64: string): Promise<CryptoKey> {
  const raw = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return window.crypto.subtle.importKey(
    "raw",
    raw.buffer,
    {
      name:       "ECDH",
      namedCurve: "P-256",
    },
    true,
    []
  );
}


export async function exportPrivateKeyJWK(privKey: CryptoKey): Promise<JsonWebKey> {
  const jwk = await window.crypto.subtle.exportKey("jwk", privKey);
  return jwk; 
}


export async function importPrivateKeyJWK(jwk: JsonWebKey): Promise<CryptoKey> {
  return window.crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name:       "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey"]
  );
}


export async function deriveSharedAESKey(
  myPrivateKey:   CryptoKey,
  theirPublicKey: CryptoKey
): Promise<CryptoKey> {
  return window.crypto.subtle.deriveKey(
    {
      name:   "ECDH",
      public: theirPublicKey,
    },
    myPrivateKey,
    {
      name:   "AES-GCM",
      length: 256,
    },
    false,                 
    ["encrypt", "decrypt"]
  );
}

export async function encryptAESGCM(
  aesKey:    CryptoKey,
  plaintext: string
): Promise<{ iv: string; ciphertext: string }> {
  const iv      = window.crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const ptBuf   = encoder.encode(plaintext);

  const cipherBuf = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    ptBuf
  );

  const ctBytes = new Uint8Array(cipherBuf);
  const b64ct   = btoa(String.fromCharCode(...ctBytes));
  const b64iv   = btoa(String.fromCharCode(...iv));
  return { iv: b64iv, ciphertext: b64ct };
}


export async function decryptAESGCM(
  aesKey: CryptoKey,
  ivB64:  string,
  ctB64:  string
): Promise<string> {
  const iv = Uint8Array.from(atob(ivB64), (c) => c.charCodeAt(0));
  const ct = Uint8Array.from(atob(ctB64), (c) => c.charCodeAt(0));

  const plainBuf = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    aesKey,
    ct
  );
  const decoder = new TextDecoder();
  return decoder.decode(plainBuf);
}


export async function deriveKeyFromPassphrase(
  passphrase: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  // 1) Convert passphrase → ArrayBuffer
  const enc = new TextEncoder();
  const passBuf = enc.encode(passphrase);

  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    passBuf,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const aesKey = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 200_000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );

  return aesKey;
}

export async function importPublicKeyFromJWK(
  jwk: JsonWebKey
): Promise<CryptoKey> {
  const publicJwk: JsonWebKey = {
    kty: jwk.kty,
    crv: jwk.crv,
    x:   jwk.x,
    y:   jwk.y,
    ext: true,
  };
  return window.crypto.subtle.importKey(
    "jwk",
    publicJwk,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    []
  );
}