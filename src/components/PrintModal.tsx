import React, { useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Download, FileText, Printer, Sparkles, X } from 'lucide-react';
import { AcademicEvent, SemesterFilter } from '../types.ts';
import {
  CATEGORIES_CONFIG,
  DAY_NAMES_ID,
  MONTH_NAMES_ID,
  formatDateRange,
  formatIndonesianDate,
  getCalendarDaysForMonth,
} from '../utils/calendarUtils.ts';

interface PrintModalProps {
  events: AcademicEvent[];
  academicYear: string;
  isOpen: boolean;
  onClose: () => void;
}

type PrintLayoutMode = 'grid' | 'grid_table' | 'table';

export const PrintModal: React.FC<PrintModalProps> = ({
  events,
  academicYear,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [printSemester, setPrintSemester] = useState<SemesterFilter>('ganjil');
  const [layoutMode, setLayoutMode] = useState<PrintLayoutMode>('grid');

  // Semester Months configuration
  const semesterMonths =
    printSemester === 'ganjil'
      ? [
          { year: 2026, month: 6, label: 'JULI 2026' },
          { year: 2026, month: 7, label: 'AGUSTUS 2026' },
          { year: 2026, month: 8, label: 'SEPTEMBER 2026' },
          { year: 2026, month: 9, label: 'OKTOBER 2026' },
          { year: 2026, month: 10, label: 'NOVEMBER 2026' },
          { year: 2026, month: 11, label: 'DESEMBER 2026' },
        ]
      : printSemester === 'genap'
      ? [
          { year: 2027, month: 0, label: 'JANUARI 2027' },
          { year: 2027, month: 1, label: 'FEBRUARI 2027' },
          { year: 2027, month: 2, label: 'MARET 2027' },
          { year: 2027, month: 3, label: 'APRIL 2027' },
          { year: 2027, month: 4, label: 'MEI 2027' },
          { year: 2027, month: 5, label: 'JUNI 2027' },
        ]
      : [
          { year: 2026, month: 6, label: 'JULI 2026' },
          { year: 2026, month: 7, label: 'AGUSTUS 2026' },
          { year: 2026, month: 8, label: 'SEPTEMBER 2026' },
          { year: 2026, month: 9, label: 'OKTOBER 2026' },
          { year: 2026, month: 10, label: 'NOVEMBER 2026' },
          { year: 2026, month: 11, label: 'DESEMBER 2026' },
          { year: 2027, month: 0, label: 'JANUARI 2027' },
          { year: 2027, month: 1, label: 'FEBRUARI 2027' },
          { year: 2027, month: 2, label: 'MARET 2027' },
          { year: 2027, month: 3, label: 'APRIL 2027' },
          { year: 2027, month: 4, label: 'MEI 2027' },
          { year: 2027, month: 5, label: 'JUNI 2027' },
        ];

  const filteredEvents = events
    .filter((e) => printSemester === 'all' || e.semester === printSemester)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  const semesterTitle =
    printSemester === 'ganjil'
      ? 'SEMESTER GANJIL (JULI – DESEMBER 2026)'
      : printSemester === 'genap'
      ? 'SEMESTER GENAP (JANUARI – JUNI 2027)'
      : 'SEMESTER GANJIL & GENAP (TAHUN PELAJARAN PENUH)';

  const handlePrint = () => {
    // Sets window title temporarily so browser default PDF filename is clean
    const prevTitle = document.title;
    document.title = `Kalender_Pendidikan_SMK_IT_Ibnul_Qayyim_${academicYear.replace('/', '-')}_${printSemester.toUpperCase()}`;
    window.print();
    setTimeout(() => {
      document.title = prevTitle;
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print-modal-overlay">
      <div className="bg-white rounded-2xl max-w-5xl w-full p-4 sm:p-7 shadow-2xl border border-slate-200 relative my-auto max-h-[96vh] flex flex-col print-modal-container">
        {/* Modal Top Bar (Controls for Print & PDF) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200 no-print">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                <FileText className="w-3 h-3 text-emerald-800" />
                <span>Dokumentasi Resmi Sekolah</span>
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-semibold text-slate-600">Standar Dinas Pendidikan</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Export Dokumen Kalender ke PDF
            </h3>
            <p className="text-xs text-slate-500">
              Menghasilkan cetakan matriks grid kalender resmi untuk arsip kurikulum, tata usaha, dan pengesahan kepala sekolah.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Semester selector */}
            <select
              value={printSemester}
              onChange={(e) => setPrintSemester(e.target.value as SemesterFilter)}
              className="text-xs bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ganjil">Semester Ganjil (6 Bulan)</option>
              <option value="genap">Semester Genap (6 Bulan)</option>
              <option value="all">Satu Tahun Penuh (12 Bulan)</option>
            </select>

            {/* Layout mode switcher */}
            <div className="inline-flex p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  layoutMode === 'grid'
                    ? 'bg-white text-emerald-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Khusus Matriks Grid Kalender Resmi"
              >
                Grid Kalender
              </button>
              <button
                onClick={() => setLayoutMode('grid_table')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  layoutMode === 'grid_table'
                    ? 'bg-white text-emerald-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Grid Kalender + Tabel Lengkap"
              >
                Grid + Tabel
              </button>
              <button
                onClick={() => setLayoutMode('table')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  layoutMode === 'table'
                    ? 'bg-white text-emerald-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Tabel Rekapitulasi Saja"
              >
                Tabel Saja
              </button>
            </div>

            {/* Direct Window Print / PDF Trigger */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-all cursor-pointer"
              title="Ekspor ke PDF menggunakan dialog window.print browser"
            >
              <Printer className="w-4 h-4" />
              <span>Export ke PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              title="Tutup Pratinjau"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Informative Hint Banner (Hidden on Print) */}
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl px-3.5 py-2 my-2 text-[11px] text-emerald-900 flex items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[10px] bg-emerald-200/70 text-emerald-900 px-1.5 py-0.5 rounded">
              Tips Cetak PDF
            </span>
            <span>
              Pilih Tujuan: <strong>Simpan sebagai PDF (Save as PDF)</strong>, Orientasi: <strong>Landscape / Lanskap</strong>, dan centang <strong>Grafik Latar Belakang (Background Graphics)</strong>.
            </span>
          </div>
          <span className="text-slate-400 shrink-0">Ctrl + P</span>
        </div>

        {/* PRINTABLE OFFICIAL DOCUMENT BODY */}
        <div
          id="print-document-root"
          className="overflow-y-auto flex-1 p-3 sm:p-6 bg-white text-slate-900 print:p-0 print:overflow-visible"
        >
          {/* 1. KOP SURAT RESMI */}
          <div className="border-b-2 border-slate-900 pb-2.5 mb-3 text-center">
            <h4 className="text-[11px] sm:text-xs font-bold tracking-widest text-slate-700 uppercase">
              Yayasan Pendidikan Islam Ibnul Qayyim Makassar
            </h4>
            <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
              SMK IT IBNUL QAYYIM MAKASSAR
            </h2>
            <p className="text-[10.5px] text-slate-600 font-medium">
              NPSN: 69989821 · Terakreditasi A · Program Keahlian: Rekayasa Perangkat Lunak (RPL) & Bisnis Digital (BD)
            </p>
            <p className="text-[9.5px] text-slate-500">
              Jl. Goa Ria Taman Bunga 2, Laikang, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan 90242 · Telp: (0411) 895-4321
            </p>
          </div>

          {/* 2. DOKUMEN JUDUL RESMI */}
          <div className="text-center mb-3">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase underline decoration-1">
              KALENDER PENDIDIKAN & MATRIKS AGENDA PEMBELAJARAN
            </h3>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase mt-0.5">
              TAHUN PELAJARAN {academicYear} — {semesterTitle}
            </p>
          </div>

          {/* 3. CALENDAR GRID VIEW (Strictly contains calendar grid data for official documentation) */}
          {(layoutMode === 'grid' || layoutMode === 'grid_table') && (
            <div className="mb-4">
              {/* Monthly Calendar Grids (3 columns x 2 rows for 6 months landscape layout) */}
              <div
                className={`grid gap-2.5 ${
                  semesterMonths.length > 6
                    ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                    : 'grid-cols-2 sm:grid-cols-3'
                }`}
              >
                {semesterMonths.map(({ year, month, label }) => {
                  const days = getCalendarDaysForMonth(year, month, events);

                  return (
                    <div
                      key={label}
                      className="border border-slate-300 rounded-lg p-2 bg-white flex flex-col justify-between shadow-2xs"
                    >
                      {/* Month Header Banner */}
                      <div className="bg-[#143c14] text-white text-[10.5px] font-black tracking-wide text-center py-1 rounded mb-1.5 uppercase">
                        {label}
                      </div>

                      {/* 7 Days Column Header */}
                      <div className="grid grid-cols-7 gap-0.5 text-center font-bold text-[8.5px] mb-1">
                        {DAY_NAMES_ID.map((dName, idx) => (
                          <span
                            key={dName}
                            className={`py-0.5 rounded-xs ${idx === 6 ? 'bg-[#dc2626] text-white font-extrabold' : 'bg-[#143c14] text-white'}`}
                          >
                            {dName.slice(0, 3)}
                          </span>
                        ))}
                      </div>

                      {/* Days Matrix */}
                      <div className="grid grid-cols-7 gap-0.5 text-center text-[9px]">
                        {days.map((dayInfo) => {
                          const {
                            dateStr,
                            dayNumber,
                            isCurrentMonth,
                            isSunday,
                            events: dayEvents,
                          } = dayInfo;

                          if (!isCurrentMonth) {
                            return (
                              <div
                                key={dateStr}
                                className="h-6 flex items-center justify-center text-slate-300"
                              >
                                {dayNumber}
                              </div>
                            );
                          }

                          // Find event styling if any
                          const hasEvent = dayEvents.length > 0;
                          const primaryEvent = dayEvents[0];
                          const cat = hasEvent
                            ? CATEGORIES_CONFIG[primaryEvent.category] || CATEGORIES_CONFIG.academic
                            : null;

                          let bgClass = 'bg-white';
                          let textClass = isSunday ? 'text-rose-600 font-bold' : 'text-slate-800 font-semibold';
                          let borderClass = 'border border-transparent';

                          if (hasEvent && cat) {
                            if (primaryEvent.category === 'holiday') {
                              bgClass = 'bg-rose-100';
                              textClass = 'text-rose-900 font-extrabold';
                              borderClass = 'border border-rose-300';
                            } else if (primaryEvent.category === 'academic') {
                              bgClass = 'bg-amber-100';
                              textClass = 'text-amber-950 font-black';
                              borderClass = 'border border-amber-300';
                            } else if (primaryEvent.category === 'student') {
                              bgClass = 'bg-sky-100';
                              textClass = 'text-sky-950 font-bold';
                              borderClass = 'border border-sky-300';
                            } else if (primaryEvent.category === 'teacher') {
                              bgClass = 'bg-emerald-100';
                              textClass = 'text-emerald-950 font-bold';
                              borderClass = 'border border-emerald-300';
                            }
                          }

                          return (
                            <div
                              key={dateStr}
                              className={`h-6 rounded flex flex-col items-center justify-center relative transition-colors ${bgClass} ${textClass} ${borderClass}`}
                              title={
                                hasEvent
                                  ? `${primaryEvent.title} (${cat?.shortLabel})`
                                  : undefined
                              }
                            >
                              <span className="leading-none">{dayNumber}</span>
                              {hasEvent && (
                                <span
                                  className={`w-1 h-1 rounded-full mt-0.5 ${cat?.dotColor}`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Grid Legend & Directory Bar */}
              <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[9.5px]">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-1.5 mb-1.5 font-bold text-slate-800 uppercase tracking-wider">
                  <span>Keterangan Kode Warna Kalender:</span>
                  <span className="font-semibold normal-case text-slate-500">
                    Target Hari Efektif Belajar (HEB): 114 Hari
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-amber-200 border border-amber-500 flex items-center justify-center font-bold text-[8px] text-amber-950">
                      ✓
                    </span>
                    <span><strong>Kuning:</strong> KBM & Pembelajaran</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-rose-200 border border-rose-500 flex items-center justify-center font-bold text-[8px] text-rose-950">
                      ✕
                    </span>
                    <span><strong>Merah:</strong> Libur Nasional & Ahad</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-sky-200 border border-sky-500 flex items-center justify-center font-bold text-[8px] text-sky-950">
                      ★
                    </span>
                    <span><strong>Biru:</strong> Kesiswaan & PKL</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-emerald-200 border border-emerald-500 flex items-center justify-center font-bold text-[8px] text-emerald-950">
                      ●
                    </span>
                    <span><strong>Hijau:</strong> Penilaian & Rapor</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. TABEL AGENDA DETAIL (shown in grid_table or table mode) */}
          {(layoutMode === 'table' || layoutMode === 'grid_table') && (
            <div className={`mt-3 ${layoutMode === 'grid_table' ? 'print-page-break pt-4' : ''}`}>
              <div className="flex items-center justify-between mb-1.5 font-bold text-xs text-slate-900 uppercase">
                <span>Daftar Agenda & Uraian Kegiatan Terjadwal ({filteredEvents.length} Agenda)</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[9.5px] border border-slate-300 border-collapse print-table">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                      <th className="p-1.5 border border-slate-300 w-8 text-center">No.</th>
                      <th className="p-1.5 border border-slate-300 w-36">Rentang Waktu</th>
                      <th className="p-1.5 border border-slate-300">Nama & Uraian Kegiatan</th>
                      <th className="p-1.5 border border-slate-300 w-24">Kategori</th>
                      <th className="p-1.5 border border-slate-300 w-32">Sasaran Peserta</th>
                      <th className="p-1.5 border border-slate-300 w-32">Lokasi / Tempat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((evt, idx) => {
                      const cat = CATEGORIES_CONFIG[evt.category] || CATEGORIES_CONFIG.academic;
                      return (
                        <tr
                          key={evt.id}
                          className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                        >
                          <td className="p-1.5 border border-slate-300 text-center font-semibold tabular-nums">
                            {idx + 1}
                          </td>
                          <td className="p-1.5 border border-slate-300 font-medium whitespace-nowrap text-slate-800">
                            {formatDateRange(evt.startDate, evt.endDate)}
                          </td>
                          <td className="p-1.5 border border-slate-300">
                            <span className="font-bold text-slate-900 block">{evt.title}</span>
                            <span className="text-[8.5px] text-slate-500 line-clamp-1">
                              {evt.description}
                            </span>
                          </td>
                          <td className="p-1.5 border border-slate-300 font-medium">
                            <span>{cat.shortLabel}</span>
                          </td>
                          <td className="p-1.5 border border-slate-300 text-slate-700">
                            {evt.audience}
                          </td>
                          <td className="p-1.5 border border-slate-300 text-slate-600">
                            {evt.location}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. LEMBAR PENGESAHAN RESMI KEPALA SEKOLAH & WAKA */}
          <div className="mt-5 pt-3 border-t border-slate-300 grid grid-cols-2 gap-8 text-[10px]">
            <div>
              <h5 className="font-bold text-slate-900 mb-1">Catatan Pelaksanaan Kurikulum:</h5>
              <ol className="list-decimal pl-3.5 text-slate-600 space-y-0.5 text-[9px] leading-relaxed">
                <li>Jadwal disusun sesuai pedoman Kalender Pendidikan Dinas Pendidikan Provinsi Sulawesi Selatan.</li>
                <li>Hari libur khusus keagamaan dan cuti bersama mengacu pada SKB 3 Menteri terbaru.</li>
                <li>Ujian Kejuruan RPL & BD disinkronkan dengan jadwal asesmen LSP dan industri mitra.</li>
              </ol>
            </div>

            <div className="text-right space-y-0.5">
              <p className="text-slate-600">Makassar, 28 September 2026</p>
              <p className="font-bold text-slate-900">Mengetahui,</p>
              <p className="font-bold text-slate-900">Kepala SMK IT Ibnul Qayyim Makassar</p>
              <div className="h-12"></div>
              <p className="font-extrabold text-slate-900 underline tracking-wide">
                Drs. H. Muhammad Arsyad, M.Pd.
              </p>
              <p className="text-[9px] text-slate-500">NIP. 19740815 199903 1 004</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
