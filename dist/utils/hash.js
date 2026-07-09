import bcrypt from 'bcryptjs';
import config from '../config';
export const hashPassword = async (plain) => {
    const saltRounds = parseInt(config.bcrypt_salt_rounds) || 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(plain, salt);
};
export const comparePassword = async (plain, hashed) => {
    return bcrypt.compare(plain, hashed);
};
//# sourceMappingURL=hash.js.map