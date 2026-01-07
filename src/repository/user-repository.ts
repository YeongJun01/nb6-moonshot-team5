import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';

class UserRepository {
  async findUserById(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async createUser(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  }

  async updateUser(userId: number, data: Partial<Prisma.UserUpdateInput>) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async deleteUser(userId: number) {
    return prisma.user.delete({
      where: { id: userId },
    });
  }

  async findProjectsByUserId(userId: number) {
    return prisma.project.findMany({
      where: {
        projectMembers: {
          some: { userId },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getMemberCounts(projectIds: number[]) {
    const rows = await prisma.projectMember.groupBy({
      by: ['projectId'],
      where: { projectId: { in: projectIds } },
      _count: { userId: true },
    });

    return Object.fromEntries(rows.map((r) => [r.projectId, r._count.userId]));
  }

  async getTaskStatusCounts(projectIds: number[]) {
    const rows = await prisma.task.groupBy({
      by: ['projectId', 'status'],
      where: { projectId: { in: projectIds } },
      _count: { id: true },
    });

    const result: Record<number, any> = {};

    for (const r of rows) {
      if (!result[r.projectId]) {
        result[r.projectId] = {
          TODO: 0,
          IN_PROGRESS: 0,
          DONE: 0,
        };
      }
      result[r.projectId][r.status] = r._count.id;
    }

    return result;
  }

  async findTasksByUserProjects(userId: number) {
    return prisma.task.findMany({
      where: {
        project: {
          projectMembers: {
            some: { userId },
          },
        },
      },
    });
  }
}

export default new UserRepository();
