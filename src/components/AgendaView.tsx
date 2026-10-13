import React from 'react';
import { Calendar, Clock, Download, ExternalLink, Flag, MapPin, Users } from 'lucide-react';
import { AcademicEvent } from '../types.ts';
import {
  CATEGORIES_CONFIG,
  deduplicateEvents,
  formatDateRange,
  formatIndonesianDate,
  generateICalFile,
  getGoogleCalendarUrl,
  MONTH_NAMES_ID,
} from '../utils/calendarUtils.ts';
import { EmptyState } from './EmptyState.tsx';
import { HighlightText } from './HighlightText.tsx';

interface AgendaViewProps {
  events: AcademicEvent[];
  todayStr: string;
  searchQuery?: string;
  onResetFilters?: () => void;
  onAddEvent?: () => void;
  onSelectEvent: (event: AcademicEvent) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  events,
  todayStr,
  searchQuery,
  onResetFilters,
  onAddEvent,
  onSelectEvent,
}) => {
  // Deduplicate and sort events by startDate
  const sorted = deduplicateEvents([...events]).sort((a, b) => a.startDate.localeCompare(b.startDate));

  // Group by Month (Year-Month)
  const grouped: Record<string, AcademicEvent[]> = {};
  sorted.forEach((e) => {
    const ym = e.startDate.slice(0, 7); // '2026-09'
    if (!grouped[ym]) grouped[ym] = [];
    grouped[ym].push(e);
  });

  const monthKeys = Object.keys(grouped).sort();

  if (sorted.length === 0) {
    return (
      <div className="p-6 sm:p-10">
        <EmptyState
          type={searchQuery ? 'search' : 'filter'}
          query={searchQuery}
          onResetFilters={onResetFilters}
          onAddEvent={onAddEvent}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-8">
      {/* Top Banner with Quick Export for All Current Agenda */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 border border-[#143c14]/20 dark:border-emerald-800/60 rounded-xl">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#143c14] dark:text-emerald-400" />
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
            Menampilkan {sorted.length} Agenda Terjadwal
          </span>
        </div>
        <button
          type="button"
          onClick={() => generateICalFile(sorted, `Daftar-Agenda-Akademik-${sorted.length}-Kegiatan.ics`)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-[#ffcc00] hover:bg-[#eab308] rounded-lg transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
          title="Ekspor seluruh daftar kegiatan ini ke file .ics"
        >
          <Download className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
          <span>Ekspor {sorted.length} Agenda ke iCal (.ics)</span>
        </button>
      </div>

      {monthKeys.map((ym) => {
        const [yearStr, monthStr] = ym.split('-');
        const monthIndex = parseInt(monthStr, 10) - 1;
        const monthTitle = `${MONTH_NAMES_ID[monthIndex]} ${yearStr}`;
        const monthEvents = grouped[ym];

        return (
          <div key={ym} className="space-y-3">
            <div className="flex items-center gap-3">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                {monthTitle}
              </h4>
              <span className="text-xs font-semibold text-[#143c14] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                {monthEvents.length} Agenda
              </span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {monthEvents.map((evt) => {
                const isHoliday = evt.category === 'holiday' || evt.isOfficialHoliday;
                const cat = CATEGORIES_CONFIG[evt.category] || CATEGORIES_CONFIG.academic;
                const isOngoing = evt.startDate <= todayStr && evt.endDate >= todayStr;

                return (
                  <div
                    key={evt.id}
                    onClick={() => onSelectEvent(evt)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isHoliday
                        ? 'border-rose-200 dark:border-rose-900 bg-rose-50/20 dark:bg-rose-950/30 hover:border-rose-400'
                        : isOngoing
                        ? 'ring-2 ring-emerald-500 border-emerald-300 bg-emerald-50/10 dark:bg-emerald-950/20 hover:border-[#143c14] dark:hover:border-emerald-400'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#143c14] dark:hover:border-emerald-500'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-2xs flex items-center gap-1 ${cat.bgSolid}`}
                        >
                          <span>{cat.label}</span>
                        </span>

                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {formatDateRange(evt.startDate, evt.endDate)}
                        </span>

                        {isOngoing && (
                          <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded uppercase">
                            Sedang Berlangsung Hari Ini
                          </span>
                        )}
                      </div>

                      <h5 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug">
                        <HighlightText text={evt.title} query={searchQuery} />
                      </h5>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        <HighlightText text={evt.description} query={searchQuery} />
                      </p>
                    </div>

                    <div className="sm:text-right shrink-0 text-xs text-slate-500 dark:text-slate-400 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2">
                      <div className="space-y-1">
                        <div className="flex sm:justify-end items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                          <Users className="w-3.5 h-3.5 text-[#143c14] dark:text-emerald-400" />
                          <span>{evt.audience}</span>
                        </div>
                        <div className="flex sm:justify-end items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-[#143c14] dark:text-emerald-400" />
                          <span>{evt.location}</span>
                        </div>
                      </div>

                      {/* Quick Sync & Export buttons for this specific event */}
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <a
                          href={getGoogleCalendarUrl(evt)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10.5px] font-bold text-[#143c14] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-200 dark:border-emerald-800 transition-colors"
                          title="Tambah kegiatan ini langsung ke Google Calendar"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Google Cal</span>
                        </a>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            generateICalFile([evt], `${evt.title.replace(/[^a-zA-Z0-9]/g, '-')}.ics`);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10.5px] font-bold text-slate-950 bg-[#ffcc00] hover:bg-[#eab308] transition-colors cursor-pointer shadow-2xs"
                          title="Unduh berkas iCal (.ics) untuk kegiatan ini"
                        >
                          <Download className="w-3 h-3 text-slate-950" />
                          <span>.ics</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
