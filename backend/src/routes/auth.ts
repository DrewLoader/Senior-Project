import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { getUsersCollection } from '../database';
import { RequestWithUser } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mealmate-dev-secret-change-in-production';
const SALT_ROUNDS = 10;

const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const users = getUsersCollection();

    const existing = await users.findOne({ email: data.email });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
    const result = await users.insertOne({
      email: data.email,
      password_hash: passwordHash,
      name: data.name,
      created_at: new Date(),
    });

    const userId = result.insertedId.toString();
    const token = jwt.sign(
      { userId, email: data.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: { id: userId, email: data.email, name: data.name },
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: e.errors[0]?.message ?? 'Invalid input',
        details: e.errors,
      });
    }
    console.error('Register error:', e);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    const users = getUsersCollection();

    const user = await users.findOne({ email: data.email });
    if (!user?.password_hash) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(data.password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const userId = user._id!.toString();
    const token = jwt.sign(
      { userId, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: userId,
        email: user.email,
        name: user.name || user.email.split('@')[0],
      },
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: e.errors[0]?.message ?? 'Invalid input',
      });
    }
    console.error('Login error:', e);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

router.get('/me', async (req: Request, res: Response) => {
  const r = req as RequestWithUser;
  if (!r.user) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }
  const users = getUsersCollection();
  const row = await users.findOne({ _id: new ObjectId(r.user.userId) });
  if (!row) {
    return res.status(401).json({ success: false, error: 'User not found' });
  }
  res.json({
    success: true,
    user: {
      id: row._id!.toString(),
      email: row.email,
      name: row.name || row.email.split('@')[0],
    },
  });
});

export { router as authRouter };