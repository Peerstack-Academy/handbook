import { Router, Request, Response } from 'express';
import { pool, isPgConnected, fallbackStore } from '../db';
import { authenticateAdmin, authenticateUser } from '../middleware/auth';

const router = Router();

// Authenticated: Get all active useful student resources
router.get('/', authenticateUser, async (_req: Request, res: Response) => {
  try {
    if (isPgConnected) {
      const result = await pool.query(
        'SELECT * FROM useful_resources WHERE is_active = true ORDER BY sort_order ASC, id ASC'
      );
      res.json(result.rows);
    } else {
      const rows = fallbackStore.resources
        .filter((r) => r.is_active)
        .sort((a, b) => a.sort_order - b.sort_order);
      res.json(rows);
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Resursları yükləmək mümkün olmadı', error: error.message });
  }
});

// Admin: Get all resources including inactive
router.get('/admin/all', authenticateAdmin, async (_req: Request, res: Response) => {
  try {
    if (isPgConnected) {
      const result = await pool.query('SELECT * FROM useful_resources ORDER BY sort_order ASC, id ASC');
      res.json(result.rows);
    } else {
      res.json(fallbackStore.resources.sort((a, b) => a.sort_order - b.sort_order));
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Məlumatları almaq alınmadı', error: error.message });
  }
});

// Admin: Create resource
router.post('/', authenticateAdmin, async (req: Request, res: Response) => {
  const { title, description, url, category, badge, icon_name, sort_order, is_active } = req.body;

  if (!title || !description || !url) {
    res.status(400).json({ message: 'Başlıq, təsvir və URL mütləqdir' });
    return;
  }

  try {
    if (isPgConnected) {
      const result = await pool.query(
        `INSERT INTO useful_resources (title, description, url, category, badge, icon_name, sort_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [title, description, url, category || 'Portal', badge || '', icon_name || 'Globe', sort_order || 0, is_active !== false]
      );
      res.status(201).json(result.rows[0]);
    } else {
      const newRes = {
        id: Date.now(),
        title,
        description,
        url,
        category: category || 'Portal',
        badge: badge || '',
        icon_name: icon_name || 'Globe',
        sort_order: sort_order || 0,
        is_active: is_active !== false,
        created_at: new Date().toISOString(),
      };
      fallbackStore.resources.push(newRes);
      res.status(201).json(newRes);
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Resurs əlavə edilərkən xəta baş verdi', error: error.message });
  }
});

// Admin: Update resource
router.put('/:id', authenticateAdmin, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const { title, description, url, category, badge, icon_name, sort_order, is_active } = req.body;

  try {
    if (isPgConnected) {
      const result = await pool.query(
        `UPDATE useful_resources
         SET title = $1, description = $2, url = $3, category = $4, badge = $5,
             icon_name = $6, sort_order = $7, is_active = $8, updated_at = CURRENT_TIMESTAMP
         WHERE id = $9 RETURNING *`,
        [title, description, url, category, badge, icon_name, sort_order, is_active, id]
      );
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Resurs tapılmadı' });
        return;
      }
      res.json(result.rows[0]);
    } else {
      const index = fallbackStore.resources.findIndex((r) => r.id === id);
      if (index === -1) {
        res.status(404).json({ message: 'Resurs tapılmadı' });
        return;
      }
      fallbackStore.resources[index] = {
        ...fallbackStore.resources[index],
        title,
        description,
        url,
        category,
        badge,
        icon_name,
        sort_order,
        is_active,
        updated_at: new Date().toISOString(),
      };
      res.json(fallbackStore.resources[index]);
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Yenilənmə zamanı xəta', error: error.message });
  }
});

// Admin: Delete resource
router.delete('/:id', authenticateAdmin, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);

  try {
    if (isPgConnected) {
      const result = await pool.query('DELETE FROM useful_resources WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Resurs tapılmadı' });
        return;
      }
      res.json({ message: 'Resurs uğurla silindi', id });
    } else {
      const index = fallbackStore.resources.findIndex((r) => r.id === id);
      if (index === -1) {
        res.status(404).json({ message: 'Resurs tapılmadı' });
        return;
      }
      fallbackStore.resources.splice(index, 1);
      res.json({ message: 'Resurs uğurla silindi', id });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Silinmə zamanı xəta', error: error.message });
  }
});

export default router;
