import { useEffect } from 'react';
import { Plane, BedDouble, Ticket, X } from 'lucide-react';
import type { TrendingPackage } from '../types';
import { useToast } from './ui/ToastProvider';

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: TrendingPackage | null;
}

export default function PackageModal({ isOpen, onClose, pkg }: PackageModalProps) {
  const { toast } = useToast();

  // Acesso via Teclado: Fecha via tecla Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleEmptyClick = () => {
    toast('Ações de usuário estão desabilitadas neste Preview.', 'info');
  };

  if (!isOpen || !pkg) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" aria-modal="true" role="dialog" aria-labelledby="modal-title">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal Content container */}
      <div className="relative bg-white text-black w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header Image */}
        <div className="relative h-48 md:h-64 rounded-t-2xl overflow-hidden">
          <img src={pkg.img} alt={pkg.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur transition-colors"
            aria-label="Fechar Modal de detalhes"
          >
            <X size={20} />
          </button>
          
          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-block bg-gold text-black text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase mb-2">
              {pkg.tag}
            </span>
            <h2 id="modal-title" className="text-3xl md:text-4xl font-bold text-white mb-1 leading-tight">{pkg.title}</h2>
            <p className="text-neutral-300 text-sm font-medium">{pkg.date} | {pkg.loc}</p>
          </div>
        </div>

        {/* Info Content Section */}
        <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
                
                {/* Left Side Details */}
                <div className="w-full md:w-2/3 space-y-8">
                    <div>
                        <h3 className="text-lg font-semibold border-b border-neutral-200 pb-2 mb-4">Sobre a Experiência</h3>
                        <p className="text-neutral-600 text-sm leading-relaxed">
                            {pkg.description || "Descrição detalhada do pacote ainda não informada. Por favor, contate nossos especialistas para um roteiro personalizado."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {/* Flight */}
                        {pkg.flightDetails && (
                        <div className="flex gap-4">
                            <div className="bg-neutral-100 p-3 rounded-xl h-fit text-neutral-700">
                            <Plane size={24} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-neutral-900 mb-1">Passagem Aérea</h4>
                                <p className="text-sm text-neutral-600">{pkg.flightDetails}</p>
                            </div>
                        </div>
                        )}

                        {/* Hotel */}
                        {pkg.hotelDetails && (
                        <div className="flex gap-4">
                            <div className="bg-neutral-100 p-3 rounded-xl h-fit text-neutral-700">
                            <BedDouble size={24} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-neutral-900 mb-1">Hospedagem Premium</h4>
                                <p className="text-sm text-neutral-600">{pkg.hotelDetails}</p>
                            </div>
                        </div>
                        )}

                        {/* Ticket */}
                        {pkg.ticketDetails && (
                        <div className="flex gap-4">
                            <div className="bg-neutral-100 p-3 rounded-xl h-fit text-neutral-700">
                            <Ticket size={24} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-neutral-900 mb-1">Ingressos Oficiais</h4>
                                <p className="text-sm text-neutral-600">{pkg.ticketDetails}</p>
                            </div>
                        </div>
                        )}
                    </div>
                </div>

                {/* Right Side Pricing and CTA */}
                <div className="w-full md:w-1/3">
                    <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 sticky top-4">
                        <p className="text-xs text-neutral-500 uppercase font-semibold tracking-wider mb-2">Valor Estimado</p>
                        <div className="text-3xl font-bold text-neutral-900 mb-6">
                            R$ {pkg.price}
                            <span className="text-sm font-normal text-neutral-500 block mt-1">por pessoa</span>
                        </div>

                        <div className="space-y-4">
                            <button onClick={handleEmptyClick} className="w-full bg-gold text-black font-bold flex items-center justify-center gap-2 py-3.5 rounded-xl hover:bg-[#d9621e] transition-colors shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-gold/50">
                                Reservar Pacote
                            </button>
                            <button onClick={handleEmptyClick} className="w-full bg-white text-neutral-800 border-2 border-neutral-200 font-bold flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-neutral-50 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-neutral-400">
                                Falar com um Consultor
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
