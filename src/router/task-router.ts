import { Router } from 'express';
import taskController from '../controller/task-controller';
import { asyncHandler } from '../middleware/handlerFn';
import { authenticateAccess } from '../middleware/authenticate';

const router = Router();

router
  .get('/:taskId', authenticateAccess, asyncHandler(taskController.findTaskById))
  .patch('/:taskId', authenticateAccess, asyncHandler(taskController.updateTask))
  .delete('/:taskId', authenticateAccess, asyncHandler(taskController.deleteTask));

export default router;
