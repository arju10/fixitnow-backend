import bcrypt from 'bcryptjs';
import config from '../config';

export const hashPassword = async (plain: string): Promise<string> => {
  const saltRounds = parseInt(config.bcrypt_salt_rounds as string) || 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(plain, salt);
};

export const comparePassword = async (plain: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};
