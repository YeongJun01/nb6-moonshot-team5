import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import {
  subtaskRepository,
  UpdateSubtaskData,
  CreateSubtaskData,
} from '../repository/subtask-repository';

export class SubtaskService {
  private async requireTaskAccess(taskId: number, userId: number) {
    const task = await subtaskRepository.findTaskProjectId(taskId);

    if (!task) {
      throw new NotFoundError('할 일을 찾을 수 없습니다');
    }

    const membership = await subtaskRepository.findMembership(userId, task.projectId);
    if (!membership) {
      throw new ForbiddenError('프로젝트에 접근 권한이 없습니다');
    }

    return task; // { projectId }
  }

  private async requireSubtaskAccess(subtaskId: number, userId: number) {
    const subtask = await subtaskRepository.findByIdWithProjectId(subtaskId);

    if (!subtask) {
      throw new NotFoundError('하위 할 일을 찾을 수 없습니다');
    }

    const membership = await subtaskRepository.findMembership(userId, subtask.task.projectId);
    if (!membership) {
      throw new ForbiddenError('프로젝트에 접근 권한이 없습니다');
    }

    return subtask;
  }

  async create(taskId: number, userId: number, input: { title: string }) {
    await this.requireTaskAccess(taskId, userId);

    const data: CreateSubtaskData = {
      title: input.title,
      taskId,
    };

    return subtaskRepository.create(data);
  }

  async getByTaskId(taskId: number, userId: number) {
    await this.requireTaskAccess(taskId, userId);
    return subtaskRepository.findManyByTaskId(taskId);
  }

  async getById(subtaskId: number, userId: number) {
    // include(task.projectId) 같이 달린 원본을 그대로 리턴하던 동작 유지
    return this.requireSubtaskAccess(subtaskId, userId);
  }

  async update(subtaskId: number, userId: number, input: UpdateSubtaskData) {
    await this.requireSubtaskAccess(subtaskId, userId);
    return subtaskRepository.update(subtaskId, input);
  }

  async delete(subtaskId: number, userId: number) {
    await this.requireSubtaskAccess(subtaskId, userId);
    await subtaskRepository.delete(subtaskId);
    return { message: '하위 할 일이 삭제되었습니다' };
  }
}

export const subtaskService = new SubtaskService();
