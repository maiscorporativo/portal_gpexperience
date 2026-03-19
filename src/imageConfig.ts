// Central image configuration for E-Mais Landing Page
// All default image URLs are defined here. Overrides are stored in localStorage.

export const DEFAULT_IMAGES = {
  // Hero Section Gallery — 12 images (3 columns auto-scroll) — vazio por padrão
  hero_col1_1: '',
  hero_col1_2: '',
  hero_col1_3: '',
  hero_col1_4: '',
  hero_col2_1: '',
  hero_col2_2: '',
  hero_col2_3: '',
  hero_col2_4: '',
  hero_col3_1: '',
  hero_col3_2: '',
  hero_col3_3: '',
  hero_col3_4: '',

  // Events Section
  event_0: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  event_1: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  event_2: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',

  // Trending Packages
  package_0: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  package_1: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  package_2: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  package_3: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',

  // Platinum Access — Animated Grid (2 columns × 6 images each) — vazio por padrão
  platinum_col1_1: '',
  platinum_col1_2: '',
  platinum_col1_3: '',
  platinum_col1_4: '',
  platinum_col1_5: '',
  platinum_col1_6: '',
  platinum_col2_1: '',
  platinum_col2_2: '',
  platinum_col2_3: '',
  platinum_col2_4: '',
  platinum_col2_5: '',
  platinum_col2_6: '',
};

export type ImageKey = keyof typeof DEFAULT_IMAGES;

export const STORAGE_KEY = 'emais_image_config';
