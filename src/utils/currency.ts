/**
 * Utilitários de formatação de moeda compartilhados
 * entre TrendingPackages, PackageModal e outros componentes.
 */

export const CURRENCY_LOCALES: Record<string, string> = {
  BRL: 'pt-BR', USD: 'en-US', EUR: 'de-DE', GBP: 'en-GB',
  ARS: 'es-AR', CLP: 'es-CL', COP: 'es-CO', MXN: 'es-MX',
  JPY: 'ja-JP', CNY: 'zh-CN', AUD: 'en-AU', CAD: 'en-CA',
  CHF: 'de-CH', AED: 'ar-AE', ZAR: 'en-ZA', INR: 'en-IN',
  KRW: 'ko-KR', SGD: 'en-SG', HKD: 'zh-HK', NZD: 'en-NZ',
  NOK: 'nb-NO', SEK: 'sv-SE', DKK: 'da-DK', PLN: 'pl-PL',
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  BRL: 'R$', USD: '$', EUR: '€', GBP: '£',
  ARS: '$', CLP: '$', COP: '$', MXN: '$',
  PYG: '₲', UYU: '$U', PEN: 'S/', BOB: 'Bs',
  VES: 'Bs.S', JPY: '¥', CNY: '¥', AUD: 'A$',
  CAD: 'C$', CHF: 'Fr', AED: 'د.إ', QAR: '﷼',
  SAR: '﷼', ZAR: 'R', INR: '₹', KRW: '₩',
  SGD: 'S$', HKD: 'HK$', NZD: 'NZ$', NOK: 'kr',
  SEK: 'kr', DKK: 'kr', PLN: 'zł',
};

export function getCurrencySymbol(code: string): string {
  return CURRENCY_SYMBOLS[code] ?? code;
}

export function formatDisplayPrice(rawPrice: string, currencyCode: string): string {
  const digits = rawPrice.replace(/\D/g, '');
  if (!digits) return rawPrice;
  const num = parseInt(digits, 10);
  const locale = CURRENCY_LOCALES[currencyCode] || 'pt-BR';
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(num);
}

/** Valor de cada parcela (total ÷ parcelas), com 2 casas decimais no locale da moeda. */
export function formatInstallmentValue(rawPrice: string, currencyCode: string, installments: number): string {
  const digits = rawPrice.replace(/\D/g, '');
  if (!digits || installments < 1) return rawPrice;
  const per = parseInt(digits, 10) / installments;
  const locale = CURRENCY_LOCALES[currencyCode] || 'pt-BR';
  return new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(per);
}

/** Nº de parcelas válido (>= 2) a partir do campo do pacote; 1 = à vista. */
export function parseInstallments(raw?: string): number {
  const n = parseInt((raw || '').replace(/\D/g, ''), 10);
  return Number.isFinite(n) && n >= 2 ? n : 1;
}

/** Frase exibida quando o pacote não tem preço definido. */
export const PRICE_ON_REQUEST = 'Valor sob consulta';

/** Um pacote tem preço quando o campo contém dígitos e o valor não é zero.
 *  Preço vazio ou zero → o site exibe PRICE_ON_REQUEST no lugar do valor. */
export function hasPrice(rawPrice?: string): boolean {
  const digits = (rawPrice || '').replace(/\D/g, '');
  return !!digits && parseInt(digits, 10) > 0;
}
