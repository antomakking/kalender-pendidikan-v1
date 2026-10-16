# Academic Analytics Dashboard & Visual Workload Charts

Implementation plan for adding a dedicated **Dashboard** tab featuring interactive visual analytics (Bar Chart & Donut Chart) to help students and educators visualize monthly academic workload, effective KBM days, activity duration, and event category distribution.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following choices were confirmed in Phase 1 interactive clarification:

- **Chart Composition**: Multi-chart dashboard combining a **Monthly Bar Chart** (workload & KBM distribution) and a **Donut Chart** (event category distribution).
- **Workload Metrics**: Tracks total number of scheduled events, activity duration (hours/days), and Effective School Days (Hari Efektif Belajar / HEB) per month.
- **Placement & UX**: Added as a dedicated **'Dashboard'** view option in the main navigation bar alongside Year, Month, Week, and Agenda views.

---

## 1. Overview & Core Concept

### What It Does
Provides an intuitive, visually appealing analytics dashboard for students and educators at SMK IT Ibnul Qayyim Makassar. It translates calendar event data into actionable charts:
1. **Monthly Workload Bar Chart**: Displays event count vs. effective KBM days across all 12 months of the academic year.
2. **Category Distribution Donut Chart**: Shows the proportion of academic exams, school activities, student events, and official holidays.
3. **Key Metric KPI Cards**: Quick overview of total active events, peak workload month, total learning hours/days, and average events per week.
4. **Interactive Filters**: Synchronized with Class Level (X, XI, XII) and Semester (Ganjil, Genap, Full Year) filters.

### Target Audience
- **Students**: Identify upcoming high-workload months (e.g. exam periods, PKL, Tasmi' exams) to plan study schedules.
- **Teachers & Management**: Monitor balanced distribution of school events and maintain required Effective School Days (HEB).

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Navigation**: User clicks the new **"Dashboard"** button in the main view switcher (alongside Month, Week, Year, Agenda).
2. **Overview Cards**: User sees 4 key metric cards at the top (Total Events, Peak Workload Month, Average Monthly HEB, Total Estimated Hours).
3. **Monthly Workload Bar Chart**: Interactive bar chart comparing monthly event density and KBM days. Hovering over any month highlights details in an interactive tooltip.
4. **Category Donut Chart**: Interactive donut chart with category legends (KBM, Assesmen, Kegiatan Sekolah, Kegiatan Siswa, Libur). Clicking a category filters the event detail list below.
5. **Class & Semester Sync**: Changing the class filter (Class X, XI, XII) or semester filter dynamically re-calculates all charts with smooth framer-motion transitions.

### Visual Identity & Theme
- **Theme Consistency**: Seamless dark mode and light mode support matching the institutional green (`#143c14`) and gold (`#ffcc00`) color palette.
- **Category Colors**:
  - **KBM (Kegiatan Belajar Mengajar)**: Gold/Amber (`#ffcc00`)
  - **Assesmen / Ujian**: Deep Purple (`#7c3aed`)
  - **Kegiatan Sekolah**: Emerald Green (`#15803d`)
  - **Kegiatan Siswa**: Sky Blue (`#0284c7`)
  - **Libur**: Crimson Red (`#dc2626`)
- **Typography & Numbers**: Monospace tabular numerals (`tabular-nums font-mono`) for all statistics and percentages.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Custom SVG Chart Engine vs. External Chart Library**
  - *Chosen Approach*: Lightweight, custom-built React SVG components for Bar Chart and Donut Chart.
  - *Why*: Zero external bundle size, full design system alignment, crisp SVG rendering in light/dark modes, and 100% reliability without dependency version conflicts.
  - *Alternatives Considered*: Recharts / Chart.js (adds ~100KB dependency size and requires canvas setup).

- **Decision 2: Direct State Integration with `calculateAcademicStats`**
  - *Chosen Approach*: Compute monthly aggregated metrics dynamically from the master `events` array using `useMemo`.
  - *Why*: Ensures charts automatically update when events are added, edited, rescheduled, or filtered by class level.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             App.tsx (Main)                                  │
│  - calendarView state: 'year' | 'month' | 'week' | 'agenda' | 'dashboard'   │
│  - classFilter: 'all' | 'X' | 'XI' | 'XII'                                  │
│  - semesterFilter: 'all' | 'ganjil' | 'genap'                               │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DashboardView.tsx                                  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ MetricCardsRow: Total Events | Peak Month | Avg HEB | Workload Level   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────┐ ┌──────────────────────────────────┐  │
│  │ MonthlyWorkloadBarChart (SVG)    │ │ CategoryDonutChart (SVG)         │  │
│  │ - Bars per month (Events vs HEB) │ │ - Donut segments per category    │  │
│  │ - Hover tooltip with breakdown   │ │ - Interactive category filter    │  │
│  └──────────────────────────────────┘ └──────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ MonthlyWorkloadTable: Detailed breakdown table with tabular figures   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Components to Add/Modify
1. **`src/types.ts`**: Add `'dashboard'` to `CalendarView` union type.
2. **`src/components/DashboardView.tsx`**: New view component containing:
   - KPI Summary cards
   - `MonthlyWorkloadBarChart`: Interactive SVG Bar chart
   - `CategoryDonutChart`: Interactive SVG Donut chart with category legend
   - `MonthlyBreakdownTable`: High-density tabular metrics table
3. **`src/components/ControlsBar.tsx`**: Add "Dashboard" icon button to the view switcher navigation bar.
4. **`src/utils/calendarUtils.ts`**: Helper functions to aggregate monthly event distributions and category counts for chart data structures.
