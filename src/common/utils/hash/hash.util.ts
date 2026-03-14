import * as bcrypt from "bcrypt";

export const hashPassword = async (
  plainText: string,
  saltRounds = Number(process.env.SALT_ROUNDS ?? 10),
): Promise<string> => {
  return bcrypt.hash(plainText, saltRounds);
};

export const comparePassword = async (
  hash: string,
  plainText: string,
): Promise<boolean> => {
  return bcrypt.compare(plainText, hash);
};
