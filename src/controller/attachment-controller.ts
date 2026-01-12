// controllers/taskAttachment.controller.ts
import { Request, Response } from 'express';
import taskAttachmentService from '../service/attachment-service';

class AttachmentController {
  async uploadTaskAttachments(req: Request, res: Response) {
    const files = req.files as Express.Multer.File[];

    const attachments = await taskAttachmentService.uploadFiles(files);

    res.status(201).json(attachments.map((a) => a.url));
  }
}

export default new AttachmentController();
