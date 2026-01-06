import { Resend } from 'resend';

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY 가 없습니다.');
  }

  return new Resend(apiKey);
}

export async function sendInvitationEmail(to: string, acceptUrl: string) {
  const resend = getResend();
  const result = await resend.emails.send({
    from: 'MoonShot <onboarding@resend.dev>',
    to,
    subject: '프로젝트 초대입니다.',
    html: `<p>프로젝트 초대입니다!</p><a href="${acceptUrl}">수락하기</a>`,
  });
}
