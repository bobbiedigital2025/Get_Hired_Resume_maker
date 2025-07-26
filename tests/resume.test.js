const request = require('supertest');
const app = require('../src/server');
const Resume = require('../src/models/resume');
const { generateTestToken } = require('./setup');

describe('Resume Routes', () => {
  const userId = '507f1f77bcf86cd799439011';
  let token;

  beforeEach(() => {
    token = generateTestToken(userId);
  });

  describe('POST /api/resumes', () => {
    it('should create a new resume', async () => {
      const response = await request(app)
        .post('/api/resumes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          targetJobTitle: 'Software Engineer',
          targetCompany: 'Tech Corp',
          jobDescription: 'Test job description'
        });

      expect(response.status).toBe(201);
      expect(response.body.resume).toHaveProperty('targetJobTitle', 'Software Engineer');
    });
  });

  describe('GET /api/resumes', () => {
    beforeEach(async () => {
      await Resume.create({
        userId,
        targetJobTitle: 'Software Engineer',
        targetCompany: 'Tech Corp',
        jobDescription: 'Test job description',
        sections: {
          summary: 'Test summary',
          experience: [],
          education: [],
          skills: []
        }
      });
    });

    it('should get all resumes for user', async () => {
      const response = await request(app)
        .get('/api/resumes')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.resumes).toBeInstanceOf(Array);
      expect(response.body.resumes.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/resumes/:id', () => {
    let resumeId;

    beforeEach(async () => {
      const resume = await Resume.create({
        userId,
        targetJobTitle: 'Software Engineer',
        targetCompany: 'Tech Corp',
        jobDescription: 'Test job description',
        sections: {
          summary: 'Test summary',
          experience: [],
          education: [],
          skills: []
        }
      });
      resumeId = resume._id;
    });

    it('should update resume successfully', async () => {
      const response = await request(app)
        .put(`/api/resumes/${resumeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          targetJobTitle: 'Senior Software Engineer'
        });

      expect(response.status).toBe(200);
      expect(response.body.resume.targetJobTitle).toBe('Senior Software Engineer');
    });
  });
});
