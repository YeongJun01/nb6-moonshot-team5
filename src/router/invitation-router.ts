import express from 'express';
import memberController from '../controller/member-controller';
import { authenticateAccess } from '../middleware/authenticate';
import { asyncHandler } from '../middleware/handlerFn';
import { requireInvitationAccess } from '../middleware/requireProjectMember';

const invitationRouter = express.Router();

invitationRouter
  .post('/:id/accept', authenticateAccess, asyncHandler(memberController.acceptProjectMembers))
  .delete(
    '/:id',
    authenticateAccess,
    requireInvitationAccess,
    asyncHandler(memberController.deleteProjectInvitation),
  );

export default invitationRouter;
