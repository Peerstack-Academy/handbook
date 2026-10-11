import React, { useState } from 'react';
import { Calendar, Clock, ExternalLink, Check, Copy, Sunrise, Sun, Moon } from 'lucide-react';
import { CalendarItem } from '../types';

interface CalendarsSectionProps {
  calendars: CalendarItem[];
  selectedShift: string;
}

export const CalendarsSection: React.FC<CalendarsSectionProps> = ({ calendars, selectedShift }) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const getShiftIcon = (shift: string) => {
    switch (shift.toLowerCase()) {
      case 'morning':
      case 'səhər':
        return <Sunrise size={22} color="#009966" />;
      case 'afternoon':
      case 'günorta':
        return <Sun size={22} color="#009966" />;
      case 'evening':
      case 'axşam':
        return <Moon size={22} color="#009966" />;
      default:
        return <Calendar size={22} color="#009966" />;
    }
  };

  const handleCopy = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCalendars = calendars.filter((item) => {
    if (selectedShift === 'all') return true;
    return item.shift.toLowerCase() === selectedShift.toLowerCase();
  });

  return (
    <section id="calendars-section" style={{ marginBottom: '56px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--badge-bg)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <Calendar size={18} />
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Növbə Təqvimləri (Google Calendar)
            </h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '4px' }}>
            Hər növbənin tədris prosesini görmək üçün təqvimə qoşulun
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
        {filteredCalendars.map((cal) => (
          <div key={cal.id} className="card shift-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    padding: '8px',
                    borderRadius: '10px',
                    background: 'var(--bg-card-subtle)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  {getShiftIcon(cal.shift)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{cal.shift_name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '0.84rem', fontWeight: 600, marginTop: '2px' }}>
                    <Clock size={14} />
                    <span>{cal.shift_hours}</span>
                  </div>
                </div>
              </div>

              <span className="badge">
                {cal.shift.toUpperCase()}
              </span>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px', minHeight: '44px' }}>
              {cal.description}
            </p>

            {cal.instructor_notes && (
              <div
                style={{
                  background: 'var(--bg-card-subtle)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  marginBottom: '20px',
                  borderLeft: '3px solid var(--primary)',
                }}
              >
                <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '2px' }}>Təlimat:</strong>
                {cal.instructor_notes}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
              <a
                href={cal.calendar_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Calendar size={16} />
                <span>Təqvimə Qoşul</span>
                <ExternalLink size={14} />
              </a>

              <button
                className="btn-icon"
                onClick={() => handleCopy(cal.id, cal.calendar_url)}
                title="Təqvim linkini kopyala"
              >
                {copiedId === cal.id ? <Check size={18} color="#009966" /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
