export function buildInvitationAcceptUrl(invitationId: number) {
  const base = process.env.FRONTEND_BASE_URL ?? 'http://localhost:3000';
  return `${base.replace(/\/$/, '')}/invitations/${invitationId}/accept`;
}
