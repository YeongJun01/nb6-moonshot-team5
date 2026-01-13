export type MemberListDTO = {
  id: number;
  name: string;
  email: string;
  profileImage: string | null;
  taskCount: number;
  status: 'pending' | 'accepted' | 'rejected';
  invitationId: number | null;
};
