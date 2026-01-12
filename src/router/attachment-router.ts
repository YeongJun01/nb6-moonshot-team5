import express from 'express';
import { uploadAttachments } from '../middleware/upload';
import attachmentController from '../controller/attachment-controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Attachment
 *     description: 첨부파일 업로드 API
 */

/**
 * @swagger
 * /attachments:
 *   post:
 *     summary: 태스크 첨부파일 업로드
 *     tags: [Attachment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *             required: [files]
 *     responses:
 *       201:
 *         description: 업로드 성공
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 인증 필요
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', uploadAttachments, attachmentController.uploadTaskAttachments);

export default router;
