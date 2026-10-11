export interface CalendarItem {
  id: number;
  shift: 'morning' | 'afternoon' | 'evening' | string;
  shift_name: string;
  shift_hours: string;
  calendar_url: string;
  description: string;
  instructor_notes?: string;
  color_code?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface ResourceItem {
  id: number;
  title: string;
  description: string;
  url: string;
  category: string;
  badge?: string;
  icon_name?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface RoadmapItem {
  id: number;
  title: string;
  description: string;
  sheet_url: string;
  faculty: string;
  tags?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface SocialItem {
  id: number;
  platform: string;
  name: string;
  description?: string;
  url: string;
  badge?: string;
  icon_name?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    username: string;
    role: string;
  } | null;
}
