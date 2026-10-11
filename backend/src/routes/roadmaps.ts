import { Router, Request, Response } from 'express';
import { pool, isPgConnected, fallbackStore } from '../db';
import { authenticateAdmin, authenticateUser } from '../middleware/auth';

const router = Router();

// Authenticated: Get all active roadmaps & google sheet documents
router.get('/', authenticateUser, async (_req: Request, res: Response) => {
  try {
    if (isPgConnected) {
      const result = await pool.query(
        'SELECT * FROM roadmaps WHERE is_active = true ORDER BY sort_order ASC, id ASC'
      );
      res.json(result.rows);
    } else {
      const rows = fallbackStore.roadmaps
        .filter((r) => r.is_active)
        .sort((a, b) => a.sort_order - b.sort_order);
      res.json(rows);
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Yol xəritələrini yükləmək mümkün olmadı', error: error.message });
  }
});

// Admin: Get all roadmaps
router.get('/admin/all', authenticateAdmin, async (_req: Request, res: Response) => {
  try {
    if (isPgConnected) {
      const result = await pool.query('SELECT * FROM roadmaps ORDER BY sort_order ASC, id ASC');
      res.json(result.rows);
    } else {
      res.json(fallbackStore.roadmaps.sort((a, b) => a.sort_order - b.sort_order));
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Məlumatları almaq alınmadı', error: error.message });
  }
});

// Admin: Create roadmap
router.post('/', authenticateAdmin, async (req: Request, res: Response) => {
  const { title, description, sheet_url, faculty, tags, sort_order, is_active } = req.body;

  if (!title || !description || !sheet_url) {
    res.status(400).json({ message: 'Başlıq, təsvir və Google Sheet linki mütləqdir' });
    return;
  }

  try {
    if (isPgConnected) {
      const result = await pool.query(
        `INSERT INTO roadmaps (title, description, sheet_url, faculty, tags, sort_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [title, description, sheet_url, faculty || 'Ümumi', tags || '', sort_order || 0, is_active !== false]
      );
      res.status(201).json(result.rows[0]);
    } else {
      const newRoadmap = {
        id: Date.now(),
        title,
        description,
        sheet_url,
        faculty: faculty || 'Ümumi',
        tags: tags || '',
        sort_order: sort_order || 0,
        is_active: is_active !== false,
        created_at: new Date().toISOString(),
      };
      fallbackStore.roadmaps.push(newRoadmap);
      res.status(201).json(newRoadmap);
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Yol xəritəsi əlavə edilərkən xəta baş verdi', error: error.message });
  }
});

// Admin: Update roadmap
router.put('/:id', authenticateAdmin, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const { title, description, sheet_url, faculty, tags, sort_order, is_active } = req.body;

  try {
    if (isPgConnected) {
      const result = await pool.query(
        `UPDATE roadmaps
         SET title = $1, description = $2, sheet_url = $3, faculty = $4, tags = $5,
             sort_order = $6, is_active = $7, updated_at = CURRENT_TIMESTAMP
         WHERE id = $8 RETURNING *`,
        [title, description, sheet_url, faculty, tags, sort_order, is_active, id]
      );
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Yol xəritəsi tapılmadı' });
        return;
      }
      res.json(result.rows[0]);
    } else {
      const index = fallbackStore.roadmaps.findIndex((r) => r.id === id);
      if (index === -1) {
        res.status(404).json({ message: 'Yol xəritəsi tapılmadı' });
        return;
      }
      fallbackStore.roadmaps[index] = {
        ...fallbackStore.roadmaps[index],
        title,
        description,
        sheet_url,
        faculty,
        tags,
        sort_order,
        is_active,
        updated_at: new Date().toISOString(),
      };
      res.json(fallbackStore.roadmaps[index]);
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Yenilənmə zamanı xəta', error: error.message });
  }
});

// Admin: Delete roadmap
router.delete('/:id', authenticateAdmin, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);

  try {
    if (isPgConnected) {
      const result = await pool.query('DELETE FROM roadmaps WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Yol xəritəsi tapılmadı' });
        return;
      }
      res.json({ message: 'Yol xəritəsi uğurla silindi', id });
    } else {
      const index = fallbackStore.roadmaps.findIndex((r) => r.id === id);
      if (index === -1) {
        res.status(404).json({ message: 'Yol xəritəsi tapılmadı' });
        return;
      }
      fallbackStore.roadmaps.splice(index, 1);
      res.json({ message: 'Yol xəritəsi uğurla silindi', id });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Silinmə zamanı xəta', error: error.message });
  }
});

export default router;
