import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Moonshot API',
      version: '1.0.0',
      description: '프로젝트 / 태스크 관리 API 문서',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },

      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: '에러 메시지' },
          },
          required: ['message'],
        },
        TokensResponse: {
          type: 'object',
          properties: {
            accessToken: { type: 'string', example: 'eyJhbGciOi...' },
            refreshToken: { type: 'string', example: 'eyJhbGciOi...' },
          },
          required: ['accessToken', 'refreshToken'],
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  // 👇 여기에 라우터 파일들 경로
  apis: ['src/router/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
