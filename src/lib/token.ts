import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from './constants';

export type TokenType = 'access' | 'refresh';

export interface TokenPayload {
  userId: number;
  type: TokenType;
}

export function generateToken(userId: number): { accessToken: string; refreshToken: string } {
  const accessPayload: TokenPayload = { userId, type: 'access' };
  const refreshPayload: TokenPayload = { userId, type: 'refresh' };

  const accessToken = jwt.sign(accessPayload, JWT_ACCESS_SECRET, { expiresIn: '1h' });

  const refreshToken = jwt.sign(refreshPayload, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): { userId: number } {
  try {
    const payload = jwt.verify(token, JWT_ACCESS_SECRET) as TokenPayload;

    if (payload.type !== 'access') {
      throw new Error('Access token이 아닙니다.');
    }
    return { userId: payload.userId };
  } catch (e) {
    throw new Error('유효하지 않거나 만료된 Access token입니다.');
  }
}

export function verifyRefreshToken(token: string): { userId: number } {
  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;

    if (payload.type !== 'refresh') {
      throw new Error('Refresh token이 아닙니다.');
    }
    return { userId: payload.userId };
  } catch (e) {
    throw new Error('유효하지 않거나 만료된 Refresh token입니다.');
  }
}
