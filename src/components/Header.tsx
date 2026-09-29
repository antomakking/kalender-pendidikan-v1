import React from 'react';
import { Calendar, Clock, Download, Lock, LockOpen, Plus, Printer, ShieldCheck } from 'lucide-react';
import { formatRemainingTime } from '../utils/securityUtils.ts';

interface HeaderProps {
  onAddEvent: () => void;
  onOpenPrint: () => void;
  onOpenStandaloneExport?: () => void;
  onExportICal?: () => void;
  isManagerUnlocked?: boolean;
  remainingSeconds?: number;
  onLockSession?: () => void;
  onOpenPinSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onAddEvent,
  onOpenPrint,
  onExportICal,
  isManagerUnlocked = false,
  remainingSeconds = 0,
  onLockSession,
  onOpenPinSettings,
}) => {
  return (
    <header className="bg-[#143c14] border-b-4 border-[#ffcc00] text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 bg-[#143c14]">
        {/* Zone 1: Institutional Wordmark & Branding */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#ffcc00] text-[#143c14] flex items-center justify-center shadow-xs font-black">
            <Calendar className="w-5 h-5 text-[#143c14]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base sm:text-lg tracking-tight block leading-tight">
                KALENDER AKADEMIK
              </span>
              <span className="text-[10px] font-bold bg-[#ffcc00] text-[#143c14] px-1.5 py-0.2 rounded-xs uppercase tracking-wider">
                TA. 2026/2027
              </span>
            </div>
            <span className="text-xs text-blue-200/90 font-medium hidden sm:block">
              SMK IT Ibnul Qayyim Makassar
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links & Manager Mode Status */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-blue-100">
          <a href="#kalender" className="text-[#ffcc00] hover:text-white transition-colors">
            Kalender Akademik
          </a>
          <a href="#agenda-mendatang" className="hover:text-[#ffcc00] transition-colors">
            Agenda Mendatang
          </a>
          {isManagerUnlocked && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[11px] shadow-2xs font-semibold"
              title="Sesi pengelola akan logout otomatis per 15 menit untuk keamanan"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#ffcc00]" />
              <span>Mode Pengelola</span>
              <span className="font-mono font-bold text-white bg-emerald-950/80 px-1.5 py-0.2 rounded text-[10px] border border-emerald-500/40">
                {formatRemainingTime(remainingSeconds)}
              </span>
            </div>
          )}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          {/* Security status / PIN button */}
          {isManagerUnlocked ? (
            <button
              onClick={onLockSession}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900 rounded-lg transition-colors border border-emerald-500/30 whitespace-nowrap cursor-pointer shadow-2xs"
              title={`Sesi aktif (${formatRemainingTime(remainingSeconds)} tersisa). Klik untuk kunci sesi sekarang.`}
            >
              <LockOpen className="w-3.5 h-3.5 text-[#ffcc00]" />
              <span className="hidden sm:inline">Kunci ({formatRemainingTime(remainingSeconds)})</span>
              <span className="sm:hidden">{formatRemainingTime(remainingSeconds)}</span>
            </button>
          ) : (
            <button
              onClick={onOpenPinSettings}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20 whitespace-nowrap cursor-pointer shadow-2xs"
              title="Masuk sebagai Pengelola / Pengaturan PIN"
            >
              <Lock className="w-3.5 h-3.5 text-[#ffcc00]" />
              <span className="hidden xl:inline">Akses PIN</span>
            </button>
          )}

          {/* Export iCal (.ics) / Google Calendar button */}
          <button
            onClick={onExportICal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20 whitespace-nowrap cursor-pointer shadow-2xs"
            title="Ekspor agenda ke Google Calendar / berkas iCal (.ics)"
          >
            <Download className="w-4 h-4 text-[#ffcc00]" />
            <span className="hidden sm:inline">Ekspor ke Google Cal (.ics)</span>
            <span className="sm:hidden">.ics</span>
          </button>

          {/* Export PDF / Print button */}
          <button
            onClick={onOpenPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20 whitespace-nowrap cursor-pointer shadow-2xs"
            title="Export dokumen kalender resmi ke PDF"
          >
            <Printer className="w-4 h-4 text-[#ffcc00]" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>

          {/* Add event button */}
          <button
            onClick={onAddEvent}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-extrabold text-slate-950 bg-[#ffcc00] hover:bg-[#eab308] rounded-lg transition-colors shadow-xs whitespace-nowrap cursor-pointer"
            title={isManagerUnlocked ? 'Tambah Agenda Baru' : 'Tambah Agenda Baru (Perlu PIN Pengelola)'}
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
            <span>Tambah Agenda</span>
          </button>
        </div>
      </div>
    </header>
  );
};

