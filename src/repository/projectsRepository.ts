import { Project } from '@prisma/client';
import prisma from '../lib/prisma';
import type { Prisma, TaskStatus } from '@prisma/client';
import projectRouter from '../router/projectsRouter';
import ForbiddenError from '../lib/errors/ForbiddenError';

export async function createProject(data: Prisma.ProjectCreateInput, userId: number) {
  const createdProject = await prisma.project.create({
    data: {
      ...data,
      projectMembers: {
        create: {
          userId,
          role: 'OWNER',
        },
      },
    },
  });
  return createdProject;
}

async function getMemberCount(projectId: number) {
  const memberCount = await prisma.projectMember.count({ where: { projectId: projectId } });
  return memberCount;
}

async function getStatusCount(projectId: number) {
  const grouped = await prisma.task.groupBy({
    by: ['status'],
    where: { projectId },
    _count: { _all: true },
  });

  const counts: Record<TaskStatus, number> = {
    TODO: 0,
    IN_PROGRESS: 0,
    DONE: 0,
  };

  for (const state of grouped) {
    counts[state.status] = state._count._all;
  }

  return counts;
}

export async function getProject(id: number) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return null;

  const memberCount = await getMemberCount(id);
  const counts = await getStatusCount(id);

  return {
    project,
    memberCount,
    todoCount: counts.TODO,
    inProgressCount: counts.IN_PROGRESS,
    doneCount: counts.DONE,
  };
}
async function checkOwner(userId: number, projectId: number): Promise<void> {
  const owner = await prisma.projectMember.findFirst({ where: { projectId, role: 'OWNER' } });

  if (!owner || owner.userId !== userId) {
    throw new ForbiddenError('프로젝트 관리자가 아닙니다');
  }
}

export async function updateProject(userId: number, projectId: number, data: Partial<Project>) {
  await checkOwner(userId, projectId);

  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data,
  });

  const memberCount = await getMemberCount(projectId);
  const counts = await getStatusCount(projectId);

  return {
    updatedProject,
    memberCount,
    todoCount: counts.TODO,
    inProgressCount: counts.IN_PROGRESS,
    doneCount: counts.DONE,
  };
}

export async function deleteProject(userId: number, projectId: number) {
  checkOwner(userId, projectId);
  return prisma.project.delete({
    where: { id: projectId },
  });
}
