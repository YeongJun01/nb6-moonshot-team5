import express from 'express';
import {
  createProject,
  getProject,
  updateProject,
  deleteProject,
} from '../controller/projectsController';

const projectRouter = express.Router();

projectRouter.post('/', createProject);
projectRouter.get('/:id', getProject);
projectRouter.patch('/:id', updateProject);
projectRouter.delete('/:id', deleteProject);

export default projectRouter;
