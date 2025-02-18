import express from 'express';
import jwt from 'jsonwebtoken';
import CalculatorHistory from '../models/CalculatorHistory';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "";

// Middleware to authenticate using JWT
const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err: jwt.VerifyErrors | null, decoded: any) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};

router.get('/history', authenticate, async (req: any, res) => {
  try {
    const histories = await CalculatorHistory.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(histories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

router.post('/history', authenticate, async (req: any, res) => {
  const { expression, result } = req.body;
  try {
    const history = new CalculatorHistory({ user: req.userId, expression, result });
    await history.save();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save history' });
  }
});

export default router;