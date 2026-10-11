import { CalendarItem, ResourceItem, RoadmapItem, SocialItem } from './types';

const API_BASE = '/api';

export const api = {
  // Public (for logged in students/admin): Data endpoints
  getCalendars: async (): Promise<CalendarItem[]> => {
    const res = await fetch(`${API_BASE}/calendars`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Təqvimlər yüklənmədi');
    return res.json();
  },
  getResources: async (): Promise<ResourceItem[]> => {
    const res = await fetch(`${API_BASE}/resources`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Resurslar yüklənmədi');
    return res.json();
  },
  getRoadmaps: async (): Promise<RoadmapItem[]> => {
    const res = await fetch(`${API_BASE}/roadmaps`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Yol xəritələri yüklənmədi');
    return res.json();
  },
  getSocials: async (): Promise<SocialItem[]> => {
    const res = await fetch(`${API_BASE}/socials`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Sosial linklər yüklənmədi');
    return res.json();
  },

  // Auth: uses httpOnly cookie
  login: async (username: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Giriş uğursuz oldu');
    return data;
  },

  logout: async () => {
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return res.json();
  },

  verifyAuth: async () => {
    const res = await fetch(`${API_BASE}/auth/verify`, {
      credentials: 'include',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  },

  // Admin: Calendars
  adminGetCalendars: async (): Promise<CalendarItem[]> => {
    const res = await fetch(`${API_BASE}/calendars/admin/all`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Məlumatlar alına bilmədi');
    return res.json();
  },
  createCalendar: async (cal: Partial<CalendarItem>): Promise<CalendarItem> => {
    const res = await fetch(`${API_BASE}/calendars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(cal),
    });
    if (!res.ok) throw new Error('Təqvim yaradıla bilmədi');
    return res.json();
  },
  updateCalendar: async (id: number, cal: Partial<CalendarItem>): Promise<CalendarItem> => {
    const res = await fetch(`${API_BASE}/calendars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(cal),
    });
    if (!res.ok) throw new Error('Təqvim yenilənmədi');
    return res.json();
  },
  deleteCalendar: async (id: number) => {
    const res = await fetch(`${API_BASE}/calendars/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Təqvim silinmədi');
    return res.json();
  },

  // Admin: Resources
  adminGetResources: async (): Promise<ResourceItem[]> => {
    const res = await fetch(`${API_BASE}/resources/admin/all`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Resurslar alına bilmədi');
    return res.json();
  },
  createResource: async (resItem: Partial<ResourceItem>): Promise<ResourceItem> => {
    const res = await fetch(`${API_BASE}/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(resItem),
    });
    if (!res.ok) throw new Error('Resurs yaradıla bilmədi');
    return res.json();
  },
  updateResource: async (id: number, resItem: Partial<ResourceItem>): Promise<ResourceItem> => {
    const res = await fetch(`${API_BASE}/resources/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(resItem),
    });
    if (!res.ok) throw new Error('Resurs yenilənmədi');
    return res.json();
  },
  deleteResource: async (id: number) => {
    const res = await fetch(`${API_BASE}/resources/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Resurs silinmədi');
    return res.json();
  },

  // Admin: Roadmaps
  adminGetRoadmaps: async (): Promise<RoadmapItem[]> => {
    const res = await fetch(`${API_BASE}/roadmaps/admin/all`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Yol xəritələri alına bilmədi');
    return res.json();
  },
  createRoadmap: async (item: Partial<RoadmapItem>): Promise<RoadmapItem> => {
    const res = await fetch(`${API_BASE}/roadmaps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Yol xəritəsi yaradıla bilmədi');
    return res.json();
  },
  updateRoadmap: async (id: number, item: Partial<RoadmapItem>): Promise<RoadmapItem> => {
    const res = await fetch(`${API_BASE}/roadmaps/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Yol xəritəsi yenilənmədi');
    return res.json();
  },
  deleteRoadmap: async (id: number) => {
    const res = await fetch(`${API_BASE}/roadmaps/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Yol xəritəsi silinmədi');
    return res.json();
  },

  // Admin: Socials
  adminGetSocials: async (): Promise<SocialItem[]> => {
    const res = await fetch(`${API_BASE}/socials/admin/all`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Sosial linklər alına bilmədi');
    return res.json();
  },
  createSocial: async (item: Partial<SocialItem>): Promise<SocialItem> => {
    const res = await fetch(`${API_BASE}/socials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Sosial link yaradıla bilmədi');
    return res.json();
  },
  updateSocial: async (id: number, item: Partial<SocialItem>): Promise<SocialItem> => {
    const res = await fetch(`${API_BASE}/socials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Sosial link yenilənmədi');
    return res.json();
  },
  deleteSocial: async (id: number) => {
    const res = await fetch(`${API_BASE}/socials/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Sosial link silinmədi');
    return res.json();
  },
};
