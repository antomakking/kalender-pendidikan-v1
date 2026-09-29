import React, { useState } from 'react';
import { Calendar, Clock, ShieldCheck, Users, X } from 'lucide-react';
import { AcademicEvent, ClassLevel, EventCategory } from '../types.ts';
import { DateRangePicker } from './DateRangePicker.tsx';
import { getEventClasses } from '../utils/calendarUtils.ts';

interface EventFormModalProps {
  initialEvent?: AcademicEvent | null;
  defaultDate?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: AcademicEvent) => void;
}

export const EventFormModal: React.FC<EventFormModalProps> = ({
  initialEvent,
  defaultDate = '2026-09-28',
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
  const [category, setCategory] = useState<EventCategory>(initialEvent?.category || 'academic');
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

  const handleToggleClass = (cls: ClassLevel) => {
    setTargetClasses((prev) => {
      if (prev.includes(cls)) {
        // don't allow empty if possible, but if only 1 left keep it
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

    const semester = startDate >= '2027-01-01' ? 'genap' : 'ganjil';

    const newOrUpdatedEvent: AcademicEvent = {
      id: initialEvent?.id || `evt-custom-${Date.now()}`,
      title: title.trim(),
      startDate,
      endDate: endDate < startDate ? startDate : endDate,
      startTime: startTime || '08:00',
      endTime: endTime || '15:00',
      category,
      targetClasses: targetClasses.length > 0 ? targetClasses : ['X', 'XI', 'XII'],
      audience: audience.trim() || 'Semua Siswa',
      location: location.trim() || 'Kampus SMK IT Ibnul Qayyim',
      description: description.trim() || 'Agenda kegiatan sekolah terpadu.',
      academicYear,
      semester,
      isOfficialHoliday: category === 'holiday',
    };

    onSave(newOrUpdatedEvent);
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
