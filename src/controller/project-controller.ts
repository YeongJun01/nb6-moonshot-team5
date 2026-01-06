import type { Request, Response } from 'express';
import { create } from 'superstruct';
import { CreateProjectStruct, UpdateProjectStruct } from '../structs/project-structs';
import { IdParamsStruct } from '../structs/common-structs';
import projectService from '../service/project-service';
import type { AuthenticatedRequest } from '../types/auth';
import UnauthorizedError from '../lib/errors/UnauthorizedError';

class ProjectsController {
  async createProject(req: Request, res: Response) {
    if (!req.user) {
      throw new UnauthorizedError('로그인이 필요합니다');
    }

    const data = create(req.body, CreateProjectStruct);
    const project = await projectService.createProject(data, req.user.id);

    res.status(201).send(project);
  }

  async getProject(req: Request, res: Response) {
    if (!req.user) {
      throw new UnauthorizedError('로그인이 필요합니다');
    }

    const { id } = create(req.params, IdParamsStruct);
    const project = await projectService.getProject(id);

    res.send(project);
  }

  async updateProject(req: Request, res: Response) {
    if (!req.user) {
      throw new UnauthorizedError('로그인이 필요합니다');
    }

    const { id } = create(req.params, IdParamsStruct);
    const data = create(req.body, UpdateProjectStruct);

    const updatedProject = await projectService.updateProject(req.user.id, id, data);

    res.send(updatedProject);
  }

  async deleteProject(req: Request, res: Response) {
    if (!req.user) {
      throw new UnauthorizedError('로그인이 필요합니다');
    }

    const { id } = create(req.params, IdParamsStruct);
    await projectService.deleteProject(req.user.id, id);

    res.status(204).send();
  }
}

export default new ProjectsController();
