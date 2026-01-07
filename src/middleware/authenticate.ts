import prisma from '../lib/prisma';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '../lib/constants';
import { AuthenticatedRequest } from '../types/auth';
import UnauthorizedError from '../lib/errors/UnauthorizedError';

export async function authenticateAccess(req: AuthenticatedRequest, res: Response, next: Function) {
  // 쿠키가 아닌 authorization 헤더에서 토큰 추출
  const authHeader = req.headers.authorization;
  const accessTokenFromCookie = req.cookies?.accessToken;
  const accessTokenFromQuery = req.query.accessToken as string | undefined;

  let token;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (accessTokenFromCookie) {
    token = accessTokenFromCookie;
  } else if (accessTokenFromQuery) {
    token = accessTokenFromQuery;
  }
  // 토큰이 없으면 401 Unauthorized 응답
  if (!token) {
    throw new UnauthorizedError('토큰이 제공되지 않았습니다.1');
  }

  // // Bearer의 타입과 토큰 분리
  // const [type, token] = authHeader.split(' ');

  // // 타입이 Bearer가 아니거나 토큰이 없으면
  // if (type !== 'Bearer' || !token) {
  //   throw new UnauthorizedError('유효하지 않은 토큰 형식입니다.');
  // }

  try {
    // 토큰 검증
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as {
      userId: number;
      email: string;
      name: string;
    };

    // 토큰에서 사용자 정보 추출
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new UnauthorizedError('사용자를 찾을 수 없습니다.');
    }

    // req 객체에 사용자 정보 추가
    // 사용할 때
    // 라우터 핸들러에서
    // authenticateAccess, asyncHandler(projectController.createProject)
    // 위 같은 식의 순서로 사용 시 인증 적용
    // 그 후에 각 로직에서 req.user.id로 접근 가능
    // const userId = req.user.id;
    //const user = await prisma.user.findUnique({
    //   where: { id: userId },
    // });
    // 이런 식으로 사용
    req.user = {
      id: user.id,
    };

    next();
  } catch (e) {
    next(e);
  }
}

export async function authenticateRefresh(
  req: AuthenticatedRequest,
  res: Response,
  next: Function,
) {
  const authoHeader = req.headers.authorization;

  if (!authoHeader) {
    throw new UnauthorizedError('토큰이 제공되지 않았습니다.2');
  }

  const [type, token] = authoHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    throw new UnauthorizedError('유효하지 않은 토큰 형식입니다.');
  }

  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as {
      userId: number;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new UnauthorizedError('사용자를 찾을 수 없습니다.');
    }

    req.refreshToken = token;
    req.user = {
      id: user.id,
    };
    next();
  } catch (e) {
    next(e);
  }
}
