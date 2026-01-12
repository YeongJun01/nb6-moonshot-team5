import { SubtaskListDTO } from '../dto/subtask-DTO';
import prisma from '../lib/prisma';
import { PagePaginationResult } from '../types/pagination';

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
  async findTaskProjectId(taskId: number) {
    return await prisma.task.findUnique({
      where: { id: taskId },
      select: { projectId: true },
    });
  }

  async findMembership(userId: number, projectId: number) {
    return await prisma.projectMember.findFirst({
      where: { userId, projectId },
    });
  }

  async create(data: CreateSubtaskData) {
    return await prisma.subTask.create({
      data,
    });
  }

  async findManyByTaskId(taskId: number): Promise<SubtaskListDTO[]> {
    const data = (await prisma.subTask.findMany({
      where: { taskId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        title: true,
        taskId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    })) as unknown as SubtaskListDTO[];
    // const total = await prisma.subTask.count({ where: { taskId } });

    // const result: PagePaginationResult<SubtaskListDTO> = { data, total };
    return data;
  }

  async findByIdWithProjectId(subtaskId: number) {
    return await prisma.subTask.findUnique({
      where: { id: subtaskId },
      include: { task: { select: { projectId: true } } },
    });
  }

  async update(subtaskId: number, data: UpdateSubtaskData) {
    return await prisma.subTask.update({
      where: { id: subtaskId },
      data,
    });
  }

  async delete(subtaskId: number) {
    return await prisma.subTask.delete({
      where: { id: subtaskId },
    });
  }
}

export const subtaskRepository = new SubtaskRepository();
