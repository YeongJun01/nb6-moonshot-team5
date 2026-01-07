import { Request, Response } from 'express';
import { subtaskService } from '../service/subtask-service';

type AuthedRequest = Request & { userId?: number };

export class SubtaskController {
  // GET /subtasks/:subtaskId
  getSubtask = async (req: AuthedRequest, res: Response) => {
    const subtaskId = Number(req.params.subtaskId);
    const subtask = await subtaskService.getById(subtaskId, req.userId!);
    res.json(subtask);
  };

  // PATCH /subtasks/:subtaskId
  updateSubtask = async (req: AuthedRequest, res: Response) => {
    const subtaskId = Number(req.params.subtaskId);
    const subtask = await subtaskService.update(subtaskId, req.userId!, req.body);
    res.json(subtask);
  };

  // DELETE /subtasks/:subtaskId
  deleteSubtask = async (req: AuthedRequest, res: Response) => {
    const subtaskId = Number(req.params.subtaskId);
    const result = await subtaskService.delete(subtaskId, req.userId!);
    res.json(result);
  };
}

export const subtaskController = new SubtaskController();
