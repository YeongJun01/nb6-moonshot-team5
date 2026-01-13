import userController from '../controller/user-controller';
import { Router } from 'express';
import { asyncHandler } from '../middleware/handlerFn';
import { authenticateAccess } from '../middleware/authenticate';

const userRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: 사용자 API
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: 내 정보 조회
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 *       401:
 *         description: 인증 필요
 */
userRouter.get('/me', authenticateAccess, asyncHandler(userController.getMe));

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: 내 정보 수정
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: 'Keony' }
 *               profileImage: { type: string, example: 'https://...' }
 *     responses:
 *       200:
 *         description: 수정 성공
 *       401:
 *         description: 인증 필요
 */
userRouter.patch('/me', authenticateAccess, asyncHandler(userController.updateMe));

/**
 * @swagger
 * /users/me/projects:
 *   get:
 *     summary: 내가 속한 프로젝트 목록 조회
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 *       401:
 *         description: 인증 필요
 */
userRouter.get('/me/projects', authenticateAccess, asyncHandler(userController.getMyProjects));

/**
 * @swagger
 * /users/me/tasks:
 *   get:
 *     summary: 내 태스크 목록 조회
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 *       401:
 *         description: 인증 필요
 */
userRouter.get('/me/tasks', authenticateAccess, asyncHandler(userController.getMyTasks));

export default userRouter;
