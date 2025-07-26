# MCP-Auth Resume Genius
The world’s most secure, AI-powered resume builder, optimized for ATS & human eyes.
This repository contains the backend API service for the MCP-Auth Resume Genius application. It handles user authentication, job description analysis, conversational Q&A, and AI-powered resume generation.
✨ Features
✅ Secure Authentication: All endpoints protected via MCP Auth & A2A authorization.
✅ Job Description Parser: Extracts keywords, skills, and requirements from any job post.
✅ Conversational Q&A Engine: Asks targeted, STAR-based questions to gather detailed user experience.
✅ AI-Powered Resume Generation: Synthesizes user data into a professional, human-sounding, ATS-optimized resume.
✅ Cloud-First Storage: All user profiles and resume data are stored securely in a cloud database.
🛠️ Tech Stack
Backend: Node.js
Framework: Express.js
Database: MongoDB (using Mongoose) / Supabase
Authentication: JSON Web Tokens (JWT) & bcryptjs
Environment Management: dotenv
🚀 Getting Started
Follow these instructions to get the project set up and running on your local machine for development and testing.
1. Prerequisites
Node.js (v18 or later recommended)
Git installed on your machine
A code editor like VS Code
2. Clone the Repository
Clone the project from your GitLab repository to your local machine.
git clone <your-gitlab-repository-url>
cd mcp-auth-resume-genius


3. Install Dependencies
Install all the necessary npm packages.
npm install


4. Set Up Environment Variables
Create a new file named .env in the root of your project folder. Copy the contents of .env.example (or add the following lines) and fill in your own secret values.
# Server Configuration
PORT=3000

# Database Connection (Choose one)
MONGO_URI=your_mongodb_connection_string
# SUPABASE_URL=your_supabase_project_url
# SUPABASE_KEY=your_supabase_anon_key

# Security
MCP_AUTH_SECRET=your_super_secret_key_for_jwt

# MCP Auth A2A Credentials
MCP_AUTH_A2A_CLIENT_ID=your_mcp_auth_client_id
MCP_AUTH_A2A_CLIENT_SECRET=your_mcp_auth_client_secret


5. Running the Application
Start the development server.
node index.js


The API should now be running at http://localhost:3000.
