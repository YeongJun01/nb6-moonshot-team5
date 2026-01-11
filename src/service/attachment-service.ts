// services/taskAttachment.service.ts
import taskAttachmentRepository from '../repository/attachment-repository';

class TaskAttachmentService {
  /**
   * 파일만 서버에 업로드 (taskId 없음)
   * 컨트롤러에서 사용
   */
  async uploadFiles(files: Express.Multer.File[]) {
    if (!files || files.length === 0) return [];

    const baseUrl = process.env.BASE_URL || '';

    return files.map((file) => ({
      originalName: file.originalname,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      url: baseUrl ? `${baseUrl}/attachments/${file.filename}` : `/attachments/${file.filename}`,
    }));
  }

  /**
   * 특정 task에 attachment 연결
   * TaskService에서 사용
   */
  async attachToTask(taskId: number, files: Express.Multer.File[]) {
    console.log('[attachToTask] taskId:', taskId);
    console.log('[attachToTask] files:', files);
    if (!files || files.length === 0) return [];

    const uploaded = await this.uploadFiles(files);

    const data = uploaded.map((file) => ({
      taskId,
      ...file,
    }));

    try {
      await taskAttachmentRepository.createMany(data);
    } catch (e) {
      console.error('[taskAttachment createMany error]', e);
      throw e;
    }

    return data;
  }
}

export default new TaskAttachmentService();
