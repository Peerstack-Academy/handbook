# 📚 Peerstack Academy - Tələbə Handbook & Staff Admin Paneli

Kursda təhsil alan tələbələr üçün növbə təqvimləri, faydalı veb portallar və Google Sheets tədris yol xəritələrini birləşdirən müasir, responsive və tam funksional platformadır.

---

## 🌟 Əsas Xüsusiyyətlər

1. **3 Tədris Növbəsi və Təqvimlər (Google Calendar):**
   - **Səhər Növbəsi:** 09:00 - 13:00
   - **Günorta Növbəsi:** 14:00 - 18:00
   - **Axşam Növbəsi:** 19:00 - 22:30
   - Hər növbənin öz Google Calendar-ına birbaşa qoşulma linki, linkin tək kliklə kopyalanması və təlimat qeydləri.
2. **Tələbə Portalları və Veb Səhifələri:**
   - Tələbələrin istifadəsi üçün yaradılmış sistemlər (LMS, Kod Yoxlama Paneli, Discord, GitHub Org və s.).
   - Hər bir platformanın tələbə üçün nə işə yaradığını izah edən xüsusi təsvir bölməsi və birbaşa keçid düyməsi.
3. **Google Sheets Tədris Yol Xəritələri & Cədvəllər:**
   - Frontend, Backend, Fullstack və s. üzrə həftəlik proqramlar, tapşırıq planları və qiymətləndirmə cədvəlləri.
   - Həm birbaşa Google Sheets-də açmaq, həm də saytdan ayrılmadan birbaşa daxili **Modal Pəncərədə canlı baxış (Preview)** imkanı.
4. **Sosial Platformalar & WhatsApp İcması:**
   - Rəsmi WhatsApp Community (elanlar, tələbə qrupları), Telegram, LinkedIn, Instagram və YouTube kanallarına birbaşa qoşulma linkləri və kopyalama imkanı.
5. **Staff Admin Paneli:**
   - Staff üzvləri üçün xüsusi autentifikasiya (JWT təhlükəsizlik tokeni ilə).
   - Növbə təqvimlərini, faydalı səhifələri, Google Sheets cədvəllərini və sosial/WhatsApp linklərini əlavə etmək, redaktə etmək, silmək və aktivlik statusunu dəyişmək imkanı.
6. **Dizayn və İstifadə Rahatlığı:**
   - Əsas rənglər: `#009966` brend yaşılı və ağ, zərif tonlar.
   - Göz yormayan müasir Glassmorphism və Card dizaynı.
   - **Dark Theme (Qaranlıq rejim)** dəstəyi — `localStorage`-də saxlanılır və səhifə yenilənərkən yadda qalır.
   - 100% Responsive (Mobil, planşet və masaüstü üçün tam uyğunlaşdırılmış).
   - Sürətli canlı axtarış və növbə filterləri.

---

## 🛠 Texnoloji Stack

- **Frontend:** React 19 + TypeScript + Vite + Lucide Icons + Vanilla CSS (CSS Variables)
- **Backend:** Express.js + TypeScript + Node.js
- **Verilənlər Bazası:** PostgreSQL 16 (və lokal in-memory davamlılıq dəstəyi)
- **Konteynerləşdirmə:** Docker & Docker Compose
- **Təhlükəsizlik:** JWT (JSON Web Tokens), BCrypt şifrələməsi

---

## 🚀 Sistemi Ayağa Qaldırmaq (Docker ilə - Tövsiyə Olunur)

Bütün servisləri (PostgreSQL + Backend + Frontend) bir əmrlə işə salmaq üçün:

```bash
docker compose up --build
```

Servislər işə düşdükdən sonra:
- **Tələbə Handbook (Frontend):** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **PostgreSQL:** `localhost:5432`

---

## 💻 Lokal Rejimdə Ayağa Qaldırmaq (Docker Olmadan)

### 1. Asılılıqları Quraşdırın:
```bash
# Backend və Frontend paketlərini quraşdırmaq
npm run install:all
```

### 2. Backend-i İşə Salın:
```bash
cd backend
npm run dev
```
*(Backend standart olaraq `http://localhost:5000` ünvanında işə düşür)*

### 3. Frontend-i İşə Salın:
Yeni terminal pəncərəsində:
```bash
cd frontend
npm run dev
```
*(Frontend `http://localhost:3000` ünvanında işə düşür)*

---

## 🔐 Staff Admin Girişi Məlumatları

Saytın yuxarı sağ küncündəki **"Admin Panel"** düyməsinə klikləyərək və ya birbaşa URL-ə `#admin` yazaraq daxil ola bilərsiniz:

- **İstifadəçi adı:** `admin`
- **Şifrə:** `peerstack2026`

*(Bu məlumatları `backend/.env` faylında `ADMIN_DEFAULT_USER` və `ADMIN_DEFAULT_PASSWORD` parametrləri ilə dəyişə bilərsiniz)*

---

## 📁 Layihə Strukturu

```
handbook_for_students/
├── docker-compose.yml          # Postgres + Backend + Frontend orkestrasiyası
├── package.json                # Kök skriptlər
├── README.md                   # Sənədləşmə
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── src/
│       ├── server.ts           # Express server giriş nöqtəsi
│       ├── db.ts               # PostgreSQL əlaqəsi, cədvəllər və seed məlumatlar
│       ├── middleware/
│       │   └── auth.ts         # JWT Staff yoxlanışı
│       └── routes/
│           ├── auth.ts         # Giriş və token yoxlanışı
│           ├── calendars.ts    # Növbə təqvimləri CRUD
│           ├── resources.ts    # Tələbə portalları CRUD
│           └── roadmaps.ts     # Google Sheets yol xəritələri CRUD
│
└── frontend/
    ├── Dockerfile
    ├── nginx.conf              # SPA yönləndirmə və API proxy konfiqurasiyası
    ├── index.html
    ├── vite.config.ts
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── main.tsx
        ├── App.tsx             # Əsas səhifə və rejim idarəetməsi
        ├── index.css           # Dizayn sistemi, #009966 palitrası və Dark Theme
        ├── types.ts            # TypeScript interfeysləri
        ├── api.ts              # API müştərisi (fetch)
        └── components/
            ├── Navbar.tsx      # Başlıq, Rejim dəyişdirici və Admin keçidi
            ├── HeroSection.tsx # Statistikalar, sürətli axtarış və növbə filteri
            ├── CalendarsSection.tsx # Səhər, Günorta, Axşam Google Calendar kartları
            ├── ResourcesSection.tsx # Tələbə veb səhifələri (nə işə yarayır)
            ├── RoadmapsSection.tsx  # Google Sheets sənədləri və daxili baxış
            └── AdminPanel.tsx  # Staff idarəetmə paneli və redaktə modalları
```
