import { TaskStatus } from '@prisma/client';
import prisma from '../lib/prisma';
import { CreateTaskInput, FindProjectTasksQuery, UpdateTaskInput } from '../dto/task-DTO';
import { TASK_INCLUDE } from '../dto/task-DTO';

class TaskRepository {
  async findById(taskId: number) {
    return prisma.task.findUnique({
      where: { id: taskId },
      include: TASK_INCLUDE,
    });
  }

  async findTasksByProjectId(projectId: number, query: FindProjectTasksQuery) {
    const {
      page = 1,
      limit = 10,
      status,
      assignee,
      keyword,
      order = 'asc',
      order_by = 'created_at',
    } = query;

    const skip = (page - 1) * limit;

    // where 조건
    const where: any = {
      projectId,
      ...(status && { status }),
      ...(assignee && { assigneeId: assignee }),
      ...(keyword && {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
        ],
      }),
    };

    // orderby
    let orderBy: any;

    switch (order_by) {
      case 'title':
        orderBy = { title: order };
        break;
      case 'end_date':
        orderBy = [{ endYear: order }, { endMonth: order }, { endDay: order }];
        break;
      default:
        orderBy = { createdAt: order };
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
            },
          },
          taskTags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          attachments: {
            select: {
              url: true,
            },
          },
        },
      }),
      prisma.task.count({ where }),
    ]);
    return { tasks, total };
  }

  async createTask(projectId: number, assigneeId: number, input: CreateTaskInput) {
    return prisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        projectId,
        startYear: input.startYear,
        startMonth: input.startMonth,
        startDay: input.startDay,
        endYear: input.endYear,
        endMonth: input.endMonth,
        endDay: input.endDay,
        status: input.status ?? TaskStatus.TODO,
        assigneeId,
      },
    });
  }

  async updateTask(taskId: number, input: UpdateTaskInput, taskTags?: { tagId: number }[]) {
    return prisma.task.update({
      where: { id: taskId },
      data: {
        title: input.title,
        description: input.description,
        startYear: input.startYear,
        startMonth: input.startMonth,
        startDay: input.startDay,
        endYear: input.endYear,
        endMonth: input.endMonth,
        endDay: input.endDay,
        status: input.status,

        ...(taskTags && {
          taskTags: {
            deleteMany: {}, // 기존 전부 삭제
            create: taskTags,
          },
        }),
      },
      include: TASK_INCLUDE,
    });
  }

  async deleteTask(taskId: number) {
    return prisma.task.delete({
      where: { id: taskId },
    });
  }

  async updateGoogleEventId(taskId: number, googleEventId: string | null) {
    return prisma.task.update({
      where: { id: taskId },
      data: { googleEventId },
    });
  }
}

export default new TaskRepository();
