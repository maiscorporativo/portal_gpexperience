import { useState, useEffect, useCallback, useRef } from 'react';
import type { EventHighlight, TrendingPackage, Testimonial } from '../types';
import {
  DEFAULT_EVENTS,
  DEFAULT_PACKAGES,
  DEFAULT_TESTIMONIALS,
} from '../contentConfig';

const ADMIN_TOKEN = 'emais2025';
const CACHE_KEY = 'emais_content_cache';

interface ContentStore {
  events: EventHighlight[];
  packages: TrendingPackage[];
  testimonials: Testimonial[];
}

function loadCache(): ContentStore | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Valida que o cache tem arrays válidos (proteção contra cache corrompido)
    if (
      !Array.isArray(parsed?.events) ||
      !Array.isArray(parsed?.packages) ||
      !Array.isArray(parsed?.testimonials)
    ) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return parsed as ContentStore;
  } catch { return null; }
}

function saveCache(data: ContentStore) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

async function fetchContent(): Promise<ContentStore> {
  const res = await fetch('/api/content');
  if (!res.ok) throw new Error('API error');
  const json = await res.json();
  return {
    events:       json.events       ?? DEFAULT_EVENTS,
    packages:     json.packages     ?? DEFAULT_PACKAGES,
    testimonials: json.testimonials ?? DEFAULT_TESTIMONIALS,
  };
}

async function putContent(data: ContentStore & { heroImages?: Record<string, string> }) {
  const res = await fetch('/api/content', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ADMIN_TOKEN}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Save failed');
}

// Global event to notify all hook instances in same tab
const UPDATE_EVENT = 'emais_content_update';
// BroadcastChannel to notify other tabs in same browser
const bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('emais_content') : null;

export function useContentConfig() {
  const cached = loadCache();
  const [content, setContent] = useState<ContentStore>(cached ?? {
    events: DEFAULT_EVENTS,
    packages: DEFAULT_PACKAGES,
    testimonials: DEFAULT_TESTIMONIALS,
  });
  const [loading, setLoading] = useState(!cached);
  const lastUpdated = useRef<string>('');

  // Fetch from API and update state only if content changed
  const refetch = useCallback(async () => {
    try {
      const res = await fetch('/api/content');
      if (!res.ok) return;
      const json = await res.json();
      const key = json.updated_at ?? JSON.stringify(json).slice(0, 40);
      if (key === lastUpdated.current) return;
      lastUpdated.current = key;
      const data: ContentStore = {
        events:       json.events       ?? DEFAULT_EVENTS,
        packages:     json.packages     ?? DEFAULT_PACKAGES,
        testimonials: json.testimonials ?? DEFAULT_TESTIMONIALS,
      };
      setContent(data);
      saveCache(data);
    } catch { /* keep current */ }
  }, []);

  // Mount: initial load + polling every 5s + BroadcastChannel for same-browser instant update
  useEffect(() => {
    let active = true;

    // Initial load
    fetchContent()
      .then(data => { if (active) { setContent(data); saveCache(data); } })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });

    // Poll every 5 seconds
    const poll = setInterval(() => { if (active) refetch(); }, 5000);

    // BroadcastChannel: instant update when admin saves in another tab
    const handleBC = () => { if (active) refetch(); };
    if (bc) bc.addEventListener('message', handleBC);

    return () => {
      active = false;
      clearInterval(poll);
      if (bc) bc.removeEventListener('message', handleBC);
    };
  }, [refetch]);

  /* ── Save helper ── */
  const persist = useCallback(async (next: ContentStore) => {
    setContent(next);
    saveCache(next);
    window.dispatchEvent(new Event(UPDATE_EVENT));
    try {
      // Also send hero images stored separately
      const heroRaw = localStorage.getItem('emais_image_config');
      const heroImages = heroRaw ? JSON.parse(heroRaw) : {};
      await putContent({ ...next, heroImages });
      // Notify other tabs in the same browser instantly via BroadcastChannel
      bc?.postMessage('update');
    } catch (err) {
      console.warn('[useContentConfig] API save failed, using localStorage only:', err);
    }
  }, []);

  /* ── Events ── */
  const updateEvent = useCallback((i: number, d: Partial<EventHighlight>) =>
    persist({ ...content, events: content.events.map((e, idx) => idx === i ? { ...e, ...d } : e) }), [content, persist]);

  const addEvent = useCallback(() =>
    persist({ ...content, events: [...content.events, { title: 'Novo Evento', location: 'Local', date: 'Data', img: '' }] }), [content, persist]);

  const removeEvent = useCallback((i: number) =>
    persist({ ...content, events: content.events.filter((_, idx) => idx !== i) }), [content, persist]);

  const reorderEvent = useCallback((from: number, to: number) => {
    const arr = [...content.events];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    return persist({ ...content, events: arr });
  }, [content, persist]);

  /* ── Packages ── */
  const updatePackage = useCallback((i: number, d: Partial<TrendingPackage>) =>
    persist({ ...content, packages: content.packages.map((p, idx) => idx === i ? { ...p, ...d } : p) }), [content, persist]);

  const addPackage = useCallback(() =>
    persist({ ...content, packages: [...content.packages, { tag: 'NOVO', title: 'Novo Pacote', loc: 'Local', date: 'Data', price: '0', img: '', badge: 'novo', description: '', flightDetails: '', hotelDetails: '', ticketDetails: '' }] }), [content, persist]);

  const removePackage = useCallback((i: number) =>
    persist({ ...content, packages: content.packages.filter((_, idx) => idx !== i) }), [content, persist]);

  const reorderPackage = useCallback((from: number, to: number) => {
    const arr = [...content.packages];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    return persist({ ...content, packages: arr });
  }, [content, persist]);

  /* ── Testimonials ── */
  const updateTestimonial = useCallback((i: number, d: Partial<Testimonial>) =>
    persist({ ...content, testimonials: content.testimonials.map((t, idx) => idx === i ? { ...t, ...d } : t) }), [content, persist]);

  const addTestimonial = useCallback(() =>
    persist({ ...content, testimonials: [...content.testimonials, { img: '', user: 'Novo Cliente', text: 'Depoimento incrível!' }] }), [content, persist]);

  const removeTestimonial = useCallback((i: number) =>
    persist({ ...content, testimonials: content.testimonials.filter((_, idx) => idx !== i) }), [content, persist]);

  const reorderTestimonial = useCallback((from: number, to: number) => {
    const arr = [...content.testimonials];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    return persist({ ...content, testimonials: arr });
  }, [content, persist]);

  /* ── Global ── */
  const resetAll = useCallback(async () => {
    const defaults = { events: DEFAULT_EVENTS, packages: DEFAULT_PACKAGES, testimonials: DEFAULT_TESTIMONIALS };
    await persist(defaults);
  }, [persist]);

  const exportConfig = useCallback(() => JSON.stringify(content, null, 2), [content]);

  const importConfig = useCallback(async (json: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(json) as ContentStore;
      await persist(parsed);
      return true;
    } catch { return false; }
  }, [persist]);

  return {
    events: content.events,
    packages: content.packages,
    testimonials: content.testimonials,
    loading,
    updateEvent, addEvent, removeEvent, reorderEvent,
    updatePackage, addPackage, removePackage, reorderPackage,
    updateTestimonial, addTestimonial, removeTestimonial, reorderTestimonial,
    resetAll, exportConfig, importConfig,
  };
}
