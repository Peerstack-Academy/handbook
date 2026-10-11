import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'peerstack-super-secret-key-2026';
export const COOKIE_NAME = 'peerstack_auth_token';

export interface AuthRequest extends Request {
  user?: {
    username: string;
    role: string;
  };
}

// Extract token from httpOnly cookie or fallback to Authorization header
function extractToken(req: Request): string | null {
  if (req.cookies && req.cookies[COOKIE_NAME]) {
    return req.cookies[COOKIE_NAME];
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
}

// Middleware: Any logged-in user (student or admin)
export function authenticateUser(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({ message: 'Avtorizasiya tələb olunur. Giriş tokeni tapılmadı.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token etibarsızdır və ya vaxtı bitib.' });
    return;
  }
}

// Middleware: Only admin/superadmin users
export function authenticateAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({ message: 'Avtorizasiya tələb olunur. Giriş tokeni tapılmadı.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string; role: string };
    if (decoded.role !== 'admin' && decoded.role !== 'superadmin' && decoded.role !== 'staff') {
      res.status(403).json({ message: 'Bu əməliyyat yalnız admin istifadəçilər üçündür.' });
      return;
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token etibarsızdır və ya vaxtı bitib.' });
    return;
  }
}
