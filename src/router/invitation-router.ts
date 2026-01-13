import express from 'express';
import memberController from '../controller/member-controller';
import { authenticateAccess } from '../middleware/authenticate';
import { asyncHandler } from '../middleware/handlerFn';
import { requireInvitationAccess } from '../middleware/requireProjectMember';

const invitationRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Invitation
 *     description: 초대장 API
 */

/**
 * @swagger
 * /invitations/{id}/accept:
 *   post:
 *     summary: 프로젝트 초대 수락
 *     tags: [Invitation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: invitationId
 *     responses:
 *       200:
 *         description: 수락 성공
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 접근 권한 없음
 *       404:
 *         description: 초대장 없음
 */
invitationRouter.post(
  '/:id/accept',
  authenticateAccess,
  asyncHandler(memberController.acceptProjectMembers),
);

/**
 * @swagger
 * /invitations/{id}:
 *   delete:
 *     summary: 프로젝트 초대장 삭제(취소)
 *     tags: [Invitation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: invitationId
 *     responses:
 *       204:
 *         description: 삭제 성공
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 초대장 없음
 */
invitationRouter.delete(
  '/:id',
  authenticateAccess,
  requireInvitationAccess,
  asyncHandler(memberController.deleteProjectInvitation),
);

export default invitationRouter;
