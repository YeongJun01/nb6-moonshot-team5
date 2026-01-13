import type { Prisma, Project, TaskStatus } from '@prisma/client';
import prisma from '../lib/prisma';
import ForbiddenError from '../lib/errors/ForbiddenError';

class ProjectRepository {
  async createProject(data: Prisma.ProjectCreateInput, userId: number) {
    return prisma.project.create({
      data: {
        ...data,
        projectMembers: {
          create: {
            userId,
            role: 'owner',
          },
        },
      },
    });
  }

  async getProject(projectId: number) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return null;

    const memberCount = await this.getMemberCount(projectId);
    const counts = await this.getStatusCount(projectId);

    return {
      project,
      memberCount,
      todoCount: counts.todo,
      inProgressCount: counts.in_progress,
      doneCount: counts.done,
    };
  }

  async findById(projectId: number) {
    return await prisma.project.findUnique({ where: { id: projectId } });
  }

  async updateProject(userId: number, projectId: number, data: Partial<Project>) {
    await this.checkOwner(userId, projectId);

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data,
    });

    const memberCount = await this.getMemberCount(projectId);
    const counts = await this.getStatusCount(projectId);

    return {
      updatedProject,
      memberCount,
      todoCount: counts.todo,
      inProgressCount: counts.in_progress,
      doneCount: counts.done,
    };
  }

  async deleteProject(userId: number, projectId: number) {
    await this.checkOwner(userId, projectId);

    return prisma.project.delete({
      where: { id: projectId },
    });
  }

  private async getMemberCount(projectId: number) {
    return prisma.projectMember.count({ where: { projectId } });
  }

  private async getStatusCount(projectId: number) {
    const grouped = await prisma.task.groupBy({
      by: ['status'],
      where: { projectId },
      _count: { _all: true },
    });

    const counts: Record<TaskStatus, number> = {
      todo: 0,
      in_progress: 0,
      done: 0,
    };

    for (const state of grouped) {
      counts[state.status] = state._count._all;
    }

    return counts;
  }

  private async checkOwner(userId: number, projectId: number): Promise<void> {
    const owner = await prisma.projectMember.findFirst({
      where: { projectId, role: 'owner' },
    });

    if (!owner || owner.userId !== userId) {
      throw new ForbiddenError('프로젝트 관리자가 아닙니다');
    }
  }
}

export default new ProjectRepository();
