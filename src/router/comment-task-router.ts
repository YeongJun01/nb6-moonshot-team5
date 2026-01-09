import express from 'express';
import { authenticateAccess } from '../middleware/authenticate';
import { asyncHandler } from '../middleware/handlerFn';
import { requireTaskProjectMember } from '../middleware/requireProjectMember';
import commentController from '../controller/comment-controller';

const commentTaskRouter = express.Router();

commentTaskRouter
  .post(
    '/:id/comments',
    authenticateAccess,
    requireTaskProjectMember,
    asyncHandler(commentController.createComment),
  )
  .get(
    '/:id/comments',
    authenticateAccess,
    requireTaskProjectMember,
    asyncHandler(commentController.getTaskComment),
  );

export default commentTaskRouter;
