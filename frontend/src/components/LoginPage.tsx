import React, { useState } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sun,
  Moon,
} from 'lucide-react';
import { api } from '../api';

interface LoginPageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogin: (user: { username: string; role: string }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ theme, onToggleTheme, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setError('');
    setLoading(true);

    try {
      const data = await api.login(username, password);
      onLogin(data.user);
    } catch (err: any) {
      setError(err.message || 'İstifadəçi adı və ya şifrə yanlışdır');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme === 'dark'
          ? 'radial-gradient(ellipse at 30% 20%, rgba(0, 179, 119, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0, 153, 102, 0.06) 0%, transparent 50%), var(--bg-main)'
          : 'radial-gradient(ellipse at 30% 20%, rgba(0, 153, 102, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0, 179, 119, 0.04) 0%, transparent 50%), var(--bg-main)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float 20s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-8%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float 25s ease-in-out infinite reverse',
          pointerEvents: 'none',
        }}
      />

      {/* Theme toggle */}
      <button
        className="btn-icon"
        onClick={onToggleTheme}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          zIndex: 10,
        }}
        aria-label="Rejimi dəyiş"
      >
        {theme === 'dark' ? <Sun size={19} color="#eab308" /> : <Moon size={19} color="#52606d" />}
      </button>

      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo & Title */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: 'var(--primary-light)',
              border: '2px solid var(--primary-border)',
              marginBottom: '18px',
            }}
          >
            <img src="/logo1.png" alt="logo" style={{ width: '48px', height: '48px' }} />
          </div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-main)',
              marginBottom: '6px',
            }}
          >
            Peerstack Academy
          </h1>
        </div>

        {/* Single Universal Login Card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <h2
            style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: '6px',
            }}
          >
            Daxil ol
          </h2>
          <p
            style={{
              fontSize: '0.84rem',
              color: 'var(--text-muted)',
              marginBottom: '22px',
            }}
          >
            Sistemə daxil olmaq üçün məlumatlarınızı daxil edin
          </p>

          {/* Error Message */}
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                fontSize: '0.86rem',
                fontWeight: 500,
                marginBottom: '20px',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: '18px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  marginBottom: '8px',
                }}
              >
                İstifadəçi adı
              </label>
              <div style={{ position: 'relative' }}>
                <User
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
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="İstifadəçi adı"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  marginBottom: '8px',
                }}
              >
                Şifrə
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 46px 12px 42px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    padding: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '13px',
                fontSize: '0.95rem',
                borderRadius: 'var(--radius-md)',
                opacity: loading || !username || !password ? 0.6 : 1,
                cursor: loading || !username || !password ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                    }}
                  />
                  Daxil olunur...
                </>
              ) : (
                <>
                  Daxil ol
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-light)',
            marginTop: '28px',
          }}
        >
          © 2026 Peerstack Academy
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(15px, 10px) scale(1.02); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
