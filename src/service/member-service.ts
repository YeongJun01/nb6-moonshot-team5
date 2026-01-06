import { MemberListDTO } from '../dto/member-list-DTO';
import { PagePaginationResult } from '../types/pagination';
import memberRepository from '../repository/member-repository';
import projectRepository from '../repository/project-repository';
import invitationRepository from '../repository/invitation-repository';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import ConflictError from '../lib/errors/ConflictError';
import { sendInvitationEmail } from '../lib/mailer';
import { send } from 'node:process';
import prisma from '../lib/prisma';
import { InvitationStatus } from '@prisma/client';

class MembersService {
  async getProjectMembers(
    id: number,
    page: number,
    limit: number,
  ): Promise<PagePaginationResult<MemberListDTO>> {
    const members = await memberRepository.getProjectMembers(id, page, limit);
    return members;
  }

  async deleteProjectMember(projectId: number, userId: number) {
    const existingProject = await projectRepository.findById(projectId);
    if (!existingProject) {
      throw new NotFoundError('프로젝트가 없습니다.');
    }

    if (!(await memberRepository.isProjectMember(projectId, userId))) {
      throw new ForbiddenError('프로젝트 멤버가 아닙니다');
    }

    await memberRepository.deleteProjectMember(projectId, userId);
  }

  async inviteProjectMember(id: number, email: string) {
    const userId = await memberRepository.isMemberByEmail(email);
    //회원인지
    if (!userId) {
      throw new NotFoundError('가입되지 않은 이메일입니다.');
    }

    //프로젝트가 있는지
    if (!(await projectRepository.findById(id))) {
      throw new NotFoundError('프로젝트가 없습니다.');
    }

    //이미 초대된 멤버인지
    if (await memberRepository.isProjectMember(id, userId)) {
      throw new ConflictError('이미 프로젝트의 멤버입니다.');
    }

    const invitation = await memberRepository.inviteProjectMember(id, email);

    const acceptUrl = `http://localhost:3000/invitations/${invitation.id}/accept`;

    await sendInvitationEmail(email, acceptUrl);

    return { invitationId: invitation.id };
  }

  async acceptProjectMembers(invId: number, userId: number) {
    return prisma.$transaction(async () => {
      //유효한 초대인지
      const invitation = await invitationRepository.findById(invId);
      if (!invitation) {
        throw new NotFoundError('해당 초대가 없습니다.');
      }

      //초대한 메일과 로그인한 메일 일치여부
      const user = await memberRepository.findEmailById(userId);
      if (!user || invitation.invitedEmail !== user.email) {
        throw new ForbiddenError('초대한 대상이 아닙니다.');
      }

      //이미 프로젝트 멤버 확인

      if (await memberRepository.isProjectMember(invitation.projectId, userId)) {
        throw new ConflictError('이미 프로젝트 멤버입니다.');
      }

      //이미 처리된 초대인지
      if (invitation.status !== InvitationStatus.PENDING) {
        throw new ConflictError('이미 처리된 초대입니다.');
      }

      const newMember = await memberRepository.createProjectMember(invitation.projectId, userId);

      await invitationRepository.updateStatus(invId, InvitationStatus.ACCEPTED);

      return newMember;
    });
  }

  async deleteProjectInvitation(invId: number) {
    const invitation = await invitationRepository.findById(invId);
    if (!invitation) {
      throw new NotFoundError('유효한 초대장이 아닙니다.');
    }
    await invitationRepository.deleteInvitation(invId);
  }
}

export default new MembersService();
