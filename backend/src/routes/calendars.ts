import { Router, Request, Response } from 'express';
import { pool, isPgConnected, fallbackStore } from '../db';
import { authenticateAdmin, authenticateUser } from '../middleware/auth';

const router = Router();

// Authenticated: Get all active calendars (ordered)
router.get('/', authenticateUser, async (_req: Request, res: Response) => {
  try {
    if (isPgConnected) {
      const result = await pool.query(
        'SELECT * FROM calendars WHERE is_active = true ORDER BY sort_order ASC, id ASC'
      );
      res.json(result.rows);
    } else {
      const rows = fallbackStore.calendars
        .filter((c) => c.is_active)
        .sort((a, b) => a.sort_order - b.sort_order);
      res.json(rows);
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Təqvimləri yükləmək mümkün olmadı', error: error.message });
  }
});

// Admin: Get all calendars including inactive
router.get('/admin/all', authenticateAdmin, async (_req: Request, res: Response) => {
  try {
    if (isPgConnected) {
      const result = await pool.query('SELECT * FROM calendars ORDER BY sort_order ASC, id ASC');
      res.json(result.rows);
    } else {
      res.json(fallbackStore.calendars.sort((a, b) => a.sort_order - b.sort_order));
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Məlumatları almaq alınmadı', error: error.message });
  }
});

// Admin: Create calendar
router.post('/', authenticateAdmin, async (req: Request, res: Response) => {
  const { shift, shift_name, shift_hours, calendar_url, description, instructor_notes, color_code, sort_order, is_active } = req.body;

  if (!shift || !shift_name || !calendar_url) {
    res.status(400).json({ message: 'Növbə, ad və təqvim linki mütləqdir' });
    return;
  }

  try {
    if (isPgConnected) {
      const result = await pool.query(
        `INSERT INTO calendars (shift, shift_name, shift_hours, calendar_url, description, instructor_notes, color_code, sort_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [shift, shift_name, shift_hours || '', calendar_url, description || '', instructor_notes || '', color_code || '#009966', sort_order || 0, is_active !== false]
      );
      res.status(201).json(result.rows[0]);
    } else {
      const newCal = {
        id: Date.now(),
        shift,
        shift_name,
        shift_hours: shift_hours || '',
        calendar_url,
        description: description || '',
        instructor_notes: instructor_notes || '',
        color_code: color_code || '#009966',
        sort_order: sort_order || 0,
        is_active: is_active !== false,
        created_at: new Date().toISOString(),
      };
      fallbackStore.calendars.push(newCal);
      res.status(201).json(newCal);
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Təqvim əlavə edilərkən xəta baş verdi', error: error.message });
  }
});

// Admin: Update calendar
router.put('/:id', authenticateAdmin, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const { shift, shift_name, shift_hours, calendar_url, description, instructor_notes, color_code, sort_order, is_active } = req.body;

  try {
    if (isPgConnected) {
      const result = await pool.query(
        `UPDATE calendars
         SET shift = $1, shift_name = $2, shift_hours = $3, calendar_url = $4, description = $5,
             instructor_notes = $6, color_code = $7, sort_order = $8, is_active = $9, updated_at = CURRENT_TIMESTAMP
         WHERE id = $10 RETURNING *`,
        [shift, shift_name, shift_hours, calendar_url, description, instructor_notes, color_code, sort_order, is_active, id]
      );
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Təqvim tapılmadı' });
        return;
      }
      res.json(result.rows[0]);
    } else {
      const index = fallbackStore.calendars.findIndex((c) => c.id === id);
      if (index === -1) {
        res.status(404).json({ message: 'Təqvim tapılmadı' });
        return;
      }
      fallbackStore.calendars[index] = {
        ...fallbackStore.calendars[index],
        shift,
        shift_name,
        shift_hours,
        calendar_url,
        description,
        instructor_notes,
        color_code,
        sort_order,
        is_active,
        updated_at: new Date().toISOString(),
      };
      res.json(fallbackStore.calendars[index]);
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Yenilənmə zamanı xəta', error: error.message });
  }
});

// Admin: Delete calendar
router.delete('/:id', authenticateAdmin, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);

  try {
    if (isPgConnected) {
      const result = await pool.query('DELETE FROM calendars WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Təqvim tapılmadı' });
        return;
      }
      res.json({ message: 'Təqvim uğurla silindi', id });
    } else {
      const index = fallbackStore.calendars.findIndex((c) => c.id === id);
      if (index === -1) {
        res.status(404).json({ message: 'Təqvim tapılmadı' });
        return;
      }
      fallbackStore.calendars.splice(index, 1);
      res.json({ message: 'Təqvim uğurla silindi', id });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Silinmə zamanı xəta', error: error.message });
  }
});

export default router;
