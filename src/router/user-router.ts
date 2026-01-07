import userController from '../controller/user-controller';
import { Router } from 'express';
import { asyncHandler } from '../middleware/handlerFn';
import { authenticateAccess } from '../middleware/authenticate';

const userRouter = Router();

userRouter
  .get('/me', authenticateAccess, asyncHandler(userController.getMe))
  .patch('/me', authenticateAccess, asyncHandler(userController.updateMe))
  .get('/me/projects', authenticateAccess, asyncHandler(userController.getMyProjects))
  .get('/me/tasks', authenticateAccess, asyncHandler(userController.getMyTasks));

export default userRouter;
