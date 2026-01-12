import prisma from '../lib/prisma';
import { Prisma, TaskStatus } from '@prisma/client';
import { FindMyTasksQueryDTO } from '../dto/user-task-DTO';

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

  async findMyTasks(userId: number, query: FindMyTasksQueryDTO) {
    const where: Prisma.TaskWhereInput = {
      ...(query.project_id ? { projectId: query.project_id } : {}),
      ...(query.status ? { status: query.status as TaskStatus } : {}),
      // assignee_id가 오면 그 담당자 기준, 안오면 "나(userId)"가 담당자인 것만
      assigneeId: query.assignee_id ?? userId,
      ...(query.keyword
        ? {
            OR: [
              { title: { contains: query.keyword, mode: 'insensitive' } },
              { description: { contains: query.keyword, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    return prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true, profileImage: true },
        },
        taskTags: {
          include: {
            tag: { select: { id: true, name: true } },
          },
        },
        attachments: { select: { url: true } },
      },
    });
  }
}

export default new UserRepository();
