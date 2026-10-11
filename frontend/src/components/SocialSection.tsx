import React, { useState } from 'react';
import {
  MessageCircle,
  Send,
  Share2,
  ExternalLink,
  Copy,
  Check,
  Users,
  Sparkles,
  Globe,
} from 'lucide-react';
import { SocialItem } from '../types';

interface SocialSectionProps {
  socials: SocialItem[];
  searchQuery: string;
}

export const SocialSection: React.FC<SocialSectionProps> = ({ socials, searchQuery }) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'whatsapp':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        );
      case 'telegram':
        return <Send size={22} color="#0088cc" />;
      case 'linkedin':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        );
      case 'instagram':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e1306c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        );
      case 'youtube':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
          </svg>
        );
      case 'facebook':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1877F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        );
      default:
        return <Share2 size={22} color="var(--primary)" />;
    }
  };

  const handleCopy = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSocials = socials.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.platform.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  });

  return (
    <section id="social-section" style={{ marginBottom: '64px' }}>
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
            <Users size={18} />
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Sosial Platformalar & İcma
          </h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '4px' }}>
          Rəsmi WhatsApp icması, Telegram xəbər kanalı və digər sosial media platformalarımıza qoşulun.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
        {filteredSocials.map((soc) => {
          const isWhatsApp = soc.platform.toLowerCase() === 'whatsapp';

          return (
            <div
              key={soc.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderTop: isWhatsApp ? '4px solid #25D366' : '1px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      padding: '10px',
                      borderRadius: '12px',
                      background: 'var(--bg-card-subtle)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getPlatformIcon(soc.platform)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{soc.name}</h3>
                  </div>
                </div>

                {soc.badge && (
                  <span
                    className="badge"
                    style={{
                      background: isWhatsApp ? 'rgba(37, 211, 102, 0.15)' : undefined,
                      color: isWhatsApp ? '#25D366' : undefined,
                      borderColor: isWhatsApp ? 'rgba(37, 211, 102, 0.3)' : undefined,
                    }}
                  >
                    <Sparkles size={12} />
                    {soc.badge}
                  </span>
                )}
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', flexGrow: 1 }}>
                {soc.description}
              </p>

              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <a
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    background: isWhatsApp ? '#25D366' : undefined,
                  }}
                >
                  <span>{isWhatsApp ? 'WhatsApp İcmaya Qoşul' : 'Keçid Et'}</span>
                  <ExternalLink size={15} />
                </a>

                <button
                  className="btn-icon"
                  onClick={() => handleCopy(soc.id, soc.url)}
                  title="Link kopyala"
                >
                  {copiedId === soc.id ? <Check size={18} color="#009966" /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
