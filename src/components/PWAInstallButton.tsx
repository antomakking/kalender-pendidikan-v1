import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed or running standalone, hide the prompt
  if (isInstalled) {
    return null;
  }

  // Android / Chrome / Desktop PWA Install
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-[#ffcc00] hover:bg-[#eab308] rounded-lg transition-colors shadow-2xs whitespace-nowrap cursor-pointer animate-pulse"
        title="Instal aplikasi Kalender ke layar utama HP / Desktop"
      >
        <Smartphone className="w-4 h-4 text-slate-950" />
        <span>Instal Aplikasi</span>
      </button>
    );
  }

  // iOS Safari Guide Flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20 whitespace-nowrap cursor-pointer shadow-2xs"
          title="Instal aplikasi di iPhone / iPad"
        >
          <Smartphone className="w-4 h-4 text-[#ffcc00]" />
          <span>Instal di iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border-2 border-[#143c14]/20 relative animate-in fade-in zoom-in-95">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#143c14] text-[#ffcc00] flex items-center justify-center font-bold">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Instal di iPhone / iPad</h3>
                  <p className="text-[11px] text-slate-500">SMK IT Ibnul Qayyim Makassar</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#143c14] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                  <span>Buka website ini di browser <strong>Safari</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#143c14] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                  <span>Tekan tombol <strong>Bagikan / Share (ikon kotak tanda panah ke atas)</strong> di bilah menu bawah Safari.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#143c14] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                  <span>Gulir ke bawah dan pilih <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong>.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-[#143c14] py-2.5 text-xs font-bold text-white hover:bg-[#0b240b] transition-colors"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
