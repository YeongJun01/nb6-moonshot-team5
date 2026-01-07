import UnauthorizedError from '../lib/errors/UnauthorizedError';
import userRepository from '../repository/user-repository';

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
      todoCount: taskCounts[p.id]?.TODO ?? 0,
      inProgressCount: taskCounts[p.id]?.IN_PROGRESS ?? 0,
      doneCount: taskCounts[p.id]?.DONE ?? 0,
    }));

    return {
      data,
      total: data.length,
    };
  }

  // 수정예정
  async getMyTasks(userId: number) {
    if (!userId) {
      throw new UnauthorizedError('해당 유저가 없습니다.');
    }

    const result = await userRepository.findTasksByUserProjects(userId);
    return result;
  }
}

export default new UserService();
