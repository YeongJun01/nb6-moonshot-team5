import type { Response } from 'express';
import { create } from 'superstruct';
import type { AuthenticatedRequest } from '../types/auth';
import { IdParamsStruct } from '../structs/common-structs';
import { getProjectMembersParamsStruct } from '../structs/member-structs';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import memberService from '../service/member-service';

class MembersController {
  async getProjectMembers(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new UnauthorizedError('로그인이 필요합니다');
    }
    const { id } = create(req.params, IdParamsStruct);
    const { page, limit } = create(req.query, getProjectMembersParamsStruct);
    const result = await memberService.getProjectMembers(id, page, limit);
    res.send(result);
  }

  async deleteProjectMembers(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new UnauthorizedError('로그인이 필요합니다');
    }
    const { id } = create(req.params, IdParamsStruct);
    await memberService.deleteProjectMember(id, req.user.id);
    res.status(204).send();
  }

  async inviteProjectMembers(req: AuthenticatedRequest, res: Response) {}

  async acceptProjectMembers(req: AuthenticatedRequest, res: Response) {}

  async deleteProjectInvitation(req: AuthenticatedRequest, res: Response) {}
}

export default new MembersController();
