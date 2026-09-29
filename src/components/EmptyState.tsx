import React from 'react';
import {
  Calendar,
  CalendarCheck2,
  CalendarOff,
  FilterX,
  Plus,
  RotateCcw,
  SearchX,
  Sparkles,
} from 'lucide-react';

interface EmptyStateProps {
  type?: 'search' | 'calendar' | 'upcoming' | 'filter';
  title?: string;
  description?: string;
  query?: string;
  categoryLabel?: string;
  onResetFilters?: () => void;
  onAddEvent?: () => void;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'search',
  title,
  description,
  query,
  categoryLabel,
  onResetFilters,
  onAddEvent,
  compact = false,
}) => {
  // Determine icons and default titles
  let IconComponent = SearchX;
  let iconBg = 'bg-amber-50 border-amber-200 text-amber-600';
  let badgeAccent = 'bg-amber-100 text-amber-800';

  if (type === 'calendar') {
    IconComponent = CalendarOff;
    iconBg = 'bg-slate-50 border-slate-200 text-slate-500';
    badgeAccent = 'bg-slate-100 text-slate-700';
  } else if (type === 'upcoming') {
    IconComponent = CalendarCheck2;
    iconBg = 'bg-emerald-50 border-emerald-200 text-emerald-600';
    badgeAccent = 'bg-emerald-100 text-emerald-800';
  } else if (type === 'filter') {
    IconComponent = FilterX;
    iconBg = 'bg-sky-50 border-sky-200 text-sky-600';
    badgeAccent = 'bg-sky-100 text-sky-800';
  }

  const defaultTitle =
    title ||
    (type === 'upcoming'
      ? 'Jadwal Mendatang Masih Lengang'
      : query
      ? `Tidak Ada Hasil untuk "${query}"`
      : 'Belum Ada Agenda yang Cocok');

  const defaultDescription =
    description ||
    (type === 'upcoming'
      ? 'Tidak ada agenda khusus dalam 14–21 hari ke depan. Santri dan guru fokus pada Kegiatan Belajar Mengajar (KBM) reguler.'
      : query
      ? 'Silakan periksa ejaan kata kunci atau coba gunakan istilah lain seperti ujian, PTS, libur, atau nama kegiatan.'
      : categoryLabel
      ? `Tidak ditemukan kegiatan untuk kategori "${categoryLabel}" pada periode yang dipilih.`
      : 'Coba ubah filter kategori atau bersihkan pencarian untuk melihat seluruh agenda akademik sekolah.');

  if (compact) {
    return (
      <div className="py-5 px-3 text-center rounded-xl bg-slate-50/70 border border-dashed border-slate-200 flex flex-col items-center justify-center">
        <div className={`w-9 h-9 rounded-full ${iconBg} border flex items-center justify-center mb-2 shadow-2xs`}>
          <IconComponent className="w-4 h-4" />
        </div>
        <p className="text-xs font-bold text-slate-800 leading-tight">{defaultTitle}</p>
        <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed">{defaultDescription}</p>
        {(onResetFilters || onAddEvent) && (
          <div className="flex items-center gap-2 mt-3">
            {onResetFilters && (
              <button
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
              >
                <RotateCcw className="w-3 h-3 text-slate-500" />
                <span>Reset Filter</span>
              </button>
            )}
            {onAddEvent && (
              <button
                onClick={onAddEvent}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Tambah Agenda</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 text-center rounded-2xl bg-white border border-slate-200/90 shadow-2xs my-2 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative background aura */}
      <div className="absolute w-64 h-64 bg-radial from-emerald-100/40 via-transparent to-transparent rounded-full -top-20 -right-20 pointer-events-none" />
      <div className="absolute w-64 h-64 bg-radial from-amber-100/30 via-transparent to-transparent rounded-full -bottom-20 -left-20 pointer-events-none" />

      {/* Friendly Stacked Illustration Badge */}
      <div className="relative mb-4">
        {/* Outer pulse ring */}
        <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shadow-xs">
          <div className={`w-14 h-14 rounded-xl ${iconBg} border flex items-center justify-center shadow-xs transition-transform duration-300 hover:scale-105`}>
            <IconComponent className="w-7 h-7" />
          </div>
        </div>

        {/* Small floating playful badge */}
        <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        </div>
      </div>

      {/* Content */}
      <h3 className="text-base font-bold text-slate-900 tracking-tight max-w-md">
        {defaultTitle}
      </h3>

      <p className="text-xs text-slate-500 mt-1.5 max-w-md leading-relaxed">
        {defaultDescription}
      </p>

      {/* Interactive Helper Actions */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Pencarian & Filter</span>
          </button>
        )}

        {onAddEvent && (
          <button
            onClick={onAddEvent}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Agenda Baru</span>
          </button>
        )}
      </div>
    </div>
  );
};
