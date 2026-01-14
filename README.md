# nb6-moonshot-team5

# 🎓 팀 5

> 코드잇 노드 백엔드 6기
> 백엔드 중급 프로젝트 : MoonShot

📎 **팀 협업 문서:**
[Notion](https://www.notion.so/3-5-2ce37787836880979838cc3630150cce)

---

## 👥 팀원 구성

> 김지수, 나영준, 박건용, 이광수, 이상휘

---

## 🧩 프로젝트 소개

**목표:**  
일정 관리 사이트의 **백엔드 시스템 구축**을 통해 인증, 회원, 프로젝트, 할 일등 핵심 기능을 구현합니다.

**주요 기능:**

- 소셜 로그인 (Google OAuth)
- 토큰 기반 인증
- 프로젝트 등록 및 수정, 삭제
- 할 일, 하위 할 일
- 멤버 초대 및 추가, 제외
- 구글 캘린더 연동

---

## 🛠️ 기술 스택

| 구분          | 기술                          |
| ------------- | ----------------------------- |
| **Backend**   | Express.js, Prisma ORM        |
| **Database**  | Postgresql                    |
| **공통 Tool** | Git & Github, Discord, Notion |

---

## 🧑‍💻 팀원별 구현 기능

### 김지수

- **댓글 API**
  - 댓글 생성, 수정, 삭제 기능 구현

---

### 나영준

- **프로젝트 설계**
  - 프로젝트의 기반 폴더 구조 구현
  - prisma, 에러 class 구현
- **인증**
  - 회원가입, 로그인, 토큰 재발급 구현
- **유저**
  - 유저에 대한 조회, 수정 구현
- **첨부파일**
  - 첨부파일 등록 구현

---

### 박건용

- **프로젝트 API**
  - 프로젝트에 대한 CRUD 구현
- **멤버 API**
  - sendGrid를 활용해 초대 로직 구현
- **댓글 API**
  - 댓글 생성, 수정, 삭제 기능 구현

---

### 이광수

- **하위 할 일 API**
  - 하위 할 일에 대한 CRUD 구현

---

### 이상휘

- **할 일 API**
  할 일에 대한 CRUD 구현

---

## 📁 프로젝트 구조

```bash
NB6-MoonShot-TEAM5
├── prisma
│   ├── migrations
│   └── schema.prisma
├── src/
├─ controller/        # 요청/응답 처리 (HTTP 계층)
│   ├─ attachment-controller.ts
│   ├─ auth-controller.ts
│   ├─ comment-controller.ts
│   ├─ member-controller.ts
│   ├─ project-controller.ts
│   ├─ subtask-controller.ts
│   ├─ task-controller.ts
│   └─ user-controller.ts
│
├─ router/            # 라우팅 정의
│   ├─ attachment-router.ts
│   ├─ auth-router.ts
│   ├─ comment-router.ts
│   ├─ comment-task-router.ts
│   ├─ invitation-router.ts
│   ├─ member-router.ts
│   ├─ project-router.ts
│   ├─ subtask-router.ts
│   ├─ task-router.ts
│   └─ user-router.ts
│
├─ services/           # 비즈니스 로직
│   ├─ attachment-service.ts
│   ├─ auth-sevice.ts
│   ├─ calendar-service.ts
│   ├─ comment-service.ts
│   ├─ member-service.ts
│   ├─ project-service.ts
│   ├─ subtask-service.ts
│   ├─ task-service.ts
│   └─ user-service.ts
│
├─ repositories/       # DB 접근 계층│   ├─ attachment-repository.ts
│   ├─ auth-repository.ts
│   ├─ comment-repository.ts
│   ├─ invitation-repository.ts
│   ├─ member-repository.ts
│   ├─ project-repository.ts
│   ├─ subtask-repository.ts
│   ├─ task-repository.ts
│   └─ user-repository.ts
│
├─ dtos/               # 요청/응답 DTO
│   ├─ member-list-DTO.ts
│   └─ task-DTO.ts
│
│
├─ middleware/         # 공통 미들웨어
│   ├─ authenticate.ts
│   ├─ errorHandler.ts
│   ├─ handlerFn.ts
│   ├─ requireProjectMember.ts
│   ├─ upload.ts
│   └─ validate.ts
│
├─ structs/            # 요청 데이터 구조 검증
│   ├─ auth-structs.ts
│   ├─ comment-structs.ts
│   ├─ member-structs.ts
│   ├─ project-structs.ts
│   └─ common-structs.ts
│
├─ types/              # 타입 정의
│   ├─ auth.ts
│   ├─ comment.ts
│   ├─ express.d.ts
│   ├─ pagination.ts
│   ├─ Project.ts
│   └─ User.ts
│
├─ lib/                # 에러 처리 및 사용자 정의
│   ├─ errors/
│   │   ├─ BadRequestError.ts
│   │   ├─ ConflictError.ts
│   │   ├─ ForbiddenError.ts
│   │   ├─ NotFoundError.ts
│   │   ├─ UnauthorizedError.ts
│   │   └─ ValidationError.ts
│   │
│   ├─ constants.ts
│   ├─ google.ts
│   ├─ mailer.ts
│   ├─ prisma.ts
│   ├─ seed.ts
│   ├─ token.ts
│   └─ url.ts
│
├─ .env
├─ .prettierrc
├─ package.json
├─ package-lock.json
├─ tsconfig.json
└─ app.ts              # express app 설정, 서버 실행
```

---

## 🌐 구현 홈페이지

[Moonshot](https://moonshot-frontend.onrender.com)

---

## 🧠 프로젝트 회고록

> [발표자료](https://clever-figolla-8d4d5f.netlify.app/)

---

📌 **작성일:** 2025-01-14  
📌 **작성자:** nb6기 Team5
