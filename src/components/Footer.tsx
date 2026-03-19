import { Instagram, ArrowRight } from 'lucide-react';
import { useToast } from './ui/ToastProvider';
import Reveal from './Reveal';

export default function Footer() {
    const { toast } = useToast();

    const handleEmptyClick = (e: React.MouseEvent) => {
        e.preventDefault();
        toast('Ações de usuário estão desabilitadas neste Preview.', 'info');
    };

    return (
        <footer className="bg-[#041121] text-white font-sans overflow-hidden relative">

            {/* Subtle gradient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

            {/* CTA Hero strip */}
            <div className="relative border-b border-white/8 px-6 py-20 text-center">
                <Reveal>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold mb-5">Experimente o Premium</p>
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.05]">
                        Descubra a sua<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-secondary">melhor experiência.</span>
                    </h2>
                    <button
                        onClick={handleEmptyClick}
                        className="inline-flex items-center gap-3 bg-gold text-black font-bold text-sm px-8 py-4 rounded-full hover:bg-white transition-all duration-300 group shadow-lg shadow-gold/20"
                    >
                        Fale com um Consultor
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </Reveal>
            </div>

            {/* Main links area */}
            <div className="relative max-w-[1400px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">

                {/* Brand */}
                <Reveal className="lg:col-span-4 flex flex-col gap-6">
                    <img src="/emais-logo.svg" alt="e-mais" className="h-[26px] object-contain object-left" />
                    <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">
                        Hospitalidade premium e experiências inesquecíveis nos maiores eventos esportivos e de entretenimento do mundo.
                    </p>
                    <div className="text-sm text-neutral-500 space-y-1">
                        <p className="hover:text-white cursor-pointer transition-colors">hello@e-mais.com</p>
                        <p className="hover:text-white cursor-pointer transition-colors">+55 (11) 99999-9999</p>
                    </div>
                    <div className="flex gap-4 pt-2">
                        <a href="https://www.instagram.com/emais.viagensesportivas/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#E1306C] hover:border-[#E1306C]/40 transition-all"><Instagram size={15} /></a>
                    </div>
                </Reveal>

                {/* Empresa */}
                <Reveal className="lg:col-span-2" delay={150}>
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-6">Empresa</h4>
                    <ul className="space-y-3 text-sm text-neutral-400">
                        {['Sobre Nós', 'Imprensa', 'Calendário de Eventos', 'Acesso Platinum', 'Contato', 'Ajuda e FAQ'].map(item => (
                            <li key={item}>
                                <a href="#" onClick={handleEmptyClick} className="hover:text-gold hover:pl-1 transition-all duration-200 block">{item}</a>
                            </li>
                        ))}
                    </ul>
                </Reveal>

                {/* Newsletter */}
                <Reveal className="lg:col-span-4" delay={200}>
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-6">Newsletter</h4>
                    <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                        Lançamentos exclusivos, pacotes e hospitalidade premium direto na sua caixa de entrada.
                    </p>
                    <form className="flex w-full mb-3" onSubmit={e => { e.preventDefault(); handleEmptyClick(e as unknown as React.MouseEvent); }}>
                        <input
                            type="email"
                            placeholder="seu@email.com"
                            className="bg-white/5 border border-white/10 text-white rounded-l-xl py-3 px-4 outline-none text-sm w-full focus:border-gold/60 transition-colors placeholder:text-neutral-600"
                        />
                        <button type="button" onClick={handleEmptyClick} className="bg-gold text-black font-bold rounded-r-xl py-3 px-5 text-sm hover:bg-white transition-colors whitespace-nowrap">
                            Assinar
                        </button>
                    </form>
                    <p className="text-[11px] text-neutral-600 leading-tight">
                        Ao enviar, você concorda com nossos{' '}
                        <a href="#" onClick={handleEmptyClick} className="text-neutral-500 hover:text-gold underline underline-offset-2">Termos</a>{' '}e{' '}
                        <a href="#" onClick={handleEmptyClick} className="text-neutral-500 hover:text-gold underline underline-offset-2">Privacidade</a>.
                    </p>
                </Reveal>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/8 px-6 py-6 max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-neutral-600">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <span className="text-neutral-500 font-medium">© {new Date().getFullYear()} E-MAIS.</span>
                    {['Privacidade', 'Termos de Uso', 'Cookies', 'Acessibilidade'].map(l => (
                        <a key={l} href="#" onClick={handleEmptyClick} className="hover:text-neutral-300 transition-colors">{l}</a>
                    ))}
                </div>
                <p className="text-neutral-700">Produto Mais Corporativo</p>
            </div>
        </footer>
    );
}
