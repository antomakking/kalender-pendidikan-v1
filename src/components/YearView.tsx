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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">
            Matriks Kalender Tahunan TA {academicYear}
          </h3>
          <p className="text-xs text-slate-500">
            Ringkasan 12 bulan kalender pendidikan. Klik nama bulan untuk beralih ke tampilan bulanan detail.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <span className="w-2.5 h-2.5 rounded bg-emerald-600 shadow-xs"></span>
            <span className="font-semibold text-emerald-900">Akademik</span>
          </div>
          <div className="flex items-center gap-1.5 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <span className="w-2.5 h-2.5 rounded bg-rose-600 shadow-xs"></span>
            <span className="font-semibold text-rose-900">Libur</span>
          </div>
          <div className="flex items-center gap-1.5 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
            <span className="w-2.5 h-2.5 rounded bg-sky-600 shadow-xs"></span>
            <span className="font-semibold text-sky-900">Kesiswaan/PKL</span>
          </div>
          <div className="flex items-center gap-1.5 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
            <span className="w-2.5 h-2.5 rounded bg-purple-600 shadow-xs"></span>
            <span className="font-semibold text-purple-900">Rapat/Rapor</span>
          </div>
        </div>
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
                {/* Month Card Header - Royal Forest Green with Gold Accent (Poster Inspired) */}
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
                            : dayEvents.length > 0
                            ? `${(CATEGORIES_CONFIG[dayEvents[0].category] || CATEGORIES_CONFIG.academic).bgSolid} font-bold scale-[0.98]`
                            : isSunday
                            ? 'text-[#dc2626] font-bold hover:bg-rose-50'
                            : 'text-slate-700 hover:bg-slate-100 font-medium'
                        }`}
                      >
                        <span className="leading-tight">{day}</span>
                      </div>
                    );
                  })}

                  {/* Trailing empty cells to ensure exactly 6 rows (42 cells) across all cards for perfect top-alignment */}
                  {Array.from({ length: 42 - (startDayOfWeek + daysInMonth) }).map((_, i) => (
                    <div key={`trailing-${i}`} className="py-1" />
                  ))}
                </div>

                {/* Official Holiday Footnotes in Red (Inspired by the poster footer under each month) */}
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

              {/* Month Highlights / Agenda Preview (Top Aligned) */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] flex-1 flex flex-col justify-start">
                {monthEvents.length > 0 ? (
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Agenda ({monthEvents.length})
                    </span>
                    {monthEvents.map((evt) => {
                      const cat = CATEGORIES_CONFIG[evt.category] || CATEGORIES_CONFIG.academic;
                      const isMatch = Boolean(
                        searchQuery?.trim() &&
                        (evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         evt.description.toLowerCase().includes(searchQuery.toLowerCase()))
                      );

                      return (
                        <div
                          key={evt.id}
                          onClick={() => onSelectEvent(evt)}
                          className={`truncate text-[10px] font-semibold text-white px-2 py-0.5 rounded cursor-pointer flex items-center gap-1 shadow-xs hover:brightness-110 transition-all ${
                            cat.bgSolid
                          } ${isMatch ? 'ring-2 ring-amber-400 brightness-110 shadow-sm scale-[1.01]' : ''}`}
                          title={`${evt.title} (${evt.startDate} s/d ${evt.endDate})`}
                        >
                          <HighlightText text={evt.title} query={searchQuery} className="truncate" />
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
      {/* Poster-Style Bottom Color Legend ('Keterangan') */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="bg-[#143c14] text-white text-[11px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
            Keterangan:
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Standar Pewarnaan Dokumen Kalender Akademik Resmi
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-[#ffcc00] border border-amber-400 shrink-0 shadow-2xs"></span>
            <span className="text-slate-800">KBM & Pembelajaran</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-[#15803d] shrink-0 shadow-2xs"></span>
            <span className="text-slate-800">Penilaian & Rapor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-[#0284c7] shrink-0 shadow-2xs"></span>
            <span className="text-slate-800">Remedial & PKL</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-[#143c14] shrink-0 shadow-2xs"></span>
            <span className="text-slate-800">Wisuda / Kelulusan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-[#dc2626] shrink-0 shadow-2xs"></span>
            <span className="text-slate-800">Libur Nasional</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-[#dc2626] border border-red-700 shrink-0 shadow-2xs"></span>
            <span className="text-[#dc2626]">Ahad (Akhir Pekan)</span>
          </div>
        </div>
      </div>

      {/* Bottom Institutional Disclaimer Banner (Like bottom of poster) */}
      <div className="bg-[#143c14] text-white rounded-xl p-3 text-center text-xs font-bold border-t-2 border-[#ffcc00] shadow-xs">
        <span className="text-[#ffcc00] tracking-wider uppercase mr-1">PERHATIAN:</span>
        Jadwal dapat berubah mengikuti informasi dari Pemerintah dan Yayasan. Seluruh perubahan jadwal akan diumumkan melalui surat edaran resmi.
      </div>
    </div>
  );
};
