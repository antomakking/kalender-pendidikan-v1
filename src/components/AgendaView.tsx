import React from 'react';
import { Calendar, Clock, Download, ExternalLink, Flag, MapPin, Users } from 'lucide-react';
import { AcademicEvent } from '../types.ts';
import {
  CATEGORIES_CONFIG,
  formatDateRange,
  formatIndonesianDate,
  generateICalFile,
  getGoogleCalendarUrl,
  MONTH_NAMES_ID,
} from '../utils/calendarUtils.ts';
import { EmptyState } from './EmptyState.tsx';
import { HighlightText } from './HighlightText.tsx';
import { IndonesianFlagPin } from './IndonesianFlagPin.tsx';

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
  // Sort events by startDate
  const sorted = [...events].sort((a, b) => a.startDate.localeCompare(b.startDate));

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-emerald-50/70 border border-[#143c14]/20 rounded-xl">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#143c14]" />
          <span className="text-xs font-bold text-slate-900">
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
              <h4 className="font-bold text-slate-900 text-base">
                {monthTitle}
              </h4>
              <span className="text-xs font-semibold text-[#143c14] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {monthEvents.length} Agenda
              </span>
              <div className="flex-1 h-px bg-slate-200"></div>
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
                        ? 'border-2 border-red-600 bg-red-50/50 ring-1 ring-red-400/30 hover:border-red-700'
                        : isOngoing
                        ? 'ring-2 ring-emerald-500 border-emerald-300 bg-emerald-50/10 hover:border-[#143c14]'
                        : 'border-slate-200 bg-white hover:border-[#143c14]'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-2xs flex items-center gap-1 ${
                            isHoliday ? 'bg-red-600' : cat.bgSolid
                          }`}
                        >
                          {isHoliday && <IndonesianFlagPin className="w-3.5 h-2.5 shrink-0" />}
                          <span>{isHoliday ? 'Libur Nasional' : cat.label}</span>
                        </span>

                        <span className="text-xs font-bold text-slate-700">
                          {formatDateRange(evt.startDate, evt.endDate)}
                        </span>

                        {isOngoing && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                            Sedang Berlangsung Hari Ini
                          </span>
                        )}
                      </div>

                      <h5 className="font-bold text-slate-900 text-sm leading-snug">
                        <HighlightText text={evt.title} query={searchQuery} />
                      </h5>

                      <p className="text-xs text-slate-500 line-clamp-2">
                        <HighlightText text={evt.description} query={searchQuery} />
                      </p>
                    </div>

                    <div className="sm:text-right shrink-0 text-xs text-slate-500 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2">
                      <div className="space-y-1">
                        <div className="flex sm:justify-end items-center gap-1.5 text-slate-700 font-medium">
                          <Users className="w-3.5 h-3.5 text-[#143c14]" />
                          <span>{evt.audience}</span>
                        </div>
                        <div className="flex sm:justify-end items-center gap-1.5 text-slate-400 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-[#143c14]" />
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
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10.5px] font-bold text-[#143c14] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
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
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10.5px] font-bold text-slate-900 bg-[#ffcc00] hover:bg-[#eab308] transition-colors cursor-pointer shadow-2xs"
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
