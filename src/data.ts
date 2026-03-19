// Static data for the E-Mais Landing Page
// Image URLs are managed via the admin panel (/admin) and stored in localStorage.
// The functions below return data merged with dynamic image config.

import type { EventHighlight, TrendingPackage } from './types';
import { DEFAULT_IMAGES } from './imageConfig';
import { STORAGE_KEY } from './imageConfig';

function getImg(key: keyof typeof DEFAULT_IMAGES): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const overrides = JSON.parse(raw) as Partial<typeof DEFAULT_IMAGES>;
      return overrides[key] ?? DEFAULT_IMAGES[key];
    }
  } catch { /* ignore */ }
  return DEFAULT_IMAGES[key];
}

export function getEventHighlights(): EventHighlight[] {
  return [];
}

export function getTrendingPackages(): TrendingPackage[] {
  return [];
}

// Legacy static exports kept for backwards compatibility
export const EVENT_HIGHLIGHTS: EventHighlight[] = getEventHighlights();
export const TRENDING_PACKAGES: TrendingPackage[] = getTrendingPackages();
