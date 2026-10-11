import React from 'react';
import { Search, Calendar, Globe, FileSpreadsheet, X, Filter, Sunrise, Sun, Moon, Users, MessageCircle } from 'lucide-react';
import { CalendarItem, ResourceItem, RoadmapItem, SocialItem } from '../types';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedShift: string;
  onShiftChange: (shift: string) => void;
  calendars: CalendarItem[];
  resources: ResourceItem[];
  roadmaps: RoadmapItem[];
  socials: SocialItem[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedShift,
  onShiftChange,
  calendars,
  resources,
  roadmaps,
  socials,
}) => {
  return (
    <div style={{ padding: '36px 0 28px 0' }}>
      {/* Intro Header */}
      <div style={{ maxWidth: '780px', marginBottom: '28px' }}>

        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 2.7rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '14px',
            color: 'var(--text-main)',
          }}
        >
          Sizin üçün lazım olan bütün <span style={{ color: 'var(--primary)' }}>resurslar və təqvimlər</span> bir yerdə
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Növbənizə uyğun dərs cədvəlinə qoşulun, tələbə portalları ilə tanış olun, Google Sheets tədris yol xəritələrini nəzərdən keçirin və rəsmi WhatsApp icmamıza üzv olun.
        </p>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '14px',
          marginBottom: '32px',
        }}
      >
        <div
          className="card"
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
          }}
          onClick={() => {
            document.getElementById('calendars-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div
            style={{
              padding: '10px',
              borderRadius: '10px',
              background: 'var(--badge-bg)',
              color: 'var(--primary)',
            }}
          >
            <Calendar size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{calendars.length} Növbə</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Google Calendar</div>
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
          }}
          onClick={() => {
            document.getElementById('resources-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div
            style={{
              padding: '10px',
              borderRadius: '10px',
              background: 'var(--badge-bg)',
              color: 'var(--primary)',
            }}
          >
            <Globe size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{resources.length} Portal</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tələbə Veb Səhifələri</div>
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
          }}
          onClick={() => {
            document.getElementById('roadmaps-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div
            style={{
              padding: '10px',
              borderRadius: '10px',
              background: 'var(--badge-bg)',
              color: 'var(--primary)',
            }}
          >
            <FileSpreadsheet size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{roadmaps.length} Sənəd</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Yol Xəritəsi & Cədvəllər</div>
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
          }}
          onClick={() => {
            document.getElementById('social-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div
            style={{
              padding: '10px',
              borderRadius: '10px',
              background: 'rgba(37, 211, 102, 0.15)',
              color: '#25D366',
            }}
          >
            <MessageCircle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{socials.length} Sosial Link</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>WhatsApp & Sosial</div>
          </div>
        </div>
      </div>

      {/* Search and Shift Filter Bar */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        {/* Search */}
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Açar sözlə axtarın (məs: LMS, Səhər, Frontend, Discord)..."
            style={{
              width: '100%',
              padding: '12px 38px 12px 42px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card-subtle)',
              color: 'var(--text-main)',
              fontSize: '0.92rem',
              transition: 'border-color 0.2s',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                color: 'var(--text-muted)',
                padding: '4px',
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Shift Filter Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '4px' }}>
            <Filter size={15} />
            <span>Növbə:</span>
          </div>

          <button
            onClick={() => onShiftChange('all')}
            className={selectedShift === 'all' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.84rem', padding: '8px 14px' }}
          >
            Hamısı
          </button>

          <button
            onClick={() => onShiftChange('morning')}
            className={selectedShift === 'morning' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.84rem', padding: '8px 14px' }}
          >
            <Sunrise size={14} />
            <span>Səhər</span>
          </button>

          <button
            onClick={() => onShiftChange('afternoon')}
            className={selectedShift === 'afternoon' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.84rem', padding: '8px 14px' }}
          >
            <Sun size={14} />
            <span>Günorta</span>
          </button>

          <button
            onClick={() => onShiftChange('evening')}
            className={selectedShift === 'evening' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.84rem', padding: '8px 14px' }}
          >
            <Moon size={14} />
            <span>Axşam</span>
          </button>
        </div>
      </div>
    </div>
  );
};
