import { Request, Response } from 'express';
import { subtaskService } from '../service/subtask-service';
import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/common-structs';

type AuthedRequest = Request & { userId?: number };

export class SubtaskController {
  createSubtask = async (req: AuthedRequest, res: Response) => {
    const { id: taskId } = create(req.params, IdParamsStruct);
    const { title } = req.body;
    const userId = req.user!.id;

    const result = await subtaskService.create(taskId, userId, { title });
    res.status(201).send(result);
  };

  getSubtaskOfTask = async (req: AuthedRequest, res: Response) => {
    const { id: taskId } = create(req.params, IdParamsStruct);

    const userId = req.user!.id;
    const result = await subtaskService.getByTaskId(taskId, userId);
    res.status(200).send(result);
  };

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
