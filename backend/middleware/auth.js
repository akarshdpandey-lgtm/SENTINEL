import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiKeyValidator = (req, res, next) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }
  next();
};

export const requestValidator = (req, res, next) => {
  if (req.body.description && req.body.description.length > 5000) {
    return res.status(400).json({ error: 'Description too long' });
  }
  next();
};
