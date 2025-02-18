import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const JWT_SECRET = process.env.JWT_SECRET || '';

if (!CLIENT_ID || !JWT_SECRET) {
  console.error("Missing GOOGLE_CLIENT_ID or JWT_SECRET environment variables");
  process.exit(1);
}

const client = new OAuth2Client(CLIENT_ID);

router.post('/google', async (req, res) => {
  const { token } = req.body;

  try {
    // Decode token before verification
    const decoded = jwt.decode(token, { complete: true }) as jwt.JwtPayload;
    console.log("Decoded Token:", decoded);

    if (!decoded?.payload) throw new Error("Invalid token structure");
    if (decoded.payload.aud !== CLIENT_ID) {
      throw new Error(`Token audience mismatch. Expected: ${CLIENT_ID}, Got: ${decoded.payload.aud}`);
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error('No payload returned');

    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = new User({ googleId: sub, email, name, picture });
      await user.save();
    }

    const jwtToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token: jwtToken, user });
  } catch (error: unknown) {
    console.error("Error verifying Google token:", error);
    const errorMessage = error instanceof Error ? error.message : 'Invalid Google token';
    res.status(401).json({ error: errorMessage });
  }
});

export default router;