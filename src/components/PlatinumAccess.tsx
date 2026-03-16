import { Check } from 'lucide-react';
import { useToast } from './ui/ToastProvider';
import Reveal from './Reveal';

export default function PlatinumAccess() {
  const { toast } = useToast();

  const handleEmptyClick = () => {
    toast('Ações de usuário estão desabilitadas neste Preview.', 'info');
  };

  return (
    <section id="platinum" className="bg-gold text-black py-24 px-6 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Left Content */}
          <Reveal className="w-full lg:w-1/2 flex flex-col items-start text-left">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/90 mb-6 block">
              Experiências Premium
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-6 leading-[1.1]">
              Acesso<br />Platinum
            </h2>
            <h3 className="text-2xl md:text-3xl font-light mb-8 text-white leading-tight">
              Curadoria. Personalização. <span className="font-semibold">Sem limites.</span>
            </h3>
            <p className="text-black/80 font-medium text-base md:text-lg leading-relaxed mb-10 max-w-xl">
              Experimente o melhor do luxo em esportes e entretenimento. Nosso Acesso Platinum vai além do ingresso, oferecendo roteiros sob medida, festas VIP extraordinárias e anfitriões dedicados para um nível de serviço inigualável.
            </p>
            
            <button onClick={handleEmptyClick} className="text-sm font-bold uppercase tracking-[0.15em] text-white border-b-2 border-white pb-2 hover:text-black hover:border-black transition-colors mb-16">
              Vamos Planejar a Viagem
            </button>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
              <div className="flex gap-4 items-start">
                <div className="text-white mt-1 shrink-0 bg-black/10 p-2 rounded-full"><Check size={18} strokeWidth={3} /></div>
                <div>
                  <h5 className="font-bold text-sm mb-1 uppercase tracking-[0.1em] text-white">Programas Sob Medida</h5>
                  <p className="text-sm text-black/70 font-medium">Roteiros personalizados para cada necessidade.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="text-white mt-1 shrink-0 bg-black/10 p-2 rounded-full"><Check size={18} strokeWidth={3} /></div>
                <div>
                  <h5 className="font-bold text-sm mb-1 uppercase tracking-[0.1em] text-white">Acesso Inigualável</h5>
                  <p className="text-sm text-black/70 font-medium">No campo, vestiários, bastidores.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="text-white mt-1 shrink-0 bg-black/10 p-2 rounded-full"><Check size={18} strokeWidth={3} /></div>
                <div>
                  <h5 className="font-bold text-sm mb-1 uppercase tracking-[0.1em] text-white">Acomodações de Luxo</h5>
                  <p className="text-sm text-black/70 font-medium">Hotéis 5 estrelas e vilas privativas.</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right Images (Modern Collage) */}
          <Reveal className="w-full lg:w-1/2 relative h-[500px] md:h-[600px] lg:h-[750px] rounded-[2rem] overflow-hidden group shadow-2xl shadow-black/30" delay={200}>
             {/* Main background image */}
             <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Vista do estádio cheio durante o pôr do sol - Experiência Platinum" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
             
             {/* Gradient Overlay for elegance */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
             
          </Reveal>

        </div>
      </div>
    </section>
  );
}
