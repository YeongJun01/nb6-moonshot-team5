import { Request, Response } from 'express';
import taskService from '../service/task-service';
import { FindProjectTasksQuery } from '../dto/task-DTO';
import NotFoundError from '../lib/errors/NotFoundError';
import BadRequestError from '../lib/errors/BadRequestError';

class TaskController {
  // 프로젝트 내 할 일 조회
  async getTasks(req: Request, res: Response) {
    const projectId = Number(req.params.id);

    if (Number.isNaN(projectId)) {
      return res.status(400).json({ message: '유효하지 않은 projectId입니다.' });
    }

    const { page, limit, status, assignee, keyword, order, order_by } = req.query;

    const query: FindProjectTasksQuery = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status: status as any,
      assignee: assignee ? Number(assignee) : undefined,
      keyword: keyword as string | undefined,
      order: order === 'desc' ? 'desc' : 'asc',
      order_by: order_by === 'title' || order_by === 'end_date' ? order_by : 'created_at',
    };

    const result = await taskService.getTasksByProject(projectId, query);

    res.status(200).json(result);
  }

  // 프로젝트 내 할일 생성
  async createTask(req: Request, res: Response) {
    //프로젝트 아이디 추출, 확인
    const projectId = Number(req.params.id);
    if (Number.isNaN(projectId)) {
      throw new NotFoundError('해당 프로젝트를 찾을 수 없습니다.');
    }

    //유저 아이디
    const userId = req.user!.id;
    const task = await taskService.createTask(projectId, userId, req.body);

    res.status(201).json(task);
  }

  // 할 일 조회
  async findTaskById(req: Request, res: Response) {
    const taskId = Number(req.params.taskId);
    const userId = req.user!.id;

    const task = await taskService.findTaskById(taskId);

    res.status(200).json(task);
  }
  // 할 일 업데이트
  async updateTask(req: Request, res: Response) {
    const taskId = Number(req.params.taskId);
    if (Number.isNaN(taskId)) {
      throw new BadRequestError('유효하지 않은 taskId입니다.1');
    }

    const updatedTask = await taskService.updateTask(taskId, req.body);
    res.status(200).json(updatedTask);
  }

  //할 일 삭제
  async deleteTask(req: Request, res: Response) {
    const taskId = Number(req.params.taskId);
    await taskService.deleteTask(taskId);

    res.status(204).send();
  }
}

export default new TaskController();
