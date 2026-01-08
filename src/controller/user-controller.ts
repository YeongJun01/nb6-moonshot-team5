import UnauthorizedError from '../lib/errors/UnauthorizedError';
import userService from '../service/user-service';
import { Request, Response } from 'express';

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
    const result = await userService.updateMe(userId, req.body);
    res.send(result);
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
    if (!req.user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }
    const userId = req.user.id;
    const result = await userService.getMyTasks(userId);
    res.send(result);
  }
}

export default new UserController();
