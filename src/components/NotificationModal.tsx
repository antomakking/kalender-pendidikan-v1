import React from 'react';
import { Bell, BellOff, Calendar, Check, CheckCircle2, Clock, Info, ShieldAlert, Sparkles, X } from 'lucide-react';
import { AcademicEvent } from '../types.ts';
import { formatIndonesianDate } from '../utils/calendarUtils.ts';
import { NotificationPermissionStatus } from '../hooks/useEventNotifications.ts';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  permission: NotificationPermissionStatus;
  onRequestPermission: () => Promise<NotificationPermissionStatus>;
  onSendTestNotification: () => Promise<boolean>;
  tomorrowEvents: AcademicEvent[];
  onSelectEvent: (event: AcademicEvent) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  permission,
  onRequestPermission,
  onSendTestNotification,
  tomorrowEvents,
  onSelectEvent,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative my-auto animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Bell className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                Pengingat Notifikasi H-1
              </h3>
              <p className="text-xs text-slate-500">
                Sistem otomatis pengingat browser 1 hari sebelum agenda penting dimulai.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Permission Status Box */}
        <div className="my-4 p-4 rounded-xl border space-y-3 bg-slate-50 border-slate-200">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Status Izin Browser:</span>
              {permission === 'granted' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Diizinkan (Aktif)
                </span>
              ) : permission === 'denied' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  Diblokir Browser
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Belum Diaktifkan
                </span>
              )}
            </div>

            {permission !== 'granted' && permission !== 'unsupported' && (
              <button
                onClick={onRequestPermission}
                className="px-3 py-1.5 text-xs font-extrabold text-slate-950 bg-[#ffcc00] hover:bg-[#eab308] rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Aktifkan Sekarang
              </button>
            )}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {permission === 'granted' ? (
              <span>
                Browser Anda <strong>siap menerima notifikasi pop-up H-1</strong>. Sistem akan mengingatkan siswa/guru secara otomatis setiap kali ada agenda H-1.
              </span>
            ) : permission === 'denied' ? (
              <span className="text-rose-700">
                Izin notifikasi diblokir oleh peramban. Silakan klik ikon gembok di bilah alamat URL browser Anda lalu izinkan notifikasi (Notifications: Allow).
              </span>
            ) : (
              <span>
                Aktifkan izin di atas agar perangkat Anda menampilkan pemberitahuan pengingat resmi H-1 sebelum pelaksanaan Ujian, PKL, KBM, atau Libur.
              </span>
            )}
          </p>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-500 font-medium">Uji kemampuan notifikasi di browser Anda:</span>
            <button
              onClick={onSendTestNotification}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-white bg-[#143c14] hover:bg-[#0b240b] rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ffcc00]" />
              <span>Tes Notifikasi Pop-up</span>
            </button>
          </div>
        </div>

        {/* Section: Events Starting Tomorrow (H-1) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-800" />
              <span>Agenda Dimulai Besok (H-1):</span>
            </span>
            <span className="text-emerald-800 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full">
              {tomorrowEvents.length} Agenda
            </span>
          </div>

          {tomorrowEvents.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
              Tidak ada agenda penting yang dimulai besok. Pengingat H-1 akan muncul secara otomatis ketika ada agenda besok!
            </div>
          ) : (
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {tomorrowEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => {
                    onSelectEvent(evt);
                    onClose();
                  }}
                  className="p-3 rounded-xl border border-amber-200 bg-amber-50/60 hover:border-amber-400 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-1.5 py-0.2 rounded uppercase tracking-wider">
                      Besok • {formatIndonesianDate(evt.startDate)}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-0.5">{evt.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{evt.description || evt.audience}</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#143c14] bg-[#ffcc00] px-2 py-1 rounded-lg shrink-0">
                    Buka →
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Standard W3C Web Notification API</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
