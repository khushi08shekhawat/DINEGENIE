/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import * as Lucide from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';

interface MonthlyDashboardProps {
  triggerToast: (msg: string) => void;
}

interface DayData {
  day: number;
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  hydration: number;
  quality: string;
}

export default function MonthlyDashboard({ triggerToast }: MonthlyDashboardProps) {
  // Generate realistic, high-quality 30-day nutrition data
  const dailyData = useMemo<DayData[]>(() => {
    const data = [];
    // Start 30 days ago from 06-Jul-2026
    const start = new Date(2026, 5, 7); // June 7, 2026
    
    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      const dateStr = currentDate.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
      
      const isSunday = currentDate.getDay() === 0;
      const isWednesday = currentDate.getDay() === 3;
      const isFriday = currentDate.getDay() === 5;
      
      // Base values with realistic sinusoidal variation
      let calories = 2050 + Math.floor(Math.sin(i * 0.7) * 200) + Math.floor(Math.cos(i * 1.3) * 100);
      let protein = 92 + Math.floor(Math.sin(i * 1.1) * 12) + Math.floor(Math.cos(i * 0.8) * 8);
      let carbs = 210 + Math.floor(Math.cos(i * 0.6) * 25) + Math.floor(Math.sin(i * 1.5) * 15);
      let fat = 62 + Math.floor(Math.sin(i * 0.4) * 8) + Math.floor(Math.cos(i * 1.1) * 6);
      let hydration = 2300 + Math.floor(Math.sin(i * 1.4) * 500) + Math.floor(Math.cos(i * 0.9) * 300);
      let quality = "Good";
      
      // Customize specific days for organic, dynamic-looking variations
      if (isSunday) {
        // High calorie "Cheat Day" or family dinner
        calories += 380;
        carbs += 65;
        fat += 16;
        protein -= 8;
        hydration = 2100; // Less hydration, out socializing
        quality = "Cheat Day";
      } else if (isWednesday) {
        // Dedicated workout day - high protein, clean dining
        calories -= 120;
        protein += 24;
        carbs -= 40;
        fat -= 10;
        hydration = 3100; // High hydration on active gym days
        quality = "High Protein";
      } else if (isFriday) {
        // Social dining - tasty yet healthy balance
        calories += 140;
        protein += 10;
        carbs += 20;
        quality = "Balanced";
      } else if (calories > 1900 && calories < 2150 && protein > 95) {
        quality = "Excellent";
      }
      
      data.push({
        day: i + 1,
        date: dateStr,
        calories,
        protein,
        carbs,
        fat,
        hydration,
        quality
      });
    }
    return data;
  }, []);

  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
  const [chartMode, setChartMode] = useState<'calories' | 'macros'>('calories');

  // Compute stats
  const stats = useMemo(() => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalHydration = 0;
    let cleanMealDays = 0;

    dailyData.forEach(d => {
      totalCalories += d.calories;
      totalProtein += d.protein;
      totalCarbs += d.carbs;
      totalFat += d.fat;
      totalHydration += d.hydration;
      if (d.quality !== "Cheat Day") {
        cleanMealDays += 1;
      }
    });

    return {
      totalCalories,
      avgCalories: Math.round(totalCalories / 30),
      avgProtein: Math.round(totalProtein / 30),
      avgCarbs: Math.round(totalCarbs / 30),
      avgFat: Math.round(totalFat / 30),
      avgHydration: Math.round(totalHydration / 30),
      cleanPercent: Math.round((cleanMealDays / 30) * 100)
    };
  }, [dailyData]);

  // Compute weekly details
  const weeklyData = useMemo(() => {
    const weeks = [];
    for (let w = 0; w < 4; w++) {
      const startIdx = w * 7;
      const endIdx = startIdx + 7;
      const weekSlice = dailyData.slice(startIdx, endIdx);
      
      let sumCal = 0;
      let sumProt = 0;
      let sumHyd = 0;
      weekSlice.forEach(d => {
        sumCal += d.calories;
        sumProt += d.protein;
        sumHyd += d.hydration;
      });

      const avgCal = Math.round(sumCal / 7);
      const avgProt = Math.round(sumProt / 7);
      const avgHyd = Math.round(sumHyd / 7);
      
      // Weekly tags & insights
      let insight = "";
      let compliance = "";
      let colorClass = "";
      let bgLight = "";

      if (w === 0) {
        insight = "Excellent calorie control. Highly active week with clean macros.";
        compliance = "92% Goal Compliance";
        colorClass = "text-[#2D6A4F] border-[#B7E4C7]";
        bgLight = "bg-[#D8F3DC]/30";
      } else if (w === 1) {
        insight = "Slightly higher weekend calories. Good hydration maintained.";
        compliance = "84% Goal Compliance";
        colorClass = "text-amber-800 border-amber-200";
        bgLight = "bg-amber-50/50";
      } else if (w === 2) {
        insight = "Peak high-protein performance. Best workout nutrition logged.";
        compliance = "96% Peak Fitness";
        colorClass = "text-emerald-800 border-[#B7E4C7]";
        bgLight = "bg-[#D8F3DC]/20";
      } else {
        insight = "Consistent daily baseline achieved. Perfect fiber & hydration levels.";
        compliance = "88% Balanced";
        colorClass = "text-teal-800 border-teal-200";
        bgLight = "bg-teal-50/30";
      }

      weeks.push({
        weekNum: w + 1,
        dateRange: `${weekSlice[0].date.split(' ')[0]} - ${weekSlice[6].date.split(' ')[0]} ${weekSlice[6].date.split(' ')[1]}`,
        avgCal,
        avgProt,
        avgHyd,
        insight,
        compliance,
        colorClass,
        bgLight
      });
    }
    return weeks;
  }, [dailyData]);

  // Handle Export Excel Report
  const handleExportExcel = () => {
    try {
      // 1. Structure the detailed nutrition log row items
      const logsSheetData = dailyData.map(d => ({
        "Day": `Day ${d.day}`,
        "Date": d.date,
        "Calorie Intake (kcal)": d.calories,
        "Protein (g)": d.protein,
        "Carbohydrates (g)": d.carbs,
        "Fat (g)": d.fat,
        "Hydration (ml)": d.hydration,
        "Diet Archetype": d.quality
      }));

      // 2. Structure an Overview/Summary card sheet
      const summarySheetData = [
        { "Metric Parameter": "Log Range Duration", "Value": "30 Days (June 7, 2026 - July 6, 2026)" },
        { "Metric Parameter": "Total Monthly Calories Consumed", "Value": `${stats.totalCalories.toLocaleString()} kcal` },
        { "Metric Parameter": "Average Daily Caloric Intake", "Value": `${stats.avgCalories} kcal/day` },
        { "Metric Parameter": "Target Daily Budget", "Value": "2,200 kcal/day" },
        { "Metric Parameter": "Average Daily Protein", "Value": `${stats.avgProtein} g` },
        { "Metric Parameter": "Average Daily Carbohydrates", "Value": `${stats.avgCarbs} g` },
        { "Metric Parameter": "Average Daily Fats", "Value": `${stats.avgFat} g` },
        { "Metric Parameter": "Average Hydration Score", "Value": `${stats.avgHydration} ml/day` },
        { "Metric Parameter": "Healthy Dining Score", "Value": `${stats.cleanPercent}% Clean Meals` },
        { "Metric Parameter": "Report Generation Date", "Value": "July 6, 2026" },
        { "Metric Parameter": "DineGenie Intelligence Engine", "Value": "Active Premium Sandbox" }
      ];

      // 3. Create Excel workbook and appends
      const workbook = XLSX.utils.book_new();
      
      const logsWorksheet = XLSX.utils.json_to_sheet(logsSheetData);
      const summaryWorksheet = XLSX.utils.json_to_sheet(summarySheetData);

      // Simple column widths configuration
      logsWorksheet['!cols'] = [
        { wch: 8 },  { wch: 15 }, { wch: 22 }, { wch: 12 }, 
        { wch: 18 }, { wch: 12 }, { wch: 15 }, { wch: 18 }
      ];
      summaryWorksheet['!cols'] = [
        { wch: 32 }, { wch: 45 }
      ];

      XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Monthly Overview");
      XLSX.utils.book_append_sheet(workbook, logsWorksheet, "Daily Nutrition Log");

      // 4. Trigger download
      XLSX.writeFile(workbook, "DineGenie_Nutrition_Report_July2026.xlsx");
      
      triggerToast("✨ Excel report downloaded successfully! Check your downloads.");
    } catch (error) {
      console.error("Excel generation error:", error);
      triggerToast("❌ Failed to generate Excel. Please try again.");
    }
  };

  // Custom SVG Chart parameters
  const chartWidth = 720;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 20;
  
  const graphWidth = chartWidth - paddingX * 2;
  const graphHeight = chartHeight - paddingY * 2;

  // Find min and max for rendering
  const maxCal = 2800;
  const minCal = 1400;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Panel */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-[#D8F3DC]/40 via-[#FFFDF8] to-[#D8F3DC]/15 border border-[#B7E4C7]/40 shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#52B788]/5 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#B7E4C7]/10 rounded-full blur-2xl -z-10" />
        
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8F3DC] text-[#2D6A4F] text-xs font-bold border border-[#B7E4C7]/50">
            <Lucide.Sparkles className="w-3.5 h-3.5 text-[#52B788] animate-pulse" />
            <span>Premium Nutrition Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c2e24] tracking-tight font-display">
            Monthly <span className="text-[#52B788]">Nutrition Dashboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5e7166] max-w-xl leading-relaxed">
            Consolidated analytics of your caloric habits, macronutrient balance, and localized meal compliance across Jaipur's top specialty culinary spots.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={handleExportExcel}
            className="px-5 py-3 bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-[#1b4332]"
          >
            <Lucide.FileSpreadsheet className="w-4 h-4 text-[#52B788]" />
            <span>Export Excel Report</span>
          </button>
          
          <div className="px-4 py-3 bg-white/70 backdrop-blur-md rounded-2xl border border-[#B7E4C7]/30 shadow-sm flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 bg-[#52B788] rounded-full animate-ping" />
            <span className="text-[11px] font-black text-[#1c2e24] uppercase tracking-wider">
              June - July 2026
            </span>
          </div>
        </div>
      </div>

      {/* Metric Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Calories Card */}
        <div className="p-6 rounded-[28px] bg-white border border-[#B7E4C7]/20 shadow-premium flex flex-col justify-between h-48 group hover:border-[#52B788]/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5e7166] uppercase tracking-wider">Total Monthly Energy</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#52B788]">
              <Lucide.Activity className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-[#1c2e24] font-mono tracking-tight">
              {stats.totalCalories.toLocaleString()}
            </h3>
            <p className="text-[11px] text-[#5e7166] font-medium mt-1">kilo-calories logged this month</p>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-[#F8F5F2]">
            <div className="flex justify-between text-[10px] font-bold text-[#5e7166]">
              <span>Monthly Target compliance</span>
              <span className="text-[#2D6A4F]">95% of Goal</span>
            </div>
            <div className="w-full bg-[#F8F5F2] h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#52B788] to-[#B7E4C7] h-full rounded-full" style={{ width: '95%' }} />
            </div>
          </div>
        </div>

        {/* Average Calories Card */}
        <div className="p-6 rounded-[28px] bg-white border border-[#B7E4C7]/20 shadow-premium flex flex-col justify-between h-48 group hover:border-[#52B788]/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5e7166] uppercase tracking-wider">Daily Calorie Average</span>
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
              <Lucide.Flame className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-[#1c2e24] font-mono tracking-tight">
              {stats.avgCalories} <span className="text-sm font-semibold text-gray-400">kcal/d</span>
            </h3>
            <p className="text-[11px] text-[#5e7166] font-medium mt-1">Goal baseline set at 2,200 kcal/day</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D6A4F] bg-[#D8F3DC]/40 border border-[#B7E4C7]/20 px-2.5 py-1.5 rounded-xl self-start">
            <Lucide.TrendingDown className="w-3.5 h-3.5 text-[#52B788]" />
            <span>-126 kcal below budget</span>
          </div>
        </div>

        {/* Core Macronutrients Balance */}
        <div className="p-6 rounded-[28px] bg-white border border-[#B7E4C7]/20 shadow-premium flex flex-col justify-between h-48 group hover:border-[#52B788]/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5e7166] uppercase tracking-wider">Macro Averages (Grams)</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
              <Lucide.PieChart className="w-5 h-5" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2.5 text-center my-1">
            <div className="bg-[#D8F3DC]/30 p-1.5 rounded-xl border border-[#B7E4C7]/20">
              <p className="text-[9px] font-black text-[#2D6A4F] uppercase tracking-wider">PROTEIN</p>
              <p className="text-sm font-black text-[#1b4332] font-mono mt-0.5">{stats.avgProtein}g</p>
            </div>
            <div className="bg-amber-50/50 p-1.5 rounded-xl border border-amber-100">
              <p className="text-[9px] font-black text-amber-800 uppercase tracking-wider">CARBS</p>
              <p className="text-sm font-black text-amber-900 font-mono mt-0.5">{stats.avgCarbs}g</p>
            </div>
            <div className="bg-rose-50/50 p-1.5 rounded-xl border border-rose-100">
              <p className="text-[9px] font-black text-rose-800 uppercase tracking-wider">FATS</p>
              <p className="text-sm font-black text-rose-900 font-mono mt-0.5">{stats.avgFat}g</p>
            </div>
          </div>
          <p className="text-[9.5px] text-[#5e7166] text-center font-semibold">
            Balanced 25% Protein, 55% Carbs, 20% Fats calorie ratio
          </p>
        </div>

        {/* Hydration Score & Meal Compliance */}
        <div className="p-6 rounded-[28px] bg-white border border-[#B7E4C7]/20 shadow-premium flex flex-col justify-between h-48 group hover:border-[#52B788]/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5e7166] uppercase tracking-wider">Daily Hydration Score</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 animate-bounce">
              <Lucide.Droplet className="w-5 h-5 fill-blue-500" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-[#1c2e24] font-mono tracking-tight">
              {(stats.avgHydration / 1000).toFixed(1)} <span className="text-sm font-semibold text-gray-400">Liters/d</span>
            </h3>
            <p className="text-[11px] text-[#5e7166] font-medium mt-1">Excellent water levels logged daily</p>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-[#1c2e24] pt-2 border-t border-[#F8F5F2]">
            <span className="text-[#8fa395]">Clean dining score:</span>
            <span className="px-2 py-0.5 rounded-lg bg-[#D8F3DC] text-[#2D6A4F]">
              {stats.cleanPercent}% Clean
            </span>
          </div>
        </div>

      </div>

      {/* Interactive 30-Day Trend Chart & Selection */}
      <div className="p-6 rounded-[32px] bg-white border border-[#B7E4C7]/20 shadow-premium space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-[#1c2e24] font-display flex items-center gap-2">
              <Lucide.BarChart3 className="w-5 h-5 text-[#52B788]" />
              <span>30-Day Nutritional Intake Log</span>
            </h2>
            <p className="text-xs text-[#5e7166]">
              Hover across data coordinates to view accurate meal metrics, macros, and diet archetypes.
            </p>
          </div>

          <div className="inline-flex p-1 bg-[#F8F5F2] rounded-xl border border-[#B7E4C7]/20 self-start sm:self-center">
            <button
              onClick={() => setChartMode('calories')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartMode === 'calories' 
                  ? 'bg-[#52B788] text-white shadow-sm' 
                  : 'text-[#5e7166] hover:text-[#1c2e24]'
              }`}
            >
              Calorie Graph
            </button>
            <button
              onClick={() => setChartMode('macros')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartMode === 'macros' 
                  ? 'bg-[#52B788] text-white shadow-sm' 
                  : 'text-[#5e7166] hover:text-[#1c2e24]'
              }`}
            >
              Macro Graph
            </button>
          </div>
        </div>

        {/* The Custom Responsive SVG Chart Area */}
        <div className="relative border border-[#B7E4C7]/15 rounded-[24px] bg-gradient-to-b from-[#FFFDF8]/30 to-[#F8F5F2]/20 p-4 overflow-x-auto scrollbar-none">
          <div className="min-w-[650px]">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-auto"
            >
              <defs>
                {/* Glow & Area Gradients */}
                <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#52B788" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#52B788" stopOpacity="0.00" />
                </linearGradient>
                <linearGradient id="protGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3A86C8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3A86C8" stopOpacity="0.00" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#52B788" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* Grid Lines */}
              {[0, 1, 2, 3, 4].map((gridLine, i) => {
                const y = paddingY + (i / 4) * graphHeight;
                const calVal = Math.round(maxCal - (i / 4) * (maxCal - minCal));
                return (
                  <g key={i} className="opacity-40">
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="#B7E4C7"
                      strokeWidth="0.8"
                      strokeDasharray="4,4"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 4}
                      fill="#5e7166"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {calVal}
                    </text>
                  </g>
                );
              })}

              {/* Dynamic Path Builder - Calories Area */}
              {chartMode === 'calories' && (() => {
                // Generate path points
                const points = dailyData.map((d, i) => {
                  const x = paddingX + (i / 29) * graphWidth;
                  const y = chartHeight - paddingY - ((d.calories - minCal) / (maxCal - minCal)) * graphHeight;
                  return { x, y };
                });

                // Generate SVG Area path
                let pathStr = `M ${points[0].x} ${points[0].y}`;
                points.slice(1).forEach(p => {
                  pathStr += ` L ${p.x} ${p.y}`;
                });
                const areaStr = `${pathStr} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

                return (
                  <>
                    {/* Shadow filled area */}
                    <path d={areaStr} fill="url(#calGrad)" />

                    {/* Glowing Stroke line */}
                    <path
                      d={pathStr}
                      fill="none"
                      stroke="#52B788"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      filter="url(#glow)"
                    />

                    {/* Coordinates node indicators */}
                    {points.map((p, i) => {
                      const isHovered = hoveredDay?.day === i + 1;
                      return (
                        <circle
                          key={i}
                          cx={p.x}
                          cy={p.y}
                          r={isHovered ? 5.5 : 2}
                          fill={isHovered ? "#1b4332" : "#52B788"}
                          stroke="white"
                          strokeWidth={isHovered ? 2 : 1}
                          className="transition-all duration-150"
                        />
                      );
                    })}
                  </>
                );
              })()}

              {/* Macros Mode: Display separate stacked line layers */}
              {chartMode === 'macros' && (() => {
                // We plot Protein & Carbs relative to local scales
                // Scale Protein: min=40, max=160. Scale Carbs: min=100, max=300
                const proteinPoints = dailyData.map((d, i) => {
                  const x = paddingX + (i / 29) * graphWidth;
                  const y = chartHeight - paddingY - ((d.protein - 40) / 120) * graphHeight;
                  return { x, y };
                });

                const carbsPoints = dailyData.map((d, i) => {
                  const x = paddingX + (i / 29) * graphWidth;
                  const y = chartHeight - paddingY - ((d.carbs - 100) / 200) * graphHeight;
                  return { x, y };
                });

                let protPath = `M ${proteinPoints[0].x} ${proteinPoints[0].y}`;
                let carbPath = `M ${carbsPoints[0].x} ${carbsPoints[0].y}`;
                
                proteinPoints.slice(1).forEach(p => { protPath += ` L ${p.x} ${p.y}`; });
                carbsPoints.slice(1).forEach(p => { carbPath += ` L ${p.x} ${p.y}`; });

                return (
                  <>
                    {/* Protein Area & Line */}
                    <path d={protPath} fill="none" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" />
                    {proteinPoints.map((p, i) => (
                      <circle
                        key={`p-${i}`}
                        cx={p.x}
                        cy={p.y}
                        r={hoveredDay?.day === i + 1 ? 5 : 1.5}
                        fill="#2D6A4F"
                        stroke="white"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Carbs Line */}
                    <path d={carbPath} fill="none" stroke="#D9A05B" strokeWidth="2" strokeLinecap="round" strokeDasharray="3,1" />
                    {carbsPoints.map((p, i) => (
                      <circle
                        key={`c-${i}`}
                        cx={p.x}
                        cy={p.y}
                        r={hoveredDay?.day === i + 1 ? 5 : 1.5}
                        fill="#D9A05B"
                        stroke="white"
                        strokeWidth="1"
                      />
                    ))}
                  </>
                );
              })()}

              {/* Bottom Date labels */}
              {[0, 7, 14, 21, 28].map((index) => {
                if (index >= dailyData.length) return null;
                const d = dailyData[index];
                const x = paddingX + (index / 29) * graphWidth;
                return (
                  <text
                    key={index}
                    x={x}
                    y={chartHeight - 4}
                    fill="#8fa395"
                    fontSize="9"
                    fontWeight="extrabold"
                    textAnchor="middle"
                  >
                    {d.date.split(' ')[0]} {d.date.split(' ')[1]}
                  </text>
                );
              })}

              {/* Interactive Hover Overlay Bars */}
              {dailyData.map((d, i) => {
                const x = paddingX + (i / 29) * graphWidth;
                const cellWidth = graphWidth / 30;
                return (
                  <rect
                    key={`hover-${i}`}
                    x={x - cellWidth / 2}
                    y={paddingY}
                    width={cellWidth}
                    height={graphHeight}
                    fill="transparent"
                    onMouseEnter={() => setHoveredDay(d)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className="cursor-pointer"
                  />
                );
              })}
            </svg>
          </div>

          {/* Glowing cursor details tooltip */}
          <AnimatePresence>
            {hoveredDay && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-[#B7E4C7] p-4 rounded-2xl shadow-premium-lg z-20 space-y-2 pointer-events-none min-w-[170px]"
              >
                <div className="flex items-center justify-between gap-2 pb-1 border-b border-[#B7E4C7]/20">
                  <span className="text-[10px] font-black text-[#52B788] uppercase tracking-wider">Day {hoveredDay.day}</span>
                  <span className="text-[10px] text-[#5e7166] font-semibold">{hoveredDay.date}</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[#5e7166]">Energy:</span>
                    <span className="font-bold text-[#1c2e24] font-mono">{hoveredDay.calories} kcal</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[#5e7166]">Protein:</span>
                    <span className="font-bold text-[#2D6A4F] font-mono">{hoveredDay.protein}g</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[#5e7166]">Carbs:</span>
                    <span className="font-bold text-amber-800 font-mono">{hoveredDay.carbs}g</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[#5e7166]">Fats:</span>
                    <span className="font-bold text-rose-800 font-mono">{hoveredDay.fat}g</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium pt-1 border-t border-[#F8F5F2]">
                    <span className="text-[#5e7166]">Water:</span>
                    <span className="font-bold text-blue-700 font-mono">{hoveredDay.hydration}ml</span>
                  </div>
                </div>

                <div className={`text-[9px] font-bold uppercase tracking-wider text-center py-0.5 rounded ${
                  hoveredDay.quality === "Cheat Day" 
                    ? "bg-rose-100 text-rose-800"
                    : hoveredDay.quality === "High Protein"
                    ? "bg-blue-100 text-blue-800"
                    : hoveredDay.quality === "Excellent"
                    ? "bg-[#D8F3DC] text-[#2D6A4F]"
                    : "bg-[#F8F5F2] text-[#5e7166]"
                }`}>
                  {hoveredDay.quality}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legend Indicator */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-bold text-[#5e7166]">
          {chartMode === 'calories' ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 bg-[#52B788] rounded-full" />
              <span>Daily Calories Consumed (kcal)</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="w-4 h-1 bg-[#2D6A4F] rounded-full" />
                <span>Protein Intake (g)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-1 bg-amber-500 rounded-full" />
                <span>Carbohydrate Intake (g)</span>
              </div>
            </>
          )}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-white border border-[#B7E4C7] rounded-full" />
            <span>Interactive Hover Nodes</span>
          </div>
        </div>
      </div>

      {/* Weekly Progress Overview Cards */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-extrabold text-[#1c2e24] font-display flex items-center gap-2">
            <Lucide.CalendarDays className="w-5 h-5 text-[#52B788]" />
            <span>Weekly Progress Breakdown</span>
          </h2>
          <p className="text-xs text-[#5e7166]">
            Compare calorie averages and custom fitness insights across the four localized weeks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {weeklyData.map((week) => (
            <div
              key={week.weekNum}
              className="p-5 rounded-[24px] bg-white border border-[#B7E4C7]/20 shadow-premium flex flex-col justify-between h-56 transition-all duration-300 hover:shadow-premium-lg group hover:-translate-y-1"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#52B788] uppercase tracking-wider">
                    WEEK {week.weekNum}
                  </span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${week.colorClass} ${week.bgLight}`}>
                    {week.compliance}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-bold">{week.dateRange}</p>
              </div>

              <div className="my-3 space-y-1.5 py-2.5 border-y border-[#F8F5F2]">
                <div className="flex justify-between text-xs">
                  <span className="text-[#5e7166] font-medium">Avg Calories:</span>
                  <span className="font-bold text-[#1c2e24] font-mono">{week.avgCal} kcal</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#5e7166] font-medium">Avg Protein:</span>
                  <span className="font-bold text-[#2D6A4F] font-mono">{week.avgProt}g/day</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#5e7166] font-medium">Hydration:</span>
                  <span className="font-bold text-blue-700 font-mono">{(week.avgHyd / 1000).toFixed(1)} Liters</span>
                </div>
              </div>

              <div>
                <p className="text-[10.5px] text-[#2D6A4F] leading-relaxed font-semibold italic">
                  💡 "{week.insight}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Nutritionist Insights Footer Card */}
      <div className="p-6 rounded-[28px] bg-gradient-to-br from-[#FFFDF8] via-white to-[#D8F3DC]/20 border border-[#B7E4C7]/30 shadow-premium flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#52B788]/5 rounded-full blur-2xl" />
        
        <div className="w-14 h-14 bg-[#D8F3DC] rounded-2xl flex items-center justify-center text-[#52B788] shrink-0 border border-[#B7E4C7]/35 shadow-sm">
          <Lucide.Sparkles className="w-7 h-7 animate-pulse-slow" />
        </div>

        <div className="space-y-1.5 flex-1">
          <h4 className="font-black text-sm text-[#1b4332] uppercase tracking-wider font-display">
            Luna AI Nutrition Insights
          </h4>
          <p className="text-xs text-[#5e7166] leading-relaxed">
            Your high-protein discipline during mid-weeks is exemplary, showing strong alignment with clean nutrition. To keep this optimized, try pairing Tapri Central's delicious <strong className="text-[#1c2e24]">Saffron Masala Chai (₹90)</strong> with low-fat, high-fiber options or order a custom high-protein salad from Zolocrust next week. Keep logging your hydration!
          </p>
        </div>
      </div>

    </div>
  );
}
