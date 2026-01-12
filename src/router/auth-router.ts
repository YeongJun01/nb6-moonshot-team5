import express from 'express';
import { asyncHandler } from '../middleware/handlerFn';
import authController from '../controller/auth-controller';
import { authenticateRefresh } from '../middleware/authenticate';

const authRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: 인증/인가 API
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@test.com
 *               password:
 *                 type: string
 *                 example: qwer1234
 *               name:
 *                 type: string
 *                 example: Keony
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *       409:
 *         description: 이미 존재하는 이메일
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post('/register', asyncHandler(authController.register));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@test.com
 *               password:
 *                 type: string
 *                 example: qwer1234
 *     responses:
 *       200:
 *         description: 로그인 성공 (토큰 발급)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokensResponse'
 *       401:
 *         description: 이메일 또는 비밀번호 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post('/login', asyncHandler(authController.login));

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: 액세스 토큰 재발급
 *     description: refresh 토큰 검증을 통과하면 새로운 accessToken(및 필요시 refreshToken)을 발급합니다.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 재발급 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokensResponse'
 *       401:
 *         description: refresh 토큰이 유효하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post('/refresh', authenticateRefresh, asyncHandler(authController.refreshToken));

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: 로그아웃
 *     tags: [Auth]
 *     responses:
 *       204:
 *         description: 로그아웃 성공
 */
authRouter.post('/logout', asyncHandler(authController.logout));

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: 구글 로그인 시작
 *     description: 구글 OAuth 로그인 페이지로 리다이렉트합니다.
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: 구글 로그인 페이지로 리다이렉트
 */
authRouter.get('/google', asyncHandler(authController.googleLogin));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: 구글 로그인 콜백
 *     description: 구글 OAuth 인증 후 콜백을 처리합니다.
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 로그인 성공(토큰/쿠키 등은 구현에 따름)
 *       400:
 *         description: 콜백 처리 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.get('/google/callback', asyncHandler(authController.googleCallback));

export default authRouter;
