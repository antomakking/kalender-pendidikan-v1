import React, { useState } from 'react';
import { Calendar, Clock, GripVertical, MapPin, Plus, Users } from 'lucide-react';
import { AcademicEvent } from '../types.ts';
import {
  CATEGORIES_CONFIG,
  DAY_NAMES_ID,
  formatIndonesianDate,
  getWeekDays,
} from '../utils/calendarUtils.ts';
import { HighlightText } from './HighlightText.tsx';

interface WeekViewProps {
  centerDateStr: string;
  events: AcademicEvent[];
  todayStr: string;
  searchQuery?: string;
  onSelectEvent: (event: AcademicEvent) => void;
  onSelectDate: (dateStr: string) => void;
  onRescheduleEvent: (eventId: string, newStartDate: string) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  centerDateStr,
  events,
  todayStr,
  searchQuery,
  onSelectEvent,
  onSelectDate,
  onRescheduleEvent,
}) => {
  const weekDays = getWeekDays(centerDateStr, events, todayStr);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);
  const [draggingEventId, setDraggingEventId] = useState<string | null>(null);

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
    <div className="p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            Jadwal Pekan Ini ({formatIndonesianDate(weekDays[0].dateStr)} –{' '}
            {formatIndonesianDate(weekDays[6].dateStr)})
          </h3>
          <p className="text-xs text-slate-500">
            Tarik dan lepas (drag & drop) kartu agenda untuk memindahkan jadwal ke hari lain dengan cepat.
          </p>
        </div>
      </div>

      <div className="space-y-3.5">
        {weekDays.map((dayInfo, idx) => {
          const { dateStr, dayNumber, isToday, events: dayEvents } = dayInfo;
          const dayName = DAY_NAMES_ID[idx];
          const isDragOver = dragOverDate === dateStr;

          return (
            <div
              key={dateStr}
              onDragOver={(e) => handleDragOver(e, dateStr)}
              onDragLeave={(e) => handleDragLeave(e, dateStr)}
              onDrop={(e) => handleDrop(e, dateStr)}
              className={`border rounded-xl p-4 transition-all relative ${
                isDragOver
                  ? 'border-2 border-dashed border-emerald-600 bg-emerald-50/80 shadow-md ring-2 ring-emerald-500/30'
                  : isToday
                  ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500/40 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {/* Day Row Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`text-center px-2.5 py-1 rounded-lg ${
                      isToday
                        ? 'bg-emerald-700 text-white font-bold'
                        : idx === 6
                        ? 'bg-rose-50 text-rose-700 font-bold'
                        : 'bg-slate-100 text-slate-800 font-semibold'
                    }`}
                  >
                    <span className="text-xs block leading-tight">{dayName}</span>
                    <span className="text-sm block tabular-nums leading-tight">{dayNumber}</span>
                  </div>

                  <div>
                    <span className="font-bold text-sm text-slate-900 block">
                      {formatIndonesianDate(dateStr, { withDayName: false })}
                    </span>
                    <span className="text-xs text-slate-500">
                      {dayEvents.length === 0
                        ? 'KBM Reguler Sesuai Jadwal'
                        : `${dayEvents.length} Agenda Khusus`}
                    </span>
                  </div>

                  {isToday && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-700 text-white ml-2">
                      Hari Ini
                    </span>
                  )}

                  {isDragOver && (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-700 text-white animate-pulse ml-2 shadow-xs">
                      Lepaskan untuk menjadwalkan ke {dayName}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onSelectDate(dateStr)}
                  className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-semibold px-2 py-1 rounded-md hover:bg-emerald-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
              </div>

              {/* Events for this Day */}
              {dayEvents.length === 0 ? (
                <div className="py-3 text-xs text-slate-400 italic flex items-center justify-between">
                  <span>Tidak ada agenda khusus. Anda dapat menarik agenda dari hari lain ke sini.</span>
                  {isDragOver && (
                    <span className="text-emerald-700 font-semibold text-xs not-italic">
                      Lepaskan agenda di sini ↓
                    </span>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  {dayEvents.map((evt) => {
                    const cat = CATEGORIES_CONFIG[evt.category] || CATEGORIES_CONFIG.academic;
                    const isBeingDragged = draggingEventId === evt.id;
                    const isSearchMatch = Boolean(
                      searchQuery?.trim() &&
                      (evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       evt.audience.toLowerCase().includes(searchQuery.toLowerCase()))
                    );

                    return (
                      <div
                        key={evt.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, evt)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onSelectEvent(evt)}
                        title="Tahan & geser untuk menjadwalkan ulang ke tanggal lain"
                        className={`p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing bg-white hover:shadow-xs select-none group/card ${
                          cat.borderColor
                        } hover:border-slate-400 ${
                          isSearchMatch
                            ? 'ring-2 ring-amber-400 border-amber-400 shadow-md'
                            : ''
                        } ${
                          isBeingDragged ? 'opacity-40 border-dashed border-emerald-500 scale-98' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <GripVertical className="w-3.5 h-3.5 text-slate-400 group-hover/card:text-slate-600 shrink-0" />
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold text-white shadow-2xs ${cat.bgSolid}`}
                            >
                              {cat.label}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {evt.startTime && evt.endTime
                              ? `${evt.startTime} – ${evt.endTime} WITA`
                              : 'Sepanjang Hari'}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2">
                          <HighlightText text={evt.title} query={searchQuery} />
                        </h4>

                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          <HighlightText text={evt.description} query={searchQuery} />
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                          <div className="flex items-center gap-1 text-slate-700">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            <span className="truncate max-w-[150px]">{evt.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500">
                            <Users className="w-3 h-3 text-emerald-600" />
                            <span className="truncate max-w-[150px]">{evt.audience}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
