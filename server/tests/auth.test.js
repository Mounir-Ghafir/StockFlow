const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const connectDatabase = require('../src/config/db');
const User = require('../src/models/User');
const requireRole = require('../src/middleware/roleCheck');

describe('authentication flow', () => {
  const email = `employee-${Date.now()}@example.com`;
  let token;

  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await User.deleteMany({ email });
    await mongoose.disconnect();
  });

  test('registers an employee with a hashed password', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test Employee', email, password: 'password123', role: 'Admin' });

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({ email, role: 'Employee' });
    expect(response.body.token).toEqual(expect.any(String));

    const user = await User.findOne({ email }).select('+passwordHash');
    expect(user.passwordHash).not.toBe('password123');
    expect(user.passwordHash).toHaveLength(60);
  });

  test('rejects invalid login credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'wrong-password' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: { message: 'Invalid email or password' } });
  });

  test('logs in and returns the authenticated user from the token', async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'password123' });

    expect(loginResponse.status).toBe(200);
    token = loginResponse.body.token;
    expect(jwt.verify(token, process.env.JWT_SECRET).sub).toBeTruthy();

    const meResponse = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.user).toMatchObject({ email, role: 'Employee' });
    expect(meResponse.body.user.passwordHash).toBeUndefined();
  });

  test('rejects missing and invalid tokens', async () => {
    const missingToken = await request(app).get('/api/auth/me');
    const invalidToken = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid-token');

    expect(missingToken.status).toBe(401);
    expect(invalidToken.status).toBe(401);
  });

  test('role middleware blocks unauthorized users', () => {
    const next = jest.fn();
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    requireRole('Admin')({ user: { role: 'Employee' } }, response, next);

    expect(response.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
