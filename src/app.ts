import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT } from './lib/constants';
import { defaultNotFoundHandler, errorHandler } from './middleware/errorHandler';
import authRouter from './router/auth-router';
import projectRouter from './router/project-router';
import memberRouter from './router/member-router';
import invitationRouter from './router/invitation-router';
import attachmentRouter from './router/attachment-router';
import path from 'node:path';
import userRouter from './router/user-router';
import taskRouter from './router/task-router';

//express app 생성
const app = express();

//CORS 설정
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

//JSON 파싱 미들웨어 설정
app.use(express.json());
//쿠키 파서 미들웨어 설정
app.use(cookieParser());

//파일 업로드를 위한 정적 파일 서비스 설정
app.use('/attachments', express.static(path.join(__dirname, '../public/attachments')));

//기본 라우트 설정
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

//기타 라우트 및 미들웨어 설정

//첨부파일
app.use('/files', attachmentRouter);

//auth
app.use('/auth', authRouter);

//user
app.use('/users', userRouter);

//projects
app.use('/projects', projectRouter);
//members
app.use('/projects', memberRouter);
//invitations
app.use('/invitations', invitationRouter);

//task
app.use('/tasks', taskRouter);

//404 처리 미들웨어 및 에러 핸들러 등록
app.use(defaultNotFoundHandler);
app.use(errorHandler);

//서버 시작
app.listen(PORT, () => {
  console.log(`team5 Server is running on port ${PORT}`);
});
