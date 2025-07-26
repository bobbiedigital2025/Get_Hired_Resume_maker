const request = require('supertest');
const app = require('../src/server');
const { generateTestToken } = require('./setup');

describe('Job Analysis Routes', () => {
  const userId = '507f1f77bcf86cd799439011';
  let token;

  beforeEach(() => {
    token = generateTestToken(userId);
  });

  describe('POST /api/jobs/analyze', () => {
    it('should analyze job description', async () => {
      const response = await request(app)
        .post('/api/jobs/analyze')
        .set('Authorization', `Bearer ${token}`)
        .send({
          jobDescription: `
            Senior Software Engineer
            Requirements:
            - 5+ years of JavaScript experience
            - Node.js and Express expertise
            - Strong problem-solving skills
          `
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('analysis');
      expect(response.body).toHaveProperty('questions');
    });
  });

  describe('POST /api/jobs/optimize', () => {
    it('should optimize resume content', async () => {
      const response = await request(app)
        .post('/api/jobs/optimize')
        .set('Authorization', `Bearer ${token}`)
        .send({
          resumeId: '507f1f77bcf86cd799439012',
          section: 'summary'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('optimizedContent');
    });
  });
});
