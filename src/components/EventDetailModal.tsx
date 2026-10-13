import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  Clock,
  Download,
  Edit,
  ExternalLink,
  MapPin,
  Repeat,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { AcademicEvent } from '../types.ts';
import {
  CATEGORIES_CONFIG,
  formatDateRange,
  formatIndonesianDate,
  generateICalFile,
  getEventClasses,
} from '../utils/calendarUtils.ts';

interface EventDetailModalProps {
  event: AcademicEvent | null;
  onClose: () => void;
  onEdit: (event: AcademicEvent) => void;
  onDelete: (id: string, deleteSeries?: boolean) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setShowDeleteConfirm(false);
  }, [event?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, showDeleteConfirm]);

  if (!event) return null;

  const cat = CATEGORIES_CONFIG[event.category] || CATEGORIES_CONFIG.academic;
  const isRecurring = Boolean(event.recurrenceId || event.isRecurring);

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = () => {
    const sDate = event.startDate.replace(/-/g, '');
    const [ey, em, ed] = event.endDate.split('-').map(Number);
    const nextDay = new Date(ey, em - 1, ed + 1);
    const eDate = nextDay.toISOString().slice(0, 10).replace(/-/g, '');

    const details = encodeURIComponent(
      `${event.description}\n\nPeserta: ${event.audience}\nLokasi: ${event.location}\nSMK IT Ibnul Qayyim Makassar`
    );
    const title = encodeURIComponent(event.title);
    const loc = encodeURIComponent(event.location);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${sDate}/${eDate}&details=${details}&location=${loc}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border-2 border-[#143c14]/20 dark:border-emerald-800/60 relative animate-modal-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Tutup (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category, Class & Recurring Pills */}
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${cat.bgBadge}`}>
            {cat.label}
          </span>
          {getEventClasses(event).map((cls, idx) => (
            <span
              key={`${cls}-${idx}`}
              className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                cls === 'X'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                  : cls === 'XI'
                  ? 'bg-sky-100 dark:bg-sky-950 text-sky-900 dark:text-sky-200 border border-sky-300 dark:border-sky-800'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
              }`}
            >
              Kelas {cls}
            </span>
          ))}
          {event.isRecurring && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
              <Repeat className="w-3 h-3 text-[#143c14] dark:text-emerald-400" />
              <span>
                {event.sessionIndex && event.totalSessions
                  ? `Sesi ${event.sessionIndex} dari ${event.totalSessions}`
                  : 'Agenda Berulang'}
              </span>
            </span>
          )}
        </div>

        {/* Event Title */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
          {event.title}
        </h3>

        {/* Meta Info Grid */}
        <div className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300 border-y border-slate-100 dark:border-slate-800 py-3.5">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {formatDateRange(event.startDate, event.endDate)}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>
              {event.startTime && event.endTime
                ? `${event.startTime} – ${event.endTime} WITA`
                : 'Jadwal Penuh Sekolah'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>{event.location || 'Kampus SMK IT Ibnul Qayyim Makassar'}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span className="font-medium text-slate-800 dark:text-slate-200">Sasaran Peserta: {event.audience}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Rincian & Keterangan Kegiatan
          </h4>
          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700">
            {event.description}
          </p>
        </div>

        {/* Quick Sync actions */}
        <div className="mt-4 p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-[#143c14]/20 dark:border-emerald-800/60 space-y-2">
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">
            Sinkronisasi ke Kalender Pribadi:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#143c14] dark:text-emerald-300 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 font-bold px-3 py-1.5 rounded-lg border border-[#143c14]/30 dark:border-emerald-700 transition-all shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#143c14] dark:text-emerald-400" />
              <span>Buka di Google Calendar</span>
            </a>

            <button
              onClick={() => generateICalFile([event], `${event.title.replace(/[^a-zA-Z0-9]/g, '-')}.ics`)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-900 bg-[#ffcc00] hover:bg-[#eab308] font-bold px-3 py-1.5 rounded-lg transition-all shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              <span>Unduh File .ics Agenda Ini</span>
            </button>
          </div>
        </div>

        {/* Interactive Delete Confirmation Box */}
        {showDeleteConfirm && (
          <div className="mt-4 p-4 bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-300 dark:border-rose-800 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-rose-900 dark:text-rose-200">
                  {isRecurring ? 'Konfirmasi Hapus Agenda Berulang' : 'Konfirmasi Hapus Agenda'}
                </h5>
                <p className="text-xs text-rose-800 dark:text-rose-300 mt-1 leading-relaxed">
                  {isRecurring
                    ? `Agenda "${event.title}" merupakan bagian dari agenda berulang. Pilih cakupan penghapusan:`
                    : `Yakin ingin menghapus agenda "${event.title}" secara permanen dari kalender akademik?`}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {isRecurring ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          onDelete(event.id, true);
                          onClose();
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer shadow-2xs"
                      >
                        Hapus Seluruh Seri ({event.totalSessions || 'Semua'} Sesi)
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onDelete(event.id, false);
                          onClose();
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-rose-950 bg-rose-200 dark:bg-rose-900 dark:text-rose-100 hover:bg-rose-300 dark:hover:bg-rose-800 rounded-lg transition-colors cursor-pointer"
                      >
                        Hapus Sesi Ini Saja
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(event.id, false);
                        onClose();
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer shadow-2xs"
                    >
                      Ya, Hapus Agenda Ini
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
              showDeleteConfirm
                ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-700'
                : 'text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-800'
            }`}
            title="Hapus agenda ini secara permanen"
          >
            <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>Hapus</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(event)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

