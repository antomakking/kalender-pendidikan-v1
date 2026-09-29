import React, { useEffect } from 'react';
import {
  Calendar,
  Clock,
  Download,
  Edit,
  ExternalLink,
  MapPin,
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
} from '../utils/calendarUtils.ts';

interface EventDetailModalProps {
  event: AcademicEvent | null;
  onClose: () => void;
  onEdit: (event: AcademicEvent) => void;
  onDelete: (id: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onEdit,
  onDelete,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!event) return null;

  const cat = CATEGORIES_CONFIG[event.category] || CATEGORIES_CONFIG.academic;

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
        className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border-2 border-[#143c14]/20 relative animate-modal-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-slate-100"
          title="Tutup (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category Pill */}
        <div className="mb-3">
          <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${cat.bgBadge}`}>
            {cat.label}
          </span>
        </div>

        {/* Event Title */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
          {event.title}
        </h3>

        {/* Meta Info Grid */}
        <div className="mt-4 space-y-2.5 text-xs text-slate-600 border-y border-slate-100 py-3.5">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-semibold text-slate-900">
              {formatDateRange(event.startDate, event.endDate)}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              {event.startTime && event.endTime
                ? `${event.startTime} – ${event.endTime} WITA`
                : 'Jadwal Penuh Sekolah'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{event.location || 'Kampus SMK IT Ibnul Qayyim Makassar'}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-medium text-slate-800">Sasaran Peserta: {event.audience}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Rincian & Keterangan Kegiatan
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            {event.description}
          </p>
        </div>

        {/* Quick Sync actions */}
        <div className="mt-4 p-3 bg-emerald-50/60 rounded-xl border border-[#143c14]/20 space-y-2">
          <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
            Sinkronisasi ke Kalender Pribadi:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#143c14] bg-white hover:bg-emerald-50 font-bold px-3 py-1.5 rounded-lg border border-[#143c14]/30 transition-all shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#143c14]" />
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

        {/* Action Buttons */}
        <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (confirm(`Hapus kegiatan "${event.title}" dari kalender akademik?`)) {
                onDelete(event.id);
                onClose();
              }
            }}
            className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(event)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
