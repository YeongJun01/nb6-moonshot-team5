import projectsRepository from '../repository/project-repository';
import NotFoundError from '../lib/errors/NotFoundError';
import type { Project as ApiProject } from '../types/Project';
import type { Prisma } from '@prisma/client';

type CreateProjectData = {
  name: string;
  description: string | null;
};

type UpdateProjectData = Partial<CreateProjectData>;

class ProjectsService {
  async createProject(data: CreateProjectData, userId: number): Promise<ApiProject> {
    const createdProject = await projectsRepository.createProject(
      data satisfies Prisma.ProjectCreateInput,
      userId,
    );

    return {
      ...createdProject,
      memberCount: 1,
      todoCount: 0,
      inProgressCount: 0,
      doneCount: 0,
    };
  }

  async getProject(id: number): Promise<ApiProject> {
    const result = await projectsRepository.getProject(id);
    if (!result) throw new NotFoundError('project');

    const { project, memberCount, todoCount, inProgressCount, doneCount } = result;

    return {
      ...project,
      memberCount,
      todoCount,
      inProgressCount,
      doneCount,
    };
  }

  async updateProject(
    userId: number,
    projectId: number,
    data: UpdateProjectData,
  ): Promise<ApiProject> {
    const existing = await projectsRepository.findById(projectId);
    if (!existing) throw new NotFoundError('프로젝트가 없습니다.');

    const result = await projectsRepository.updateProject(userId, projectId, data);

    const { updatedProject, memberCount, todoCount, inProgressCount, doneCount } = result;

    return {
      ...updatedProject,
      memberCount,
      todoCount,
      inProgressCount,
      doneCount,
    };
  }

  async deleteProject(userId: number, projectId: number): Promise<void> {
    const existing = await projectsRepository.findById(projectId);
    if (!existing) throw new NotFoundError('프로젝트가 없습니다.');

    await projectsRepository.deleteProject(userId, projectId);
  }
}

export default new ProjectsService();
