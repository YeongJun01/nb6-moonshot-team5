import express from 'express';
import { asyncHandler } from '../middleware/handlerFn';
import authController from '../controller/auth-controller';
import { authenticateRefresh } from '../middleware/authenticate';

const authRouter = express.Router();

authRouter
  .post('/register', asyncHandler(authController.register))
  .post('/login', asyncHandler(authController.login))
  .post('/refresh', authenticateRefresh, asyncHandler(authController.refreshToken))
  .post('/logout', asyncHandler(authController.logout))
  .get('/google', asyncHandler(authController.googleLogin))
  .get('/google/callback', asyncHandler(authController.googleCallback));

export default authRouter;
