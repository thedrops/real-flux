const request = require('supertest');
const { app } = require('../server');
const db = require('../models');

describe('Authentication Tests', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Test@123'
  };

  beforeAll(async () => {
    await db.user.destroy({ where: {} });
  });

  test('Should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(testUser);
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully!');
  });

  test('Should not register duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(testUser);
    
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('Should login user', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  test('Should not login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });
    
    expect(res.statusCode).toBe(401);
  });
});
