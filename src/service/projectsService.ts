import * as projectsRepository from '../repository/projectsRepository';
import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';
import type { Project as ApiProject } from '../types/Project';
import type { Prisma } from '@prisma/client';
import { number } from 'superstruct';
import projectRouter from '../router/projectsRouter';

type CreateProjectData = {
  name: string;
  description: string | null;
};
type UpdatedProjectData = Partial<CreateProjectData>;

export async function createProject(data: CreateProjectData, userId: number): Promise<ApiProject> {
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

export async function getProject(id: number): Promise<ApiProject> {
  const result = await projectsRepository.getProject(id);
  if (!result) {
    throw new NotFoundError('project');
  }

  const { project, memberCount, todoCount, inProgressCount, doneCount } = result;

  return {
    ...project,
    memberCount,
    todoCount,
    inProgressCount,
    doneCount,
  };
}

export async function updateProject(
  userId: number,
  projectId: number,
  data: UpdatedProjectData,
): Promise<ApiProject> {
  const project = await projectsRepository.getProject(projectId);
  if (!project) {
    throw new NotFoundError('project');
  }

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

export async function deleteProject(userId: number, projectId: number): Promise<void> {
  const project = await projectsRepository.getProject(projectId);
  if (!project) {
    throw new NotFoundError('project');
  }

  await projectsRepository.deleteProject(userId, projectId);
}
