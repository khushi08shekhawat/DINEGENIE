/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AINutritionDashboardProps {
  onOpenLunaWithPrompt: (prompt: string) => void;
  triggerToast: (message: string) => void;
}

interface MealItem {
  id: string;
  type: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
  name: string;
  restaurant: string;
  calories: number;
  protein: number;
  rating: number; // health score out of 5
  image: string;
  time: string;
}

interface ChartDataPoint {
  label: string;
  calories: number;
  protein: number;
  water: number; // in ml
  carbs: number;
  fat: number;
}

export default function AINutritionDashboard({ onOpenLunaWithPrompt, triggerToast }: AINutritionDashboardProps) {
  // Active interactive chart tab
  const [activeChartTab, setActiveChartTab] = useState<'calories' | 'protein' | 'water' | 'carbs' | 'fat'>('calories');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(6); // Default to today (Sunday)

  // Mock weekly data for interactive charts
  const weeklyData: ChartDataPoint[] = [
    { label: 'Mon', calories: 1850, protein: 55, water: 2200, carbs: 120, fat: 50 },
    { label: 'Tue', calories: 1920, protein: 58, water: 2400, carbs: 140, fat: 55 },
    { label: 'Wed', calories: 1780, protein: 60, water: 2000, carbs: 110, fat: 48 },
    { label: 'Thu', calories: 2100, protein: 68, water: 2800, carbs: 165, fat: 62 },
    { label: 'Fri', calories: 2050, protein: 65, water: 2500, carbs: 150, fat: 58 },
    { label: 'Sat', calories: 2200, protein: 72, water: 1800, carbs: 190, fat: 68 },
    { label: 'Sun', calories: 980,  protein: 62, water: 2250, carbs: 78,  fat: 45 }, // Today
  ];

  // Macros target vs actual
  const stats = [
    {
      id: 'calories',
      label: 'Calories',
      icon: 'Flame',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      strokeColor: '#F97316',
      actual: 980,
      target: 2000,
      unit: 'kcal',
    },
    {
      id: 'protein',
      label: 'Protein',
      icon: 'Dumbbell',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      strokeColor: '#10B981',
      actual: 62,
      target: 90, // target protein
      unit: 'g',
    },
    {
      id: 'carbs',
      label: 'Carbs',
      icon: 'Wheat',
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
      strokeColor: '#F59E0B',
      actual: 78,
      target: 220,
      unit: 'g',
    },
    {
      id: 'fat',
      label: 'Fat',
      icon: 'Sparkles', // represents lipids/fat/healthy acids
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      strokeColor: '#3B82F6',
      actual: 45,
      target: 70,
      unit: 'g',
    },
  ];

  // Today's Meal logs
  const [meals, setMeals] = useState<MealItem[]>([
    {
      id: 'meal-1',
      type: 'Breakfast',
      name: 'Avocado Toast with Poached Eggs',
      restaurant: 'The Green Bowl',
      calories: 380,
      protein: 18,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400',
      time: '08:30 AM',
    },
    {
      id: 'meal-2',
      type: 'Lunch',
      name: 'Paneer Butter Masala with Garlic Naan',
      restaurant: 'Taj Palace',
      calories: 450,
      protein: 24,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=400',
      time: '01:15 PM',
    },
    {
      id: 'meal-3',
      type: 'Snacks',
      name: 'Mixed Berry Smoothie with Chia Seeds',
      restaurant: 'Jaipur Juice Co.',
      calories: 150,
      protein: 8,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=400',
      time: '04:45 PM',
    },
    {
      id: 'meal-4',
      type: 'Dinner',
      name: 'Sautéed Edamame & Lentil Salad Bowl',
      restaurant: 'Bake & Brew Cafe',
      calories: 320,
      protein: 20,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400',
      time: '08:00 PM',
    },
  ]);

  // Comprehensive Nutrition Breakdown
  const nutritionBreakdown = [
    { name: 'Protein', actual: 62, target: 90, unit: 'g', color: 'bg-[#52B788]' },
    { name: 'Carbs', actual: 78, target: 220, unit: 'g', color: 'bg-amber-400' },
    { name: 'Fat', actual: 45, target: 70, unit: 'g', color: 'bg-blue-400' },
    { name: 'Fiber', actual: 28, target: 30, unit: 'g', color: 'bg-emerald-600' },
    { name: 'Sugar', actual: 22, target: 50, unit: 'g', color: 'bg-rose-400' },
    { name: 'Sodium', actual: 1600, target: 2300, unit: 'mg', color: 'bg-purple-400' },
    { name: 'Vitamin C', actual: 85, target: 90, unit: 'mg', color: 'bg-orange-400' },
    { name: 'Iron', actual: 14, target: 18, unit: 'mg', color: 'bg-pink-400' },
  ];

  // AI suggestions list
  const suggestions = [
    {
      id: 'sug-1',
      title: 'Swap Fries → Salad',
      desc: 'Saves 280 kcal and boosts Vitamin A/C by 150%. Highly recommended for your next side.',
      icon: '🥗',
      accent: 'border-emerald-200 bg-emerald-50/60 text-emerald-800',
    },
    {
      id: 'sug-2',
      title: 'Drink More Water',
      desc: 'You are at 2.2L today. Adding 1 glass of coconut water or lemon mint cooler completes your target.',
      icon: '💧',
      accent: 'border-blue-200 bg-blue-50/60 text-blue-800',
    },
    {
      id: 'sug-3',
      title: 'Increase Protein',
      desc: 'Add organic paneer tikkas or edamame seeds to dinner to reach your optimal 90g builder threshold.',
      icon: '💪',
      accent: 'border-indigo-200 bg-indigo-50/60 text-indigo-800',
    },
    {
      id: 'sug-4',
      title: 'Reduce Refined Sugar',
      desc: 'Your sugar limit is fine, but choosing jaggery or natural berries over white sugar sustains stable energy.',
      icon: '🍎',
      accent: 'border-rose-200 bg-rose-50/60 text-rose-800',
    },
    {
      id: 'sug-5',
      title: 'Healthy Dessert Swap',
      desc: 'Try chilled mango mousse or coconut chia pudding instead of traditional milk desserts to skip trans fats.',
      icon: '🍨',
      accent: 'border-amber-200 bg-amber-50/60 text-amber-800',
    },
  ];

  const handleDownload = (format: string) => {
    triggerToast(`Compiling detailed bio-data... Your ${format} Nutrition Report is ready for download.`);
  };

  const handleShare = () => {
    triggerToast("Your secure nutritional metadata link was copied to clipboard!");
  };

  // Helper to get active chart coordinates and values
  const getChartConfig = () => {
    const values = weeklyData.map(d => {
      if (activeChartTab === 'calories') return d.calories;
      if (activeChartTab === 'protein') return d.protein;
      if (activeChartTab === 'water') return d.water;
      if (activeChartTab === 'carbs') return d.carbs;
      return d.fat;
    });

    const labels = weeklyData.map(d => d.label);
    const maxVal = Math.max(...values) * 1.15; // padding for top of chart
    
    // SVG Dimensions
    const width = 500;
    const height = 180;
    const paddingLeft = 40;
    const paddingRight = 15;
    const paddingTop = 20;
    const paddingBottom = 25;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Generate points
    const points = values.map((val, idx) => {
      const x = paddingLeft + (idx / (values.length - 1)) * chartWidth;
      const y = paddingTop + chartHeight - (val / maxVal) * chartHeight;
      return { x, y, value: val, label: labels[idx] };
    });

    // Color definitions
    let gradientStart = '#86EFAC'; // green-300
    let gradientEnd = '#22C55E';   // green-500
    let strokeColor = '#10B981';
    let unitLabel = '';

    if (activeChartTab === 'calories') {
      gradientStart = '#FED7AA'; // orange-200
      gradientEnd = '#F97316';   // orange-500
      strokeColor = '#EA580C';
      unitLabel = 'kcal';
    } else if (activeChartTab === 'protein') {
      gradientStart = '#A7F3D0'; // emerald-200
      gradientEnd = '#059669';   // emerald-600
      strokeColor = '#047857';
      unitLabel = 'g';
    } else if (activeChartTab === 'water') {
      gradientStart = '#BFDBFE'; // blue-200
      gradientEnd = '#3B82F6';   // blue-500
      strokeColor = '#2563EB';
      unitLabel = 'ml';
    } else if (activeChartTab === 'carbs') {
      gradientStart = '#FDE68A'; // amber-200
      gradientEnd = '#D97706';   // amber-600
      strokeColor = '#B45309';
      unitLabel = 'g';
    } else if (activeChartTab === 'fat') {
      gradientStart = '#C7D2FE'; // indigo-200
      gradientEnd = '#4F46E5';   // indigo-600
      strokeColor = '#4338CA';
      unitLabel = 'g';
    }

    return { points, chartWidth, chartHeight, paddingLeft, paddingTop, maxVal, strokeColor, gradientStart, gradientEnd, unitLabel };
  };

  const chartInfo = getChartConfig();

  // Dynamic Lucide helper
  const renderIcon = (iconName: string, className = "w-5 h-5") => {
    const IconComponent = (Lucide as any)[iconName];
    if (IconComponent) {
      return <IconComponent className={className} />;
    }
    return <Lucide.Sparkles className={className} />;
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 text-left z-10 relative">
      
      {/* Page Header */}
      <section className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D8F3DC] text-[#2D6A4F] text-[10px] font-extrabold rounded-full border border-[#B7E4C7]/40 select-none mb-3">
            <span>🥗</span>
            <span>AI BIO-MATRICES ACTIVE</span>
          </div>
          <h2 className="text-3xl font-black text-[#1c2e24] font-display flex items-center gap-2.5 tracking-tight">
            <span>🍏</span>
            <span>AI Nutrition Dashboard</span>
          </h2>
          <p className="text-xs md:text-sm text-[#5e7166] mt-1 max-w-2xl leading-relaxed">
            Real-time biometric monitoring, macro tracking, and personalized calorie analysis powered by DineGenie.
          </p>
        </div>
      </section>

      {/* 1. First Section: Four Statistic Cards with Progress Rings */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const pct = Math.min(100, Math.round((stat.actual / stat.target) * 100));
          const radius = 24;
          const stroke = 4;
          const normalizedRadius = radius - stroke * 2;
          const circumference = normalizedRadius * 2 * Math.PI;
          const strokeDashoffset = circumference - (pct / 100) * circumference;

          return (
            <div
              key={stat.id}
              className="p-5.5 rounded-[28px] border border-[#B7E4C7]/20 bg-white shadow-sm hover:shadow-premium transition-all duration-300 hover:-translate-y-1 flex items-center justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${stat.bgColor} ${stat.color} transition-transform group-hover:scale-110`}>
                    {renderIcon(stat.icon, "w-4.5 h-4.5")}
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</span>
                </div>
                
                <div className="space-y-0.5">
                  <div className="text-xl font-black text-[#1c2e24] font-display">
                    {stat.actual.toLocaleString()} <span className="text-xs font-bold text-gray-400">{stat.unit}</span>
                  </div>
                  <div className="text-[10px] font-bold text-[#5e7166]">
                    Goal: {stat.target.toLocaleString()} {stat.unit}
                  </div>
                </div>
              </div>

              {/* Progress Circle Visualizer */}
              <div className="relative flex items-center justify-center shrink-0">
                <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
                  <circle
                    stroke="#F1F5F9"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                  />
                  <circle
                    stroke={stat.strokeColor}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset }}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                  />
                </svg>
                <div className="absolute text-[10px] font-black text-[#1c2e24] font-display">
                  {pct}%
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 2. Second Section: Large Health Score Card with circular indicator */}
      <section className="p-8 rounded-[32px] border border-white/60 bg-gradient-to-br from-[#FFFDF8] via-white/50 to-[#D8F3DC]/20 shadow-premium relative overflow-hidden flex flex-col lg:flex-row items-center gap-8">
        <div className="absolute right-0 top-0 w-60 h-60 bg-gradient-to-bl from-[#52B788]/10 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        {/* Circle Score Chart Container */}
        <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#E2E8F0"
              strokeWidth="10"
              fill="transparent"
              className="opacity-80"
            />
            {/* Active circle with glow */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#52B788"
              strokeWidth="10"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (92 / 100) * 251.2}
              strokeLinecap="round"
              fill="transparent"
              className="drop-shadow-[0_2px_8px_rgba(82,183,136,0.25)]"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-black text-[#1c2e24] font-display">92</span>
            <span className="text-[10px] font-extrabold text-[#52B788] uppercase tracking-widest border-t border-[#B7E4C7]/30 pt-1 mt-0.5">/ 100</span>
          </div>
        </div>

        {/* Narrative & Score Breakdown */}
        <div className="flex-1 space-y-4 text-center lg:text-left">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold rounded-full border border-emerald-100 select-none">
              🔥 Excellent Health Grade
            </div>
            <h3 className="text-2xl font-black text-[#1c2e24] font-display">Your nutrition is well balanced today.</h3>
            <p className="text-xs text-[#5e7166] max-w-xl leading-relaxed">
              Your protein-to-calorie density ranks in the 95th percentile. Stable glycemic index and high hydration keep brain performance optimal.
            </p>
          </div>

          {/* AI Insight snippet */}
          <div className="p-4 bg-white/75 backdrop-blur-sm border border-[#B7E4C7]/20 rounded-2xl">
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-[#2D6A4F] uppercase tracking-wider mb-1">
              <Lucide.Sparkles className="w-3.5 h-3.5 text-[#52B788]" />
              <span>DineGenie AI Insight</span>
            </div>
            <p className="text-xs text-[#1c2e24] font-medium leading-relaxed italic">
              "By swapping fries for fresh greens this afternoon, you successfully avoided 280 calories of oxidized trans-fats and boosted high-density fiber by 4g. Superb choice, Khushi!"
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
            <button
              type="button"
              onClick={() => onOpenLunaWithPrompt("Analyze my macro balance and suggest a custom high-protein grocery recipe draft")}
              className="px-4 py-2 bg-[#52B788] hover:bg-[#40916C] text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Lucide.Bot className="w-3.5 h-3.5" />
              <span>Consult Meal Plan with Luna</span>
            </button>
            <button
              type="button"
              onClick={() => triggerToast("Biometric syncing re-established. All data is real-time.")}
              className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-[#1c2e24] text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Sync Fitbit Metadata
            </button>
          </div>
        </div>
      </section>

      {/* 3. Third Section: Interactive Charts (Weekly Calories, Protein Intake, Water Intake, etc.) */}
      <section className="p-6 md:p-8 rounded-[32px] border border-[#B7E4C7]/25 bg-white shadow-premium relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-extrabold text-[#1c2e24] font-display">Biometric Curation Charts</h3>
            <p className="text-xs text-[#5e7166]">Click on tabs to alternate visual metrics and analyze historical progress</p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap gap-1.5 bg-gray-50 p-1 rounded-2xl border border-gray-100 shrink-0">
            {(['calories', 'protein', 'water', 'carbs', 'fat'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveChartTab(tab);
                  triggerToast(`Loading weekly ${tab} stats...`);
                }}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                  activeChartTab === tab
                    ? 'bg-[#52B788] text-white shadow-sm'
                    : 'text-gray-500 hover:text-[#1c2e24]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Rendered Line/Area Chart with Gradient Fill & interactivity */}
        <div className="relative">
          <svg className="w-full h-auto overflow-visible" viewBox="0 0 500 180" width="100%">
            {/* Definitions for Gradients */}
            <defs>
              <linearGradient id={`chart-grad-${activeChartTab}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartInfo.gradientStart} stopOpacity="0.45" />
                <stop offset="100%" stopColor={chartInfo.gradientStart} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = chartInfo.paddingTop + ratio * chartInfo.chartHeight;
              const val = Math.round(chartInfo.maxVal * (1 - ratio));
              return (
                <g key={idx}>
                  <line
                    x1={chartInfo.paddingLeft}
                    y1={y}
                    x2={500 - 15}
                    y2={y}
                    stroke="#F1F5F9"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={chartInfo.paddingLeft - 8}
                    y={y + 3}
                    textAnchor="end"
                    fill="#94A3B8"
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Area under the curve */}
            <path
              d={`
                M ${chartInfo.points[0].x} ${chartInfo.chartHeight + chartInfo.paddingTop}
                ${chartInfo.points.map(p => `L ${p.x} ${p.y}`).join(' ')}
                L ${chartInfo.points[chartInfo.points.length - 1].x} ${chartInfo.chartHeight + chartInfo.paddingTop}
                Z
              `}
              fill={`url(#chart-grad-${activeChartTab})`}
            />

            {/* Glowing Stroke line */}
            <path
              d={chartInfo.points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
              fill="none"
              stroke={chartInfo.strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Active circular nodes on curve */}
            {chartInfo.points.map((p, idx) => {
              const isSelected = selectedDayIndex === idx;
              return (
                <g
                  key={idx}
                  className="cursor-pointer group/node"
                  onClick={() => setSelectedDayIndex(idx)}
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isSelected ? "6" : "4"}
                    fill={isSelected ? "#1b4332" : chartInfo.strokeColor}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all duration-300 hover:scale-125"
                  />
                  {/* Invisible tap target */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="14"
                    fill="transparent"
                  />
                  {/* Axis Label */}
                  <text
                    x={p.x}
                    y={180 - 6}
                    textAnchor="middle"
                    fill={isSelected ? "#1b4332" : "#94A3B8"}
                    fontSize="9"
                    fontWeight={isSelected ? "bold" : "normal"}
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Chart Tooltip Overlay based on selected node */}
          {selectedDayIndex !== null && (
            <div className="absolute top-2 right-4 bg-[#1b4332] text-white px-3 py-2 rounded-xl text-left border border-white/10 shadow-lg text-[10px] space-y-0.5 pointer-events-none animate-in fade-in zoom-in duration-200">
              <div className="font-bold text-gray-300">{weeklyData[selectedDayIndex].label} (Sunday Track)</div>
              <div className="flex justify-between gap-4 font-extrabold text-white text-xs">
                <span className="capitalize">{activeChartTab}:</span>
                <span>
                  {activeChartTab === 'calories' && `${weeklyData[selectedDayIndex].calories} kcal`}
                  {activeChartTab === 'protein' && `${weeklyData[selectedDayIndex].protein} g`}
                  {activeChartTab === 'water' && `${weeklyData[selectedDayIndex].water} ml`}
                  {activeChartTab === 'carbs' && `${weeklyData[selectedDayIndex].carbs} g`}
                  {activeChartTab === 'fat' && `${weeklyData[selectedDayIndex].fat} g`}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Fourth Section: Today's Meals (Breakfast, Lunch, Snacks, Dinner) */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-[#1c2e24] font-display flex items-center gap-2">
          <span className="w-1.5 h-6 bg-[#52B788] rounded-full inline-block" />
          <span>Today's Meals</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="bg-white rounded-[24px] border border-[#B7E4C7]/20 shadow-sm hover:shadow-premium transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden relative group"
            >
              {/* Image Banner */}
              <div className="relative h-32 bg-gray-100 overflow-hidden">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 left-2.5 bg-[#FFFDF8]/90 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-[#B7E4C7]/30 text-[9px] font-black text-[#2D6A4F] uppercase tracking-wide">
                  {meal.type}
                </div>
                <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-[9px] font-bold text-gray-700">
                  {meal.time}
                </div>
              </div>

              {/* Meal content */}
              <div className="p-4.5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="text-[9px] text-[#5e7166] font-bold uppercase tracking-wider">{meal.restaurant}</span>
                  <h4 className="font-extrabold text-xs text-[#1c2e24] line-clamp-2 leading-tight font-display">
                    {meal.name}
                  </h4>
                </div>

                <div className="space-y-2 pt-1.5 border-t border-gray-100">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400 font-semibold">Calories:</span>
                    <span className="font-bold text-[#1c2e24]">{meal.calories} kcal</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400 font-semibold">Protein:</span>
                    <span className="font-bold text-[#52B788]">{meal.protein}g</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400 font-semibold">Health Score:</span>
                    <div className="flex items-center gap-0.5 text-amber-500 font-bold select-none text-[9px]">
                      ★ {meal.rating}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onOpenLunaWithPrompt(`Analyze the nutritional facts of "${meal.name}" from "${meal.restaurant}" and provide healthy suggestions.`);
                    triggerToast(`Asking Luna about ${meal.type}...`);
                  }}
                  className="w-full py-1.5 bg-gray-50 hover:bg-[#D8F3DC] border border-[#B7E4C7]/20 rounded-xl text-[10px] font-bold text-[#2D6A4F] transition-all cursor-pointer text-center"
                >
                  Consult Meal
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Fifth Section: AI Suggestions (Swap Fries, Drink Water, Sugar, Dessert) */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-[#1c2e24] font-display flex items-center gap-2">
          <span className="w-1.5 h-6 bg-[#52B788] rounded-full inline-block" />
          <span>AI Recommendations & Swaps</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {suggestions.map((sug) => (
            <div
              key={sug.id}
              className={`p-4.5 rounded-[24px] border ${sug.accent} flex flex-col justify-between gap-3 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden`}
            >
              <div className="space-y-2 text-left">
                <div className="text-2xl">{sug.icon}</div>
                <h4 className="text-xs font-black text-[#1c2e24] font-display">{sug.title}</h4>
                <p className="text-[10px] text-gray-500 leading-relaxed font-semibold">{sug.desc}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onOpenLunaWithPrompt(`Tell me more about the swap suggestion: "${sug.title}". Detail its bio-nutritional benefits!`);
                  triggerToast(`Luna reviewing "${sug.title}" swap logic...`);
                }}
                className="w-full py-1.5 bg-white/95 hover:bg-white text-[9px] font-extrabold rounded-lg border border-[#B7E4C7]/30 text-[#1b4332] transition-colors cursor-pointer shadow-sm text-center"
              >
                Learn Swap Benefit ✦
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Sixth Section: Nutrition Breakdown progress bars */}
      <section className="p-6 md:p-8 rounded-[32px] border border-[#B7E4C7]/25 bg-white shadow-premium">
        <div className="space-y-1.5 mb-6">
          <h3 className="text-lg font-extrabold text-[#1c2e24] font-display">Macro & Micronutrient Index</h3>
          <p className="text-xs text-[#5e7166]">Detailed breakdown of your current intake vs daily recommended dietary allowances (RDA)</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nutritionBreakdown.map((item) => {
            const pct = Math.min(100, Math.round((item.actual / item.target) * 100));
            return (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-extrabold text-[#1c2e24]">{item.name}</span>
                  <span className="text-[10px] font-bold text-gray-400">
                    {item.actual} / {item.target} {item.unit}
                  </span>
                </div>
                
                {/* Horizontal progress bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[9px] font-bold text-gray-400">
                  <span>{pct}% Completed</span>
                  <span className={pct >= 85 ? 'text-[#52B788]' : 'text-amber-500'}>
                    {pct >= 100 ? 'Goal Reached' : pct >= 80 ? 'Optimal' : 'Needs Intake'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Bottom Section: Download / Export Reports */}
      <section className="p-8 rounded-[32px] bg-gradient-to-br from-[#1b4332] to-[#2D6A4F] text-white relative overflow-hidden text-left">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <h3 className="text-xl font-black font-display text-white">Generate Secure Biometric & Nutrition Report</h3>
            <p className="text-xs text-[#D8F3DC] max-w-xl leading-relaxed font-semibold">
              Share detailed health markers, dynamic food logs, and glycemic metrics with your dietician, gym coach, or medical practitioner safely.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex flex-wrap gap-3 w-full lg:w-auto shrink-0">
            <button
              type="button"
              onClick={() => handleDownload('Excel (CSV)')}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Lucide.FileSpreadsheet className="w-4 h-4 text-[#D8F3DC]" />
              <span>Download Excel</span>
            </button>
            <button
              type="button"
              onClick={() => handleDownload('PDF document')}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Lucide.FileDown className="w-4 h-4 text-[#D8F3DC]" />
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="px-4 py-3 bg-[#52B788] hover:bg-[#40916C] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#1b4332]/40 flex items-center justify-center gap-2 cursor-pointer col-span-2 sm:col-span-1 active:scale-95"
            >
              <Lucide.Share2 className="w-4 h-4" />
              <span>Share Report Link</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
