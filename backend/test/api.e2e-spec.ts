import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('API Endpoints (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth API', () => {
    describe('POST /auth/register', () => {
      it('should register a new user', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            email: 'test@example.com',
            password: 'SecurePass123',
            name: 'Test User',
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('access_token');
            expect(res.body).toHaveProperty('user');
            expect(res.body.user.email).toBe('test@example.com');
          });
      });

      it('should fail with invalid email', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            email: 'invalid-email',
            password: 'SecurePass123',
            name: 'Test User',
          })
          .expect(400);
      });

      it('should fail with weak password', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            email: 'test@example.com',
            password: 'weak',
            name: 'Test User',
          })
          .expect(400);
      });
    });

    describe('POST /auth/login', () => {
      it('should login with valid credentials', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'test@example.com',
            password: 'SecurePass123',
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('access_token');
            expect(res.body).toHaveProperty('user');
          });
      });

      it('should fail with invalid credentials', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword',
          })
          .expect(401);
      });
    });
  });

  describe('Profile API', () => {
    let authToken: string;

    beforeAll(async () => {
      const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
        email: 'test@example.com',
        password: 'SecurePass123',
      });
      authToken = loginResponse.body.access_token;
    });

    describe('GET /profile', () => {
      it('should return user profile with auth', () => {
        return request(app.getHttpServer())
          .get('/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('email');
          });
      });

      it('should fail without auth', () => {
        return request(app.getHttpServer()).get('/profile').expect(401);
      });
    });

    describe('PUT /profile', () => {
      it('should update profile with auth', () => {
        return request(app.getHttpServer())
          .put('/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'Senior Developer',
            bio: 'Updated bio',
          })
          .expect(200);
      });

      it('should fail without auth', () => {
        return request(app.getHttpServer())
          .put('/profile')
          .send({
            title: 'Senior Developer',
          })
          .expect(401);
      });
    });
  });

  describe('Projects API', () => {
    let authToken: string;

    beforeAll(async () => {
      const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
        email: 'test@example.com',
        password: 'SecurePass123',
      });
      authToken = loginResponse.body.access_token;
    });

    describe('GET /projects', () => {
      it('should return projects with auth', () => {
        return request(app.getHttpServer())
          .get('/projects')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('data');
            expect(res.body).toHaveProperty('total');
            expect(res.body).toHaveProperty('page');
          });
      });

      it('should support pagination', () => {
        return request(app.getHttpServer())
          .get('/projects?page=1&limit=5')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.page).toBe(1);
            expect(res.body.limit).toBe(5);
          });
      });
    });

    describe('POST /projects', () => {
      it('should create project with auth', () => {
        return request(app.getHttpServer())
          .post('/projects')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'Test Project',
            description: 'Test description',
            technologies: ['React', 'Node.js'],
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body.title).toBe('Test Project');
          });
      });

      it('should fail without auth', () => {
        return request(app.getHttpServer())
          .post('/projects')
          .send({
            title: 'Test Project',
          })
          .expect(401);
      });
    });
  });

  describe('Analytics API', () => {
    let authToken: string;

    beforeAll(async () => {
      const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
        email: 'test@example.com',
        password: 'SecurePass123',
      });
      authToken = loginResponse.body.access_token;
    });

    describe('POST /analytics/track', () => {
      it('should track event with auth', () => {
        return request(app.getHttpServer())
          .post('/analytics/track')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            eventType: 'click',
            page: '/profile',
            element: 'save-button',
          })
          .expect(201);
      });
    });

    describe('GET /analytics/dashboard', () => {
      it('should return dashboard analytics with auth', () => {
        return request(app.getHttpServer())
          .get('/analytics/dashboard')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('behavior');
            expect(res.body).toHaveProperty('sessions');
          });
      });
    });
  });
});
