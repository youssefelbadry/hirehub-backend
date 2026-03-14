import crypto from "node:crypto";

const algorithm = String(process.env.ENCRYPTION_ALGORITHM);
const key = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");

export const encrypt = async (text: string): Promise<string> => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
};

export const decrypt = async (data: string): Promise<string> => {
  const [ivHex, encryptedText] = data.split(":");

  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
