import { Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { useToast } from './ui/ToastProvider';
import Reveal from './Reveal';

export default function Footer() {
    const { toast } = useToast();

    const handleEmptyClick = (e: React.MouseEvent) => {
        e.preventDefault();
        toast('Ações de usuário estão desabilitadas neste Preview.', 'info');
    };

    return (
        <footer className="bg-primary-main/95 text-white pt-20 px-6 pb-24 font-sans">
            <div className="max-w-[1400px] mx-auto border-t border-white/10 pt-20">
                {/* Top section with images */}
                <Reveal className="flex flex-col lg:flex-row items-center justify-between gap-12 pb-20 border-b border-white/10">
                    <h2 className="text-4xl md:text-[3.5rem] font-semibold leading-tight w-full lg:w-2/5">
                        Descubra a sua<br />melhor <span className="underline decoration-1 underline-offset-8">experiência.</span>
                    </h2>
                    <Reveal className="flex gap-4 w-full lg:w-3/5 h-[200px]" delay={200}>
                        <img src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Experiência 1" loading="lazy" decoding="async" className="w-1/3 h-full object-cover rounded-md opacity-80 hover:opacity-100 transition-opacity shadow-lg shadow-black/80" />
                        <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Experiência 2" loading="lazy" decoding="async" className="w-1/3 h-full object-cover rounded-md opacity-80 hover:opacity-100 transition-opacity shadow-lg shadow-black/80" />
                        <img src="https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Experiência 3" loading="lazy" decoding="async" className="w-1/3 h-full object-cover rounded-md opacity-80 hover:opacity-100 transition-opacity shadow-lg shadow-black/80" />
                    </Reveal>
                </Reveal>

                {/* Main Links Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pt-16 pb-16">
                    {/* Brand Section */}
                    <Reveal className="lg:col-span-3 flex flex-col gap-6">
                        <div className="flex items-center mb-2">
                            <img src="/emais-logo.svg" alt="Logo da e-mais Branca" loading="lazy" decoding="async" className="h-[28px] object-contain object-left" />
                        </div>
                        <div className="text-[13px] leading-relaxed text-neutral-400">
                            <p>Av. Paulista, 1000</p>
                            <p>São Paulo, SP 01310-100</p>
                        </div>
                        <div className="text-[13px] text-neutral-400 mt-2">
                            <p className="hover:text-white cursor-pointer transition-colors mb-1">hello@e-mais.com</p>
                            <p className="hover:text-white cursor-pointer transition-colors">+55 (11) 99999-9999</p>
                        </div>
                    </Reveal>

                    {/* Explore Links */}
                    <Reveal className="lg:col-span-2 lg:pl-4" delay={100}>
                        <h4 className="font-semibold text-[13px] mb-6 text-white">Explorar</h4>
                        <ul className="space-y-4 text-[13px] text-neutral-400">
                            <li><a href="#" onClick={handleEmptyClick} className="hover:text-white hover:pl-1 transition-all">Super Bowl LIX</a></li>
                            <li><a href="#" onClick={handleEmptyClick} className="hover:text-white hover:pl-1 transition-all">Jogos Olímpicos</a></li>
                            <li><a href="#" onClick={handleEmptyClick} className="hover:text-white hover:pl-1 transition-all">UFC</a></li>
                            <li><a href="#" onClick={handleEmptyClick} className="hover:text-white hover:pl-1 transition-all">WrestleMania</a></li>
                            <li><a href="#" onClick={handleEmptyClick} className="hover:text-white hover:pl-1 transition-all">Fórmula 1</a></li>
                            <li><a href="#" onClick={handleEmptyClick} className="hover:text-white hover:pl-1 transition-all">Tênis</a></li>
                            <li><a href="#" onClick={handleEmptyClick} className="hover:text-white hover:pl-1 transition-all">Festivais</a></li>
                        </ul>
                    </Reveal>

                    {/* Company Links */}
                    <Reveal className="lg:col-span-2" delay={200}>
                        <h4 className="font-semibold text-[13px] mb-6 text-white">Empresa</h4>
                        <ul className="space-y-4 text-[13px] text-neutral-400">
                            <li><a href="#" onClick={handleEmptyClick} className="hover:text-white hover:pl-1 transition-all">Sobre Nós</a></li>
                            <li><a href="#" onClick={handleEmptyClick} className="hover:text-white hover:pl-1 transition-all">Imprensa</a></li>
                            <li><a href="#" onClick={handleEmptyClick} className="hover:text-white hover:pl-1 transition-all">Calendário de Eventos</a></li>
                            <li><a href="#" onClick={handleEmptyClick} className="hover:text-white hover:pl-1 transition-all">Acesso Platinum</a></li>
                            <li><a href="#" onClick={handleEmptyClick} className="hover:text-white hover:pl-1 transition-all">Contato</a></li>
                            <li><a href="#" onClick={handleEmptyClick} className="hover:text-white hover:pl-1 transition-all">Ajuda e FAQ</a></li>
                        </ul>
                    </Reveal>

                    {/* Newsletter Container */}
                    <Reveal className="lg:col-span-5 flex flex-col justify-start" delay={300}>
                        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 shadow-lg backdrop-blur-sm">
                            <h4 className="font-semibold text-[15px] mb-3 text-white">Assine nossa Newsletter</h4>
                            <p className="text-[13px] text-neutral-400 leading-relaxed mb-6">
                                Descubra as novidades. Lançamentos exclusivos, pacotes e hospitalidade premium da E-Mais entregues na sua caixa de entrada.
                            </p>
                            <form className="flex w-full mb-4">
                                <input
                                    type="email"
                                    placeholder="Endereço de e-mail"
                                    className="bg-neutral-900 border border-neutral-700 text-white rounded-l-lg py-3 px-4 outline-none text-sm w-full focus:border-gold transition-colors placeholder:text-neutral-500"
                                />
                                <button onClick={handleEmptyClick} type="button" className="bg-gold border border-gold rounded-r-lg py-3 px-6 text-black hover:bg-white hover:border-white transition-colors font-semibold text-sm">
                                    ASSINAR
                                </button>
                            </form>
                            <p className="text-[11px] text-neutral-500 leading-tight">
                                Ao enviar, você concorda com nossos <a href="#" onClick={handleEmptyClick} className="text-neutral-400 hover:text-white underline decoration-neutral-600 underline-offset-2">Termos e Condições</a> e com a <a href="#" onClick={handleEmptyClick} className="text-neutral-400 hover:text-white underline decoration-neutral-600 underline-offset-2">Política de Privacidade</a>.
                            </p>
                        </div>
                    </Reveal>
                </div>

                {/* Bottom Bar: Copyright, Legal & Social */}
                <Reveal className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 pb-4 text-[12px] text-neutral-500">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8">
                        <p className="font-medium text-neutral-400">© 2026 E-MAIS. Todos os direitos reservados.</p>
                        <div className="flex items-center gap-4 mt-2 md:mt-0">
                            <a href="#" onClick={handleEmptyClick} className="hover:text-white transition-colors">Política de Privacidade</a>
                            <a href="#" onClick={handleEmptyClick} className="hover:text-white transition-colors">Termos de Uso</a>
                            <a href="#" onClick={handleEmptyClick} className="hover:text-white transition-colors">Política de Cookies</a>
                            <a href="#" onClick={handleEmptyClick} className="hover:text-white transition-colors">Acessibilidade</a>
                            <span className="text-neutral-700">·</span>
                            <a href="/admin" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-neutral-600">Painel Administrativo</a>
                        </div>
                    </div>

                    <div className="flex gap-5 mt-6 md:mt-0">
                        <a href="#" className="text-neutral-400 hover:text-[#E1306C] transition-colors"><Instagram size={18} /></a>
                        <a href="#" className="text-neutral-400 hover:text-[#1DA1F2] transition-colors"><Twitter size={18} /></a>
                        <a href="#" className="text-neutral-400 hover:text-[#0A66C2] transition-colors"><Linkedin size={18} /></a>
                        <a href="#" className="text-neutral-400 hover:text-[#FF0000] transition-colors"><Youtube size={18} /></a>
                    </div>
                </Reveal>
            </div>
        </footer>
    );
}

