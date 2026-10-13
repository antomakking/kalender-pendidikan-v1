import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Filter,
  GraduationCap,
  Grid,
  History,
  List,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { CalendarView, ClassFilter, EventCategory, SemesterFilter } from '../types.ts';
import { CATEGORIES_CONFIG, MONTH_NAMES_ID, PRIMARY_CATEGORIES } from '../utils/calendarUtils.ts';

const RECENT_SEARCHES_KEY = 'smk_recent_searches_v1';
const DEFAULT_RECENT_SEARCHES = ['Ujian Tasmi\'', 'Sumatif Akhir', 'PKL', 'Libur', 'Rapor'];
const POPULAR_SHORTCUTS = ['Ujian', 'PKL', 'Libur', 'Rapor', 'Class Meeting', 'Tasmi\''];

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
  classFilter: ClassFilter;
  onChangeClassFilter: (cls: ClassFilter) => void;
  categoryFilter: EventCategory | 'all';
  onChangeCategoryFilter: (cat: EventCategory | 'all') => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
  eventsCountByCategory: Record<EventCategory | 'all', number>;
  eventsCountByClass?: Record<ClassFilter, number>;
  onOpenExportICal?: () => void;
  onOpenHebMatrix?: () => void;
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
  classFilter,
  onChangeClassFilter,
  categoryFilter,
  onChangeCategoryFilter,
  searchQuery,
  onChangeSearchQuery,
  eventsCountByCategory,
  eventsCountByClass,
  onOpenExportICal,
  onOpenHebMatrix,
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
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-3.5 sm:space-y-4 transition-colors" id="kalender">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        
        {/* View Switcher Tabs (horizontally scrollable on small mobile screens) */}
        <div className="flex overflow-x-auto max-w-full p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 self-start no-scrollbar relative">
          {(
            [
              { id: 'year' as const, label: 'Tahunan (12 Bulan)' },
              { id: 'month' as const, label: 'Bulanan' },
              { id: 'week' as const, label: 'Pekanan' },
              { id: 'agenda' as const, label: 'Daftar Agenda' },
            ] as const
          ).map((tab) => {
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeView(tab.id)}
                className={`relative px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive ? 'text-white' : 'text-slate-600 dark:text-slate-300 hover:text-[#143c14] dark:hover:text-emerald-400'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeViewTabPill"
                    className="absolute inset-0 bg-[#143c14] dark:bg-emerald-800 rounded-lg shadow-xs"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Period Navigation Controls & Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => onNavigateMonth(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shrink-0"
              title="Periode Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onGoToToday}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shrink-0"
            >
              Hari Ini
            </button>
            <button
              onClick={() => onNavigateMonth(1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shrink-0"
              title="Periode Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-base ml-1.5 truncate max-w-[140px] sm:max-w-none">
              {getPeriodLabel()}
            </span>
          </div>

          {/* Academic Year, Semester & Class Level Selectors */}
          <div className="flex items-center gap-1.5 ml-auto flex-wrap sm:flex-nowrap">
            <select
              value={academicYear}
              onChange={(e) => onChangeAcademicYear(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title="Pilih Tahun Ajaran"
            >
              <option value="2026/2027">TA 2026/2027</option>
              <option value="2027/2028">TA 2027/2028</option>
            </select>

            <select
              value={semester}
              onChange={(e) => onChangeSemester(e.target.value as SemesterFilter)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[115px] sm:max-w-none truncate"
              title="Pilih Semester"
            >
              <option value="all">Semua Smt</option>
              <option value="ganjil">Ganjil (Jul-Des)</option>
              <option value="genap">Genap (Jan-Jun)</option>
            </select>

            <select
              value={classFilter}
              onChange={(e) => onChangeClassFilter(e.target.value as ClassFilter)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-emerald-300/80 dark:border-emerald-600/80 rounded-lg px-2 py-1.5 font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[125px] sm:max-w-none truncate"
              title="Filter Tingkat Kelas"
            >
              <option value="all">🎓 Semua Kelas</option>
              <option value="X">Kelas X {eventsCountByClass ? `(${eventsCountByClass.X})` : ''}</option>
              <option value="XI">Kelas XI {eventsCountByClass ? `(${eventsCountByClass.XI})` : ''}</option>
              <option value="XII">Kelas XII {eventsCountByClass ? `(${eventsCountByClass.XII})` : ''}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Class Level Pills & Category Filter Bar */}
      <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        {/* Class Filter Pills */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1 shrink-0">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
              Tingkat:
            </span>
            <button
              type="button"
              onClick={() => onChangeClassFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                classFilter === 'all'
                  ? 'bg-slate-800 dark:bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Semua Kelas
            </button>
            <button
              type="button"
              onClick={() => onChangeClassFilter('X')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                classFilter === 'X'
                  ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-400/50'
                  : 'text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800'
              }`}
            >
              Kelas X {eventsCountByClass ? `(${eventsCountByClass.X})` : ''}
            </button>
            <button
              type="button"
              onClick={() => onChangeClassFilter('XI')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                classFilter === 'XI'
                  ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-400/50'
                  : 'text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800'
              }`}
            >
              Kelas XI {eventsCountByClass ? `(${eventsCountByClass.XI})` : ''}
            </button>
            <button
              type="button"
              onClick={() => onChangeClassFilter('XII')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                classFilter === 'XII'
                  ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-400/50'
                  : 'text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800'
              }`}
            >
              Kelas XII {eventsCountByClass ? `(${eventsCountByClass.XII})` : ''}
            </button>

            {onOpenHebMatrix && (
              <button
                type="button"
                onClick={onOpenHebMatrix}
                className="ml-auto px-3 py-1 rounded-lg text-xs font-black text-[#143c14] bg-[#ffcc00] hover:bg-[#eab308] border border-amber-400 shadow-xs transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                title="Lihat Matriks Kurikulum, Alokasi JP & Hari Efektif Belajar per Kelas"
              >
                <span>📊 Matriks JP & HEB</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Category Filter Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
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
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#143c14] focus:bg-white dark:focus:bg-slate-900 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onChangeSearchQuery('');
                  setIsSearchFocused(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}

            {/* Recent Searches Dropdown Menu */}
            {isSearchFocused && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-2 text-xs animate-in fade-in-50 slide-in-from-top-1 duration-150">
                {/* Dropdown Header */}
                <div className="flex items-center justify-between px-2 py-1 pb-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                    <History className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                    Pencarian Terakhir (Maks 5)
                  </span>
                  {recentSearches.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAllRecentSearches}
                      className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors text-[10px] font-medium"
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
                        className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer group transition-colors text-xs font-medium"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors shrink-0" />
                          <span className="truncate">{term}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => removeRecentSearch(term, e)}
                          className="text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 opacity-0 group-hover:opacity-100 p-0.5 transition-all cursor-pointer rounded"
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
                <div className="mt-1 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-1.5">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Pintasan Populer
                  </div>
                  <div className="flex flex-wrap gap-1 px-1">
                    {POPULAR_SHORTCUTS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleSelectKeyword(tag)}
                        className="text-[10.5px] font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 hover:text-emerald-900 dark:hover:text-emerald-200 border border-slate-200/80 dark:border-slate-700 rounded-md text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#143c14] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 rounded-lg border border-emerald-200 dark:border-emerald-800 transition-colors shrink-0 shadow-2xs cursor-pointer"
              title="Ekspor ke Google Calendar & berkas iCal (.ics)"
            >
              <Download className="w-3.5 h-3.5 text-[#143c14] dark:text-emerald-300" />
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
                ? 'bg-[#143c14] dark:bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Semua ({eventsCountByCategory.all || 0})
          </button>

          {PRIMARY_CATEGORIES.map((catKey) => {
            const catMeta = CATEGORIES_CONFIG[catKey];
            const isSelected =
              categoryFilter === catKey ||
              (catKey === 'kbm' && categoryFilter === 'academic') ||
              (catKey === 'school' && categoryFilter === 'teacher');
            const count =
              (eventsCountByCategory[catKey] || 0) +
              (catKey === 'kbm' ? eventsCountByCategory.academic || 0 : 0) +
              (catKey === 'school' ? eventsCountByCategory.teacher || 0 : 0);

            return (
              <button
                key={catKey}
                onClick={() => onChangeCategoryFilter(catKey)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors border cursor-pointer ${
                  isSelected
                    ? `${catMeta.bgSolid} shadow-xs text-white`
                    : `${catMeta.textColor} dark:text-slate-200 ${catMeta.bgLight} dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600`
                }`}
              >
                {catMeta.label} ({count})
              </button>
            );
          })}
        </div>
      </div>
      </div>
    </section>
  );
};
