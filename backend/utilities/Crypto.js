import crypto from "crypto";

// Derive a 32-byte key from password (store password in env var!)
const password = process.env.CRYPTO_SECRET;
const key = crypto.scryptSync(password, "salt", 32); // fixed salt for deterministic key

function encrypt(text) {
  const iv = crypto.randomBytes(12); // 12-byte IV recommended for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  // Encode everything in Base64 for easier storage/transmission
  const payload = `${iv.toString("hex")}:${authTag}:${encrypted}`;
  return Buffer.from(payload).toString("base64");
}

function decrypt(encryptedData) {
  try {
    const decoded = Buffer.from(encryptedData, "base64").toString();
    const [ivHex, authTagHex, encrypted] = decoded.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    // Catch errors from tampered/invalid data
    console.error("Decryption error:", err);
  }
}

export { encrypt, decrypt };
