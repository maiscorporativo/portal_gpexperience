import { Instagram, ArrowRight } from 'lucide-react';
import Reveal from './Reveal';

export default function Footer() {

    return (
        <footer className="bg-[#041121] text-white font-sans overflow-hidden relative">

            {/* Subtle gradient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

            {/* CTA Hero strip */}
            <div className="relative border-b border-white/8 px-6 py-20 text-center">
                <Reveal>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold mb-5">Experimente o Premium</p>
                    <h2 className="footer-cta-heading text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.05]">
                        Descubra a sua<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-secondary">melhor experiência.</span>
                    </h2>
                    <a
                        href="https://api.whatsapp.com/send/?phone=5518997624457&text=Ol%C3%A1,%20tudo%20bem?%20Gostaria%20de%20falar%20com%20um%20consultor.&type=phone_number&app_absent=0"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-gold text-black font-bold text-sm px-8 py-4 rounded-full hover:bg-white transition-all duration-300 group shadow-lg shadow-gold/20"
                    >
                        Fale com um Consultor
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </Reveal>
            </div>

            {/* Brand Center */}
            <div className="relative max-w-[1400px] mx-auto px-6 py-16">
                <Reveal className="flex flex-col items-center text-center gap-5">
                    <img src="/emais-logo.svg" alt="e-mais" className="h-[28px]" />
                    <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
                        Hospitalidade premium e experiências inesquecíveis nos maiores eventos esportivos e de entretenimento do mundo.
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-neutral-500 w-full max-w-lg">
                        <a href="mailto:joao.kubo@maiscorporativo.tur.br" className="hover:text-white transition-colors flex-1 text-right">joao.kubo@maiscorporativo.tur.br</a>
                        <span className="w-px h-4 bg-white/15 flex-shrink-0" />
                        <a href="tel:+5518997624457" className="hover:text-white transition-colors flex-1 text-left">+55 (18) 99762-4457</a>
                    </div>
                    <div className="flex gap-3 pt-1">
                        <a href="https://www.instagram.com/emais.viagensesportivas/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#E1306C] hover:border-[#E1306C]/40 hover:bg-[#E1306C]/5 transition-all">
                            <Instagram size={16} />
                        </a>
                        <a href="https://api.whatsapp.com/send/?phone=5518997624457&text=Ol%C3%A1,%20tudo%20bem?%20Gostaria%20de%20falar%20com%20um%20consultor.&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#25D366] hover:border-[#25D366]/40 hover:bg-[#25D366]/5 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        </a>
                    </div>
                </Reveal>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/8 px-6 py-6 max-w-[1400px] mx-auto flex flex-col items-center gap-3 text-[12px] text-neutral-600">
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                    <span className="text-neutral-500 font-medium">© {new Date().getFullYear()} E-MAIS.</span>
                    <a href="https://maiscorporativo.tur.br/politica-de-privacidade/" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">Privacidade</a>
                    <a href="https://emais.tur.br/admin" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">Administrador</a>
                    <a href="https://emais.tur.br/master-admin" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">Administrador Master</a>
                </div>
                <p className="text-neutral-700">Produto Mais Corporativo</p>
            </div>
        </footer>
    );
}
