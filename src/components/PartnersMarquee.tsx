export default function PartnersMarquee() {
  return (
    <section className="py-20 border-b border-white/5 overflow-hidden flex flex-col items-center" style={{ background: 'linear-gradient(to bottom, transparent 0%, #041121 60%)' }}>
      <p className="text-[11px] text-[#4a6f93] uppercase tracking-[0.2em] mb-10 font-bold z-10 px-6 text-center">
        Eventos mais iconicos e importantes do mundo
      </p>

      <div className="w-full relative flex overflow-hidden">
        {/* Gradient masks for smooth fade in/out on edges */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#041121] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#041121] to-transparent z-10 pointer-events-none"></div>

        <div className="flex w-max animate-marquee opacity-40 hover:opacity-100 transition-opacity duration-300">
          {[1, 2, 3, 4].map((set) => (
            <div key={set} className="flex items-center justify-around gap-16 md:gap-32 px-8 md:px-16 w-max" aria-hidden={set !== 1 ? "true" : "false"}>
              <img src="/partners/nfl.png" alt="NFL" className="h-8 md:h-12 w-auto object-contain" />
              <img src="/partners/libertadores.png" alt="Libertadores" className="h-8 md:h-12 w-auto object-contain" />
              <img src="/partners/ufc.png" alt="UFC" className="h-8 md:h-12 w-auto object-contain" />
              <img src="/partners/copa%202026.png" alt="Copa 2026" className="h-8 md:h-12 w-auto object-contain" />
              <img src="/partners/olimpiadas.png" alt="Olimpíadas" className="h-8 md:h-12 w-auto object-contain" />
              <img src="/partners/wimbledon.png" alt="Wimbledon" className="h-8 md:h-12 w-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
