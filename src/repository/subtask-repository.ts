import prisma from '../lib/prisma';

export type SubtaskStatus = 'todo' | 'done';

export interface CreateSubtaskData {
  title: string;
  taskId: number;
}

export interface UpdateSubtaskData {
  title?: string;
  status?: SubtaskStatus;
}

export class SubtaskRepository {
  findTaskProjectId(taskId: number) {
    return prisma.task.findUnique({
      where: { id: taskId },
      select: { projectId: true },
    });
  }

  findMembership(userId: number, projectId: number) {
    return prisma.projectMember.findFirst({
      where: { userId, projectId },
    });
  }

  create(data: CreateSubtaskData) {
    return prisma.subTask.create({
      data,
    });
  }

  findManyByTaskId(taskId: number) {
    return prisma.subTask.findMany({
      where: { taskId },
      orderBy: { createdAt: 'asc' },
    });
  }

  findByIdWithProjectId(subtaskId: number) {
    return prisma.subTask.findUnique({
      where: { id: subtaskId },
      include: { task: { select: { projectId: true } } },
    });
  }

  update(subtaskId: number, data: UpdateSubtaskData) {
    return prisma.subTask.update({
      where: { id: subtaskId },
      data,
    });
  }

  delete(subtaskId: number) {
    return prisma.subTask.delete({
      where: { id: subtaskId },
    });
  }
}

export const subtaskRepository = new SubtaskRepository();
