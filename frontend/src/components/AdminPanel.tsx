import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Calendar,
  Globe,
  FileSpreadsheet,
  Plus,
  Trash2,
  Edit2,
  Lock,
  User,
  ArrowLeft,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Users,
} from 'lucide-react';
import { api } from '../api';
import { CalendarItem, ResourceItem, RoadmapItem, SocialItem } from '../types';

interface AdminPanelProps {
  onBackToStudentView: () => void;
  onRefreshData: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToStudentView, onRefreshData }) => {
  const [activeTab, setActiveTab] = useState<'calendars' | 'resources' | 'roadmaps' | 'socials'>('calendars');

  // Data states
  const [calendars, setCalendars] = useState<CalendarItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [roadmaps, setRoadmaps] = useState<RoadmapItem[]>([]);
  const [socials, setSocials] = useState<SocialItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal states
  const [modalType, setModalType] = useState<'calendar' | 'resource' | 'roadmap' | 'social' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [c, r, m, s] = await Promise.all([
        api.adminGetCalendars(),
        api.adminGetResources(),
        api.adminGetRoadmaps(),
        api.adminGetSocials(),
      ]);
      setCalendars(c);
      setResources(r);
      setRoadmaps(m);
      setSocials(s);
    } catch (err: any) {
      showFeedback('Məlumatları yükləyərkən xəta: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Login and logout are now handled at the app level

  // Calendar CRUD
  const handleSaveCalendar = async (data: Partial<CalendarItem>) => {
    try {
      if (editingItem?.id) {
        await api.updateCalendar(editingItem.id, data);
        showFeedback('Təqvim yeniləndi');
      } else {
        await api.createCalendar(data);
        showFeedback('Yeni təqvim əlavə olundu');
      }
      setModalType(null);
      setEditingItem(null);
      fetchAdminData();
      onRefreshData();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  const handleDeleteCalendar = async (id: number) => {
    if (!window.confirm('Bu təqvimi silmək istədiyinizdən əminsiniz?')) return;
    try {
      await api.deleteCalendar(id);
      showFeedback('Təqvim silindi');
      fetchAdminData();
      onRefreshData();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // Resource CRUD
  const handleSaveResource = async (data: Partial<ResourceItem>) => {
    try {
      if (editingItem?.id) {
        await api.updateResource(editingItem.id, data);
        showFeedback('Resurs yeniləndi');
      } else {
        await api.createResource(data);
        showFeedback('Yeni resurs əlavə olundu');
      }
      setModalType(null);
      setEditingItem(null);
      fetchAdminData();
      onRefreshData();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  const handleDeleteResource = async (id: number) => {
    if (!window.confirm('Bu faydalı resursu silmək istədiyinizdən əminsiniz?')) return;
    try {
      await api.deleteResource(id);
      showFeedback('Resurs silindi');
      fetchAdminData();
      onRefreshData();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // Roadmap CRUD
  const handleSaveRoadmap = async (data: Partial<RoadmapItem>) => {
    try {
      if (editingItem?.id) {
        await api.updateRoadmap(editingItem.id, data);
        showFeedback('Yol xəritəsi yeniləndi');
      } else {
        await api.createRoadmap(data);
        showFeedback('Yeni yol xəritəsi əlavə olundu');
      }
      setModalType(null);
      setEditingItem(null);
      fetchAdminData();
      onRefreshData();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  const handleDeleteRoadmap = async (id: number) => {
    if (!window.confirm('Bu yol xəritəsini silmək istədiyinizdən əminsiniz?')) return;
    try {
      await api.deleteRoadmap(id);
      showFeedback('Yol xəritəsi silindi');
      fetchAdminData();
      onRefreshData();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // Social CRUD
  const handleSaveSocial = async (data: Partial<SocialItem>) => {
    try {
      if (editingItem?.id) {
        await api.updateSocial(editingItem.id, data);
        showFeedback('Sosial link yeniləndi');
      } else {
        await api.createSocial(data);
        showFeedback('Yeni sosial link əlavə olundu');
      }
      setModalType(null);
      setEditingItem(null);
      fetchAdminData();
      onRefreshData();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  const handleDeleteSocial = async (id: number) => {
    if (!window.confirm('Bu sosial linki silmək istədiyinizdən əminsiniz?')) return;
    try {
      await api.deleteSocial(id);
      showFeedback('Sosial link silindi');
      fetchAdminData();
      onRefreshData();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // Admin Dashboard
  return (
    <div className="container" style={{ paddingBottom: '80px', paddingTop: '20px' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            <Sparkles size={22} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }} />
            Staff İdarəetmə Paneli
          </h1>
        </div>
      </div>

      {feedback && (
        <div
          style={{
            background: feedback.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 153, 102, 0.1)',
            border: `1px solid ${feedback.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(0, 153, 102, 0.3)'}`,
            color: feedback.type === 'error' ? '#ef4444' : 'var(--primary)',
            padding: '12px 18px',
            borderRadius: '10px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 600,
          }}
        >
          {feedback.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          className={activeTab === 'calendars' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setActiveTab('calendars')}
        >
          <Calendar size={17} />
          <span>Növbə Təqvimləri ({calendars.length})</span>
        </button>

        <button
          className={activeTab === 'resources' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setActiveTab('resources')}
        >
          <Globe size={17} />
          <span>Faydalı Səhifələr ({resources.length})</span>
        </button>

        <button
          className={activeTab === 'roadmaps' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setActiveTab('roadmaps')}
        >
          <FileSpreadsheet size={17} />
          <span>Google Sheets ({roadmaps.length})</span>
        </button>

        <button
          className={activeTab === 'socials' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setActiveTab('socials')}
        >
          <Users size={17} />
          <span>Sosial & İcma ({socials.length})</span>
        </button>
      </div>

      {/* Calendars Manager Tab */}
      {activeTab === 'calendars' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Növbə Təqvimlərinin İdarə Edilməsi</h2>
            <button
              className="btn-primary"
              onClick={() => {
                setEditingItem({
                  shift: 'morning',
                  shift_name: '',
                  shift_hours: '09:00 - 13:00',
                  calendar_url: '',
                  description: '',
                  instructor_notes: '',
                  is_active: true,
                });
                setModalType('calendar');
              }}
            >
              <Plus size={16} />
              <span>Yeni Növbə / Təqvim</span>
            </button>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {calendars.map((cal) => (
              <div
                key={cal.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  gap: '16px',
                  opacity: cal.is_active ? 1 : 0.6,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '1.05rem' }}>{cal.shift_name}</strong>
                    <span className="badge">{cal.shift.toUpperCase()}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({cal.shift_hours})</span>
                    {!cal.is_active && <span style={{ color: '#ef4444', fontSize: '0.78rem', fontWeight: 700 }}>(DEAKTİV)</span>}
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {cal.description}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--primary)', marginTop: '2px', wordBreak: 'break-all' }}>
                    {cal.calendar_url}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn-icon"
                    onClick={() => {
                      setEditingItem(cal);
                      setModalType('calendar');
                    }}
                    title="Düzəliş et"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleDeleteCalendar(cal.id)}
                    title="Sil"
                    style={{ color: '#ef4444' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Useful Webpages Resources Manager Tab */}
      {activeTab === 'resources' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Tələbə Portallarının İdarə Edilməsi</h2>
            <button
              className="btn-primary"
              onClick={() => {
                setEditingItem({
                  title: '',
                  description: '',
                  url: '',
                  category: 'Portal',
                  badge: 'Yeni',
                  icon_name: 'Globe',
                  is_active: true,
                });
                setModalType('resource');
              }}
            >
              <Plus size={16} />
              <span>Yeni Səhifə Əlavə Et</span>
            </button>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {resources.map((res) => (
              <div
                key={res.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  gap: '16px',
                  opacity: res.is_active ? 1 : 0.6,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '1.05rem' }}>{res.title}</strong>
                    <span className="badge">{res.category}</span>
                    {res.badge && <span className="badge" style={{ background: 'var(--bg-card-subtle)' }}>{res.badge}</span>}
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <strong>Nə işə yarayır:</strong> {res.description}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--primary)', marginTop: '2px', wordBreak: 'break-all' }}>
                    {res.url}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn-icon"
                    onClick={() => {
                      setEditingItem(res);
                      setModalType('resource');
                    }}
                    title="Düzəliş et"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleDeleteResource(res.id)}
                    title="Sil"
                    style={{ color: '#ef4444' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Google Sheets Roadmaps Manager Tab */}
      {activeTab === 'roadmaps' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Google Sheets və Yol Xəritələrinin İdarə Edilməsi</h2>
            <button
              className="btn-primary"
              onClick={() => {
                setEditingItem({
                  title: '',
                  description: '',
                  sheet_url: '',
                  faculty: 'Frontend',
                  tags: 'Roadmap, Cədvəl',
                  is_active: true,
                });
                setModalType('roadmap');
              }}
            >
              <Plus size={16} />
              <span>Yeni Google Sheet Əlavə Et</span>
            </button>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {roadmaps.map((road) => (
              <div
                key={road.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  gap: '16px',
                  opacity: road.is_active ? 1 : 0.6,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '1.05rem' }}>{road.title}</strong>
                    <span className="badge">{road.faculty}</span>
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {road.description}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--primary)', marginTop: '2px', wordBreak: 'break-all' }}>
                    {road.sheet_url}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn-icon"
                    onClick={() => {
                      setEditingItem(road);
                      setModalType('roadmap');
                    }}
                    title="Düzəliş et"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleDeleteRoadmap(road.id)}
                    title="Sil"
                    style={{ color: '#ef4444' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social & Community Links Manager Tab */}
      {activeTab === 'socials' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Sosial Platformalar & WhatsApp İcmasının İdarə Edilməsi</h2>
            <button
              className="btn-primary"
              onClick={() => {
                setEditingItem({
                  platform: 'whatsapp',
                  name: '',
                  description: '',
                  url: '',
                  badge: 'Rəsmi',
                  icon_name: 'MessageCircle',
                  is_active: true,
                });
                setModalType('social');
              }}
            >
              <Plus size={16} />
              <span>Yeni Sosial / WhatsApp Link</span>
            </button>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {socials.map((soc) => (
              <div
                key={soc.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  gap: '16px',
                  opacity: soc.is_active ? 1 : 0.6,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '1.05rem' }}>{soc.name}</strong>
                    <span className="badge" style={{ textTransform: 'uppercase' }}>{soc.platform}</span>
                    {soc.badge && <span className="badge" style={{ background: 'var(--bg-card-subtle)' }}>{soc.badge}</span>}
                    {!soc.is_active && <span style={{ color: '#ef4444', fontSize: '0.78rem', fontWeight: 700 }}>(DEAKTİV)</span>}
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {soc.description}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--primary)', marginTop: '2px', wordBreak: 'break-all' }}>
                    {soc.url}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn-icon"
                    onClick={() => {
                      setEditingItem(soc);
                      setModalType('social');
                    }}
                    title="Düzəliş et"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleDeleteSocial(soc.id)}
                    title="Sil"
                    style={{ color: '#ef4444' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Calendar Edit/Create */}
      {modalType === 'calendar' && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div className="modal-content" style={{ padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {editingItem?.id ? 'Növbə Təqvimini Redaktə Et' : 'Yeni Növbə Təqvimi Əlavə Et'}
              </h3>
              <button className="btn-icon" onClick={() => setModalType(null)}>
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveCalendar(editingItem);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                  Növbə Kateqoriyası
                </label>
                <select
                  value={editingItem.shift}
                  onChange={(e) => setEditingItem({ ...editingItem, shift: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                  }}
                >
                  <option value="morning">Səhər (Morning)</option>
                  <option value="afternoon">Günorta (Afternoon)</option>
                  <option value="evening">Axşam (Evening)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                  Növbə Adı
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.shift_name}
                  onChange={(e) => setEditingItem({ ...editingItem, shift_name: e.target.value })}
                  placeholder="Məsələn: Səhər Növbəsi"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                  Dərs Saatları
                </label>
                <input
                  type="text"
                  value={editingItem.shift_hours}
                  onChange={(e) => setEditingItem({ ...editingItem, shift_hours: e.target.value })}
                  placeholder="09:00 - 13:00"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                  Google Calendar Linki
                </label>
                <input
                  type="url"
                  required
                  value={editingItem.calendar_url}
                  onChange={(e) => setEditingItem({ ...editingItem, calendar_url: e.target.value })}
                  placeholder="https://calendar.google.com/..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                  Təsvir
                </label>
                <textarea
                  rows={2}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Növbə haqqında qısa məlumat..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                  Təlimat / Qeyd
                </label>
                <input
                  type="text"
                  value={editingItem.instructor_notes || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, instructor_notes: e.target.value })}
                  placeholder="Məsələn: Canlı dərslər saat 09:30-da başlayır."
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="calActive"
                  checked={editingItem.is_active}
                  onChange={(e) => setEditingItem({ ...editingItem, is_active: e.target.checked })}
                />
                <label htmlFor="calActive" style={{ fontSize: '0.88rem' }}>Aktiv olsun (Tələbələr görsün)</label>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Yadda Saxla
                </button>
                <button type="button" className="btn-secondary" onClick={() => setModalType(null)}>
                  Ləğv Et
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Resource Edit/Create */}
      {modalType === 'resource' && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div className="modal-content" style={{ padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {editingItem?.id ? 'Tələbə Portalını Redaktə Et' : 'Yeni Tələbə Portalı / Səhifəsi Əlavə Et'}
              </h3>
              <button className="btn-icon" onClick={() => setModalType(null)}>
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveResource(editingItem);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                  Səhifə / Portal Adı
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Məsələn: Tələbə Portalı (LMS)"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                  Nə işə yarayır (Təsvir)
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Bu səhifə tələbələr üçün nə funksiya daşıyır..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                  Keçid Linki (URL)
                </label>
                <input
                  type="url"
                  required
                  value={editingItem.url}
                  onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                  placeholder="https://..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                    Kateqoriya
                  </label>
                  <input
                    type="text"
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    placeholder="Portal, Tədris Aləti, İcma..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-card-subtle)',
                      color: 'var(--text-main)',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                    Xüsusi Nişan (Badge)
                  </label>
                  <input
                    type="text"
                    value={editingItem.badge || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                    placeholder="Məsələn: Əsas Sistem, Gündəlik"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-card-subtle)',
                      color: 'var(--text-main)',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="resActive"
                  checked={editingItem.is_active}
                  onChange={(e) => setEditingItem({ ...editingItem, is_active: e.target.checked })}
                />
                <label htmlFor="resActive" style={{ fontSize: '0.88rem' }}>Aktiv olsun (Tələbələr görsün)</label>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Yadda Saxla
                </button>
                <button type="button" className="btn-secondary" onClick={() => setModalType(null)}>
                  Ləğv Et
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Roadmap Edit/Create */}
      {modalType === 'roadmap' && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div className="modal-content" style={{ padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {editingItem?.id ? 'Google Sheet / Yol Xəritəsini Redaktə Et' : 'Yeni Google Sheet / Yol Xəritəsi Əlavə Et'}
              </h3>
              <button className="btn-icon" onClick={() => setModalType(null)}>
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveRoadmap(editingItem);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                  Sənədin Başlığı
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Məsələn: Frontend Development Tədris Yol Xəritəsi"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                  Detallı Təsvir
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Bu cədvəldə nələr var, tələbələr necə izləməlidir..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                  Google Sheets Linki (İctimai və ya paylaşılan link)
                </label>
                <input
                  type="url"
                  required
                  value={editingItem.sheet_url}
                  onChange={(e) => setEditingItem({ ...editingItem, sheet_url: e.target.value })}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                    İstiqamət / Sahə
                  </label>
                  <input
                    type="text"
                    value={editingItem.faculty}
                    onChange={(e) => setEditingItem({ ...editingItem, faculty: e.target.value })}
                    placeholder="Frontend, Backend, QA..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-card-subtle)',
                      color: 'var(--text-main)',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                    Teqlər (vergüllə)
                  </label>
                  <input
                    type="text"
                    value={editingItem.tags || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, tags: e.target.value })}
                    placeholder="React, CSS, Sprintlər"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-card-subtle)',
                      color: 'var(--text-main)',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="roadActive"
                  checked={editingItem.is_active}
                  onChange={(e) => setEditingItem({ ...editingItem, is_active: e.target.checked })}
                />
                <label htmlFor="roadActive" style={{ fontSize: '0.88rem' }}>Aktiv olsun (Tələbələr görsün)</label>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Yadda Saxla
                </button>
                <button type="button" className="btn-secondary" onClick={() => setModalType(null)}>
                  Ləğv Et
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Social Edit/Create */}
      {modalType === 'social' && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div className="modal-content" style={{ padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {editingItem?.id ? 'Sosial / WhatsApp Linkini Redaktə Et' : 'Yeni Sosial / WhatsApp Linki Əlavə Et'}
              </h3>
              <button className="btn-icon" onClick={() => setModalType(null)}>
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveSocial(editingItem);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                  Platforma
                </label>
                <select
                  value={editingItem.platform}
                  onChange={(e) => setEditingItem({ ...editingItem, platform: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                  }}
                >
                  <option value="whatsapp">WhatsApp Community</option>
                  <option value="telegram">Telegram Kanalı</option>
                  <option value="linkedin">LinkedIn Şəbəkəsi</option>
                  <option value="facebook">Facebook Səhifəsi</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="other">Digər Sosial Platforma</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                  Başlıq / İcma Adı
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="Məsələn: Peerstack WhatsApp Community"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                  Keçid Linki (URL)
                </label>
                <input
                  type="url"
                  required
                  value={editingItem.url}
                  onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                  placeholder="https://chat.whatsapp.com/... və ya https://t.me/..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                  Təsvir
                </label>
                <textarea
                  rows={2}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Bu qrup və ya platformada nələr paylaşılır..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                  Nişan (Badge)
                </label>
                <input
                  type="text"
                  value={editingItem.badge || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                  placeholder="Məsələn: Rəsmi İcma, Canlı Qrup"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="socActive"
                  checked={editingItem.is_active}
                  onChange={(e) => setEditingItem({ ...editingItem, is_active: e.target.checked })}
                />
                <label htmlFor="socActive" style={{ fontSize: '0.88rem' }}>Aktiv olsun (Tələbələr görsün)</label>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Yadda Saxla
                </button>
                <button type="button" className="btn-secondary" onClick={() => setModalType(null)}>
                  Ləğv Et
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
