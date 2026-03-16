import { useRef } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import Reveal from './Reveal';
import { useContentConfig } from '../hooks/useContentConfig';

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { testimonials } = useContentConfig();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="testimonials" className="bg-white text-black py-24 px-6 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <Reveal className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">Acredite no Sucesso</h2>
          <p className="text-gold text-sm tracking-wider uppercase font-semibold">Conteúdo real de fãs reais.</p>
        </Reveal>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-8 snap-x no-scrollbar pr-6">
          {testimonials.map((item, i) => (
            <Reveal key={i} className={`min-w-[280px] w-[280px] aspect-[9/16] relative rounded-lg overflow-hidden snap-center group cursor-pointer bg-neutral-100`} delay={(i % 4 + 1) * 100}>
              <img src={item.img} alt={`Depoimento do cliente: ${item.user}`} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-main/80 via-transparent to-transparent flex flex-col justify-end p-5">
                <div className="text-white">
                  <p className="font-bold text-sm drop-shadow-md mb-1">{item.text}</p>
                  <div className="flex items-center gap-2 text-xs opacity-80">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center" aria-hidden="true"><User size={10} /></span>
                    {item.user}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="flex justify-end mt-4" delay={200}>
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="text-neutral-400 hover:text-gold hover:border-gold transition-colors rounded-full border p-2" aria-label="Depoimento Anterior">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll('right')} className="text-neutral-400 hover:text-gold hover:border-gold transition-colors rounded-full border p-2" aria-label="Próximo Depoimento">
              <ChevronRight size={20} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
