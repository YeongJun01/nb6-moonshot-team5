import express from 'express';
import memberController from '../controller/member-controller';
import { authenticateAccess } from '../middleware/authenticate';
import { asyncHandler } from '../middleware/handlerFn';
import { requireProjectMember, requireProjectRole } from '../middleware/requireProjectMember';

const memberRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Member
 *     description: 프로젝트 멤버/초대 API
 */

/**
 * @swagger
 * /members/{id}/users:
 *   get:
 *     summary: 프로젝트 멤버 목록 조회
 *     tags: [Member]
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
memberRouter.get(
  '/:id/users',
  authenticateAccess,
  requireProjectMember,
  asyncHandler(memberController.getProjectMembers),
);

/**
 * @swagger
 * /members/{id}/users/{userId}:
 *   delete:
 *     summary: 프로젝트 멤버 강제 삭제(Owner만)
 *     tags: [Member]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: projectId
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         description: targetUserId
 *     responses:
 *       204:
 *         description: 삭제 성공
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음(Owner 아님/멤버 아님)
 *       404:
 *         description: 대상 없음
 */
memberRouter.delete(
  '/:id/users/:userId',
  authenticateAccess,
  requireProjectMember,
  requireProjectRole('owner'),
  asyncHandler(memberController.deleteProjectMembers),
);

/**
 * @swagger
 * /members/{id}/invitations:
 *   post:
 *     summary: 프로젝트 멤버 초대(Owner만)
 *     tags: [Member]
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
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: invitee@test.com
 *     responses:
 *       201:
 *         description: 초대 생성 성공
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음(Owner 아님/멤버 아님)
 *       404:
 *         description: 사용자/프로젝트 없음
 *       409:
 *         description: 이미 멤버이거나 이미 초대됨
 */
memberRouter.post(
  '/:id/invitations',
  authenticateAccess,
  requireProjectMember,
  requireProjectRole('owner'),
  asyncHandler(memberController.inviteProjectMember),
);

export default memberRouter;
