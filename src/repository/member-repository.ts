import prisma from '../lib/prisma';
import { PagePaginationResult } from '../types/pagination';
import { MemberListDTO } from '../dto/member-list-DTO';

class MembersRepository {
  async getProjectMembers(projectId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;

    //id, name, email, profileImage, task
    const members = await prisma.projectMember.findMany({
      where: { projectId },
      skip,
      take: limit,
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            _count: {
              select: {
                tasks: true,
              },
            },
          },
        },
      },
    });

    //total
    const total = await prisma.projectMember.count({ where: { projectId } });

    const emails = members.map((m) => m.user.email);

    const invitations = await prisma.invitation.findMany({
      where: {
        projectId,
        invitedEmail: { in: emails },
      },
      select: {
        id: true,
        invitedEmail: true,
        status: true,
      },
    });

    const invitationByEmail = new Map(invitations.map((inv) => [inv.invitedEmail, inv]));
    // email로 status를 알 수 있도록 매핑

    const data: MemberListDTO[] = members.map((m) => {
      const invitationInfo = invitationByEmail.get(m.user.email);

      return {
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        profileImage: m.user.profileImage,
        taskCount: m.user._count.tasks,
        status: invitationInfo?.status ?? 'ACCEPTED',
        invitationId: invitationInfo?.id ?? null,
      };
    });
    const result: PagePaginationResult<MemberListDTO> = { data, total };
    return result;
  }

  async findProjectMember(projectId: number, userId: number) {
    return prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
      select: {
        id: true,
        role: true,
        projectId: true,
        userId: true,
      },
    });
  }

  async isProjectMember(projectId: number, userId: number): Promise<boolean> {
    const member = await this.findProjectMember(projectId, userId);
    return member !== null;
  }

  async deleteProjectMember(projectId: number, userId: number) {
    return prisma.projectMember.delete({
      where: { projectId_userId: { projectId, userId } },
    });
  }
}

export default new MembersRepository();
