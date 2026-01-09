import express from 'express';
import { authenticateAccess } from '../middleware/authenticate';
import { asyncHandler } from '../middleware/handlerFn';
import {
  requireCommentProjectMember,
  requireCommentAuthor,
} from '../middleware/requireProjectMember';
import commentController from '../controller/comment-controller';

const commentRouter = express.Router();

commentRouter
  .get(
    '/:id',
    authenticateAccess,
    requireCommentProjectMember,
    asyncHandler(commentController.getComment),
  )
  .patch(
    '/:id',
    authenticateAccess,
    requireCommentProjectMember,
    requireCommentAuthor,
    asyncHandler(commentController.updateComment),
  )
  .delete(
    '/:id',
    authenticateAccess,
    requireCommentProjectMember,
    requireCommentAuthor,
    asyncHandler(commentController.deleteComment),
  );

export default commentRouter;
