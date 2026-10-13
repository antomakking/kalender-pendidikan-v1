import React, { useMemo } from 'react';
import { CalendarDays, Clock, Sparkles } from 'lucide-react';
import { AcademicEvent, SemesterFilter } from '../types.ts';
import { calculateAcademicStats, formatIndonesianDate } from '../utils/calendarUtils.ts';

interface StatsBannerProps {
  events: AcademicEvent[];
  academicYear: string;
  semester: SemesterFilter;
  todayStr: string;
  currentYear?: number;
  currentMonth?: number;
  onResetData?: () => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  events,
  academicYear,
  semester,
  todayStr,
  currentYear,
  currentMonth,
}) => {
  // Compute 100% real dynamic stats based on actual recorded events in the calendar
  const stats = useMemo(() => {
    return calculateAcademicStats(events, semester, academicYear, todayStr, currentYear, currentMonth);
  }, [events, semester, academicYear, todayStr, currentYear, currentMonth]);

  return (
    <section className="bg-white dark:bg-slate-900 border-2 border-[#143c14]/20 dark:border-emerald-800/50 rounded-2xl p-5 shadow-xs overflow-hidden transition-colors">
      {/* Top Poster-inspired Header Strip */}
      <div className="bg-[#143c14] dark:bg-emerald-950/90 text-white -m-5 mb-5 p-5 border-b-4 border-[#ffcc00] dark:border-emerald-500 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-[#ffcc00] uppercase tracking-wider">
              KALENDER AKADEMIK TA. {academicYear}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Semester</span>
              <span className="bg-[#ffcc00] text-[#143c14] px-3 py-0.5 rounded-lg font-black tracking-wider uppercase text-lg sm:text-2xl shadow-sm">
                {semester === 'all' ? 'GANJIL & GENAP' : semester.toUpperCase()}
              </span>
            </h2>
          </div>

          <p className="text-xs text-blue-100/90 mt-1 max-w-2xl">
            <span className="text-[#ffcc00] font-bold">Penting: </span>
            Kalender Akademik ini berlaku untuk seluruh tingkatan kelas & jurusan. Hari libur mengacu pada kalender kegiatan sekolah dan keputusan yayasan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="inline-flex items-center gap-1.5 bg-white/10 text-white border border-white/20 px-3 py-1.5 rounded-lg font-medium">
            <Clock className="w-3.5 h-3.5 text-[#ffcc00]" />
            <span>Hari ini: <strong className="font-bold text-[#ffcc00]">{formatIndonesianDate(todayStr, { withDayName: true })}</strong></span>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid - 100% Real Live Computed Data */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-1">
        {/* 1. HEB Bulan yang Sedang Berjalan (Otomatis) */}
        <div className="p-3.5 bg-emerald-50/90 dark:bg-emerald-950/40 rounded-xl border border-emerald-300 dark:border-emerald-800/80 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span
              className="text-xs text-emerald-950 dark:text-emerald-200 font-bold block truncate"
              title={`Hari Efektif Belajar Bulan Berjalan: ${stats.runningMonthName} ${stats.runningYear}`}
            >
              HEB {stats.runningMonthName} {stats.runningYear}
            </span>
            <span className="text-[10px] bg-emerald-200/90 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-100 font-bold px-1.5 py-0.5 rounded-md shrink-0 border border-emerald-300/60 dark:border-emerald-700/60 leading-none">
              Bulan Berjalan
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-900 dark:text-emerald-100 mt-1 tabular-nums">
            {stats.runningMonthEffectiveSchoolDays} <span className="text-xs font-normal text-emerald-700 dark:text-emerald-300">Hari</span>
          </div>
          <span
            className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5 block truncate"
            title={`Dari ${stats.runningMonthTotalWeekdays} hari kerja kalender (${stats.runningMonthHolidayDays} libur)`}
          >
            {stats.runningMonthTotalWeekdays} Hari Kerja ({stats.runningMonthHolidayDays} Libur)
          </span>
        </div>

        {/* 2. Real HEB (Hari Efektif Belajar) Semester/TA */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">
            HEB {semester === 'all' ? '1 Tahun' : `Semester ${semester.toUpperCase()}`}
          </span>
          <div className="text-2xl font-black text-[#143c14] dark:text-emerald-400 mt-1 tabular-nums">
            {stats.effectiveSchoolDays} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">Hari</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block truncate" title={`Dari ${stats.totalWeekdays} hari aktif kalender`}>
            {semester === 'all' ? `Total TA ${academicYear}` : `Smt ${semester.toUpperCase()}`}
          </span>
        </div>

        {/* 3. Real Total Agenda KBM & Pembelajaran */}
        <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/80">
          <span className="text-xs text-amber-950 dark:text-amber-200 font-bold block">
            Total Agenda KBM
          </span>
          <div className="text-2xl font-black text-amber-950 dark:text-amber-100 mt-1 tabular-nums">
            {stats.totalEventsCount}{' '}
            <span className="text-xs font-normal text-amber-800 dark:text-amber-300">Kegiatan</span>
          </div>
          <span className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5 block truncate">
            {stats.academicEventsCount} KBM & Ujian Pokok
          </span>
        </div>

        {/* 4. Real Agenda 14 Hari ke Depan */}
        <div className="p-3.5 bg-sky-50/70 dark:bg-sky-950/40 rounded-xl border border-sky-200 dark:border-sky-800/80">
          <span className="text-xs text-sky-950 dark:text-sky-200 font-bold block">
            Agenda 14 Hari
          </span>
          <div className="text-2xl font-black text-[#0284c7] dark:text-sky-400 mt-1 tabular-nums">
            {stats.upcoming14DaysCount}{' '}
            <span className="text-xs font-normal text-sky-700 dark:text-sky-300">Kegiatan</span>
          </div>
          <span className="text-[11px] text-sky-700 dark:text-sky-300 mt-0.5 block truncate">
            {stats.upcoming14DaysCount > 0
              ? `${stats.upcoming14DaysEvents[0]?.title.slice(0, 18)}...`
              : 'Tidak ada agenda'}
          </span>
        </div>

        {/* 5. Real Hari Libur Resmi & Nasional */}
        <div className="p-3.5 bg-rose-50/70 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800/80">
          <span className="text-xs text-rose-950 dark:text-rose-200 font-bold block">
            Hari Libur Resmi
          </span>
          <div className="text-2xl font-black text-[#dc2626] dark:text-rose-400 mt-1 tabular-nums">
            {stats.holidayEventsCount}{' '}
            <span className="text-xs font-normal text-rose-700 dark:text-rose-300">Agenda</span>
          </div>
          <span className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5 block truncate">
            {stats.totalHolidayDaysInSemester} Hari Libur Terdata
          </span>
        </div>
      </div>
    </section>
  );
};

