// services/taskAttachment.service.ts
import taskAttachmentRepository from '../repository/attachment-repository';

class TaskAttachmentService {
  async saveAttachments(taskId: number, files: Express.Multer.File[]) {
    if (!files || files.length === 0) return [];

    const baseUrl = process.env.BASE_URL || '';

    const data = files.map((file) => ({
      taskId,
      originalName: file.originalname,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      url: baseUrl ? `${baseUrl}/files/${file.filename}` : `/files/${file.filename}`,
    }));

    await taskAttachmentRepository.createMany(data);

    return data;
  }
}

export default new TaskAttachmentService();
