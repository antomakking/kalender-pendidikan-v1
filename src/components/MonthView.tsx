import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, GripVertical, MapPin, Plus, Users } from 'lucide-react';
import { AcademicEvent } from '../types.ts';
import {
  CATEGORIES_CONFIG,
  DAY_NAMES_ID,
  formatIndonesianDate,
  getCalendarDaysForMonth,
} from '../utils/calendarUtils.ts';
import { EmptyState } from './EmptyState.tsx';
import { HighlightText } from './HighlightText.tsx';

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

  // Find events for selected mobile date
  const mobileSelectedDayInfo = days.find((d) => d.dateStr === selectedMobileDate) || {
    dateStr: selectedMobileDate,
    events: [],
  };

  return (
    <div className="p-2 sm:p-5">
      {/* Visual Color Block Legend - Inspired by Poster's 'Keterangan' */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200 text-xs">
        <div className="flex items-center gap-1.5 text-slate-800 font-bold text-[11px] sm:text-xs">
          <span className="bg-[#143c14] text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-extrabold">Keterangan:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-semibold">
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-md">
            <span className="w-2.5 h-2.5 rounded bg-[#ffcc00] shadow-xs"></span>
            <span className="text-amber-950 font-bold">KBM & Pembelajaran</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-md">
            <span className="w-2.5 h-2.5 rounded bg-[#15803d] shadow-xs"></span>
            <span className="text-emerald-950 font-bold">Penilaian & Rapor</span>
          </div>
          <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-300 px-2 py-0.5 rounded-md">
            <span className="w-2.5 h-2.5 rounded bg-[#0284c7] shadow-xs"></span>
            <span className="text-sky-950 font-bold">Kesiswaan & PKL</span>
          </div>
          <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-300 px-2 py-0.5 rounded-md">
            <span className="w-2.5 h-2.5 rounded bg-[#dc2626] shadow-xs"></span>
            <span className="text-rose-950 font-bold">Libur Nasional & Cuti</span>
          </div>
          <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
            <span className="w-2.5 h-2.5 rounded bg-[#dc2626] shadow-xs"></span>
            <span className="text-red-700 font-bold">Ahad (Akhir Pekan)</span>
          </div>
        </div>
      </div>

      {/* 7 Day Header: Individual Green Pills for Mon-Sat, Red Pill for Ahad (Poster Design) */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center font-extrabold text-[10px] sm:text-xs mb-2">
        {DAY_NAMES_ID.map((dayName, idx) => {
          const isAhad = idx === 6;
          return (
            <div
              key={dayName}
              className={`py-1.5 rounded-lg tracking-wider uppercase shadow-2xs font-extrabold ${
                isAhad
                  ? 'bg-[#dc2626] text-white ring-1 ring-rose-700'
                  : 'bg-[#143c14] text-white ring-1 ring-emerald-900'
              }`}
            >
              {/* Full day name on desktop, 3 letters on mobile */}
              <span className="hidden sm:inline">{dayName.toUpperCase()}</span>
              <span className="sm:hidden">{dayName.slice(0, 3).toUpperCase()}</span>
            </div>
          );
        })}
      </div>

      {/* Grid of Days */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 auto-rows-fr">
        {days.map((dayInfo) => {
          const { dateStr, dayNumber, isCurrentMonth, isToday, isSunday, events: dayEvents } = dayInfo;
          const isDragOver = dragOverDate === dateStr;
          const isMobileSelected = selectedMobileDate === dateStr;
          const primaryEvent = dayEvents[0];
          const primaryCat = primaryEvent ? (CATEGORIES_CONFIG[primaryEvent.category] || CATEGORIES_CONFIG.academic) : null;

          return (
            <div
              key={dateStr}
              onDragOver={(e) => handleDragOver(e, dateStr)}
              onDragLeave={(e) => handleDragLeave(e, dateStr)}
              onDrop={(e) => handleDrop(e, dateStr)}
              onClick={() => {
                setSelectedMobileDate(dateStr);
                // On desktop, clicking empty opens add modal, clicking event opens detail
                if (window.innerWidth >= 640) {
                  if (dayEvents.length > 0) {
                    onSelectEvent(dayEvents[0]);
                  } else {
                    onSelectDate(dateStr);
                  }
                }
              }}
              className={`min-h-[64px] sm:min-h-[118px] p-1 sm:p-2 border rounded-xl transition-all flex flex-col justify-between cursor-pointer group relative overflow-hidden ${
                isDragOver
                  ? 'border-2 border-dashed border-emerald-600 bg-emerald-50/90 shadow-md scale-[1.01] ring-2 ring-emerald-500/30 z-10'
                  : isCurrentMonth
                  ? isMobileSelected
                    ? 'bg-emerald-50/40 border-emerald-500 ring-2 ring-emerald-500/30 sm:ring-0 sm:border-slate-200/90'
                    : primaryCat
                    ? `${primaryCat.cellTint} hover:border-slate-400 hover:shadow-xs`
                    : 'bg-white border-slate-200/90 hover:border-slate-400 hover:shadow-xs'
                  : 'bg-slate-50/60 border-slate-100 text-slate-400'
              } ${
                isToday && !isDragOver
                  ? 'ring-2 ring-emerald-600 border-emerald-500 bg-emerald-50/20'
                  : ''
              }`}
            >
              {/* Optional Top Accent Bar for days with events */}
              {isCurrentMonth && primaryCat && (
                <div className={`h-1 w-full absolute top-0 inset-x-0 ${primaryCat.topBar}`} />
              )}

              {/* Day Header */}
              <div className="flex items-center justify-between pointer-events-none w-full">
                <span
                  className={`text-xs font-semibold tabular-nums leading-none ${
                    isToday
                      ? 'w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs mx-auto sm:mx-0'
                      : isSunday
                      ? 'text-rose-600 font-bold mx-auto sm:mx-0'
                      : isCurrentMonth
                      ? 'text-slate-800 mx-auto sm:mx-0'
                      : 'text-slate-400 mx-auto sm:mx-0'
                  }`}
                >
                  {dayNumber}
                </span>

                {/* 'Hari Ini' badge shown ONLY on desktop */}
                {isToday && (
                  <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                    Hari Ini
                  </span>
                )}
              </div>

              {/* Drag Over Hint */}
              {isDragOver && (
                <div className="absolute inset-x-1 top-6 pointer-events-none text-center">
                  <span className="inline-block text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 bg-emerald-700 text-white rounded-md shadow-xs animate-pulse">
                    Lepaskan
                  </span>
                </div>
              )}

              {/* MOBILE ONLY: Solid Colored Mini-Blocks (All Agendas Displayed) */}
              <div className="flex sm:hidden flex-col gap-1 mt-1 w-full">
                {dayEvents.map((event) => {
                  const cat = CATEGORIES_CONFIG[event.category] || CATEGORIES_CONFIG.academic;
                  const isMatch = Boolean(
                    searchQuery?.trim() &&
                    (event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     event.description.toLowerCase().includes(searchQuery.toLowerCase()))
                  );

                  return (
                    <div
                      key={event.id}
                      className={`w-full text-[8.5px] font-semibold text-white px-1 py-0.5 rounded truncate leading-tight shadow-xs ${cat.bgSolid} ${
                        isMatch ? 'ring-2 ring-amber-400 brightness-110' : ''
                      }`}
                      title={event.title}
                    >
                      <HighlightText text={event.title} query={searchQuery} />
                    </div>
                  );
                })}
              </div>

              {/* DESKTOP ONLY: Full Solid Color Blocks for ALL Agendas */}
              <div className="hidden sm:flex space-y-1 mt-1.5 flex-1 flex-col justify-start">
                {dayEvents.map((event) => {
                  const cat = CATEGORIES_CONFIG[event.category] || CATEGORIES_CONFIG.academic;
                  const isBeingDragged = draggingEventId === event.id;
                  const isMultiDay = event.startDate !== event.endDate;
                  const isStart = event.startDate === dateStr;
                  const isEnd = event.endDate === dateStr;
                  const isSearchMatch = Boolean(
                    searchQuery?.trim() &&
                    (event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     event.audience.toLowerCase().includes(searchQuery.toLowerCase()))
                  );

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
                      title={`${event.title} (${event.audience}) — Tarik & lepas untuk menjadwalkan ulang`}
                      className={`w-full text-left text-[11px] leading-tight px-2 py-1 font-semibold truncate transition-all flex items-center gap-1.5 shadow-xs cursor-pointer select-none group/pill ${
                        cat.bgSolid
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
                      <GripVertical className="w-2.5 h-2.5 opacity-60 group-hover/pill:opacity-100 shrink-0 text-white -ml-0.5" />
                      <HighlightText
                        text={event.title}
                        query={searchQuery}
                        className="font-semibold block truncate flex-1 text-white"
                      />
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
                  className="hidden sm:block opacity-0 group-hover:opacity-100 text-[10px] text-slate-400 hover:text-emerald-700 transition-opacity text-right pt-1"
                >
                  + Tambah
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MOBILE ONLY: Interactive Selected Date Agenda Card */}
      <div className="block sm:hidden mt-4 pt-3.5 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2 px-1">
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              Agenda: {formatIndonesianDate(selectedMobileDate, { withDayName: true })}
            </h4>
            <p className="text-[11px] text-slate-500">
              {mobileSelectedDayInfo.events.length === 0
                ? 'Tidak ada agenda khusus (KBM reguler)'
                : `${mobileSelectedDayInfo.events.length} kegiatan terjadwal`}
            </p>
          </div>
          <button
            onClick={() => onSelectDate(selectedMobileDate)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
        </div>

        {mobileSelectedDayInfo.events.length > 0 ? (
          <div className="space-y-2 mt-2">
            {mobileSelectedDayInfo.events.map((evt) => {
              const cat = CATEGORIES_CONFIG[evt.category] || CATEGORIES_CONFIG.academic;
              return (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className={`p-3 rounded-xl border ${cat.borderColor} bg-white shadow-2xs text-left cursor-pointer active:scale-99 transition-all space-y-1.5`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${cat.bgBadge}`}>
                      {cat.label}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {evt.startTime && evt.endTime
                        ? `${evt.startTime} – ${evt.endTime} WITA`
                        : 'Sepanjang Hari'}
                    </span>
                  </div>

                  <h5 className="font-bold text-xs text-slate-900 leading-snug">
                    <HighlightText text={evt.title} query={searchQuery} />
                  </h5>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    <HighlightText text={evt.description} query={searchQuery} />
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                    <span className="truncate max-w-[160px]">📍 {evt.location}</span>
                    <span className="truncate max-w-[120px]">👥 {evt.audience}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-1">
            <EmptyState
              type="calendar"
              compact={true}
              title="KBM Reguler Sesuai Jadwal"
              description="Tidak ada agenda khusus atau asesmen pada tanggal ini. Santri mengikuti jadwal pembelajaran reguler."
              onAddEvent={() => onSelectDate(selectedMobileDate)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
