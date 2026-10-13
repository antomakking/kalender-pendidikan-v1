import { AcademicEvent, CategoryMeta, ClassLevel, EventCategory, SemesterFilter } from '../types.ts';

export const PRIMARY_CATEGORIES: EventCategory[] = [
  'kbm',
  'assessment',
  'school',
  'student',
  'holiday',
];

export const CATEGORIES_CONFIG: Record<EventCategory, CategoryMeta> = {
  kbm: {
    id: 'kbm',
    label: 'Kegiatan Belajar Mengajar (KBM)',
    shortLabel: 'KBM',
    bgLight: 'bg-amber-50/80',
    bgBadge: 'bg-amber-100 text-amber-950 border border-amber-300 font-bold',
    bgSolid: 'bg-[#ffcc00] text-slate-950 font-bold shadow-xs hover:bg-[#eab308]',
    borderSolid: 'border-amber-500',
    cellTint: 'bg-amber-50/60 border-amber-200',
    topBar: 'bg-[#ffcc00]',
    textColor: 'text-amber-950',
    borderColor: 'border-amber-300',
    dotColor: 'bg-[#ffcc00]',
    printBg: '#ffcc00',
  },
  assessment: {
    id: 'assessment',
    label: 'Assesmen',
    shortLabel: 'Assesmen',
    bgLight: 'bg-purple-50/80',
    bgBadge: 'bg-purple-100 text-purple-950 border border-purple-300 font-bold',
    bgSolid: 'bg-purple-700 text-white font-bold shadow-xs hover:bg-purple-800',
    borderSolid: 'border-purple-800',
    cellTint: 'bg-purple-50/60 border-purple-200',
    topBar: 'bg-purple-700',
    textColor: 'text-purple-900',
    borderColor: 'border-purple-300',
    dotColor: 'bg-purple-700',
    printBg: '#7e22ce',
  },
  school: {
    id: 'school',
    label: 'Kegiatan Sekolah',
    shortLabel: 'Kegiatan Sekolah',
    bgLight: 'bg-emerald-50/80',
    bgBadge: 'bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold',
    bgSolid: 'bg-[#15803d] text-white font-bold shadow-xs hover:bg-[#166534]',
    borderSolid: 'border-emerald-700',
    cellTint: 'bg-emerald-50/60 border-emerald-200',
    topBar: 'bg-[#15803d]',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-300',
    dotColor: 'bg-[#15803d]',
    printBg: '#15803d',
  },
  student: {
    id: 'student',
    label: 'Kegiatan Siswa',
    shortLabel: 'Kegiatan Siswa',
    bgLight: 'bg-sky-50/80',
    bgBadge: 'bg-sky-100 text-sky-900 border border-sky-300 font-bold',
    bgSolid: 'bg-[#0284c7] text-white font-bold shadow-xs hover:bg-[#0369a1]',
    borderSolid: 'border-sky-700',
    cellTint: 'bg-sky-50/60 border-sky-200',
    topBar: 'bg-[#0284c7]',
    textColor: 'text-sky-800',
    borderColor: 'border-sky-300',
    dotColor: 'bg-[#0284c7]',
    printBg: '#0284c7',
  },
  holiday: {
    id: 'holiday',
    label: 'Libur',
    shortLabel: 'Libur',
    bgLight: 'bg-rose-50/80',
    bgBadge: 'bg-rose-100 text-rose-800 border border-rose-300 font-bold',
    bgSolid: 'bg-[#dc2626] text-white font-bold shadow-xs hover:bg-[#b91c1c]',
    borderSolid: 'border-rose-700',
    cellTint: 'bg-rose-50/60 border-rose-200',
    topBar: 'bg-[#dc2626]',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-300',
    dotColor: 'bg-[#dc2626]',
    printBg: '#dc2626',
  },
  academic: {
    id: 'kbm',
    label: 'Kegiatan Belajar Mengajar (KBM)',
    shortLabel: 'KBM',
    bgLight: 'bg-amber-50/80',
    bgBadge: 'bg-amber-100 text-amber-950 border border-amber-300 font-bold',
    bgSolid: 'bg-[#ffcc00] text-slate-950 font-bold shadow-xs hover:bg-[#eab308]',
    borderSolid: 'border-amber-500',
    cellTint: 'bg-amber-50/60 border-amber-200',
    topBar: 'bg-[#ffcc00]',
    textColor: 'text-amber-950',
    borderColor: 'border-amber-300',
    dotColor: 'bg-[#ffcc00]',
    printBg: '#ffcc00',
  },
  teacher: {
    id: 'school',
    label: 'Kegiatan Sekolah',
    shortLabel: 'Kegiatan Sekolah',
    bgLight: 'bg-emerald-50/80',
    bgBadge: 'bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold',
    bgSolid: 'bg-[#15803d] text-white font-bold shadow-xs hover:bg-[#166534]',
    borderSolid: 'border-emerald-700',
    cellTint: 'bg-emerald-50/60 border-emerald-200',
    topBar: 'bg-[#15803d]',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-300',
    dotColor: 'bg-[#15803d]',
    printBg: '#15803d',
  },
};

export function getEventClasses(event: AcademicEvent): ClassLevel[] {
  if (event.targetClasses && event.targetClasses.length > 0) {
    return event.targetClasses;
  }
  const text = `${event.title} ${event.audience} ${event.description}`.toUpperCase();
  const classes: ClassLevel[] = [];

  if (/\bKELAS\s*12\b|\bKELAS\s*XII\b|\bXII\b/.test(text)) {
    classes.push('XII');
  }
  if (/\bKELAS\s*11\b|\bKELAS\s*XI\b|\bXI\b/.test(text)) {
    classes.push('XI');
  }
  if (/\bKELAS\s*10\b|\bKELAS\s*X\b|\bX\b/.test(text)) {
    classes.push('X');
  }

  if (classes.length > 0) {
    const order: ClassLevel[] = ['X', 'XII', 'XII'];
    return order.filter((c) => classes.includes(c));
  }

  return ['X', 'XI', 'XII'];
}

export function getEventCategoryMeta(eventOrCategory: AcademicEvent | EventCategory | string): CategoryMeta {
  const categoryId = (typeof eventOrCategory === 'object' && eventOrCategory !== null)
    ? eventOrCategory.category
    : (eventOrCategory as EventCategory);
  if (categoryId === 'academic') return CATEGORIES_CONFIG.kbm;
  if (categoryId === 'teacher') return CATEGORIES_CONFIG.school;
  return CATEGORIES_CONFIG[categoryId] || CATEGORIES_CONFIG.kbm;
}

export const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const DAY_NAMES_ID = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export function formatIndonesianDate(dateStr: string, options?: { withDayName?: boolean; shortMonth?: boolean }): string {
  if (!dateStr) return '';
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);
  const dateObj = new Date(year, month, day);

  const dayName = DAY_NAMES_ID[dateObj.getDay()];
  const monthName = options?.shortMonth
    ? MONTH_NAMES_ID[month].slice(0, 3)
    : MONTH_NAMES_ID[month];

  if (options?.withDayName) {
    return `${dayName}, ${day} ${monthName} ${year}`;
  }
  return `${day} ${monthName} ${year}`;
}

export function formatDateRange(startDateStr: string, endDateStr: string): string {
  if (!startDateStr) return '';
  if (!endDateStr || startDateStr === endDateStr) {
    return formatIndonesianDate(startDateStr);
  }

  const [y1, m1, d1] = startDateStr.split('-').map(Number);
  const [y2, m2, d2] = endDateStr.split('-').map(Number);

  if (y1 === y2 && m1 === m2) {
    return `${d1} – ${d2} ${MONTH_NAMES_ID[m1 - 1]} ${y1}`;
  }

  if (y1 === y2) {
    return `${d1} ${MONTH_NAMES_ID[m1 - 1]} – ${d2} ${MONTH_NAMES_ID[m2 - 1]} ${y1}`;
  }

  return `${formatIndonesianDate(startDateStr)} – ${formatIndonesianDate(endDateStr)}`;
}

export const SELECTED_EXCLUDED_DATES = new Set([
  '2026-10-10',
  '2026-11-14',
  '2026-12-05',
  '2027-02-13',
  '2027-05-08',
  '2027-06-05',
]);

export function isDateInRange(
  targetDateStr: string,
  startDateStr: string,
  endDateStr: string,
  event?: AcademicEvent
): boolean {
  if (targetDateStr < startDateStr || targetDateStr > endDateStr) {
    return false;
  }

  // Check if explicitly excluded
  if (SELECTED_EXCLUDED_DATES.has(targetDateStr)) {
    return false;
  }

  if (event) {
    if (event.excludedDates && event.excludedDates.includes(targetDateStr)) {
      return false;
    }

    // Multi-day academic and teacher events (exams, KBM, assessments) do not occur on weekends (Saturday & Sunday)
    if (
      startDateStr !== endDateStr &&
      (event.category === 'kbm' ||
        event.category === 'assessment' ||
        event.category === 'school' ||
        event.category === 'academic' ||
        event.category === 'teacher' ||
        event.excludeWeekends ||
        (event.title || '').toLowerCase().includes('ujian') ||
        (event.title || '').toLowerCase().includes('sumatif') ||
        (event.title || '').toLowerCase().includes('kompetensi')) &&
      event.category !== 'holiday'
    ) {
      const [y, m, d] = targetDateStr.split('-').map(Number);
      const dayOfWeek = new Date(y, m - 1, d).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return false;
      }
    }
  }

  return true;
}

export function deduplicateEvents(eventsList: AcademicEvent[]): AcademicEvent[] {
  if (!Array.isArray(eventsList)) return [];

  const seenIds = new Set<string>();
  const seenKeys = new Set<string>();
  const result: AcademicEvent[] = [];

  for (const event of eventsList) {
    if (!event || typeof event !== 'object' || !event.title) continue;

    // Check ID uniqueness
    if (event.id && seenIds.has(event.id)) {
      continue;
    }

    // Normalize title, dates, times, and year for content deduplication
    const normTitle = (event.title || '').trim().toLowerCase().replace(/\s+/g, ' ');
    const normStart = event.startDate || '';
    const normEnd = event.endDate || normStart;
    const normStartTime = event.startTime || '';
    const normEndTime = event.endTime || '';
    const normYear = event.academicYear || '';

    const contentKey = `${normTitle}|${normStart}|${normEnd}|${normStartTime}|${normEndTime}|${normYear}`;

    if (seenKeys.has(contentKey)) {
      continue;
    }

    if (event.id) {
      seenIds.add(event.id);
    }
    seenKeys.add(contentKey);
    result.push(event);
  }

  return result;
}

export function getEventsForDate(events: AcademicEvent[], dateStr: string): AcademicEvent[] {
  const matched = events.filter(event => isDateInRange(dateStr, event.startDate, event.endDate, event));
  return deduplicateEvents(matched);
}

export function getDaysDifference(targetDateStr: string, baseDateStr: string = '2026-09-28'): number {
  const [ty, tm, td] = targetDateStr.split('-').map(Number);
  const [by, bm, bd] = baseDateStr.split('-').map(Number);
  const target = new Date(ty, tm - 1, td).getTime();
  const base = new Date(by, bm - 1, bd).getTime();
  const diffMs = target - base;
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function getRelativeTimeStatus(event: AcademicEvent, todayStr: string = '2026-09-28'): {
  status: 'ongoing' | 'today' | 'upcoming' | 'passed';
  label: string;
  badgeClass: string;
} {
  if (isDateInRange(todayStr, event.startDate, event.endDate)) {
    return {
      status: 'ongoing',
      label: 'Sedang Berlangsung Hari Ini',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold',
    };
  }

  const diff = getDaysDifference(event.startDate, todayStr);

  if (diff === 1) {
    return {
      status: 'upcoming',
      label: 'Besok',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    };
  }

  if (diff > 1 && diff <= 7) {
    return {
      status: 'upcoming',
      label: `${diff} hari lagi`,
      badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
    };
  }

  if (diff > 7) {
    return {
      status: 'upcoming',
      label: `${diff} hari lagi`,
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    };
  }

  return {
    status: 'passed',
    label: 'Telah Selesai',
    badgeClass: 'bg-slate-100 text-slate-500 border-slate-200',
  };
}

export interface CalendarDayInfo {
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSunday: boolean;
  events: AcademicEvent[];
}

export function getCalendarDaysForMonth(year: number, month: number, events: AcademicEvent[], todayStr: string = '2026-09-28'): CalendarDayInfo[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // Day of week for 1st of month: 0 (Sun / Ahad) to 6 (Sat / Sabtu)
  const startDayOfWeek = firstDayOfMonth.getDay();

  const result: CalendarDayInfo[] = [];

  // Previous month tail
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const prevDate = new Date(year, month - 1, day);
    const dateStr = formatDateToISO(prevDate);
    result.push({
      dateStr,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isSunday: prevDate.getDay() === 0,
      events: getEventsForDate(events, dateStr),
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const curDate = new Date(year, month, d);
    const dateStr = formatDateToISO(curDate);
    result.push({
      dateStr,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      isSunday: curDate.getDay() === 0,
      events: getEventsForDate(events, dateStr),
    });
  }

  // Next month head to fill grid to 35 or 42 days
  const totalSlots = result.length <= 35 ? 35 : 42;
  const remaining = totalSlots - result.length;
  for (let d = 1; d <= remaining; d++) {
    const nextDate = new Date(year, month + 1, d);
    const dateStr = formatDateToISO(nextDate);
    result.push({
      dateStr,
      dayNumber: d,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isSunday: nextDate.getDay() === 0,
      events: getEventsForDate(events, dateStr),
    });
  }

  return result;
}

export function formatDateToISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function shiftEventToDate(event: AcademicEvent, newStartDate: string): AcademicEvent {
  const [sYear, sMonth, sDay] = event.startDate.split('-').map(Number);
  const [eYear, eMonth, eDay] = event.endDate.split('-').map(Number);
  const startMs = new Date(sYear, sMonth - 1, sDay).getTime();
  const endMs = new Date(eYear, eMonth - 1, eDay).getTime();
  const durationDays = Math.max(0, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)));

  const [nYear, nMonth, nDay] = newStartDate.split('-').map(Number);
  const newEndDateObj = new Date(nYear, nMonth - 1, nDay + durationDays);
  const newEndDate = formatDateToISO(newEndDateObj);

  const semester = newStartDate >= '2027-01-01' ? 'genap' : 'ganjil';

  return {
    ...event,
    startDate: newStartDate,
    endDate: newEndDate,
    semester,
  };
}

export function getWeekDays(centerDateStr: string, events: AcademicEvent[], todayStr: string = '2026-09-28'): CalendarDayInfo[] {
  const [y, m, d] = centerDateStr.split('-').map(Number);
  const center = new Date(y, m - 1, d);
  const dayOfWeek = center.getDay(); // 0 = Ahad, 1 = Senin, ..., 6 = Sabtu

  const sunday = new Date(center);
  sunday.setDate(center.getDate() - dayOfWeek);

  const days: CalendarDayInfo[] = [];
  for (let i = 0; i < 7; i++) {
    const cur = new Date(sunday);
    cur.setDate(sunday.getDate() + i);
    const dateStr = formatDateToISO(cur);
    days.push({
      dateStr,
      dayNumber: cur.getDate(),
      isCurrentMonth: cur.getMonth() === m - 1,
      isToday: dateStr === todayStr,
      isSunday: i === 0,
      events: getEventsForDate(events, dateStr),
    });
  }
  return days;
}

/**
 * Calculates dynamic statistics based on real calendar events and semester filter
 */
export function calculateAcademicStats(
  events: AcademicEvent[],
  semester: SemesterFilter,
  academicYear: string,
  todayStr: string,
  currentYear?: number,
  currentMonth?: number
) {
  // 1. Determine semester date range
  let startYear = 2026;
  let endYear = 2027;
  const parts = academicYear.split('/');
  if (parts.length === 2) {
    startYear = parseInt(parts[0], 10) || 2026;
    endYear = parseInt(parts[1], 10) || 2027;
  }

  let rangeStart = `${startYear}-07-01`;
  let rangeEnd = `${endYear}-06-30`;

  if (semester === 'ganjil') {
    rangeStart = `${startYear}-07-01`;
    rangeEnd = `${startYear}-12-31`;
  } else if (semester === 'genap') {
    rangeStart = `${endYear}-01-01`;
    rangeEnd = `${endYear}-06-30`;
  }

  // Filter events strictly for the selected Academic Year
  const academicStartISO = `${startYear}-07-01`;
  const academicEndISO = `${endYear}-06-30`;

  const yearEvents = events.filter((e) => {
    if (e.academicYear) {
      return e.academicYear === academicYear;
    }
    return e.startDate >= academicStartISO && e.startDate <= academicEndISO;
  });

  // Filter events by semester within selected academic year
  const filteredEvents = yearEvents.filter(
    (e) => semester === 'all' || e.semester === semester
  );

  // Set of dates that have holidays within the academic year
  const holidayDateSet = new Set<string>();
  yearEvents
    .filter((e) => e.category === 'holiday')
    .forEach((e) => {
      const [sy, sm, sd] = e.startDate.split('-').map(Number);
      const [ey, em, ed] = e.endDate.split('-').map(Number);
      const cur = new Date(sy, sm - 1, sd);
      const end = new Date(ey, em - 1, ed);
      while (cur <= end) {
        holidayDateSet.add(formatDateToISO(cur));
        cur.setDate(cur.getDate() + 1);
      }
    });

  // Calculate Effective School Days (HEB) - Monday to Friday (Hari Efektif Belajar)
  let effectiveSchoolDays = 0;
  let totalWeekdays = 0;
  let totalHolidayDaysInSemester = 0;

  const [rSy, rSm, rSd] = rangeStart.split('-').map(Number);
  const [rEy, rEm, rEd] = rangeEnd.split('-').map(Number);
  const curDay = new Date(rSy, rSm - 1, rSd);
  const endDay = new Date(rEy, rEm - 1, rEd);

  while (curDay <= endDay) {
    const dStr = formatDateToISO(curDay);
    const dayOfWeek = curDay.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Mon-Fri school system
    const isHoliday = holidayDateSet.has(dStr);

    if (!isWeekend) {
      totalWeekdays++;
      if (isHoliday) {
        totalHolidayDaysInSemester++;
      } else {
        effectiveSchoolDays++;
      }
    } else if (isHoliday && dayOfWeek !== 0) {
      totalHolidayDaysInSemester++;
    }

    curDay.setDate(curDay.getDate() + 1);
  }

  // 1. Current Running Month (Bulan yang Sedang Berjalan) HEB Calculation
  const [tYearNum, tMonthNum] = (todayStr || '').split('-').map(Number);
  const realCurrentMonth = !isNaN(tMonthNum) ? tMonthNum - 1 : new Date().getMonth();
  const realCurrentYear = !isNaN(tYearNum) ? tYearNum : new Date().getFullYear();

  // Align runningYear with the selected academic year if needed
  let runningYear = realCurrentYear;
  if (academicYear.includes('/')) {
    const isFirstSemester = realCurrentMonth >= 6; // Juli - Desember (Gasal)
    runningYear = isFirstSemester ? startYear : endYear;
  }
  const runningMonth = realCurrentMonth;
  const runningDaysInMonth = new Date(runningYear, runningMonth + 1, 0).getDate();

  let runningMonthEffectiveSchoolDays = 0;
  let runningMonthTotalWeekdays = 0;
  let runningMonthHolidayDays = 0;

  for (let d = 1; d <= runningDaysInMonth; d++) {
    const cur = new Date(runningYear, runningMonth, d);
    const dStr = formatDateToISO(cur);
    const dayOfWeek = cur.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = holidayDateSet.has(dStr);

    if (!isWeekend) {
      runningMonthTotalWeekdays++;
      if (isHoliday) {
        runningMonthHolidayDays++;
      } else {
        runningMonthEffectiveSchoolDays++;
      }
    } else if (isHoliday && dayOfWeek !== 0) {
      runningMonthHolidayDays++;
    }
  }

  const runningMonthName = MONTH_NAMES_ID[runningMonth] || 'Bulan Berjalan';

  // 2. Selected Month HEB Calculation (for active view)
  let monthlyEffectiveSchoolDays = 0;
  let monthlyTotalWeekdays = 0;
  let monthlyHolidayDays = 0;

  const targetYear = currentYear ?? runningYear;
  const targetMonth = currentMonth ?? runningMonth;
  const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const cur = new Date(targetYear, targetMonth, d);
    const dStr = formatDateToISO(cur);
    const dayOfWeek = cur.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = holidayDateSet.has(dStr);

    if (!isWeekend) {
      monthlyTotalWeekdays++;
      if (isHoliday) {
        monthlyHolidayDays++;
      } else {
        monthlyEffectiveSchoolDays++;
      }
    } else if (isHoliday && dayOfWeek !== 0) {
      monthlyHolidayDays++;
    }
  }

  const selectedMonthName = MONTH_NAMES_ID[targetMonth] || 'Bulan Dipilih';

  // 3. Real Academic / Learning Events
  const academicEventsCount = filteredEvents.filter(
    (e) => e.category === 'kbm' || e.category === 'assessment' || e.category === 'academic'
  ).length;
  const totalEventsCount = filteredEvents.length;

  // 4. Real 14 Days Ahead Events (within the selected Academic Year)
  const [ty, tm, td] = todayStr.split('-').map(Number);
  const todayDate = new Date(ty, tm - 1, td);
  const fourteenDaysLaterDate = new Date(todayDate);
  fourteenDaysLaterDate.setDate(todayDate.getDate() + 14);
  const fourteenDaysLaterStr = formatDateToISO(fourteenDaysLaterDate);

  const upcoming14DaysEvents = yearEvents.filter((e) => {
    return e.endDate >= todayStr && e.startDate <= fourteenDaysLaterStr;
  });

  // 5. Real Holiday Events Count & Total Holiday Days
  const holidayEventsCount = filteredEvents.filter((e) => e.category === 'holiday').length;

  return {
    effectiveSchoolDays,
    totalWeekdays,
    totalHolidayDaysInSemester,
    monthlyEffectiveSchoolDays,
    monthlyTotalWeekdays,
    monthlyHolidayDays,
    selectedMonthName,
    targetYear,
    targetMonth,
    runningMonth,
    runningYear,
    runningMonthName,
    runningMonthEffectiveSchoolDays,
    runningMonthTotalWeekdays,
    runningMonthHolidayDays,
    academicEventsCount,
    totalEventsCount,
    upcoming14DaysCount: upcoming14DaysEvents.length,
    upcoming14DaysEvents,
    holidayEventsCount,
    rangeStart,
    rangeEnd,
  };
}

export function getGoogleCalendarUrl(event: AcademicEvent): string {
  const sDate = event.startDate.replace(/-/g, '');
  const [ey, em, ed] = event.endDate.split('-').map(Number);
  const nextDay = new Date(ey, em - 1, ed + 1);
  const eDate = formatDateToISO(nextDay).replace(/-/g, '');

  const details = encodeURIComponent(
    `${event.description}\n\nPeserta: ${event.audience}\nLokasi: ${event.location}\nSMK IT Ibnul Qayyim Makassar`
  );
  const title = encodeURIComponent(event.title);
  const loc = encodeURIComponent(event.location);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${sDate}/${eDate}&details=${details}&location=${loc}`;
}

export function generateICalFile(events: AcademicEvent[], customFilename?: string): void {
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SMK IT Ibnul Qayyim Makassar//Kalender Akademik//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Kalender Akademik SMK IT Ibnul Qayyim Makassar',
    'X-WR-TIMEZONE:Asia/Makassar',
  ];

  events.forEach(event => {
    const sDate = event.startDate.replace(/-/g, '');
    // For all-day events, iCal DTEND is exclusive so add 1 day or keep same
    const [ey, em, ed] = event.endDate.split('-').map(Number);
    const endDateExclusive = new Date(ey, em - 1, ed + 1);
    const eDate = formatDateToISO(endDateExclusive).replace(/-/g, '');

    icsContent.push('BEGIN:VEVENT');
    icsContent.push(`UID:${event.id}@smkitibnulqayyim.sch.id`);
    icsContent.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
    icsContent.push(`DTSTART;VALUE=DATE:${sDate}`);
    icsContent.push(`DTEND;VALUE=DATE:${eDate}`);
    icsContent.push(`SUMMARY:${event.title}`);
    icsContent.push(`DESCRIPTION:${event.description.replace(/\n/g, '\\n')} (Peserta: ${event.audience})`);
    icsContent.push(`LOCATION:${event.location}`);
    icsContent.push(`CATEGORIES:${event.category.toUpperCase()}`);
    icsContent.push('STATUS:CONFIRMED');
    icsContent.push('END:VEVENT');
  });

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = customFilename || `Kalender-Akademik-SMK-IT-Ibnul-Qayyim.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface GenerateRecurringDatesParams {
  startDateStr: string;
  endDateStr: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  selectedDaysOfWeek?: number[]; // [1, 2, 3, 4, 5] (0=Ahad, 1=Senin, ..., 6=Sabtu)
  endType: 'occurrences' | 'until_date' | 'semester_end';
  occurrencesCount: number;
  untilDateStr?: string;
  academicYear?: string;
}

export function generateRecurringEventDates(params: GenerateRecurringDatesParams): Array<{ startDate: string; endDate: string }> {
  const {
    startDateStr,
    endDateStr,
    frequency,
    selectedDaysOfWeek = [],
    endType,
    occurrencesCount,
    untilDateStr,
    academicYear = '2026/2027',
  } = params;

  const [sY, sM, sD] = startDateStr.split('-').map(Number);
  const [eY, eM, eD] = endDateStr.split('-').map(Number);
  const startDate = new Date(sY, sM - 1, sD);
  const endDate = new Date(eY, eM - 1, eD);
  const durationMs = Math.max(0, endDate.getTime() - startDate.getTime());
  const durationDays = Math.round(durationMs / (1000 * 60 * 60 * 24));

  // Determine limit date
  let maxDate = new Date(startDate);
  if (endType === 'until_date' && untilDateStr) {
    const [uY, uM, uD] = untilDateStr.split('-').map(Number);
    maxDate = new Date(uY, uM - 1, uD);
  } else if (endType === 'semester_end') {
    const startYear = parseInt(academicYear.split('/')[0], 10) || 2026;
    const endYear = parseInt(academicYear.split('/')[1], 10) || startYear + 1;
    if (startDateStr >= `${startYear}-07-01` && startDateStr <= `${startYear}-12-31`) {
      maxDate = new Date(startYear, 11, 31);
    } else {
      maxDate = new Date(endYear, 5, 30);
    }
  } else {
    maxDate.setFullYear(maxDate.getFullYear() + 2);
  }

  const results: Array<{ startDate: string; endDate: string }> = [];
  const maxLimit = endType === 'occurrences' ? Math.max(1, occurrencesCount) : 52; // max cap

  if (frequency === 'daily') {
    const cur = new Date(startDate);
    while (results.length < maxLimit && cur <= maxDate) {
      const dayOfWeek = cur.getDay();
      const isAllowed = selectedDaysOfWeek.length === 0 || selectedDaysOfWeek.includes(dayOfWeek);
      if (isAllowed) {
        const curStart = formatDateToISO(cur);
        const curEndObj = new Date(cur);
        curEndObj.setDate(curEndObj.getDate() + durationDays);
        results.push({
          startDate: curStart,
          endDate: formatDateToISO(curEndObj),
        });
      }
      cur.setDate(cur.getDate() + 1);
    }
  } else if (frequency === 'weekly') {
    if (selectedDaysOfWeek.length > 0) {
      const cur = new Date(startDate);
      while (results.length < maxLimit && cur <= maxDate) {
        const dayOfWeek = cur.getDay();
        if (selectedDaysOfWeek.includes(dayOfWeek) && cur >= startDate) {
          const curStart = formatDateToISO(cur);
          const curEndObj = new Date(cur);
          curEndObj.setDate(curEndObj.getDate() + durationDays);
          results.push({
            startDate: curStart,
            endDate: formatDateToISO(curEndObj),
          });
        }
        cur.setDate(cur.getDate() + 1);
      }
    } else {
      for (let i = 0; i < maxLimit; i++) {
        const cur = new Date(startDate);
        cur.setDate(cur.getDate() + i * 7);
        if (cur > maxDate) break;
        const curStart = formatDateToISO(cur);
        const curEndObj = new Date(cur);
        curEndObj.setDate(curEndObj.getDate() + durationDays);
        results.push({
          startDate: curStart,
          endDate: formatDateToISO(curEndObj),
        });
      }
    }
  } else if (frequency === 'biweekly') {
    for (let i = 0; i < maxLimit; i++) {
      const cur = new Date(startDate);
      cur.setDate(cur.getDate() + i * 14);
      if (cur > maxDate) break;
      const curStart = formatDateToISO(cur);
      const curEndObj = new Date(cur);
      curEndObj.setDate(curEndObj.getDate() + durationDays);
      results.push({
        startDate: curStart,
        endDate: formatDateToISO(curEndObj),
      });
    }
  } else if (frequency === 'monthly') {
    const targetDayOfMonth = startDate.getDate();
    for (let i = 0; i < maxLimit; i++) {
      const cur = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const daysInThisMonth = new Date(cur.getFullYear(), cur.getMonth() + 1, 0).getDate();
      const actualDay = Math.min(targetDayOfMonth, daysInThisMonth);
      cur.setDate(actualDay);
      if (cur > maxDate) break;
      const curStart = formatDateToISO(cur);
      const curEndObj = new Date(cur);
      curEndObj.setDate(curEndObj.getDate() + durationDays);
      results.push({
        startDate: curStart,
        endDate: formatDateToISO(curEndObj),
      });
    }
  }

  if (results.length === 0) {
    results.push({
      startDate: startDateStr,
      endDate: endDateStr,
    });
  }

  return results;
}
