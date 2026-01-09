import { Request, Response } from 'express';
import authService from '../service/auth-service';
import UnauthorizedError from '../lib/errors/UnauthorizedError';

class AuthController {
  //회원가입
  async register(req: Request, res: Response) {
    //이메일, 비밀번호, 이름 추출
    const { email, password, name } = req.body;
    //유저 생성
    const user = await authService.registerUser(email, name, password);

    //비밀번호 제외한 유저 정보 반환
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).send(userWithoutPassword);
  }

  //로그인
  async login(req: Request, res: Response) {
    //이메일, 비밀번호 추출
    const { email, password } = req.body;

    //유저 로그인
    const { accessToken, refreshToken } = await authService.loginUser(email, password);

    res.status(200).send({ accessToken, refreshToken });
  }

  //토큰 재발급
  async refreshToken(req: Request, res: Response) {
    //리프레시 토큰 추출
    const authHeader = req.headers.authorization;

    //토큰 확인
    if (!authHeader) {
      throw new UnauthorizedError('리프레시 토큰이 제공되지 않았습니다.');
    }

    const [type, refreshToken] = authHeader.split(' ');

    if (type !== 'Bearer' || !refreshToken) {
      throw new UnauthorizedError('유효하지 않은 토큰 형식입니다.');
    }

    //토큰 재발급
    const { accessToken, newRefreshToken } = await authService.refreshToken(refreshToken);

    res.status(200).send({ accessToken, refreshToken: newRefreshToken });
  }

  //Google OAuth 로그인
  async googleLogin(req: Request, res: Response) {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: `${process.env.BACKEND_URL}/auth/google/callback`,
      response_type: 'code',
      scope: ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/calendar.events'].join(
        ' ',
      ),
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: 'true',
    });

    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  }

  // ② Google → callback
  async googleCallback(req: Request, res: Response) {
    const code = req.query.code as string;

    if (!code) {
      throw new UnauthorizedError('Google 인증 실패');
    }

    const { accessToken, refreshToken } = await authService.handleGoogleCallback(code);

    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('access-token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60, // 1시간
    });

    // refresh token
    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 14, // 14일
    });

    //  redirect
    res.redirect(`${process.env.FRONTEND_URL}/projects`); //유저 api 만든 뒤 수정
  }
  //로그아웃
  async logout(req: Request, res: Response) {
    //클라이언트 측에서 토큰 삭제 처리
    res.status(200).send({ message: '로그아웃 되었습니다.' });
  }
}

export default new AuthController();
