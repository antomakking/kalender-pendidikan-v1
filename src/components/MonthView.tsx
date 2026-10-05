import React, { useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Filter,
  GripVertical,
  List,
  MapPin,
  Plus,
  Sparkles,
  Users,
} from 'lucide-react';
import { AcademicEvent } from '../types.ts';
import {
  CATEGORIES_CONFIG,
  DAY_NAMES_ID,
  formatIndonesianDate,
  getCalendarDaysForMonth,
} from '../utils/calendarUtils.ts';
import { EmptyState } from './EmptyState.tsx';
import { HighlightText } from './HighlightText.tsx';

export interface EventDisplayStyle {
  bgSolid: string;
  textColor: string;
  ringColor: string;
  badgeBg: string;
  borderColor: string;
  accentBar: string;
  dotColor: string;
}

export const DISTINCT_EVENT_PALETTES: EventDisplayStyle[] = [
  {
    bgSolid: 'bg-[#ffcc00] text-slate-950 font-bold hover:bg-[#e6b800]',
    textColor: 'text-slate-950',
    ringColor: 'ring-amber-400',
    badgeBg: 'bg-amber-100 text-amber-950 border-amber-300',
    borderColor: 'border-amber-300',
    accentBar: 'bg-[#ffcc00]',
    dotColor: 'bg-[#ffcc00]',
  },
  {
    bgSolid: 'bg-[#0284c7] text-white font-bold hover:bg-[#0369a1]',
    textColor: 'text-white',
    ringColor: 'ring-sky-400',
    badgeBg: 'bg-sky-100 text-sky-900 border-sky-300',
    borderColor: 'border-sky-300',
    accentBar: 'bg-[#0284c7]',
    dotColor: 'bg-[#0284c7]',
  },
  {
    bgSolid: 'bg-[#15803d] text-white font-bold hover:bg-[#166534]',
    textColor: 'text-white',
    ringColor: 'ring-emerald-400',
    badgeBg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    borderColor: 'border-emerald-300',
    accentBar: 'bg-[#15803d]',
    dotColor: 'bg-[#15803d]',
  },
  {
    bgSolid: 'bg-[#7c3aed] text-white font-bold hover:bg-[#6d28d9]',
    textColor: 'text-white',
    ringColor: 'ring-purple-400',
    badgeBg: 'bg-purple-100 text-purple-950 border-purple-300',
    borderColor: 'border-purple-300',
    accentBar: 'bg-[#7c3aed]',
    dotColor: 'bg-[#7c3aed]',
  },
  {
    bgSolid: 'bg-[#ea580c] text-white font-bold hover:bg-[#c2410c]',
    textColor: 'text-white',
    ringColor: 'ring-orange-400',
    badgeBg: 'bg-orange-100 text-orange-950 border-orange-300',
    borderColor: 'border-orange-300',
    accentBar: 'bg-[#ea580c]',
    dotColor: 'bg-[#ea580c]',
  },
  {
    bgSolid: 'bg-[#0d9488] text-white font-bold hover:bg-[#0f766e]',
    textColor: 'text-white',
    ringColor: 'ring-teal-400',
    badgeBg: 'bg-teal-100 text-teal-950 border-teal-300',
    borderColor: 'border-teal-300',
    accentBar: 'bg-[#0d9488]',
    dotColor: 'bg-[#0d9488]',
  },
  {
    bgSolid: 'bg-[#db2777] text-white font-bold hover:bg-[#be185d]',
    textColor: 'text-white',
    ringColor: 'ring-pink-400',
    badgeBg: 'bg-pink-100 text-pink-950 border-pink-300',
    borderColor: 'border-pink-300',
    accentBar: 'bg-[#db2777]',
    dotColor: 'bg-[#db2777]',
  },
  {
    bgSolid: 'bg-[#4f46e5] text-white font-bold hover:bg-[#4338ca]',
    textColor: 'text-white',
    ringColor: 'ring-indigo-400',
    badgeBg: 'bg-indigo-100 text-indigo-950 border-indigo-300',
    borderColor: 'border-indigo-300',
    accentBar: 'bg-[#4f46e5]',
    dotColor: 'bg-[#4f46e5]',
  },
  {
    bgSolid: 'bg-[#b45309] text-white font-bold hover:bg-[#92400e]',
    textColor: 'text-white',
    ringColor: 'ring-amber-600',
    badgeBg: 'bg-amber-100 text-amber-950 border-amber-400',
    borderColor: 'border-amber-400',
    accentBar: 'bg-[#b45309]',
    dotColor: 'bg-[#b45309]',
  },
  {
    bgSolid: 'bg-[#0891b2] text-white font-bold hover:bg-[#0e7490]',
    textColor: 'text-white',
    ringColor: 'ring-cyan-400',
    badgeBg: 'bg-cyan-100 text-cyan-950 border-cyan-300',
    borderColor: 'border-cyan-300',
    accentBar: 'bg-[#0891b2]',
    dotColor: 'bg-[#0891b2]',
  },
  {
    bgSolid: 'bg-[#475569] text-white font-bold hover:bg-[#334155]',
    textColor: 'text-white',
    ringColor: 'ring-slate-400',
    badgeBg: 'bg-slate-200 text-slate-900 border-slate-300',
    borderColor: 'border-slate-300',
    accentBar: 'bg-[#475569]',
    dotColor: 'bg-[#475569]',
  },
  {
    bgSolid: 'bg-[#65a30d] text-white font-bold hover:bg-[#4d7c0f]',
    textColor: 'text-white',
    ringColor: 'ring-lime-400',
    badgeBg: 'bg-lime-100 text-lime-950 border-lime-300',
    borderColor: 'border-lime-300',
    accentBar: 'bg-[#65a30d]',
    dotColor: 'bg-[#65a30d]',
  },
];

export const HOLIDAY_EVENT_STYLE: EventDisplayStyle = {
  bgSolid: 'bg-[#dc2626] text-white font-bold hover:bg-[#b91c1c]',
  textColor: 'text-white',
  ringColor: 'ring-rose-400',
  badgeBg: 'bg-rose-100 text-rose-950 border-rose-300',
  borderColor: 'border-rose-300',
  accentBar: 'bg-[#dc2626]',
  dotColor: 'bg-[#dc2626]',
};

export const getDynamicEventStyle = (
  event: AcademicEvent,
  monthEvents: AcademicEvent[]
): EventDisplayStyle => {
  if (event.category === 'holiday') {
    return HOLIDAY_EVENT_STYLE;
  }
  const nonHolidayEvents = monthEvents.filter((e) => e.category !== 'holiday');
  const index = nonHolidayEvents.findIndex((e) => e.id === event.id);
  if (index === -1) {
    return DISTINCT_EVENT_PALETTES[0];
  }
  return DISTINCT_EVENT_PALETTES[index % DISTINCT_EVENT_PALETTES.length];
};

interface MonthViewProps {
  currentYear: number;
  currentMonth: number; // 0-indexed
  events: AcademicEvent[];
  todayStr: string;
  searchQuery?: string;
  onSelectEvent: (event: AcademicEvent) => void;
  onSelectDate: (dateStr: string) => void;
  onRescheduleEvent: (eventId: string, newStartDate: string) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentYear,
  currentMonth,
  events,
  todayStr,
  searchQuery,
  onSelectEvent,
  onSelectDate,
  onRescheduleEvent,
}) => {
  const days = getCalendarDaysForMonth(currentYear, currentMonth, events, todayStr);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);
  const [draggingEventId, setDraggingEventId] = useState<string | null>(null);
  const [selectedMobileDate, setSelectedMobileDate] = useState<string>(todayStr);
  const [mobileOnlyWithEvents, setMobileOnlyWithEvents] = useState<boolean>(false);

  // Extract all distinct events present in this month view
  const monthEvents = useMemo(() => {
    const eventMap = new Map<string, AcademicEvent>();
    days.forEach((d) => {
      if (d.isCurrentMonth) {
        d.events.forEach((evt) => {
          eventMap.set(evt.id, evt);
        });
      }
    });
    return Array.from(eventMap.values()).sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [days]);

  // Current month days for mobile vertical stack
  const currentMonthDays = useMemo(() => {
    return days.filter((d) => d.isCurrentMonth);
  }, [days]);

  const displayedMobileDays = useMemo(() => {
    if (mobileOnlyWithEvents) {
      return currentMonthDays.filter((d) => d.events.length > 0 || d.dateStr === todayStr);
    }
    return currentMonthDays;
  }, [currentMonthDays, mobileOnlyWithEvents, todayStr]);

  const handleDragStart = (e: React.DragEvent, event: AcademicEvent) => {
    e.dataTransfer.setData('text/plain', event.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingEventId(event.id);
  };

  const handleDragEnd = () => {
    setDraggingEventId(null);
    setDragOverDate(null);
  };

  const handleDragOver = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverDate !== dateStr) {
      setDragOverDate(dateStr);
    }
  };

  const handleDragLeave = (e: React.DragEvent, dateStr: string) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      if (dragOverDate === dateStr) {
        setDragOverDate(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData('text/plain') || draggingEventId;
    setDragOverDate(null);
    setDraggingEventId(null);

    if (eventId) {
      onRescheduleEvent(eventId, dateStr);
    }
  };

  return (
    <div className="p-2 sm:p-5 w-full max-w-full overflow-x-hidden min-w-0">
      
      {/* =========================================================================
          1. DESKTOP VIEW (>= 640px): Full 7-Column Calendar Poster Grid
          ========================================================================= */}
      <div className="hidden sm:block">
        {/* 7 Day Header: Individual Green Pills for Mon-Sat, Red Pill for Ahad */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center font-extrabold text-xs mb-2 w-full min-w-0">
          {DAY_NAMES_ID.map((dayName, idx) => {
            const isAhad = idx === 0;
            return (
              <div
                key={dayName}
                className={`py-1.5 rounded-lg tracking-wider uppercase shadow-2xs font-extrabold min-w-0 truncate ${
                  isAhad
                    ? 'bg-[#dc2626] text-white ring-1 ring-rose-700'
                    : 'bg-[#143c14] text-white ring-1 ring-emerald-900'
                }`}
              >
                <span>{dayName.toUpperCase()}</span>
              </div>
            );
          })}
        </div>

        {/* Grid of Days (#monthGrid) */}
        <div id="monthGrid" className="grid grid-cols-7 gap-1 sm:gap-2 auto-rows-fr w-full min-w-0">
          {days.map((dayInfo) => {
            const { dateStr, dayNumber, isCurrentMonth, isToday, isSunday, events: dayEvents } = dayInfo;
            const isDragOver = dragOverDate === dateStr;
            const primaryEvent = dayEvents[0];
            const primaryStyle = primaryEvent ? getDynamicEventStyle(primaryEvent, monthEvents) : null;

            return (
              <div
                key={dateStr}
                onDragOver={(e) => handleDragOver(e, dateStr)}
                onDragLeave={(e) => handleDragLeave(e, dateStr)}
                onDrop={(e) => handleDrop(e, dateStr)}
                onClick={() => {
                  if (dayEvents.length > 0) {
                    onSelectEvent(dayEvents[0]);
                  } else {
                    onSelectDate(dateStr);
                  }
                }}
                className={`grow min-w-0 min-h-[118px] p-2 border rounded-xl transition-all flex flex-col justify-between cursor-pointer group relative overflow-visible hover:z-30 w-full ${
                  isDragOver
                    ? 'border-2 border-dashed border-emerald-600 bg-emerald-50/90 shadow-md scale-[1.01] ring-2 ring-emerald-500/30 z-10'
                    : isCurrentMonth
                    ? primaryStyle
                      ? 'bg-white border-slate-200/90 hover:border-slate-400 hover:shadow-xs'
                      : 'bg-white border-slate-200/90 hover:border-slate-400 hover:shadow-xs'
                    : 'bg-slate-50/60 border-slate-100 text-slate-400'
                } ${
                  isToday && !isDragOver
                    ? 'ring-2 ring-emerald-600 border-emerald-500 bg-emerald-50/20'
                    : ''
                }`}
              >
                {/* Top Accent Bar for days with events */}
                {isCurrentMonth && primaryStyle && (
                  <div className={`h-1 w-full absolute top-0 inset-x-0 ${primaryStyle.accentBar}`} />
                )}

                {/* Day Header */}
                <div className="flex items-center justify-between pointer-events-none w-full min-w-0">
                  <span
                    className={`text-xs font-semibold tabular-nums leading-none ${
                      isToday
                        ? 'w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs'
                        : isSunday
                        ? 'text-rose-600 font-bold'
                        : isCurrentMonth
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {dayNumber}
                  </span>

                  {isToday && (
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                      Hari Ini
                    </span>
                  )}
                </div>

                {/* Drag Over Hint */}
                {isDragOver && (
                  <div className="absolute inset-x-1 top-6 pointer-events-none text-center">
                    <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 bg-emerald-700 text-white rounded-md shadow-xs animate-pulse">
                      Lepaskan
                    </span>
                  </div>
                )}

                {/* DESKTOP ONLY: Full Solid Color Blocks with Dynamic Distinct High-Contrast Colors */}
                <div className="flex space-y-1 mt-1.5 flex-1 flex-col justify-start min-w-0 max-w-full w-full">
                  {dayEvents.map((event) => {
                    const style = getDynamicEventStyle(event, monthEvents);
                    const cat = CATEGORIES_CONFIG[event.category] || CATEGORIES_CONFIG.academic;
                    const isBeingDragged = draggingEventId === event.id;
                    const isMultiDay = event.startDate !== event.endDate;
                    const isStart = event.startDate === dateStr;
                    const isEnd = event.endDate === dateStr;
                    const isSearchMatch = Boolean(
                      searchQuery?.trim() &&
                      (event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       event.description.toLowerCase().includes(searchQuery.toLowerCase()))
                    );
                    const timeRangeStr = event.startTime && event.endTime
                      ? `${event.startTime} – ${event.endTime} WITA`
                      : 'Sepanjang Hari (All Day)';

                    return (
                      <div
                        key={event.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, event)}
                        onDragEnd={handleDragEnd}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvent(event);
                        }}
                        title={`${event.title}\nKategori: ${cat.label}\nWaktu: ${timeRangeStr}\nPeserta: ${event.audience}\nLokasi: ${event.location}`}
                        className={`w-full min-w-0 max-w-full text-left text-[11px] leading-tight px-2 py-1 font-semibold truncate whitespace-nowrap text-ellipsis transition-all flex items-center gap-1.5 shadow-xs cursor-pointer select-none group/pill relative ${
                          style.bgSolid
                        } ${
                          isMultiDay
                            ? isStart
                              ? 'rounded-l-md rounded-r-xs'
                              : isEnd
                              ? 'rounded-r-md rounded-l-xs'
                              : 'rounded-none'
                            : 'rounded-md'
                        } ${
                          isSearchMatch
                            ? 'ring-2 ring-amber-400 brightness-110 shadow-md scale-[1.01]'
                            : ''
                        } ${isBeingDragged ? 'opacity-40 scale-95 ring-2 ring-white' : 'hover:brightness-110 hover:shadow'}`}
                      >
                        <GripVertical className="w-2.5 h-2.5 opacity-60 group-hover/pill:opacity-100 shrink-0 -ml-0.5" />
                        <HighlightText
                          text={event.title}
                          query={searchQuery}
                          className="font-semibold block truncate whitespace-nowrap text-ellipsis overflow-hidden min-w-0 max-w-full flex-1"
                        />

                        {/* Descriptive Small Tooltip on Hover */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden md:group-hover/pill:flex flex-col gap-1 w-56 p-2 bg-slate-900/95 text-white text-[11px] rounded-lg shadow-xl backdrop-blur-xs pointer-events-none z-50 opacity-0 group-hover/pill:opacity-100 transition-all duration-150 border border-slate-700/90 whitespace-normal text-left font-normal cursor-default transform group-hover/pill:-translate-y-0.5">
                          <div className="flex items-center justify-between gap-1.5 pb-1 border-b border-slate-700/80">
                            <span className={`text-[9.5px] font-bold uppercase px-1.5 py-0.5 rounded shadow-2xs ${style.badgeBg}`}>
                              {cat.label}
                            </span>
                            <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1 shrink-0">
                              <Clock className="w-3 h-3 text-amber-300 shrink-0" />
                              {timeRangeStr}
                            </span>
                          </div>

                          <div className="font-bold text-white text-xs leading-snug line-clamp-2 mt-0.5">
                            {event.title}
                          </div>

                          {event.description && (
                            <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed">
                              {event.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800 text-[9.5px] text-slate-300">
                            <span className="truncate flex items-center gap-1 max-w-[110px]">
                              <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" /> {event.location}
                            </span>
                            <span className="truncate flex items-center gap-1 max-w-[85px] text-right">
                              <Users className="w-2.5 h-2.5 text-slate-400 shrink-0" /> {event.audience}
                            </span>
                          </div>

                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-slate-900/95" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick hover add button for empty or sparse days (desktop only) */}
                {isCurrentMonth && dayEvents.length === 0 && !isDragOver && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDate(dateStr);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-[10px] text-slate-400 hover:text-emerald-700 transition-opacity text-right pt-1"
                  >
                    + Tambah
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          2. MOBILE VIEW (< 640px): Clean Vertical Stack / Compressed List Mode
          Prevents horizontal scrolling and gives high-legibility touch UX
          ========================================================================= */}
      <div className="block sm:hidden w-full max-w-full space-y-3">
        {/* Mobile Filter Toggle Header */}
        <div className="flex items-center justify-between gap-2 p-2 bg-slate-100/90 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <List className="w-4 h-4 text-[#143c14]" />
            <span>Daftar Harian Bulan Ini</span>
          </div>
          <button
            onClick={() => setMobileOnlyWithEvents(!mobileOnlyWithEvents)}
            className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer border flex items-center gap-1 ${
              mobileOnlyWithEvents
                ? 'bg-[#143c14] text-white border-[#143c14]'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3 h-3" />
            <span>{mobileOnlyWithEvents ? 'Semua Tanggal' : 'Hanya Beragenda'}</span>
          </button>
        </div>

        {/* Vertical Stack of Days */}
        <div className="grid grid-cols-1 gap-2.5 w-full">
          {displayedMobileDays.map((dayInfo) => {
            const { dateStr, dayNumber, isToday, isSunday, events: dayEvents } = dayInfo;
            const dayOfWeekIdx = (new Date(dateStr).getDay() + 6) % 7;
            const dayName = DAY_NAMES_ID[dayOfWeekIdx] || '';
            const hasEvents = dayEvents.length > 0;

            return (
              <div
                key={dateStr}
                className={`p-3 rounded-2xl border transition-all w-full ${
                  isToday
                    ? 'bg-emerald-50/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                    : hasEvents
                    ? 'bg-white border-slate-200 shadow-2xs'
                    : 'bg-slate-50/80 border-slate-200/60'
                }`}
              >
                {/* Day Header Row */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shadow-2xs tabular-nums ${
                        isToday
                          ? 'bg-[#143c14] text-[#ffcc00] ring-1 ring-emerald-700'
                          : isSunday
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {dayNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold ${isSunday ? 'text-rose-600' : 'text-slate-900'}`}>
                          {dayName}
                        </span>
                        {isToday && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                            Hari Ini
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {formatIndonesianDate(dateStr)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectDate(dateStr)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#143c14] bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Input</span>
                  </button>
                </div>

                {/* Day Event Cards */}
                {hasEvents ? (
                  <div className="space-y-2 mt-2.5">
                    {dayEvents.map((evt) => {
                      const style = getDynamicEventStyle(evt, monthEvents);
                      const cat = CATEGORIES_CONFIG[evt.category] || CATEGORIES_CONFIG.academic;
                      const timeRangeStr = evt.startTime && evt.endTime
                        ? `${evt.startTime} – ${evt.endTime} WITA`
                        : 'Sepanjang Hari';

                      return (
                        <div
                          key={evt.id}
                          onClick={() => onSelectEvent(evt)}
                          className={`p-2.5 rounded-xl border ${style.borderColor} bg-white shadow-2xs text-left cursor-pointer active:scale-99 transition-all space-y-1.5`}
                        >
                          <div className="flex items-center justify-between gap-1 flex-wrap">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${style.badgeBg}`}>
                              {cat.label}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {timeRangeStr}
                            </span>
                          </div>

                          <h5 className="font-bold text-xs text-slate-900 leading-snug">
                            <HighlightText text={evt.title} query={searchQuery} />
                          </h5>

                          {evt.description && (
                            <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                              <HighlightText text={evt.description} query={searchQuery} />
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                            <span className="truncate max-w-[150px]">📍 {evt.location}</span>
                            <span className="truncate max-w-[120px]">👥 {evt.audience}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-2 text-[11px] text-slate-400 italic">
                    KBM Reguler sesuai jadwal kelas
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Event Legend (Coordinated High-Contrast Color Palette) */}
      <div className="mt-5 pt-3.5 border-t border-slate-200/80">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Panduan Warna Agenda Bulan Ini ({monthEvents.length} Kegiatan)</span>
        </div>

        {monthEvents.length === 0 ? (
          <div className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
            Belum ada agenda khusus yang dijadwalkan pada bulan ini. Silakan klik tanggal atau tombol "Tambah Agenda".
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {monthEvents.map((evt) => {
              const style = getDynamicEventStyle(evt, monthEvents);
              const cat = CATEGORIES_CONFIG[evt.category] || CATEGORIES_CONFIG.academic;
              const dateRangeLabel =
                evt.startDate === evt.endDate
                  ? formatIndonesianDate(evt.startDate)
                  : `${formatIndonesianDate(evt.startDate)} – ${formatIndonesianDate(evt.endDate)}`;

              return (
                <div
                  key={`legend-${evt.id}`}
                  onClick={() => onSelectEvent(evt)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-colors cursor-pointer group text-left min-w-0 shadow-2xs"
                  title={`Klik untuk melihat detail: ${evt.title}`}
                >
                  <div className={`w-3.5 h-3.5 rounded-md shrink-0 ${style.dotColor} shadow-2xs`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-900">
                      {evt.title}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                      <span>{dateRangeLabel}</span>
                      <span>•</span>
                      <span className="font-medium text-slate-500">{cat.label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
