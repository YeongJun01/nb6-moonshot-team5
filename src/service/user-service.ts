import UnauthorizedError from '../lib/errors/UnauthorizedError';
import userRepository from '../repository/user-repository';
import { FindMyTasksQueryDTO } from '../dto/user-task-DTO';

function ymdToNumber(y: number, m: number, d: number) {
  return y * 10000 + m * 100 + d;
}

function parseDateToYmdNumber(dateStr: string): number | null {
  const dt = new Date(dateStr);
  if (Number.isNaN(dt.getTime())) return null;
  const y = dt.getUTCFullYear();
  const m = dt.getUTCMonth() + 1;
  const d = dt.getUTCDate();
  return ymdToNumber(y, m, d);
}

class UserService {
  async getMe(userId: number) {
    if (!userId) {
      throw new UnauthorizedError('해당 유저가 없습니다.');
    }

    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw new UnauthorizedError('해당 유저가 없습니다.');
    }

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async updateMe(userId: number, data: any) {
    if (!userId) {
      throw new UnauthorizedError('해당 유저가 없습니다.');
    }
    const user = await userRepository.updateUser(userId, data);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getMyProjects(userId: number) {
    const projects = await userRepository.findProjectsByUserId(userId);
    const projectIds = projects.map((p) => p.id);

    const memberCounts = await userRepository.getMemberCounts(projectIds);
    const taskCounts = await userRepository.getTaskStatusCounts(projectIds);
    const data = projects.map((p) => ({
      ...p,
      memberCount: memberCounts[p.id] ?? 0,
      todoCount: taskCounts[p.id]?.todo ?? 0,
      inProgressCount: taskCounts[p.id]?.in_progress ?? 0,
      doneCount: taskCounts[p.id]?.done ?? 0,
    }));

    return {
      data,
      total: data.length,
    };
  }

  // 수정예정
  async getMyTasks(userId: number, query: FindMyTasksQueryDTO) {
    if (!userId) {
      throw new UnauthorizedError('해당 유저가 없습니다.');
    }

    const tasks = await userRepository.findMyTasks(userId, query);

    let filtered = tasks;

    const fromNum = query.from ? parseDateToYmdNumber(query.from) : null;
    const toNum = query.to ? parseDateToYmdNumber(query.to) : null;

    if (fromNum || toNum) {
      const fromVal = fromNum ?? -Infinity;
      const toVal = toNum ?? Infinity;

      filtered = tasks.filter((t) => {
        const taskStart = ymdToNumber(t.startYear, t.startMonth, t.startDay);
        const taskEnd = ymdToNumber(t.endYear, t.endMonth, t.endDay);

        return taskStart <= toVal && taskEnd >= fromVal;
      });
    }

    return filtered.map((task) => ({
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
      attachments: task.attachments?.map((a) => a.url) ?? [],
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));
  }
}

export default new UserService();
