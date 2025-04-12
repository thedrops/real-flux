const request = require('supertest');
const { app } = require('../server');
const db = require('../models');

describe('Transaction Tests', () => {
  let token;
  let userId;
  let transactionId;

  const testUser = {
    name: 'Transaction User',
    email: 'transaction@example.com',
    password: 'Test@123'
  };

  const testTransaction = {
    description: 'Test Transaction',
    amount: 1000.00,
    currency: 'BRL',
    exchange_rate: 1.0,
    transaction_type: 'income',
    transaction_date: '2025-04-11'
  };

  beforeAll(async () => {
    // Create test user and get token
    await db.user.destroy({ where: {} });
    await db.transaction.destroy({ where: {} });
    
    await request(app)
      .post('/api/auth/signup')
      .send(testUser);

    const loginRes = await request(app)
      .post('/api/auth/signin')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    token = loginRes.body.accessToken;
    userId = loginRes.body.id;
  });

  test('Should create new transaction', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send(testTransaction);

    expect(res.statusCode).toBe(201);
    expect(res.body.transaction).toHaveProperty('id');
    transactionId = res.body.transaction.id;
  });

  test('Should get all transactions', async () => {
    const res = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test('Should get transaction by id', async () => {
    const res = await request(app)
      .get(`/api/transactions/${transactionId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', transactionId);
  });

  test('Should update transaction', async () => {
    const updatedTransaction = {
      ...testTransaction,
      description: 'Updated Transaction'
    };

    const res = await request(app)
      .put(`/api/transactions/${transactionId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedTransaction);

    expect(res.statusCode).toBe(200);
  });

  test('Should delete transaction', async () => {
    const res = await request(app)
      .delete(`/api/transactions/${transactionId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});
