import express from 'express';
import { uploadAttachments } from '../middleware/upload';
import attachmentController from '../controller/attachment-controller';

const router = express.Router();

router.post('/', uploadAttachments, attachmentController.uploadTaskAttachments);

export default router;
