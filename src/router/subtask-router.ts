import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticateAccess } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { subtaskController } from '../controller/subtask-controller';
import { asyncHandler } from '../middleware/handlerFn';

const subtaskRouter = Router();

subtaskRouter
  .get(
    '/:subtaskId',
    authenticateAccess,
    [param('subtaskId').isInt({ gt: 0 }).withMessage('subtaskId는 양의 정수여야 합니다'), validate],
    asyncHandler(subtaskController.getSubtask.bind(subtaskController)),
  )
  .patch(
    '/:subtaskId',
    authenticateAccess,
    [
      param('subtaskId').isInt({ gt: 0 }).withMessage('subtaskId는 양의 정수여야 합니다'),
      body('title').optional().notEmpty().withMessage('제목을 입력해주세요'),
      body('status')
        .optional()
        .isIn(['TODO', 'DONE'])
        .withMessage('상태는 TODO 또는 DONE이어야 합니다'),
      validate,
    ],
    asyncHandler(subtaskController.updateSubtask.bind(subtaskController)),
  )
  .delete(
    '/:subtaskId',
    authenticateAccess,
    [param('subtaskId').isInt({ gt: 0 }).withMessage('subtaskId는 양의 정수여야 합니다'), validate],
    asyncHandler(subtaskController.deleteSubtask.bind(subtaskController)),
  );

export default subtaskRouter;
