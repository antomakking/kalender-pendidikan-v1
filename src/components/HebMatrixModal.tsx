import React, { useState } from 'react';
import { BookOpen, Calendar, CheckCircle, Clock, Download, GraduationCap, X } from 'lucide-react';
import { ClassLevel } from '../types.ts';

interface HebMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  academicYear?: string;
}

interface SubjectRow {
  no: number;
  name: string;
  jpPerWeek: number;
  smt1Weeks: number;
  smt1TotalJp: number;
  smt2Weeks: number;
  smt2TotalJp: number;
  grandTotalJp: number;
}

// =========================================================================
// TA 2026/2027 SUBJECT DATA (41 JP/Pekan)
// =========================================================================
const KELAS_X_SUBJECTS_2627: SubjectRow[] = [
  { no: 1, name: 'Pendidikan Agama dan Budi Pekerti', jpPerWeek: 3, smt1Weeks: 19, smt1TotalJp: 57, smt2Weeks: 16, smt2TotalJp: 48, grandTotalJp: 105 },
  { no: 2, name: 'Pendidikan Pancasila', jpPerWeek: 1, smt1Weeks: 19, smt1TotalJp: 19, smt2Weeks: 16, smt2TotalJp: 16, grandTotalJp: 35 },
  { no: 3, name: 'Bahasa Indonesia', jpPerWeek: 2, smt1Weeks: 19, smt1TotalJp: 38, smt2Weeks: 16, smt2TotalJp: 32, grandTotalJp: 70 },
  { no: 4, name: 'Pendidikan Jasmani, Olahraga dan Kesehatan', jpPerWeek: 2, smt1Weeks: 19, smt1TotalJp: 38, smt2Weeks: 16, smt2TotalJp: 32, grandTotalJp: 70 },
  { no: 5, name: 'Sejarah Indonesia', jpPerWeek: 1, smt1Weeks: 19, smt1TotalJp: 19, smt2Weeks: 16, smt2TotalJp: 16, grandTotalJp: 35 },
  { no: 6, name: 'Seni Rupa', jpPerWeek: 2, smt1Weeks: 19, smt1TotalJp: 38, smt2Weeks: 16, smt2TotalJp: 32, grandTotalJp: 70 },
  { no: 7, name: 'Matematika', jpPerWeek: 2, smt1Weeks: 19, smt1TotalJp: 38, smt2Weeks: 16, smt2TotalJp: 32, grandTotalJp: 70 },
  { no: 8, name: 'Bahasa Inggris', jpPerWeek: 3, smt1Weeks: 19, smt1TotalJp: 57, smt2Weeks: 16, smt2TotalJp: 48, grandTotalJp: 105 },
  { no: 9, name: 'Informatika', jpPerWeek: 3, smt1Weeks: 19, smt1TotalJp: 57, smt2Weeks: 16, smt2TotalJp: 48, grandTotalJp: 105 },
  { no: 10, name: 'Proyek Ilmu Pengetahuan Alam dan Sosial', jpPerWeek: 2, smt1Weeks: 19, smt1TotalJp: 38, smt2Weeks: 16, smt2TotalJp: 32, grandTotalJp: 70 },
  { no: 11, name: 'Koding dan AI', jpPerWeek: 2, smt1Weeks: 19, smt1TotalJp: 38, smt2Weeks: 16, smt2TotalJp: 32, grandTotalJp: 70 },
  { no: 12, name: 'Dasar-dasar PPLG / Pemasaran', jpPerWeek: 6, smt1Weeks: 19, smt1TotalJp: 114, smt2Weeks: 16, smt2TotalJp: 96, grandTotalJp: 210 },
  { no: 13, name: 'Bahasa Arab', jpPerWeek: 3, smt1Weeks: 19, smt1TotalJp: 57, smt2Weeks: 16, smt2TotalJp: 48, grandTotalJp: 105 },
  { no: 14, name: 'Bimbingan Konseling', jpPerWeek: 1, smt1Weeks: 19, smt1TotalJp: 19, smt2Weeks: 16, smt2TotalJp: 16, grandTotalJp: 35 },
  { no: 15, name: 'Tahsin dan Tahfiz', jpPerWeek: 8, smt1Weeks: 19, smt1TotalJp: 152, smt2Weeks: 16, smt2TotalJp: 128, grandTotalJp: 280 },
];

const KELAS_XI_SUBJECTS_2627: SubjectRow[] = [
  { no: 1, name: 'Pendidikan Agama dan Budi Pekerti', jpPerWeek: 3, smt1Weeks: 19, smt1TotalJp: 57, smt2Weeks: 16, smt2TotalJp: 48, grandTotalJp: 105 },
  { no: 2, name: 'Pendidikan Pancasila', jpPerWeek: 1, smt1Weeks: 19, smt1TotalJp: 19, smt2Weeks: 16, smt2TotalJp: 16, grandTotalJp: 35 },
  { no: 3, name: 'Bahasa Indonesia', jpPerWeek: 2, smt1Weeks: 19, smt1TotalJp: 38, smt2Weeks: 16, smt2TotalJp: 32, grandTotalJp: 70 },
  { no: 4, name: 'Pendidikan Jasmani, Olahraga dan Kesehatan', jpPerWeek: 2, smt1Weeks: 19, smt1TotalJp: 38, smt2Weeks: 16, smt2TotalJp: 32, grandTotalJp: 70 },
  { no: 5, name: 'Sejarah Indonesia', jpPerWeek: 1, smt1Weeks: 19, smt1TotalJp: 19, smt2Weeks: 16, smt2TotalJp: 16, grandTotalJp: 35 },
  { no: 6, name: 'Matematika', jpPerWeek: 2, smt1Weeks: 19, smt1TotalJp: 38, smt2Weeks: 16, smt2TotalJp: 32, grandTotalJp: 70 },
  { no: 7, name: 'Bahasa Inggris', jpPerWeek: 3, smt1Weeks: 19, smt1TotalJp: 57, smt2Weeks: 16, smt2TotalJp: 48, grandTotalJp: 105 },
  { no: 8, name: 'Pemrograman Berbasis Teks, Grafis, dan Multimedia', jpPerWeek: 4, smt1Weeks: 19, smt1TotalJp: 76, smt2Weeks: 16, smt2TotalJp: 64, grandTotalJp: 140 },
  { no: 9, name: 'Pemrograman Web', jpPerWeek: 6, smt1Weeks: 19, smt1TotalJp: 114, smt2Weeks: 16, smt2TotalJp: 96, grandTotalJp: 210 },
  { no: 10, name: 'Basis Data', jpPerWeek: 3, smt1Weeks: 19, smt1TotalJp: 57, smt2Weeks: 16, smt2TotalJp: 48, grandTotalJp: 105 },
  { no: 11, name: 'Kreativitas, Inovasi, dan Kewirausahaan', jpPerWeek: 2, smt1Weeks: 19, smt1TotalJp: 38, smt2Weeks: 16, smt2TotalJp: 32, grandTotalJp: 70 },
  { no: 12, name: 'Bahasa Arab', jpPerWeek: 3, smt1Weeks: 19, smt1TotalJp: 57, smt2Weeks: 16, smt2TotalJp: 48, grandTotalJp: 105 },
  { no: 13, name: 'Bimbingan Konseling', jpPerWeek: 1, smt1Weeks: 19, smt1TotalJp: 19, smt2Weeks: 16, smt2TotalJp: 16, grandTotalJp: 35 },
  { no: 14, name: 'Tahsin dan Tahfiz', jpPerWeek: 8, smt1Weeks: 19, smt1TotalJp: 152, smt2Weeks: 16, smt2TotalJp: 128, grandTotalJp: 280 },
];

const KELAS_XII_SUBJECTS_2627: SubjectRow[] = [
  { no: 1, name: 'Pendidikan Agama dan Budi Pekerti', jpPerWeek: 3, smt1Weeks: 10, smt1TotalJp: 30, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 30 },
  { no: 2, name: 'Pendidikan Pancasila', jpPerWeek: 1, smt1Weeks: 10, smt1TotalJp: 10, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 10 },
  { no: 3, name: 'Bahasa Indonesia', jpPerWeek: 2, smt1Weeks: 10, smt1TotalJp: 20, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 20 },
  { no: 4, name: 'Matematika', jpPerWeek: 2, smt1Weeks: 10, smt1TotalJp: 20, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 20 },
  { no: 5, name: 'Bahasa Inggris', jpPerWeek: 3, smt1Weeks: 10, smt1TotalJp: 30, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 30 },
  { no: 6, name: 'Basis Data', jpPerWeek: 3, smt1Weeks: 10, smt1TotalJp: 30, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 30 },
  { no: 7, name: 'Pemrograman Berbasis Teks, Grafis, dan Multimedia', jpPerWeek: 6, smt1Weeks: 10, smt1TotalJp: 60, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 60 },
  { no: 8, name: 'Pemrograman Web dan Perangkat Bergerak', jpPerWeek: 7, smt1Weeks: 10, smt1TotalJp: 70, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 70 },
  { no: 9, name: 'Kreativitas, Inovasi, dan Kewirausahaan', jpPerWeek: 2, smt1Weeks: 10, smt1TotalJp: 20, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 20 },
  { no: 10, name: 'Bahasa Arab', jpPerWeek: 3, smt1Weeks: 10, smt1TotalJp: 30, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 30 },
  { no: 11, name: 'Tahsin dan Tahfiz', jpPerWeek: 8, smt1Weeks: 10, smt1TotalJp: 80, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 80 },
  { no: 12, name: 'Bimbingan Konseling', jpPerWeek: 1, smt1Weeks: 10, smt1TotalJp: 10, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 10 },
];

// =========================================================================
// TA 2025/2026 SUBJECT DATA (44 JP/Pekan)
// =========================================================================
const KELAS_X_SUBJECTS_2526: SubjectRow[] = [
  { no: 1, name: 'Pendidikan Agama dan Budi Pekerti', jpPerWeek: 3, smt1Weeks: 17, smt1TotalJp: 51, smt2Weeks: 14, smt2TotalJp: 42, grandTotalJp: 93 },
  { no: 2, name: 'Pendidikan Pancasila', jpPerWeek: 2, smt1Weeks: 17, smt1TotalJp: 34, smt2Weeks: 14, smt2TotalJp: 28, grandTotalJp: 62 },
  { no: 3, name: 'Bahasa Indonesia', jpPerWeek: 2, smt1Weeks: 17, smt1TotalJp: 34, smt2Weeks: 14, smt2TotalJp: 28, grandTotalJp: 62 },
  { no: 4, name: 'Pendidikan Jasmani, Olahraga dan Kesehatan', jpPerWeek: 2, smt1Weeks: 17, smt1TotalJp: 34, smt2Weeks: 14, smt2TotalJp: 28, grandTotalJp: 62 },
  { no: 5, name: 'Sejarah Indonesia', jpPerWeek: 2, smt1Weeks: 17, smt1TotalJp: 34, smt2Weeks: 14, smt2TotalJp: 28, grandTotalJp: 62 },
  { no: 6, name: 'Seni Rupa', jpPerWeek: 2, smt1Weeks: 17, smt1TotalJp: 34, smt2Weeks: 14, smt2TotalJp: 28, grandTotalJp: 62 },
  { no: 7, name: 'Matematika', jpPerWeek: 2, smt1Weeks: 17, smt1TotalJp: 34, smt2Weeks: 14, smt2TotalJp: 28, grandTotalJp: 62 },
  { no: 8, name: 'Bahasa Inggris', jpPerWeek: 3, smt1Weeks: 17, smt1TotalJp: 51, smt2Weeks: 14, smt2TotalJp: 42, grandTotalJp: 93 },
  { no: 9, name: 'Informatika', jpPerWeek: 3, smt1Weeks: 17, smt1TotalJp: 51, smt2Weeks: 14, smt2TotalJp: 42, grandTotalJp: 93 },
  { no: 10, name: 'Proyek Ilmu Pengetahuan Alam dan Sosial', jpPerWeek: 2, smt1Weeks: 17, smt1TotalJp: 34, smt2Weeks: 14, smt2TotalJp: 28, grandTotalJp: 62 },
  { no: 11, name: 'Koding dan AI', jpPerWeek: 2, smt1Weeks: 17, smt1TotalJp: 34, smt2Weeks: 14, smt2TotalJp: 28, grandTotalJp: 62 },
  { no: 12, name: 'Dasar-dasar PPLG', jpPerWeek: 6, smt1Weeks: 17, smt1TotalJp: 102, smt2Weeks: 14, smt2TotalJp: 84, grandTotalJp: 186 },
  { no: 13, name: 'Bahasa Arab', jpPerWeek: 3, smt1Weeks: 17, smt1TotalJp: 51, smt2Weeks: 14, smt2TotalJp: 42, grandTotalJp: 93 },
  { no: 14, name: 'Bimbingan Konseling', jpPerWeek: 2, smt1Weeks: 17, smt1TotalJp: 34, smt2Weeks: 14, smt2TotalJp: 28, grandTotalJp: 62 },
  { no: 15, name: 'Tahsin dan Tahfiz', jpPerWeek: 8, smt1Weeks: 17, smt1TotalJp: 136, smt2Weeks: 14, smt2TotalJp: 112, grandTotalJp: 248 },
];

const KELAS_XI_SUBJECTS_2526: SubjectRow[] = [
  { no: 1, name: 'Pendidikan Agama dan Budi Pekerti', jpPerWeek: 3, smt1Weeks: 17, smt1TotalJp: 51, smt2Weeks: 14, smt2TotalJp: 42, grandTotalJp: 93 },
  { no: 2, name: 'Pendidikan Pancasila', jpPerWeek: 2, smt1Weeks: 17, smt1TotalJp: 34, smt2Weeks: 14, smt2TotalJp: 28, grandTotalJp: 62 },
  { no: 3, name: 'Bahasa Indonesia', jpPerWeek: 2, smt1Weeks: 17, smt1TotalJp: 34, smt2Weeks: 14, smt2TotalJp: 28, grandTotalJp: 62 },
  { no: 4, name: 'Pendidikan Jasmani, Olahraga dan Kesehatan', jpPerWeek: 2, smt1Weeks: 17, smt1TotalJp: 34, smt2Weeks: 14, smt2TotalJp: 28, grandTotalJp: 62 },
  { no: 5, name: 'Sejarah Indonesia', jpPerWeek: 2, smt1Weeks: 17, smt1TotalJp: 34, smt2Weeks: 14, smt2TotalJp: 28, grandTotalJp: 62 },
  { no: 6, name: 'Matematika', jpPerWeek: 2, smt1Weeks: 17, smt1TotalJp: 34, smt2Weeks: 14, smt2TotalJp: 28, grandTotalJp: 62 },
  { no: 7, name: 'Bahasa Inggris', jpPerWeek: 3, smt1Weeks: 17, smt1TotalJp: 51, smt2Weeks: 14, smt2TotalJp: 42, grandTotalJp: 93 },
  { no: 8, name: 'Pemrograman Berbasis Teks, Grafis, dan Multimedia', jpPerWeek: 4, smt1Weeks: 17, smt1TotalJp: 68, smt2Weeks: 14, smt2TotalJp: 56, grandTotalJp: 124 },
  { no: 9, name: 'Pemrograman Web', jpPerWeek: 4, smt1Weeks: 17, smt1TotalJp: 68, smt2Weeks: 14, smt2TotalJp: 56, grandTotalJp: 124 },
  { no: 10, name: 'Pemrograman Perangkat Bergerak', jpPerWeek: 2, smt1Weeks: 17, smt1TotalJp: 34, smt2Weeks: 14, smt2TotalJp: 28, grandTotalJp: 62 },
  { no: 11, name: 'Basis Data', jpPerWeek: 3, smt1Weeks: 17, smt1TotalJp: 51, smt2Weeks: 14, smt2TotalJp: 42, grandTotalJp: 93 },
  { no: 12, name: 'Projek Kreatif dan Kewirausahaan', jpPerWeek: 2, smt1Weeks: 17, smt1TotalJp: 34, smt2Weeks: 14, smt2TotalJp: 28, grandTotalJp: 62 },
  { no: 13, name: 'Bahasa Arab', jpPerWeek: 3, smt1Weeks: 17, smt1TotalJp: 51, smt2Weeks: 14, smt2TotalJp: 42, grandTotalJp: 93 },
  { no: 14, name: 'Bimbingan Konseling', jpPerWeek: 2, smt1Weeks: 17, smt1TotalJp: 34, smt2Weeks: 14, smt2TotalJp: 28, grandTotalJp: 62 },
  { no: 15, name: 'Tahsin dan Tahfiz', jpPerWeek: 8, smt1Weeks: 17, smt1TotalJp: 136, smt2Weeks: 14, smt2TotalJp: 112, grandTotalJp: 248 },
];

const KELAS_XII_SUBJECTS_2526: SubjectRow[] = [
  { no: 1, name: 'Pendidikan Agama dan Budi Pekerti', jpPerWeek: 3, smt1Weeks: 9, smt1TotalJp: 27, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 27 },
  { no: 2, name: 'Pendidikan Pancasila', jpPerWeek: 2, smt1Weeks: 9, smt1TotalJp: 18, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 18 },
  { no: 3, name: 'Bahasa Indonesia', jpPerWeek: 2, smt1Weeks: 9, smt1TotalJp: 18, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 18 },
  { no: 4, name: 'Matematika', jpPerWeek: 2, smt1Weeks: 9, smt1TotalJp: 18, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 18 },
  { no: 5, name: 'Bahasa Inggris', jpPerWeek: 3, smt1Weeks: 9, smt1TotalJp: 27, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 27 },
  { no: 6, name: 'Basis Data', jpPerWeek: 3, smt1Weeks: 9, smt1TotalJp: 27, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 27 },
  { no: 7, name: 'Pemrograman Berbasis Teks, Grafis, dan Multimedia', jpPerWeek: 6, smt1Weeks: 9, smt1TotalJp: 54, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 54 },
  { no: 8, name: 'Pemrograman Web dan Perangkat Bergerak', jpPerWeek: 8, smt1Weeks: 9, smt1TotalJp: 72, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 72 },
  { no: 9, name: 'Produk Kreatif dan Kewirausahaan', jpPerWeek: 2, smt1Weeks: 9, smt1TotalJp: 18, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 18 },
  { no: 10, name: 'Bahasa Arab', jpPerWeek: 3, smt1Weeks: 9, smt1TotalJp: 27, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 27 },
  { no: 11, name: 'Tahsin dan Tahfiz', jpPerWeek: 8, smt1Weeks: 9, smt1TotalJp: 72, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 72 },
  { no: 12, name: 'Bimbingan Konseling', jpPerWeek: 2, smt1Weeks: 9, smt1TotalJp: 18, smt2Weeks: 0, smt2TotalJp: 0, grandTotalJp: 18 },
];

export const HebMatrixModal: React.FC<HebMatrixModalProps> = ({
  isOpen,
  onClose,
  academicYear = '2026/2027',
}) => {
  const [selectedClass, setSelectedClass] = useState<ClassLevel>('X');

  if (!isOpen) return null;

  const is2526 = academicYear === '2025/2026';

  const subjects = is2526
    ? selectedClass === 'X'
      ? KELAS_X_SUBJECTS_2526
      : selectedClass === 'XI'
      ? KELAS_XI_SUBJECTS_2526
      : KELAS_XII_SUBJECTS_2526
    : selectedClass === 'X'
    ? KELAS_X_SUBJECTS_2627
    : selectedClass === 'XI'
    ? KELAS_XI_SUBJECTS_2627
    : KELAS_XII_SUBJECTS_2627;

  const totalJpPerWeek = subjects.reduce((acc, curr) => acc + curr.jpPerWeek, 0);
  const totalSmt1Jp = subjects.reduce((acc, curr) => acc + curr.smt1TotalJp, 0);
  const totalSmt2Jp = subjects.reduce((acc, curr) => acc + curr.smt2TotalJp, 0);
  const grandTotalJp = subjects.reduce((acc, curr) => acc + curr.grandTotalJp, 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 relative my-auto flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#143c14] text-[#ffcc00] flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-5 h-5 text-[#ffcc00]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
                  Matriks Distribusi Jam Pelajaran (JP) & HEB
                </h3>
                <span className="bg-[#ffcc00] text-[#143c14] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  TA. {academicYear}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Alokasi waktu tatap muka, pekan efektif KBM, dan agenda khusus per tingkat kelas.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Class Selection Tabs & Quick Summary Stats */}
        <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 bg-slate-50 px-4 rounded-xl my-3 border border-slate-200">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <GraduationCap className="w-4 h-4 text-emerald-800" />
              Pilih Kelas:
            </span>
            <button
              onClick={() => setSelectedClass('X')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                selectedClass === 'X'
                  ? 'bg-[#143c14] text-[#ffcc00] shadow-sm ring-2 ring-[#ffcc00]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Kelas X ({is2526 ? '15 Mapel' : '15 Mapel'})
            </button>
            <button
              onClick={() => setSelectedClass('XI')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                selectedClass === 'XI'
                  ? 'bg-[#143c14] text-[#ffcc00] shadow-sm ring-2 ring-[#ffcc00]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Kelas XI ({is2526 ? '15 Mapel' : '14 Mapel'})
            </button>
            <button
              onClick={() => setSelectedClass('XII')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                selectedClass === 'XII'
                  ? 'bg-[#143c14] text-[#ffcc00] shadow-sm ring-2 ring-[#ffcc00]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Kelas XII (Industri & PKL)
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="bg-emerald-100/80 text-emerald-950 px-3 py-1 rounded-lg border border-emerald-300 font-bold">
              <span>Beban/Pekan: </span>
              <span className="text-emerald-900 font-mono font-black text-sm">{totalJpPerWeek} JP</span>
            </div>
            <div className="bg-amber-100/80 text-amber-950 px-3 py-1 rounded-lg border border-amber-300 font-bold">
              <span>Total Alokasi: </span>
              <span className="text-amber-950 font-mono font-black text-sm">{grandTotalJp} JP</span>
            </div>
          </div>
        </div>

        {/* Scrollable Matrix Table */}
        <div className="flex-1 overflow-auto border border-slate-200 rounded-xl bg-white shadow-2xs">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-[#143c14] text-white border-b-2 border-[#ffcc00]">
                <th className="p-2.5 w-10 text-center font-bold">NO</th>
                <th className="p-2.5 font-extrabold min-w-[220px]">MATA PELAJARAN (KELAS {selectedClass} - {academicYear})</th>
                <th className="p-2.5 text-center font-extrabold bg-[#0e2a0e] border-r border-emerald-900">JP/WKW</th>
                
                {/* Semester 1 Header */}
                <th className="p-2.5 text-center font-extrabold bg-amber-900/60 border-r border-amber-800">
                  SMT 1 (JUL - DES)
                </th>

                {/* Semester 2 Header */}
                <th className="p-2.5 text-center font-extrabold bg-sky-900/60 border-r border-sky-800">
                  SMT 2 (JAN - JUN)
                </th>

                <th className="p-2.5 text-center font-black bg-[#ffcc00] text-[#143c14]">
                  TOTAL JAM
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
              {subjects.map((row) => (
                <tr key={row.no} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-2 text-center text-slate-500 font-bold">{row.no}</td>
                  <td className="p-2 font-bold text-slate-900">{row.name}</td>
                  <td className="p-2 text-center font-extrabold font-mono text-emerald-900 bg-emerald-50/50 border-r border-slate-200">
                    {row.jpPerWeek} JP
                  </td>
                  
                  {/* Semester 1 Total */}
                  <td className="p-2 text-center font-bold font-mono text-amber-950 bg-amber-50/30 border-r border-slate-200">
                    {row.smt1TotalJp} JP <span className="text-[10px] text-slate-400 font-normal">({row.smt1Weeks} Pekan)</span>
                  </td>

                  {/* Semester 2 Total */}
                  <td className="p-2 text-center font-bold font-mono text-sky-950 bg-sky-50/30 border-r border-slate-200">
                    {row.smt2TotalJp > 0 ? (
                      <>{row.smt2TotalJp} JP <span className="text-[10px] text-slate-400 font-normal">({row.smt2Weeks} Pekan)</span></>
                    ) : (
                      <span className="text-slate-400 font-normal italic">PKL / Ujian Akhir</span>
                    )}
                  </td>

                  {/* Grand Total */}
                  <td className="p-2 text-center font-black font-mono text-slate-950 bg-amber-100/60">
                    {row.grandTotalJp} JP
                  </td>
                </tr>
              ))}

              {/* Total Footer Row */}
              <tr className="bg-[#143c14] text-white font-black text-xs border-t-2 border-[#ffcc00]">
                <td colSpan={2} className="p-2.5 text-right uppercase tracking-wider text-[#ffcc00]">
                  JUMLAH TOTAL JAM PELAJARAN (JP)
                </td>
                <td className="p-2.5 text-center font-mono text-[#ffcc00] text-sm bg-[#0e2a0e]">
                  {totalJpPerWeek} JP
                </td>
                <td className="p-2.5 text-center font-mono text-amber-300 text-sm bg-amber-950/80">
                  {totalSmt1Jp} JP
                </td>
                <td className="p-2.5 text-center font-mono text-sky-300 text-sm bg-sky-950/80">
                  {totalSmt2Jp} JP
                </td>
                <td className="p-2.5 text-center font-mono text-[#143c14] bg-[#ffcc00] text-sm font-black">
                  {grandTotalJp} JP
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Special Activity Schedule Cards per Selected Class & Academic Year */}
        <div className="mt-3 pt-3 border-t border-slate-200 shrink-0">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-800" />
            <span>Alokasi Agenda Khusus & Tahapan Belajar (Kelas {selectedClass} - {academicYear}):</span>
          </h4>

          {is2526 ? (
            selectedClass === 'X' || selectedClass === 'XI' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-950">
                  <span className="font-bold block text-amber-900">Sept (Pekan 5) & Feb (Pekan 4)</span>
                  <span>Sumatif Tengah Semester (STS) Ganjil & Genap</span>
                </div>
                <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-950">
                  <span className="font-bold block text-rose-900">Desember (Pekan 1-2)</span>
                  <span>Sumatif Akhir Semester (SAS) Ganjil</span>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950">
                  <span className="font-bold block text-emerald-900">Februari - Maret</span>
                  <span>Libur Awal Ramadhan, Pesantren & Idul Fitri</span>
                </div>
                <div className="p-2 rounded-lg bg-sky-50 border border-sky-200 text-sky-950">
                  <span className="font-bold block text-sky-900">Juni (Pekan 1-2)</span>
                  <span>SAS Genap / UKK Kenaikan Kelas & Rapor</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-950">
                  <span className="font-bold block text-amber-900">Sept - Nov (Smt 1)</span>
                  <span>SAS, UKK, Persiapan TKA, TKA & Ujian Sekolah</span>
                </div>
                <div className="p-2 rounded-lg bg-sky-50 border border-sky-200 text-sky-950">
                  <span className="font-bold block text-sky-900">Nov - Mar (5 Bulan)</span>
                  <span>Pembekalan & Praktek Kerja Lapangan (PKL)</span>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950">
                  <span className="font-bold block text-emerald-900">April</span>
                  <span>Ujian PKL & Ujian Tasmi' Al-Qur'an</span>
                </div>
                <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-950">
                  <span className="font-bold block text-rose-900">Mei</span>
                  <span>Persiapan & Wisuda Penamatan Kelas XII</span>
                </div>
              </div>
            )
          ) : (
            selectedClass === 'X' || selectedClass === 'XI' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-950">
                  <span className="font-bold block text-amber-900">Juli (Pekan 3)</span>
                  <span>MPLS & Masa Transisi Santri Baru</span>
                </div>
                <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-950">
                  <span className="font-bold block text-rose-900">Desember (Pekan 1-2)</span>
                  <span>Sumatif Akhir Semester (SAS) Ganjil</span>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950">
                  <span className="font-bold block text-emerald-900">Februari - Maret</span>
                  <span>Pesantren Ramadhan & Libur Idul Fitri</span>
                </div>
                <div className="p-2 rounded-lg bg-sky-50 border border-sky-200 text-sky-950">
                  <span className="font-bold block text-sky-900">Juni (Pekan 1-2)</span>
                  <span>SAS Genap / UKK & Penerimaan Rapor</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-950">
                  <span className="font-bold block text-amber-900">Sept - Okt (Smt 1)</span>
                  <span>Ujian Tasmi', SAS, TKA & Ujian Sekolah</span>
                </div>
                <div className="p-2 rounded-lg bg-sky-50 border border-sky-200 text-sky-950">
                  <span className="font-bold block text-sky-900">Nov - Mar (5 Bulan)</span>
                  <span>Pembekalan & Praktek Kerja Lapangan (PKL)</span>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950">
                  <span className="font-bold block text-emerald-900">April</span>
                  <span>Laporan PKL, Tes SNBT & UKK Industri</span>
                </div>
                <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-950">
                  <span className="font-bold block text-rose-900">Mei</span>
                  <span>Persiapan & Wisuda Penamatan (Pena Matan)</span>
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer info & close */}
        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Data terintegrasi secara otomatis sesuai SK Kurikulum Operasional Satuan Pendidikan (KOSP) TA. {academicYear}.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-bold text-white bg-[#143c14] hover:bg-[#0b240b] rounded-lg transition-colors cursor-pointer"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
};
