import { Response } from 'express';
import { AuthRequest } from '../types/auth';
import { subtaskService } from '../service/subtask-service';

export class SubtaskController {
  // GET /subtasks/:subtaskId
  async getSubtask(req: AuthRequest, res: Response) {
    const subtaskId = Number(req.params.subtaskId);
    const subtask = await subtaskService.getById(subtaskId, req.userId!);
    res.json(subtask);
  }

  // PATCH /subtasks/:subtaskId
  async updateSubtask(req: AuthRequest, res: Response) {
    const subtaskId = Number(req.params.subtaskId);
    const subtask = await subtaskService.update(subtaskId, req.userId!, req.body);
    res.json(subtask);
  }

  // DELETE /subtasks/:subtaskId
  async deleteSubtask(req: AuthRequest, res: Response) {
    const subtaskId = Number(req.params.subtaskId);
    const result = await subtaskService.delete(subtaskId, req.userId!);

    // REST 스타일로는 204가 더 흔하지만, 기존처럼 메시지 주고 싶으면 200 유지
    res.json(result);
  }
}

export const subtaskController = new SubtaskController();
