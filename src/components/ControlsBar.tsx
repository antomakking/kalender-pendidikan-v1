import React, { useEffect, useRef, useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Grid,
  History,
  List,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { CalendarView, EventCategory, SemesterFilter } from '../types.ts';
import { CATEGORIES_CONFIG, MONTH_NAMES_ID } from '../utils/calendarUtils.ts';

const RECENT_SEARCHES_KEY = 'smk_recent_searches_v1';
const DEFAULT_RECENT_SEARCHES = ['Ujian Tasmi\'', 'Sumatif Akhir', 'PKL', 'Libur', 'P5'];
const POPULAR_SHORTCUTS = ['Ujian', 'PKL', 'Libur', 'Rapor', 'P5', 'Class Meeting'];

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
  // Recent Searches State
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 5);
        }
      }
    } catch (e) {
      console.error('Failed to parse recent searches', e);
    }
    return DEFAULT_RECENT_SEARCHES;
  });

  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync to localStorage
  const saveRecentSearches = (items: string[]) => {
    const trimmed = items.slice(0, 5);
    setRecentSearches(trimmed);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.error('Failed to save recent searches', e);
    }
  };

  const addRecentSearch = (term: string) => {
    const clean = term.trim();
    if (clean.length < 2) return;
    const updated = [clean, ...recentSearches.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
    saveRecentSearches(updated);
  };

  const removeRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item !== term);
    saveRecentSearches(updated);
  };

  const clearAllRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    saveRecentSearches([]);
  };

  const handleSelectKeyword = (keyword: string) => {
    onChangeSearchQuery(keyword);
    addRecentSearch(keyword);
    setIsSearchFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim()) {
        addRecentSearch(searchQuery.trim());
      }
      setIsSearchFocused(false);
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        {/* Search input with Recent Searches Dropdown & Export .ics shortcut */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div ref={searchContainerRef} className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => onChangeSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Cari agenda, ujian, P5, libur, peserta..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#143c14] focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onChangeSearchQuery('');
                  setIsSearchFocused(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}

            {/* Recent Searches Dropdown Menu */}
            {isSearchFocused && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 text-xs animate-in fade-in-50 slide-in-from-top-1 duration-150">
                {/* Dropdown Header */}
                <div className="flex items-center justify-between px-2 py-1 pb-1.5 border-b border-slate-100 text-[11px] text-slate-500 font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <History className="w-3.5 h-3.5 text-emerald-700" />
                    Pencarian Terakhir (Maks 5)
                  </span>
                  {recentSearches.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAllRecentSearches}
                      className="text-slate-400 hover:text-rose-600 transition-colors text-[10px] font-medium"
                      title="Bersihkan semua riwayat pencarian"
                    >
                      Hapus Riwayat
                    </button>
                  )}
                </div>

                {/* Recent Items List */}
                <div className="py-1">
                  {recentSearches.length > 0 ? (
                    recentSearches.map((term) => (
                      <div
                        key={term}
                        onClick={() => handleSelectKeyword(term)}
                        className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-50 text-slate-800 cursor-pointer group transition-colors text-xs font-medium"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 transition-colors shrink-0" />
                          <span className="truncate">{term}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => removeRecentSearch(term, e)}
                          className="text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 p-0.5 transition-all cursor-pointer rounded"
                          title={`Hapus "${term}" dari riwayat`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-2.5 text-center text-[11px] text-slate-400">
                      Belum ada riwayat pencarian
                    </div>
                  )}
                </div>

                {/* Popular Search Shortcuts / Quick Tags */}
                <div className="mt-1 pt-1.5 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Pintasan Populer
                  </div>
                  <div className="flex flex-wrap gap-1 px-1">
                    {POPULAR_SHORTCUTS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleSelectKeyword(tag)}
                        className="text-[10.5px] font-medium px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-200 border border-slate-200/80 rounded-md text-slate-600 transition-colors cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
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
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-[#143c14] text-white shadow-xs'
                : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            Semua ({eventsCountByCategory.all})
          </button>

          <button
            onClick={() => onChangeCategoryFilter('academic')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors border cursor-pointer ${
              categoryFilter === 'academic'
                ? 'bg-[#ffcc00] text-slate-950 border-amber-500 shadow-xs'
                : 'text-amber-950 bg-amber-50 hover:bg-amber-100 border-amber-300'
            }`}
          >
            KBM & Pembelajaran ({eventsCountByCategory.academic})
          </button>

          <button
            onClick={() => onChangeCategoryFilter('holiday')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors border cursor-pointer ${
              categoryFilter === 'holiday'
                ? 'bg-[#dc2626] text-white border-red-700 shadow-xs'
                : 'text-rose-800 bg-rose-50 hover:bg-rose-100 border-rose-300'
            }`}
          >
            Hari Libur ({eventsCountByCategory.holiday})
          </button>

          <button
            onClick={() => onChangeCategoryFilter('student')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors border cursor-pointer ${
              categoryFilter === 'student'
                ? 'bg-[#0284c7] text-white border-sky-700 shadow-xs'
                : 'text-sky-800 bg-sky-50 hover:bg-sky-100 border-sky-300'
            }`}
          >
            Kesiswaan & PKL ({eventsCountByCategory.student})
          </button>

          <button
            onClick={() => onChangeCategoryFilter('teacher')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors border cursor-pointer ${
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
