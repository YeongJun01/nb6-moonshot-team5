import 'express';

declare global {
  namespace Express {
    interface User {
      id: number;
    }

    interface Request {
      user?: User;
      projectMember?: {
        id: number;
        role: 'OWNER' | 'MEMBER';
      };
    }
  }
}

export {};
