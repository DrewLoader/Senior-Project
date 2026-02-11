import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mealmate-dev-secret-change-in-production';

export interface AuthPayload {
  userId: string;
  email: string;
}

export interface RequestWithUser extends Request {
  user?: AuthPayload;
}

export function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = decoded;
  } catch (_) {}
  next();
}

export function requireAuth(req: RequestWithUser, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }
  next();
}
