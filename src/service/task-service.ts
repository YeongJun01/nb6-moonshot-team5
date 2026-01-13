import taskRepository from '../repository/task-repository';
import NotFoundError from '../lib/errors/NotFoundError';
import {
  UpdateTaskInput,
  CreateTaskInput,
  FindProjectTasksQuery,
  TaskWithRelations,
} from '../dto/task-DTO';
import projectRepository from '../repository/project-repository';
import memberRepository from '../repository/member-repository';
import calendarService from './calendar-service';
import taskAttachmentRepository from '../repository/attachment-repository';

class TaskService {
  // 프로젝트 내 할 일 가져오기
  async getTasksByProject(projectId: number, query: FindProjectTasksQuery) {
    const { tasks, total } = await taskRepository.findTasksByProjectId(projectId, query);

    return {
      data: tasks.map((task) => ({
        id: task.id,
        projectId: task.projectId,
        title: task.title,
        description: task.description,
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
        attachments: task.attachments.map((a) => a.url) ?? [],
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

    const created = await taskRepository.createTask(projectId, assigneeId, input);

    // 2️⃣ 첨부파일(URL) 생성
    if (input.attachments?.length) {
      await taskAttachmentRepository.createMany(
        input.attachments.map((url) => ({
          taskId: created.id,
          url,
        })),
      );
    }

    if (created.assigneeId) {
      try {
        const eventId = await calendarService.createTaskEvent(created.assigneeId, created);
        await taskRepository.updateGoogleEventId(created.id, eventId);
        return { ...created, googleEventId: eventId };
      } catch (e) {
        console.warn('[calendar] create sync skipped:', e);
      }
    }

    const taskWithRelations = await taskRepository.findById(created.id);
    if (!taskWithRelations) {
      throw new NotFoundError('생성된 할 일을 다시 불러오지 못했습니다.');
    }

    return this.toTaskResponse(taskWithRelations);
    //{
    //   id: created.id,
    //   projectId: created.projectId,
    //   title: created.title,
    //   description: created.description,
    //   startYear: created.startYear,
    //   startMonth: created.startMonth,
    //   startDay: created.startDay,
    //   endYear: created.endYear,
    //   endMonth: created.endMonth,
    //   endDay: created.endDay,
    //   status: created.status,

    //   tags: created.taskTags.map((tt) => ({
    //     id: tt.tag.id,
    //     name: tt.tag.name,
    //   })),

    //   createdAt: created.createdAt,
    //   updatedAt: created.updatedAt,
    // };
  }

  //할 일 조회
  async findTaskById(taskId: number) {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError('할 일을 찾을 수 없습니다.');
    }
    return this.toTaskResponse(task);
  }
  //할 일 수정
  async updateTask(taskId: number, input: UpdateTaskInput) {
    const before = await taskRepository.findById(taskId);
    if (!before) throw new NotFoundError('할 일을 찾을 수 없습니다.');

    // Task 기본 정보 업데이트
    const updated = await taskRepository.updateTask(taskId, input);

    //  첨부파일(URL) 처리
    if (input.attachments?.length) {
      await taskAttachmentRepository.createMany(
        input.attachments.map((url) => ({
          taskId,
          url,
        })),
      );
    }

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

  private toTaskResponse(task: TaskWithRelations) {
    return {
      id: task.id,
      projectId: task.projectId,
      title: task.title,
      description: task.description,
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
      tags: task.taskTags.map((tt) => tt.tag),
      attachments: task.attachments.map((a) => a.url) ?? [],
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}

export default new TaskService();
