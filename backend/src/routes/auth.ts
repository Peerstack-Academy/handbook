import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool, isPgConnected } from '../db';
import { JWT_SECRET, COOKIE_NAME, authenticateAdmin, authenticateUser, AuthRequest } from '../middleware/auth';

const router = Router();

// Helper to set httpOnly cookie
function setAuthCookie(res: Response, token: string, maxAgeMs: number) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: maxAgeMs,
    path: '/',
  });
}

// Unified Login: Sets httpOnly cookie
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'İstifadəçi adı və şifrə daxil edilməlidir' });
    return;
  }

  try {
    // 1. Check if it's an Admin/Staff user
    let isAdminValid = false;
    let adminRole = 'staff';

    if (isPgConnected) {
      const result = await pool.query('SELECT * FROM admin_users WHERE username = $1', [username]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        isAdminValid = await bcrypt.compare(password, user.password_hash);
        adminRole = user.role;
      }
    } else {
      // Fallback in-memory/env check for admin
      const defaultAdminUser = process.env.ADMIN_DEFAULT_USER || 'admin';
      const defaultAdminPass = process.env.ADMIN_DEFAULT_PASSWORD || 'peerstack2026';
      if (username === defaultAdminUser && password === defaultAdminPass) {
        isAdminValid = true;
        adminRole = 'superadmin';
      }
    }

    if (isAdminValid) {
      const expiresInMs = 7 * 24 * 60 * 60 * 1000; // 7 days
      const token = jwt.sign({ username, role: adminRole }, JWT_SECRET, { expiresIn: '7d' });
      setAuthCookie(res, token, expiresInMs);
      res.json({
        message: 'Uğurla daxil oldunuz',
        user: { username, role: adminRole },
      });
      return;
    }

    // 2. Check if it's a Student user
    let isStudentValid = false;

    if (isPgConnected) {
      const studentResult = await pool.query('SELECT * FROM student_users WHERE username = $1', [username]);
      if (studentResult.rows.length > 0) {
        const sUser = studentResult.rows[0];
        isStudentValid = await bcrypt.compare(password, sUser.password_hash);
      }
    }

    // Check default student credentials
    const studentUser = process.env.STUDENT_DEFAULT_USER || 'student';
    const studentPass = process.env.STUDENT_DEFAULT_PASSWORD || 'student2026';
    if (!isStudentValid && username === studentUser && password === studentPass) {
      isStudentValid = true;
    }

    if (isStudentValid) {
      const expiresInMs = 30 * 24 * 60 * 60 * 1000; // 30 days
      const token = jwt.sign({ username, role: 'student' }, JWT_SECRET, { expiresIn: '30d' });
      setAuthCookie(res, token, expiresInMs);
      res.json({
        message: 'Uğurla daxil oldunuz',
        user: { username, role: 'student' },
      });
      return;
    }

    // If neither matches:
    res.status(401).json({ message: 'İstifadəçi adı və ya şifrə yanlışdır' });
  } catch (error: any) {
    res.status(500).json({ message: 'Giriş zamanı xəta baş verdi', error: error.message });
  }
});

// Logout: Clear httpOnly cookie
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  res.json({ message: 'Uğurla çıxış edildi' });
});

// Verify token / get current session (any authenticated user)
router.get('/verify', authenticateUser, (req: AuthRequest, res: Response) => {
  res.json({
    valid: true,
    user: req.user,
  });
});

// Change admin password (staff only)
router.post('/change-password', authenticateAdmin, async (req: AuthRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const username = req.user?.username;

  if (!oldPassword || !newPassword) {
    res.status(400).json({ message: 'Köhnə və yeni şifrə tələb olunur' });
    return;
  }

  try {
    if (!isPgConnected) {
      res.status(400).json({ message: 'Şifrə dəyişmək üçün verilənlər bazası qoşulu olmalıdır' });
      return;
    }

    const result = await pool.query('SELECT * FROM admin_users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'İstifadəçi tapılmadı' });
      return;
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isValid) {
      res.status(401).json({ message: 'Köhnə şifrə yanlışdır' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);
    await pool.query('UPDATE admin_users SET password_hash = $1 WHERE username = $2', [newHash, username]);

    res.json({ message: 'Şifrə uğurla yeniləndi' });
  } catch (error: any) {
    res.status(500).json({ message: 'Xəta baş verdi', error: error.message });
  }
});

export default router;
