import { CommentResponse, CreateCommentData } from '../types/comment';
import prisma from '../lib/prisma';

class CommentRepository {
  async createComment(data: CreateCommentData) {
    return prisma.comment.create({
      data: {
        content: data.content,
        taskId: data.taskId,
        authorId: data.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });
  }

  async findManyByTaskIdWithUser(taskId: number) {
    return prisma.comment.findMany({
      where: { taskId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });
  }

  async findUniqueComment(id: number) {
    return prisma.comment.findUnique({
      where: { id },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });
  }

  async updateComment(id: number, content: string) {
    const updatedComment = await prisma.comment.update({ where: { id }, data: { content } });
    return this.findUniqueComment(updatedComment.id);
  }

  async deleteComment(id: number) {
    await prisma.comment.delete({ where: { id } });
  }
}

export default new CommentRepository();
