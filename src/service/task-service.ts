import taskRepository from '../repository/task-repository';
import NotFoundError from '../lib/errors/NotFoundError';
import { UpdateTaskInput, CreateTaskInput, FindProjectTasksQuery } from '../dto/task-DTO';
import projectRepository from '../repository/project-repository';
import memberRepository from '../repository/member-repository';
import ForbiddenError from '../lib/errors/ForbiddenError';
import calendarService from './calendar-service';

class TaskService {
  // 프로젝트 내 할 일 가져오기
  async getTasksByProject(projectId: number, query: FindProjectTasksQuery) {
    const { tasks, total } = await taskRepository.findTasksByProjectId(projectId, query);

    return {
      data: tasks.map((task) => ({
        id: task.id,
        projectId: task.projectId,
        title: task.title,
        startYear: task.startYear,
        startMonth: task.startMonth,
        startDay: task.startDay,
        endYear: task.endYear,
        endMonth: task.endMonth,
        endDay: task.endDay,
        status: task.status,
        assignee: task.user
          ? {
              id: task.user.id,
              name: task.user.name,
              email: task.user.email,
              profileImage: task.user.profileImage,
            }
          : null,
        tags: task.taskTags.map((tt) => ({
          id: tt.tag.id,
          name: tt.tag.name,
        })),
        attachments: task.attachments.map((a) => a.url),
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })),
      total,
    };
  }
  // 프로젝트 내 할 일 생성
  async createTask(projectId: number, assigneeId: number, input: CreateTaskInput) {
    const project = await projectRepository.findById(projectId);
    if (!project) throw new NotFoundError('프로젝트를 찾을 수 없습니다.');

    const task = await taskRepository.createTask(projectId, assigneeId, input);

    if (task.assigneeId) {
      try {
        const eventId = await calendarService.createTaskEvent(task.assigneeId, task);
        await taskRepository.updateGoogleEventId(task.id, eventId);
        return { ...task, googleEventId: eventId };
      } catch (e) {
        console.warn('[calendar] create sync skipped:', e);
      }
    }

    return task;
  }
  //할 일 조회
  async findTaskById(taskId: number) {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError('할 일을 찾을 수 없습니다.');
    }
    return task;
  }
  //할 일 수정
  async updateTask(taskId: number, input: UpdateTaskInput) {
    const before = await taskRepository.findById(taskId);
    if (!before) throw new NotFoundError('할 일을 찾을 수 없습니다.');

    const updated = await taskRepository.updateTask(taskId, input);

    if (!updated.assigneeId) return updated;

    try {
      if (before.googleEventId) {
        await calendarService.updateTaskEvent(updated.assigneeId, before.googleEventId, updated);
        return updated;
      }

      const eventId = await calendarService.createTaskEvent(updated.assigneeId, updated);
      await taskRepository.updateGoogleEventId(taskId, eventId);
      return { ...updated, googleEventId: eventId };
    } catch (e) {
      console.warn('[calendar] update sync skipped:', e);
      return updated;
    }
  }

  //할 일 삭제
  async deleteTask(taskId: number) {
    const task = await taskRepository.findById(taskId);
    if (!task) throw new NotFoundError('할 일을 찾을 수 없습니다.');

    try {
      if (task.googleEventId && task.assigneeId) {
        await calendarService.deleteTaskEvent(task.assigneeId, task.googleEventId);
      }
    } catch (e) {
      console.warn('[calendar] delete sync skipped:', e);
    }

    await taskRepository.deleteTask(taskId);
  }

  //   //참여자 검증 - 미들웨어 활용
  //   async validateProjectMember(projectId: number, userId: number) {
  //     const member = await memberRepository.findProjectMember(projectId, userId);

  //     if (!member) {
  //       throw new ForbiddenError('프로젝트는 참여자만 접근할 수 있습니다.');
  //     }
  //   }
}

export default new TaskService();
