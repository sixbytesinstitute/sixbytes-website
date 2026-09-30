"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  IconFlame,
  IconCalendar,
  IconBookOpen,
  IconBity,
  IconTrendingUp,
  IconActivity,
  IconZap,
} from "@/app/components/ui/icons";

/* ─── Types ──────────────────────────────────────────────── */
interface ActivityDay {
  date: string;
  totalActions: number;
  resourceViews: number;
  tutorQuestions: number;
  logins: number;
}

interface ActivityData {
  streak: number;
  stats: {
    totalActions: number;
    totalResourceViews: number;
    totalTutorQuestions: number;
    activeDays: number;
  };
  activities: ActivityDay[];
}

type ViewRange = "year" | "month" | "week";
type ChartMode = "curve" | "matrix";

/* ─── Helpers ────────────────────────────────────────────── */
function getIntensityLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

const INTENSITY_COLORS = [
  "bg-white/[0.03] border-white/[0.05]",
  "bg-emerald-500/20 border-emerald-500/30",
  "bg-emerald-500/40 border-emerald-500/50",
  "bg-emerald-500/70 border-emerald-400/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]",
  "bg-emerald-400 border-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.5)]",
];

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function getStreakTier(streak: number): { label: string; color: string; border: string } {
  if (streak >= 30) return { label: "Supernova", color: "text-purple-400 bg-purple-500/15", border: "border-purple-500/30" };
  if (streak >= 14) return { label: "Inferno", color: "text-rose-400 bg-rose-500/15", border: "border-rose-500/30" };
  if (streak >= 7) return { label: "Blaze", color: "text-orange-400 bg-orange-500/15", border: "border-orange-500/30" };
  if (streak >= 3) return { label: "Flame", color: "text-amber-400 bg-amber-500/15", border: "border-amber-500/30" };
  return { label: "Spark", color: "text-slate-400 bg-slate-500/15", border: "border-slate-500/30" };
}

function generateDateGrid(range: ViewRange): string[] {
  const dates: string[] = [];
  const today = new Date();
  let daysBack: number;

  switch (range) {
    case "week":
      daysBack = 6;
      break;
    case "month":
      daysBack = 29;
      break;
    case "year":
    default:
      daysBack = 364;
      break;
  }

  for (let i = daysBack; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }

  return dates;
}

/**
 * Builds smooth cubic SVG Bézier curve coordinates from series points.
 */
function createSmoothSvgPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const controlX = (current.x + next.x) / 2;
    path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
  }
  return path;
}

/* ─── Main Component ─────────────────────────────────────── */
export default function ActivityGraph() {
  const [data, setData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewRange, setViewRange] = useState<ViewRange>("month");
  const [chartMode, setChartMode] = useState<ChartMode>("curve");
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    count: number;
    resources: number;
    tutor: number;
    x: number;
    y: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/student/activity?range=${viewRange}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [viewRange]);

  // Build detailed activity lookup
  const activityMap = useMemo(() => {
    const map = new Map<string, ActivityDay>();
    if (data?.activities) {
      for (const a of data.activities) {
        map.set(a.date, a);
      }
    }
    return map;
  }, [data]);

  const dateGrid = useMemo(() => generateDateGrid(viewRange), [viewRange]);

  // Weeks matrix for Year Heatmap
  const weeks = useMemo(() => {
    if (viewRange !== "year") return [];
    const result: string[][] = [];
    let currentWeek: string[] = [];

    const firstDate = new Date(dateGrid[0]);
    const firstDay = firstDate.getDay();
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push("");
    }

    for (const date of dateGrid) {
      currentWeek.push(date);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
  }, [dateGrid, viewRange]);

  // Month markers for Year Matrix
  const monthMarkers = useMemo(() => {
    if (viewRange !== "year") return [];
    const markers: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    for (let wi = 0; wi < weeks.length; wi++) {
      const firstDate = weeks[wi].find((d) => d !== "");
      if (!firstDate) continue;
      const month = new Date(firstDate).getMonth();
      if (month !== lastMonth) {
        markers.push({ label: MONTH_LABELS[month], weekIndex: wi });
        lastMonth = month;
      }
    }

    return markers;
  }, [weeks, viewRange]);

  // Velocity Curve SVG geometry calculations
  const curveGeometry = useMemo(() => {
    const chartWidth = 720;
    const chartHeight = 160;
    const paddingX = 24;
    const paddingY = 24;

    const usableWidth = chartWidth - paddingX * 2;
    const usableHeight = chartHeight - paddingY * 2;

    const values = dateGrid.map((d) => activityMap.get(d)?.totalActions || 0);
    const maxVal = Math.max(...values, 4);

    const points = dateGrid.map((date, idx) => {
      const x = paddingX + (idx / Math.max(dateGrid.length - 1, 1)) * usableWidth;
      const val = activityMap.get(date)?.totalActions || 0;
      const y = chartHeight - paddingY - (val / maxVal) * usableHeight;
      return { x, y, date, val };
    });

    const linePath = createSmoothSvgPath(points);
    const areaPath = points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
      : "";

    // Stats
    const totalActions = values.reduce((a, b) => a + b, 0);
    const avgDaily = (totalActions / Math.max(values.length, 1)).toFixed(1);
    const peakDay = Math.max(...values);

    return {
      chartWidth,
      chartHeight,
      paddingX,
      paddingY,
      points,
      linePath,
      areaPath,
      avgDaily,
      peakDay,
      totalActions,
    };
  }, [dateGrid, activityMap]);

  const streakTier = useMemo(() => getStreakTier(data?.streak || 0), [data?.streak]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0E18]/60 backdrop-blur-xl p-6 space-y-4 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-5 w-44 bg-white/[0.06] rounded" />
          <div className="h-8 w-28 bg-white/[0.06] rounded-lg" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-white/[0.04] rounded-2xl" />
          ))}
        </div>
        <div className="h-44 bg-white/[0.04] rounded-2xl" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4" ref={containerRef}>
      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Streak Metric */}
        <div className="relative overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-[#1A120B] to-[#0D111A] p-4.5 transition-all hover:border-orange-500/50 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-orange-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              <IconFlame size={20} className="animate-pulse" />
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${streakTier.color} ${streakTier.border}`}>
              {streakTier.label}
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-display font-extrabold text-white tracking-tight">{data.streak}</span>
            <span className="text-xs text-orange-400/80 font-medium ml-1.5">days</span>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Continuous Study Streak</p>
          </div>
        </div>

        {/* Active Days */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-[#141A1F] to-[#0A0C0E] p-4.5 transition-all hover:border-amber-500/40 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <IconCalendar size={18} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">
              Consistency
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-display font-extrabold text-white tracking-tight">{data.stats.activeDays}</span>
            <span className="text-xs text-amber-400/80 font-medium ml-1.5">active</span>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Study Days Logged</p>
          </div>
        </div>

        {/* Resources Explored */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-500/10 via-[#121226] to-[#0D111A] p-4.5 transition-all hover:border-indigo-500/40 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.25)]">
              <IconBookOpen size={18} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              Syllabus
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-display font-extrabold text-white tracking-tight">{data.stats.totalResourceViews}</span>
            <span className="text-xs text-indigo-400/80 font-medium ml-1.5">guides</span>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Materials & Notes Read</p>
          </div>
        </div>

        {/* Bity Socratic Inquiries */}
        <div className="relative overflow-hidden rounded-2xl border border-orange-500/25 bg-gradient-to-br from-orange-500/10 via-[#18130E] to-[#0A0C0E] p-4.5 transition-all hover:border-orange-500/40 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-orange-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
              <IconBity size={19} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/25">
              Bity AI
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-display font-extrabold text-white tracking-tight">{data.stats.totalTutorQuestions}</span>
            <span className="text-xs text-orange-400/80 font-medium ml-1.5">prompts</span>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Socratic Intuition Queries</p>
          </div>
        </div>
      </div>

      {/* ── Main Chart Suite Card ── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#090D16]/90 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_15px_40px_rgba(0,0,0,0.5)] space-y-4">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-400">
              <IconActivity size={17} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                Learning Velocity & Consistency
              </h3>
              <p className="text-[11px] text-slate-400">
                Visualized telemetry of your daily academic problem-solving
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Chart Mode Toggle */}
            <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setChartMode("curve")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  chartMode === "curve"
                    ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <IconTrendingUp size={13} />
                Momentum
              </button>
              <button
                onClick={() => setChartMode("matrix")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  chartMode === "matrix"
                    ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <IconZap size={13} />
                Matrix
              </button>
            </div>

            {/* View Range Toggle */}
            <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/10">
              {(["week", "month", "year"] as ViewRange[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setViewRange(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                    viewRange === r
                      ? "bg-white/15 text-white shadow-sm font-semibold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {r === "week" ? "7D" : r === "month" ? "30D" : "1Y"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mode 1: Interactive Bézier Momentum Curve ── */}
        {chartMode === "curve" && (
          <div className="space-y-4">
            {/* Quick telemetry indicators */}
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <div>
                <span className="text-slate-500">Daily Average:</span>{" "}
                <strong className="text-white font-semibold">{curveGeometry.avgDaily} actions</strong>
              </div>
              <span className="text-white/10">•</span>
              <div>
                <span className="text-slate-500">Peak Velocity:</span>{" "}
                <strong className="text-orange-300 font-semibold">{curveGeometry.peakDay} actions/day</strong>
              </div>
              <span className="text-white/10">•</span>
              <div>
                <span className="text-slate-500">Interval Total:</span>{" "}
                <strong className="text-amber-300 font-semibold">{curveGeometry.totalActions}</strong>
              </div>
            </div>

            {/* SVG Interactive Curve */}
            <div className="relative w-full overflow-hidden rounded-xl border border-white/[0.06] bg-[#070A11]/60 p-2 pt-4">
              <svg
                viewBox={`0 0 ${curveGeometry.chartWidth} ${curveGeometry.chartHeight}`}
                className="w-full h-44 overflow-visible"
              >
                <defs>
                  {/* Glowing Area Fill */}
                  <linearGradient id="velocityAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                    <stop offset="60%" stopColor="#fb923c" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#0a0c0e" stopOpacity="0.0" />
                  </linearGradient>

                  {/* High-Voltage Stroke Gradient */}
                  <linearGradient id="velocityStrokeGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="50%" stopColor="#fb923c" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>

                  {/* Horizontal Guide Grid Lines */}
                  <pattern id="gridPattern" width="720" height="35" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="35" x2="720" y2="35" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                  </pattern>
                </defs>

                {/* Grid Background */}
                <rect width="100%" height="100%" fill="url(#gridPattern)" opacity={0.8} />

                {/* Area Gradient Fill */}
                <path d={curveGeometry.areaPath} fill="url(#velocityAreaGrad)" />

                {/* Smooth High-Voltage Line */}
                <path
                  d={curveGeometry.linePath}
                  fill="none"
                  stroke="url(#velocityStrokeGrad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                />

                {/* Data Points */}
                {curveGeometry.points.map((pt, i) => {
                  const dayData = activityMap.get(pt.date);
                  const isHovered = hoveredPoint?.date === pt.date;

                  return (
                    <g key={i}>
                      {/* Active point hover ring */}
                      {isHovered && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="8"
                          fill="rgba(6,182,212,0.2)"
                          stroke="#06b6d4"
                          strokeWidth="1.5"
                          className="animate-ping"
                        />
                      )}

                      {/* Point dot */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={pt.val > 0 ? (isHovered ? "5" : "3.5") : "2"}
                        fill={pt.val > 0 ? "#38bdf8" : "#334155"}
                        stroke="#070A11"
                        strokeWidth="1.5"
                        className="transition-all cursor-pointer"
                        onMouseEnter={(e) => {
                          const rect = (e.target as SVGElement).getBoundingClientRect();
                          setHoveredPoint({
                            date: pt.date,
                            count: pt.val,
                            resources: dayData?.resourceViews || 0,
                            tutor: dayData?.tutorQuestions || 0,
                            x: rect.left,
                            y: rect.top,
                          });
                        }}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* X-Axis Date Markers */}
              <div className="flex justify-between items-center text-[10px] text-slate-500 px-3 pt-2 font-mono">
                <span>{new Date(dateGrid[0]).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
                <span>{new Date(dateGrid[Math.floor(dateGrid.length / 2)]).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
                <span>{new Date(dateGrid[dateGrid.length - 1]).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Mode 2: GitHub-Style Matrix Heatmap ── */}
        {chartMode === "matrix" && (
          <div className="space-y-3">
            {viewRange === "year" ? (
              <div className="relative overflow-x-auto pb-2 no-scrollbar">
                {/* Month labels */}
                <div className="flex mb-1 ml-8" style={{ gap: "0px" }}>
                  {monthMarkers.map((m, i) => (
                    <div
                      key={i}
                      className="text-[9px] text-slate-400 font-mono font-medium"
                      style={{
                        position: "relative",
                        left: `${m.weekIndex * 13}px`,
                        width: 0,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {m.label}
                    </div>
                  ))}
                </div>

                {/* Heatmap Grid */}
                <div className="flex gap-0">
                  {/* Day labels */}
                  <div className="flex flex-col gap-[2px] mr-1.5 shrink-0">
                    {DAY_LABELS.map((label, i) => (
                      <div key={i} className="w-6 h-[11px] flex items-center justify-end pr-1">
                        <span className="text-[8px] text-slate-500 font-mono">{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Weeks columns */}
                  <div className="flex gap-[2px]">
                    {weeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-[2px]">
                        {week.map((date, di) => {
                          if (date === "") {
                            return <div key={di} className="w-[11px] h-[11px]" />;
                          }
                          const dayData = activityMap.get(date);
                          const count = dayData?.totalActions || 0;
                          const level = getIntensityLevel(count);

                          return (
                            <div
                              key={di}
                              className={`w-[11px] h-[11px] rounded-[2.5px] border cursor-pointer transition-all hover:scale-150 hover:z-20 ${INTENSITY_COLORS[level]}`}
                              onMouseEnter={(e) => {
                                const rect = (e.target as HTMLElement).getBoundingClientRect();
                                setHoveredPoint({
                                  date,
                                  count,
                                  resources: dayData?.resourceViews || 0,
                                  tutor: dayData?.tutorQuestions || 0,
                                  x: rect.left,
                                  y: rect.top,
                                });
                              }}
                              onMouseLeave={() => setHoveredPoint(null)}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Month / Week Bar Matrix */
              <div className="flex items-end gap-1.5 h-36 pt-4 px-2">
                {dateGrid.map((date) => {
                  const dayData = activityMap.get(date);
                  const count = dayData?.totalActions || 0;
                  const maxCount = Math.max(...dateGrid.map((d) => activityMap.get(d)?.totalActions || 0), 1);
                  const heightPercent = (count / maxCount) * 100;

                  return (
                    <div
                      key={date}
                      className="flex-1 flex flex-col items-center justify-end gap-1.5 group relative h-full"
                    >
                      <div
                        className={`w-full rounded-t-md transition-all cursor-pointer ${
                          count > 0
                            ? "bg-gradient-to-t from-orange-600 via-orange-500 to-amber-400 group-hover:brightness-125 shadow-[0_0_10px_rgba(249,115,22,0.35)]"
                            : "bg-white/[0.04] group-hover:bg-white/[0.08]"
                        }`}
                        style={{ height: `${Math.max(heightPercent, 5)}%` }}
                        onMouseEnter={(e) => {
                          const rect = (e.target as HTMLElement).getBoundingClientRect();
                          setHoveredPoint({
                            date,
                            count,
                            resources: dayData?.resourceViews || 0,
                            tutor: dayData?.tutorQuestions || 0,
                            x: rect.left,
                            y: rect.top,
                          });
                        }}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      {viewRange === "week" && (
                        <span className="text-[9px] text-slate-400 font-mono">
                          {new Date(date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 2)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Matrix Legend */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.04]">
              <span className="text-[10px] text-slate-500 font-medium">Lower Density</span>
              {INTENSITY_COLORS.map((color, i) => (
                <div key={i} className={`w-[11px] h-[11px] rounded-[2.5px] border ${color}`} />
              ))}
              <span className="text-[10px] text-slate-500 font-medium">Higher Intensity</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Luxury Hover Tooltip ── */}
      {hoveredPoint && (
        <div
          className="fixed z-[100] pointer-events-none px-3.5 py-2.5 rounded-xl bg-[#0E1318]/95 border border-orange-500/30 shadow-[0_15px_30px_rgba(0,0,0,0.85),0_0_20px_rgba(249,115,22,0.15)] text-xs text-cream backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
          style={{
            left: Math.min(hoveredPoint.x + 14, typeof window !== "undefined" ? window.innerWidth - 220 : 500),
            top: hoveredPoint.y - 64,
          }}
        >
          <div className="flex items-center gap-1.5 font-bold text-cream font-mono">
            <span className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_6px_#f97316]"></span>
            <span>{hoveredPoint.count} action{hoveredPoint.count !== 1 ? "s" : ""}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {new Date(hoveredPoint.date + "T00:00:00").toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
          {(hoveredPoint.resources > 0 || hoveredPoint.tutor > 0) && (
            <div className="mt-1 pt-1 border-t border-white/10 flex items-center gap-2 text-[9px] text-slate-300">
              {hoveredPoint.resources > 0 && <span>{hoveredPoint.resources} guides</span>}
              {hoveredPoint.resources > 0 && hoveredPoint.tutor > 0 && <span>•</span>}
              {hoveredPoint.tutor > 0 && <span>{hoveredPoint.tutor} Bity prompts</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
