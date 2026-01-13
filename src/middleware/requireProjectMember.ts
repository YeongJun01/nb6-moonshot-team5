import type { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import ForbiddenError from '../lib/errors/ForbiddenError';
import BadRequestError from '../lib/errors/BadRequestError';
import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/common-structs';
import NotFoundError from '../lib/errors/NotFoundError';
import UnauthorizedError from '../lib/errors/UnauthorizedError';

export async function requireProjectMember(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return next(new ForbiddenError('로그인이 필요합니다'));

  const rawId = req.params.id;
  if (!rawId) {
    return next(new BadRequestError('project id가 필요합니다'));
  }

  const { id } = create({ id: rawId }, IdParamsStruct);

  const project = await prisma.project.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!project) {
    return next(new NotFoundError('존재하지 않는 프로젝트입니다.'));
  }

  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId: id,
        userId: req.user.id,
      },
    },
    select: { id: true, role: true },
  });

  if (!member) {
    return next(new ForbiddenError('프로젝트 멤버가 아닙니다.'));
  }
  req.projectMember = member;
  return next();
}

export async function requireInvitationAccess(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return next(new ForbiddenError('로그인이 필요합니다'));

  const rawId = req.params.id;
  if (!rawId) {
    return next(new BadRequestError('초대 id가 필요합니다.'));
  }
  const { id } = create({ id: rawId }, IdParamsStruct);

  const invitation = await prisma.invitation.findUnique({
    where: { id },
    select: { projectId: true },
  });

  if (!invitation) return next(new NotFoundError('해당 초대가 없습니다.'));

  const owner = await prisma.projectMember.findFirst({
    where: {
      projectId: invitation.projectId,
      role: 'owner',
    },
    select: { userId: true },
  });

  if (!owner) return next(new NotFoundError('프로젝트 OWNER가 없습니다.'));

  if (owner.userId != req.user.id) {
    return next(new ForbiddenError('프로젝트 관리자가 아닙니다'));
  }

  next();
}

export function requireProjectRole(required: 'owner' | 'member') {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.projectMember) return next(new ForbiddenError('프로젝트 멤버가 아닙니다'));

    if (required === 'owner' && req.projectMember.role != 'owner') {
      return next(new ForbiddenError('프로젝트 관리자가 아닙니다'));
    }

    return next();
  };
}

export async function requireTaskProjectMember(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return next(new ForbiddenError('로그인이 필요합니다'));

  const rawTaskId = req.params.id;
  if (!rawTaskId) return next(new BadRequestError('task id가 필요합니다'));

  const { id: taskId } = create({ id: rawTaskId }, IdParamsStruct);

  // 1) task가 존재하는지 + projectId 가져오기
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { id: true, projectId: true },
  });
  if (!task) return next(new NotFoundError('존재하지 않는 할일입니다.'));

  // 2) 해당 projectId로 멤버인지 확인
  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId: task.projectId,
        userId: req.user.id,
      },
    },
    select: { id: true, role: true },
  });

  if (!member) return next(new ForbiddenError('프로젝트 멤버가 아닙니다.'));

  req.projectMember = member;

  return next();
}

export async function requireCommentProjectMember(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return next(new ForbiddenError('로그인이 필요합니다'));

  const rawCommentId = req.params.id;
  if (!rawCommentId) return next(new BadRequestError('task id가 필요합니다'));

  const { id: commentId } = create({ id: rawCommentId }, IdParamsStruct);
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { id: true, taskId: true },
  });
  if (!comment) return next(new NotFoundError('존재하지 않는 댓글입니다.'));
  const taskId = comment.taskId;

  // 1) task가 존재하는지 + projectId 가져오기
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { id: true, projectId: true },
  });
  if (!task) return next(new NotFoundError('존재하지 않는 할일입니다.'));

  // 2) 해당 projectId로 멤버인지 확인
  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId: task.projectId,
        userId: req.user.id,
      },
    },
    select: { id: true, role: true },
  });

  if (!member) return next(new ForbiddenError('프로젝트 멤버가 아닙니다.'));

  req.projectMember = member;

  return next();
}

export async function requireCommentAuthor(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new UnauthorizedError('로그인이 필요합니다.'));
  }
  const rawCommentId = req.params.id;
  const { id: commentId } = create({ id: rawCommentId }, IdParamsStruct);
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { authorId: true },
  });
  if (!comment) {
    return next(new NotFoundError('존재하지 않는 댓글입니다.'));
  }

  if (comment.authorId != req.user.id) {
    return next(new ForbiddenError('작성자가 아닙니다.'));
  }
  return next();
}
