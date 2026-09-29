import React from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Grid,
  List,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { CalendarView, EventCategory, SemesterFilter } from '../types.ts';
import { CATEGORIES_CONFIG, MONTH_NAMES_ID } from '../utils/calendarUtils.ts';

interface ControlsBarProps {
  currentView: CalendarView;
  onChangeView: (view: CalendarView) => void;
  currentYear: number;
  currentMonth: number; // 0-indexed
  onNavigateMonth: (delta: number) => void;
  onGoToToday: () => void;
  academicYear: string;
  onChangeAcademicYear: (year: string) => void;
  semester: SemesterFilter;
  onChangeSemester: (sem: SemesterFilter) => void;
  categoryFilter: EventCategory | 'all';
  onChangeCategoryFilter: (cat: EventCategory | 'all') => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
  eventsCountByCategory: Record<EventCategory | 'all', number>;
  onOpenExportICal?: () => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  currentView,
  onChangeView,
  currentYear,
  currentMonth,
  onNavigateMonth,
  onGoToToday,
  academicYear,
  onChangeAcademicYear,
  semester,
  onChangeSemester,
  categoryFilter,
  onChangeCategoryFilter,
  searchQuery,
  onChangeSearchQuery,
  eventsCountByCategory,
  onOpenExportICal,
}) => {
  // Compute text label for current period
  const getPeriodLabel = () => {
    if (currentView === 'month') {
      return `${MONTH_NAMES_ID[currentMonth]} ${currentYear}`;
    }
    if (currentView === 'year') {
      return `Tahun Ajaran ${academicYear}`;
    }
    if (currentView === 'week') {
      return `Pekan Efektif · ${MONTH_NAMES_ID[currentMonth]} ${currentYear}`;
    }
    return `Seluruh Agenda TA ${academicYear}`;
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-3.5 sm:space-y-4" id="kalender">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        
        {/* View Switcher Tabs (horizontally scrollable on small mobile screens) */}
        <div className="flex overflow-x-auto max-w-full p-1 bg-slate-100 rounded-xl border border-slate-200/80 self-start no-scrollbar">
          <button
            onClick={() => onChangeView('year')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'year'
                ? 'bg-[#143c14] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#143c14]'
            }`}
          >
            Tahunan (12 Bulan)
          </button>
          <button
            onClick={() => onChangeView('month')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'month'
                ? 'bg-[#143c14] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#143c14]'
            }`}
          >
            Bulanan
          </button>
          <button
            onClick={() => onChangeView('week')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'week'
                ? 'bg-[#143c14] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#143c14]'
            }`}
          >
            Pekanan
          </button>
          <button
            onClick={() => onChangeView('agenda')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'agenda'
                ? 'bg-[#143c14] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#143c14]'
            }`}
          >
            Daftar Agenda
          </button>
        </div>

        {/* Period Navigation Controls & Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => onNavigateMonth(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shrink-0"
              title="Periode Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onGoToToday}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors shrink-0"
            >
              Hari Ini
            </button>
            <button
              onClick={() => onNavigateMonth(1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shrink-0"
              title="Periode Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="font-bold text-slate-900 text-xs sm:text-base ml-1.5 truncate max-w-[140px] sm:max-w-none">
              {getPeriodLabel()}
            </span>
          </div>

          {/* Academic Year & Semester Selectors */}
          <div className="flex items-center gap-1.5 ml-auto">
            <select
              value={academicYear}
              onChange={(e) => onChangeAcademicYear(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="2025/2026">TA 2025/2026</option>
              <option value="2026/2027">TA 2026/2027</option>
              <option value="2027/2028">TA 2027/2028</option>
            </select>

            <select
              value={semester}
              onChange={(e) => onChangeSemester(e.target.value as SemesterFilter)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[125px] sm:max-w-none truncate"
            >
              <option value="all">Semua Smt</option>
              <option value="ganjil">Ganjil (Jul-Des)</option>
              <option value="genap">Genap (Jan-Jun)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-slate-100">
        {/* Search input & Export .ics shortcut */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onChangeSearchQuery(e.target.value)}
              placeholder="Cari agenda, ujian, P5, libur, peserta..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#143c14]"
            />
            {searchQuery && (
              <button
                onClick={() => onChangeSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {onOpenExportICal && (
            <button
              type="button"
              onClick={onOpenExportICal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#143c14] bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors shrink-0 shadow-2xs cursor-pointer"
              title="Ekspor ke Google Calendar & berkas iCal (.ics)"
            >
              <Download className="w-3.5 h-3.5 text-[#143c14]" />
              <span className="hidden sm:inline">Ekspor .ics</span>
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => onChangeCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
              categoryFilter === 'all'
                ? 'bg-[#143c14] text-white shadow-xs'
                : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            Semua ({eventsCountByCategory.all})
          </button>

          <button
            onClick={() => onChangeCategoryFilter('academic')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors border ${
              categoryFilter === 'academic'
                ? 'bg-[#ffcc00] text-slate-950 border-amber-500 shadow-xs'
                : 'text-amber-950 bg-amber-50 hover:bg-amber-100 border-amber-300'
            }`}
          >
            KBM & Pembelajaran ({eventsCountByCategory.academic})
          </button>

          <button
            onClick={() => onChangeCategoryFilter('holiday')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors border ${
              categoryFilter === 'holiday'
                ? 'bg-[#dc2626] text-white border-red-700 shadow-xs'
                : 'text-rose-800 bg-rose-50 hover:bg-rose-100 border-rose-300'
            }`}
          >
            Hari Libur ({eventsCountByCategory.holiday})
          </button>

          <button
            onClick={() => onChangeCategoryFilter('student')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors border ${
              categoryFilter === 'student'
                ? 'bg-[#0284c7] text-white border-sky-700 shadow-xs'
                : 'text-sky-800 bg-sky-50 hover:bg-sky-100 border-sky-300'
            }`}
          >
            Kesiswaan & PKL ({eventsCountByCategory.student})
          </button>

          <button
            onClick={() => onChangeCategoryFilter('teacher')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors border ${
              categoryFilter === 'teacher'
                ? 'bg-[#15803d] text-white border-emerald-700 shadow-xs'
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-300'
            }`}
          >
            Penilaian & Rapor ({eventsCountByCategory.teacher})
          </button>
        </div>
      </div>
    </section>
  );
};
