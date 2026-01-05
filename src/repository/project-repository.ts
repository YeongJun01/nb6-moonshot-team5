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
            role: 'OWNER',
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
      todoCount: counts.TODO,
      inProgressCount: counts.IN_PROGRESS,
      doneCount: counts.DONE,
    };
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
      todoCount: counts.TODO,
      inProgressCount: counts.IN_PROGRESS,
      doneCount: counts.DONE,
    };
  }

  async deleteProject(userId: number, projectId: number) {
    await this.checkOwner(userId, projectId); // ✅ await 빠져있던 부분 수정

    return prisma.project.delete({
      where: { id: projectId },
    });
  }

  // -------------------------
  // private helpers
  // -------------------------
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
      TODO: 0,
      IN_PROGRESS: 0,
      DONE: 0,
    };

    for (const state of grouped) {
      counts[state.status] = state._count._all;
    }

    return counts;
  }

  private async checkOwner(userId: number, projectId: number): Promise<void> {
    const owner = await prisma.projectMember.findFirst({
      where: { projectId, role: 'OWNER' },
    });

    if (!owner || owner.userId !== userId) {
      throw new ForbiddenError('프로젝트 관리자가 아닙니다');
    }
  }
}

export default new ProjectRepository();
