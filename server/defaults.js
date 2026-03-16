// Default content served when the database is empty
// Mirrors src/contentConfig.ts and src/imageConfig.ts

export const DEFAULT_EVENTS = [
  { title: 'Super Bowl LIX', location: 'Nova Orleans, LA', date: '9 de Fevereiro, 2026', img: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { title: 'WrestleMania 42', location: 'Las Vegas, NV', date: '19 - 20 Abr, 2026', img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { title: 'Copa do Mundo FIFA 26™', location: 'EUA, Canadá, México', date: '11 Jun - 19 Jul, 2026', img: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
];

export const DEFAULT_PACKAGES = [
  {
    tag: 'NOVO LOTE', title: 'Super Bowl LIX', loc: 'Nova Orleans, LA', date: '9 Fev, 2026', price: '9.500',
    img: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    badge: 'superbowl',
    description: 'Acompanhe a grande final do futebol americano em Nova Orleans com máximo conforto.',
    flightDetails: 'Voos de ida e volta (Classe Econômica) via Delta Airlines, saindo de São Paulo (GRU) para Nova Orleans (MSY).',
    hotelDetails: '4 noites de hospedagem no recém-renovado Four Seasons New Orleans.',
    ticketDetails: 'Loge Box com visão central. Inclui acesso VIP à festa pré-jogo On the Fifty.',
  },
  {
    tag: 'QUASE ESGOTADO', title: 'Jogos Olímpicos 2024', loc: 'Paris, França', date: '26 Jul - 11 Ago, 2024', price: '1.200',
    img: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    badge: 'paris',
    description: 'Celebre o espírito olímpico no coração de Paris.',
    flightDetails: 'Passagem aérea Air France (GRU-CDG) ida e volta.',
    hotelDetails: 'Acomodação 4 Estrelas nas margens do Rio Sena.',
    ticketDetails: 'Acesso VIP aos lounges de hospitalidade On Location.',
  },
  {
    tag: 'PREMIUM', title: 'WrestleMania 41', loc: 'Las Vegas, NV', date: '19 - 20 Abr, 2026', price: '2.500',
    img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    badge: 'wwe',
    description: 'Viva o espetáculo da maior edição de todos os tempos da WrestleMania em Las Vegas.',
    flightDetails: 'Voos via United Airlines saindo das principais capitais do Brasil.',
    hotelDetails: 'MGM Grand Las Vegas Resort & Casino.',
    ticketDetails: 'Ingressos de Anel Inferior para a Noite 1 e 2.',
  },
  {
    tag: 'POPULAR', title: 'Miami Open', loc: 'Miami, FL', date: '17 - 31 Mar, 2026', price: '750',
    img: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    badge: 'tennis',
    description: 'Participe do glamour de Miami assistindo aos melhores nomes do Tênis.',
    flightDetails: 'Opções flexíveis via LATAM ou American Airlines.',
    hotelDetails: 'Estadia Boutique em South Beach ou Brickell.',
    ticketDetails: 'Premium Seating Suites no Stadium Court.',
  },
];

export const DEFAULT_TESTIMONIALS = [
  { img: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', user: 'Fã da NFL', text: 'Assentos incríveis na linha de 50!' },
  { img: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', user: 'Fã da WrestleMania', text: 'Viajei de longe... Para estar com o E-Mais na WrestleMania 41 😎' },
  { img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', user: 'Fã de UFC', text: 'Melhor noite de lutas de todas.' },
  { img: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', user: 'Fã de Paris 2024', text: 'Descreva sua experiência E-Mais em uma palavra: Impecável.' },
];

export const DEFAULT_HERO_IMAGES = {
  hero_col1_1: 'https://images.unsplash.com/photo-1563299796-b729d0af54a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  hero_col1_2: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  hero_col1_3: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  hero_col1_4: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  hero_col2_1: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  hero_col2_2: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  hero_col2_3: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  hero_col2_4: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  hero_col3_1: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  hero_col3_2: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  hero_col3_3: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  hero_col3_4: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
};

