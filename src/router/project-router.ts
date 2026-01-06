import express from 'express';
import projectsController from '../controller/project-controller';
import { authenticateAccess } from '../middleware/authenticate';
import { asyncHandler } from '../middleware/handlerFn';
import { requireProjectMember, requireProjectRole } from '../middleware/requireProjectMember';

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
    requireProjectRole('OWNER'),
    asyncHandler(projectsController.updateProject),
  )
  .delete(
    '/:id',
    authenticateAccess,
    requireProjectMember,
    requireProjectRole('OWNER'),
    asyncHandler(projectsController.deleteProject),
  );

export default projectRouter;
