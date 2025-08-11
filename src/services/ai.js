const OpenAI = require('openai');

// Initialize OpenAI client only if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

// List of common job-related keywords and skills for better parsing
const COMMON_SKILLS = [
  'javascript', 'python', 'java', 'react', 'node.js', 'sql',
  'project management', 'leadership', 'communication', 'agile',
  'marketing', 'sales', 'research', 'analysis', 'design'
];

const AI_PROMPTS = {
  JOB_ANALYSIS: `Analyze this job description and extract:
1. Required skills and technologies
2. Years of experience required
3. Key responsibilities
4. Required qualifications
5. Preferred qualifications
6. Soft skills mentioned
Format as structured JSON.`,

  STAR_QUESTIONS: `Based on these job requirements, generate 5 STAR 
(Situation, Task, Action, Result) interview questions that will help gather 
relevant experience for the resume.`,

  RESUME_OPTIMIZATION: `Using the provided experience and job requirements, 
create ATS-optimized content that maintains a natural, professional tone 
while incorporating key terms and achievements.`
};

const aiService = {
  // Parse job description
  async parseJobDescription(jobDescription) {
    try {
      if (!openai) {
        throw new Error('OpenAI API key not configured');
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert ATS and job requirements analyzer."
          },
          {
            role: "user",
            content: AI_PROMPTS.JOB_ANALYSIS + "\n\n" + jobDescription
          }
        ],
        temperature: 0.2
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI Job parsing error:', error);
      throw new Error('Failed to parse job description');
    }
  },

  // Generate STAR questions
  async generateQuestions(jobRequirements) {
    try {
      if (!openai) {
        throw new Error('OpenAI API key not configured');
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert career coach specializing in STAR interview techniques."
          },
          {
            role: "user",
            content: AI_PROMPTS.STAR_QUESTIONS + "\n\n" + JSON.stringify(jobRequirements)
          }
        ],
        temperature: 0.7
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI Question generation error:', error);
      throw new Error('Failed to generate interview questions');
    }
  },

  // Optimize resume content
  async optimizeContent(experience, jobRequirements) {
    try {
      if (!openai) {
        throw new Error('OpenAI API key not configured');
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert resume writer focusing on ATS optimization."
          },
          {
            role: "user",
            content: AI_PROMPTS.RESUME_OPTIMIZATION + "\n\nJob Requirements:\n" +
                    JSON.stringify(jobRequirements) + "\n\nExperience:\n" +
                    JSON.stringify(experience)
          }
        ],
        temperature: 0.5
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI Content optimization error:', error);
      throw new Error('Failed to optimize resume content');
    }
  }
};

module.exports = aiService;
