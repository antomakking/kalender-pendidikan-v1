import { AcademicEvent } from '../types.ts';

export function generateStandaloneHtml(events: AcademicEvent[]): string {
  const jsonEvents = JSON.stringify(events, null, 2);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sistem Informasi Kalender Akademik - SMK IT Ibnul Qayyim Makassar</title>
  <meta name="description" content="Kalender Akademik SMK IT Ibnul Qayyim Makassar Tahun Pelajaran 2026/2027">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#f0fdf4',
              100: '#dcfce7',
              200: '#bbf7d0',
              500: '#22c55e',
              600: '#16a34a',
              700: '#15803d',
              800: '#166534',
              900: '#14532d',
            }
          }
        }
      }
    }
  </script>
  
  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>
  
  <!-- Google Fonts: Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  
  <style>
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }
    .tabular-nums {
      font-variant-numeric: tabular-nums;
    }
    @media print {
      .no-print, header, nav, button, .modal-backdrop {
        display: none !important;
      }
      body {
        background: white !important;
        color: black !important;
      }
      .print-only {
        display: block !important;
      }
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col selection:bg-emerald-200 selection:text-emerald-900">

  <!-- TOP HEADER / BRAND ZONE -->
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- Zone 1: Brand Wordmark & Identity -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
          <i data-lucide="graduation-cap" class="w-5 h-5"></i>
        </div>
        <div>
          <h1 class="font-bold text-slate-900 text-base sm:text-lg leading-tight">SMK IT Ibnul Qayyim Makassar</h1>
          <p class="text-xs text-slate-500 font-medium hidden sm:block">Sistem Informasi Kalender Akademik Terpadu</p>
        </div>
      </div>

      <!-- Zone 2: Navigation Links -->
      <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <a href="#kalender" class="text-emerald-700 hover:text-emerald-800 transition-colors">Kalender</a>
        <a href="#agenda-mendatang" class="hover:text-slate-900 transition-colors">Agenda Mendatang</a>
        <a href="#pedoman" onclick="openInfoModal()" class="hover:text-slate-900 transition-colors">Informasi Sekolah</a>
      </nav>

      <!-- Zone 3: Actions -->
      <div class="flex items-center gap-2">
        <button onclick="window.print()" class="no-print inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200">
          <i data-lucide="printer" class="w-4 h-4"></i>
          <span class="hidden sm:inline">Cetak Kalender</span>
        </button>
        <button onclick="openAddModal()" class="no-print inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs">
          <i data-lucide="plus" class="w-4 h-4"></i>
          <span>Tambah Kegiatan</span>
        </button>
      </div>
    </div>
  </header>

  <!-- MAIN APP CONTAINER -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">

    <!-- HERO / QUICK STATS BANNER -->
    <section class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>Tahun Ajaran <span id="labelTahunAjaran">2026/2027</span></span>
            <span>·</span>
            <span id="labelSemester">Semester Ganjil</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900">Agenda & Kalender Akademik Resmi</h2>
          <p class="text-sm text-slate-500 mt-0.5">Panduan jadwal belajar, ujian kompetensi kejuruan, projek P5, dan hari libur sekolah.</p>
        </div>

        <div class="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span class="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <i data-lucide="clock" class="w-3.5 h-3.5 text-emerald-600"></i>
            Hari ini: <strong class="text-slate-900">28 September 2026</strong>
          </span>
          <button onclick="resetToDefaultData()" class="no-print text-xs text-slate-500 hover:text-rose-600 underline ml-2">
            Reset Data Default
          </button>
        </div>
      </div>

      <!-- Quick Stats Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span class="text-xs text-slate-500 font-medium">Hari Efektif Belajar (HEB)</span>
          <div class="text-2xl font-bold text-slate-900 mt-1 tabular-nums">114 <span class="text-xs font-normal text-slate-400">Hari</span></div>
        </div>
        <div class="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
          <span class="text-xs text-emerald-700 font-medium">Total Agenda Semester</span>
          <div class="text-2xl font-bold text-emerald-900 mt-1 tabular-nums" id="statTotalAgenda">0</div>
        </div>
        <div class="p-3 bg-sky-50/60 rounded-xl border border-sky-100">
          <span class="text-xs text-sky-700 font-medium">Agenda Mendatang (14 Hari)</span>
          <div class="text-2xl font-bold text-sky-900 mt-1 tabular-nums" id="statUpcoming">0</div>
        </div>
        <div class="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
          <span class="text-xs text-rose-700 font-medium">Hari Libur Resmi</span>
          <div class="text-2xl font-bold text-rose-900 mt-1 tabular-nums" id="statHolidays">0</div>
        </div>
      </div>
    </section>

    <!-- CALENDAR CONTROLS & FILTER BAR -->
    <section class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4" id="kalender">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <!-- View Switcher Tabs -->
        <div class="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 self-start">
          <button id="viewBtn-month" onclick="switchView('month')" class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors bg-white text-slate-900 shadow-xs">
            Bulanan
          </button>
          <button id="viewBtn-year" onclick="switchView('year')" class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors text-slate-600 hover:text-slate-900">
            Tahun Ajaran (12 Bulan)
          </button>
          <button id="viewBtn-week" onclick="switchView('week')" class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors text-slate-600 hover:text-slate-900">
            Mingguan
          </button>
          <button id="viewBtn-agenda" onclick="switchView('agenda')" class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors text-slate-600 hover:text-slate-900">
            Daftar Agenda
          </button>
        </div>

        <!-- Period Navigation -->
        <div class="flex items-center gap-2">
          <button onclick="navigatePeriod(-1)" class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600" title="Sebelumnya">
            <i data-lucide="chevron-left" class="w-4 h-4"></i>
          </button>
          <button onclick="goToToday()" class="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700">
            Hari Ini
          </button>
          <button onclick="navigatePeriod(1)" class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600" title="Berikutnya">
            <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </button>

          <span id="currentPeriodDisplay" class="font-bold text-slate-900 text-sm sm:text-base ml-2 min-w-[160px]">
            September 2026
          </span>
        </div>

        <!-- Academic Year & Semester Selectors -->
        <div class="flex items-center gap-2">
          <select id="selectAcademicYear" onchange="onAcademicYearChange()" class="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="2026/2027" selected>TA 2026/2027</option>
            <option value="2025/2026">TA 2025/2026</option>
            <option value="2027/2028">TA 2027/2028</option>
          </select>

          <select id="selectSemester" onchange="onSemesterChange()" class="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="all">Semua Semester</option>
            <option value="ganjil" selected>Semester Ganjil (Jul - Des)</option>
            <option value="genap">Semester Genap (Jan - Jun)</option>
          </select>
        </div>
      </div>

      <!-- Search & Category Filters -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <!-- Search input -->
        <div class="relative w-full md:w-72">
          <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
          <input type="text" id="searchInput" oninput="onSearchChange()" placeholder="Cari agenda, ujian, P5, libur..." class="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500">
        </div>

        <!-- Category filter buttons -->
        <div class="flex flex-wrap items-center gap-1.5 text-xs">
          <button onclick="setCategoryFilter('all')" id="catFilter-all" class="px-2.5 py-1 rounded-md font-medium bg-slate-900 text-white transition-colors">
            Semua
          </button>
          <button onclick="setCategoryFilter('academic')" id="catFilter-academic" class="px-2.5 py-1 rounded-md font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors">
            Akademik & Ujian
          </button>
          <button onclick="setCategoryFilter('holiday')" id="catFilter-holiday" class="px-2.5 py-1 rounded-md font-medium text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors">
            Hari Libur
          </button>
          <button onclick="setCategoryFilter('student')" id="catFilter-student" class="px-2.5 py-1 rounded-md font-medium text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors">
            Kesiswaan & P5
          </button>
          <button onclick="setCategoryFilter('teacher')" id="catFilter-teacher" class="px-2.5 py-1 rounded-md font-medium text-violet-800 bg-violet-50 hover:bg-violet-100 border border-violet-200 transition-colors">
            Rapat & Guru
          </button>
        </div>
      </div>
    </section>

    <!-- CONTENT WORKSPACE: CALENDAR VIEW + UPCOMING EVENTS PANEL -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      
      <!-- MAIN CALENDAR CONTAINER (Col 1-3) -->
      <section class="lg:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        
        <!-- View Container: Monthly Grid View -->
        <div id="container-month" class="p-4 sm:p-5">
          <!-- Weekday Headers (Senin - Ahad) -->
          <div class="grid grid-cols-7 text-center font-semibold text-xs text-slate-500 pb-2 mb-1 border-b border-slate-100">
            <span class="py-1">Sen</span>
            <span class="py-1">Sel</span>
            <span class="py-1">Rab</span>
            <span class="py-1">Kam</span>
            <span class="py-1">Jum</span>
            <span class="py-1">Sab</span>
            <span class="py-1 text-rose-600">Ahad</span>
          </div>

          <!-- Date Cells Grid -->
          <div id="monthGrid" class="grid grid-cols-7 gap-1 sm:gap-1.5 auto-rows-fr">
            <!-- Dynamic days inserted by renderMonthGrid() -->
          </div>
        </div>

        <!-- View Container: Multi-Month / Yearly View -->
        <div id="container-year" class="p-4 sm:p-6 hidden">
          <div id="yearMonthsGrid" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <!-- Dynamic mini-months inserted by renderYearGrid() -->
          </div>
        </div>

        <!-- View Container: Weekly View -->
        <div id="container-week" class="p-4 sm:p-5 hidden">
          <div id="weekDaysGrid" class="space-y-4">
            <!-- Dynamic days for week inserted by renderWeekGrid() -->
          </div>
        </div>

        <!-- View Container: Agenda List View -->
        <div id="container-agenda" class="p-4 sm:p-5 hidden">
          <div id="agendaListGrid" class="space-y-3">
            <!-- Dynamic list inserted by renderAgendaList() -->
          </div>
        </div>

      </section>

      <!-- SIDEBAR: AGENDA MENDATANG (Col 4) -->
      <aside class="space-y-6" id="agenda-mendatang">
        
        <!-- Upcoming Events Card -->
        <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <i data-lucide="bell" class="w-4 h-4 text-emerald-700"></i>
              <h3 class="font-bold text-slate-900 text-sm">Agenda Mendatang</h3>
            </div>
            <span class="text-xs text-slate-400 font-medium">14 Hari ke Depan</span>
          </div>

          <div id="upcomingEventsList" class="mt-3 space-y-2.5">
            <!-- Dynamic upcoming events inserted by renderUpcomingEvents() -->
          </div>
        </div>

        <!-- Information & Legend Card -->
        <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Kategori Agenda</h4>
          <div class="space-y-2 text-xs">
            <div class="flex items-center gap-2.5">
              <span class="w-3 h-3 rounded-full bg-emerald-600 shrink-0"></span>
              <span class="text-slate-700 font-medium">Akademik & Ujian / Asesmen</span>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="w-3 h-3 rounded-full bg-rose-600 shrink-0"></span>
              <span class="text-slate-700 font-medium">Hari Libur Nasional & Sekolah</span>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="w-3 h-3 rounded-full bg-sky-600 shrink-0"></span>
              <span class="text-slate-700 font-medium">Kesiswaan, P5 & Ekstrakurikuler</span>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="w-3 h-3 rounded-full bg-violet-600 shrink-0"></span>
              <span class="text-slate-700 font-medium">Rapat, Supervisi & Guru</span>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-slate-100">
            <div class="bg-emerald-50 rounded-xl p-3 border border-emerald-100 text-emerald-950 text-xs space-y-1">
              <p class="font-semibold">SMK IT Ibnul Qayyim Makassar</p>
              <p class="text-emerald-800 text-[11px] leading-relaxed">Sekolah Menengah Kejuruan berbasis Islam & IT terakreditasi A di Makassar. Mencetak Generasi Muslim yang Shalih, Hafizh dan Terampil. Hafizh Quran Jago Komputer.</p>
              <p class="text-emerald-900 text-[11px] font-bold">Program: Rekayasa Perangkat Lunak (RPL) & Bisnis Digital (BD)</p>
            </div>
          </div>
        </div>

      </aside>

    </div>

  </main>

  <!-- FOOTER -->
  <footer class="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-12">
    <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p>© 2026 SMK IT Ibnul Qayyim Makassar · Sistem Informasi Kalender Akademik</p>
      <p class="text-slate-400">Jl. Goa Ria Taman Bunga 2, Laikang, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan 90242</p>
    </div>
  </footer>

  <!-- MODAL: EVENT DETAIL -->
  <div id="modalEventDetail" class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 hidden">
    <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
      <button onclick="closeModal('modalEventDetail')" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <div id="detailCategoryBadge" class="inline-block px-2.5 py-1 rounded-md text-xs font-semibold mb-3">
        Kategori
      </div>

      <h3 id="detailTitle" class="text-lg font-bold text-slate-900 leading-snug">
        Judul Agenda
      </h3>

      <div class="mt-4 space-y-2.5 text-xs text-slate-600 border-y border-slate-100 py-3.5">
        <div class="flex items-center gap-2">
          <i data-lucide="calendar" class="w-4 h-4 text-emerald-600 shrink-0"></i>
          <span id="detailDateRange" class="font-medium text-slate-900">28 September 2026</span>
        </div>
        <div class="flex items-center gap-2">
          <i data-lucide="clock" class="w-4 h-4 text-emerald-600 shrink-0"></i>
          <span id="detailTime">08:00 - 15:00 WITA</span>
        </div>
        <div class="flex items-center gap-2">
          <i data-lucide="map-pin" class="w-4 h-4 text-emerald-600 shrink-0"></i>
          <span id="detailLocation">Lab Komputer RPL</span>
        </div>
        <div class="flex items-center gap-2">
          <i data-lucide="users" class="w-4 h-4 text-emerald-600 shrink-0"></i>
          <span id="detailAudience">Semua Siswa</span>
        </div>
      </div>

      <div class="mt-4">
        <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Keterangan / Rincian Kegiatan</h4>
        <p id="detailDescription" class="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
          Deskripsi lengkap kegiatan akademik sekolah.
        </p>
      </div>

      <div class="mt-6 flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <button id="btnDeleteEvent" class="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1">
          Hapus Agenda
        </button>
        <div class="flex items-center gap-2">
          <button onclick="closeModal('modalEventDetail')" class="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL: ADD / EDIT EVENT FORM -->
  <div id="modalAddEvent" class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 hidden">
    <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
      <button onclick="closeModal('modalAddEvent')" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <h3 class="text-lg font-bold text-slate-900 mb-1">Tambah Agenda Akademik Baru</h3>
      <p class="text-xs text-slate-500 mb-4">Agenda akan tersimpan secara otomatis di localStorage peramban Anda.</p>

      <form id="formAddEvent" onsubmit="handleSaveEvent(event)" class="space-y-3.5 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Nama / Judul Kegiatan *</label>
          <input type="text" id="inputTitle" required placeholder="Contoh: Asesmen Sumatif Akhir Jenjang RPL" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500">
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Tanggal Mulai *</label>
            <input type="date" id="inputStartDate" required class="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500">
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Tanggal Selesai *</label>
            <input type="date" id="inputEndDate" required class="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500">
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Kategori Kegiatan *</label>
            <select id="inputCategory" required class="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="academic">Akademik & Ujian / Asesmen</option>
              <option value="holiday">Hari Libur Nasional & Sekolah</option>
              <option value="student">Kesiswaan, P5 & Ekstrakurikuler</option>
              <option value="teacher">Rapat, Supervisi & Guru</option>
            </select>
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Sasaran / Peserta *</label>
            <input type="text" id="inputAudience" required placeholder="Semua Siswa / Kelas X / Dewan Guru" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500">
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Waktu Pelaksanaan</label>
            <input type="text" id="inputTimeRange" placeholder="Contoh: 07:30 - 15:00 WITA" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500">
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Tempat / Lokasi</label>
            <input type="text" id="inputLocation" placeholder="Contoh: Lab Komputer RPL / Aula" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500">
          </div>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Keterangan / Deskripsi Agenda</label>
          <textarea id="inputDescription" rows="3" placeholder="Rincian atau petunjuk teknis pelaksanaan kegiatan..." class="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button type="button" onclick="closeModal('modalAddEvent')" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold transition-colors">
            Batal
          </button>
          <button type="submit" class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold transition-colors shadow-xs">
            Simpan Agenda
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- JAVASCRIPT LOGIC -->
  <script>
    // Initial Seed Data
    const INITIAL_EVENTS = ${jsonEvents};

    // State Variables
    let events = [];
    let currentView = 'month'; // 'month' | 'year' | 'week' | 'agenda'
    let currentYear = 2026;
    let currentMonth = 8; // 0-indexed (8 = September)
    let selectedAcademicYear = '2026/2027';
    let selectedSemester = 'all';
    let activeCategoryFilter = 'all';
    let searchQuery = '';
    const TODAY_STR = '2026-09-28';

    const MONTH_NAMES = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const DAY_NAMES = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Ahad'];

    const CATEGORIES_CONFIG = {
      academic: {
        label: 'Akademik & Ujian',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        dotClass: 'bg-emerald-600',
        cellClass: 'bg-emerald-50 text-emerald-900 border-l-2 border-emerald-600'
      },
      holiday: {
        label: 'Hari Libur',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
        dotClass: 'bg-rose-600',
        cellClass: 'bg-rose-50 text-rose-900 border-l-2 border-rose-600'
      },
      student: {
        label: 'Kesiswaan & P5',
        badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
        dotClass: 'bg-sky-600',
        cellClass: 'bg-sky-50 text-sky-900 border-l-2 border-sky-600'
      },
      teacher: {
        label: 'Rapat & Guru',
        badgeClass: 'bg-violet-100 text-violet-800 border-violet-300',
        dotClass: 'bg-violet-600',
        cellClass: 'bg-violet-50 text-violet-900 border-l-2 border-violet-600'
      }
    };

    // Load Events from LocalStorage
    function loadEvents() {
      const stored = localStorage.getItem('smk_it_kalender_events');
      if (stored) {
        try {
          events = JSON.parse(stored);
        } catch (e) {
          events = [...INITIAL_EVENTS];
        }
      } else {
        events = [...INITIAL_EVENTS];
        saveEvents();
      }
    }

    function saveEvents() {
      localStorage.setItem('smk_it_kalender_events', JSON.stringify(events));
      renderCurrentView();
      updateStats();
      renderUpcomingEvents();
    }

    function resetToDefaultData() {
      if (confirm('Kembalikan semua data kalender ke pengaturan bawaan SMK IT Ibnul Qayyim?')) {
        events = [...INITIAL_EVENTS];
        saveEvents();
      }
    }

    // Filter Logic
    function getFilteredEvents() {
      return events.filter(evt => {
        // Category filter
        if (activeCategoryFilter !== 'all' && evt.category !== activeCategoryFilter) return false;
        
        // Semester filter
        if (selectedSemester !== 'all' && evt.semester !== selectedSemester) return false;

        // Search query
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
    }

    function isDateInRange(targetDate, start, end) {
      return targetDate >= start && targetDate <= end;
    }

    function getEventsForDate(dateStr) {
      const filtered = getFilteredEvents();
      return filtered.filter(evt => isDateInRange(dateStr, evt.startDate, evt.endDate));
    }

    // View Switching
    function switchView(viewName) {
      currentView = viewName;
      ['month', 'year', 'week', 'agenda'].forEach(v => {
        document.getElementById('container-' + v).classList.add('hidden');
        const btn = document.getElementById('viewBtn-' + v);
        btn.className = 'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors text-slate-600 hover:text-slate-900';
      });

      document.getElementById('container-' + viewName).classList.remove('hidden');
      const activeBtn = document.getElementById('viewBtn-' + viewName);
      activeBtn.className = 'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors bg-white text-slate-900 shadow-xs';

      renderCurrentView();
    }

    function renderCurrentView() {
      updatePeriodDisplay();
      if (currentView === 'month') renderMonthGrid();
      else if (currentView === 'year') renderYearGrid();
      else if (currentView === 'week') renderWeekGrid();
      else if (currentView === 'agenda') renderAgendaList();

      if (window.lucide) lucide.createIcons();
    }

    function updatePeriodDisplay() {
      const display = document.getElementById('currentPeriodDisplay');
      if (currentView === 'month') {
        display.textContent = MONTH_NAMES[currentMonth] + ' ' + currentYear;
      } else if (currentView === 'year') {
        display.textContent = 'Tahun Ajaran ' + selectedAcademicYear;
      } else if (currentView === 'week') {
        display.textContent = 'Pekan ' + (Math.floor(28 / 7) + 1) + ' · ' + MONTH_NAMES[currentMonth] + ' ' + currentYear;
      } else {
        display.textContent = 'Daftar Agenda ' + selectedAcademicYear;
      }
    }

    function navigatePeriod(delta) {
      if (currentView === 'month') {
        currentMonth += delta;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        } else if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
      } else if (currentView === 'year') {
        currentYear += delta;
      }
      renderCurrentView();
    }

    function goToToday() {
      currentYear = 2026;
      currentMonth = 8; // September
      renderCurrentView();
    }

    function onAcademicYearChange() {
      selectedAcademicYear = document.getElementById('selectAcademicYear').value;
      document.getElementById('labelTahunAjaran').textContent = selectedAcademicYear;
      renderCurrentView();
      updateStats();
    }

    function onSemesterChange() {
      selectedSemester = document.getElementById('selectSemester').value;
      const label = selectedSemester === 'ganjil' ? 'Semester Ganjil' : (selectedSemester === 'genap' ? 'Semester Genap' : 'Semua Semester');
      document.getElementById('labelSemester').textContent = label;
      renderCurrentView();
      updateStats();
    }

    function setCategoryFilter(category) {
      activeCategoryFilter = category;
      ['all', 'academic', 'holiday', 'student', 'teacher'].forEach(cat => {
        const btn = document.getElementById('catFilter-' + cat);
        if (cat === category) {
          btn.className = 'px-2.5 py-1 rounded-md font-medium bg-slate-900 text-white transition-colors';
        } else {
          btn.className = 'px-2.5 py-1 rounded-md font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors';
        }
      });
      renderCurrentView();
    }

    function onSearchChange() {
      searchQuery = document.getElementById('searchInput').value;
      renderCurrentView();
    }

    // MONTHLY GRID RENDERER
    function renderMonthGrid() {
      const grid = document.getElementById('monthGrid');
      grid.innerHTML = '';

      const firstDay = new Date(currentYear, currentMonth, 1);
      const lastDay = new Date(currentYear, currentMonth + 1, 0);
      const totalDays = lastDay.getDate();

      // Monday = 0
      const startDay = (firstDay.getDay() + 6) % 7;
      const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();

      // Prev month filler
      for (let i = startDay - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        const prevM = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
        const dateStr = formatDate(prevY, prevM, day);
        grid.appendChild(createDayCell(day, dateStr, false));
      }

      // Current month days
      for (let d = 1; d <= totalDays; d++) {
        const dateStr = formatDate(currentYear, currentMonth, d);
        grid.appendChild(createDayCell(d, dateStr, true));
      }

      // Next month filler
      const totalCells = grid.children.length;
      const targetCells = totalCells <= 35 ? 35 : 42;
      const remaining = targetCells - totalCells;
      for (let d = 1; d <= remaining; d++) {
        const nextM = currentMonth === 11 ? 0 : currentMonth + 1;
        const nextY = currentMonth === 11 ? currentYear + 1 : currentYear;
        const dateStr = formatDate(nextY, nextM, d);
        grid.appendChild(createDayCell(d, dateStr, false));
      }
    }

    function formatDate(y, m, d) {
      const mm = String(m + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      return y + '-' + mm + '-' + dd;
    }

    function createDayCell(dayNumber, dateStr, isCurrentMonth) {
      const cell = document.createElement('div');
      const isToday = dateStr === TODAY_STR;
      const dayEvents = getEventsForDate(dateStr);

      cell.className = 'min-h-[96px] sm:min-h-[108px] p-1.5 sm:p-2 border border-slate-100 rounded-xl transition-all cursor-pointer flex flex-col justify-between ' + 
        (isCurrentMonth ? 'bg-white hover:border-slate-300 hover:shadow-xs' : 'bg-slate-50/60 text-slate-400') + 
        (isToday ? ' ring-2 ring-emerald-600 bg-emerald-50/20' : '');

      cell.ondragover = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        cell.classList.add('border-2', 'border-dashed', 'border-emerald-600', 'bg-emerald-50');
      };
      cell.ondragleave = (e) => {
        cell.classList.remove('border-2', 'border-dashed', 'border-emerald-600', 'bg-emerald-50');
      };
      cell.ondrop = (e) => {
        e.preventDefault();
        cell.classList.remove('border-2', 'border-dashed', 'border-emerald-600', 'bg-emerald-50');
        const id = e.dataTransfer.getData('text/plain');
        if (id) rescheduleEvent(id, dateStr);
      };

      cell.onclick = () => {
        if (dayEvents.length > 0) {
          openEventDetail(dayEvents[0].id);
        } else {
          openAddModal(dateStr);
        }
      };

      // Header row inside cell
      const headerDiv = document.createElement('div');
      headerDiv.className = 'flex items-center justify-between';

      const numSpan = document.createElement('span');
      numSpan.className = 'text-xs font-semibold tabular-nums ' + 
        (isToday ? 'w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold' : (isCurrentMonth ? 'text-slate-800' : 'text-slate-400'));
      numSpan.textContent = dayNumber;
      headerDiv.appendChild(numSpan);

      if (isToday) {
        const todayBadge = document.createElement('span');
        todayBadge.className = 'text-[10px] text-emerald-700 font-bold uppercase tracking-wider hidden sm:inline';
        todayBadge.textContent = 'Hari ini';
        headerDiv.appendChild(todayBadge);
      }

      cell.appendChild(headerDiv);

      // Event badges container
      const eventsDiv = document.createElement('div');
      eventsDiv.className = 'space-y-1 mt-1 flex-1';

      dayEvents.slice(0, 2).forEach(evt => {
        const item = document.createElement('div');
        const cfg = CATEGORIES_CONFIG[evt.category] || CATEGORIES_CONFIG.academic;
        item.className = 'text-[11px] leading-tight px-1.5 py-0.5 rounded truncate font-medium cursor-grab active:cursor-grabbing hover:shadow-xs ' + cfg.cellClass;
        item.textContent = evt.title;
        item.title = evt.title + ' (' + evt.audience + ') — Tarik & lepas untuk menjadwalkan ulang';
        item.draggable = true;
        item.ondragstart = (e) => {
          e.stopPropagation();
          e.dataTransfer.setData('text/plain', evt.id);
          e.dataTransfer.effectAllowed = 'move';
          item.style.opacity = '0.4';
        };
        item.ondragend = () => {
          item.style.opacity = '1';
        };
        eventsDiv.appendChild(item);
      });

      if (dayEvents.length > 2) {
        const more = document.createElement('div');
        more.className = 'text-[10px] text-slate-500 font-medium pl-1';
        more.textContent = '+' + (dayEvents.length - 2) + ' lainnya';
        eventsDiv.appendChild(more);
      }

      cell.appendChild(eventsDiv);
      return cell;
    }

    // YEARLY / MULTI-MONTH RENDERER
    function renderYearGrid() {
      const container = document.getElementById('yearMonthsGrid');
      container.innerHTML = '';

      // Render 12 months for the academic year 2026/2027 (Jul 2026 - Jun 2027)
      const academicMonths = [
        { y: 2026, m: 6, name: 'Juli 2026' },
        { y: 2026, m: 7, name: 'Agustus 2026' },
        { y: 2026, m: 8, name: 'September 2026' },
        { y: 2026, m: 9, name: 'Oktober 2026' },
        { y: 2026, m: 10, name: 'November 2026' },
        { y: 2026, m: 11, name: 'Desember 2026' },
        { y: 2027, m: 0, name: 'Januari 2027' },
        { y: 2027, m: 1, name: 'Februari 2027' },
        { y: 2027, m: 2, name: 'Maret 2027' },
        { y: 2027, m: 3, name: 'April 2027' },
        { y: 2027, m: 4, name: 'Mei 2027' },
        { y: 2027, m: 5, name: 'Juni 2027' },
      ];

      academicMonths.forEach(mon => {
        const monthCard = document.createElement('div');
        monthCard.className = 'border border-slate-200 rounded-xl p-3 bg-white shadow-xs hover:border-slate-300 transition-colors';

        // Header
        const header = document.createElement('div');
        header.className = 'flex items-center justify-between pb-2 mb-2 border-b border-slate-100';
        header.innerHTML = '<span class="font-bold text-xs text-slate-800">' + mon.name + '</span><button class="text-[11px] text-emerald-700 hover:underline font-semibold" onclick="jumpToMonth(' + mon.y + ', ' + mon.m + ')">Buka</button>';
        monthCard.appendChild(header);

        // Day letters
        const daysHead = document.createElement('div');
        daysHead.className = 'grid grid-cols-7 text-center text-[10px] font-semibold text-slate-400 mb-1';
        daysHead.innerHTML = '<span>S</span><span>S</span><span>R</span><span>K</span><span>J</span><span>S</span><span class="text-rose-500">A</span>';
        monthCard.appendChild(daysHead);

        // Grid
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-7 gap-1 text-center text-[11px] tabular-nums';

        const first = new Date(mon.y, mon.m, 1);
        const last = new Date(mon.y, mon.m + 1, 0);
        const startDay = (first.getDay() + 6) % 7;

        for (let i = 0; i < startDay; i++) {
          grid.appendChild(document.createElement('div'));
        }

        for (let d = 1; d <= last.getDate(); d++) {
          const dateStr = formatDate(mon.y, mon.m, d);
          const evts = getEventsForDate(dateStr);
          const isToday = dateStr === TODAY_STR;

          const dCell = document.createElement('div');
          dCell.className = 'relative py-1 rounded flex flex-col items-center justify-center cursor-pointer ' + 
            (isToday ? 'bg-emerald-700 text-white font-bold rounded-full' : (evts.length > 0 ? 'font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200' : 'text-slate-600 hover:bg-slate-50'));
          dCell.textContent = d;

          if (evts.length > 0 && !isToday) {
            const dot = document.createElement('span');
            const cfg = CATEGORIES_CONFIG[evts[0].category] || CATEGORIES_CONFIG.academic;
            dot.className = 'w-1.5 h-1.5 rounded-full mt-0.5 ' + cfg.dotClass;
            dCell.appendChild(dot);
          }

          dCell.onclick = () => {
            if (evts.length > 0) openEventDetail(evts[0].id);
            else openAddModal(dateStr);
          };

          grid.appendChild(dCell);
        }

        monthCard.appendChild(grid);
        container.appendChild(monthCard);
      });
    }

    function jumpToMonth(y, m) {
      currentYear = y;
      currentMonth = m;
      switchView('month');
    }

    // WEEKLY VIEW RENDERER
    function renderWeekGrid() {
      const container = document.getElementById('weekDaysGrid');
      container.innerHTML = '';

      // 7 days around September 28, 2026 (Monday to Sunday)
      const weekDates = [
        '2026-09-28', '2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'
      ];

      weekDates.forEach((dateStr, idx) => {
        const evts = getEventsForDate(dateStr);
        const isToday = dateStr === TODAY_STR;
        const dayCard = document.createElement('div');
        dayCard.className = 'border rounded-xl p-4 ' + (isToday ? 'border-emerald-500 bg-emerald-50/15' : 'border-slate-200 bg-white');

        const parts = dateStr.split('-');
        const dayLabel = DAY_NAMES[idx] + ', ' + parts[2] + ' ' + MONTH_NAMES[parseInt(parts[1]) - 1] + ' ' + parts[0];

        dayCard.ondragover = (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          dayCard.classList.add('border-2', 'border-dashed', 'border-emerald-600', 'bg-emerald-50');
        };
        dayCard.ondragleave = (e) => {
          dayCard.classList.remove('border-2', 'border-dashed', 'border-emerald-600', 'bg-emerald-50');
        };
        dayCard.ondrop = (e) => {
          e.preventDefault();
          dayCard.classList.remove('border-2', 'border-dashed', 'border-emerald-600', 'bg-emerald-50');
          const id = e.dataTransfer.getData('text/plain');
          if (id) rescheduleEvent(id, dateStr);
        };

        let html = '<div class="flex items-center justify-between pb-3 border-b border-slate-100">' +
          '<div class="flex items-center gap-2">' +
            '<span class="font-bold text-sm text-slate-900">' + dayLabel + '</span>' +
            (isToday ? '<span class="px-2 py-0.5 bg-emerald-700 text-white rounded text-[10px] font-bold uppercase">Hari Ini</span>' : '') +
          '</div>' +
          '<button onclick="openAddModal(\\'' + dateStr + '\\')" class="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"><i data-lucide="plus" class="w-3.5 h-3.5"></i> Tambah</button>' +
        '</div>';

        if (evts.length === 0) {
          html += '<p class="text-xs text-slate-400 py-3 italic">Tidak ada agenda khusus di tanggal ini. Anda dapat menarik agenda ke sini.</p>';
        } else {
          html += '<div class="space-y-2.5 mt-3">';
          evts.forEach(evt => {
            const cfg = CATEGORIES_CONFIG[evt.category] || CATEGORIES_CONFIG.academic;
            html += '<div draggable="true" ondragstart="handleWeekDrag(event, \\'' + evt.id + '\\')" onclick="openEventDetail(\\'' + evt.id + '\\')" class="p-3 rounded-xl border border-slate-100 hover:border-slate-300 transition-all bg-slate-50 cursor-grab active:cursor-grabbing flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">' +
              '<div>' +
                '<div class="flex items-center gap-2">' +
                  '<span class="px-2 py-0.5 rounded text-[10px] font-semibold ' + cfg.badgeClass + '">' + cfg.label + '</span>' +
                  '<h4 class="font-bold text-slate-900 text-xs">' + evt.title + '</h4>' +
                '</div>' +
                '<p class="text-[11px] text-slate-500 mt-1">' + evt.description + '</p>' +
              '</div>' +
              '<div class="text-[11px] text-slate-600 shrink-0 sm:text-right">' +
                '<div class="font-medium">' + (evt.location || 'Kampus SMK IT') + '</div>' +
                '<div class="text-slate-400">Sasaran: ' + evt.audience + '</div>' +
              '</div>' +
            '</div>';
          });
          html += '</div>';
        }

        dayCard.innerHTML = html;
        container.appendChild(dayCard);
      });
    }

    function handleWeekDrag(e, eventId) {
      e.stopPropagation();
      e.dataTransfer.setData('text/plain', eventId);
      e.dataTransfer.effectAllowed = 'move';
    }

    function rescheduleEvent(eventId, newStartDate) {
      const idx = events.findIndex(e => e.id === eventId);
      if (idx === -1) return;
      const target = events[idx];
      if (target.startDate === newStartDate) return;

      const [sy, sm, sd] = target.startDate.split('-').map(Number);
      const [ey, em, ed] = target.endDate.split('-').map(Number);
      const durDays = Math.max(0, Math.round((new Date(ey, em-1, ed) - new Date(sy, sm-1, sd)) / (1000 * 60 * 60 * 24)));

      const [ny, nm, nd] = newStartDate.split('-').map(Number);
      const newEndDateObj = new Date(ny, nm-1, nd + durDays);
      const newEndDate = formatDate(newEndDateObj.getFullYear(), newEndDateObj.getMonth(), newEndDateObj.getDate());

      target.startDate = newStartDate;
      target.endDate = newEndDate;
      target.semester = newStartDate >= '2027-01-01' ? 'genap' : 'ganjil';

      saveEvents();
      alert('Agenda "' + target.title + '" berhasil dipindahkan ke ' + newStartDate + '!');
    }

    // AGENDA LIST RENDERER
    function renderAgendaList() {
      const container = document.getElementById('agendaListGrid');
      container.innerHTML = '';
      const filtered = getFilteredEvents().sort((a, b) => a.startDate.localeCompare(b.startDate));

      if (filtered.length === 0) {
        container.innerHTML = '<div class="text-center py-12 text-slate-400 text-sm">Tidak ditemukan agenda yang sesuai dengan filter atau kata kunci.</div>';
        return;
      }

      filtered.forEach(evt => {
        const cfg = CATEGORIES_CONFIG[evt.category] || CATEGORIES_CONFIG.academic;
        const item = document.createElement('div');
        item.className = 'p-3.5 border border-slate-200 rounded-xl hover:border-slate-300 transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer shadow-xs';
        item.onclick = () => openEventDetail(evt.id);

        item.innerHTML = '<div class="space-y-1">' +
          '<div class="flex items-center gap-2">' +
            '<span class="px-2 py-0.5 rounded text-[10px] font-semibold ' + cfg.badgeClass + '">' + cfg.label + '</span>' +
            '<span class="text-xs font-semibold text-emerald-800">' + evt.startDate + ' s/d ' + evt.endDate + '</span>' +
          '</div>' +
          '<h4 class="font-bold text-slate-900 text-sm">' + evt.title + '</h4>' +
          '<p class="text-xs text-slate-500 line-clamp-1">' + evt.description + '</p>' +
        '</div>' +
        '<div class="text-right shrink-0 text-xs text-slate-500">' +
          '<div class="font-medium text-slate-800">' + evt.audience + '</div>' +
          '<div class="text-[11px] text-slate-400">' + evt.location + '</div>' +
        '</div>';

        container.appendChild(item);
      });
    }

    // UPCOMING EVENTS SIDEBAR
    function renderUpcomingEvents() {
      const container = document.getElementById('upcomingEventsList');
      container.innerHTML = '';

      // Upcoming in next 14 days relative to TODAY_STR (2026-09-28)
      const upcoming = events.filter(evt => {
        return evt.endDate >= TODAY_STR && evt.startDate <= '2026-10-15';
      }).sort((a, b) => a.startDate.localeCompare(b.startDate));

      if (upcoming.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-400 py-3 italic">Tidak ada agenda dalam 14 hari ke depan.</p>';
        return;
      }

      upcoming.forEach(evt => {
        const item = document.createElement('div');
        const cfg = CATEGORIES_CONFIG[evt.category] || CATEGORIES_CONFIG.academic;
        const isOngoing = evt.startDate <= TODAY_STR && evt.endDate >= TODAY_STR;

        item.className = 'p-3 rounded-xl border border-slate-100 hover:border-slate-300 transition-all bg-slate-50/70 cursor-pointer space-y-1';
        item.onclick = () => openEventDetail(evt.id);

        item.innerHTML = '<div class="flex items-center justify-between text-[11px]">' +
          '<span class="font-semibold ' + (isOngoing ? 'text-emerald-700' : 'text-slate-500') + '">' + 
            (isOngoing ? '● Sedang Berlangsung' : evt.startDate) + 
          '</span>' +
          '<span class="px-1.5 py-0.5 rounded text-[10px] ' + cfg.badgeClass + '">' + cfg.label + '</span>' +
        '</div>' +
        '<h4 class="font-bold text-slate-900 text-xs line-clamp-2">' + evt.title + '</h4>' +
        '<p class="text-[11px] text-slate-500 truncate">' + evt.location + ' · ' + evt.audience + '</p>';

        container.appendChild(item);
      });
    }

    // STATS COUNTERS
    function updateStats() {
      const semEvents = events.filter(e => selectedSemester === 'all' || e.semester === selectedSemester);
      document.getElementById('statTotalAgenda').textContent = semEvents.length;

      const upcoming = events.filter(e => e.endDate >= TODAY_STR && e.startDate <= '2026-10-15');
      document.getElementById('statUpcoming').textContent = upcoming.length;

      const holidays = events.filter(e => e.category === 'holiday');
      document.getElementById('statHolidays').textContent = holidays.length;
    }

    // MODAL HANDLERS
    function openEventDetail(id) {
      const evt = events.find(e => e.id === id);
      if (!evt) return;

      const cfg = CATEGORIES_CONFIG[evt.category] || CATEGORIES_CONFIG.academic;
      const badge = document.getElementById('detailCategoryBadge');
      badge.textContent = cfg.label;
      badge.className = 'inline-block px-2.5 py-1 rounded-md text-xs font-semibold mb-3 ' + cfg.badgeClass;

      document.getElementById('detailTitle').textContent = evt.title;
      document.getElementById('detailDateRange').textContent = evt.startDate + ' s/d ' + evt.endDate;
      document.getElementById('detailTime').textContent = evt.startTime && evt.endTime ? (evt.startTime + ' - ' + evt.endTime + ' WITA') : 'Jadwal Penuh Sekolah';
      document.getElementById('detailLocation').textContent = evt.location || 'SMK IT Ibnul Qayyim Makassar';
      document.getElementById('detailAudience').textContent = evt.audience || 'Semua Siswa & Guru';
      document.getElementById('detailDescription').textContent = evt.description || 'Tidak ada catatan tambahan.';

      document.getElementById('btnDeleteEvent').onclick = () => {
        if (confirm('Hapus kegiatan "' + evt.title + '" dari kalender?')) {
          events = events.filter(e => e.id !== id);
          saveEvents();
          closeModal('modalEventDetail');
        }
      };

      document.getElementById('modalEventDetail').classList.remove('hidden');
    }

    function openAddModal(defaultDate) {
      document.getElementById('formAddEvent').reset();
      if (defaultDate) {
        document.getElementById('inputStartDate').value = defaultDate;
        document.getElementById('inputEndDate').value = defaultDate;
      } else {
        document.getElementById('inputStartDate').value = TODAY_STR;
        document.getElementById('inputEndDate').value = TODAY_STR;
      }
      document.getElementById('modalAddEvent').classList.remove('hidden');
    }

    function closeModal(modalId) {
      document.getElementById(modalId).classList.add('hidden');
    }

    function handleSaveEvent(e) {
      e.preventDefault();
      const title = document.getElementById('inputTitle').value;
      const startDate = document.getElementById('inputStartDate').value;
      const endDate = document.getElementById('inputEndDate').value;
      const category = document.getElementById('inputCategory').value;
      const audience = document.getElementById('inputAudience').value;
      const timeRange = document.getElementById('inputTimeRange').value;
      const location = document.getElementById('inputLocation').value;
      const description = document.getElementById('inputDescription').value;

      const newEvt = {
        id: 'evt-custom-' + Date.now(),
        title,
        startDate,
        endDate,
        startTime: '08:00',
        endTime: '15:00',
        category,
        description: description || 'Agenda kegiatan sekolah.',
        location: location || 'SMK IT Ibnul Qayyim Makassar',
        audience: audience || 'Semua Siswa',
        academicYear: selectedAcademicYear,
        semester: startDate >= '2027-01-01' ? 'genap' : 'ganjil',
      };

      events.push(newEvt);
      saveEvents();
      closeModal('modalAddEvent');
    }

    function openInfoModal() {
      alert('Sistem Informasi Kalender Akademik SMK IT Ibnul Qayyim Makassar\\nAkreditasi B · Jl. Goa Ria No. 89 Sudiang Makassar\\nKonsentrasi: RPL & TKJ');
    }

    // Close modals when clicking backdrop
    window.onclick = function(event) {
      ['modalEventDetail', 'modalAddEvent'].forEach(id => {
        const el = document.getElementById(id);
        if (event.target === el) {
          el.classList.add('hidden');
        }
      });
    };

    // Initialize on page load
    window.onload = function() {
      loadEvents();
      renderCurrentView();
      updateStats();
      renderUpcomingEvents();
      if (window.lucide) lucide.createIcons();
    };
  </script>
</body>
</html>`;
}
