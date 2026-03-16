import { useState } from 'react';
import { Headphones, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleEmptyClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <>
      {/* New Top Banner */}
      <div className="w-full px-8 pt-4 pb-2 text-xs flex flex-col md:flex-row justify-center md:justify-between items-center gap-2 text-neutral-100 font-medium">
        <span className="text-center">
          Confira nosso <a href="#events" className="underline text-gold hover:text-white transition-colors font-bold">calendário completo de eventos</a>
        </span>
        <span className="flex items-center justify-center gap-2 tracking-wide text-sm text-gold font-semibold hover:text-white cursor-pointer transition-colors" onClick={handleEmptyClick}>
          (xx) xxxx-xxxx <Headphones size={16} strokeWidth={2.5} className="mb-[2px]" />
        </span>
      </div>

      {/* Floating Navbar "Pill" */}
      <nav className="w-full sticky top-4 z-50 px-4 transition-all mb-6">
        <div className="mx-auto w-full max-w-[1400px] flex items-center justify-between h-[52px] bg-[#041121]/60 backdrop-blur-lg rounded-lg px-6 shadow-xl border border-white/10 font-sans">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <img src="/emais-logo.svg" alt="e-mais" className="h-[22px]" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-7 text-[13px] text-neutral-300 font-medium">
            <a href="#events" className="hover:text-gold transition-colors duration-200">Eventos</a>
            <a href="#trending" className="hover:text-gold transition-colors duration-200">Em Alta</a>
            <a href="#platinum" className="hover:text-gold transition-colors duration-200">Acesso Platinum</a>
            <a href="#testimonials" className="hover:text-gold transition-colors duration-200">Testemunhos</a>
            <a href="#" onClick={handleEmptyClick} className="hover:text-white transition-colors duration-200">Esportes</a>
            <a href="#" onClick={handleEmptyClick} className="hover:text-white transition-colors duration-200">Universitário</a>
            <a href="#" onClick={handleEmptyClick} className="hover:text-white transition-colors duration-200">Sobre</a>
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
            <a href="#events" className="hover:text-gold" onClick={() => setIsMobileMenuOpen(false)}>Eventos</a>
            <a href="#trending" className="hover:text-gold" onClick={() => setIsMobileMenuOpen(false)}>Em Alta</a>
            <a href="#platinum" className="hover:text-gold" onClick={() => setIsMobileMenuOpen(false)}>Acesso Platinum</a>
            <a href="#testimonials" className="hover:text-gold" onClick={() => setIsMobileMenuOpen(false)}>Testemunhos</a>
            <a href="#" className="hover:text-gold" onClick={(e) => { setIsMobileMenuOpen(false); handleEmptyClick(e); }}>Esportes</a>
            <a href="#" className="hover:text-gold" onClick={(e) => { setIsMobileMenuOpen(false); handleEmptyClick(e); }}>Universitário</a>
            <a href="#" className="hover:text-gold" onClick={(e) => { setIsMobileMenuOpen(false); handleEmptyClick(e); }}>Sobre</a>

          </div>
        </div>
      )}
    </>
  );
}
