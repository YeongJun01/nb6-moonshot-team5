// controllers/taskAttachment.controller.ts
import { Request, Response } from 'express';
import taskAttachmentService from '../service/attachment-service';

class AttachmentController {
  async uploadTaskAttachments(req: Request, res: Response) {
    const taskId = Number(req.params.taskId);
    const files = req.files as Express.Multer.File[];

    const attachments = await taskAttachmentService.saveAttachments(taskId, files);

    res.status(201).json({ attachments });
  }
}

export default new AttachmentController();
