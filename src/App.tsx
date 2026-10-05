import React, { useEffect, useMemo, useState } from 'react';
import { AgendaView } from './components/AgendaView.tsx';
import { ControlsBar } from './components/ControlsBar.tsx';
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
import { AcademicEvent, CalendarView, ClassFilter, EventCategory, SemesterFilter } from './types.ts';
import {
  CATEGORIES_CONFIG,
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

const STORAGE_KEY = 'smk_it_kalender_events_full_2526_2627_v10';
const TODAY_STR = formatDateToISO(new Date());

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

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out any P5 items
          return parsed.filter(
            (e: AcademicEvent) =>
              !e.title.toLowerCase().includes('p5') &&
              !e.description.toLowerCase().includes('p5')
          );
        }
      }
    } catch (e) {
      console.error('Failed to load events from storage', e);
    }
    return INITIAL_EVENTS.filter(
      (e) => !e.title.toLowerCase().includes('p5') && !e.description.toLowerCase().includes('p5')
    );
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to persist events to storage', e);
    }
  }, [events]);

  // 2. View & Navigation State (Default to TA 2026/2027 & Year View)
  const [currentView, setCurrentView] = useState<CalendarView>('year');
  const [academicYear, setAcademicYear] = useState<string>('2026/2027');
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(6); // Juli 2026 (Awal TA 2026/2027)
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

    return events.filter((evt) => {
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
      if (categoryFilter !== 'all' && evt.category !== categoryFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = evt.title.toLowerCase().includes(q);
        const matchDesc = evt.description.toLowerCase().includes(q);
        const matchLoc = evt.location.toLowerCase().includes(q);
        const matchAud = evt.audience.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchLoc && !matchAud) return false;
      }

      return true;
    });
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
      academic: baseList.filter((e) => e.category === 'academic').length,
      holiday: baseList.filter((e) => e.category === 'holiday').length,
      student: baseList.filter((e) => e.category === 'student').length,
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
      setCurrentYear(startYear);
      setCurrentMonth(6); // Juli (Bulan Awal Semester Gasal)
    }
  };

  const handleJumpToMonth = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
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
  const handleSaveEvent = (savedEvent: AcademicEvent) => {
    setEvents((prev) => {
      const exists = prev.some((e) => e.id === savedEvent.id);
      if (exists) {
        return prev.map((e) => (e.id === savedEvent.id ? savedEvent : e));
      }
      return [savedEvent, ...prev];
    });
    setEditingEvent(null);
    setToast({
      id: Date.now(),
      message: `Agenda "${savedEvent.title}" berhasil disimpan ke kalender.`,
    });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteEvent = (id: string) => {
    const eventToDelete = events.find((e) => e.id === id);
    if (!eventToDelete) return;

    setEvents((prev) => {
      const updated = prev.filter((e) => e.id !== id);
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
      message: `Agenda "${eventToDelete.title}" berhasil dihapus.`,
    });
    setTimeout(() => setToast(null), 3000);
  };

  const handleResetData = () => {
    executeWithPinProtection(() => {
      if (
        window.confirm(
          'Kosongkan seluruh agenda kalender? Anda dapat memasukkan kembali agenda kegiatan riil kapan saja.'
        )
      ) {
        setEvents([]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        setToast({
          id: Date.now(),
          message: 'Seluruh kegiatan berhasil dikosongkan. Siap untuk input agenda riil sekolah.',
        });
        setTimeout(() => setToast(null), 3000);
      }
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-200 selection:text-emerald-900">
      {/* Header */}
      <Header
        academicYear={academicYear}
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
          onChangeView={setCurrentView}
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

        {/* Calendar Grid & Sidebar Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Main Calendar View Area */}
          <section className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
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
              <div key={currentView} className="animate-view-fade">
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
              </div>
            )}
          </section>

          {/* Upcoming Events Sidebar */}
          <UpcomingSidebar
            events={events}
            todayStr={TODAY_STR}
            academicYear={academicYear}
            semester={semester}
            onSelectEvent={(evt) => setSelectedEvent(evt)}
          />
        </div>
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
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-800">
              © 2026 SMK IT Ibnul Qayyim Makassar · Sistem Informasi Kalender Akademik
            </p>
            <p className="text-slate-400 mt-0.5">
              Konsentrasi Keahlian: Rekayasa Perangkat Lunak (RPL) & Bisnis Digital (BD)
            </p>
          </div>
          <p className="text-slate-400 text-[11px]">
            Jl. Goa Ria Taman Bunga 2, Laikang, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan 90242
          </p>
        </div>
      </footer>

      {/* Modals */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onEdit={handleEditEventFromDetail}
        onDelete={handleDeleteEvent}
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
    </div>
  );
}


