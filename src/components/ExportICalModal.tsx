import React, { useState } from 'react';
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Filter,
  Info,
  Layers,
  Search,
  Share2,
  X,
} from 'lucide-react';
import { AcademicEvent, EventCategory } from '../types.ts';
import {
  CATEGORIES_CONFIG,
  formatDateRange,
  formatIndonesianDate,
  generateICalFile,
  getGoogleCalendarUrl,
} from '../utils/calendarUtils.ts';

interface ExportICalModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: AcademicEvent[];
  academicYear: string;
}

type ExportScope = 'all' | 'ganjil' | 'genap' | 'category' | 'custom';

export const ExportICalModal: React.FC<ExportICalModalProps> = ({
  isOpen,
  onClose,
  events,
  academicYear,
}) => {
  if (!isOpen) return null;

  const [scope, setScope] = useState<ExportScope>('all');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('academic');
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>(
    events.map((e) => e.id)
  );
  const [searchFilter, setSearchFilter] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Compute filtered events to export
  const eventsToExport = React.useMemo(() => {
    if (scope === 'all') {
      return events;
    }
    if (scope === 'ganjil') {
      return events.filter((e) => e.semester === 'ganjil');
    }
    if (scope === 'genap') {
      return events.filter((e) => e.semester === 'genap');
    }
    if (scope === 'category') {
      return events.filter((e) => e.category === selectedCategory);
    }
    if (scope === 'custom') {
      return events.filter((e) => selectedEventIds.includes(e.id));
    }
    return events;
  }, [events, scope, selectedCategory, selectedEventIds]);

  // Search filtered for custom selector
  const customListFiltered = React.useMemo(() => {
    if (!searchFilter.trim()) return events;
    const q = searchFilter.toLowerCase();
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
    );
  }, [events, searchFilter]);

  const handleToggleEvent = (id: string) => {
    setSelectedEventIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllCustom = () => {
    setSelectedEventIds(events.map((e) => e.id));
  };

  const handleClearAllCustom = () => {
    setSelectedEventIds([]);
  };

  const handleDownload = () => {
    if (eventsToExport.length === 0) return;
    const filename =
      scope === 'all'
        ? `Kalender-Akademik-${academicYear.replace('/', '-')}.ics`
        : scope === 'ganjil'
        ? `Kalender-Semester-Ganjil-${academicYear.replace('/', '-')}.ics`
        : scope === 'genap'
        ? `Kalender-Semester-Genap-${academicYear.replace('/', '-')}.ics`
        : `Agenda-Pilihan-SMKIT-${eventsToExport.length}-Kegiatan.ics`;

    generateICalFile(eventsToExport, filename);
  };

  // Google Calendar import settings URL
  const googleCalendarImportUrl = 'https://calendar.google.com/calendar/u/0/r/settings/export';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-[#143c14]/20 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#143c14] text-white p-4 sm:p-5 border-b-4 border-[#ffcc00] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffcc00] text-[#143c14] flex items-center justify-center font-black shadow-xs">
              <Calendar className="w-5 h-5 text-[#143c14]" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg tracking-tight text-white leading-snug">
                Ekspor ke Google Calendar & iCal (.ics)
              </h3>
              <p className="text-xs text-blue-200">
                Sinkronkan jadwal resmi TA {academicYear} ke Google Calendar, Apple Calendar, atau Outlook
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5">
          {/* Step 1: Choose Scope */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              1. Pilih Cakupan Agenda yang Ingin Diekspor
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => setScope('all')}
                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  scope === 'all'
                    ? 'border-[#143c14] bg-emerald-50/60 ring-1 ring-[#143c14]'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="font-extrabold text-slate-900 flex items-center justify-between">
                  <span>Seluruh Kalender</span>
                  <span className="bg-[#143c14] text-white text-[10px] px-1.5 py-0.2 rounded font-bold">
                    {events.length}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] mt-1">
                  Semua agenda Gasal & Genap TA {academicYear}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setScope('ganjil')}
                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  scope === 'ganjil'
                    ? 'border-[#143c14] bg-emerald-50/60 ring-1 ring-[#143c14]'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="font-extrabold text-slate-900 flex items-center justify-between">
                  <span>Semester Ganjil</span>
                  <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded font-bold">
                    {events.filter((e) => e.semester === 'ganjil').length}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] mt-1">
                  Juli s/d Desember 2026
                </p>
              </button>

              <button
                type="button"
                onClick={() => setScope('genap')}
                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  scope === 'genap'
                    ? 'border-[#143c14] bg-emerald-50/60 ring-1 ring-[#143c14]'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="font-extrabold text-slate-900 flex items-center justify-between">
                  <span>Semester Genap</span>
                  <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded font-bold">
                    {events.filter((e) => e.semester === 'genap').length}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] mt-1">
                  Januari s/d Juni 2027
                </p>
              </button>

              <button
                type="button"
                onClick={() => setScope('category')}
                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  scope === 'category'
                    ? 'border-[#143c14] bg-emerald-50/60 ring-1 ring-[#143c14]'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="font-extrabold text-slate-900 flex items-center justify-between">
                  <span>Berdasarkan Kategori</span>
                  <Filter className="w-3.5 h-3.5 text-[#143c14]" />
                </div>
                <p className="text-slate-500 text-[11px] mt-1">
                  Pilih kategori tertentu saja
                </p>
              </button>

              <button
                type="button"
                onClick={() => setScope('custom')}
                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer sm:col-span-2 ${
                  scope === 'custom'
                    ? 'border-[#143c14] bg-emerald-50/60 ring-1 ring-[#143c14]'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="font-extrabold text-slate-900 flex items-center justify-between">
                  <span>Pilih Agenda Tertentu</span>
                  <span className="bg-slate-900 text-white text-[10px] px-1.5 py-0.2 rounded font-bold">
                    {selectedEventIds.length} Terpilih
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] mt-1">
                  Tentukan sendiri kegiatan apa saja yang ingin Anda masukkan ke kalender
                </p>
              </button>
            </div>
          </div>

          {/* Sub-selector for Category */}
          {scope === 'category' && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Pilih Kategori:</span>
              <div className="flex flex-wrap gap-2 text-xs">
                {(Object.keys(CATEGORIES_CONFIG) as EventCategory[]).map((catKey) => {
                  const cat = CATEGORIES_CONFIG[catKey];
                  const count = events.filter((e) => e.category === catKey).length;
                  const isSelected = selectedCategory === catKey;

                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => setSelectedCategory(catKey)}
                      className={`px-3 py-1.5 rounded-lg font-bold border transition-colors cursor-pointer ${
                        isSelected
                          ? `${cat.bgSolid} shadow-xs ring-2 ring-[#143c14]/20`
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat.label} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sub-selector for Custom Events Checklist */}
          {scope === 'custom' && (
            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/70 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Cari agenda untuk dipilih..."
                    className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#143c14]"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
                  <button
                    type="button"
                    onClick={handleSelectAllCustom}
                    className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 transition-colors cursor-pointer"
                  >
                    Pilih Semua ({events.length})
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllCustom}
                    className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-rose-600 transition-colors cursor-pointer"
                  >
                    Kosongkan
                  </button>
                </div>
              </div>

              {/* Checklist Scroll Area */}
              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                {customListFiltered.map((evt) => {
                  const isChecked = selectedEventIds.includes(evt.id);
                  const cat = CATEGORIES_CONFIG[evt.category] || CATEGORIES_CONFIG.academic;

                  return (
                    <label
                      key={evt.id}
                      className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer select-none transition-colors ${
                        isChecked
                          ? 'bg-emerald-50/80 border-[#143c14]/40'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleEvent(evt.id)}
                        className="mt-0.5 rounded text-[#143c14] focus:ring-[#143c14]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 truncate">
                            {evt.title}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold text-white ${cat.bgSolid}`}
                          >
                            {cat.shortLabel}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {formatDateRange(evt.startDate, evt.endDate)} · {evt.location}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Summary & Export Buttons */}
          <div className="bg-[#143c14]/5 border-2 border-[#143c14]/20 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Total Agenda Siap Diekspor:
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#143c14] tabular-nums">
                  {eventsToExport.length} Kegiatan
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Download .ics Button */}
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={eventsToExport.length === 0}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-black text-slate-950 bg-[#ffcc00] hover:bg-[#eab308] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span>Unduh Berkas iCal (.ics)</span>
                </button>

                {/* Direct Google Calendar Link if 1 event */}
                {eventsToExport.length === 1 && (
                  <a
                    href={getGoogleCalendarUrl(eventsToExport[0])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-white bg-[#143c14] hover:bg-[#0f2c0f] rounded-xl transition-colors shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4 text-[#ffcc00]" />
                    <span>Buka Google Calendar Langsung</span>
                  </a>
                )}
              </div>
            </div>

            {/* Quick 1-Click Import Web Link to Google Calendar Settings */}
            <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-600 font-medium">
                Setelah mengunduh file .ics, Anda dapat langsung mengunggahnya ke Google Calendar:
              </span>
              <a
                href={googleCalendarImportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#143c14] hover:underline font-bold"
              >
                <span>Buka Halaman Impor Google Calendar</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Step 3: Interactive Visual Guide for Google Calendar */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Info className="w-4 h-4 text-[#143c14] shrink-0" />
              <span>Panduan Mudah Memasukkan Jadwal ke Google Calendar Anda</span>
            </div>

            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1 leading-relaxed">
              <li>
                Klik tombol <strong className="text-slate-900">"Unduh Berkas iCal (.ics)"</strong> di atas untuk menyimpan file jadwal ke laptop/HP Anda.
              </li>
              <li>
                Buka <strong className="text-slate-900">Google Calendar</strong> di peramban (bisa klik tautan biru di atas).
              </li>
              <li>
                Klik ikon <strong>Setelan / Settings (Roda Gigi)</strong> di pojok kanan atas &gt; pilih menu <strong>Impor & Ekspor (Import & Export)</strong>.
              </li>
              <li>
                Pilih opsi <strong>"Pilih berkas dari komputer"</strong> dan unggah berkas <code>.ics</code> yang baru diunduh, lalu klik <strong>Impor</strong>.
              </li>
              <li>
                <strong>Selesai!</strong> Seluruh agenda kalender akademik otomatis tersinkron ke Google Calendar di HP Android, iPhone, dan laptop Anda dengan pengingat aktif.
              </li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            Format standar RFC 5545 kompatibel dengan Google Calendar, Apple iCal, Outlook, dan Android.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            Selesai / Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
