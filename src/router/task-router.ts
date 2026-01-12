import { Router } from 'express';
import taskController from '../controller/task-controller';
import { asyncHandler } from '../middleware/handlerFn';
import { authenticateAccess } from '../middleware/authenticate';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Task
 *     description: 태스크 API
 */

/**
 * @swagger
 * /tasks/{taskId}:
 *   get:
 *     summary: 태스크 단건 조회
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: 조회 성공
 *       401:
 *         description: 인증 필요
 *       404:
 *         description: 태스크 없음
 */
router.get('/:taskId', authenticateAccess, asyncHandler(taskController.findTaskById));

/**
 * @swagger
 * /tasks/{taskId}:
 *   patch:
 *     summary: 태스크 수정
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, example: '수정된 제목' }
 *               description: { type: string, example: '수정된 설명' }
 *               status: { type: string, example: 'done' }
 *               assigneeId: { type: integer, example: 1 }
 *               dueDate: { type: string, format: date-time, example: '2026-01-10T12:00:00Z' }
 *     responses:
 *       200:
 *         description: 수정 성공
 *       401:
 *         description: 인증 필요
 *       404:
 *         description: 태스크 없음
 */
router.patch('/:taskId', authenticateAccess, asyncHandler(taskController.updateTask));

/**
 * @swagger
 * /tasks/{taskId}:
 *   delete:
 *     summary: 태스크 삭제
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       204:
 *         description: 삭제 성공
 *       401:
 *         description: 인증 필요
 *       404:
 *         description: 태스크 없음
 */
router.delete('/:taskId', authenticateAccess, asyncHandler(taskController.deleteTask));

export default router;
