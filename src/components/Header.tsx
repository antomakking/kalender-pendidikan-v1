import React, { useEffect, useRef, useState } from 'react';
import {
  Bell,
  Calendar,
  Clock,
  Download,
  Lock,
  LockOpen,
  MoreVertical,
  Plus,
  Printer,
  ShieldCheck,
  Smartphone,
  X,
} from 'lucide-react';
import { formatRemainingTime } from '../utils/securityUtils.ts';
import { PWAInstallButton } from './PWAInstallButton.tsx';

interface HeaderProps {
  academicYear?: string;
  onAddEvent: () => void;
  onOpenPrint: () => void;
  onOpenStandaloneExport?: () => void;
  onExportICal?: () => void;
  onOpenNotificationModal?: () => void;
  tomorrowEventsCount?: number;
  isManagerUnlocked?: boolean;
  remainingSeconds?: number;
  onLockSession?: () => void;
  onOpenPinSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  academicYear = '2026/2027',
  onAddEvent,
  onOpenPrint,
  onOpenStandaloneExport,
  onExportICal,
  onOpenNotificationModal,
  tomorrowEventsCount = 0,
  isManagerUnlocked = false,
  remainingSeconds = 0,
  onLockSession,
  onOpenPinSettings,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-[#143c14] border-b-4 border-[#ffcc00] text-white sticky top-0 z-30 shadow-md w-full max-w-full">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 bg-[#143c14] w-full min-w-0">
        
        {/* Zone 1: Institutional Wordmark & Branding (Flexible min-w-0) */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-hidden">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#ffcc00] text-[#143c14] flex items-center justify-center shadow-xs font-black shrink-0">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#143c14]" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-black text-white text-xs sm:text-base md:text-lg tracking-tight truncate block leading-tight">
                KALENDER AKADEMIK
              </span>
              <span className="hidden xs:inline-block text-[9px] sm:text-[10px] font-bold bg-[#ffcc00] text-[#143c14] px-1.5 py-0.2 rounded-xs uppercase tracking-wider shrink-0">
                {academicYear}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-blue-200/90 font-medium hidden sm:block truncate">
              SMK IT Ibnul Qayyim Makassar
            </span>
          </div>
        </div>

        {/* Zone 2: Desktop Navigation Links & Manager Mode Status (Hidden on mobile) */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-bold text-blue-100 shrink-0">
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

        {/* Zone 3: Desktop Full Actions (Visible on lg and larger) */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {/* Security status / PIN button */}
          {isManagerUnlocked ? (
            <button
              onClick={onLockSession}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900 rounded-lg transition-colors border border-emerald-500/30 whitespace-nowrap cursor-pointer shadow-2xs"
              title={`Sesi aktif (${formatRemainingTime(remainingSeconds)} tersisa). Klik untuk kunci sesi sekarang.`}
            >
              <LockOpen className="w-3.5 h-3.5 text-[#ffcc00]" />
              <span>Kunci ({formatRemainingTime(remainingSeconds)})</span>
            </button>
          ) : (
            <button
              onClick={onOpenPinSettings}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20 whitespace-nowrap cursor-pointer shadow-2xs"
              title="Masuk sebagai Pengelola / Pengaturan PIN"
            >
              <Lock className="w-3.5 h-3.5 text-[#ffcc00]" />
              <span>Akses PIN</span>
            </button>
          )}

          {/* Notification H-1 Button */}
          {onOpenNotificationModal && (
            <button
              onClick={onOpenNotificationModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-[#ffcc00] hover:bg-[#eab308] rounded-lg transition-colors shadow-2xs whitespace-nowrap cursor-pointer relative"
              title="Sistem Notifikasi Pengingat Browser H-1 Agenda"
            >
              <Bell className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>Notifikasi H-1</span>
              {tomorrowEventsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white font-mono text-[10px] font-black flex items-center justify-center -top-1 -right-1 absolute ring-2 ring-[#143c14]">
                  {tomorrowEventsCount}
                </span>
              )}
            </button>
          )}

          {/* Export iCal (.ics) / Google Calendar button */}
          <button
            onClick={onExportICal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20 whitespace-nowrap cursor-pointer shadow-2xs"
            title="Ekspor agenda ke Google Calendar / berkas iCal (.ics)"
          >
            <Download className="w-4 h-4 text-[#ffcc00]" />
            <span>Ekspor .ics</span>
          </button>

          {/* Standalone Single File (index.html) Export Button (Protected by PIN) */}
          {onOpenStandaloneExport && (
            <button
              onClick={onOpenStandaloneExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-900 bg-amber-300 hover:bg-amber-400 rounded-lg transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
              title={
                isManagerUnlocked
                  ? 'Unduh 1 file index.html mandiri untuk Hostinger (Sesi Aktif)'
                  : 'Unduh 1 file index.html mandiri untuk Hostinger (Perlu PIN Pengelola)'
              }
            >
              {!isManagerUnlocked ? (
                <Lock className="w-3.5 h-3.5 text-slate-900 stroke-[2.5]" />
              ) : (
                <Download className="w-4 h-4 text-slate-900 stroke-[2.5]" />
              )}
              <span>Unduh index.html</span>
            </button>
          )}

          {/* PWA Mobile & Desktop Install Prompt */}
          <PWAInstallButton />

          {/* Export PDF / Print button */}
          <button
            onClick={onOpenPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20 whitespace-nowrap cursor-pointer shadow-2xs"
            title="Export dokumen kalender resmi ke PDF"
          >
            <Printer className="w-4 h-4 text-[#ffcc00]" />
            <span>Export PDF</span>
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

        {/* Zone 4: Mobile & Tablet Compact Action Bar (Always guaranteed not to overflow) */}
        <div className="flex lg:hidden items-center gap-1.5 shrink-0" ref={menuRef}>
          {/* Primary Action: Tambah Button */}
          <button
            onClick={onAddEvent}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-black text-slate-950 bg-[#ffcc00] hover:bg-[#eab308] active:scale-95 rounded-lg transition-all shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
            title={isManagerUnlocked ? 'Tambah Agenda Baru' : 'Tambah Agenda (Perlu PIN)'}
          >
            <Plus className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
            <span>Tambah</span>
          </button>

          {/* Dropdown Menu Toggle for All Secondary Actions */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
                isMobileMenuOpen
                  ? 'bg-white/20 border-white text-[#ffcc00]'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
              title="Menu Tindakan Lengkap"
              aria-label="Menu Tindakan Lengkap"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Mobile Dropdown Popover */}
            {isMobileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 z-50 p-2 text-xs divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150">
                {/* Section 1: Security & Manager Session */}
                <div className="p-1.5 pb-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
                    Keamanan & Akses
                  </div>
                  {isManagerUnlocked ? (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onLockSession?.();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-emerald-50 text-emerald-950 hover:bg-emerald-100 transition-colors font-semibold text-left"
                    >
                      <span className="flex items-center gap-2">
                        <LockOpen className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Kunci Sesi Pengelola</span>
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold shrink-0">
                        {formatRemainingTime(remainingSeconds)}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenPinSettings?.();
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-slate-700 text-left"
                    >
                      <Lock className="w-4 h-4 text-[#143c14] shrink-0" />
                      <span>Masuk / Pengaturan PIN</span>
                    </button>
                  )}
                </div>

                {/* Section 2: PWA Install Option */}
                <div className="p-1.5 py-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                    Aplikasi Mobile
                  </div>
                  <div className="w-full">
                    <PWAInstallButton />
                  </div>
                </div>

                {/* Section 3: Ekspor & Dokumen */}
                <div className="p-1.5 py-2 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                    Ekspor & Dokumen
                  </div>

                  {onOpenNotificationModal && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenNotificationModal();
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 transition-colors font-semibold text-left border border-amber-200"
                    >
                      <Bell className="w-4 h-4 text-amber-900 fill-amber-900 shrink-0" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span>Notifikasi Pengingat H-1</span>
                          {tomorrowEventsCount > 0 && (
                            <span className="bg-rose-600 text-white font-mono text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                              {tomorrowEventsCount} Besok
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-amber-800/80 font-normal">Pengingat browser otomatis</div>
                      </div>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenPrint();
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-slate-700 text-left"
                  >
                    <Printer className="w-4 h-4 text-[#143c14] shrink-0" />
                    <div>
                      <div>Export PDF / Cetak Resmi</div>
                      <div className="text-[10px] text-slate-400 font-normal">Cetak dokumen kalender</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onExportICal?.();
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-slate-700 text-left"
                  >
                    <Download className="w-4 h-4 text-[#143c14] shrink-0" />
                    <div>
                      <div>Ekspor .ics (Google Calendar)</div>
                      <div className="text-[10px] text-slate-400 font-normal">Sinkron ke kalender HP</div>
                    </div>
                  </button>

                  {onOpenStandaloneExport && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenStandaloneExport();
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 transition-colors font-semibold text-left border border-amber-200/60"
                    >
                      {!isManagerUnlocked ? (
                        <Lock className="w-4 h-4 text-amber-900 shrink-0" />
                      ) : (
                        <Download className="w-4 h-4 text-amber-900 shrink-0" />
                      )}
                      <div>
                        <div>Unduh index.html (Hostinger)</div>
                        <div className="text-[10px] text-amber-700/80 font-normal">
                          {!isManagerUnlocked ? 'Perlu PIN Pengelola' : '1 Berkas Mandiri'}
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
