import express from 'express';
import projectsController from '../controller/project-controller';
import { authenticateAccess } from '../middleware/authenticate';
import { asyncHandler } from '../middleware/handlerFn';
import { requireProjectMember, requireProjectRole } from '../middleware/requireProjectMember';
import taskController from '../controller/task-controller';

const projectRouter = express.Router();

projectRouter
  .post('/', authenticateAccess, asyncHandler(projectsController.createProject))
  .get(
    '/:id',
    authenticateAccess,
    requireProjectMember,
    asyncHandler(projectsController.getProject),
  )
  .patch(
    '/:id',
    authenticateAccess,
    requireProjectMember,
    requireProjectRole('owner'),
    asyncHandler(projectsController.updateProject),
  )
  .delete(
    '/:id',
    authenticateAccess,
    requireProjectMember,
    requireProjectRole('owner'),
    asyncHandler(projectsController.deleteProject),
  )
  .get(
    '/:id/tasks',
    authenticateAccess,
    requireProjectMember,
    asyncHandler(taskController.getTasks),
  )
  .post(
    '/:id/tasks',
    authenticateAccess,
    requireProjectMember,
    asyncHandler(taskController.createTask),
  );

export default projectRouter;
