import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award,
  BookOpen,
  ChevronRight,
  Info,
  TrendingUp,
  Filter,
  GraduationCap,
  Sparkles,
  Milestone,
  ArrowRight,
  CalendarDays,
} from 'lucide-react';
import { AcademicEvent, ClassFilter, EventCategory, SemesterFilter } from '../types.ts';
import {
  CATEGORIES_CONFIG,
  calculateMonthlyDashboardStats,
  formatDateRange,
  formatIndonesianDate,
  MonthlyDashboardItem,
} from '../utils/calendarUtils.ts';

interface DashboardViewProps {
  events: AcademicEvent[];
  academicYear: string;
  semester: SemesterFilter;
  classFilter: ClassFilter;
  onSelectEvent: (event: AcademicEvent) => void;
  onChangeSemester?: (sem: SemesterFilter) => void;
  onChangeClassFilter?: (cls: ClassFilter) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  events,
  academicYear,
  semester,
  classFilter,
  onSelectEvent,
  onChangeSemester,
  onChangeClassFilter,
}) => {
  // Chart view metric mode: 'agendas' | 'kbm' | 'hours'
  const [metricMode, setMetricMode] = useState<'agendas' | 'kbm' | 'hours'>('agendas');
  const [hoveredMonth, setHoveredMonth] = useState<MonthlyDashboardItem | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Event Timeline Filter State: 'all' | 'assessment' | 'academic' | 'school' | 'holiday'
  const [timelineCategory, setTimelineCategory] = useState<string>('all');

  // Compute dashboard analytics
  const stats = useMemo(() => {
    return calculateMonthlyDashboardStats(events, academicYear, semester, classFilter);
  }, [events, academicYear, semester, classFilter]);

  const { monthlyData, categoryDistribution, semesterTotals, peakWorkloadMonth, highPriorityAgendas } = stats;

  // Filter & calculate gap days for horizontal Event Timeline
  const timelineItems = useMemo(() => {
    // 1. Filter events based on class & timeline category
    const classFiltered = events.filter((e) => {
      if (classFilter === 'all') return true;
      if (e.targetClasses && e.targetClasses.length > 0) {
        return e.targetClasses.includes(classFilter);
      }
      if (e.audience) {
        if (e.audience.includes('Semua') || e.audience.includes(`Kelas ${classFilter}`)) return true;
      }
      return true;
    });

    const categoryFiltered = classFiltered.filter((e) => {
      if (timelineCategory === 'assessment') return e.category === 'assessment';
      if (timelineCategory === 'academic') return e.category === 'kbm' || e.category === 'academic';
      if (timelineCategory === 'school') return e.category === 'school' || e.category === 'student' || e.category === 'teacher';
      if (timelineCategory === 'holiday') return e.category === 'holiday';
      return true;
    });

    // 2. Sort chronologically
    const sorted = [...categoryFiltered].sort((a, b) => a.startDate.localeCompare(b.startDate));

    // 3. Compute distance (gap in days) to next event
    return sorted.map((evt, idx) => {
      let gapDays: number | null = null;
      if (idx < sorted.length - 1) {
        const nextEvt = sorted[idx + 1];
        const [eY, eM, eD] = evt.endDate.split('-').map(Number);
        const [nY, nM, nD] = nextEvt.startDate.split('-').map(Number);
        const currentEndMs = new Date(eY, eM - 1, eD).getTime();
        const nextStartMs = new Date(nY, nM - 1, nD).getTime();
        const diffMs = nextStartMs - currentEndMs;
        gapDays = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
      }
      return {
        event: evt,
        gapDays,
      };
    });
  }, [events, classFilter, timelineCategory]);

  // Find max value for bar scaling
  const maxBarValue = useMemo(() => {
    if (monthlyData.length === 0) return 1;
    return Math.max(
      ...monthlyData.map((m) => {
        if (metricMode === 'agendas') return m.agendaCount;
        if (metricMode === 'kbm') return m.effectiveKbmDays;
        return m.totalDurationHours;
      }),
      1
    );
  }, [monthlyData, metricMode]);

  // Donut chart math: radius = 70, stroke = 24
  const donutCenter = 100;
  const donutRadius = 60;
  const donutCircumference = 2 * Math.PI * donutRadius;

  // Compute cumulative donut offsets
  const donutSegments = useMemo(() => {
    const totalCount = categoryDistribution.reduce((acc, curr) => acc + curr.count, 0);
    if (totalCount === 0) return [];

    let currentOffset = 0;
    return categoryDistribution
      .filter((cat) => cat.count > 0)
      .map((cat) => {
        const fraction = cat.count / totalCount;
        const strokeDasharray = `${fraction * donutCircumference} ${donutCircumference}`;
        const strokeDashoffset = -currentOffset;
        currentOffset += fraction * donutCircumference;
        return {
          ...cat,
          fraction,
          strokeDasharray,
          strokeDashoffset,
        };
      });
  }, [categoryDistribution, donutCircumference]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Header Banner & Quick Controls */}
      <div className="bg-gradient-to-r from-[#143c14] via-[#1b4d1b] to-emerald-900 dark:from-slate-900 dark:to-slate-800 text-white rounded-2xl p-5 sm:p-7 shadow-lg border border-emerald-600/30 relative overflow-hidden">
        {/* Decorative Background Accents */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#ffcc00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -top-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#ffcc00] text-[#143c14] text-xs font-black uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5" /> Analytics Dashboard
              </span>
              <span className="text-xs text-emerald-200 font-semibold">
                Tahun Ajaran {academicYear}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Statistik Visual & Timeline Kegiatan
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium max-w-2xl mt-1 leading-relaxed">
              Pantau alur kronologis agenda semester, grafik beban kerja per bulan, serta jarak interval hari antar ujian dan evaluasi penting.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2.5 bg-white/10 dark:bg-slate-800/80 p-2 rounded-xl backdrop-blur-md border border-white/20 shrink-0">
            {onChangeSemester && (
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-emerald-200 font-medium px-1">Semester:</span>
                <select
                  value={semester}
                  onChange={(e) => onChangeSemester(e.target.value as SemesterFilter)}
                  className="bg-emerald-950/80 dark:bg-slate-900 text-white text-xs font-bold rounded-lg px-2.5 py-1 border border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                >
                  <option value="all">Semua Smt</option>
                  <option value="ganjil">Ganjil (Jul - Des)</option>
                  <option value="genap">Genap (Jan - Jun)</option>
                </select>
              </div>
            )}

            {onChangeClassFilter && (
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-emerald-200 font-medium px-1">Tingkat:</span>
                <select
                  value={classFilter}
                  onChange={(e) => onChangeClassFilter(e.target.value as ClassFilter)}
                  className="bg-emerald-950/80 dark:bg-slate-900 text-white text-xs font-bold rounded-lg px-2.5 py-1 border border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                >
                  <option value="all">Semua Kelas</option>
                  <option value="X">Kelas X</option>
                  <option value="XI">Kelas XI</option>
                  <option value="XII">Kelas XII</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Top Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Total Agenda */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs relative overflow-hidden transition-all hover:border-emerald-500/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Agenda</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {semesterTotals.totalAgendas}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {semesterTotals.totalAssessments} Ujian/Evaluasi
            </span>
          </div>
        </div>

        {/* Card 2: Hari Efektif KBM */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs relative overflow-hidden transition-all hover:border-amber-500/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Hari Efektif KBM</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {semesterTotals.totalKbmDays}
            <span className="text-xs font-normal text-slate-400 ml-1">Hari</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
            <span>Senin – Jumat (Tanpa Libur)</span>
          </div>
        </div>

        {/* Card 3: Total Durasi Kegiatan */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs relative overflow-hidden transition-all hover:border-emerald-500/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Durasi Kegiatan</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {semesterTotals.totalDurationHours}
            <span className="text-xs font-normal text-slate-400 ml-1">Jam</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>Estimasi Beban Pembelajaran</span>
          </div>
        </div>

        {/* Card 4: Peak Workload Indicator */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs relative overflow-hidden transition-all hover:border-red-500/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Puncak Beban Kerja</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 truncate">
            {peakWorkloadMonth ? peakWorkloadMonth.monthName : '-'}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-red-600 dark:text-red-400 font-semibold truncate">
            {peakWorkloadMonth ? (
              <span>{peakWorkloadMonth.agendaCount} Agenda ({peakWorkloadMonth.assessmentCount} Ujian)</span>
            ) : (
              <span>Tidak Ada Data</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. NEW FEATURE: Horizontal Event Timeline */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Milestone className="w-5 h-5 text-[#143c14] dark:text-emerald-400" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Event Timeline · Alur Kronologis & Jarak Antar Ujian
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Geser horizontal untuk melihat rentang waktu dan interval jarak hari antar kegiatan penting semester
            </p>
          </div>

          {/* Timeline Category Filters */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto overflow-x-auto max-w-full">
            {[
              { id: 'all', label: 'Semua Agenda' },
              { id: 'assessment', label: '🎯 Ujian & Evaluasi' },
              { id: 'academic', label: '📚 KBM' },
              { id: 'school', label: '🏫 Sekolah & Siswa' },
              { id: 'holiday', label: '🏖️ Libur' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setTimelineCategory(cat.id)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  timelineCategory === cat.id
                    ? 'bg-[#143c14] text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Horizontal Timeline Canvas */}
        <div className="relative pt-6 pb-4">
          <div className="flex items-start overflow-x-auto pb-4 gap-0 no-scrollbar scroll-smooth px-2">
            {timelineItems.length > 0 ? (
              timelineItems.map(({ event: evt, gapDays }, idx) => {
                const categoryConfig = CATEGORIES_CONFIG[evt.category];
                const isAssessment = evt.category === 'assessment';

                return (
                  <React.Fragment key={evt.id}>
                    {/* Node Card Container */}
                    <div className="flex flex-col items-center shrink-0 w-64 sm:w-72 relative group">
                      
                      {/* Top Node Anchor & Pulse Dot */}
                      <div className="relative mb-3 flex items-center justify-center">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shadow-xs transition-transform group-hover:scale-125 ${
                            isAssessment
                              ? 'bg-red-500 border-white ring-4 ring-red-100 dark:ring-red-950'
                              : 'bg-[#143c14] dark:bg-emerald-500 border-white ring-2 ring-slate-100 dark:ring-slate-800'
                          }`}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      </div>

                      {/* Event Card Content */}
                      <div
                        onClick={() => onSelectEvent(evt)}
                        className={`w-full bg-slate-50 dark:bg-slate-800/80 border p-4 rounded-2xl shadow-xs transition-all cursor-pointer hover:shadow-md hover:-translate-y-1 ${
                          isAssessment
                            ? 'border-red-300 dark:border-red-700/60 bg-red-50/30 dark:bg-red-950/20 hover:border-red-500'
                            : 'border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                        }`}
                      >
                        {/* Category & Class Badge Header */}
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${categoryConfig.bgBadge}`}>
                            {categoryConfig.shortLabel}
                          </span>
                          <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-xs">
                            {evt.audience}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                          {evt.title}
                        </h4>

                        {/* Date Range */}
                        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                          <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{formatDateRange(evt.startDate, evt.endDate)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Connecting Line & Gap Indicator between Consecutive Items */}
                    {idx < timelineItems.length - 1 && (
                      <div className="flex flex-col items-center justify-center shrink-0 w-24 sm:w-32 relative pt-2">
                        {/* Connecting Track Line */}
                        <div className="w-full h-0.5 bg-slate-200 dark:bg-slate-700 relative top-0.5" />

                        {/* Gap Days Badge */}
                        <div className="mt-2 z-10">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black tracking-tight border shadow-2xs whitespace-nowrap ${
                              gapDays !== null && gapDays <= 3
                                ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-200 dark:border-red-800'
                                : gapDays !== null && gapDays <= 7
                                ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800'
                                : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                            }`}
                            title={`Jarak waktu dari tanggal selesai agenda ini ke agenda berikutnya adalah ${gapDays} hari`}
                          >
                            <ArrowRight className="w-2.5 h-2.5" />
                            {gapDays === 0 ? 'Hari Bersamaan' : `${gapDays} Hari Selisih`}
                          </span>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <div className="w-full text-center py-10 text-xs text-slate-500 dark:text-slate-400">
                Tidak ada agenda yang cocok dengan filter timeline saat ini.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              Gunakan scroll horizontal (geser layar) untuk melihat seluruh timeline semester
            </span>
            <span className="font-semibold text-slate-500 dark:text-slate-400">
              {timelineItems.length} Agenda Terurut
            </span>
          </div>
        </div>
      </div>

      {/* 4. Multi-Chart Row: Bar Chart & Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Monthly Workload Bar Chart (Spans 2 Columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#143c14] dark:text-emerald-400" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Grafik Batang Beban Kerja Per Bulan
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Perbandingan distribusi kegiatan akademik dan ketersediaan hari KBM
              </p>
            </div>

            {/* Metric Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
              <button
                onClick={() => setMetricMode('agendas')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  metricMode === 'agendas'
                    ? 'bg-[#143c14] text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Jumlah Agenda
              </button>
              <button
                onClick={() => setMetricMode('kbm')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  metricMode === 'kbm'
                    ? 'bg-[#143c14] text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Hari KBM
              </button>
              <button
                onClick={() => setMetricMode('hours')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  metricMode === 'hours'
                    ? 'bg-[#143c14] text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Jam Kegiatan
              </button>
            </div>
          </div>

          {/* Bar Chart SVG Canvas */}
          <div className="pt-4 relative min-h-[260px] flex flex-col justify-end">
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 sm:gap-3 items-end h-52 px-2 pb-6 border-b border-slate-200 dark:border-slate-700">
              {monthlyData.map((m) => {
                const value =
                  metricMode === 'agendas'
                    ? m.agendaCount
                    : metricMode === 'kbm'
                    ? m.effectiveKbmDays
                    : m.totalDurationHours;

                const heightPercent = Math.max(8, Math.round((value / maxBarValue) * 100));
                const isHovered = hoveredMonth?.monthKey === m.monthKey;
                const isPeak = peakWorkloadMonth?.monthKey === m.monthKey;

                return (
                  <div
                    key={m.monthKey}
                    onMouseEnter={() => setHoveredMonth(m)}
                    onMouseLeave={() => setHoveredMonth(null)}
                    className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                  >
                    {/* Tooltip on Hover */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 5, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          className="absolute -top-24 left-1/2 -translate-x-1/2 z-30 bg-slate-900 text-white text-[11px] p-2.5 rounded-xl shadow-xl w-36 border border-slate-700 pointer-events-none"
                        >
                          <div className="font-bold border-b border-slate-700 pb-1 mb-1 text-emerald-400 flex items-center justify-between">
                            <span>{m.monthName} {m.year}</span>
                            {isPeak && <span className="text-[9px] bg-red-500 text-white px-1 rounded font-black">PUNCAK</span>}
                          </div>
                          <div className="space-y-0.5 text-slate-300">
                            <div className="flex justify-between">
                              <span>Agenda:</span>
                              <span className="font-bold text-white">{m.agendaCount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Hari KBM:</span>
                              <span className="font-bold text-amber-300">{m.effectiveKbmDays} hr</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Durasi:</span>
                              <span className="font-bold text-emerald-300">{m.totalDurationHours} jam</span>
                            </div>
                            <div className="flex justify-between text-red-300">
                              <span>Ujian:</span>
                              <span className="font-bold">{m.assessmentCount}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Bar Label above */}
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1 opacity-80 group-hover:opacity-100">
                      {value}
                    </span>

                    {/* Bar Container */}
                    <div className="w-full max-w-[28px] sm:max-w-[36px] bg-slate-100 dark:bg-slate-800 rounded-t-lg h-full flex items-end overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className={`w-full rounded-t-lg transition-all ${
                          isHovered
                            ? 'bg-[#ffcc00] shadow-md'
                            : isPeak
                            ? 'bg-gradient-to-t from-red-600 to-amber-500'
                            : 'bg-gradient-to-t from-[#143c14] to-emerald-500 dark:from-emerald-800 dark:to-emerald-400'
                        }`}
                      />
                    </div>

                    {/* Month Name Below */}
                    <span
                      className={`text-[10px] sm:text-xs font-semibold mt-2 truncate w-full text-center ${
                        isHovered
                          ? 'text-[#143c14] dark:text-emerald-400 font-bold'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {m.monthName.slice(0, 3)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend Below Chart */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#143c14] dark:bg-emerald-500 inline-block" />
                  <span>{metricMode === 'agendas' ? 'Jumlah Agenda' : metricMode === 'kbm' ? 'Hari KBM Efektif' : 'Jam Kegiatan'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-red-500 inline-block" />
                  <span>Bulan Puncak Ujian/Tugas</span>
                </div>
              </div>
              <span className="text-[11px] italic">Hover pada batang untuk detail per bulan</span>
            </div>
          </div>
        </div>

        {/* Right: Category Distribution Donut Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <PieChartIcon className="w-5 h-5 text-[#143c14] dark:text-emerald-400" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Kategori Kegiatan
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Persentase distribusi jenis agenda dalam kalender akademik
            </p>

            {/* Donut Chart Visual */}
            <div className="relative flex items-center justify-center my-6">
              <svg width="180" height="180" viewBox="0 0 200 200" className="transform -rotate-90 overflow-visible">
                {/* Background Ring */}
                <circle
                  cx={donutCenter}
                  cy={donutCenter}
                  r={donutRadius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="20"
                  className="text-slate-100 dark:text-slate-800"
                />

                {/* Donut Segments */}
                {donutSegments.map((segment) => {
                  const isHovered = hoveredCategory === segment.category;
                  return (
                    <circle
                      key={segment.category}
                      cx={donutCenter}
                      cy={donutCenter}
                      r={donutRadius}
                      fill="transparent"
                      stroke={segment.color}
                      strokeWidth={isHovered ? 26 : 20}
                      strokeDasharray={segment.strokeDasharray}
                      strokeDashoffset={segment.strokeDashoffset}
                      strokeLinecap="butt"
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredCategory(segment.category)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    />
                  );
                })}
              </svg>

              {/* Donut Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  {hoveredCategory
                    ? categoryDistribution.find((c) => c.category === hoveredCategory)?.count || 0
                    : semesterTotals.totalAgendas}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {hoveredCategory
                    ? CATEGORIES_CONFIG[hoveredCategory as keyof typeof CATEGORIES_CONFIG]?.shortLabel || 'Agenda'
                    : 'Total Agenda'}
                </span>
              </div>
            </div>
          </div>

          {/* Donut Legend List */}
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
            {categoryDistribution.map((cat) => {
              const isHovered = hoveredCategory === cat.category;
              return (
                <div
                  key={cat.category}
                  onMouseEnter={() => setHoveredCategory(cat.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`flex items-center justify-between text-xs p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isHovered ? 'bg-slate-100 dark:bg-slate-800 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-slate-700 dark:text-slate-200 truncate">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-semibold">
                    <span className="text-slate-500 dark:text-slate-400">{cat.count} agenda</span>
                    <span className="text-slate-900 dark:text-slate-100 font-black min-w-[32px] text-right">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Bottom Row: High Priority Agenda Recommendations & Workload Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Workload Preparation Guidance Card */}
        <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Rekomendasi Manajemen Beban Kerja Siswa</span>
          </div>

          <p className="text-xs text-amber-950/80 dark:text-amber-300/90 leading-relaxed font-medium">
            Berdasarkan data kalender akademik semester ini, bulan <strong className="text-amber-900 dark:text-amber-200 uppercase font-black">{peakWorkloadMonth?.monthName || 'Mendatang'}</strong> memiliki konsentrasi ujian dan evaluasi akademik paling padat.
          </p>

          <ul className="space-y-2 text-xs text-amber-900/90 dark:text-amber-300/90 font-medium">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span>Gunakan jadwal H-14 sebelum evaluasi untuk menyusun jadwal belajar mandiri berkelanjutan.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span>Manfaatkan total {semesterTotals.totalKbmDays} hari efektif KBM untuk diskusi kelompok dengan pengajar.</span>
            </li>
          </ul>
        </div>

        {/* High-Priority Ujian / Assessment List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Evaluasi & Ujian Akademik Utama
              </h4>
            </div>
            <span className="text-[11px] font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 px-2 py-0.5 rounded-md">
              {highPriorityAgendas.length} Agenda Penting
            </span>
          </div>

          <div className="space-y-2">
            {highPriorityAgendas.length > 0 ? (
              highPriorityAgendas.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-red-400 dark:hover:border-red-500 bg-slate-50/50 dark:bg-slate-800/50 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-red-600 dark:group-hover:text-red-400">
                        {evt.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{formatDateRange(evt.startDate, evt.endDate)}</span>
                      <span>·</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{evt.audience}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors shrink-0" />
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-slate-500 dark:text-slate-400">
                Tidak ada ujian atau evaluasi mendatang pada filter saat ini.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
