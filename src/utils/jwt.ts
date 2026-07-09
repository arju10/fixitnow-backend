import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import config from '../config';

export interface JwtPayload {
  userId: string;
  role: 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwt_access_secret, {
    expiresIn: config.jwt_access_expires_in,
  } as SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  if (!token) {
    throw new Error('Token is required');
  }
  return jwt.verify(token, config.jwt_access_secret) as JwtPayload;
};
