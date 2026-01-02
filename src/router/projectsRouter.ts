import express from 'express';
import {
  createProject,
  getProject,
  updateProject,
  deleteProject,
} from '../controller/projectsController';
import { authenticateAccess } from '../middleware/authenticate';
import { asyncHandler } from '../middleware/handlerFn';

const projectRouter = express.Router();

projectRouter.post('/', authenticateAccess, asyncHandler(createProject));
projectRouter.get('/:id', authenticateAccess, asyncHandler(getProject));
projectRouter.patch('/:id', authenticateAccess, asyncHandler(updateProject));
projectRouter.delete('/:id', authenticateAccess, asyncHandler(deleteProject));

export default projectRouter;
