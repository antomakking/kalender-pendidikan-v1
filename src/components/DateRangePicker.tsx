import React, { useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  DAY_NAMES_ID,
  formatDateRange,
  formatDateToISO,
  formatIndonesianDate,
  MONTH_NAMES_ID,
} from '../utils/calendarUtils.ts';

interface DateRangePickerProps {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  onChange: (start: string, end: string) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  // Calendar view navigation (Month & Year)
  const initialYear = startDate ? parseInt(startDate.slice(0, 4), 10) : new Date().getFullYear();
  const initialMonth = startDate ? parseInt(startDate.slice(5, 7), 10) - 1 : new Date().getMonth();

  const [viewYear, setViewYear] = useState<number>(initialYear);
  const [viewMonth, setViewMonth] = useState<number>(initialMonth);

  // Selection step: 'start' (next click picks start) or 'end' (next click picks end)
  const [selectionStep, setSelectionStep] = useState<'idle' | 'picking-end'>('idle');
  const [tempStart, setTempStart] = useState<string>(startDate);
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  // Today string
  const todayStr = useMemo(() => formatDateToISO(new Date()), []);

  // Compute days matrix for the active viewMonth
  const calendarCells = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0);

    const totalDays = lastDayOfMonth.getDate();
    // Monday is index 0 in Indonesia
    const startingDayIndex = (firstDayOfMonth.getDay() + 6) % 7;

    const cells: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isWeekend: boolean;
    }> = [];

    // Previous month padding
    const prevMonthLastDay = new Date(viewYear, viewMonth, 0).getDate();
    for (let i = startingDayIndex - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const prevDate = new Date(viewYear, viewMonth - 1, d);
      const isSun = prevDate.getDay() === 0;
      cells.push({
        dateStr: formatDateToISO(prevDate),
        dayNumber: d,
        isCurrentMonth: false,
        isWeekend: isSun,
      });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const currDate = new Date(viewYear, viewMonth, d);
      const isSun = currDate.getDay() === 0;
      cells.push({
        dateStr: formatDateToISO(currDate),
        dayNumber: d,
        isCurrentMonth: true,
        isWeekend: isSun,
      });
    }

    // Next month padding to fill rows (multiple of 7)
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(viewYear, viewMonth + 1, d);
      const isSun = nextDate.getDay() === 0;
      cells.push({
        dateStr: formatDateToISO(nextDate),
        dayNumber: d,
        isCurrentMonth: false,
        isWeekend: isSun,
      });
    }

    return cells;
  }, [viewYear, viewMonth]);

  // Navigate months
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Day click handler
  const handleDayClick = (dateStr: string) => {
    if (selectionStep === 'idle') {
      // Start picking range: set start and prompt for end
      setTempStart(dateStr);
      setSelectionStep('picking-end');
      onChange(dateStr, dateStr);
    } else {
      // Complete range
      let finalStart = tempStart;
      let finalEnd = dateStr;
      if (finalEnd < finalStart) {
        const swap = finalStart;
        finalStart = finalEnd;
        finalEnd = swap;
      }
      onChange(finalStart, finalEnd);
      setSelectionStep('idle');
      setHoverDate(null);
    }
  };

  // Quick preset shortcuts
  const applyPreset = (daysDuration: number) => {
    const base = startDate ? new Date(startDate) : new Date();
    const startStr = formatDateToISO(base);

    const endObj = new Date(base);
    endObj.setDate(endObj.getDate() + (daysDuration - 1));
    const endStr = formatDateToISO(endObj);

    onChange(startStr, endStr);
    setSelectionStep('idle');
    setHoverDate(null);

    // Sync view
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
  };

  // Preset: whole current month
  const applyWholeMonth = () => {
    const startObj = new Date(viewYear, viewMonth, 1);
    const endObj = new Date(viewYear, viewMonth + 1, 0);
    const startStr = formatDateToISO(startObj);
    const endStr = formatDateToISO(endObj);

    onChange(startStr, endStr);
    setSelectionStep('idle');
    setHoverDate(null);
  };

  // Compute active preview range
  const activeStart = selectionStep === 'picking-end' ? tempStart : startDate;
  const activeEnd =
    selectionStep === 'picking-end'
      ? hoverDate || tempStart
      : endDate || startDate;

  const [effectiveStart, effectiveEnd] =
    activeStart <= activeEnd
      ? [activeStart, activeEnd]
      : [activeEnd, activeStart];

  // Duration in days
  const durationDays = useMemo(() => {
    if (!startDate || !endDate) return 1;
    const diff = Math.round(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(1, diff + 1);
  }, [startDate, endDate]);

  return (
    <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-3 sm:p-4 space-y-3">
      {/* Header with Title & Quick Reset */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#143c14]" />
          <span className="font-bold text-slate-800 text-xs sm:text-sm">
            Pilih Rentang Tanggal Visual
          </span>
        </div>

        {selectionStep === 'picking-end' ? (
          <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
            Klik tanggal selesai...
          </span>
        ) : (
          <span className="text-[11px] font-medium text-slate-500">
            {durationDays} Hari Kegiatan
          </span>
        )}
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">
          Preset Cepat:
        </span>
        <button
          type="button"
          onClick={() => {
            const now = new Date();
            const nowStr = formatDateToISO(now);
            onChange(nowStr, nowStr);
            setViewYear(now.getFullYear());
            setViewMonth(now.getMonth());
            setSelectionStep('idle');
          }}
          className="px-2 py-0.5 text-[10.5px] font-semibold bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
        >
          Hari Ini (1 Hari)
        </button>
        <button
          type="button"
          onClick={() => applyPreset(3)}
          className="px-2 py-0.5 text-[10.5px] font-semibold bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
        >
          3 Hari
        </button>
        <button
          type="button"
          onClick={() => applyPreset(5)}
          className="px-2 py-0.5 text-[10.5px] font-semibold bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
        >
          1 Pekan KBM (5 Hari)
        </button>
        <button
          type="button"
          onClick={() => applyPreset(7)}
          className="px-2 py-0.5 text-[10.5px] font-semibold bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
        >
          7 Hari Penuh
        </button>
        <button
          type="button"
          onClick={() => applyPreset(14)}
          className="px-2 py-0.5 text-[10.5px] font-semibold bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer hidden sm:inline-block"
        >
          2 Pekan
        </button>
        <button
          type="button"
          onClick={applyWholeMonth}
          className="px-2 py-0.5 text-[10.5px] font-semibold bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
        >
          1 Bulan Penuh
        </button>
      </div>

      {/* Mini Calendar Container */}
      <div className="bg-white rounded-lg border border-slate-200 p-2.5 sm:p-3 shadow-2xs">
        {/* Month Navigation & Year Selector */}
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Bulan Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
            <span>{MONTH_NAMES_ID[viewMonth]}</span>
            <span>{viewYear}</span>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Bulan Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day Name Headers (7 Cols: Sen - Ahd) */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-slate-500 mb-1 border-b border-slate-100 pb-1">
          {DAY_NAMES_ID.map((dayName, idx) => (
            <span
              key={dayName}
              className={idx === 6 ? 'text-rose-600 font-extrabold' : 'text-slate-600'}
            >
              {dayName.slice(0, 3)}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-y-1 gap-x-0.5 text-center text-xs">
          {calendarCells.map((cell) => {
            const isStart = cell.dateStr === effectiveStart;
            const isEnd = cell.dateStr === effectiveEnd;
            const isInRange =
              cell.dateStr >= effectiveStart && cell.dateStr <= effectiveEnd;
            const isToday = cell.dateStr === todayStr;

            let cellClass = 'h-7.5 w-full flex items-center justify-center text-xs font-medium cursor-pointer transition-colors relative ';

            if (!cell.isCurrentMonth) {
              cellClass += 'text-slate-300 ';
            } else if (cell.isWeekend) {
              cellClass += 'text-rose-600 ';
            } else {
              cellClass += 'text-slate-700 ';
            }

            let bgWrapper = '';
            if (isStart && isEnd) {
              bgWrapper = 'bg-[#143c14] text-white font-bold rounded-lg shadow-xs';
            } else if (isStart) {
              bgWrapper = 'bg-[#143c14] text-white font-bold rounded-l-lg shadow-xs';
            } else if (isEnd) {
              bgWrapper = 'bg-[#143c14] text-white font-bold rounded-r-lg shadow-xs';
            } else if (isInRange) {
              bgWrapper = 'bg-emerald-100/90 text-[#143c14] font-semibold';
            } else {
              bgWrapper = 'hover:bg-slate-100 rounded-md';
            }

            return (
              <div
                key={cell.dateStr}
                onClick={() => handleDayClick(cell.dateStr)}
                onMouseEnter={() => {
                  if (selectionStep === 'picking-end') {
                    setHoverDate(cell.dateStr);
                  }
                }}
                className={`${cellClass}`}
                title={formatIndonesianDate(cell.dateStr, { withDayName: true })}
              >
                <div
                  className={`w-full h-full flex items-center justify-center ${bgWrapper}`}
                >
                  <span>{cell.dayNumber}</span>
                  {isToday && !isInRange && (
                    <span className="absolute bottom-1 w-1 h-1 bg-[#ffcc00] rounded-full"></span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Range Visual Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-emerald-50/70 border border-[#143c14]/20 rounded-lg text-xs">
        <div className="flex items-center gap-1.5 text-slate-800">
          <Clock className="w-3.5 h-3.5 text-[#143c14] shrink-0" />
          <span className="font-semibold text-slate-700">Rentang Terpilih:</span>
          <span className="font-bold text-[#143c14]">
            {formatDateRange(startDate, endDate)}
          </span>
        </div>

        <div className="text-[11px] text-slate-500 font-medium">
          Total: <strong className="text-slate-900">{durationDays} hari</strong>
        </div>
      </div>

      {/* Synchronized Manual Inputs (Foldable or Accessible) */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Tanggal Mulai (Input Tanggal)
          </label>
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => {
              const val = e.target.value;
              onChange(val, endDate < val ? val : endDate);
              if (val) {
                setViewYear(parseInt(val.slice(0, 4), 10));
                setViewMonth(parseInt(val.slice(5, 7), 10) - 1);
              }
            }}
            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#143c14]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Tanggal Selesai (Input Tanggal)
          </label>
          <input
            type="date"
            required
            value={endDate}
            min={startDate}
            onChange={(e) => {
              const val = e.target.value;
              onChange(startDate > val ? val : startDate, val);
            }}
            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#143c14]"
          />
        </div>
      </div>
    </div>
  );
};
