import React, { useState } from 'react';
import { Globe, ExternalLink, LayoutDashboard, Code2, MessageSquare, GitBranch, Copy, Check, Sparkles } from 'lucide-react';
import { ResourceItem } from '../types';

interface ResourcesSectionProps {
  resources: ResourceItem[];
  searchQuery: string;
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({ resources, searchQuery }) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const getResourceIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'layoutdashboard':
        return <LayoutDashboard size={20} color="#009966" />;
      case 'code2':
        return <Code2 size={20} color="#009966" />;
      case 'messagesquare':
        return <MessageSquare size={20} color="#009966" />;
      case 'github':
        return <GitBranch size={20} color="#009966" />;
      default:
        return <Globe size={20} color="#009966" />;
    }
  };

  const handleCopy = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredResources = resources.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  return (
    <section id="resources-section" style={{ marginBottom: '56px' }}>
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
            <Globe size={18} />
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Tələbə Portalları və Faydalı Veb Səhifələr
          </h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '4px' }}>
          Tədris müddətində tələbələrin istifadə etdiyi sistemlər və onların təyinatı.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '20px',
        }}
      >
        {filteredResources.map((res) => (
          <div key={res.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
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
                  {getResourceIcon(res.icon_name)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{res.title}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {res.category}
                  </div>
                </div>
              </div>

              {res.badge && (
                <span className="badge">
                  <Sparkles size={12} />
                  {res.badge}
                </span>
              )}
            </div>

            <div
              style={{
                background: 'var(--bg-card-subtle)',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '20px',
                flexGrow: 1,
              }}
            >
              <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--text-light)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px' }}>
                Nə işə yarayır:
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {res.description}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <span>Səhifəyə Keç</span>
                <ExternalLink size={15} />
              </a>

              <button
                className="btn-icon"
                onClick={() => handleCopy(res.id, res.url)}
                title="Keçid linkini kopyala"
              >
                {copiedId === res.id ? <Check size={18} color="#009966" /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
