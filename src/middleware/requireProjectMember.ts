import type { Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import ForbiddenError from '../lib/errors/ForbiddenError';
import type { AuthenticatedRequest } from '../types/auth';
import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/common-structs';

export async function requireProjectMember(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) return next(new ForbiddenError('로그인이 필요합니다'));

  const { id } = create(req.params, IdParamsStruct);
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

export function requireProjectRole(required: 'OWNER' | 'MEMBER') {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.projectMember) return next(new ForbiddenError('프로젝트 멤버가 아닙니다'));

    if (required === 'OWNER' && req.projectMember.role != 'OWNER') {
      return next(new ForbiddenError('프로젝트 관리자가 아닙니다'));
    }

    return next();
  };
}
