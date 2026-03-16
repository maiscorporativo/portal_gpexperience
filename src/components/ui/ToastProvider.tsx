import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Info, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'info' | 'success' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-green-500 shrink-0" size={20} />;
      case 'warning': return <AlertTriangle className="text-amber-500 shrink-0" size={20} />;
      default: return <Info className="text-blue-500 shrink-0" size={20} />;
    }
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Container fixo para renderizar os agrupamentos de Toasts ativos */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] flex flex-col items-center gap-2 pointer-events-none px-4 w-full max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 bg-white/95 backdrop-blur shadow-xl shadow-black/10 border border-neutral-200 rounded-full py-2.5 px-4 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto"
            role="alert"
          >
            {getIcon(t.type)}
            <span className="text-sm font-semibold text-neutral-800 flex-1">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="text-neutral-400 hover:text-black transition-colors rounded-full focus:outline-none"
              aria-label="Dispensar aviso"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
