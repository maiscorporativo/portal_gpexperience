import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ImageIcon, LayoutDashboard, LogOut, RotateCcw,
  Upload, Download, Eye, Shield, X, Plus, Trash2,
  ChevronUp, ChevronDown, CalendarDays, MapPin, Tag,
  DollarSign, FileText, Plane, BedDouble, Ticket, User, MessageSquare, Save,
  Flame, AlertTriangle, Award, Type, Package, ImageIcon as ImgIcon, CheckCircle2, XCircle, Globe2, Clock,
} from 'lucide-react';
import { DEFAULT_IMAGES, type ImageKey } from '../imageConfig';
import { useImageConfig } from '../hooks/useImageConfig';
import { useContentConfig } from '../hooks/useContentConfig';
import type { TrendingPackage } from '../types';
import { useToast } from '../components/ui/ToastProvider';

/* ── Auth ───────────────────────────────────────────────────────── */
const AUTH_KEY = 'emais_admin_auth';

/* ── Types ──────────────────────────────────────────────────────── */
type Tab = 'hero' | 'platinum' | 'packages' | 'trending' | 'categories' | 'trash';

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

function Field({ label, icon, value, onChange, type = 'text', mono }: {
  label: string; icon?: React.ReactNode; value: string; onChange: (v: string) => void; type?: string; mono?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, color: '#4a6f93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 4 }}>{icon}{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          background: '#060f1c', border: '1px solid #1a3150', borderRadius: 7,
          color: '#e8edf2', fontSize: mono ? 11 : 13, fontFamily: mono ? 'monospace' : 'inherit',
          padding: '9px 12px', outline: 'none', width: '100%', boxSizing: 'border-box',
        }}
        onFocus={e => { e.target.style.borderColor = '#f37126'; }}
        onBlur={e => { e.target.style.borderColor = '#1a3150'; }}
      />
    </div>
  );
}

function Textarea({ label, icon, value, onChange, rows = 3 }: {
  label: string; icon?: React.ReactNode; value: string; onChange: (v: string) => void; rows?: number;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, color: '#4a6f93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 4 }}>{icon}{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        style={{
          background: '#060f1c', border: '1px solid #1a3150', borderRadius: 7,
          color: '#e8edf2', fontSize: 13, padding: '9px 12px', outline: 'none',
          width: '100%', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit',
        }}
        onFocus={e => { e.target.style.borderColor = '#f37126'; }}
        onBlur={e => { e.target.style.borderColor = '#1a3150'; }}
      />
    </div>
  );
}

/* ── Image Upload Field ─────────────────────────────────────────── */

function ImageUploadField({ label, labelIcon, value, onChange }: {
  label: string; labelIcon?: React.ReactNode; value: string; onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN ?? 'emais2025';

  const handleFile = async (file: File) => {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) { setError('Arquivo muito grande. Máximo: 5 MB.'); return; }
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) { setError('Use JPEG, PNG, WebP ou GIF.'); return; }

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
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Erro ${res.status}`);
      }
      const { url } = await res.json();
      onChange(url); // ex: /uploads/1234567-abc.jpg
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Falha no upload.';
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const isUploaded = value?.startsWith('/uploads/');
  const isBase64   = value?.startsWith('data:'); // legado

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ fontSize: 11, color: '#4a6f93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 4 }}>{labelIcon}{label}</label>

      <div
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#060f1c', border: '1px dashed #1a3150', borderRadius: 8, padding: 10 }}
      >
        <div style={{ flexShrink: 0 }}>
          <ImgPreview src={value} size={72} />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
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

          <input
            type="url"
            value={isBase64 ? '' : (value || '')}
            placeholder={isBase64 ? '(imagem legada — re-envie)' : 'https://... (ou arraste/clique acima)'}
            onChange={e => onChange(e.target.value)}
            style={{
              background: '#09182a', border: '1px solid #1a3150', borderRadius: 7,
              color: '#e8edf2', fontSize: 11, fontFamily: 'monospace',
              padding: '7px 10px', outline: 'none', width: '100%', boxSizing: 'border-box',
            }}
            onFocus={e => { e.target.style.borderColor = '#f37126'; }}
            onBlur={e => { e.target.style.borderColor = '#1a3150'; }}
          />

          <span style={{ fontSize: 10, color: isUploaded ? '#4ade80' : '#4a6f93' }}>
            {isUploaded ? '✅ Imagem enviada (servidor)' : isBase64 ? '⚠️ Base64 legado — re-envie o arquivo' : 'Arraste ou clique em "Subir imagem" · máx. 5 MB'}
          </span>

          {error && <span style={{ fontSize: 11, color: '#ff6b6b' }}>⚠ {error}</span>}
        </div>
      </div>

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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const isCustom = !!overrides[imgKey];
  const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN ?? 'emais2025';

  const save = () => { updateImage(imgKey, val); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const reset = () => { updateImage(imgKey, DEFAULT_IMAGES[imgKey]); setVal(DEFAULT_IMAGES[imgKey]); };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { setUploadError('Apenas imagens são permitidas.'); return; }
    setUploading(true);
    setUploadError('');
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
        body: form,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Erro ${res.status}`);
      }
      const { url } = await res.json();
      setVal(url);
      updateImage(imgKey, url);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : 'Falha no upload.');
    } finally {
      setUploading(false);
    }
  };

  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: '#060f1c', border: `1px ${dragging ? 'dashed' : 'solid'} ${dragging ? '#f37126' : '#142030'}`, borderRadius: 10, padding: 14, transition: 'border-color .15s' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, width: 90 }}>
        <div style={{ position: 'relative' }}>
          <ImgPreview src={val} size={80} />
        </div>
        <span style={{ fontSize: 10, color: '#4a6f93', textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {dragging ? (
          <div style={{ textAlign: 'center', padding: '16px 0', fontSize: 13, color: '#f37126', fontWeight: 600 }}>
            📂 Solte para substituir a imagem
          </div>
        ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="url" value={val?.startsWith('/uploads/') ? val : (val?.startsWith('data:') ? '' : val)} onChange={e => setVal(e.target.value)}
            placeholder={val?.startsWith('/uploads/') ? val : val?.startsWith('data:') ? '⚠ Base64 legado — re-envie' : 'https://... ou arraste aqui'}
            style={{ flex: 1, background: '#09182a', border: '1px solid #1a3150', borderRadius: 7, color: '#e8edf2', fontSize: 12, padding: '9px 12px', outline: 'none', fontFamily: 'monospace' }}
            onFocus={e => { e.target.style.borderColor = '#f37126'; }}
            onBlur={e => { e.target.style.borderColor = '#1a3150'; }}
          />
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = ''; }} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            title="Fazer upload de arquivo"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '9px 12px',
              background: '#09182a', color: uploading ? '#f37126' : '#7bc4e8',
              border: '1px solid #1a3150', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: uploading ? 'wait' : 'pointer', whiteSpace: 'nowrap',
            }}
          >
            <Upload size={13} />{uploading ? '…' : ''}
          </button>
          <button onClick={save} style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '9px 14px',
            background: saved ? '#0d3320' : '#0d2540', color: saved ? '#4ade80' : '#7bc4e8',
            border: `1px solid ${saved ? '#1a4030' : '#1a3150'}`, borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            <Save size={13} /> {saved ? 'Salvo!' : 'Salvar'}
          </button>
        </div>
        )}
        {uploadError && <span style={{ fontSize: 11, color: '#ff6b6b' }}>⚠ {uploadError}</span>}
        {isCustom && (
          <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', fontSize: 11, color: '#4a6f93', cursor: 'pointer', padding: 0 }}>
            <RotateCcw size={11} /> Restaurar padrão
          </button>
        )}
        {!dragging && <span style={{ fontSize: 10, color: val?.startsWith('/uploads/') ? '#4ade80' : '#4a6f93' }}>
          {val?.startsWith('/uploads/') ? '✅ Imagem no servidor' : 'Arraste ou clique em ↑ para selecionar arquivo'}
        </span>}
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

/* ── Platinum Access Tab ───────────────────────────────────── */
const PLATINUM_ITEMS: { key: ImageKey; label: string }[] = [
  { key: 'platinum_col1_1', label: 'Coluna 1 — Imagem 1' },
  { key: 'platinum_col1_2', label: 'Coluna 1 — Imagem 2' },
  { key: 'platinum_col1_3', label: 'Coluna 1 — Imagem 3' },
  { key: 'platinum_col1_4', label: 'Coluna 1 — Imagem 4' },
  { key: 'platinum_col1_5', label: 'Coluna 1 — Imagem 5' },
  { key: 'platinum_col1_6', label: 'Coluna 1 — Imagem 6' },
  { key: 'platinum_col2_1', label: 'Coluna 2 — Imagem 1' },
  { key: 'platinum_col2_2', label: 'Coluna 2 — Imagem 2' },
  { key: 'platinum_col2_3', label: 'Coluna 2 — Imagem 3' },
  { key: 'platinum_col2_4', label: 'Coluna 2 — Imagem 4' },
  { key: 'platinum_col2_5', label: 'Coluna 2 — Imagem 5' },
  { key: 'platinum_col2_6', label: 'Coluna 2 — Imagem 6' },
];

function PlatinumTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{ fontSize: 13, color: '#4a6f93', margin: '0 0 8px' }}>12 imagens da grade animada na seção "Acesso Platinum" (2 colunas × 6 imagens).</p>
      {PLATINUM_ITEMS.map(item => <HeroImageRow key={item.key} imgKey={item.key} label={item.label} />)}
    </div>
  );
}

/* ── Events Tab ─────────────────────────────────────────────────── */


/* ── Trending Tab ───────────────────────────────────────────────── */
function TrendingTab() {
  const { packages, updatePackage } = useContentConfig();
  const trending = packages.filter(p => p.isTrending === true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ marginBottom: 4 }}>
        <p style={{ fontSize: 13, color: '#4a6f93', margin: 0 }}>
          Pacotes marcados como 🔥 <strong style={{ color: '#f37126' }}>Em Alta</strong>. Estes aparecem no carrossel principal do site. Máximo de {MAX_TRENDING}.
        </p>
      </div>
      {trending.length === 0 && <EmptyState text="Nenhum pacote marcado como Em Alta. Vá em Pacotes e ative o toggle 🔥." />}
      {trending.map(pkg => {
        const realIdx = packages.findIndex(p => p === pkg);
        return (
          <div key={realIdx} style={{ background: '#09182a', border: '1px solid #f37126', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
            <ImgPreview src={pkg.img} size={52} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#e8edf2' }}>{pkg.title || 'Sem título'}</span>
                <span style={{ fontSize: 10, background: '#1a3150', color: '#f37126', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>{pkg.tag}</span>
                {pkg.category
                  ? <span style={{ fontSize: 10, background: '#142030', color: '#7bc4e8', padding: '2px 8px', borderRadius: 12 }}>{pkg.category}</span>
                  : <span style={{ fontSize: 10, background: '#2a1a00', color: '#fbbf24', padding: '2px 8px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 4 }}>⚠ Sem categoria</span>
                }
              </div>
              <div style={{ fontSize: 12, color: '#4a6f93', marginTop: 2 }}>{pkg.date} · {pkg.loc} · {pkg.currency || 'BRL'} {pkg.price}</div>
            </div>
            <button
              type="button"
              title="Remover de Pacotes em Alta"
              onClick={() => updatePackage(realIdx, { isTrending: false })}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: '#1a3150', color: '#7bc4e8', border: '1px solid #1a3150', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              <Flame size={13} /> Remover
            </button>
          </div>
        );
      })}
      <div style={{ marginTop: 8, padding: '10px 14px', background: '#09182a', border: '1px solid #1a3150', borderRadius: 8, fontSize: 12, color: '#4a6f93' }}>
        {trending.length}/{MAX_TRENDING} slots usados
        <span style={{ display: 'inline-block', width: `${(trending.length / MAX_TRENDING) * 100}%`, height: 4, background: trending.length >= MAX_TRENDING ? '#f87171' : '#f37126', borderRadius: 2, marginLeft: 8, verticalAlign: 'middle', maxWidth: 120 }} />
      </div>
    </div>
  );
}

/* ── Packages Tab ───────────────────────────────────────────────── */
const TAG_OPTIONS = ['NOVO LOTE', 'QUASE ESGOTADO', 'PREMIUM', 'POPULAR', 'EXCLUSIVO', 'DESTAQUE'];

const CURRENCIES = [
  { code: 'BRL', symbol: 'R$', label: 'BRL — Real Brasileiro' },
  { code: 'USD', symbol: '$', label: 'USD — Dólar Americano' },
  { code: 'EUR', symbol: '€', label: 'EUR — Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP — Libra Esterlina' },
  { code: 'ARS', symbol: '$', label: 'ARS — Peso Argentino' },
  { code: 'CLP', symbol: '$', label: 'CLP — Peso Chileno' },
  { code: 'COP', symbol: '$', label: 'COP — Peso Colombiano' },
  { code: 'MXN', symbol: '$', label: 'MXN — Peso Mexicano' },
  { code: 'PYG', symbol: '₲', label: 'PYG — Guarani Paraguaio' },
  { code: 'UYU', symbol: '$U', label: 'UYU — Peso Uruguaio' },
  { code: 'PEN', symbol: 'S/', label: 'PEN — Sol Peruano' },
  { code: 'BOB', symbol: 'Bs', label: 'BOB — Boliviano' },
  { code: 'VES', symbol: 'Bs.S', label: 'VES — Bolívar Venezuelano' },
  { code: 'JPY', symbol: '¥', label: 'JPY — Iene Japonês' },
  { code: 'CNY', symbol: '¥', label: 'CNY — Yuan Chinês' },
  { code: 'AUD', symbol: 'A$', label: 'AUD — Dólar Australiano' },
  { code: 'CAD', symbol: 'C$', label: 'CAD — Dólar Canadense' },
  { code: 'CHF', symbol: 'Fr', label: 'CHF — Franco Suíço' },
  { code: 'AED', symbol: 'د.إ', label: 'AED — Dirham Emirados' },
  { code: 'QAR', symbol: '﷼', label: 'QAR — Riyal Catariano' },
  { code: 'SAR', symbol: '﷼', label: 'SAR — Riyal Saudita' },
  { code: 'ZAR', symbol: 'R', label: 'ZAR — Rand Sul-Africano' },
  { code: 'INR', symbol: '₹', label: 'INR — Rúpia Indiana' },
  { code: 'KRW', symbol: '₩', label: 'KRW — Won Sul-Coreano' },
  { code: 'SGD', symbol: 'S$', label: 'SGD — Dólar de Singapura' },
  { code: 'HKD', symbol: 'HK$', label: 'HKD — Dólar de Hong Kong' },
  { code: 'NZD', symbol: 'NZ$', label: 'NZD — Dólar Neozelandês' },
  { code: 'NOK', symbol: 'kr', label: 'NOK — Coroa Norueguesa' },
  { code: 'SEK', symbol: 'kr', label: 'SEK — Coroa Sueca' },
  { code: 'DKK', symbol: 'kr', label: 'DKK — Coroa Dinamarquesa' },
  { code: 'PLN', symbol: 'zł', label: 'PLN — Złoty Polonês' },
  { code: 'MXN', symbol: '$', label: 'MXN — Peso Mexicano' },
];

function CurrencySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, color: '#4a6f93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 4 }}><Globe2 size={11} /> Moeda</label>
      <select
        value={value || 'BRL'}
        onChange={e => onChange(e.target.value)}
        style={{ background: '#060f1c', border: '1px solid #1a3150', borderRadius: 7, color: '#e8edf2', fontSize: 13, padding: '9px 12px', outline: 'none' }}
        onFocus={e => { e.target.style.borderColor = '#f37126'; }}
        onBlur={e => { e.target.style.borderColor = '#1a3150'; }}
      >
        {CURRENCIES.map(c => (
          <option key={c.code} value={c.code}>{c.label}</option>
        ))}
      </select>
    </div>
  );
}

/* ── Currency-aware Price Mask Input ────────────────────────── */
const CURRENCY_LOCALES: Record<string, string> = {
  BRL: 'pt-BR', USD: 'en-US', EUR: 'de-DE', GBP: 'en-GB',
  ARS: 'es-AR', CLP: 'es-CL', COP: 'es-CO', MXN: 'es-MX',
  PYG: 'es-PY', UYU: 'es-UY', PEN: 'es-PE', BOB: 'es-BO',
  VES: 'es-VE', JPY: 'ja-JP', CNY: 'zh-CN', AUD: 'en-AU',
  CAD: 'en-CA', CHF: 'de-CH', AED: 'ar-AE', QAR: 'ar-QA',
  SAR: 'ar-SA', ZAR: 'en-ZA', INR: 'en-IN', KRW: 'ko-KR',
  SGD: 'en-SG', HKD: 'zh-HK', NZD: 'en-NZ', NOK: 'nb-NO',
  SEK: 'sv-SE', DKK: 'da-DK', PLN: 'pl-PL',
};

/** Returns a locale-formatted number string for display */
function formatPrice(rawDigits: string, currencyCode: string): string {
  const digits = rawDigits.replace(/\D/g, '');
  if (!digits) return '';
  const num = parseInt(digits, 10);
  const locale = CURRENCY_LOCALES[currencyCode] || 'pt-BR';
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(num);
}

/** Returns just the raw digits from a formatted string */
function stripFormatting(formatted: string): string {
  return formatted.replace(/\D/g, '');
}

function PriceMaskInput({
  price, currency, onPriceChange,
}: { price: string; currency: string; onPriceChange: (v: string) => void }) {
  const locale = CURRENCY_LOCALES[currency] || 'pt-BR';
  const currencyEntry = CURRENCIES.find(c => c.code === currency);
  const symbol = currencyEntry?.symbol ?? currency;
  const displayValue = price ? formatPrice(price, currency) : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = stripFormatting(e.target.value);
    onPriceChange(raw); // store raw digits
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, color: '#4a6f93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 4 }}>
        <DollarSign size={11} /> Preço
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <span style={{
          position: 'absolute', left: 10, fontSize: 12, color: '#f37126',
          fontWeight: 700, pointerEvents: 'none', userSelect: 'none',
        }}>{symbol}</span>
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          placeholder={new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(0)}
          style={{
            background: '#060f1c', border: '1px solid #1a3150', borderRadius: 7,
            color: '#e8edf2', fontSize: 13, padding: `9px 12px 9px ${symbol.length > 2 ? 40 : 32}px`,
            outline: 'none', width: '100%', boxSizing: 'border-box',
          }}
          onFocus={e => { e.target.style.borderColor = '#f37126'; }}
          onBlur={e => { e.target.style.borderColor = '#1a3150'; }}
        />
      </div>
    </div>
  );
}
const MAX_TRENDING = 8;

function PackageCard({ pkg, index, total, trendingCount, categories, onUpdate, onRemove, onReorder, onSetTrending, onSaved, isOpen, onToggle }: {
  pkg: TrendingPackage; index: number; total: number; trendingCount: number; categories: string[];
  onUpdate: (d: Partial<TrendingPackage>) => void;
  onRemove: () => void;
  onReorder: (dir: 'up' | 'down') => void;
  onSetTrending: (v: boolean) => void;
  onSaved?: () => void;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [trendMsg, setTrendMsg] = useState<string | null>(null);
  const [hasEdited, setHasEdited] = useState(false);

  const handleToggle = () => {
    if (isOpen && hasEdited) { onSaved?.(); setHasEdited(false); }
    onToggle();
  };

  const handleUpdate = (d: Partial<TrendingPackage>) => { onUpdate(d); setHasEdited(true); };

  const handleTrendToggle = () => {
    if (!pkg.isTrending && trendingCount >= MAX_TRENDING) {
      alert(`Limite atingido! Já existem ${MAX_TRENDING} pacotes em "Pacotes em Alta". Desative um antes de ativar este.`);
      return;
    }
    const next = !pkg.isTrending;
    onSetTrending(next); // direto — sem status: 'pending'
    const msg = next
      ? '🔥 Adicionado a Pacotes em Alta! Nenhuma aprovação necessária.'
      : '🔕 Removido de Pacotes em Alta.';
    setTrendMsg(msg);
    setTimeout(() => setTrendMsg(null), 3500);
  };
  return (
    <div style={{ background: '#09182a', border: '1px solid #1a3150', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer' }} onClick={handleToggle}>
        <ImgPreview src={pkg.img} size={52} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#e8edf2' }}>{pkg.title || 'Sem título'}</span>
            <span style={{ fontSize: 10, background: '#1a3150', color: '#f37126', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>{pkg.tag}</span>
          </div>
          <div style={{ fontSize: 12, color: '#4a6f93', marginTop: 2 }}>{pkg.date} · {pkg.loc} · {pkg.currency || 'BRL'} {pkg.price}</div>
        </div>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          <button onClick={e => { e.stopPropagation(); onReorder('up'); }} disabled={index === 0} style={iconBtn(index === 0)} title="Mover para cima"><ChevronUp size={14} /></button>
          <button onClick={e => { e.stopPropagation(); onReorder('down'); }} disabled={index === total - 1} style={iconBtn(index === total - 1)} title="Mover para baixo"><ChevronDown size={14} /></button>
          <button onClick={e => { e.stopPropagation(); if (confirm('Remover este pacote?')) onRemove(); }} style={iconBtn(false, true)} title="Remover"><Trash2 size={14} /></button>
        </div>
        <span style={{ color: '#4a6f93', fontSize: 12 }}>{isOpen ? '▴' : '▾'}</span>
      </div>
      {isOpen && (
        <div style={{ padding: '0 16px 20px', borderTop: '1px solid #1a3150' }}>
          <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Trend notification */}
            {trendMsg && (
              <div style={{
                background: trendMsg.startsWith('🔥') ? '#0d3320' : '#1a2030',
                border: `1px solid ${trendMsg.startsWith('🔥') ? '#1a5c38' : '#1a3150'}`,
                borderRadius: 8, padding: '10px 14px', fontSize: 12,
                color: trendMsg.startsWith('🔥') ? '#4ade80' : '#7bc4e8',
                display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600,
                animation: 'fadeIn .3s ease',
              }}>
                {trendMsg}
              </div>
            )}

            {/* Approval status warning */}
            {(!pkg.status || pkg.status === 'pending') && (
              <div style={{ background: '#3d2800', border: '1px solid #7a4f00', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#ffd57a', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span><Clock size={14} /> <strong>Enviado para aprovação,</strong> este pacote só aparecerá no site após aprovação.</span>
              </div>
            )}
            {pkg.status === 'rejected' && (
              <div style={{ background: '#3a0d0d', border: '1px solid #7a1a1a', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#f87171', display: 'flex', alignItems: 'center', gap: 8 }}>
                <XCircle size={14} /> <span><strong>Rejeitado por {pkg.rejectedBy ?? 'Master'},</strong> corrija e salve para reenviar para aprovação.</span>
              </div>
            )}
            {pkg.status === 'approved' && (
              <div style={{ background: '#0d3320', border: '1px solid #1a5c38', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={14} /> <span><strong>Aprovado por {pkg.approvedBy ?? 'Master'},</strong> este pacote está visível no site. Qualquer edição voltará para aprovação.</span>
              </div>
            )}
            {/* Audit trail */}
            <AuditTrail pkg={pkg} />

            {/* Row 1: basics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              <Field label="Título" icon={<Tag size={11} />} value={pkg.title} onChange={v => onUpdate({ title: v })} />
              <Field label="Local" icon={<MapPin size={11} />} value={pkg.loc} onChange={v => onUpdate({ loc: v })} />
              <Field label="Data" icon={<CalendarDays size={11} />} value={pkg.date} onChange={v => onUpdate({ date: v })} />
              <PriceMaskInput price={pkg.price} currency={pkg.currency || 'BRL'} onPriceChange={v => onUpdate({ price: v })} />
              <CurrencySelect value={pkg.currency || 'BRL'} onChange={v => onUpdate({ currency: v })} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 'span 2' }}>
                <ImageUploadField
                  label="Logo do Badge (imagem)"
                  labelIcon={<Award size={11} />}
                  value={pkg.badgeImg ?? ''}
                  onChange={v => onUpdate({ badgeImg: v })}
                />
                <Field label="Sigla (fallback se sem logo)" icon={<Type size={11} />} value={pkg.badge} onChange={v => onUpdate({ badge: v })} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 11, color: '#4a6f93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 4 }}><Award size={11} /> Tag do Card</label>
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

            {/* Categoria + Em Alta */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'end' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 11, color: '#4a6f93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 4 }}><Package size={11} /> Categoria</label>
                <select
                  value={pkg.category || ''}
                  onChange={e => onUpdate({ category: e.target.value })}
                  style={{ background: '#09182a', border: '1px solid #1a3150', borderRadius: 8, color: '#e8edf2', fontSize: 13, padding: '10px 12px', outline: 'none', cursor: 'pointer' }}
                  onFocus={e => { e.target.style.borderColor = '#f37126'; }}
                  onBlur={e => { e.target.style.borderColor = '#1a3150'; }}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              {/* Em Alta toggle */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingBottom: 2 }}>
                <label style={{ fontSize: 11, color: pkg.isTrending ? '#f37126' : '#4a6f93', fontWeight: pkg.isTrending ? 700 : 600, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}><Flame size={11} /> Em Alta</label>
                <button
                  type="button"
                  title="Aparece em Pacotes em Alta"
                  style={{
                    width: 44, height: 24, borderRadius: 12, border: 'none', cursor: pkg.isTrending || trendingCount < MAX_TRENDING ? 'pointer' : 'not-allowed', position: 'relative', transition: 'background .2s',
                    background: pkg.isTrending ? '#f37126' : '#1a3150', opacity: !pkg.isTrending && trendingCount >= MAX_TRENDING ? 0.5 : 1,
                  }}
                  onClick={handleTrendToggle}
                >
                  <span style={{
                    position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .2s',
                    left: pkg.isTrending ? 23 : 3,
                  }} />
                </button>
                <span style={{ fontSize: 10, color: pkg.isTrending ? '#f37126' : '#4a6f93' }}>{pkg.isTrending ? 'Sim' : 'Não'}</span>
              </div>
            </div>

              <ImageUploadField label="🖼️ Imagem do Card" value={pkg.img} onChange={v => handleUpdate({ img: v })} />

            {/* Description and details */}
            <Textarea label="Descrição" icon={<FileText size={11} />} value={pkg.description ?? ''} onChange={v => handleUpdate({ description: v })} rows={3} />

            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ background: '#1a3150', padding: 8, borderRadius: 8, marginTop: 24, flexShrink: 0 }}><Plane size={16} color="#7bc4e8" /></div>
                <div style={{ flex: 1 }}>
                  <Textarea label="Detalhes do Voo" icon={<Plane size={11} />} value={pkg.flightDetails ?? ''} onChange={v => onUpdate({ flightDetails: v })} rows={2} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ background: '#1a3150', padding: 8, borderRadius: 8, marginTop: 24, flexShrink: 0 }}><BedDouble size={16} color="#7bc4e8" /></div>
                <div style={{ flex: 1 }}>
                  <Textarea label="Detalhes da Hospedagem" icon={<BedDouble size={11} />} value={pkg.hotelDetails ?? ''} onChange={v => onUpdate({ hotelDetails: v })} rows={2} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ background: '#1a3150', padding: 8, borderRadius: 8, marginTop: 24, flexShrink: 0 }}><Ticket size={16} color="#7bc4e8" /></div>
                <div style={{ flex: 1 }}>
                  <Textarea label="Detalhes dos Ingressos" icon={<Ticket size={11} />} value={pkg.ticketDetails ?? ''} onChange={v => onUpdate({ ticketDetails: v })} rows={2} />
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
  const { packages, categories, updatePackage, addPackage, removePackage, reorderPackage, setPackageTrending } = useContentConfig();
  const { toast } = useToast();
  const [openRealIdx, setOpenRealIdx] = useState<number | null>(null);
  // Mostra apenas pacotes NÃO deletados
  const activePackages = packages
    .map((p, realIdx) => ({ p, realIdx }))
    .filter(({ p }) => !p.deletedAt);
  const trendingCount = activePackages.filter(({ p }) => p.isTrending === true).length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <p style={{ fontSize: 13, color: '#4a6f93', margin: 0 }}>
          Gerencie todos os pacotes. Use o toggle{' '}
          <span style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle', color: '#f37126', gap: 3 }}>
            <Flame size={13} /> <strong style={{ color: '#f37126' }}>Em Alta</strong>
          </span>{' '}
          para escolher quais aparecem no carrossel principal do site.
        </p>
        <button onClick={() => { addPackage(); toast('Pacote criado!', 'success'); }} style={addBtn}><Plus size={14} /> Adicionar Pacote</button>
      </div>
      {trendingCount >= MAX_TRENDING && (
        <div style={{ background: '#1a1400', border: '1px solid #7a4a00', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={13} /> <strong>Limite atingido:</strong> já há {MAX_TRENDING} pacotes em "Em Alta". Desative um antes de ativar outro.
        </div>
      )}
      {activePackages.map(({ p: pkg, realIdx }) => (
        <PackageCard key={realIdx} pkg={pkg} index={realIdx} total={packages.length} trendingCount={trendingCount} categories={categories}
          isOpen={openRealIdx === realIdx}
          onToggle={() => setOpenRealIdx(prev => prev === realIdx ? null : realIdx)}
          onUpdate={d => updatePackage(realIdx, d)}
          onSetTrending={v => setPackageTrending(realIdx, v)}
          onRemove={() => { removePackage(realIdx); toast('Pacote movido para a lixeira.', 'warning'); }}
          onReorder={dir => reorderPackage(realIdx, dir === 'up' ? realIdx - 1 : realIdx + 1)}
          onSaved={() => toast('Pacote atualizado!', 'success')}
        />
      ))}
      {activePackages.length === 0 && <EmptyState text="Nenhum pacote ativo. Verifique a Lixeira ou clique em Adicionar Pacote." />}
    </div>
  );
}

/* ── Sports Emoji Picker for Categories ─────────────────── */
const SPORT_EMOJIS = [
  // Futebol e bolas
  '⚽','🏀','🏈','⚾','🆓','🏐','🏉','🥏',
  // Raquetes e Mesas
  '🎾','🏓','🏸','🎱',
  // Combate
  '🥊','🥋','🤼‍♂️','🤺',
  // Corrida e Atletismo
  '🏃','🏃‍♂️','🏃‍♀️','🧘','🧘‍♂️','🤸','🤸‍♂️',
  // Peso e Ginástica
  '🏋️','🏋️‍♂️','⛹️','⛹️‍♂️',
  // Aquaticos
  '🏄','🏄‍♂️','🏄‍♀️','🏈️','🏈️‍♂️','🤽','🤽‍♂️','🚣','🚣‍♂️','🤿',
  // Ciclismo e Motor
  '🚴','🚴‍♂️','🚴‍♀️','🏐️','🏍️','🏁',
  // Inverno e Montanha
  '⛷️','🏂','🧗','🧗‍♂️','🛷','⛰️',
  // Alvo e Equestre
  '🎯','🏹','🏇',
  // Campo e Bastao
  '🏑','🏒','🥍','🪃','🏏','⛳','🏌️',
  // Skate e outros
  '🛹','🤾','🤾‍♂️','🧗‍♀️',
  // Prêmios e Geral
  '🏆','🥇','🥈','🥉','🏅','🎖️','🏟️','🎟️',
];

function EmojiPicker({ currentEmoji, onChange }: {
  currentEmoji: string;
  onChange: (emoji: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        title="Escolher emoji"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 36, height: 36, borderRadius: 8, fontSize: 20,
          background: open ? '#1a3150' : '#0d2540',
          border: `1px solid ${open ? '#f37126' : '#1a3150'}`,
          cursor: 'pointer', flexShrink: 0, transition: 'all .15s',
        }}
      >
        {currentEmoji || '⚽'}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 100,
          background: '#071527', border: '1px solid #1a3150', borderRadius: 10,
          padding: 10, width: 270, boxShadow: '0 8px 32px rgba(0,0,0,.6)',
        }}>
          <p style={{ fontSize: 10, color: '#4a6f93', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Escolha o emoji do esporte</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4, maxHeight: 210, overflowY: 'auto' }}>
            {SPORT_EMOJIS.map(emoji => (
              <button
                key={emoji}
                type="button"
                title={emoji}
                onClick={() => { onChange(emoji); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '100%', aspectRatio: '1', borderRadius: 6, border: 'none',
                  background: currentEmoji === emoji ? '#f37126' : '#0d2540',
                  fontSize: 18, cursor: 'pointer', transition: 'background .1s',
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{ marginTop: 8, width: '100%', background: 'none', border: '1px solid #1a3150', borderRadius: 6, color: '#4a6f93', fontSize: 11, padding: '5px 0', cursor: 'pointer' }}
          >Fechar</button>
        </div>
      )}
    </div>
  );
}


/* ── Categories Tab ───────────────────────────────────────────── */
function CategoriesTab() {
  const { categories, categoryIcons, addCategory, removeCategory, updateCategory, reorderCategory, updateCategoryIcon } = useContentConfig();
  const { toast } = useToast();
  const [newName, setNewName] = useState('');
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editVal, setEditVal] = useState('');

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    addCategory(trimmed);
    setNewName('');
    toast(`Categoria "${trimmed}" criada!`, 'success');
  };

  const startEdit = (i: number) => { setEditIdx(i); setEditVal(categories[i]); };
  const confirmEdit = () => {
    if (editIdx !== null && editVal.trim()) { updateCategory(editIdx, editVal); toast('Categoria atualizada!', 'info'); }
    setEditIdx(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#e8edf2', margin: 0 }}>Categorias</h2>
        <span style={{ fontSize: 12, color: '#4a6f93' }}>{categories.length} categori{categories.length !== 1 ? 'as' : 'a'}</span>
      </div>

      {/* Add new */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Nome da nova categoria..."
          style={{ flex: 1, background: '#060f1c', border: '1px solid #1a3150', borderRadius: 8, color: '#e8edf2', fontSize: 13, padding: '10px 12px', outline: 'none' }}
          onFocus={e => { e.target.style.borderColor = '#f37126'; }}
          onBlur={e => { e.target.style.borderColor = '#1a3150'; }}
        />
        <button
          onClick={handleAdd}
          disabled={!newName.trim()}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: newName.trim() ? 'linear-gradient(135deg, #f37126, #d45f1a)' : '#0d2540', color: newName.trim() ? '#000' : '#4a6f93', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: newName.trim() ? 'pointer' : 'not-allowed' }}
        >
          <Plus size={14} /> Adicionar
        </button>
      </div>

      {/* Helper text */}
      <p style={{ fontSize: 11, color: '#4a6f93', margin: '-8px 0 0' }}>Clique no emoji à esquerda de cada categoria para trocar o emoji do esporte.</p>

      {/* Category list */}
      {categories.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#4a6f93', fontSize: 13 }}>Nenhuma categoria. Adicione uma acima.</div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {categories.map((cat, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#09182a', border: '1px solid #1a3150', borderRadius: 8, padding: '10px 12px' }}>
            {/* Emoji picker */}
            <EmojiPicker
              currentEmoji={categoryIcons[cat] ?? ''}
              onChange={emoji => updateCategoryIcon(cat, emoji)}
            />

            {/* Reorder buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <button onClick={() => reorderCategory(i, i - 1)} disabled={i === 0} style={{ background: 'none', border: 'none', color: i === 0 ? '#1a3150' : '#4a6f93', cursor: i === 0 ? 'default' : 'pointer', padding: 0, lineHeight: 1 }}><ChevronUp size={13} /></button>
              <button onClick={() => reorderCategory(i, i + 1)} disabled={i === categories.length - 1} style={{ background: 'none', border: 'none', color: i === categories.length - 1 ? '#1a3150' : '#4a6f93', cursor: i === categories.length - 1 ? 'default' : 'pointer', padding: 0, lineHeight: 1 }}><ChevronDown size={13} /></button>
            </div>

            {editIdx === i ? (
              <input
                value={editVal}
                onChange={e => setEditVal(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') confirmEdit(); if (e.key === 'Escape') setEditIdx(null); }}
                autoFocus
                style={{ flex: 1, background: '#060f1c', border: '1px solid #f37126', borderRadius: 6, color: '#e8edf2', fontSize: 13, padding: '6px 10px', outline: 'none' }}
              />
            ) : (
              <span style={{ flex: 1, fontSize: 13, color: '#e8edf2' }}>{cat}</span>
            )}

            {editIdx === i ? (
              <button onClick={confirmEdit} style={{ background: '#0d3320', border: '1px solid #1a5c38', borderRadius: 6, color: '#4ade80', fontSize: 11, padding: '5px 10px', cursor: 'pointer', fontWeight: 600 }}>✓ Salvar</button>
            ) : (
              <button onClick={() => startEdit(i)} style={{ background: '#0d2540', border: '1px solid #1a3150', borderRadius: 6, color: '#7bc4e8', fontSize: 11, padding: '5px 10px', cursor: 'pointer' }}>Editar</button>
            )}
            <button onClick={() => { if (confirm(`Remover a categoria "${cat}"?`)) { removeCategory(i); toast(`Categoria "${cat}" removida.`, 'warning'); } }} style={{ background: '#2a0a0a', border: '1px solid #3a1a1a', borderRadius: 6, color: '#ff6b6b', fontSize: 11, padding: '5px 8px', cursor: 'pointer' }}><Trash2 size={12} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Trash Tab ────────────────────────────────── */
function TrashTab() {
  const { packages, restorePackage, permanentRemovePackage } = useContentConfig();
  const { toast } = useToast();
  const deleted = packages
    .map((p, realIdx) => ({ p, realIdx }))
    .filter(({ p }) => !!p.deletedAt);

  if (deleted.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '60px 20px', color: '#4a6f93' }}>
        <Trash2 size={32} />
        <span style={{ fontSize: 14 }}>Lixeira vazia. Pacotes excluídos aparecerão aqui.</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ background: '#1a1400', border: '1px solid #7a4a00', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 8 }}>
        <AlertTriangle size={13} /> Pacotes na lixeira não aparecem no site. Restaure para reativá-los.
      </div>
      {deleted.map(({ p: pkg, realIdx }) => (
        <div key={realIdx} style={{ background: '#09182a', border: '1px solid #3a1a1a', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', opacity: 0.8 }}>
          <ImgPreview src={pkg.img} size={52} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#e8edf2' }}>{pkg.title || 'Sem título'}</div>
            <div style={{ fontSize: 12, color: '#4a6f93', marginTop: 2 }}>
              Excluído por <strong style={{ color: '#7bc4e8' }}>{pkg.deletedBy ?? 'admin'}</strong>
              {pkg.deletedAt ? ` em ${new Date(pkg.deletedAt).toLocaleDateString('pt-BR')}` : ''}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => { restorePackage(realIdx); toast(`"${pkg.title}" restaurado!`, 'success'); }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: '#0d3320', color: '#4ade80', border: '1px solid #1a5c38', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              <RotateCcw size={13} /> Restaurar
            </button>
            <button
              onClick={() => { if (confirm('Excluir permanentemente? Esta ação não pode ser desfeita.')) { permanentRemovePackage(realIdx); toast('Pacote excluído permanentemente.', 'error'); } }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: '#2a0a0a', color: '#ff6b6b', border: '1px solid #3a1a1a', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              <Trash2 size={13} /> Deletar
            </button>
          </div>
        </div>
      ))}
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
  background: 'linear-gradient(135deg, #f37126, #d45f1a)', color: '#000',
  border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
};

/* ── Audit Trail ─────────────────────────────────────────────────── */
function fmtDate(iso?: string) {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
  } catch { return iso; }
}

function AuditTrail({ pkg }: { pkg: import('../types').TrendingPackage }) {
  const rows: { label: string; user?: string; at?: string; color: string }[] = [];
  if (pkg.createdBy) rows.push({ label: 'Criado por', user: pkg.createdBy, at: pkg.createdAt, color: '#4a7fa8' });
  if (pkg.updatedBy) rows.push({ label: 'Editado por', user: pkg.updatedBy, at: pkg.updatedAt, color: '#f39c12' });
  if (pkg.approvedBy) rows.push({ label: 'Autorizado por', user: pkg.approvedBy, at: pkg.approvedAt, color: '#4ade80' });
  if (pkg.rejectedBy) rows.push({ label: 'Rejeitado por', user: pkg.rejectedBy, at: pkg.rejectedAt, color: '#f87171' });
  if (!rows.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
      {rows.map(r => (
        <span key={r.label} style={{ fontSize: 10, background: '#060f1c', border: `1px solid ${r.color}22`, borderRadius: 6, padding: '3px 8px', color: r.color, display: 'flex', gap: 4, alignItems: 'center' }}>
          <span style={{ opacity: 0.7 }}>{r.label}:</span>
          <strong>{r.user}</strong>
          {r.at && <span style={{ opacity: 0.5 }}>· {fmtDate(r.at)}</span>}
        </span>
      ))}
    </div>
  );
}

/* ── Login Screen ───────────────────────────────────────────────── */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pw, role: 'admin' }),
      });
      if (res.ok) {
        localStorage.setItem(AUTH_KEY, username);
        onLogin();
      } else {
        const data = await res.json();
        setError(data.error || 'Usuário ou senha inválidos');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasErr: boolean): React.CSSProperties => ({
    background: '#091624',
    border: `1px solid ${hasErr ? '#e55' : '#1e3a5a'}`,
    borderRadius: 8, color: '#fff', fontSize: 14, padding: '12px 14px', outline: 'none',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #050e1a 0%, #0a1e35 50%, #050e1a 100%)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <form onSubmit={handleSubmit} style={{
        background: '#0d1f33', border: '1px solid #1e3a5a', borderRadius: 16,
        padding: '40px 36px', width: 360, display: 'flex', flexDirection: 'column', gap: 16,
        boxShadow: '0 24px 64px rgba(0,0,0,.6)',
        animation: shake ? 'shake .4s ease' : 'none',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Shield size={36} color="#f37126" /></div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', textAlign: 'center', margin: 0 }}>Painel Admin</h1>
        <p style={{ fontSize: 13, color: '#4a6f93', textAlign: 'center', margin: 0 }}>E-Mais · Gerenciador de Conteúdo</p>
        <input
          type="text" value={username} onChange={e => { setUsername(e.target.value); setError(''); }}
          placeholder="Usuário" autoFocus autoComplete="username"
          style={inputStyle(!!error)}
        />
        <input
          type="password" value={pw} onChange={e => { setPw(e.target.value); setError(''); }}
          placeholder="Senha" autoComplete="current-password"
          style={inputStyle(!!error)}
        />
        {error && <p style={{ color: '#ff6b6b', fontSize: 12, margin: 0 }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #f37126, #d45f1a)', color: '#000', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 8, padding: 13, cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Verificando…' : 'Entrar'}
        </button>
      </form>
      <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }`}</style>
    </div>
  );
}

/* ── Main Admin Panel ───────────────────────────────────────────── */
export default function ImageAdmin() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(() => {
    const v = localStorage.getItem(AUTH_KEY);
    if (v === '1') { localStorage.removeItem(AUTH_KEY); return false; } // limpa sessão legada
    return !!v;
  });
  const [tab, setTab] = useState<Tab>('packages');
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const { packages, exportConfig: exportContent, importConfig: importContent, resetAll: resetContent, saving, saveError } = useContentConfig();
  const { exportConfig: exportImages, importConfig: importImages, resetAll: resetImages } = useImageConfig();

  const deletedCount = packages.filter(p => !!p.deletedAt).length;

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Exibe toast quando o servidor falhar ao salvar
  useEffect(() => {
    if (saveError) {
      showToast('Não foi possível salvar no servidor. As alterações foram mantidas localmente — reinicie o servidor e salve novamente.', 'error');
    }
  }, [saveError, showToast]);

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

  const TABS: { id: string; label: string; icon: React.ReactNode }[] = [
    { id: 'packages',     label: 'Pacotes',          icon: <Package size={15} /> },
    { id: 'trending',     label: 'Pacotes em Alta',  icon: <Flame size={15} /> },
    { id: 'categories',   label: 'Categorias',       icon: <Tag size={15} /> },
    { id: 'platinum',     label: 'Galeria Platinum', icon: <Award size={15} /> },
    { id: 'hero',         label: 'Galeria Hero',     icon: <ImgIcon size={15} /> },
    { id: 'trash',        label: deletedCount > 0 ? `Lixeira (${deletedCount})` : 'Lixeira', icon: <Trash2 size={15} color={deletedCount > 0 ? '#ff6b6b' : undefined} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#060f1c', color: '#e8edf2', fontFamily: 'Inter, system-ui, sans-serif', alignItems: 'flex-start' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, minWidth: 220, background: '#09182a', borderRight: '1px solid #1a3150', display: 'flex', flexDirection: 'column', padding: '24px 16px', gap: 8, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px 24px', fontSize: 15, fontWeight: 700, color: '#f37126', borderBottom: '1px solid #1a3150', marginBottom: 16 }}>
          <LayoutDashboard size={20} /> E-Mais Admin
        </div>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as Tab)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderRadius: 8, fontSize: 13, cursor: 'pointer', border: 'none', textAlign: 'left', width: '100%',
              background: tab === t.id ? '#0d2540' : 'transparent',
              color: tab === t.id ? '#f37126' : '#7a9db5',
              fontWeight: tab === t.id ? 700 : 400,
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 16, borderTop: '1px solid #1a3150' }}>
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 8, fontSize: 13, cursor: 'pointer', border: 'none', background: '#0d2540', color: '#7bc4e8' }}>
            <Eye size={14} /> Ver Site
          </button>
          <button onClick={() => { localStorage.removeItem(AUTH_KEY); setAuthed(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 8, fontSize: 13, cursor: 'pointer', border: 'none', background: 'transparent', color: '#4a6f93', textAlign: 'left' }}>
            <LogOut size={14} /> Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '28px 32px 20px', borderBottom: '1px solid #1a3150', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
              {TABS.find(t => t.id === tab)?.icon} {TABS.find(t => t.id === tab)?.label}
            </h1>
            <p style={{ fontSize: 13, color: saving ? '#f37126' : '#4a6f93', margin: 0, display: 'flex', alignItems: 'center', gap: 5, transition: 'color .3s' }}>
              {saving ? <><span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#f37126', animation: 'pulse 1s infinite' }} /> Salvando…</> : 'Edições salvas automaticamente.'}
            </p>
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
            <button onClick={handleImport} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: 'linear-gradient(135deg, #f37126, #d45f1a)', color: '#000', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start' }}>
              <Upload size={13} /> Aplicar Configuração
            </button>
          </div>
        )}

        {/* Tab content */}
        <div style={{ padding: '24px 32px', flex: 1 }}>
          {tab === 'hero'         && <HeroTab />}
          {tab === 'platinum'     && <PlatinumTab />}
          {tab === 'packages'     && <PackagesTab />}
          {tab === 'trending'     && <TrendingTab />}
          {tab === 'categories'   && <CategoriesTab />}
          {tab === 'trash'        && <TrashTab />}
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
      <style>{`@keyframes slideIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
    </div>
  );
}

// Re-export unused icon references to avoid lint warnings
const _unused = [CalendarDays, MapPin, Tag, DollarSign, FileText, User, MessageSquare];
void _unused;
