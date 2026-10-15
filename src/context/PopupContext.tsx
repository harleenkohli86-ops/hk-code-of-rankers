import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CheckCircle2, LogOut, X } from 'lucide-react';

const SUCCESS_AUTO_DISMISS_MS = 3500;

interface PopupOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'success' | 'confirm';
  resolve?: (v: boolean) => void;
}

interface PopupContextValue {
  /** Auto-dismissing success toast (top-center). Vanishes on its own — no button needed. */
  showSuccess: (title: string, message: string) => void;
  /** Confirmation dialog. Resolves to true when confirmed, false when cancelled. */
  showConfirm: (
    title: string,
    message: string,
    options?: { confirmText?: string; cancelText?: string }
  ) => Promise<boolean>;
}

const PopupContext = createContext<PopupContextValue | undefined>(undefined);

export const usePopup = () => {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error('usePopup must be used within PopupProvider');
  return ctx;
};

export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [popup, setPopup] = useState<PopupOptions | null>(null);
  const popupRef = useRef<PopupOptions | null>(null);

  const dismiss = useCallback(() => {
    popupRef.current = null;
    setPopup(null);
  }, []);

  const showSuccess = useCallback((title: string, message: string) => {
    const next: PopupOptions = { title, message, variant: 'success' };
    popupRef.current = next;
    setPopup(next);
  }, []);

  const close = useCallback((result: boolean) => {
    const current = popupRef.current;
    popupRef.current = null;
    setPopup(null);
    current?.resolve?.(result);
  }, []);

  const showConfirm = useCallback(
    (title: string, message: string, options: { confirmText?: string; cancelText?: string } = {}) => {
      return new Promise<boolean>((resolve) => {
        const next: PopupOptions = {
          title,
          message,
          confirmText: options.confirmText || 'Confirm',
          cancelText: options.cancelText || 'Cancel',
          variant: 'confirm',
          resolve,
        };
        popupRef.current = next;
        setPopup(next);
      });
    },
    []
  );

  // Auto-dismiss the success toast after a few seconds
  useEffect(() => {
    if (!popup || popup.variant !== 'success') return;
    const timer = window.setTimeout(dismiss, SUCCESS_AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [popup, dismiss]);

  // Escape closes the confirmation dialog
  useEffect(() => {
    if (!popup || popup.variant !== 'confirm') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [popup, close]);

  return (
    <PopupContext.Provider value={{ showSuccess, showConfirm }}>
      {children}
      {/* Success toast — top-center, auto-dismisses on its own */}
      {popup?.variant === 'success' && (
        <div
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-md animate-drop-slide"
          role="status"
        >
          <div className="flex items-center gap-3 bg-[#141210]/95 backdrop-blur-sm border-2 border-[#C8A45D]/60 rounded-2xl px-4 py-3.5 shadow-2xl">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-[#C8A45D]/15 border border-[#C8A45D]/50 flex items-center justify-center animate-popup-icon">
              <CheckCircle2 className="w-5 h-5 text-[#C8A45D]" />
            </div>
            <div className="min-w-0">
              <h4 className="font-cinzel text-sm font-bold gold-gradient-text leading-tight">{popup.title}</h4>
              <p className="mt-0.5 text-[11px] text-gray-300 leading-snug font-poppins">{popup.message}</p>
            </div>
            <button
              onClick={dismiss}
              className="ml-auto shrink-0 text-gray-500 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Confirmation modal — Yes / Cancel */}
      {popup?.variant === 'confirm' && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-popup-fade"
          onClick={() => close(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-sm bg-[#141210] border-2 border-[#C8A45D]/60 rounded-3xl p-6 sm:p-7 text-white shadow-2xl animate-popup-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => close(false)}
              className="absolute top-3.5 right-3.5 text-gray-500 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border bg-amber-500/15 border-amber-500/50 animate-popup-icon">
                <LogOut className="w-8 h-8 text-amber-400" />
              </div>

              <h3 className="font-cinzel text-lg font-bold gold-gradient-text">{popup.title}</h3>
              <p className="mt-2 text-xs text-gray-300 leading-relaxed font-poppins">{popup.message}</p>

              <div className="mt-6 flex gap-2.5 w-full">
                <button
                  onClick={() => close(false)}
                  className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-montserrat font-bold rounded-xl transition-colors cursor-pointer"
                >
                  {popup.cancelText}
                </button>
                <button
                  onClick={() => close(true)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] hover:from-[#FFEFA6] hover:to-[#DFB96E] text-black text-xs font-montserrat font-bold rounded-xl transition-all cursor-pointer"
                >
                  {popup.confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PopupContext.Provider>
  );
};
