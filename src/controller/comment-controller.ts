import { Request, Response } from 'express';
import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/common-structs';
import { CreateCommentBodyStruct, UpdateCommentBodyStruct } from '../structs/comment-structs';
import commentService from '../service/comment-service';
import { responseEncoding } from 'axios';

class CommentController {
  async createComment(req: Request, res: Response) {
    const { id } = create(req.params, IdParamsStruct);
    const { content } = create(req.body, CreateCommentBodyStruct);
    const result = await commentService.createComment({
      content,
      taskId: id,
      userId: req.user!.id,
    });

    res.status(201).send(result);
  }

  async getTaskComment(req: Request, res: Response) {
    const { id } = create(req.params, IdParamsStruct);
    const result = await commentService.getTaskComments(id);

    res.status(201).send(result);
  }

  async getComment(req: Request, res: Response) {
    const { id } = create(req.params, IdParamsStruct);
    const result = await commentService.getComment(id);

    res.status(201).send(result);
  }

  async updateComment(req: Request, res: Response) {
    const { id } = create(req.params, IdParamsStruct);
    const { content } = create(req.body, UpdateCommentBodyStruct);

    const result = await commentService.updateComment(id, content);
    res.status(201).send(result);
  }

  async deleteComment(req: Request, res: Response) {
    const { id } = create(req.params, IdParamsStruct);
    await commentService.deleteComment(id);

    res.status(204).send();
  }
}

export default new CommentController();
