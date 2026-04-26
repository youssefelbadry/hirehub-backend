import crypto from "node:crypto";

const IV_LENGTH = Number(process.env.IV) || 16;

const getKey = () => {
  const key = process.env.ENCREPTION_KEY;

  if (!key) {
    throw new Error("ENCRYPTION_KEY is missing in .env");
  }

  return Buffer.from(key, "hex");
};

export const encrypt = (plainText: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv("aes-256-cbc", getKey(), iv);

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
};

export const decrypt = (data: string): string => {
  if (!data || !data.includes(":")) {
    throw new Error("Invalid encrypted data format");
  }

  const [ivHex, cipherText] = data.split(":");

  if (!ivHex || !cipherText) {
    throw new Error("Invalid encrypted data structure");
  }

  const iv = Buffer.from(ivHex, "hex");

  if (iv.length !== 16) {
    throw new Error("Invalid IV length");
  }

  const decipher = crypto.createDecipheriv("aes-256-cbc", getKey(), iv);

  let decrypted = decipher.update(cipherText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
