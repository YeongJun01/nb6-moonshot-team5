export type MemberListDTO = {
  id: number;
  name: string;
  email: string;
  profileImage: string | null;
  taskCount: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  invitationId: number | null;
};
