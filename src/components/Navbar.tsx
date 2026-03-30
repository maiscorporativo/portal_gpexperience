import { useState } from 'react';
import { Headphones, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* New Top Banner */}
      <div className="w-full px-8 pt-4 pb-2 text-xs flex flex-col md:flex-row justify-center md:justify-between items-center gap-2 text-neutral-100 font-medium">
        <span className="text-center">
          Confira nosso <a href="/" onClick={scrollTo('events')} className="underline text-gold hover:text-white transition-colors font-bold">calendário completo de eventos</a>
        </span>
        <a href="https://api.whatsapp.com/send/?phone=5518997624457&text=Ol%C3%A1,%20tudo%20bem?%20Gostaria%20de%20falar%20com%20um%20consultor.&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 tracking-wide text-sm text-gold font-semibold hover:text-white cursor-pointer transition-colors">
          +55 (18) 99762-4457 <Headphones size={16} strokeWidth={2.5} className="mb-[2px]" />
        </a>
      </div>

      {/* Floating Navbar "Pill" */}
      <nav className="w-full sticky top-4 z-50 px-4 transition-all mb-6">
        <div className="mx-auto w-full max-w-[1400px] flex items-center justify-between h-[52px] bg-[#041121]/60 backdrop-blur-lg rounded-lg px-6 shadow-xl border border-white/10 font-sans">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/emais-logo.svg" alt="e-mais" className="h-[22px]" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-7 text-[13px] text-neutral-300 font-medium">
            <a href="/" onClick={scrollTo('trending')} className="hover:text-gold transition-colors duration-200">Em Alta</a>
            <a href="/" onClick={scrollTo('events')} className="hover:text-gold transition-colors duration-200">Eventos</a>
            <a href="/" onClick={scrollTo('platinum')} className="hover:text-gold transition-colors duration-200">Acesso Platinum</a>

          </div>


          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-gold transition-colors p-1"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl lg:hidden pt-24 px-6 flex flex-col">
          <div className="flex flex-col gap-6 text-xl font-medium text-center text-white">
            <a href="/" className="hover:text-gold" onClick={scrollTo('trending')}>Em Alta</a>
            <a href="/" className="hover:text-gold" onClick={scrollTo('events')}>Eventos</a>
            <a href="/" className="hover:text-gold" onClick={scrollTo('platinum')}>Acesso Platinum</a>


          </div>
        </div>
      )}
    </>
  );
}
