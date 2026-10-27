import { Request } from 'express';

export type AuthenticatedRequest = Request & {
  user: {
    id: number;
    userId: number;
    email: string;
    isEmailVerified: boolean;
    role: string;
  };
};
