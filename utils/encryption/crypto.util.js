import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
/**
 * A util for encryption and dertyption using crypto module
 */

export function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

export function encrypt(text) {
  const iv = crypto.randomBytes(parseInt(process.env.IV_LENGTH || "16", 10));
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.ENCRYPTION_KEY, "utf-8"),
    iv
  );
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text) {
  const [ivHex, encryptedHex] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.ENCRYPTION_KEY),
    iv
  );
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);
  return decrypted.toString();
}
