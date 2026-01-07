import { User } from '@prisma/client';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
  };
  projectMember?: {
    id: number;
    role: 'OWNER' | 'MEMBER';
  };
  refreshToken?: string;
}
