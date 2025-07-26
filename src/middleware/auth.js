const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.MCP_AUTH_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid authentication token' });
  }
};

// MCP A2A Authentication middleware
const mcpA2AMiddleware = async (req, res, next) => {
  try {
    const clientId = req.header('X-MCP-Client-ID');
    const clientSecret = req.header('X-MCP-Client-Secret');

    if (!clientId || !clientSecret) {
      return res.status(401).json({ error: 'MCP A2A credentials required' });
    }

    if (clientId !== process.env.MCP_AUTH_A2A_CLIENT_ID || 
        clientSecret !== process.env.MCP_AUTH_A2A_CLIENT_SECRET) {
      return res.status(401).json({ error: 'Invalid MCP A2A credentials' });
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'MCP A2A authentication failed' });
  }
};

module.exports = { authMiddleware, mcpA2AMiddleware };
