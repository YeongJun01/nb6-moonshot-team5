import express from 'express';
import projectsController from '../controller/project-controller';
import { authenticateAccess } from '../middleware/authenticate';
import { asyncHandler } from '../middleware/handlerFn';
import { requireProjectMember, requireProjectRole } from '../middleware/requireProjectMember';
import taskController from '../controller/task-controller';

const projectRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Project
 *     description: 프로젝트 API
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: 프로젝트 생성
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: 'My Project' }
 *               description: { type: string, example: '프로젝트 설명' }
 *             required: [name]
 *     responses:
 *       201:
 *         description: 생성 성공
 *       401:
 *         description: 인증 필요
 */
projectRouter.post('/', authenticateAccess, asyncHandler(projectsController.createProject));

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: 프로젝트 단건 조회
 *     tags: [Project]
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
 *         description: 프로젝트 멤버 아님
 *       404:
 *         description: 프로젝트 없음
 */
projectRouter.get(
  '/:id',
  authenticateAccess,
  requireProjectMember,
  asyncHandler(projectsController.getProject),
);

/**
 * @swagger
 * /projects/{id}:
 *   patch:
 *     summary: 프로젝트 수정(Owner만)
 *     tags: [Project]
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
 *               name: { type: string, example: 'Updated Project' }
 *               description: { type: string, example: '수정된 설명' }
 *     responses:
 *       200:
 *         description: 수정 성공
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 프로젝트 없음
 */
projectRouter.patch(
  '/:id',
  authenticateAccess,
  requireProjectMember,
  requireProjectRole('owner'),
  asyncHandler(projectsController.updateProject),
);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: 프로젝트 삭제(Owner만)
 *     tags: [Project]
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
 *         description: 권한 없음
 *       404:
 *         description: 프로젝트 없음
 */
projectRouter.delete(
  '/:id',
  authenticateAccess,
  requireProjectMember,
  requireProjectRole('owner'),
  asyncHandler(projectsController.deleteProject),
);

/**
 * @swagger
 * /projects/{id}/tasks:
 *   get:
 *     summary: 프로젝트 태스크 목록 조회
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: projectId
 *     responses:
 *       200:
 *         description: 조회 성공
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 프로젝트 멤버 아님
 *       404:
 *         description: 프로젝트 없음
 */
projectRouter.get(
  '/:id/tasks',
  authenticateAccess,
  requireProjectMember,
  asyncHandler(taskController.getTasks),
);

/**
 * @swagger
 * /projects/{id}/tasks:
 *   post:
 *     summary: 프로젝트 태스크 생성
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: projectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, example: '할 일 제목' }
 *               description: { type: string, example: '할 일 설명' }
 *               status: { type: string, example: 'todo' }
 *               assigneeId: { type: integer, example: 1 }
 *               dueDate: { type: string, format: date-time, example: '2026-01-10T12:00:00Z' }
 *             required: [title]
 *     responses:
 *       201:
 *         description: 생성 성공
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 프로젝트 멤버 아님
 *       404:
 *         description: 프로젝트 없음
 */
projectRouter.post(
  '/:id/tasks',
  authenticateAccess,
  requireProjectMember,
  asyncHandler(taskController.createTask),
);

export default projectRouter;
