import type { Response } from 'express';
import { create } from 'superstruct';
import type { AuthenticatedRequest } from '../types/auth';
import { IdParamsStruct, ProjectUserParamsStruct } from '../structs/common-structs';
import { getProjectMembersParamsStruct } from '../structs/member-structs';
import { EmailStruct } from '../structs/authStructs';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import memberService from '../service/member-service';

class MembersController {
  async getProjectMembers(req: AuthenticatedRequest, res: Response) {
    const { id } = create(req.params, IdParamsStruct);
    const { page, limit } = create(req.query, getProjectMembersParamsStruct);
    const result = await memberService.getProjectMembers(id, page, limit);
    res.send(result);
  }

  async deleteProjectMembers(req: AuthenticatedRequest, res: Response) {
    const { id, userId } = create(req.params, ProjectUserParamsStruct);
    await memberService.deleteProjectMember(id, userId);
    res.status(204).send();
  }

  async inviteProjectMember(req: AuthenticatedRequest, res: Response) {
    const { id } = create(req.params, IdParamsStruct);
    const { email } = create(req.body, EmailStruct);
    const result = await memberService.inviteProjectMember(id, email);
    res.send(result);
  }

  async acceptProjectMembers(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new UnauthorizedError('로그인이 필요합니다');
    }
    const { id } = create(req.params, IdParamsStruct);

    await memberService.acceptProjectMembers(id, req.user.id);
    res.status(200).send();
  }

  async deleteProjectInvitation(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new UnauthorizedError('로그인이 필요합니다');
    }
    const { id: invitationId } = create(req.params, IdParamsStruct);

    await memberService.deleteProjectInvitation(invitationId);
    res.status(204).send();
  }
}

export default new MembersController();
