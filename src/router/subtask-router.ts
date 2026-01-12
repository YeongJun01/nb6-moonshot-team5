import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticateAccess } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { subtaskController } from '../controller/subtask-controller';
import { asyncHandler } from '../middleware/handlerFn';

const subtaskRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Subtask
 *     description: 하위 할 일 API
 */

/**
 * @swagger
 * /subtasks/{subtaskId}:
 *   get:
 *     summary: 하위 할 일 단건 조회
 *     tags: [Subtask]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subtaskId
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: 조회 성공
 *       400:
 *         description: subtaskId 유효성 오류
 *       401:
 *         description: 인증 필요
 *       404:
 *         description: 하위 할 일 없음
 */
subtaskRouter.get(
  '/:subtaskId',
  authenticateAccess,
  [param('subtaskId').isInt({ gt: 0 }).withMessage('subtaskId는 양의 정수여야 합니다'), validate],
  asyncHandler(subtaskController.getSubtask.bind(subtaskController)),
);

/**
 * @swagger
 * /subtasks/{subtaskId}:
 *   patch:
 *     summary: 하위 할 일 수정
 *     tags: [Subtask]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subtaskId
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: 수정된 제목
 *               status:
 *                 type: string
 *                 enum: [todo, done]
 *                 example: done
 *     responses:
 *       200:
 *         description: 수정 성공
 *       400:
 *         description: 유효성 오류
 *       401:
 *         description: 인증 필요
 *       404:
 *         description: 하위 할 일 없음
 */
subtaskRouter.patch(
  '/:subtaskId',
  authenticateAccess,
  [
    param('subtaskId').isInt({ gt: 0 }).withMessage('subtaskId는 양의 정수여야 합니다'),
    body('title').optional().notEmpty().withMessage('제목을 입력해주세요'),
    body('status')
      .optional()
      .isIn(['todo', 'done', 'in_progress'])
      .withMessage('상태는 TODO 또는 IN_PROGRESS, DONE이어야 합니다'),
    validate,
  ],
  asyncHandler(subtaskController.updateSubtask.bind(subtaskController)),
);

/**
 * @swagger
 * /subtasks/{subtaskId}:
 *   delete:
 *     summary: 하위 할 일 삭제
 *     tags: [Subtask]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subtaskId
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       204:
 *         description: 삭제 성공
 *       400:
 *         description: 유효성 오류
 *       401:
 *         description: 인증 필요
 *       404:
 *         description: 하위 할 일 없음
 */
subtaskRouter.delete(
  '/:subtaskId',
  authenticateAccess,
  [param('subtaskId').isInt({ gt: 0 }).withMessage('subtaskId는 양의 정수여야 합니다'), validate],
  asyncHandler(subtaskController.deleteSubtask.bind(subtaskController)),
);

export default subtaskRouter;
