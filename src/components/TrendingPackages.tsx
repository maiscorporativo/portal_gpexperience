import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { TrendingPackage } from '../types';
import Reveal from './Reveal';
import PackageModal from './PackageModal';
import { useContentConfig } from '../hooks/useContentConfig';

const GAP = 24; // gap-6 = 24px

export default function TrendingPackages() {
  const [selectedPackage, setSelectedPackage] = useState<TrendingPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [cardWidth, setCardWidth] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const { packages } = useContentConfig();

  const updateSizes = useCallback(() => {
    const w = window.innerWidth;
    const perPage = w >= 1024 ? 4 : w >= 640 ? 2 : 1;
    const containerWidth = wrapperRef.current?.clientWidth ?? w - 48;
    const cw = (containerWidth - (perPage - 1) * GAP) / perPage;
    setItemsPerPage(perPage);
    setCardWidth(cw);
  }, []);

  useEffect(() => {
    updateSizes();
    window.addEventListener('resize', updateSizes);
    return () => window.removeEventListener('resize', updateSizes);
  }, [updateSizes]);

  const maxIndex = Math.max(0, packages.length - itemsPerPage);

  const goLeft = () => setCurrentIndex(i => Math.max(0, i - itemsPerPage));
  const goRight = () => setCurrentIndex(i => Math.min(maxIndex, i + itemsPerPage));

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goRight() : goLeft();
  };

  const handleOpenModal = (pkg: TrendingPackage) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedPackage(null);
      document.body.style.overflow = '';
    }, 300);
  };

  // Offset em px: cada card ocupa (cardWidth + GAP)
  const offsetX = currentIndex * (cardWidth + GAP);

  return (
    <section id="trending" className="bg-neutral-50 text-black py-24 px-6 relative">
      <div className="max-w-[1400px] mx-auto">
        <Reveal className="flex justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">Pacotes em Alta</h2>
          <div className="hidden sm:flex gap-4 text-black">
            <button
              onClick={goLeft}
              disabled={currentIndex === 0}
              className="text-neutral-400 hover:text-gold transition-colors disabled:opacity-30"
              aria-label="Anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={goRight}
              disabled={currentIndex >= maxIndex}
              className="text-neutral-400 hover:text-gold transition-colors disabled:opacity-30"
              aria-label="Próximo"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </Reveal>

        {/* Wrapper que mede a largura real disponível */}
        <div ref={wrapperRef} className="relative">
          {/*
            overflow:hidden + py-8 -my-8: cria um "buffer" vertical de 32px acima e abaixo.
            Isso permite que a animação 3D (scale 1.02 ≈ 10px) não seja cortada.
            O overflow:hidden neste div apenas corta na horizontal; o py/my garante
            que verticalmente há espaço suficiente dentro das bordas do clipping.
          */}
          <div className="overflow-hidden py-8 -my-8 px-6 -mx-6">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                gap: `${GAP}px`,
                transform: `translateX(-${offsetX}px)`,
              }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {packages.map((pkg, i) => (
                <div
                  key={i}
                  className="shrink-0"
                  style={{
                    width: cardWidth > 0 ? `${cardWidth}px` : `calc((100% - ${(itemsPerPage - 1) * GAP}px) / ${itemsPerPage})`,
                    perspective: '1000px',
                  }}
                >
                  <div
                    className="bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 border border-neutral-200 flex flex-col group h-full relative z-10 hover:shadow-2xl"
                    style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      const centerX = rect.width / 2;
                      const centerY = rect.height / 2;
                      const rotateX = -((y - centerY) / centerY) * 12;
                      const rotateY = ((x - centerX) / centerX) * 12;
                      e.currentTarget.style.transition = 'none';
                      e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transition = 'transform 0.5s ease-out';
                      e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                    }}
                  >
                    <div className="relative h-48 bg-neutral-200 overflow-hidden rounded-t-[11px]">
                      <div className="absolute top-4 right-4 z-10 bg-gold text-black backdrop-blur text-[10px] font-bold px-2 py-1 rounded tracking-wider shadow-sm">
                        {pkg.tag}
                      </div>
                      <img src={pkg.img} alt={`Pacote ${pkg.title} em ${pkg.loc}`} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute -bottom-4 left-4 w-12 h-12 bg-white rounded-md shadow-md flex items-center justify-center p-2 z-20">
                        <span className="text-[10px] font-bold uppercase">{pkg.badge}</span>
                      </div>
                    </div>
                    <div className="p-6 pt-8 flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold mb-1 leading-tight">{pkg.title}</h3>
                      <div className="text-xs text-neutral-500 mb-6 flex-1 space-y-1">
                        <div>{pkg.date} | {pkg.loc}</div>
                      </div>
                      <div className="space-y-3 mb-6 flex-1">
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0"></div>
                          <span className="text-sm font-medium text-neutral-600">Ingresso Oficial Incluso</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0"></div>
                          <span className="text-sm font-medium text-neutral-600">Festa Pré-Jogo</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0"></div>
                          <span className="text-sm font-medium text-neutral-600">Serviço de Concierge</span>
                        </div>
                      </div>
                      <div className="border-t border-neutral-100 pt-4 flex flex-col">
                        <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">Pacotes a partir de</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-semibold text-lg">R$ {pkg.price}</span>
                          <button
                            onClick={() => handleOpenModal(pkg)}
                            className="text-sm font-semibold text-gold hover:text-black transition-colors flex items-center gap-1"
                            aria-label={`Ver pacote ${pkg.title}`}
                          >
                            Ver pacote <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <PackageModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          pkg={selectedPackage}
        />
      </div>
    </section>
  );
}
