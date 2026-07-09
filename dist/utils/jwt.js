import jwt, {} from 'jsonwebtoken';
import config from '../config';
export const signToken = (payload) => {
    return jwt.sign(payload, config.jwt_access_secret, {
        expiresIn: config.jwt_access_expires_in,
    });
};
export const verifyToken = (token) => {
    if (!token) {
        throw new Error('Token is required');
    }
    return jwt.verify(token, config.jwt_access_secret);
};
//# sourceMappingURL=jwt.js.map