// repositories/taskAttachment.repository.ts
import prisma from '../lib/prisma';

class TaskAttachmentRepository {
  createMany(
    data: {
      taskId: number;
      url: string;
    }[],
  ) {
    return prisma.taskAttachment.createMany({
      data,
    });
  }
}

export default new TaskAttachmentRepository();
