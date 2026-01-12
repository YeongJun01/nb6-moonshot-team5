import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendInvitationEmail(to: string, acceptUrl: string, projectName: string) {
  const msg = {
    to,
    from: {
      email: 'pkeonyz@gmail.com',
      name: 'Team5 Moonshot',
    },
    subject: `${projectName} 프로젝트 초대`,
    html: `
      <h2>${projectName} 프로젝트 초대</h2>
      <p>아래 링크를 클릭해 주세요.</p>
      <a href="${acceptUrl}">초대 수락</a>
    `,
  };

  await sgMail.send(msg);
}
