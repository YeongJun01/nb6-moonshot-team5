import express from 'express';
import { authenticateAccess } from '../middleware/authenticate';
import { asyncHandler } from '../middleware/handlerFn';
import {
  requireCommentProjectMember,
  requireCommentAuthor,
} from '../middleware/requireProjectMember';
import commentController from '../controller/comment-controller';

const commentRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Comment
 *     description: 댓글 API
 */

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: 댓글 단건 조회
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 조회 성공
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 프로젝트 멤버가 아님
 *       404:
 *         description: 댓글 없음
 */
commentRouter.get(
  '/:id',
  authenticateAccess,
  requireCommentProjectMember,
  asyncHandler(commentController.getComment),
);

/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: 댓글 수정
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: 수정된 댓글 내용
 *     responses:
 *       200:
 *         description: 수정 성공
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음(작성자 아님/프로젝트 멤버 아님)
 *       404:
 *         description: 댓글 없음
 */
commentRouter.patch(
  '/:id',
  authenticateAccess,
  requireCommentProjectMember,
  requireCommentAuthor,
  asyncHandler(commentController.updateComment),
);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: 댓글 삭제
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: 삭제 성공
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음(작성자 아님/프로젝트 멤버 아님)
 *       404:
 *         description: 댓글 없음
 */
commentRouter.delete(
  '/:id',
  authenticateAccess,
  requireCommentProjectMember,
  requireCommentAuthor,
  asyncHandler(commentController.deleteComment),
);

export default commentRouter;
