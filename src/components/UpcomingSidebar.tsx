import React, { useMemo } from 'react';
import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Info,
  KeyRound,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { AcademicEvent, SemesterFilter } from '../types.ts';
import {
  CATEGORIES_CONFIG,
  formatDateRange,
  formatDateToISO,
  getRelativeTimeStatus,
} from '../utils/calendarUtils.ts';
import { EmptyState } from './EmptyState.tsx';

interface UpcomingSidebarProps {
  events: AcademicEvent[];
  todayStr: string;
  academicYear?: string;
  semester?: SemesterFilter;
  onSelectEvent: (event: AcademicEvent) => void;
}

export const UpcomingSidebar: React.FC<UpcomingSidebarProps> = ({
  events,
  todayStr,
  academicYear,
  semester,
  onSelectEvent,
}) => {
  // Filter events based on active semester and academic year
  const filteredContextEvents = useMemo(() => {
    return events.filter((e) => {
      const matchYear = !academicYear || e.academicYear === academicYear;
      const matchSem = !semester || semester === 'all' || e.semester === semester;
      return matchYear && matchSem;
    });
  }, [events, academicYear, semester]);

  // Real Data Section 1: Agenda Pembelajaran & Ujian (KBM, Asesmen, Sumatif, Ujian, dsb.)
  const learningAndExamEvents = useMemo(() => {
    return filteredContextEvents
      .filter((e) => e.category === 'academic' || e.category === 'teacher')
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [filteredContextEvents]);

  // Real Data Section 2: Registrasi & Administrasi / Kesiswaan (Daftar ulang, PKL, MPLS, OSIS, dsb.)
  const registrationAndAdminEvents = useMemo(() => {
    return filteredContextEvents
      .filter(
        (e) =>
          e.category === 'student' ||
          e.title.toLowerCase().includes('registrasi') ||
          e.title.toLowerCase().includes('daftar ulang') ||
          e.title.toLowerCase().includes('administrasi')
      )
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [filteredContextEvents]);

  // Dynamic Upcoming Events (next 45 days or ongoing today)
  const upcomingList = useMemo(() => {
    const today = new Date(todayStr);
    const limitDate = new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000);
    const limitStr = formatDateToISO(limitDate);

    return events
      .filter((e) => {
        const isOngoing = e.startDate <= todayStr && e.endDate >= todayStr;
        const isUpcomingSoon = e.startDate >= todayStr && e.startDate <= limitStr;
        return isOngoing || isUpcomingSoon;
      })
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [events, todayStr]);

  return (
    <aside className="space-y-5" id="agenda-mendatang">
      {/* Official Poster-Style Academic Agenda Highlights (Real Data from Calendar) */}
      <div className="bg-amber-50/80 border-2 border-amber-300/80 rounded-2xl p-4 shadow-xs space-y-4">
        {/* Section 1: Agenda Pembelajaran & Ujian (Data Real) */}
        <div className="space-y-2">
          <div className="bg-[#143c14] text-white px-3 py-1.5 rounded-full flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#ffcc00]" />
              <h4 className="font-black text-xs uppercase tracking-wide">
                Agenda Pembelajaran & Ujian
              </h4>
            </div>
            <span className="text-[10px] bg-[#ffcc00] text-[#143c14] font-extrabold px-1.5 py-0.2 rounded-full">
              {learningAndExamEvents.length}
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-800 pl-1 font-medium max-h-56 overflow-y-auto pr-1">
            {learningAndExamEvents.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic py-1">
                Tidak ada agenda pembelajaran/ujian pada filter ini.
              </p>
            ) : (
              learningAndExamEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className="flex items-start gap-1.5 p-1 rounded-md hover:bg-amber-100/70 transition-colors cursor-pointer group"
                  title={`Klik untuk melihat rincian: ${evt.title}`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#143c14] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="leading-snug">
                    <strong className="text-slate-900 group-hover:text-[#143c14] transition-colors">
                      {evt.title}:
                    </strong>{' '}
                    <span className="text-slate-700 font-normal">
                      {formatDateRange(evt.startDate, evt.endDate)}
                    </span>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 2: Jadwal Registrasi & Administrasi (Data Real) */}
        <div className="space-y-2 pt-2 border-t border-amber-200">
          <div className="bg-[#143c14] text-white px-3 py-1.5 rounded-full flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5 text-[#ffcc00]" />
              <h4 className="font-black text-xs uppercase tracking-wide">
                Registrasi & Administrasi
              </h4>
            </div>
            <span className="text-[10px] bg-[#ffcc00] text-[#143c14] font-extrabold px-1.5 py-0.2 rounded-full">
              {registrationAndAdminEvents.length}
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-800 pl-1 font-medium max-h-52 overflow-y-auto pr-1">
            {registrationAndAdminEvents.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic py-1">
                Tidak ada agenda registrasi/administrasi pada filter ini.
              </p>
            ) : (
              registrationAndAdminEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className="flex items-start gap-1.5 p-1 rounded-md hover:bg-amber-100/70 transition-colors cursor-pointer group"
                  title={`Klik untuk melihat rincian: ${evt.title}`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#143c14] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="leading-snug">
                    <strong className="text-slate-900 group-hover:text-[#143c14] transition-colors">
                      {evt.title}:
                    </strong>{' '}
                    <span className="text-slate-700 font-normal">
                      {formatDateRange(evt.startDate, evt.endDate)}
                    </span>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Dynamic Events Box */}
      <div className="bg-white border-2 border-[#143c14]/20 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#143c14] text-white flex items-center justify-center font-bold">
              <Bell className="w-3.5 h-3.5 text-[#ffcc00]" />
            </div>
            <h3 className="font-black text-slate-900 text-sm">Agenda Mendatang</h3>
          </div>
          <span className="text-xs text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
            {upcomingList.length} Kegiatan
          </span>
        </div>

        {upcomingList.length === 0 ? (
          <div className="pt-2">
            <EmptyState
              type="upcoming"
              compact={true}
              title="Jadwal Mendatang Masih Lengang"
              description="Tidak ada agenda khusus dalam waktu dekat. Santri dan ustadz fokus pada KBM reguler."
            />
          </div>
        ) : (
          <div className="mt-3.5 space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {upcomingList.map((evt) => {
              const cat = CATEGORIES_CONFIG[evt.category] || CATEGORIES_CONFIG.academic;
              const rel = getRelativeTimeStatus(evt, todayStr);

              return (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-[#143c14] transition-all bg-slate-50/70 hover:bg-white cursor-pointer group space-y-1.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-1 text-[11px]">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${rel.badgeClass}`}>
                      {rel.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-2xs ${cat.bgSolid}`}>
                      {cat.shortLabel}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2 group-hover:text-[#143c14] transition-colors">
                    {evt.title}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>{formatDateRange(evt.startDate, evt.endDate)}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Institution Info Card */}
      <div className="bg-[#143c14] text-white rounded-2xl p-4 border-b-4 border-[#ffcc00] shadow-xs space-y-2 text-xs">
        <div className="flex items-center gap-2 font-black text-white text-sm">
          <Info className="w-4 h-4 text-[#ffcc00] shrink-0" />
          <span>SMK IT Ibnul Qayyim Makassar</span>
        </div>
        <p className="text-[11px] text-blue-100 leading-relaxed">
          Pusat Keunggulan Vokasi & Pondok Pesantren Tahfizh Quran. Mencetak generasi Muslim yang Berakhlak Mulia, Hafizh Quran dan Terampil IT.
        </p>
        <div className="text-[10px] font-bold text-[#ffcc00] pt-1 border-t border-white/10 uppercase tracking-wide">
          Kompetensi: Rekayasa Perangkat Lunak (RPL) & Bisnis Digital (BD)
        </div>
      </div>
    </aside>
  );
};
