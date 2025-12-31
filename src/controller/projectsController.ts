import { Request, Response } from 'express';
import { create } from 'superstruct';
import { CreateProjectStruct, UpdateProjectStruct } from '../structs/projectStructs';
import { IdParamsStruct } from '../structs/commonStructs';
import * as projectService from '../service/projectsService';

export async function createProject(req: Request, res: Response) {
  //const userId = req.user.id;
  const userId = 1;
  const data = create(req.body, CreateProjectStruct);
  const project = await projectService.createProject(data, userId);
  res.status(201).send(project);
}

export async function getProject(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const project = await projectService.getProject(id);
  res.send(project);
}

export async function updateProject(req: Request, res: Response) {
  //const userId = req.user.id;
  const userId = 1;
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateProjectStruct);

  const updatedProject = await projectService.updateProject(userId, id, data);
  res.send(updatedProject);
}

export async function deleteProject(req: Request, res: Response) {
  //const userId = req.user.id;
  const userId = 1;
  const { id } = create(req.params, IdParamsStruct);
  await projectService.deleteProject(userId, id);
  res.status(204).send();
}
