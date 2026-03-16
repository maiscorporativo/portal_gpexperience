import Reveal from './Reveal';
import { useImageConfig } from '../hooks/useImageConfig';

export default function HeroSection() {
  const { getImage } = useImageConfig();

  return (
    <section className="relative pt-6 pb-20 px-6 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-12 items-stretch">
      {/* Left Content */}
      <Reveal className="w-full lg:w-5/12 z-10 flex flex-col justify-between py-2">
        <div>
          <h1 className="text-[3.2rem] lg:text-[4.2rem] font-semibold leading-[1.05] mb-6 tracking-tight">
            O seu passaporte<br />
            para o<br />
            <span className="font-light italic text-gold text-[3.2rem] lg:text-[4.2rem]">Inesquecível</span>
          </h1>
          <p className="text-neutral-400 text-lg mb-10 max-w-md leading-relaxed pr-4">
            Vivencie momentos inesquecíveis com Ingressos Oficiais, VIP e Hospitalidade para os melhores eventos esportivos do mundo, feitos sob medida para você e seus convidados.
          </p>
        </div>
      </Reveal>

      {/* Right Content (Masonry Image Grid with Endless Scrolling) */}
      <Reveal className="w-full lg:w-7/12 relative min-h-[400px] md:min-h-[500px]" delay={200}>
        <div className="absolute -inset-8 p-8 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_5%,black_95%,transparent)] pointer-events-none">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-full pointer-events-auto w-full">
            {/* Column 1 - Marquee Up */}
        <div className="relative hidden md:block">
          <div className="flex flex-col gap-4 w-full absolute animate-marquee-up hover:[animation-play-state:paused] -top-12">
            <div className="flex flex-col gap-4">
              <img src={getImage('hero_col1_1')} alt="Esportes ação 1" className="w-full h-48 object-cover rounded-xl shadow-xl shadow-black/80" />
              <img src={getImage('hero_col1_2')} alt="Festa e esportes" className="w-full h-64 object-cover rounded-xl shadow-xl shadow-black/80" />
              <img src={getImage('hero_col1_3')} alt="Estádio vista" className="w-full h-56 object-cover rounded-xl shadow-xl shadow-black/80" />
              <img src={getImage('hero_col1_4')} alt="Momento do jogo" className="w-full h-40 object-cover rounded-xl shadow-xl shadow-black/80" />
            </div>
            <div className="flex flex-col gap-4">
              <img src={getImage('hero_col1_1')} alt="Esportes ação 1 duplicado" className="w-full h-48 object-cover rounded-xl shadow-xl shadow-black/80" />
              <img src={getImage('hero_col1_2')} alt="Festa e esportes duplicado" className="w-full h-64 object-cover rounded-xl shadow-xl shadow-black/80" />
              <img src={getImage('hero_col1_3')} alt="Estádio vista duplicado" className="w-full h-56 object-cover rounded-xl shadow-xl shadow-black/80" />
              <img src={getImage('hero_col1_4')} alt="Momento do jogo duplicado" className="w-full h-40 object-cover rounded-xl shadow-xl shadow-black/80" />
            </div>
          </div>
        </div>

        {/* Column 2 - Marquee Down (Visible on mobile too) */}
        <div className="relative">
          <div className="flex flex-col gap-4 w-full absolute animate-marquee-down hover:[animation-play-state:paused] -top-4">
            <div className="flex flex-col gap-4">
              <img src={getImage('hero_col2_1')} alt="Vitória esportes" className="w-full h-56 object-cover rounded-xl shadow-xl shadow-black/80" />
              <img src={getImage('hero_col2_2')} alt="Copa premium" className="w-full h-48 object-cover rounded-xl shadow-xl shadow-black/80" />
              <img src={getImage('hero_col2_3')} alt="Piscina olimpica" className="w-full h-64 object-cover rounded-xl shadow-xl shadow-black/80" />
              <img src={getImage('hero_col2_4')} alt="Atleta corrida" className="w-full h-48 object-cover rounded-xl shadow-xl shadow-black/80" />
            </div>
            <div className="flex flex-col gap-4">
              <img src={getImage('hero_col2_1')} alt="Vitória esportes duplicado" className="w-full h-56 object-cover rounded-xl shadow-xl shadow-black/80" />
              <img src={getImage('hero_col2_2')} alt="Copa premium duplicado" className="w-full h-48 object-cover rounded-xl shadow-xl shadow-black/80" />
              <img src={getImage('hero_col2_3')} alt="Piscina olimpica duplicado" className="w-full h-64 object-cover rounded-xl shadow-xl shadow-black/80" />
              <img src={getImage('hero_col2_4')} alt="Atleta corrida duplicado" className="w-full h-48 object-cover rounded-xl shadow-xl shadow-black/80" />
            </div>
          </div>
        </div>

        {/* Column 3 - Marquee Up (Visible on mobile too) */}
        <div className="relative">
          <div className="flex flex-col gap-4 w-full absolute animate-marquee-up hover:[animation-play-state:paused] -top-16">
            <div className="flex flex-col gap-4">
              <img src={getImage('hero_col3_1')} alt="Bandeira evento" className="w-full h-64 object-cover rounded-xl shadow-xl shadow-black/80" />
              <img src={getImage('hero_col3_2')} alt="Pista de luta" className="w-full h-48 object-cover rounded-xl shadow-xl shadow-black/80" />
              <img src={getImage('hero_col3_3')} alt="Competição" className="w-full h-56 object-cover rounded-xl shadow-xl shadow-black/80" />
              <img src={getImage('hero_col3_4')} alt="Torcida vibrando" className="w-full h-40 object-cover rounded-xl shadow-xl shadow-black/80" />
            </div>
            <div className="flex flex-col gap-4">
              <img src={getImage('hero_col3_1')} alt="Bandeira evento duplicado" className="w-full h-64 object-cover rounded-xl shadow-xl shadow-black/80" />
              <img src={getImage('hero_col3_2')} alt="Pista de luta duplicado" className="w-full h-48 object-cover rounded-xl shadow-xl shadow-black/80" />
              <img src={getImage('hero_col3_3')} alt="Competição duplicado" className="w-full h-56 object-cover rounded-xl shadow-xl shadow-black/80" />
              <img src={getImage('hero_col3_4')} alt="Torcida vibrando duplicado" className="w-full h-40 object-cover rounded-xl shadow-xl shadow-black/80" />
            </div>
          </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
