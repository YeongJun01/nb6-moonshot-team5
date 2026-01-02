import express from 'express';
import projectsController from '../controller/project-controller';
import { authenticateAccess } from '../middleware/authenticate';
import { asyncHandler } from '../middleware/handlerFn';

const projectRouter = express.Router();

projectRouter.post('/', authenticateAccess, asyncHandler(projectsController.createProject));
projectRouter.get('/:id', authenticateAccess, asyncHandler(projectsController.getProject));
projectRouter.patch('/:id', authenticateAccess, asyncHandler(projectsController.updateProject));
projectRouter.delete('/:id', authenticateAccess, asyncHandler(projectsController.deleteProject));

export default projectRouter;
