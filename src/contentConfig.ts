// Full content configuration for E-Mais Landing Page
// Stores ALL editable content: events, packages, testimonials (text + images)

import type { EventHighlight, TrendingPackage, Testimonial } from './types';

export const DEFAULT_EVENTS: EventHighlight[] = [
  {
    title: 'Super Bowl LIX',
    location: 'Nova Orleans, LA',
    date: '9 de Fevereiro, 2026',
    img: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'WrestleMania 42',
    location: 'Las Vegas, NV',
    date: '19 - 20 Abr, 2026',
    img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Copa do Mundo FIFA 26™',
    location: 'EUA, Canadá, México',
    date: '11 Jun - 19 Jul, 2026',
    img: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
];

export const DEFAULT_PACKAGES: TrendingPackage[] = [
  {
    tag: 'NOVO LOTE',
    title: 'Super Bowl LIX',
    loc: 'Nova Orleans, LA',
    date: '9 Fev, 2026',
    price: '9.500',
    img: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    badge: 'superbowl',
    description: 'Acompanhe a grande final do futebol americano em Nova Orleans com máximo conforto. Desfrute da lendária hospitalidade sulista com um nível de serviço premium.',
    flightDetails: 'Voos de ida e volta (Classe Econômica) via Delta Airlines, saindo de São Paulo (GRU) para Nova Orleans (MSY). Upgrade disponível sob consulta.',
    hotelDetails: '4 noites de hospedagem no recém-renovado Four Seasons New Orleans. Quarto Standard King com café da manhã incluso.',
    ticketDetails: 'Loge Box com visão central. Inclui acesso VIP à festa pré-jogo On the Fifty com shows, open bar premium e buffet de alta gastronomia assinado por Chefs renomados.',
  },
  {
    tag: 'QUASE ESGOTADO',
    title: 'Jogos Olímpicos 2024',
    loc: 'Paris, França',
    date: '26 Jul - 11 Ago, 2024',
    price: '1.200',
    img: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    badge: 'paris',
    description: 'Celebre o espírito olímpico no coração de Paris. Tenha um lugar privilegiado nos eventos esportivos globais com o selo Paris 2024 Hospitality.',
    flightDetails: 'Passagem aérea Air France (GRU-CDG) ida e volta. Não inclui transfers.',
    hotelDetails: 'Acomodação 4 Estrelas nas margens do Rio Sena. Escolha flexível do número de noites na região do Marais ou Saint-Germain.',
    ticketDetails: 'Acesso VIP aos lounges de hospitalidade exclusiva (Club House 24). Ingressos de Categoria A para a cerimônia de abertura e para 3 modalidades à sua escolha.',
  },
  {
    tag: 'PREMIUM',
    title: 'WrestleMania 41',
    loc: 'Las Vegas, NV',
    date: '19 - 20 Abr, 2026',
    price: '2.500',
    img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    badge: 'wwe',
    description: 'Viva o espetáculo da maior edição de todos os tempos da WrestleMania em Las Vegas, The Entertainment Capital of the World.',
    flightDetails: 'Voos via United Airlines saindo das principais capitais do Brasil para LAS (Harry Reid International).',
    hotelDetails: 'MGM Grand Las Vegas Resort & Casino. Fique no epicentro das programações de entretenimento com acesso facilitado à arena.',
    ticketDetails: 'Ingressos de Anel Inferior para a Noite 1 e 2. Benefícios incluem entrada pelo tapete vermelho, Superstars Brunch on Sunday Morning e assentos reservados próximos aos Superstars.',
  },
  {
    tag: 'POPULAR',
    title: 'Miami Open',
    loc: 'Miami, FL',
    date: '17 - 31 Mar, 2026',
    price: '750',
    img: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    badge: 'tennis',
    description: 'Participe do glamour e clima espetacular de Miami assistindo aos melhores nomes do Tênis no moderno Hard Rock Stadium complex.',
    flightDetails: 'Opções flexíveis via LATAM ou American Airlines partindo do Brasil sentido Miami (MIA).',
    hotelDetails: 'Estadia Boutique em South Beach ou Brickell. Oferecemos shuttles de luxo contínuos direto para o estádio em todos os dias de jogos.',
    ticketDetails: 'Premium Seating Suites no Stadium Court. Oportunidade de autógrafos com tenistas no lounge 1972 Club exclusivo com bar de champanhe e caviar.',
  },
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    img: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    user: 'Fã da NFL',
    text: 'Assentos incríveis na linha de 50!',
  },
  {
    img: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    user: 'Fã da WrestleMania',
    text: 'Viajei de longe... Para estar com o E-Mais na WrestleMania 41 😎',
  },
  {
    img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    user: 'Fã de UFC',
    text: 'Melhor noite de lutas de todas.',
  },
  {
    img: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    user: 'Fã de Paris 2024',
    text: 'Descreva sua experiência E-Mais em uma palavra: Impecável.',
  },
];

export const CONTENT_STORAGE_KEY = 'emais_content_config';

