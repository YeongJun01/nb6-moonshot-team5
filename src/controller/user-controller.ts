import UnauthorizedError from '../lib/errors/UnauthorizedError';
import userService from '../service/user-service';
import { Request, Response } from 'express';
import { FindMyTasksQueryDTO } from '../dto/user-task-DTO';
import { TaskStatus } from '@prisma/client';

// controller/user-controller.ts
class UserController {
  async getMe(req: Request, res: Response) {
    if (!req.user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }
    const userId = req.user.id;
    const result = await userService.getMe(userId);
    res.send(result);
  }

  async updateMe(req: Request, res: Response) {
    if (!req.user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }

    const userId = req.user.id;

    // 프론트에서 보내는 값 그대로 받음
    const { currentPassword, newPassword, name, profileImage } = req.body;

    // 서비스 호출 (newPasswordConfirm 체크는 프ㅌ론트에서 이미 처리)
    const updatedUser = await userService.updateUser(userId, {
      currentPassword,
      newPassword,
      name,
      profileImage,
    });

    res.json(updatedUser);
  }

  async getMyProjects(req: Request, res: Response) {
    if (!req.user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }
    const userId = req.user.id;
    const result = await userService.getMyProjects(userId);
    res.json(result);
  }

  async getMyTasks(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError('로그인이 필요합니다.');

    const { project_id, assignee_id, status, from, to, keyword } = req.query;

    const query: FindMyTasksQueryDTO = {
      project_id: project_id ? Number(project_id) : undefined,
      assignee_id: assignee_id ? Number(assignee_id) : undefined,
      status: status ? (status as TaskStatus) : undefined,
      from: typeof from === 'string' ? from : undefined,
      to: typeof to === 'string' ? to : undefined,
      keyword: typeof keyword === 'string' ? keyword : undefined,
    };

    const result = await userService.getMyTasks(req.user.id, query);

    res.status(200).json(result);
  }
}

export default new UserController();
