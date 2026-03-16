import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ImageIcon, LayoutDashboard, LogOut, RotateCcw,
  Upload, Download, Eye, Shield, X, Plus, Trash2,
  ChevronUp, ChevronDown, CalendarDays, MapPin, Tag,
  DollarSign, FileText, Plane, BedDouble, Ticket, User, MessageSquare, Save,
} from 'lucide-react';
import { DEFAULT_IMAGES, type ImageKey } from '../imageConfig';
import { useImageConfig } from '../hooks/useImageConfig';
import { useContentConfig } from '../hooks/useContentConfig';
import type { EventHighlight, TrendingPackage, Testimonial } from '../types';

/* ── Auth ───────────────────────────────────────────────────────── */
const ADMIN_PASSWORD = 'emais2025';
const AUTH_KEY = 'emais_admin_auth';

/* ── Types ──────────────────────────────────────────────────────── */
type Tab = 'hero' | 'events' | 'packages' | 'testimonials';

/* ── Small helpers ──────────────────────────────────────────────── */
function ImgPreview({ src, size = 80 }: { src: string; size?: number }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div style={{ width: size, height: size, borderRadius: 8, background: '#101f35', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #1a3150' }}>
        <ImageIcon size={size / 3} color="#4a6f93" />
      </div>
    );
  }
  return (
    <img
      src={src} alt="preview"
      style={{ width: size, height: size, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: '1px solid #1a3150' }}
      onError={() => setErr(true)}
    />
  );
}

function Field({ label, value, onChange, type = 'text', mono }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; mono?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, color: '#4a6f93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          background: '#060f1c', border: '1px solid #1a3150', borderRadius: 7,
          color: '#e8edf2', fontSize: mono ? 11 : 13, fontFamily: mono ? 'monospace' : 'inherit',
          padding: '9px 12px', outline: 'none', width: '100%', boxSizing: 'border-box',
        }}
        onFocus={e => { e.target.style.borderColor = '#c8a84b'; }}
        onBlur={e => { e.target.style.borderColor = '#1a3150'; }}
      />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, color: '#4a6f93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        style={{
          background: '#060f1c', border: '1px solid #1a3150', borderRadius: 7,
          color: '#e8edf2', fontSize: 13, padding: '9px 12px', outline: 'none',
          width: '100%', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit',
        }}
        onFocus={e => { e.target.style.borderColor = '#c8a84b'; }}
        onBlur={e => { e.target.style.borderColor = '#1a3150'; }}
      />
    </div>
  );
}

/* ── Image Upload Field ─────────────────────────────────────────── */
const ADMIN_TOKEN = 'emais2025';

function ImageUploadField({ label, value, onChange }: {
  label: string; value: string; onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo: 5 MB.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
        body: form,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erro no upload');
      onChange(json.url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Falha no upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const isBase64 = value?.startsWith('data:');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ fontSize: 11, color: '#4a6f93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>

      {/* Drop zone + preview */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          display: 'flex', gap: 12, alignItems: 'flex-start',
          background: '#060f1c', border: '1px dashed #1a3150', borderRadius: 8, padding: 10,
        }}
      >
        {/* Preview */}
        <div style={{ flexShrink: 0 }}>
          <ImgPreview src={value} size={72} />
        </div>

        {/* Controls */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* Upload button */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
              background: uploading ? '#0a1e35' : '#0d2540',
              color: uploading ? '#4a6f93' : '#7bc4e8',
              border: '1px solid #1a3150', borderRadius: 7,
              fontSize: 12, fontWeight: 600, cursor: uploading ? 'wait' : 'pointer',
            }}
          >
            <Upload size={13} />
            {uploading ? 'Enviando…' : 'Subir imagem'}
          </button>

          {/* URL input (fallback / alternativa) */}
          <input
            type="url"
            value={isBase64 ? '' : value}
            placeholder={isBase64 ? '(imagem enviada)' : 'https://... (ou suba um arquivo)'}
            onChange={e => onChange(e.target.value)}
            style={{
              background: '#09182a', border: '1px solid #1a3150', borderRadius: 7,
              color: '#e8edf2', fontSize: 11, fontFamily: 'monospace',
              padding: '7px 10px', outline: 'none', width: '100%', boxSizing: 'border-box',
            }}
            onFocus={e => { e.target.style.borderColor = '#c8a84b'; }}
            onBlur={e => { e.target.style.borderColor = '#1a3150'; }}
          />

          {/* Hint */}
          <span style={{ fontSize: 10, color: '#4a6f93' }}>
            {isBase64 ? '✅ Imagem enviada (arquivo local)' : 'Arraste ou clique em "Subir imagem" · máx. 5 MB'}
          </span>

          {error && (
            <span style={{ fontSize: 11, color: '#ff6b6b' }}>⚠ {error}</span>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
      />
    </div>
  );
}

/* ── Hero Gallery Tab ───────────────────────────────────────────── */
const HERO_ITEMS: { key: ImageKey; label: string }[] = [
  { key: 'hero_col1_1', label: 'Coluna 1 — Imagem 1' }, { key: 'hero_col1_2', label: 'Coluna 1 — Imagem 2' },
  { key: 'hero_col1_3', label: 'Coluna 1 — Imagem 3' }, { key: 'hero_col1_4', label: 'Coluna 1 — Imagem 4' },
  { key: 'hero_col2_1', label: 'Coluna 2 — Imagem 1' }, { key: 'hero_col2_2', label: 'Coluna 2 — Imagem 2' },
  { key: 'hero_col2_3', label: 'Coluna 2 — Imagem 3' }, { key: 'hero_col2_4', label: 'Coluna 2 — Imagem 4' },
  { key: 'hero_col3_1', label: 'Coluna 3 — Imagem 1' }, { key: 'hero_col3_2', label: 'Coluna 3 — Imagem 2' },
  { key: 'hero_col3_3', label: 'Coluna 3 — Imagem 3' }, { key: 'hero_col3_4', label: 'Coluna 3 — Imagem 4' },
];

function HeroImageRow({ imgKey, label }: { imgKey: ImageKey; label: string }) {
  const { getImage, updateImage, overrides } = useImageConfig();
  const [val, setVal] = useState(getImage(imgKey));
  const [saved, setSaved] = useState(false);
  const isCustom = !!overrides[imgKey];

  const save = () => { updateImage(imgKey, val); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const reset = () => { updateImage(imgKey, DEFAULT_IMAGES[imgKey]); setVal(DEFAULT_IMAGES[imgKey]); };

  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: '#060f1c', border: '1px solid #142030', borderRadius: 10, padding: 14 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, width: 90 }}>
        <div style={{ position: 'relative' }}>
          <ImgPreview src={val} size={80} />
          {isCustom && <span style={{ position: 'absolute', top: -6, right: -6, background: '#c8a84b', color: '#000', fontSize: 9, fontWeight: 800, padding: '2px 5px', borderRadius: 4 }}>✱</span>}
        </div>
        <span style={{ fontSize: 10, color: '#4a6f93', textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="url" value={val} onChange={e => setVal(e.target.value)} placeholder="https://..."
            style={{ flex: 1, background: '#09182a', border: '1px solid #1a3150', borderRadius: 7, color: '#e8edf2', fontSize: 12, padding: '9px 12px', outline: 'none', fontFamily: 'monospace' }}
            onFocus={e => { e.target.style.borderColor = '#c8a84b'; }}
            onBlur={e => { e.target.style.borderColor = '#1a3150'; }}
          />
          <button onClick={save} style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '9px 14px',
            background: saved ? '#0d3320' : '#0d2540', color: saved ? '#4ade80' : '#7bc4e8',
            border: `1px solid ${saved ? '#1a4030' : '#1a3150'}`, borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            <Save size={13} /> {saved ? 'Salvo!' : 'Salvar'}
          </button>
        </div>
        {isCustom && (
          <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', fontSize: 11, color: '#4a6f93', cursor: 'pointer', padding: 0 }}>
            <RotateCcw size={11} /> Restaurar padrão
          </button>
        )}
      </div>
    </div>
  );
}

function HeroTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{ fontSize: 13, color: '#4a6f93', margin: '0 0 8px' }}>12 imagens que compõem a galeria animada com scroll automático no topo da página.</p>
      {HERO_ITEMS.map(item => <HeroImageRow key={item.key} imgKey={item.key} label={item.label} />)}
    </div>
  );
}

/* ── Events Tab ─────────────────────────────────────────────────── */
function EventCard({ event, index, total, onUpdate, onRemove, onReorder }: {
  event: EventHighlight; index: number; total: number;
  onUpdate: (d: Partial<EventHighlight>) => void;
  onRemove: () => void;
  onReorder: (dir: 'up' | 'down') => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: '#09182a', border: '1px solid #1a3150', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
        <ImgPreview src={event.img} size={52} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#e8edf2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.title || 'Sem título'}</div>
          <div style={{ fontSize: 12, color: '#4a6f93', marginTop: 2 }}>{event.location} · {event.date}</div>
        </div>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          <button onClick={e => { e.stopPropagation(); onReorder('up'); }} disabled={index === 0} style={iconBtn(index === 0)} title="Mover para cima"><ChevronUp size={14} /></button>
          <button onClick={e => { e.stopPropagation(); onReorder('down'); }} disabled={index === total - 1} style={iconBtn(index === total - 1)} title="Mover para baixo"><ChevronDown size={14} /></button>
          <button onClick={e => { e.stopPropagation(); if (confirm('Remover este evento?')) onRemove(); }} style={iconBtn(false, true)} title="Remover"><Trash2 size={14} /></button>
        </div>
        <span style={{ color: '#4a6f93', fontSize: 12 }}>{open ? '▴' : '▾'}</span>
      </div>
      {open && (
        <div style={{ padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid #1a3150' }}>
          <div style={{ paddingTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="🏷️ Título" value={event.title} onChange={v => onUpdate({ title: v })} />
            <Field label="📍 Local" value={event.location} onChange={v => onUpdate({ location: v })} />
            <Field label="📅 Data" value={event.date} onChange={v => onUpdate({ date: v })} />
          </div>
          <ImageUploadField label="🖼️ Imagem" value={event.img} onChange={v => onUpdate({ img: v })} />
        </div>
      )}
    </div>
  );
}

function EventsTab() {
  const { events, updateEvent, addEvent, removeEvent, reorderEvent } = useContentConfig();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <p style={{ fontSize: 13, color: '#4a6f93', margin: 0 }}>Cards de eventos na seção "Explorar Eventos". Edições são salvas automaticamente.</p>
        <button onClick={addEvent} style={addBtn}><Plus size={14} /> Adicionar Evento</button>
      </div>
      {events.map((ev, i) => (
        <EventCard key={i} event={ev} index={i} total={events.length}
          onUpdate={d => updateEvent(i, d)}
          onRemove={() => removeEvent(i)}
          onReorder={dir => reorderEvent(i, dir === 'up' ? i - 1 : i + 1)}
        />
      ))}
      {events.length === 0 && <EmptyState text="Nenhum evento. Clique em Adicionar Evento." />}
    </div>
  );
}

/* ── Packages Tab ───────────────────────────────────────────────── */
const TAG_OPTIONS = ['NOVO LOTE', 'QUASE ESGOTADO', 'PREMIUM', 'POPULAR', 'EXCLUSIVO', 'DESTAQUE'];

function PackageCard({ pkg, index, total, onUpdate, onRemove, onReorder }: {
  pkg: TrendingPackage; index: number; total: number;
  onUpdate: (d: Partial<TrendingPackage>) => void;
  onRemove: () => void;
  onReorder: (dir: 'up' | 'down') => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: '#09182a', border: '1px solid #1a3150', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
        <ImgPreview src={pkg.img} size={52} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#e8edf2' }}>{pkg.title || 'Sem título'}</span>
            <span style={{ fontSize: 10, background: '#1a3150', color: '#c8a84b', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>{pkg.tag}</span>
          </div>
          <div style={{ fontSize: 12, color: '#4a6f93', marginTop: 2 }}>{pkg.date} · {pkg.loc} · R$ {pkg.price}</div>
        </div>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          <button onClick={e => { e.stopPropagation(); onReorder('up'); }} disabled={index === 0} style={iconBtn(index === 0)} title="Mover para cima"><ChevronUp size={14} /></button>
          <button onClick={e => { e.stopPropagation(); onReorder('down'); }} disabled={index === total - 1} style={iconBtn(index === total - 1)} title="Mover para baixo"><ChevronDown size={14} /></button>
          <button onClick={e => { e.stopPropagation(); if (confirm('Remover este pacote?')) onRemove(); }} style={iconBtn(false, true)} title="Remover"><Trash2 size={14} /></button>
        </div>
        <span style={{ color: '#4a6f93', fontSize: 12 }}>{open ? '▴' : '▾'}</span>
      </div>
      {open && (
        <div style={{ padding: '0 16px 20px', borderTop: '1px solid #1a3150' }}>
          <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Row 1: basics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              <Field label="🏷️ Título" value={pkg.title} onChange={v => onUpdate({ title: v })} />
              <Field label="📍 Local (loc)" value={pkg.loc} onChange={v => onUpdate({ loc: v })} />
              <Field label="📅 Data" value={pkg.date} onChange={v => onUpdate({ date: v })} />
              <Field label="💰 Preço (só números)" value={pkg.price} onChange={v => onUpdate({ price: v })} />
              <Field label="🔤 Badge (sigla)" value={pkg.badge} onChange={v => onUpdate({ badge: v })} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 11, color: '#4a6f93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>🏅 Tag do Card</label>
                <select
                  value={pkg.tag}
                  onChange={e => onUpdate({ tag: e.target.value })}
                  style={{ background: '#060f1c', border: '1px solid #1a3150', borderRadius: 7, color: '#e8edf2', fontSize: 13, padding: '9px 12px', outline: 'none' }}
                >
                  {TAG_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  {!TAG_OPTIONS.includes(pkg.tag) && <option value={pkg.tag}>{pkg.tag}</option>}
                </select>
              </div>
            </div>

            <ImageUploadField label="🖼️ Imagem do Card" value={pkg.img} onChange={v => onUpdate({ img: v })} />

            {/* Description and details */}
            <Textarea label="📝 Descrição" value={pkg.description ?? ''} onChange={v => onUpdate({ description: v })} rows={3} />

            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ background: '#1a3150', padding: 8, borderRadius: 8, marginTop: 24, flexShrink: 0 }}><Plane size={16} color="#7bc4e8" /></div>
                <div style={{ flex: 1 }}>
                  <Textarea label="✈️ Detalhes do Voo" value={pkg.flightDetails ?? ''} onChange={v => onUpdate({ flightDetails: v })} rows={2} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ background: '#1a3150', padding: 8, borderRadius: 8, marginTop: 24, flexShrink: 0 }}><BedDouble size={16} color="#7bc4e8" /></div>
                <div style={{ flex: 1 }}>
                  <Textarea label="🏨 Detalhes da Hospedagem" value={pkg.hotelDetails ?? ''} onChange={v => onUpdate({ hotelDetails: v })} rows={2} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ background: '#1a3150', padding: 8, borderRadius: 8, marginTop: 24, flexShrink: 0 }}><Ticket size={16} color="#7bc4e8" /></div>
                <div style={{ flex: 1 }}>
                  <Textarea label="🎟️ Detalhes dos Ingressos" value={pkg.ticketDetails ?? ''} onChange={v => onUpdate({ ticketDetails: v })} rows={2} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PackagesTab() {
  const { packages, updatePackage, addPackage, removePackage, reorderPackage } = useContentConfig();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <p style={{ fontSize: 13, color: '#4a6f93', margin: 0 }}>Cards da seção "Pacotes em Alta". Todos os campos visíveis no modal de detalhes são editáveis aqui.</p>
        <button onClick={addPackage} style={addBtn}><Plus size={14} /> Adicionar Pacote</button>
      </div>
      {packages.map((pkg, i) => (
        <PackageCard key={i} pkg={pkg} index={i} total={packages.length}
          onUpdate={d => updatePackage(i, d)}
          onRemove={() => removePackage(i)}
          onReorder={dir => reorderPackage(i, dir === 'up' ? i - 1 : i + 1)}
        />
      ))}
      {packages.length === 0 && <EmptyState text="Nenhum pacote. Clique em Adicionar Pacote." />}
    </div>
  );
}

/* ── Testimonials Tab ───────────────────────────────────────────── */
function TestimonialCard({ item, index, total, onUpdate, onRemove, onReorder }: {
  item: Testimonial; index: number; total: number;
  onUpdate: (d: Partial<Testimonial>) => void;
  onRemove: () => void;
  onReorder: (dir: 'up' | 'down') => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: '#09182a', border: '1px solid #1a3150', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
        <ImgPreview src={item.img} size={52} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#e8edf2' }}>{item.user || 'Sem nome'}</div>
          <div style={{ fontSize: 12, color: '#4a6f93', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.text}</div>
        </div>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          <button onClick={e => { e.stopPropagation(); onReorder('up'); }} disabled={index === 0} style={iconBtn(index === 0)} title="Mover para cima"><ChevronUp size={14} /></button>
          <button onClick={e => { e.stopPropagation(); onReorder('down'); }} disabled={index === total - 1} style={iconBtn(index === total - 1)} title="Mover para baixo"><ChevronDown size={14} /></button>
          <button onClick={e => { e.stopPropagation(); if (confirm('Remover este depoimento?')) onRemove(); }} style={iconBtn(false, true)} title="Remover"><Trash2 size={14} /></button>
        </div>
        <span style={{ color: '#4a6f93', fontSize: 12 }}>{open ? '▴' : '▾'}</span>
      </div>
      {open && (
        <div style={{ padding: '0 16px 20px', borderTop: '1px solid #1a3150' }}>
          <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="👤 Nome do Cliente" value={item.user} onChange={v => onUpdate({ user: v })} />
              <Field label="💬 Texto do Depoimento" value={item.text} onChange={v => onUpdate({ text: v })} />
            </div>
            <ImageUploadField label="🖼️ Imagem (foto/vídeo)" value={item.img} onChange={v => onUpdate({ img: v })} />
          </div>
        </div>
      )}
    </div>
  );
}

function TestimonialsTab() {
  const { testimonials, updateTestimonial, addTestimonial, removeTestimonial, reorderTestimonial } = useContentConfig();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <p style={{ fontSize: 13, color: '#4a6f93', margin: 0 }}>Cards da seção "Acredite no Sucesso". Aparecem em formato stories (9:16).</p>
        <button onClick={addTestimonial} style={addBtn}><Plus size={14} /> Adicionar Depoimento</button>
      </div>
      {testimonials.map((t, i) => (
        <TestimonialCard key={i} item={t} index={i} total={testimonials.length}
          onUpdate={d => updateTestimonial(i, d)}
          onRemove={() => removeTestimonial(i)}
          onReorder={dir => reorderTestimonial(i, dir === 'up' ? i - 1 : i + 1)}
        />
      ))}
      {testimonials.length === 0 && <EmptyState text="Nenhum depoimento. Clique em Adicionar Depoimento." />}
    </div>
  );
}

/* ── Util components ────────────────────────────────────────────── */
function EmptyState({ text }: { text: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#4a6f93', fontSize: 14, background: '#09182a', borderRadius: 12, border: '1px dashed #1a3150' }}>
      {text}
    </div>
  );
}

/* ── Style helpers ──────────────────────────────────────────────── */
const iconBtn = (disabled: boolean, danger = false): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 30, height: 30, borderRadius: 6, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
  background: disabled ? '#091624' : danger ? '#2a0a0a' : '#0d2540',
  color: disabled ? '#2a3a4a' : danger ? '#ff6b6b' : '#7bc4e8',
  flexShrink: 0,
});

const addBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px',
  background: 'linear-gradient(135deg, #c8a84b, #a8882b)', color: '#000',
  border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
};

/* ── Login Screen ───────────────────────────────────────────────── */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { sessionStorage.setItem(AUTH_KEY, '1'); onLogin(); }
    else { setError(true); setShake(true); setTimeout(() => setShake(false), 500); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #050e1a 0%, #0a1e35 50%, #050e1a 100%)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <form onSubmit={handleSubmit} style={{
        background: '#0d1f33', border: '1px solid #1e3a5a', borderRadius: 16,
        padding: '40px 36px', width: 360, display: 'flex', flexDirection: 'column', gap: 16,
        boxShadow: '0 24px 64px rgba(0,0,0,.6)',
        animation: shake ? 'shake .4s ease' : 'none',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Shield size={36} color="#c8a84b" /></div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', textAlign: 'center', margin: 0 }}>Painel Admin</h1>
        <p style={{ fontSize: 13, color: '#4a6f93', textAlign: 'center', margin: 0 }}>E-Mais · Gerenciador de Conteúdo</p>
        <input
          type="password" value={pw} onChange={e => { setPw(e.target.value); setError(false); }}
          placeholder="Senha de acesso" autoFocus
          style={{ background: '#091624', border: `1px solid ${error ? '#e55' : '#1e3a5a'}`, borderRadius: 8, color: '#fff', fontSize: 14, padding: '12px 14px', outline: 'none' }}
        />
        {error && <p style={{ color: '#ff6b6b', fontSize: 12, margin: 0 }}>Senha incorreta.</p>}
        <button type="submit" style={{ background: 'linear-gradient(135deg, #c8a84b, #a8882b)', color: '#000', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 8, padding: 13, cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
      <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }`}</style>
    </div>
  );
}

/* ── Main Admin Panel ───────────────────────────────────────────── */
export default function ImageAdmin() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === '1');
  const [tab, setTab] = useState<Tab>('packages');
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const { exportConfig: exportContent, importConfig: importContent, resetAll: resetContent } = useContentConfig();
  const { exportConfig: exportImages, importConfig: importImages, resetAll: resetImages } = useImageConfig();

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleExport = () => {
    const data = { content: JSON.parse(exportContent()), images: JSON.parse(exportImages()) };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'emais-config.json'; a.click();
    URL.revokeObjectURL(url);
    showToast('Configuração exportada com sucesso!');
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText);
      if (parsed.content) importContent(JSON.stringify(parsed.content));
      if (parsed.images) importImages(JSON.stringify(parsed.images));
      showToast('Configuração importada com sucesso!');
      setImportText(''); setShowImport(false);
    } catch { showToast('JSON inválido.', 'error'); }
  };

  const handleReset = () => {
    resetContent(); resetImages();
    setShowResetConfirm(false);
    showToast('Tudo resetado para o padrão.');
  };

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'packages', label: 'Pacotes em Alta', icon: '✈️' },
    { id: 'events', label: 'Eventos', icon: '🎟️' },
    { id: 'testimonials', label: 'Depoimentos', icon: '💬' },
    { id: 'hero', label: 'Galeria Hero', icon: '🖼️' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#060f1c', color: '#e8edf2', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, minWidth: 220, background: '#09182a', borderRight: '1px solid #1a3150', display: 'flex', flexDirection: 'column', padding: '24px 16px', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px 24px', fontSize: 15, fontWeight: 700, color: '#c8a84b', borderBottom: '1px solid #1a3150', marginBottom: 16 }}>
          <LayoutDashboard size={20} /> E-Mais Admin
        </div>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderRadius: 8, fontSize: 13, cursor: 'pointer', border: 'none', textAlign: 'left', width: '100%',
              background: tab === t.id ? '#0d2540' : 'transparent',
              color: tab === t.id ? '#c8a84b' : '#7a9db5',
              fontWeight: tab === t.id ? 700 : 400,
            }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </nav>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 16, borderTop: '1px solid #1a3150' }}>
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 8, fontSize: 13, cursor: 'pointer', border: 'none', background: '#0d2540', color: '#7bc4e8' }}>
            <Eye size={14} /> Ver Site
          </button>
          <button onClick={() => { sessionStorage.removeItem(AUTH_KEY); setAuthed(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 8, fontSize: 13, cursor: 'pointer', border: 'none', background: 'transparent', color: '#4a6f93', textAlign: 'left' }}>
            <LogOut size={14} /> Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '28px 32px 20px', borderBottom: '1px solid #1a3150', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
              {TABS.find(t => t.id === tab)?.icon} {TABS.find(t => t.id === tab)?.label}
            </h1>
            <p style={{ fontSize: 13, color: '#4a6f93', margin: 0 }}>Edições salvas automaticamente no localStorage do navegador.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: '#0d2540', color: '#7bc4e8', border: '1px solid #1a3150', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              <Download size={13} /> Exportar JSON
            </button>
            <button onClick={() => setShowImport(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: '#0d2540', color: '#7bc4e8', border: '1px solid #1a3150', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              <Upload size={13} /> Importar JSON
            </button>
            <button onClick={() => setShowResetConfirm(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: '#2a0a0a', color: '#ff6b6b', border: '1px solid #3a1a1a', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              <RotateCcw size={13} /> Resetar Tudo
            </button>
          </div>
        </header>

        {/* Import panel */}
        {showImport && (
          <div style={{ margin: '16px 32px', background: '#09182a', border: '1px solid #1a3150', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, fontWeight: 600, color: '#aac' }}>
              <span>Importar configuração JSON (emais-config.json)</span>
              <button onClick={() => setShowImport(false)} style={{ background: 'none', border: 'none', color: '#4a6f93', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <textarea value={importText} onChange={e => setImportText(e.target.value)} rows={5}
              placeholder='Cole aqui o conteúdo exportado...'
              style={{ background: '#060f1c', border: '1px solid #1a3150', borderRadius: 8, color: '#e8edf2', fontSize: 12, fontFamily: 'monospace', padding: 12, resize: 'vertical', outline: 'none' }}
            />
            <button onClick={handleImport} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: 'linear-gradient(135deg, #c8a84b, #a8882b)', color: '#000', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start' }}>
              <Upload size={13} /> Aplicar Configuração
            </button>
          </div>
        )}

        {/* Tab content */}
        <div style={{ padding: '24px 32px', flex: 1 }}>
          {tab === 'hero' && <HeroTab />}
          {tab === 'events' && <EventsTab />}
          {tab === 'packages' && <PackagesTab />}
          {tab === 'testimonials' && <TestimonialsTab />}
        </div>
      </main>

      {/* Reset confirm modal */}
      {showResetConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#09182a', border: '1px solid #1a3150', borderRadius: 14, padding: 32, maxWidth: 420, width: '90%', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>Resetar tudo?</h2>
            <p style={{ fontSize: 14, color: '#4a6f93', margin: 0, lineHeight: 1.5 }}>Isso vai restaurar todos os textos, imagens e cards para o conteúdo original. Esta ação não pode ser desfeita.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowResetConfirm(false)} style={{ padding: '9px 16px', background: '#0d2540', color: '#7bc4e8', border: '1px solid #1a3150', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleReset} style={{ padding: '9px 16px', background: '#2a0a0a', color: '#ff6b6b', border: '1px solid #3a1a1a', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Sim, resetar tudo</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, padding: '14px 22px', borderRadius: 10,
          fontSize: 14, fontWeight: 600, zIndex: 9999,
          background: toast.type === 'error' ? '#2a0a0a' : '#0d3320',
          color: toast.type === 'error' ? '#ff6b6b' : '#4ade80',
          border: `1px solid ${toast.type === 'error' ? '#3a1a1a' : '#1a4030'}`,
          animation: 'slideIn .3s ease',
        }}>
          {toast.msg}
        </div>
      )}
      <style>{`@keyframes slideIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }`}</style>
    </div>
  );
}

// Re-export unused icon references to avoid lint warnings
const _unused = [CalendarDays, MapPin, Tag, DollarSign, FileText, User, MessageSquare];
void _unused;
