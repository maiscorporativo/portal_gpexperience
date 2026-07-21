import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_IMAGES, STORAGE_KEY, type ImageKey } from '../imageConfig';
import { encodeB64, unwrapContentResponse } from './useContentConfig';

type ImageOverrides = Partial<Record<ImageKey, string>>;

const UPDATE_EVENT = 'emais_image_update';
const CONTENT_UPDATE_EVENT = 'emais_content_update';
const getSessionToken = () =>
  localStorage.getItem('emais_admin_token') ||
  localStorage.getItem('emais_master_token') ||
  '';


function loadOverrides(): ImageOverrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

async function pushHeroToApi(overrides: ImageOverrides, replace = false) {
  try {
    // Read current content from cache and attach updated hero images — os
    // demais campos (events/packages/...) não têm fallback pro valor
    // existente no servidor quando ausentes, então precisam vir aqui.
    const contentRaw = localStorage.getItem('emais_content_cache');
    const content = contentRaw ? JSON.parse(contentRaw) : {};
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getSessionToken()}`,
    };
    // heroImages, por sua vez, é mesclado por chave no servidor (várias
    // linhas do admin editam esse campo de forma independente e concorrente
    // — mandar só a chave alterada evita apagar as demais). replace=true
    // (reset geral / importar config) força substituição total.
    const payload: Record<string, unknown> = { ...content, heroImages: overrides };
    if (replace) payload.heroImagesReplace = true;
    // Rota Base64 (imune ao firewall da hospedagem); 404 = servidor antigo → rota legada
    const res = await fetch('/api/content/b64', {
      method: 'PUT',
      headers,
      body: JSON.stringify({ b64: encodeB64(payload) }),
    });
    if (res.status === 404) {
      await fetch('/api/content', { method: 'PUT', headers, body: JSON.stringify(payload) });
    }
  } catch { /* silent — localStorage already updated */ }
}

export function useImageConfig() {
  const [overrides, setOverrides] = useState<ImageOverrides>(loadOverrides);

  // Fetch hero images from API on mount
  useEffect(() => {
    fetch('/api/content?b64=1')
      .then(r => r.json())
      .then(raw => {
        const data = unwrapContentResponse(raw);
        if (data.heroImages && Object.keys(data.heroImages).length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.heroImages));
          setOverrides(data.heroImages);
        }
      })
      .catch(() => { /* use local cache */ });
  }, []);

  // Sync when content changes (from useContentConfig saves)
  useEffect(() => {
    const handler = () => setOverrides(loadOverrides());
    window.addEventListener(UPDATE_EVENT, handler);
    window.addEventListener(CONTENT_UPDATE_EVENT, handler);
    return () => {
      window.removeEventListener(UPDATE_EVENT, handler);
      window.removeEventListener(CONTENT_UPDATE_EVENT, handler);
    };
  }, []);

  const getImage = useCallback(
    (key: ImageKey): string => overrides[key] ?? DEFAULT_IMAGES[key],
    [overrides]
  );

  const updateImage = useCallback((key: ImageKey, url: string) => {
    setOverrides(prev => {
      const next = { ...prev, [key]: url };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(UPDATE_EVENT));
      // Envia só a própria chave — o servidor faz o merge, então esta linha
      // nunca depende do seu próprio snapshot local estar em dia com o que
      // as outras linhas já salvaram.
      pushHeroToApi({ [key]: url });
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setOverrides({});
    window.dispatchEvent(new Event(UPDATE_EVENT));
    pushHeroToApi({}, true);
  }, []);

  const exportConfig = useCallback((): string => JSON.stringify(overrides, null, 2), [overrides]);

  const importConfig = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json) as ImageOverrides;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      setOverrides(parsed);
      window.dispatchEvent(new Event(UPDATE_EVENT));
      pushHeroToApi(parsed, true);
      return true;
    } catch { return false; }
  }, []);

  return { getImage, updateImage, resetAll, exportConfig, importConfig, overrides };
}
