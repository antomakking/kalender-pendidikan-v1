import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';
import { AgendaView } from './components/AgendaView.tsx';
import { ControlsBar } from './components/ControlsBar.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { EventDetailModal } from './components/EventDetailModal.tsx';
import { EventFormModal } from './components/EventFormModal.tsx';
import { ExportICalModal } from './components/ExportICalModal.tsx';
import { Header } from './components/Header.tsx';
import { HebMatrixModal } from './components/HebMatrixModal.tsx';
import { NotificationModal } from './components/NotificationModal.tsx';
import { useEventNotifications } from './hooks/useEventNotifications.ts';
import { MonthView } from './components/MonthView.tsx';
import { OfflineIndicator } from './components/OfflineIndicator.tsx';
import { PinModal } from './components/PinModal.tsx';
import { PrintModal } from './components/PrintModal.tsx';
import { StandaloneExportModal } from './components/StandaloneExportModal.tsx';
import { StatsBanner } from './components/StatsBanner.tsx';
import { UpcomingSidebar } from './components/UpcomingSidebar.tsx';
import { WeekView } from './components/WeekView.tsx';
import { YearView } from './components/YearView.tsx';
import { EmptyState } from './components/EmptyState.tsx';
import { INITIAL_EVENTS } from './data/seedEvents.ts';
import { AcademicEvent, CalendarView, ClassFilter, ClassLevel, EventCategory, SemesterFilter } from './types.ts';
import {
  CATEGORIES_CONFIG,
  deduplicateEvents,
  formatDateRange,
  formatDateToISO,
  formatIndonesianDate,
  generateICalFile,
  getEventClasses,
  shiftEventToDate,
} from './utils/calendarUtils.ts';
import {
  getRemainingSessionSeconds,
  isSessionUnlocked,
  setSessionUnlocked,
} from './utils/securityUtils.ts';

const STORAGE_KEY = 'smk_it_kalender_events_full_2526_2627_v17';
const TODAY_STR = formatDateToISO(new Date());

const VIEW_ORDER: Record<CalendarView, number> = {
  year: 0,
  month: 1,
  week: 2,
  agenda: 3,
  dashboard: 4,
};

interface ToastState {
  id: number;
  message: string;
  onUndo?: () => void;
}

export default function App() {
  // 1. Data State with LocalStorage Persistence
  const [events, setEvents] = useState<AcademicEvent[]>(() => {
    try {
      // Purge legacy storage from previous revisions
      localStorage.removeItem('smk_it_kalender_events');
      localStorage.removeItem('smk_it_kalender_events_v2');
      localStorage.removeItem('smk_it_kalender_events_real_v1');
      localStorage.removeItem('smk_it_kalender_events_real_v2');
      localStorage.removeItem('smk_it_kalender_events_real_v3');
      localStorage.removeItem('smk_it_kalender_events_full_v4');
      localStorage.removeItem('smk_it_kalender_events_full_2627_v5');
      localStorage.removeItem('smk_it_kalender_events_full_2526_2627_v8');
      localStorage.removeItem('smk_it_kalender_events_full_2526_2627_v9');
      localStorage.removeItem('smk_it_kalender_events_full_2526_2627_v10');
      localStorage.removeItem('smk_it_kalender_events_full_2526_2627_v11');
      localStorage.removeItem('smk_it_kalender_events_full_2526_2627_v12');
      localStorage.removeItem('smk_it_kalender_events_full_2526_2627_v13');
      localStorage.removeItem('smk_it_kalender_events_full_2526_2627_v14');
      localStorage.removeItem('smk_it_kalender_events_full_2526_2627_v15');
      localStorage.removeItem('smk_it_kalender_events_full_2526_2627_v16');

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Remove old separate Tasmi' event if present & sanitize SAS/TKA/Ujian Sekolah Categories
          const sanitized = parsed
            .filter((e: AcademicEvent) => e.id !== 'evt-2627-1001')
            .map((e: AcademicEvent) => {
              let updated = { ...e };
              const titleLower = (updated.title || '').toLowerCase();

              // Remap category to 'assessment' for exam activities
              if (
                titleLower.includes('tasmi') ||
                titleLower.includes('sumatif') ||
                titleLower.includes('tes kompetensi akademik') ||
                titleLower.includes('tka') ||
                titleLower.includes('ujian sekolah') ||
                titleLower.includes('ujian tahfizh')
              ) {
                updated.category = 'assessment';
              }

              if (updated.id === 'evt-2627-0902' || (updated.title && titleLower.includes('ujian tasmi') && updated.startDate === '2026-09-28')) {
                updated.startDate = '2026-09-28';
                updated.endDate = '2026-10-16';
                updated.description = "Pelaksanaan Ujian Tasmi' hafalan Al-Qur'an sekali duduk bagi santri kelas XII (28 September – 16 Oktober 2026).";
                updated.targetClasses = ['XII' as ClassLevel];
              }
              if (updated.id === 'evt-2627-1002' || (updated.title && updated.title === 'Sumatif Akhir Semester' && updated.startDate === '2026-10-19')) {
                updated.audience = 'Siswa Kelas XII';
                updated.targetClasses = ['XII' as ClassLevel];
                updated.description = 'Pelaksanaan Sumatif Akhir Semester (SAS) Ganjil bagi siswa Kelas XII.';
              }
              if (updated.id === 'evt-2627-1104' || titleLower.includes('kls 11 dan 12') || (updated.startDate === '2026-11-23' && titleLower.includes('sumatif'))) {
                updated.title = 'Sumatif Akhir Semester';
                updated.audience = 'Siswa Kelas X & XI';
                updated.targetClasses = ['X' as ClassLevel, 'XI' as ClassLevel];
                updated.description = 'Asesmen Sumatif Akhir Semester (SAS) Ganjil bagi siswa Kelas X dan XI.';
                updated.category = 'assessment';
              }
              if (titleLower.includes('tes kompetensi akademik') || titleLower.includes('tka') || titleLower.includes('ujian sekolah')) {
                updated.audience = 'Siswa Kelas XII';
                updated.targetClasses = ['XII' as ClassLevel];
              }
              if (titleLower.includes('pesantren ramadhan') || titleLower.includes('pesantren kilat')) {
                updated.audience = 'Seluruh Murid kelas X dan XI';
                updated.targetClasses = ['X' as ClassLevel, 'XI' as ClassLevel];
              }

              // School activities start from 07:00 WITA (PKL adjusts with industry partners)
              const isPKL = titleLower.includes('pkl') || titleLower.includes('praktik kerja lapangan');
              const isHoliday = updated.category === 'holiday' || updated.isOfficialHoliday;

              if (isPKL) {
                if (updated.id === 'evt-2627-pkl-xii' || updated.id === 'kaldik-2526-pkl') {
                  updated.audience = 'Siswa Kelas XII (Menyesuaikan Mitra Industri)';
                }
              } else if (!isHoliday && updated.startTime && updated.startTime !== '00:00') {
                updated.startTime = '07:00';
              }

              return updated;
            });

          const existingIds = new Set(sanitized.map((e: AcademicEvent) => e.id));
          const missingSeedEvents = INITIAL_EVENTS.filter((e) => !existingIds.has(e.id));
          const combinedEvents = [...sanitized, ...missingSeedEvents];
          // Filter out any P5 items & deduplicate
          return deduplicateEvents(
            combinedEvents.filter(
              (e: AcademicEvent) =>
                e &&
                typeof e === 'object' &&
                typeof e.title === 'string' &&
                !e.title.toLowerCase().includes('p5') &&
                !(typeof e.description === 'string' && e.description.toLowerCase().includes('p5'))
            )
          );
        }
      }
    } catch (e) {
      console.error('Failed to load events from storage', e);
    }
    return deduplicateEvents(
      INITIAL_EVENTS.filter(
        (e) =>
          e &&
          typeof e.title === 'string' &&
          !e.title.toLowerCase().includes('p5') &&
          !(typeof e.description === 'string' && e.description.toLowerCase().includes('p5'))
      )
    );
  });

  // Dark Mode State & Effect (Default to light mode when opening for the first time)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('smk_it_kalender_theme');
      if (saved !== null) {
        return saved === 'dark';
      }
      return false;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('smk_it_kalender_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('smk_it_kalender_theme', 'light');
      }
    } catch (e) {
      console.error('Failed to update theme mode', e);
    }
  }, [isDarkMode]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to persist events to storage', e);
    }
  }, [events]);

  // 2. View & Navigation State (Default to Current Running Period & Year View)
  const [currentView, setCurrentView] = useState<CalendarView>('year');
  const [viewDirection, setViewDirection] = useState<number>(1);
  const [academicYear, setAcademicYear] = useState<string>(() => {
    const now = new Date();
    const curY = now.getFullYear();
    const curM = now.getMonth();
    const computed = curM >= 6 ? `${curY}/${curY + 1}` : `${curY - 1}/${curY}`;
    return computed === '2025/2026' ? '2026/2027' : computed;
  });
  const [currentYear, setCurrentYear] = useState<number>(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(() => new Date().getMonth());
  const [semester, setSemester] = useState<SemesterFilter>('all');
  const [classFilter, setClassFilter] = useState<ClassFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 3. Modals State
  const [selectedEvent, setSelectedEvent] = useState<AcademicEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<AcademicEvent | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [defaultFormDate, setDefaultFormDate] = useState<string>(TODAY_STR);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isStandaloneModalOpen, setIsStandaloneModalOpen] = useState<boolean>(false);
  const [isHebMatrixOpen, setIsHebMatrixOpen] = useState<boolean>(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);

  // 4. Browser H-1 Event Notification System Hook
  const {
    permission: notificationPermission,
    requestPermission,
    tomorrowEvents,
    sendTestNotification,
  } = useEventNotifications({
    events,
    todayStr: TODAY_STR,
    onSelectEvent: (evt) => setSelectedEvent(evt),
  });

  // 4. Security & PIN Authentication State (15-Minute Periodic Expiration)
  const [isManagerUnlocked, setIsManagerUnlocked] = useState<boolean>(() => isSessionUnlocked());
  const [sessionRemainingSeconds, setSessionRemainingSeconds] = useState<number>(() =>
    isSessionUnlocked() ? getRemainingSessionSeconds() : 0
  );
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [pinActionTitle, setPinActionTitle] = useState<string>('Tambah / Kelola Agenda');
  const [pendingProtectedAction, setPendingProtectedAction] = useState<(() => void) | null>(null);

  // 5. Toast Notification State for Feedback
  const [toast, setToast] = useState<ToastState | null>(null);

  // 15-Minute Periodic Session Auto-Logout Timer
  useEffect(() => {
    if (!isManagerUnlocked) {
      setSessionRemainingSeconds(0);
      return;
    }

    // Immediately set current remaining seconds
    setSessionRemainingSeconds(getRemainingSessionSeconds());

    const interval = setInterval(() => {
      const remaining = getRemainingSessionSeconds();
      setSessionRemainingSeconds(remaining);

      if (remaining <= 0) {
        setSessionUnlocked(false);
        setIsManagerUnlocked(false);
        setToast({
          id: Date.now(),
          message: 'Sesi pengelola telah berakhir otomatis (15 menit). Diperlukan PIN untuk menambah atau mengedit agenda.',
        });
        setTimeout(() => setToast(null), 4500);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isManagerUnlocked]);

  // Protected Action Executor (Requires PIN if not unlocked)
  const executeWithPinProtection = (action: () => void, title: string) => {
    if (isSessionUnlocked()) {
      setIsManagerUnlocked(true);
      action();
    } else {
      setIsManagerUnlocked(false);
      setPinActionTitle(title);
      setPendingProtectedAction(() => action);
      setIsPinModalOpen(true);
    }
  };

  const handlePinSuccess = () => {
    setSessionUnlocked(true);
    setIsManagerUnlocked(true);
    setSessionRemainingSeconds(getRemainingSessionSeconds());
    setIsPinModalOpen(false);

    if (pendingProtectedAction) {
      pendingProtectedAction();
      setPendingProtectedAction(null);
    }

    setToast({
      id: Date.now(),
      message: 'Otorisasi berhasil. Mode pengelola aktif selama 15 menit.',
    });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLockSession = () => {
    setSessionUnlocked(false);
    setIsManagerUnlocked(false);
    setSessionRemainingSeconds(0);
    setToast({
      id: Date.now(),
      message: 'Sesi pengelola dikunci. Diperlukan PIN untuk menambah atau mengubah agenda.',
    });
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenPinSettings = () => {
    setPinActionTitle('Pengaturan & Akses PIN Pengelola');
    setPendingProtectedAction(null);
    setIsPinModalOpen(true);
  };

  // 6. Filtering Logic (Dynamically filtered by Academic Year, Semester, Class, and Category)
  const filteredEvents = useMemo(() => {
    const [startYearStr, endYearStr] = academicYear.split('/');
    const startYear = parseInt(startYearStr, 10) || 2025;
    const endYear = parseInt(endYearStr, 10) || startYear + 1;
    const academicStartISO = `${startYear}-07-01`;
    const academicEndISO = `${endYear}-06-30`;

    return deduplicateEvents(
      events.filter((evt) => {
        // Academic Year Filter
        const matchYear = evt.academicYear
          ? evt.academicYear === academicYear
          : evt.startDate >= academicStartISO && evt.startDate <= academicEndISO;
        if (!matchYear) return false;

        // Semester filter
        if (semester !== 'all' && evt.semester !== semester) return false;

        // Class Level filter (Kelas X, XI, XII)
        if (classFilter !== 'all') {
          const eventClasses = getEventClasses(evt);
          if (!eventClasses.includes(classFilter)) return false;
        }

        // Category filter
        if (categoryFilter !== 'all') {
          if (categoryFilter === 'kbm' && evt.category !== 'kbm' && evt.category !== 'academic') return false;
          if (categoryFilter === 'school' && evt.category !== 'school' && evt.category !== 'teacher') return false;
          if (categoryFilter !== 'kbm' && categoryFilter !== 'school' && evt.category !== categoryFilter) return false;
        }

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = (evt.title || '').toLowerCase().includes(q);
          const matchDesc = (evt.description || '').toLowerCase().includes(q);
          const matchLoc = (evt.location || '').toLowerCase().includes(q);
          const matchAud = (evt.audience || '').toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchLoc && !matchAud) return false;
        }

        return true;
      })
    );
  }, [events, academicYear, semester, classFilter, categoryFilter, searchQuery]);

  // Event counts for category & class buttons (strictly scoped to selected academic year)
  const eventsCountByCategory = useMemo(() => {
    const [startYearStr, endYearStr] = academicYear.split('/');
    const startYear = parseInt(startYearStr, 10) || 2025;
    const endYear = parseInt(endYearStr, 10) || startYear + 1;
    const academicStartISO = `${startYear}-07-01`;
    const academicEndISO = `${endYear}-06-30`;

    const baseList = events.filter((e) => {
      const matchYear = e.academicYear
        ? e.academicYear === academicYear
        : e.startDate >= academicStartISO && e.startDate <= academicEndISO;
      
      const matchSemester = semester === 'all' || e.semester === semester;
      const matchClass = classFilter === 'all' || getEventClasses(e).includes(classFilter);
      return matchYear && matchSemester && matchClass;
    });

    return {
      all: baseList.length,
      kbm: baseList.filter((e) => e.category === 'kbm' || e.category === 'academic').length,
      assessment: baseList.filter((e) => e.category === 'assessment').length,
      school: baseList.filter((e) => e.category === 'school' || e.category === 'teacher').length,
      student: baseList.filter((e) => e.category === 'student').length,
      holiday: baseList.filter((e) => e.category === 'holiday').length,
      academic: baseList.filter((e) => e.category === 'academic').length,
      teacher: baseList.filter((e) => e.category === 'teacher').length,
    };
  }, [events, academicYear, semester, classFilter]);

  const eventsCountByClass = useMemo(() => {
    const [startYearStr, endYearStr] = academicYear.split('/');
    const startYear = parseInt(startYearStr, 10) || 2025;
    const endYear = parseInt(endYearStr, 10) || startYear + 1;
    const academicStartISO = `${startYear}-07-01`;
    const academicEndISO = `${endYear}-06-30`;

    const baseList = events.filter((e) => {
      const matchYear = e.academicYear
        ? e.academicYear === academicYear
        : e.startDate >= academicStartISO && e.startDate <= academicEndISO;
      return matchYear && (semester === 'all' || e.semester === semester);
    });

    return {
      all: baseList.length,
      X: baseList.filter((e) => getEventClasses(e).includes('X')).length,
      XI: baseList.filter((e) => getEventClasses(e).includes('XI')).length,
      XII: baseList.filter((e) => getEventClasses(e).includes('XII')).length,
    };
  }, [events, academicYear, semester]);

  // 7. Navigation Handlers
  const handleNavigateMonth = (delta: number) => {
    setViewDirection(delta >= 0 ? 1 : -1);
    if (currentView === 'month' || currentView === 'week') {
      let nextMonth = currentMonth + delta;
      let nextYear = currentYear;
      if (nextMonth > 11) {
        nextMonth = 0;
        nextYear += 1;
      } else if (nextMonth < 0) {
        nextMonth = 11;
        nextYear -= 1;
      }
      setCurrentMonth(nextMonth);
      setCurrentYear(nextYear);
    } else if (currentView === 'year') {
      const [startYearStr] = academicYear.split('/');
      const currentStart = parseInt(startYearStr, 10) || 2025;
      const targetStart = currentStart + delta;
      handleChangeAcademicYear(`${targetStart}/${targetStart + 1}`);
    }
  };

  const handleGoToToday = () => {
    const now = new Date();
    const curY = now.getFullYear();
    const curM = now.getMonth();
    setCurrentYear(curY);
    setCurrentMonth(curM);
    const targetTA = curM >= 6 ? `${curY}/${curY + 1}` : `${curY - 1}/${curY}`;
    setAcademicYear(targetTA);
  };

  const handleChangeAcademicYear = (newYear: string) => {
    setAcademicYear(newYear);
    const startYear = parseInt(newYear.split('/')[0], 10);
    if (!isNaN(startYear)) {
      const now = new Date();
      const nowYear = now.getFullYear();
      const nowMonth = now.getMonth();
      const nowTA = nowMonth >= 6 ? `${nowYear}/${nowYear + 1}` : `${nowYear - 1}/${nowYear}`;

      if (newYear === nowTA) {
        setCurrentYear(nowYear);
        setCurrentMonth(nowMonth);
      } else {
        setCurrentYear(startYear);
        setCurrentMonth(6); // Juli (Bulan Awal Semester Gasal)
      }
    }
  };

  const handleViewChange = (newView: CalendarView) => {
    if (newView === currentView) return;
    const prevIdx = VIEW_ORDER[currentView] ?? 0;
    const newIdx = VIEW_ORDER[newView] ?? 0;
    setViewDirection(newIdx >= prevIdx ? 1 : -1);
    setCurrentView(newView);
  };

  const handleJumpToMonth = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
    const prevIdx = VIEW_ORDER[currentView] ?? 0;
    const newIdx = VIEW_ORDER.month;
    setViewDirection(newIdx >= prevIdx ? 1 : -1);
    setCurrentView('month');
  };

  // 8. Drag-and-Drop Reschedule Handler (Protected by PIN)
  const handleRescheduleEvent = (eventId: string, newStartDate: string) => {
    executeWithPinProtection(() => {
      const eventToMove = events.find((e) => e.id === eventId);
      if (!eventToMove || eventToMove.startDate === newStartDate) return;

      const previousEvent = { ...eventToMove };
      const updatedEvent = shiftEventToDate(eventToMove, newStartDate);

      setEvents((prev) => prev.map((e) => (e.id === eventId ? updatedEvent : e)));

      // Trigger visual toast with undo
      const newToastId = Date.now();
      setToast({
        id: newToastId,
        message: `Agenda "${eventToMove.title}" berhasil dipindahkan ke ${formatIndonesianDate(
          newStartDate,
          { withDayName: true, shortMonth: true }
        )}`,
        onUndo: () => {
          setEvents((prev) => prev.map((e) => (e.id === eventId ? previousEvent : e)));
          setToast(null);
        },
      });

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        setToast((curr) => (curr?.id === newToastId ? null : curr));
      }, 4500);
    }, 'Pindahkan Jadwal Agenda');
  };

  // 9. Data Modification Handlers
  const handleSaveEvent = (savedEvent: AcademicEvent | AcademicEvent[]) => {
    const newItems = Array.isArray(savedEvent) ? savedEvent : [savedEvent];
    setEvents((prev) => {
      let updated = [...prev];
      for (const item of newItems) {
        const existsIndex = updated.findIndex((e) => e.id === item.id);
        if (existsIndex >= 0) {
          updated[existsIndex] = item;
        } else {
          updated = [item, ...updated];
        }
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to update storage after save:', err);
      }
      return updated;
    });
    setEditingEvent(null);
    const count = newItems.length;
    setToast({
      id: Date.now(),
      message:
        count > 1
          ? `Sebanyak ${count} sesi agenda berulang "${newItems[0].title}" berhasil disimpan ke kalender.`
          : `Agenda "${newItems[0].title}" berhasil disimpan ke kalender.`,
    });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteEvent = (id: string, deleteSeries = false) => {
    executeWithPinProtection(() => {
      const eventToDelete = events.find((e) => e.id === id);
      if (!eventToDelete) return;

      setEvents((prev) => {
        let updated: AcademicEvent[];
        if (deleteSeries && eventToDelete.recurrenceId) {
          updated = prev.filter((e) => e.recurrenceId !== eventToDelete.recurrenceId);
        } else {
          updated = prev.filter((e) => e.id !== id);
        }
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (err) {
          console.error('Failed to update storage after deletion:', err);
        }
        return updated;
      });

      setSelectedEvent(null);
      setToast({
        id: Date.now(),
        message:
          deleteSeries && eventToDelete.recurrenceId
            ? `Seluruh seri agenda berulang "${eventToDelete.title}" berhasil dihapus.`
            : `Agenda "${eventToDelete.title}" berhasil dihapus.`,
      });
      setTimeout(() => setToast(null), 3000);
    }, 'Hapus Agenda (Mode Admin)');
  };

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  const confirmResetData = () => {
    setEvents([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    setIsResetConfirmOpen(false);
    setToast({
      id: Date.now(),
      message: 'Seluruh kegiatan berhasil dikosongkan. Siap untuk input agenda riil sekolah.',
    });
    setTimeout(() => setToast(null), 3000);
  };

  const handleResetData = () => {
    executeWithPinProtection(() => {
      setIsResetConfirmOpen(true);
    }, 'Kosongkan Seluruh Agenda');
  };

  // 10. Modal Triggers (Protected by PIN)
  const handleOpenAddEvent = (presetDate?: string) => {
    executeWithPinProtection(() => {
      setEditingEvent(null);
      setDefaultFormDate(presetDate || TODAY_STR);
      setIsFormModalOpen(true);
    }, 'Tambah Agenda Akademik');
  };

  const handleEditEventFromDetail = (event: AcademicEvent) => {
    executeWithPinProtection(() => {
      setSelectedEvent(null);
      setEditingEvent(event);
      setDefaultFormDate(event.startDate);
      setIsFormModalOpen(true);
    }, `Edit Agenda: ${event.title}`);
  };

  const handleOpenStandaloneExport = () => {
    executeWithPinProtection(() => {
      setIsStandaloneModalOpen(true);
    }, 'Unduh Berkas Standalone index.html (Hostinger)');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-200 selection:text-emerald-900 transition-colors duration-200">
      {/* Header */}
      <Header
        academicYear={academicYear}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        onAddEvent={() => handleOpenAddEvent()}
        onOpenPrint={() => setIsPrintModalOpen(true)}
        onOpenStandaloneExport={handleOpenStandaloneExport}
        onExportICal={() => setIsExportModalOpen(true)}
        onOpenNotificationModal={() => setIsNotificationModalOpen(true)}
        tomorrowEventsCount={tomorrowEvents.length}
        isManagerUnlocked={isManagerUnlocked}
        remainingSeconds={sessionRemainingSeconds}
        onLockSession={handleLockSession}
        onOpenPinSettings={handleOpenPinSettings}
      />

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-3.5 sm:py-6 flex-1 w-full space-y-4 sm:space-y-6">
        {/* Quick Stats & Institutional Hero */}
        <StatsBanner
          events={events}
          academicYear={academicYear}
          semester={semester}
          todayStr={TODAY_STR}
          currentYear={currentYear}
          currentMonth={currentMonth}
          onResetData={handleResetData}
        />

        {/* Filter & View Switcher Bar */}
        <ControlsBar
          currentView={currentView}
          onChangeView={handleViewChange}
          currentYear={currentYear}
          currentMonth={currentMonth}
          onNavigateMonth={handleNavigateMonth}
          onGoToToday={handleGoToToday}
          academicYear={academicYear}
          onChangeAcademicYear={handleChangeAcademicYear}
          semester={semester}
          onChangeSemester={setSemester}
          classFilter={classFilter}
          onChangeClassFilter={setClassFilter}
          categoryFilter={categoryFilter}
          onChangeCategoryFilter={setCategoryFilter}
          searchQuery={searchQuery}
          onChangeSearchQuery={setSearchQuery}
          eventsCountByCategory={eventsCountByCategory}
          eventsCountByClass={eventsCountByClass}
          onOpenExportICal={() => setIsExportModalOpen(true)}
          onOpenHebMatrix={() => setIsHebMatrixOpen(true)}
        />

        {/* Calendar Grid & Sidebar Columns or Full-Width Dashboard */}
        {currentView === 'dashboard' ? (
          <DashboardView
            events={events}
            academicYear={academicYear}
            semester={semester}
            classFilter={classFilter}
            onSelectEvent={(evt) => setSelectedEvent(evt)}
            onChangeSemester={(sem) => setSemester(sem)}
            onChangeClassFilter={(cls) => setClassFilter(cls)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Main Calendar View Area */}
            <section className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-colors">
              {filteredEvents.length === 0 ? (
                <div className="p-6 sm:p-12">
                  <EmptyState
                    type={searchQuery ? 'search' : 'filter'}
                    query={searchQuery}
                    categoryLabel={
                      categoryFilter !== 'all'
                        ? CATEGORIES_CONFIG[categoryFilter]?.label
                        : undefined
                    }
                    onResetFilters={() => {
                      setSearchQuery('');
                      setCategoryFilter('all');
                      setSemester('all');
                      setClassFilter('all');
                    }}
                    onAddEvent={() => handleOpenAddEvent()}
                  />
                </div>
              ) : (
                <div className="relative overflow-visible w-full">
                  <AnimatePresence mode="wait" custom={viewDirection} initial={false}>
                    <motion.div
                      key={`${currentView}-${currentYear}-${currentMonth}-${academicYear}`}
                      custom={viewDirection}
                      variants={{
                        enter: (direction: number) => ({
                          x: direction > 0 ? 32 : -32,
                          opacity: 0,
                        }),
                        center: {
                          x: 0,
                          opacity: 1,
                          transition: {
                            x: { type: 'spring', stiffness: 360, damping: 32 },
                            opacity: { duration: 0.2, ease: 'easeOut' },
                          },
                        },
                        exit: (direction: number) => ({
                          x: direction > 0 ? -32 : 32,
                          opacity: 0,
                          transition: {
                            x: { type: 'spring', stiffness: 360, damping: 32 },
                            opacity: { duration: 0.16, ease: 'easeIn' },
                          },
                        }),
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="w-full"
                    >
                      {currentView === 'month' && (
                        <MonthView
                          currentYear={currentYear}
                          currentMonth={currentMonth}
                          events={filteredEvents}
                          todayStr={TODAY_STR}
                          searchQuery={searchQuery}
                          onSelectEvent={(evt) => setSelectedEvent(evt)}
                          onSelectDate={(dateStr) => handleOpenAddEvent(dateStr)}
                          onRescheduleEvent={handleRescheduleEvent}
                        />
                      )}

                      {currentView === 'year' && (
                        <YearView
                          academicYear={academicYear}
                          events={filteredEvents}
                          todayStr={TODAY_STR}
                          searchQuery={searchQuery}
                          onSelectEvent={(evt) => setSelectedEvent(evt)}
                          onSelectDate={(dateStr) => handleOpenAddEvent(dateStr)}
                          onJumpToMonth={handleJumpToMonth}
                        />
                      )}

                      {currentView === 'week' && (
                        <WeekView
                          centerDateStr={`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-28`}
                          events={filteredEvents}
                          todayStr={TODAY_STR}
                          searchQuery={searchQuery}
                          onSelectEvent={(evt) => setSelectedEvent(evt)}
                          onSelectDate={(dateStr) => handleOpenAddEvent(dateStr)}
                          onRescheduleEvent={handleRescheduleEvent}
                        />
                      )}

                      {currentView === 'agenda' && (
                        <AgendaView
                          events={filteredEvents}
                          todayStr={TODAY_STR}
                          searchQuery={searchQuery}
                          onResetFilters={() => {
                            setSearchQuery('');
                            setCategoryFilter('all');
                            setSemester('all');
                          }}
                          onAddEvent={() => handleOpenAddEvent()}
                          onSelectEvent={(evt) => setSelectedEvent(evt)}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </section>

            {/* Upcoming Events Sidebar */}
            <UpcomingSidebar
              events={filteredEvents}
              todayStr={TODAY_STR}
              academicYear={academicYear}
              semester={semester}
              onSelectEvent={(evt) => setSelectedEvent(evt)}
            />
          </div>
        )}
      </main>

      {/* Floating Drag & Drop Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-40 max-w-md bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-800 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="text-xs font-medium text-slate-100 flex-1 leading-snug">
            {toast.message}
          </div>
          {toast.onUndo && (
            <button
              onClick={toast.onUndo}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline px-1 py-0.5 shrink-0 transition-colors"
            >
              Urungkan
            </button>
          )}
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white text-xs px-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-xs text-slate-500 dark:text-slate-400 mt-12 no-print transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              © 2026 SMK IT Ibnul Qayyim Makassar · Yayasan Pendidikan Islam Ibnul Qayyim Sudiang Makassar
            </p>
            <p className="text-slate-400 dark:text-slate-500 mt-0.5">
              NPSN: 70031494 · Konsentrasi Keahlian: Rekayasa Perangkat Lunak (RPL) & Bisnis Digital (BD)
            </p>
          </div>
          <p className="text-slate-400 dark:text-slate-500 text-[11px]">
            Jl. Goa Ria Taman Bunga 2, Laikang, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan 90242 · Telp: 0811 4411 432
          </p>
        </div>
      </footer>

      {/* Modals */}
      <EventDetailModal
        event={selectedEvent}
        events={events}
        onClose={() => setSelectedEvent(null)}
        onEdit={handleEditEventFromDetail}
        onDelete={handleDeleteEvent}
        onSelectEvent={(evt) => setSelectedEvent(evt)}
      />

      <EventFormModal
        isOpen={isFormModalOpen}
        initialEvent={editingEvent}
        defaultDate={defaultFormDate}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
      />

      <PrintModal
        isOpen={isPrintModalOpen}
        events={events}
        academicYear={academicYear}
        onClose={() => setIsPrintModalOpen(false)}
      />

      <ExportICalModal
        isOpen={isExportModalOpen}
        events={events}
        academicYear={academicYear}
        onClose={() => setIsExportModalOpen(false)}
      />

      <StandaloneExportModal
        isOpen={isStandaloneModalOpen}
        events={events}
        onClose={() => setIsStandaloneModalOpen(false)}
      />

      <HebMatrixModal
        isOpen={isHebMatrixOpen}
        academicYear={academicYear}
        onClose={() => setIsHebMatrixOpen(false)}
      />

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        permission={notificationPermission}
        onRequestPermission={requestPermission}
        onSendTestNotification={sendTestNotification}
        tomorrowEvents={tomorrowEvents}
        onSelectEvent={(evt) => setSelectedEvent(evt)}
      />

      {/* Offline Connectivity Status Indicator */}
      <OfflineIndicator />

      {/* Security PIN Authorization Modal */}
      <PinModal
        isOpen={isPinModalOpen}
        actionTitle={pinActionTitle}
        onSuccess={handlePinSuccess}
        onClose={() => {
          setIsPinModalOpen(false);
          setPendingProtectedAction(null);
        }}
      />

      {/* Reset Calendar Confirmation Modal */}
      {isResetConfirmOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-modal-backdrop"
          onClick={() => setIsResetConfirmOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-rose-200 dark:border-rose-900/60 relative animate-modal-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center mb-4 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Kosongkan Seluruh Agenda Kalender?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Tindakan ini akan menghapus semua agenda dari kalender akademik. Anda tetap dapat memasukkan kembali agenda kegiatan riil kapan saja.
            </p>
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmResetData}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                Ya, Kosongkan Kalender
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


