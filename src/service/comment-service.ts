import { CommentResponse, CreateCommentData } from '../types/comment';
import BadRequestError from '../lib/errors/BadRequestError';
import commentRepository from '../repository/comment-repository';
import NotFoundError from '../lib/errors/NotFoundError';

function toCommentResponse(row: {
  id: number;
  content: string;
  taskId: number;
  createdAt: Date;
  updatedAt: Date;
  user: { id: number; name: string; email: string; profileImage: string | null };
}): CommentResponse {
  return {
    id: row.id,
    content: row.content,
    taskId: row.taskId,
    author: row.user,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

class CommentService {
  async createComment(data: CreateCommentData): Promise<CommentResponse> {
    if (!data.taskId) {
      throw new BadRequestError('할일 id가 필요합니다.');
    }

    const comment = await commentRepository.createComment(data);
    return toCommentResponse(comment);
  }

  async getTaskComments(taskId: number): Promise<CommentResponse[]> {
    const rows = await commentRepository.findManyByTaskIdWithUser(taskId);
    return rows.map(toCommentResponse);
  }

  async getComment(id: number): Promise<CommentResponse> {
    const comment = await commentRepository.findUniqueComment(id);
    if (!comment) throw new NotFoundError('댓글이 없습니다.');
    return toCommentResponse(comment);
  }

  async updateComment(id: number, content: string): Promise<CommentResponse> {
    const comment = await commentRepository.updateComment(id, content);
    if (!comment) throw new NotFoundError('댓글이 없습니다.');
    return toCommentResponse(comment);
  }

  async deleteComment(id: number): Promise<void> {
    const existing = await commentRepository.findUniqueComment(id);
    if (!existing) throw new NotFoundError('댓글이 없습니다.');

    await commentRepository.deleteComment(id);
  }
}

export default new CommentService();
