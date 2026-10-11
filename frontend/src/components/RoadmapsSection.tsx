import React, { useState } from 'react';
import { FileSpreadsheet, ExternalLink, Eye, X, Tag, Copy, Check } from 'lucide-react';
import { RoadmapItem } from '../types';

interface RoadmapsSectionProps {
  roadmaps: RoadmapItem[];
  searchQuery: string;
}

export const RoadmapsSection: React.FC<RoadmapsSectionProps> = ({ roadmaps, searchQuery }) => {
  const [activePreview, setActivePreview] = useState<RoadmapItem | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredRoadmaps = roadmaps.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.faculty.toLowerCase().includes(q) ||
      (item.tags && item.tags.toLowerCase().includes(q))
    );
  });

  return (
    <section id="roadmaps-section" style={{ marginBottom: '64px' }}>
      <div style={{ marginBottom: '20px' }}>
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
            <FileSpreadsheet size={18} />
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Tədris Yol Xəritələri
          </h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '4px' }}>
          Müvafiq sahələri üzrə kurikulumlar, resurs sənədləri
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '20px',
        }}
      >
        {filteredRoadmaps.map((item) => (
          <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    background: 'var(--bg-card-subtle)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <FileSpreadsheet size={22} color="#009966" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.08rem', fontWeight: 700 }}>{item.title}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {item.faculty}
                  </div>
                </div>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '14px', flexGrow: 1 }}>
              {item.description}
            </p>

            {item.tags && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                {item.tags.split(',').map((t, i) => (
                  <span
                    key={i}
                    style={{
                      background: 'var(--bg-card-subtle)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-muted)',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Tag size={10} color="var(--primary)" />
                    {t.trim()}
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <button
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setActivePreview(item)}
              >
                <Eye size={16} />
                <span>Baxış</span>
              </button>

              <a
                href={item.sheet_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <span>Sheets-də Aç</span>
                <ExternalLink size={14} />
              </a>

              <button
                className="btn-icon"
                onClick={() => handleCopy(item.id, item.sheet_url)}
                title="Sənəd linkini kopyala"
              >
                {copiedId === item.id ? <Check size={18} color="#009966" /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Embedded Sheets Preview Modal */}
      {activePreview && (
        <div className="modal-overlay" onClick={() => setActivePreview(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '960px', width: '95vw', height: '85vh', display: 'flex', flexDirection: 'column' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileSpreadsheet size={20} color="#009966" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{activePreview.title}</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a
                  href={activePreview.sheet_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                >
                  Tam Ekran Aç <ExternalLink size={14} />
                </a>
                <button className="btn-icon" onClick={() => setActivePreview(null)}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <div style={{ flex: 1, background: 'var(--bg-main)', position: 'relative' }}>
              <iframe
                src={activePreview.sheet_url}
                title={activePreview.title}
                style={{ width: '100%', height: '100%', border: 'none' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
