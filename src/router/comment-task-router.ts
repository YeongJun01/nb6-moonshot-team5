import express from 'express';
import { authenticateAccess } from '../middleware/authenticate';
import { asyncHandler } from '../middleware/handlerFn';
import { requireTaskProjectMember } from '../middleware/requireProjectMember';
import commentController from '../controller/comment-controller';

const commentTaskRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: TaskComment
 *     description: 태스크 댓글 API
 */

/**
 * @swagger
 * /tasks/{id}/comments:
 *   post:
 *     summary: 태스크 댓글 생성
 *     tags: [TaskComment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: taskId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 example: 댓글 내용
 *     responses:
 *       201:
 *         description: 생성 성공
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 프로젝트 멤버 아님
 *       404:
 *         description: 태스크 없음
 */
commentTaskRouter.post(
  '/:id/comments',
  authenticateAccess,
  requireTaskProjectMember,
  asyncHandler(commentController.createComment),
);

/**
 * @swagger
 * /tasks/{id}/comments:
 *   get:
 *     summary: 태스크 댓글 목록 조회
 *     tags: [TaskComment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: taskId
 *     responses:
 *       200:
 *         description: 조회 성공
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 프로젝트 멤버 아님
 *       404:
 *         description: 태스크 없음
 */
commentTaskRouter.get(
  '/:id/comments',
  authenticateAccess,
  requireTaskProjectMember,
  asyncHandler(commentController.getTaskComment),
);

export default commentTaskRouter;
