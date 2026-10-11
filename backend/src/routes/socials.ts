import { Router, Request, Response } from 'express';
import { pool, isPgConnected, fallbackStore } from '../db';
import { authenticateAdmin, authenticateUser } from '../middleware/auth';

const router = Router();

// Authenticated: Get all active social & community links
router.get('/', authenticateUser, async (_req: Request, res: Response) => {
  try {
    if (isPgConnected) {
      const result = await pool.query(
        'SELECT * FROM social_links WHERE is_active = true ORDER BY sort_order ASC, id ASC'
      );
      res.json(result.rows);
    } else {
      const rows = fallbackStore.socials
        .filter((s) => s.is_active)
        .sort((a, b) => a.sort_order - b.sort_order);
      res.json(rows);
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Sosial linkləri yükləmək mümkün olmadı', error: error.message });
  }
});

// Admin: Get all social links
router.get('/admin/all', authenticateAdmin, async (_req: Request, res: Response) => {
  try {
    if (isPgConnected) {
      const result = await pool.query('SELECT * FROM social_links ORDER BY sort_order ASC, id ASC');
      res.json(result.rows);
    } else {
      res.json(fallbackStore.socials.sort((a, b) => a.sort_order - b.sort_order));
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Məlumatları almaq alınmadı', error: error.message });
  }
});

// Admin: Create social link
router.post('/', authenticateAdmin, async (req: Request, res: Response) => {
  const { platform, name, description, url, badge, icon_name, sort_order, is_active } = req.body;

  if (!platform || !name || !url) {
    res.status(400).json({ message: 'Platforma, ad və keçid linki mütləqdir' });
    return;
  }

  try {
    if (isPgConnected) {
      const result = await pool.query(
        `INSERT INTO social_links (platform, name, description, url, badge, icon_name, sort_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [platform, name, description || '', url, badge || '', icon_name || 'Share2', sort_order || 0, is_active !== false]
      );
      res.status(201).json(result.rows[0]);
    } else {
      const newSocial = {
        id: Date.now(),
        platform,
        name,
        description: description || '',
        url,
        badge: badge || '',
        icon_name: icon_name || 'Share2',
        sort_order: sort_order || 0,
        is_active: is_active !== false,
        created_at: new Date().toISOString(),
      };
      fallbackStore.socials.push(newSocial);
      res.status(201).json(newSocial);
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Sosial link əlavə edilərkən xəta baş verdi', error: error.message });
  }
});

// Admin: Update social link
router.put('/:id', authenticateAdmin, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const { platform, name, description, url, badge, icon_name, sort_order, is_active } = req.body;

  try {
    if (isPgConnected) {
      const result = await pool.query(
        `UPDATE social_links
         SET platform = $1, name = $2, description = $3, url = $4, badge = $5,
             icon_name = $6, sort_order = $7, is_active = $8, updated_at = CURRENT_TIMESTAMP
         WHERE id = $9 RETURNING *`,
        [platform, name, description, url, badge, icon_name, sort_order, is_active, id]
      );
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Sosial link tapılmadı' });
        return;
      }
      res.json(result.rows[0]);
    } else {
      const index = fallbackStore.socials.findIndex((s) => s.id === id);
      if (index === -1) {
        res.status(404).json({ message: 'Sosial link tapılmadı' });
        return;
      }
      fallbackStore.socials[index] = {
        ...fallbackStore.socials[index],
        platform,
        name,
        description,
        url,
        badge,
        icon_name,
        sort_order,
        is_active,
        updated_at: new Date().toISOString(),
      };
      res.json(fallbackStore.socials[index]);
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Yenilənmə zamanı xəta', error: error.message });
  }
});

// Admin: Delete social link
router.delete('/:id', authenticateAdmin, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);

  try {
    if (isPgConnected) {
      const result = await pool.query('DELETE FROM social_links WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Sosial link tapılmadı' });
        return;
      }
      res.json({ message: 'Sosial link uğurla silindi', id });
    } else {
      const index = fallbackStore.socials.findIndex((s) => s.id === id);
      if (index === -1) {
        res.status(404).json({ message: 'Sosial link tapılmadı' });
        return;
      }
      fallbackStore.socials.splice(index, 1);
      res.json({ message: 'Sosial link uğurla silindi', id });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Silinmə zamanı xəta', error: error.message });
  }
});

export default router;
