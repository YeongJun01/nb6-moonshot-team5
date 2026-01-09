import express from 'express';
import memberController from '../controller/member-controller';
import { authenticateAccess } from '../middleware/authenticate';
import { asyncHandler } from '../middleware/handlerFn';
import { requireProjectMember, requireProjectRole } from '../middleware/requireProjectMember';

const memberRouter = express.Router();

memberRouter
  .get(
    '/:id/users',
    authenticateAccess,
    requireProjectMember,
    asyncHandler(memberController.getProjectMembers),
  )
  .delete(
    '/:id/users/:userId',
    authenticateAccess,
    requireProjectMember,
    requireProjectRole('owner'),
    asyncHandler(memberController.deleteProjectMembers),
  )
  .post(
    '/:id/invitations',
    authenticateAccess,
    requireProjectMember,
    requireProjectRole('owner'),
    asyncHandler(memberController.inviteProjectMember),
  );

export default memberRouter;
