import express from 'express';
import cors from 'cors';
import { PORT } from './lib/constants';
import { defaultNotFoundHandler, errorHandler } from './middleware/errorHandler';
import authRouter from './router/auth-router';
import projectRouter from './router/project-router';
import memberRouter from './router/member-router';

//express app 생성
const app = express();

//CORS 설정
app.use(cors());

//JSON 파싱 미들웨어 설정
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

//기타 라우트 및 미들웨어 설정

//auth
app.use('/auth', authRouter);
//projects
app.use('/projects', projectRouter);
//members
app.use('/projects', memberRouter);

//404 처리 미들웨어 및 에러 핸들러 등록
app.use(defaultNotFoundHandler);
app.use(errorHandler);

//서버 시작
app.listen(PORT, () => {
  console.log(`team5 Server is running on port ${PORT}`);
});
