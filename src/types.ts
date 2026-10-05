export type EventCategory = 'academic' | 'holiday' | 'student' | 'teacher';

export type ClassLevel = 'X' | 'XI' | 'XII';
export type ClassFilter = 'all' | 'X' | 'XI' | 'XII';

export interface AcademicEvent {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string;   // HH:mm
  category: EventCategory;
  description: string;
  location: string;
  audience: string; // e.g. 'Semua Siswa', 'Kelas X & XI', 'Dewan Guru', 'Orang Tua'
  targetClasses?: ClassLevel[]; // e.g. ['X'], ['XI'], ['XII'], or ['X', 'XI', 'XII']
  academicYear: string; // '2026/2027'
  semester: 'ganjil' | 'genap';
  isOfficialHoliday?: boolean;
  excludedDates?: string[]; // Specific dates YYYY-MM-DD where event is inactive
  excludeWeekends?: boolean; // If true, event skips Saturday and Sunday
}

export type CalendarView = 'month' | 'year' | 'week' | 'agenda';
export type SemesterFilter = 'all' | 'ganjil' | 'genap';

export interface CategoryMeta {
  id: EventCategory;
  label: string;
  shortLabel: string;
  bgLight: string;
  bgBadge: string;
  bgSolid: string;
  borderSolid: string;
  cellTint: string;
  topBar: string;
  textColor: string;
  borderColor: string;
  dotColor: string;
  printBg: string;
}
