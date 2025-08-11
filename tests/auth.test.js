const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/server');
const User = require('../src/models/user');
const { generateTestToken } = require('./setup');

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User'
        });

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('token');
      expect(response.body.user).to.have.property('email', 'test@example.com');
    });

    it('should not register user with existing email', async () => {
      // Create initial user
      await User.create({
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Existing',
        lastName: 'User'
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User'
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error', 'Email already registered');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      });
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('token');
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error', 'Invalid credentials');
    });
  });
});
