import { Router } from 'express';
import { authenticateAccess } from '../middleware/authenticate';
import { subtaskController } from '../controller/subtask-controller';
import { asyncHandler } from '../middleware/handlerFn';

const subtaskTaskRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Subtasks
 *   description: 하위 할 일(Subtask) API
 */

/**
 * @swagger
 * /tasks/{id}/subtasks:
 *   post:
 *     tags: [Subtasks]
 *     summary: 하위 할 일 생성
 *     description: 특정 할 일(task)에 하위 할 일을 생성합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 상위 할 일(Task) ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "하위 할 일 제목"
 *     responses:
 *       201:
 *         description: 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "하위 할 일 제목"
 *                 taskId:
 *                   type: integer
 *                   example: 10
 *                 status:
 *                   type: string
 *                   enum: [todo, in_progress, done]
 *                   example: todo
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: 잘못된 요청 형식
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "잘못된 요청 형식"
 *       401:
 *         description: 로그인 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그인이 필요합니다"
 *       403:
 *         description: 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "권한이 없습니다"
 */

/**
 * @swagger
 * /tasks/{id}/subtasks:
 *   get:
 *     tags: [Subtasks]
 *     summary: 하위 할 일 목록 조회
 *     description: 특정 할 일(task)의 하위 할 일 목록을 조회합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 상위 할 일(Task) ID
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "하위 할 일 제목"
 *                       taskId:
 *                         type: integer
 *                         example: 10
 *                       status:
 *                         type: string
 *                         enum: [todo, in_progress, done]
 *                         example: todo
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: 잘못된 요청 형식
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "잘못된 요청 형식"
 *       401:
 *         description: 로그인 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그인이 필요합니다"
 *       403:
 *         description: 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "권한이 없습니다"
 */

subtaskTaskRouter
  .post('/:id/subtasks', authenticateAccess, asyncHandler(subtaskController.createSubtask))
  .get('/:id/subtasks', authenticateAccess, asyncHandler(subtaskController.getSubtaskOfTask));

export default subtaskTaskRouter;
