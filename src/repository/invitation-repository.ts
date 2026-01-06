import prisma from '../lib/prisma';
import { InvitationStatus } from '@prisma/client';

class InvitationRepository {
  async findById(invId: number) {
    return prisma.invitation.findUnique({
      where: { id: invId },
    });
  }

  async updateStatus(invId: number, status: InvitationStatus) {
    return prisma.invitation.update({
      where: { id: invId },
      data: { status },
    });
  }

  async deleteInvitation(invId: number) {
    return await prisma.invitation.delete({ where: { id: invId } });
  }
}

export default new InvitationRepository();
