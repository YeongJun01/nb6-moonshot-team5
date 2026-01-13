import { User } from '@prisma/client';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
  projectMember?: {
    id: number;
    role: 'owner' | 'member';
  };
  refreshToken?: string;
}
interface UpdateSubtaskInput {
  title?: string;
  status?: 'todo' | 'done';
}

export interface AuthRequest extends Request {
  userId?: number;
}
