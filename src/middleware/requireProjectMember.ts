import type { Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import ForbiddenError from '../lib/errors/ForbiddenError';
import BadRequestError from '../lib/errors/BadRequestError';
import type { AuthenticatedRequest } from '../types/auth';
import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/common-structs';
import NotFoundError from '../lib/errors/NotFoundError';

export async function requireProjectMember(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
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

export async function requireInvitationAccess(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
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
      role: 'OWNER',
    },
    select: { userId: true },
  });

  if (!owner) return next(new NotFoundError('프로젝트 OWNER가 없습니다.'));

  if (owner.userId != req.user.id) {
    return next(new ForbiddenError('프로젝트 관리자가 아닙니다'));
  }

  next();
}

export function requireProjectRole(required: 'OWNER' | 'MEMBER') {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.projectMember) return next(new ForbiddenError('프로젝트 멤버가 아닙니다'));

    if (required === 'OWNER' && req.projectMember.role != 'OWNER') {
      return next(new ForbiddenError('프로젝트 관리자가 아닙니다'));
    }

    return next();
  };
}
