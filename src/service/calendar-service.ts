import { google } from 'googleapis';
import authRepository from '../repository/auth-repository';
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';

export interface GoogleOauthRepo {
  findGoogleOauthByUserId(userId: number): Promise<{
    id: number;
    accessToken: string;
    refreshToken: string;
    tokenExpiry: Date;
  } | null>;

  updateTokens(id: number, accessToken: string, tokenExpiry: Date): Promise<any>;
}

function addOneDay(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function toAllDayDate(year: number, month: number, day: number) {
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

type TaskForCalendar = {
  title: string;
  description?: string | null;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
};

export class CalendarService {
  constructor(
    private oauthRepo: GoogleOauthRepo,
    private clientId = process.env.GOOGLE_CLIENT_ID!,
    private clientSecret = process.env.GOOGLE_CLIENT_SECRET!,
    private redirectUri = process.env.GOOGLE_REDIRECT_URI!,
  ) {}

  private async getCalendarClient(userId: number) {
    const oauth = await this.oauthRepo.findGoogleOauthByUserId(userId);
    if (!oauth) throw new Error('구글 연동이 필요합니다.');
    if (!oauth.refreshToken) throw new Error('구글 리프레시 토큰이 없습니다. 재연동이 필요합니다.');

    const oAuth2Client = new google.auth.OAuth2(this.clientId, this.clientSecret, this.redirectUri);

    oAuth2Client.setCredentials({
      access_token: oauth.accessToken,
      refresh_token: oauth.refreshToken,
    });

    if (oauth.tokenExpiry <= new Date()) {
      const res = await oAuth2Client.refreshAccessToken(); // googleapis 구버전 호환

      const newAccessToken = res.credentials.access_token;
      const expiryDateMs = res.credentials.expiry_date;

      if (newAccessToken && expiryDateMs) {
        await this.oauthRepo.updateTokens(oauth.id, newAccessToken, new Date(expiryDateMs));
        oAuth2Client.setCredentials({
          access_token: newAccessToken,
          refresh_token: oauth.refreshToken,
        });
      }
    }

    return google.calendar({ version: 'v3', auth: oAuth2Client });
  }

  async createTaskEvent(userId: number, task: TaskForCalendar): Promise<string> {
    const calendar = await this.getCalendarClient(userId);

    const start = toAllDayDate(task.startYear, task.startMonth, task.startDay);

    const endInclusive = toAllDayDate(task.endYear, task.endMonth, task.endDay);
    const endExclusive = addOneDay(endInclusive);

    const res = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: task.title,
        description: task.description ?? '',
        start: { date: start },
        end: { date: endExclusive },
      },
    });

    if (!res.data.id) throw new Error('Google event 생성 실패');

    console.log(res.data, '생성 성공');
    return res.data.id;
  }

  async updateTaskEvent(userId: number, eventId: string, task: TaskForCalendar) {
    const calendar = await this.getCalendarClient(userId);

    const start = toAllDayDate(task.startYear, task.startMonth, task.startDay);
    const endExclusive = addOneDay(toAllDayDate(task.endYear, task.endMonth, task.endDay));

    await calendar.events.patch({
      calendarId: 'primary',
      eventId,
      requestBody: {
        summary: task.title,
        description: task.description ?? '',
        start: { date: start },
        end: { date: endExclusive },
      },
    });
  }

  async deleteTaskEvent(userId: number, eventId: string) {
    const calendar = await this.getCalendarClient(userId);
    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
    });
  }
}

export default new CalendarService(authRepository);
