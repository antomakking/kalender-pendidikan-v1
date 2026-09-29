import React from 'react';
import { AcademicEvent } from '../types.ts';
import {
  CATEGORIES_CONFIG,
  formatDateToISO,
  getEventsForDate,
  MONTH_NAMES_ID,
} from '../utils/calendarUtils.ts';
import { HighlightText } from './HighlightText.tsx';

interface YearViewProps {
  academicYear: string;
  events: AcademicEvent[];
  todayStr: string;
  searchQuery?: string;
  onSelectEvent: (event: AcademicEvent) => void;
  onSelectDate: (dateStr: string) => void;
  onJumpToMonth: (year: number, month: number) => void;
}

export interface EventColorStyle {
  bgSolid: string;
  dotColor: string;
  badgeBg: string;
  textColor: string;
  cellTint: string;
}

export const DISTINCT_EVENT_COLORS: EventColorStyle[] = [
  {
    bgSolid: 'bg-[#ffcc00] text-slate-950 font-bold hover:bg-[#e6b800]',
    dotColor: 'bg-[#ffcc00]',
    badgeBg: 'bg-amber-100 text-amber-950 border border-amber-300',
    textColor: 'text-slate-950',
    cellTint: 'bg-amber-100 border-amber-300 text-slate-900',
  },
  {
    bgSolid: 'bg-[#0284c7] text-white font-bold hover:bg-[#0369a1]',
    dotColor: 'bg-[#0284c7]',
    badgeBg: 'bg-sky-100 text-sky-900 border border-sky-300',
    textColor: 'text-white',
    cellTint: 'bg-sky-100 border-sky-300 text-sky-950',
  },
  {
    bgSolid: 'bg-[#15803d] text-white font-bold hover:bg-[#166534]',
    dotColor: 'bg-[#15803d]',
    badgeBg: 'bg-emerald-100 text-emerald-950 border border-emerald-300',
    textColor: 'text-white',
    cellTint: 'bg-emerald-100 border-emerald-300 text-emerald-950',
  },
  {
    bgSolid: 'bg-[#7c3aed] text-white font-bold hover:bg-[#6d28d9]',
    dotColor: 'bg-[#7c3aed]',
    badgeBg: 'bg-purple-100 text-purple-950 border border-purple-300',
    textColor: 'text-white',
    cellTint: 'bg-purple-100 border-purple-300 text-purple-950',
  },
  {
    bgSolid: 'bg-[#ea580c] text-white font-bold hover:bg-[#c2410c]',
    dotColor: 'bg-[#ea580c]',
    badgeBg: 'bg-orange-100 text-orange-950 border border-orange-300',
    textColor: 'text-white',
    cellTint: 'bg-orange-100 border-orange-300 text-orange-950',
  },
  {
    bgSolid: 'bg-[#0d9488] text-white font-bold hover:bg-[#0f766e]',
    dotColor: 'bg-[#0d9488]',
    badgeBg: 'bg-teal-100 text-teal-950 border border-teal-300',
    textColor: 'text-white',
    cellTint: 'bg-teal-100 border-teal-300 text-teal-950',
  },
  {
    bgSolid: 'bg-[#db2777] text-white font-bold hover:bg-[#be185d]',
    dotColor: 'bg-[#db2777]',
    badgeBg: 'bg-pink-100 text-pink-950 border border-pink-300',
    textColor: 'text-white',
    cellTint: 'bg-pink-100 border-pink-300 text-pink-950',
  },
  {
    bgSolid: 'bg-[#4f46e5] text-white font-bold hover:bg-[#4338ca]',
    dotColor: 'bg-[#4f46e5]',
    badgeBg: 'bg-indigo-100 text-indigo-950 border border-indigo-300',
    textColor: 'text-white',
    cellTint: 'bg-indigo-100 border-indigo-300 text-indigo-950',
  },
];

export const HOLIDAY_COLOR_STYLE: EventColorStyle = {
  bgSolid: 'bg-[#dc2626] text-white font-bold hover:bg-[#b91c1c]',
  dotColor: 'bg-[#dc2626]',
  badgeBg: 'bg-rose-100 text-rose-800 border border-rose-300',
  textColor: 'text-white',
  cellTint: 'bg-rose-100 border-rose-300 text-rose-900',
};

/**
 * Assigns a distinct color style to each event within a specific month
 */
function getEventColorInMonth(
  event: AcademicEvent,
  monthEvents: AcademicEvent[]
): EventColorStyle {
  if (event.category === 'holiday') {
    return HOLIDAY_COLOR_STYLE;
  }

  const nonHolidays = monthEvents.filter((e) => e.category !== 'holiday');
  const index = nonHolidays.findIndex((e) => e.id === event.id);
  if (index === -1) {
    return DISTINCT_EVENT_COLORS[0];
  }

  return DISTINCT_EVENT_COLORS[index % DISTINCT_EVENT_COLORS.length];
}

export const YearView: React.FC<YearViewProps> = ({
  academicYear,
  events,
  todayStr,
  searchQuery,
  onSelectEvent,
  onSelectDate,
  onJumpToMonth,
}) => {
  // 12 months of Academic Year: Juli 2026 to Juni 2027
  const academicMonths = [
    { year: 2026, month: 6, label: 'Juli 2026', semester: 'Ganjil' },
    { year: 2026, month: 7, label: 'Agustus 2026', semester: 'Ganjil' },
    { year: 2026, month: 8, label: 'September 2026', semester: 'Ganjil' },
    { year: 2026, month: 9, label: 'Oktober 2026', semester: 'Ganjil' },
    { year: 2026, month: 10, label: 'November 2026', semester: 'Ganjil' },
    { year: 2026, month: 11, label: 'Desember 2026', semester: 'Ganjil' },
    { year: 2027, month: 0, label: 'Januari 2027', semester: 'Genap' },
    { year: 2027, month: 1, label: 'Februari 2027', semester: 'Genap' },
    { year: 2027, month: 2, label: 'Maret 2027', semester: 'Genap' },
    { year: 2027, month: 3, label: 'April 2027', semester: 'Genap' },
    { year: 2027, month: 4, label: 'Mei 2027', semester: 'Genap' },
    { year: 2027, month: 5, label: 'Juni 2027', semester: 'Genap' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="pb-3 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-lg">
          Matriks Kalender Tahunan TA {academicYear}
        </h3>
        <p className="text-xs text-slate-500">
          Ringkasan 12 bulan kalender pendidikan. Klik nama bulan untuk beralih ke tampilan bulanan detail.
        </p>
      </div>

      {/* Grid of 12 Months */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {academicMonths.map(({ year, month, label, semester }) => {
          const firstDay = new Date(year, month, 1);
          const lastDay = new Date(year, month + 1, 0);
          const daysInMonth = lastDay.getDate();
          const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0

          // Filter events occurring in this month
          const monthStartISO = `${year}-${String(month + 1).padStart(2, '0')}-01`;
          const monthEndISO = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;
          const monthEvents = events.filter(
            (e) => e.startDate <= monthEndISO && e.endDate >= monthStartISO
          );

          return (
            <div
              key={`${year}-${month}`}
              className="bg-white border-2 border-slate-200/90 rounded-xl p-3 shadow-xs hover:border-[#143c14]/50 transition-colors flex flex-col justify-start"
            >
              <div>
                {/* Month Card Header */}
                <div className="bg-[#143c14] text-white py-1.5 px-3 rounded-lg flex items-center justify-between shadow-2xs mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-xs tracking-wider uppercase text-white">
                      {label}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 text-[#143c14] bg-[#ffcc00] rounded">
                      {semester}
                    </span>
                  </div>
                  <button
                    onClick={() => onJumpToMonth(year, month)}
                    className="text-[10px] font-bold text-[#ffcc00] hover:text-white transition-colors cursor-pointer"
                  >
                    Buka →
                  </button>
                </div>

                {/* Day Letters: Green for Mon-Sat, Red for Ahad */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black mb-1.5">
                  <span className="bg-[#143c14] text-white py-0.5 rounded-xs">S</span>
                  <span className="bg-[#143c14] text-white py-0.5 rounded-xs">S</span>
                  <span className="bg-[#143c14] text-white py-0.5 rounded-xs">R</span>
                  <span className="bg-[#143c14] text-white py-0.5 rounded-xs">K</span>
                  <span className="bg-[#143c14] text-white py-0.5 rounded-xs">J</span>
                  <span className="bg-[#143c14] text-white py-0.5 rounded-xs">S</span>
                  <span className="bg-[#dc2626] text-white py-0.5 rounded-xs">A</span>
                </div>

                {/* Mini Day Cells */}
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] tabular-nums">
                  {/* Empty offset days */}
                  {Array.from({ length: startDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="py-1" />
                  ))}

                  {/* Month days */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateObj = new Date(year, month, day);
                    const dateStr = formatDateToISO(dateObj);
                    const dayEvents = getEventsForDate(events, dateStr);
                    const isToday = dateStr === todayStr;
                    const isSunday = (dateObj.getDay() + 6) % 7 === 6;

                    // Determine the visual color style for this day based on its event in this month
                    const primaryEvent = dayEvents[0];
                    const eventStyle = primaryEvent
                      ? getEventColorInMonth(primaryEvent, monthEvents)
                      : null;

                    return (
                      <div
                        key={dateStr}
                        onClick={() => {
                          if (dayEvents.length > 0) {
                            onSelectEvent(dayEvents[0]);
                          } else {
                            onSelectDate(dateStr);
                          }
                        }}
                        title={
                          dayEvents.length > 0
                            ? dayEvents.map((e) => e.title).join(' • ')
                            : dateStr
                        }
                        className={`py-1 rounded-md flex flex-col items-center justify-center cursor-pointer transition-transform ${
                          isToday
                            ? 'bg-[#143c14] text-white font-black ring-2 ring-[#ffcc00]'
                            : eventStyle
                            ? `${eventStyle.bgSolid} font-bold scale-[0.98] shadow-2xs`
                            : isSunday
                            ? 'text-[#dc2626] font-bold hover:bg-rose-50'
                            : 'text-slate-700 hover:bg-slate-100 font-medium'
                        }`}
                      >
                        <span className="leading-tight">{day}</span>
                      </div>
                    );
                  })}

                  {/* Trailing empty cells to ensure exactly 6 rows (42 cells) */}
                  {Array.from({ length: 42 - (startDayOfWeek + daysInMonth) }).map((_, i) => (
                    <div key={`trailing-${i}`} className="py-1" />
                  ))}
                </div>

                {/* Official Holiday Footnotes in Red */}
                {monthEvents.filter((e) => e.category === 'holiday').length > 0 && (
                  <div className="mt-2 pt-1.5 border-t border-rose-100 text-[9.5px] text-[#dc2626] font-bold leading-tight space-y-0.5">
                    {monthEvents
                      .filter((e) => e.category === 'holiday')
                      .slice(0, 2)
                      .map((h) => (
                        <div key={h.id} className="truncate" title={h.title}>
                          • {parseInt(h.startDate.slice(8), 10)} {MONTH_NAMES_ID[month]}: {h.title}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Month Highlights / Agenda Preview with Distinct Colors Matching the Mini Grid */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] flex-1 flex flex-col justify-start">
                {monthEvents.length > 0 ? (
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Agenda ({monthEvents.length})
                    </span>
                    {monthEvents.map((evt) => {
                      const eventStyle = getEventColorInMonth(evt, monthEvents);
                      const isMatch = Boolean(
                        searchQuery?.trim() &&
                        (evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         evt.description.toLowerCase().includes(searchQuery.toLowerCase()))
                      );

                      // Format concise date badge (e.g. 1-10 Okt)
                      const sDay = parseInt(evt.startDate.slice(8), 10);
                      const eDay = parseInt(evt.endDate.slice(8), 10);
                      const dateRangeText = sDay === eDay ? `${sDay}` : `${sDay}–${eDay}`;

                      return (
                        <div
                          key={evt.id}
                          onClick={() => onSelectEvent(evt)}
                          className={`truncate text-[10px] font-semibold px-2 py-0.5 rounded cursor-pointer flex items-center justify-between gap-1 shadow-xs hover:brightness-110 transition-all ${
                            eventStyle.bgSolid
                          } ${isMatch ? 'ring-2 ring-amber-400 brightness-110 shadow-sm scale-[1.01]' : ''}`}
                          title={`${evt.title} (${evt.startDate} s/d ${evt.endDate})`}
                        >
                          <HighlightText text={evt.title} query={searchQuery} className="truncate flex-1" />
                          <span className="text-[9px] opacity-85 shrink-0 tabular-nums font-mono">
                            {dateRangeText} {MONTH_NAMES_ID[month].slice(0, 3)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-slate-400 text-[10px] italic">
                    Belum ada agenda terjadwal
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Institutional Disclaimer Banner */}
      <div className="bg-[#143c14] text-white rounded-xl p-3 text-center text-xs font-bold border-t-2 border-[#ffcc00] shadow-xs">
        <span className="text-[#ffcc00] tracking-wider uppercase mr-1">PERHATIAN:</span>
        Jadwal dapat berubah mengikuti informasi dari Pemerintah dan Yayasan. Seluruh perubahan jadwal akan diumumkan melalui surat edaran resmi.
      </div>
    </div>
  );
};
