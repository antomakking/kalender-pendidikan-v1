import React, { useMemo, useState } from 'react';
import { Calendar, Clock, Flag, Repeat, ShieldCheck, Sparkles, Users, X } from 'lucide-react';
import { AcademicEvent, ClassLevel, EventCategory, RecurrenceFrequency } from '../types.ts';
import { DateRangePicker } from './DateRangePicker.tsx';
import {
  DAY_NAMES_ID,
  formatIndonesianDate,
  generateRecurringEventDates,
  getEventClasses,
} from '../utils/calendarUtils.ts';

interface EventFormModalProps {
  initialEvent?: AcademicEvent | null;
  defaultDate?: string;
  defaultCategory?: EventCategory;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: AcademicEvent | AcademicEvent[]) => void;
}

export const EventFormModal: React.FC<EventFormModalProps> = ({
  initialEvent,
  defaultDate = '2026-09-28',
  defaultCategory = 'academic',
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(initialEvent);

  const [title, setTitle] = useState(initialEvent?.title || '');
  const [startDate, setStartDate] = useState(initialEvent?.startDate || defaultDate);
  const [endDate, setEndDate] = useState(initialEvent?.endDate || defaultDate);
  const [startTime, setStartTime] = useState(initialEvent?.startTime || '07:30');
  const [endTime, setEndTime] = useState(initialEvent?.endTime || '15:00');
  const [category, setCategory] = useState<EventCategory>(
    initialEvent?.category || defaultCategory || 'academic'
  );
  const [isOfficialHoliday, setIsOfficialHoliday] = useState<boolean>(
    initialEvent?.isOfficialHoliday ?? (defaultCategory === 'holiday' || initialEvent?.category === 'holiday')
  );
  const [targetClasses, setTargetClasses] = useState<ClassLevel[]>(() => {
    if (initialEvent) {
      return getEventClasses(initialEvent);
    }
    return ['X', 'XI', 'XII'];
  });
  const [audience, setAudience] = useState(initialEvent?.audience || 'Seluruh Siswa (Kelas X, XI, XII)');
  const [location, setLocation] = useState(initialEvent?.location || 'Kampus SMK IT Ibnul Qayyim Makassar');
  const [description, setDescription] = useState(initialEvent?.description || '');
  const [academicYear, setAcademicYear] = useState(initialEvent?.academicYear || '2026/2027');

  // Recurring Event Configuration State
  const [isRecurring, setIsRecurring] = useState<boolean>(initialEvent?.isRecurring || false);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrenceFrequency>(
    initialEvent?.recurrencePattern || 'weekly'
  );
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<number[]>(() => {
    const [y, m, d] = (initialEvent?.startDate || defaultDate).split('-').map(Number);
    const dayOfWeek = new Date(y, m - 1, d).getDay();
    return [dayOfWeek];
  });
  const [recurrenceEndType, setRecurrenceEndType] = useState<'occurrences' | 'semester_end' | 'until_date'>('occurrences');
  const [occurrencesCount, setOccurrencesCount] = useState<number>(8); // Default 8 kali
  const [untilDate, setUntilDate] = useState<string>(() => {
    const [y] = (initialEvent?.startDate || defaultDate).split('-').map(Number);
    return `${y}-12-31`;
  });

  // Calculate live preview of recurring event dates
  const previewRecurringDates = useMemo(() => {
    if (!isRecurring) return [];
    return generateRecurringEventDates({
      startDateStr: startDate,
      endDateStr: endDate,
      frequency: recurrencePattern === 'none' ? 'weekly' : recurrencePattern,
      selectedDaysOfWeek: recurrencePattern === 'weekly' ? selectedDaysOfWeek : [],
      endType: recurrenceEndType,
      occurrencesCount,
      untilDateStr: untilDate,
      academicYear,
    });
  }, [
    isRecurring,
    startDate,
    endDate,
    recurrencePattern,
    selectedDaysOfWeek,
    recurrenceEndType,
    occurrencesCount,
    untilDate,
    academicYear,
  ]);

  const handleToggleClass = (cls: ClassLevel) => {
    setTargetClasses((prev) => {
      if (prev.includes(cls)) {
        const next = prev.filter((c) => c !== cls);
        return next.length > 0 ? next : [cls];
      } else {
        return [...prev, cls];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startDate || !endDate) return;

    if (isRecurring && previewRecurringDates.length > 0) {
      const recId = initialEvent?.recurrenceId || `rec-${Date.now()}`;
      const totalSessions = previewRecurringDates.length;

      const generatedEvents: AcademicEvent[] = previewRecurringDates.map((dates, index) => {
        const semester = dates.startDate >= '2027-01-01' ? 'genap' : 'ganjil';
        return {
          id: (index === 0 && initialEvent) ? initialEvent.id : `evt-custom-${Date.now()}-${index + 1}`,
          title: title.trim(),
          startDate: dates.startDate,
          endDate: dates.endDate < dates.startDate ? dates.startDate : dates.endDate,
          startTime: startTime || '08:00',
          endTime: endTime || '15:00',
          category: isOfficialHoliday ? 'holiday' : category,
          targetClasses: targetClasses.length > 0 ? targetClasses : ['X', 'XI', 'XII'],
          audience: audience.trim() || 'Semua Siswa',
          location: location.trim() || 'Kampus SMK IT Ibnul Qayyim',
          description: description.trim() || 'Agenda kegiatan sekolah terpadu.',
          academicYear,
          semester,
          isOfficialHoliday,
          isRecurring: true,
          recurrencePattern,
          recurrenceId: recId,
          sessionIndex: index + 1,
          totalSessions,
        };
      });

      onSave(generatedEvents);
    } else {
      const semester = startDate >= '2027-01-01' ? 'genap' : 'ganjil';
      const singleEvent: AcademicEvent = {
        id: initialEvent?.id || `evt-custom-${Date.now()}`,
        title: title.trim(),
        startDate,
        endDate: endDate < startDate ? startDate : endDate,
        startTime: startTime || '08:00',
        endTime: endTime || '15:00',
        category: isOfficialHoliday ? 'holiday' : category,
        targetClasses: targetClasses.length > 0 ? targetClasses : ['X', 'XI', 'XII'],
        audience: audience.trim() || 'Semua Siswa',
        location: location.trim() || 'Kampus SMK IT Ibnul Qayyim',
        description: description.trim() || 'Agenda kegiatan sekolah terpadu.',
        academicYear,
        semester,
        isOfficialHoliday,
        isRecurring: false,
      };

      onSave(singleEvent);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition-colors cursor-pointer"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#143c14] flex items-center justify-center font-bold">
            <Calendar className="w-4 h-4 text-[#143c14]" />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            {isEditing ? 'Edit Agenda Akademik' : 'Tambah Agenda Akademik Baru'}
          </h3>
        </div>

        {/* Security Authorized Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 text-[11px] font-semibold my-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#143c14] shrink-0" />
          <span>Otorisasi Terverifikasi: Mode Pengelola Kurikulum & Akademik</span>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Data akan disimpan ke penyimpanan lokal peramban (localStorage) dan langsung disinkronkan ke kalender.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Judul Kegiatan */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Nama / Judul Kegiatan *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Penilaian Akhir Semester (PAS) Ganjil Mandiri"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#143c14] text-xs sm:text-sm font-medium"
            />
          </div>

          {/* Quick Mark as National Holiday Card */}
          <div
            className={`p-3 rounded-xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
              isOfficialHoliday
                ? 'border-rose-500 bg-rose-50/90 text-rose-950 ring-2 ring-rose-400/30 shadow-xs'
                : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:border-rose-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isOfficialHoliday
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                <Flag className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  <span className={isOfficialHoliday ? 'text-rose-900' : 'text-slate-800'}>
                    Status Hari Libur Nasional
                  </span>
                  {isOfficialHoliday && (
                    <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Ditandai border warna merah menyala & ikon bendera resmi pada seluruh kalender.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (isOfficialHoliday) {
                  setIsOfficialHoliday(false);
                  if (category === 'holiday') {
                    setCategory('academic');
                  }
                } else {
                  setIsOfficialHoliday(true);
                  setCategory('holiday');
                  if (!title.trim() || title === 'Agenda Baru') {
                    setTitle('Libur Nasional: ');
                  }
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 self-start sm:self-auto ${
                isOfficialHoliday
                  ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs ring-1 ring-rose-700'
                  : 'bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 shadow-2xs'
              }`}
            >
              {isOfficialHoliday ? '✓ Ditandai Libur Nasional' : '🚩 Tandai Libur Nasional'}
            </button>
          </div>

          {/* Visual Date Range Picker Component */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5">
              Jadwal & Rentang Tanggal Pelaksanaan *
            </label>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={(newStart, newEnd) => {
                setStartDate(newStart);
                setEndDate(newEnd);
              }}
            />
          </div>

          {/* Jam Mulai & Selesai */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jam Mulai
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#143c14]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jam Selesai
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#143c14]"
              />
            </div>
          </div>

          {/* Fitur Agenda Berulang (Recurring / Routine Events) */}
          <div
            className={`p-3.5 rounded-xl border-2 transition-all space-y-3 ${
              isRecurring
                ? 'border-emerald-600 bg-emerald-50/80 text-slate-900 shadow-xs ring-2 ring-emerald-500/20'
                : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isRecurring
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <Repeat className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span className={isRecurring ? 'text-emerald-950 font-black' : 'text-slate-800'}>
                      Jadikan Agenda Berulang (Rutin)
                    </span>
                    {isRecurring && (
                      <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.2 rounded-full font-bold">
                        Aktif
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Otomatis menjadwalkan agenda secara berkala (mingguan, dua mingguan, bulanan, atau harian).
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => setIsRecurring(!isRecurring)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isRecurring ? 'bg-emerald-700' : 'bg-slate-300'
                }`}
                role="switch"
                aria-checked={isRecurring}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isRecurring ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Sub-form opsi pengulangan */}
            {isRecurring && (
              <div className="pt-2.5 border-t border-emerald-200/80 space-y-3 animate-in fade-in duration-150">
                {/* 1. Frekuensi Pengulangan */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Frekuensi Pengulangan
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {(
                      [
                        { id: 'weekly', label: 'Mingguan', desc: 'Tiap Pekan' },
                        { id: 'biweekly', label: '2 Pekan Sekali', desc: 'Dwi-mingguan' },
                        { id: 'monthly', label: 'Bulanan', desc: 'Tiap Bulan' },
                        { id: 'daily', label: 'Hari Kerja', desc: 'Senin–Jumat' },
                      ] as const
                    ).map((freq) => (
                      <button
                        key={freq.id}
                        type="button"
                        onClick={() => {
                          setRecurrencePattern(freq.id);
                          if (freq.id === 'daily') {
                            setSelectedDaysOfWeek([1, 2, 3, 4, 5]); // Sen - Jum
                          }
                        }}
                        className={`p-2 rounded-lg text-left border transition-all cursor-pointer ${
                          recurrencePattern === freq.id
                            ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs font-bold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block text-xs leading-tight">{freq.label}</span>
                        <span
                          className={`text-[10px] block font-normal leading-tight mt-0.5 ${
                            recurrencePattern === freq.id ? 'text-emerald-200' : 'text-slate-400'
                          }`}
                        >
                          {freq.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Hari dalam Sepekan (khusus Mingguan) */}
                {recurrencePattern === 'weekly' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Ulangi Pada Hari (Bisa pilih lebih dari satu)
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {DAY_NAMES_ID.map((dName, dayIdx) => {
                        const isSelected = selectedDaysOfWeek.includes(dayIdx);
                        return (
                          <button
                            key={dName}
                            type="button"
                            onClick={() => {
                              setSelectedDaysOfWeek((prev) => {
                                if (prev.includes(dayIdx)) {
                                  return prev.length > 1 ? prev.filter((d) => d !== dayIdx) : prev;
                                }
                                return [...prev, dayIdx].sort((a, b) => a - b);
                              });
                            }}
                            className={`px-2.5 py-1 text-xs rounded-lg font-bold border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-700 text-white border-emerald-800 shadow-2xs'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {isSelected ? '✓ ' : ''}{dName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Batas Pengulangan */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Berakhir Pada
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* Opsi 1: Jumlah Pertemuan */}
                    <div
                      onClick={() => setRecurrenceEndType('occurrences')}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                        recurrenceEndType === 'occurrences'
                          ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/30'
                          : 'bg-white/70 border-slate-200 opacity-80'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <input
                          type="radio"
                          name="recurrenceEndType"
                          checked={recurrenceEndType === 'occurrences'}
                          onChange={() => setRecurrenceEndType('occurrences')}
                          className="accent-emerald-700"
                        />
                        <span className="text-xs font-bold text-slate-800">Jumlah Pertemuan</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <input
                          type="number"
                          min={2}
                          max={36}
                          value={occurrencesCount}
                          disabled={recurrenceEndType !== 'occurrences'}
                          onChange={(e) => setOccurrencesCount(Math.max(2, Math.min(36, parseInt(e.target.value, 10) || 2)))}
                          className="w-16 px-2 py-1 border border-slate-200 rounded text-xs text-center font-bold text-slate-900 bg-white"
                        />
                        <span className="text-[11px] text-slate-600">kali sesi</span>
                      </div>
                    </div>

                    {/* Opsi 2: Sampai Akhir Semester */}
                    <div
                      onClick={() => setRecurrenceEndType('semester_end')}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                        recurrenceEndType === 'semester_end'
                          ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/30'
                          : 'bg-white/70 border-slate-200 opacity-80'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <input
                          type="radio"
                          name="recurrenceEndType"
                          checked={recurrenceEndType === 'semester_end'}
                          onChange={() => setRecurrenceEndType('semester_end')}
                          className="accent-emerald-700"
                        />
                        <span className="text-xs font-bold text-slate-800">Akhir Semester</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 mt-1">
                        Sampai akhir semester aktif ({startDate >= '2027-01-01' ? 'Juni 2027' : 'Desember 2026'}).
                      </p>
                    </div>

                    {/* Opsi 3: Tanggal Tertentu */}
                    <div
                      onClick={() => setRecurrenceEndType('until_date')}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                        recurrenceEndType === 'until_date'
                          ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/30'
                          : 'bg-white/70 border-slate-200 opacity-80'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <input
                          type="radio"
                          name="recurrenceEndType"
                          checked={recurrenceEndType === 'until_date'}
                          onChange={() => setRecurrenceEndType('until_date')}
                          className="accent-emerald-700"
                        />
                        <span className="text-xs font-bold text-slate-800">Sampai Tanggal</span>
                      </div>
                      <input
                        type="date"
                        value={untilDate}
                        disabled={recurrenceEndType !== 'until_date'}
                        onChange={(e) => setUntilDate(e.target.value)}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-slate-900 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Live Schedule Summary & Preview */}
                <div className="p-2.5 bg-white rounded-lg border border-emerald-300/80 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-black text-emerald-950 flex items-center gap-1">
                      <span>✓ Siap dibuat:</span>
                      <strong className="text-emerald-700 underline">{previewRecurringDates.length} sesi agenda</strong>
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Mulai: {formatIndonesianDate(startDate)}
                    </span>
                  </div>

                  {/* List of dates preview */}
                  {previewRecurringDates.length > 0 && (
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded border border-slate-200/80">
                      {previewRecurringDates.map((item, idx) => (
                        <span
                          key={item.startDate}
                          className="text-[10px] bg-white text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded font-medium shadow-2xs"
                        >
                          Sesi {idx + 1}: {formatIndonesianDate(item.startDate, { shortMonth: true })}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tingkat Kelas Sasaran */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-600" />
              <span>Tingkat Kelas yang Mengikuti Agenda *</span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleClass('X')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  targetClasses.includes('X')
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {targetClasses.includes('X') ? '✓ ' : ''}Kelas X
              </button>

              <button
                type="button"
                onClick={() => handleToggleClass('XI')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  targetClasses.includes('XI')
                    ? 'bg-sky-700 text-white border-sky-800 shadow-xs'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {targetClasses.includes('XI') ? '✓ ' : ''}Kelas XI
              </button>

              <button
                type="button"
                onClick={() => handleToggleClass('XII')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  targetClasses.includes('XII')
                    ? 'bg-[#ffcc00] text-slate-950 border-amber-500 shadow-xs font-black'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {targetClasses.includes('XII') ? '✓ ' : ''}Kelas XII
              </button>

              <button
                type="button"
                onClick={() => setTargetClasses(['X', 'XI', 'XII'])}
                className="text-[11px] text-[#143c14] hover:underline font-bold px-1.5 py-1 ml-auto cursor-pointer"
              >
                Pilih Semua Kelas
              </button>
            </div>
          </div>

          {/* Kategori & Sasaran */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kategori Kegiatan *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#143c14]"
              >
                <option value="academic">KBM, Pembelajaran & Asesmen</option>
                <option value="holiday">Hari Libur Nasional & Yayasan</option>
                <option value="student">Kesiswaan, P5 & Ekstrakurikuler</option>
                <option value="teacher">Penilaian Semester, Rapor & Guru</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Sasaran / Peserta *
              </label>
              <input
                type="text"
                required
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="Contoh: Siswa Kelas XI RPL & BD"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#143c14]"
              />
            </div>
          </div>

          {/* Lokasi */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tempat / Lokasi
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Lab Komputer RPL / Aula Utama"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#143c14]"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Keterangan / Catatan Tambahan
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan petunjuk teknis pelaksanaan, materi uji, atau ketentuan seragam santri..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#143c14]"
            />
          </div>

          {/* Tombol Simpan & Batal */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#143c14] hover:bg-[#0f2c0f] text-white rounded-lg font-bold transition-colors shadow-xs cursor-pointer"
            >
              {isEditing ? 'Simpan Perubahan' : 'Tambah Agenda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
