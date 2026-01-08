import { Request, Response } from 'express';
import authService from '../service/auth-service';
import UnauthorizedError from '../lib/errors/UnauthorizedError';

class CalenderController {
  async googleCalendarConnect(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');

    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: `${process.env.BACKEND_URL}/calendar/google/callback`,
      response_type: 'code',
      scope: [
        'openid',
        'email',
        'profile',
        'https://www.googleapis.com/auth/calendar', // 생성/수정까지
        // 읽기만이면 calendar.readonly
      ].join(' '),
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: 'true',
      state: String(req.user.id), // 간단버전(개선은 아래 참고)
    });

    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  }
}
