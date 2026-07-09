export interface EventHighlight {
  title: string;
  location: string;
  date: string;
  img: string;
  status?: 'approved' | 'pending' | 'rejected';
  /* ── Audit trail ── */
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
}

export interface TrendingPackage {
  tag: string;
  title: string;
  loc: string;
  date: string;
  price: string;
  currency?: string;
  installments?: string; // Nº de parcelas exibido no card do site (ex: "10" → "10x de R$ ..."); vazio/1 = valor à vista
  img: string;
  badge: string;
  badgeImg?: string;
  description?: string;
  flightDetails?: string;
  hotelDetails?: string;
  ticketDetails?: string;
  status?: 'approved' | 'pending' | 'rejected';
  category?: string;
  isTrending?: boolean;
  /* ── Audit trail ── */
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  /* ── Marketing fields ── */
  videoUrl?: string;
  trackingScriptHead?: string;
  trackingScriptBody?: string;
  webhookClint?: string;
  mauticFormCode?: string;
  redirectUrl?: string;
  externalUrl?: string; // Link externo para pular a Landing Page interna
  marketingUpdatedAt?: string;
  marketingUpdatedBy?: string;
  /* ── Enhanced Marketing fields ── */
  heroType?: 'video' | 'image';
  heroImage?: string;
  galleryImages?: string; // Banco de Imagens — URLs separadas por ";" (alimenta a seção Galeria da LP)
  experienciaImages?: string; // Imagens escolhidas do banco para a seção Experiência (URLs separadas por ";")
  destaqueSection?: string; // JSON { titulo, titulo_destaque, texto, imagem, invertido } — seção destaque estilo "Troféu" da Indy 500
  programacaoTitulo?: string; // Título da seção Programação (parte branca — padrão: "Programação do")
  programacaoTituloDestaque?: string; // Título da seção Programação (parte vermelha — padrão: "Fim de Semana")
  programacaoSubtitulo?: string; // Subtítulo da seção Programação (padrão: "Dias de ação e emoção")
  lpSections?: string; // JSON de visibilidade das seções da LP: { cards, programacao, pacotes, experiencia, galeria, destaque, parceria } — todas true por padrão
  videoBgSections?: string; // JSON: seções com fundo animado da bandeira { programacao, pacotes, experiencia } — padrão: só programacao
  highlights?: string; // Semicolon separated features/highlights
  sectionBackground?: string;
  /* ── New GP Experience LP Sections ── */
  cardsData?: string; // JSON string para Cards de Experiência
  programacaoData?: string; // JSON string para dias e programação
  pacotesOptionsData?: string; // JSON string para opções de pacotes
  experienciaSection?: string; // JSON string ou texto da seção Experiência
  partnershipSection?: string; // JSON string ou boolean para parceria
  /* ── Soft-delete ── */
  deletedAt?: string;
  deletedBy?: string;
}
