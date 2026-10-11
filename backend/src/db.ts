import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'handbook_db'}`;

export const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 5000,
});

export let isPgConnected = false;

// In-memory fallback store if PostgreSQL is temporarily unavailable locally
interface Store {
  calendars: any[];
  resources: any[];
  roadmaps: any[];
  socials: any[];
  admins: any[];
}

export const fallbackStore: Store = {
  calendars: [
    {
      id: 1,
      shift: 'morning',
      shift_name: 'Səhər Növbəsi',
      shift_hours: '09:00 - 13:00',
      calendar_url: 'https://calendar.google.com/calendar/u/0/r?cid=peerstack_morning_batch',
      description: 'Səhər qrupu üçün canlı mühazirələr, mentor saatları və komanda müzakirələri təqvimi.',
      instructor_notes: 'Dərslər həftə içi saat 09:30-da dəqiq başlayır. Gecikməmək vacibdir.',
      color_code: '#009966',
      sort_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      shift: 'afternoon',
      shift_name: 'Günorta Növbəsi',
      shift_hours: '14:00 - 18:00',
      calendar_url: 'https://calendar.google.com/calendar/u/0/r?cid=peerstack_afternoon_batch',
      description: 'Günorta qrupu dərsləri, praktiki kodlaşdırma sessiyaları və lab təqvimi.',
      instructor_notes: 'Praktiki tapşırıqlar hər gün saat 16:30-da yoxlanılır.',
      color_code: '#007a52',
      sort_order: 2,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      shift: 'evening',
      shift_name: 'Axşam Növbəsi',
      shift_hours: '19:00 - 22:30',
      calendar_url: 'https://calendar.google.com/calendar/u/0/r?cid=peerstack_evening_batch',
      description: 'Axşam növbəsi tələbələri üçün intensiv texniki sessiyalar və layihə baxışları təqvimi.',
      instructor_notes: 'İşləyən tələbələr üçün qeydlər hər gün dərsdən dərhal sonra paylaşılır.',
      color_code: '#005c3d',
      sort_order: 3,
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ],
  resources: [
    {
      id: 1,
      title: 'Tələbə Portalı (LMS)',
      description: 'Tapşırıqların təhvili, dərs video yazılarına baxış, şəxsi davamiyyət və qiymətləndirmə sistemi.',
      url: 'https://portal.peerstack.az',
      category: 'Portal',
      badge: 'Əsas Sistem',
      icon_name: 'LayoutDashboard',
      sort_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Tapşırıq və Layihə Yoxlama Paneli',
      description: 'Kod yoxlanışı (Code Review), avtomatlaşdırılmış test nəticələri və mentor rəyləri.',
      url: 'https://review.peerstack.az',
      category: 'Tədris Aləti',
      badge: 'Gündəlik',
      icon_name: 'Code2',
      sort_order: 2,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'Tələbə Discord İcması',
      description: 'Kursa aid elanlar, sual-cavab kanalları, növbə otaqları və qrup daxili müzakirələr.',
      url: 'https://discord.gg/peerstack',
      category: 'Kommunikasiya',
      badge: 'Canlı Əlaqə',
      icon_name: 'MessageSquare',
      sort_order: 3,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      title: 'Peerstack GitHub Təşkilatı',
      description: 'Dərs layihələrinin şablonları, ev tapşırığı repozitoriləri və tədris materialları.',
      url: 'https://github.com/peerstack-academy',
      category: 'Kod Repozitorisi',
      badge: 'Repozitorilər',
      icon_name: 'Github',
      sort_order: 4,
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ],
  roadmaps: [
    {
      id: 1,
      title: 'Frontend Development Tədris Yol Xəritəsi (2026)',
      description: 'HTML, CSS, JavaScript, React, Next.js və TypeScript mövzularının həftəlik ardıcıllığı və tapşırıq planı.',
      sheet_url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vFrontendRoadmap_Sample/pubhtml',
      faculty: 'Frontend',
      tags: 'React, TypeScript, CSS, UI/UX, Roadmap',
      sort_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Backend Development & API Tədris Yol Xəritəsi',
      description: 'Node.js, Express, PostgreSQL, Docker, Microservices və Təhlükəsizlik mövzularının detallı cədvəli.',
      sheet_url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vBackendRoadmap_Sample/pubhtml',
      faculty: 'Backend',
      tags: 'Node.js, PostgreSQL, Docker, API, Roadmap',
      sort_order: 2,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'Tələbə Qiymətləndirmə və Layihə Balları Cədvəli',
      description: 'Hər sprint üzrə təhvil verilən tapşırıqların balları, quiz nəticələri və buraxılış layihəsi statusları.',
      sheet_url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vGradesAndProjects_Sample/pubhtml',
      faculty: 'Ümumi Cədvəl',
      tags: 'Ballar, Sprintlər, Qiymətləndirmə, Statistika',
      sort_order: 3,
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ],
  socials: [
    {
      id: 1,
      platform: 'whatsapp',
      name: 'Peerstack WhatsApp Community',
      description: 'Kursun rəsmi WhatsApp icması, qrup daxili vacib elanlar və növbə otaqları.',
      url: 'https://chat.whatsapp.com/PeerstackCommunityInvite2026',
      badge: 'Rəsmi İcma',
      icon_name: 'MessageCircle',
      sort_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      platform: 'telegram',
      name: 'Peerstack Telegram Kanalı',
      description: 'Gündəlik texnoloji xəbərlər, vakansiyalar, təcrübə proqramları və resurslar.',
      url: 'https://t.me/peerstack_academy',
      badge: 'Xəbərlər & Vakansiyalar',
      icon_name: 'Send',
      sort_order: 2,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      platform: 'linkedin',
      name: 'Peerstack LinkedIn Şəbəkəsi',
      description: 'Karyera imkanları, məzun şəbəkəsi və partnyor şirkətlərlə əlaqələr.',
      url: 'https://linkedin.com/school/peerstack-academy',
      badge: 'Karyera',
      icon_name: 'Linkedin',
      sort_order: 3,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      platform: 'instagram',
      name: 'Peerstack Instagram Səhifəsi',
      description: 'Akademiya həyatı, tələbə layihələri, tədbir görüntüləri və hekayələr.',
      url: 'https://instagram.com/peerstack.az',
      badge: 'Sosial',
      icon_name: 'Instagram',
      sort_order: 4,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 5,
      platform: 'youtube',
      name: 'Peerstack YouTube Kanalı',
      description: 'Açıq dərslər, mentor vebinarları, tələbə podkastları və masterklaslar.',
      url: 'https://youtube.com/@peerstack_academy',
      badge: 'Video Dərslər',
      icon_name: 'Youtube',
      sort_order: 5,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 6,
      platform: 'facebook',
      name: 'Peerstack Facebook Səhifəsi',
      description: 'Tədbir anonsları, canlı yayımlar və akademiya xəbərləri.',
      url: 'https://facebook.com/peerstack.academy',
      badge: 'Xəbərlər & Tədbirlər',
      icon_name: 'Facebook',
      sort_order: 6,
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ],
  admins: [],
};

// Auto initialize tables and seed data
export async function initializeDatabase() {
  try {
    const client = await pool.connect();
    isPgConnected = true;
    console.log('✅ PostgreSQL bazasına uğurla qoşuldu.');

    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS calendars (
        id SERIAL PRIMARY KEY,
        shift VARCHAR(50) NOT NULL,
        shift_name VARCHAR(100) NOT NULL,
        shift_hours VARCHAR(100) NOT NULL,
        calendar_url TEXT NOT NULL,
        description TEXT,
        instructor_notes TEXT,
        color_code VARCHAR(20) DEFAULT '#009966',
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS useful_resources (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        url TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'Portal',
        badge VARCHAR(50),
        icon_name VARCHAR(50) DEFAULT 'Globe',
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS roadmaps (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        sheet_url TEXT NOT NULL,
        faculty VARCHAR(100) DEFAULT 'Ümumi',
        tags VARCHAR(255),
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS social_links (
        id SERIAL PRIMARY KEY,
        platform VARCHAR(50) NOT NULL,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        url TEXT NOT NULL,
        badge VARCHAR(50),
        icon_name VARCHAR(50) DEFAULT 'Share2',
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'staff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS student_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(200),
        shift VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if initial admin exists
    const adminCheck = await client.query('SELECT * FROM admin_users WHERE username = $1', ['admin']);
    if (adminCheck.rows.length === 0) {
      const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'peerstack2026';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(defaultPassword, salt);
      await client.query(
        'INSERT INTO admin_users (username, password_hash, role) VALUES ($1, $2, $3)',
        ['admin', hash, 'superadmin']
      );
      console.log('👤 Standart Admin hesabı yaradıldı: username: admin');
    }

    // Check if initial student exists
    const studentCheck = await client.query('SELECT * FROM student_users WHERE username = $1', ['student']);
    if (studentCheck.rows.length === 0) {
      const studentPassword = process.env.STUDENT_DEFAULT_PASSWORD || 'student2026';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(studentPassword, salt);
      await client.query(
        'INSERT INTO student_users (username, password_hash, full_name, shift) VALUES ($1, $2, $3, $4)',
        ['student', hash, 'Tələbə', 'all']
      );
      console.log('🎓 Standart Tələbə hesabı yaradıldı: username: student');
    }

    // Seed calendars if empty
    const calCheck = await client.query('SELECT COUNT(*) FROM calendars');
    if (parseInt(calCheck.rows[0].count) === 0) {
      for (const cal of fallbackStore.calendars) {
        await client.query(
          `INSERT INTO calendars (shift, shift_name, shift_hours, calendar_url, description, instructor_notes, color_code, sort_order, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [cal.shift, cal.shift_name, cal.shift_hours, cal.calendar_url, cal.description, cal.instructor_notes, cal.color_code, cal.sort_order, cal.is_active]
        );
      }
      console.log('🌱 Növbə təqvimləri ilkin məlumatlarla dolduruldu.');
    }

    // Seed resources if empty
    const resCheck = await client.query('SELECT COUNT(*) FROM useful_resources');
    if (parseInt(resCheck.rows[0].count) === 0) {
      for (const res of fallbackStore.resources) {
        await client.query(
          `INSERT INTO useful_resources (title, description, url, category, badge, icon_name, sort_order, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [res.title, res.description, res.url, res.category, res.badge, res.icon_name, res.sort_order, res.is_active]
        );
      }
      console.log('🌱 Tələbə faydalı səhifələri ilkin məlumatlarla dolduruldu.');
    }

    // Seed roadmaps if empty
    const roadCheck = await client.query('SELECT COUNT(*) FROM roadmaps');
    if (parseInt(roadCheck.rows[0].count) === 0) {
      for (const road of fallbackStore.roadmaps) {
        await client.query(
          `INSERT INTO roadmaps (title, description, sheet_url, faculty, tags, sort_order, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [road.title, road.description, road.sheet_url, road.faculty, road.tags, road.sort_order, road.is_active]
        );
      }
      console.log('🌱 Google Sheets yol xəritələri ilkin məlumatlarla dolduruldu.');
    }

    // Seed socials if empty
    const socialCheck = await client.query('SELECT COUNT(*) FROM social_links');
    if (parseInt(socialCheck.rows[0].count) === 0) {
      for (const soc of fallbackStore.socials) {
        await client.query(
          `INSERT INTO social_links (platform, name, description, url, badge, icon_name, sort_order, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [soc.platform, soc.name, soc.description, soc.url, soc.badge, soc.icon_name, soc.sort_order, soc.is_active]
        );
      }
      console.log('🌱 Sosial və İcma linkləri ilkin məlumatlarla dolduruldu.');
    }

    client.release();
  } catch (error: any) {
    console.warn('⚠️ PostgreSQL-ə qoşulma zamanı xəta:', error.message);
    console.warn('⚡ Sistem avtomatik in-memory yaddaş rejiminə keçdi. Məlumatlar hazırdır.');
    isPgConnected = false;
  }
}
