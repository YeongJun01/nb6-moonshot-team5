import { MemberListDTO } from '../dto/member-list-DTO';
import { PagePaginationResult } from '../types/pagination';
import memberRepository from '../repository/member-repository';
import projectRepository from '../repository/project-repository';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';

class MembersService {
  async getProjectMembers(
    id: number,
    page: number,
    limit: number,
  ): Promise<PagePaginationResult<MemberListDTO>> {
    const members = await memberRepository.getProjectMembers(id, page, limit);
    return members;
  }

  async deleteProjectMember(id: number, userId: number) {
    const existingProject = await projectRepository.getProject(id);
    if (!existingProject) {
      throw new NotFoundError('project');
    }

    if (!(await memberRepository.isProjectMember(id, userId))) {
      throw new ForbiddenError('프로젝트 멤버가 아닙니다');
    }

    await memberRepository.deleteProjectMember(id, userId);
  }
}

export default new MembersService();
