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
    if (!project) {
      throw new NotFoundError('프로젝트를 찾을 수 없습니다.');
    }

    const task = await taskRepository.createTask(projectId, assigneeId, input);

    // 2) 캘린더 동기화 (assigneeId 있을 때만)
    if (task.assigneeId) {
      const eventId = await calendarService.createTaskEvent(task.assigneeId, task);
      await taskRepository.updateGoogleEventId(task.id, eventId);
      // task 객체에 반영해서 반환하고 싶으면:
      return { ...task, googleEventId: eventId };
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

    // 담당자 없으면 캘린더 동기화 안 함
    if (!updated.assigneeId) return updated;

    try {
      if (before.googleEventId) {
        await calendarService.updateTaskEvent(updated.assigneeId, before.googleEventId, updated);
        return updated;
      }

      // 기존에 이벤트가 없었으면 새로 생성
      const eventId = await calendarService.createTaskEvent(updated.assigneeId, updated);
      await taskRepository.updateGoogleEventId(taskId, eventId);
      return { ...updated, googleEventId: eventId };
    } catch (e) {
      // 연동 안 된 유저면 여기로 옴 (정책 선택)
      console.error('calendar sync failed', e);
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
      console.error('calendar delete failed', e);
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
