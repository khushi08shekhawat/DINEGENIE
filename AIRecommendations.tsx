/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIRecommendationsProps {
  onOpenLunaWithPrompt: (prompt: string) => void;
  triggerToast: (message: string) => void;
}

interface Dish {
  id: string;
  name: string;
  restaurant: string;
  price: number;
  time: string;
  rating: number; // e.g. 4.8
  calories: string;
  protein: string;
  matchPercentage: number;
  image: string;
  badges: string[];
  cuisine: string;
  spicy: boolean;
  dessert: boolean;
  beverage: boolean;
}

export default function AIRecommendations({ onOpenLunaWithPrompt, triggerToast }: AIRecommendationsProps) {
  // Today's AI Insights States (Customizable!)
  const [mood, setMood] = useState<string>('Happy 😊');
  const [weather, setWeather] = useState<string>('Sunny ☀️');
  const [budget, setBudget] = useState<number>(300);
  const [cuisinePref, setCuisinePref] = useState<string>('North Indian');
  const [healthGoal, setHealthGoal] = useState<string>('Balanced Diet');

  // Interactive Customization Modal State
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [tempMood, setTempMood] = useState(mood);
  const [tempBudget, setTempBudget] = useState(budget);
  const [tempCuisine, setTempCuisine] = useState(cuisinePref);
  const [tempHealthGoal, setTempHealthGoal] = useState(healthGoal);

  // Loading / Refreshing States
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshStep, setRefreshStep] = useState('');

  // Search/Filter state
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Expanded card state to show "Why Luna Picked This"
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Master Food Dishes Data
  const [dishes, setDishes] = useState<Dish[]>([
    {
      id: 'dish-1',
      name: 'Paneer Butter Masala with Garlic Naan',
      restaurant: 'Taj Palace',
      price: 299,
      time: '28 mins',
      rating: 4.8,
      calories: '640 kcal',
      protein: '18g',
      matchPercentage: 97,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=600',
      badges: ['Healthy', 'Trending', 'Budget Friendly'],
      cuisine: 'Indian',
      spicy: true,
      dessert: false,
      beverage: false,
    },
    {
      id: 'dish-2',
      name: 'Rajasthani Dal Baati Churma',
      restaurant: 'Chokhi Dhani',
      price: 350,
      time: '35 mins',
      rating: 4.9,
      calories: '850 kcal',
      protein: '22g',
      matchPercentage: 95,
      image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=600',
      badges: ['Trending', 'Premium'],
      cuisine: 'Indian',
      spicy: true,
      dessert: false,
      beverage: false,
    },
    {
      id: 'dish-3',
      name: 'Aromatic Veg Biryani',
      restaurant: 'Biryani House',
      price: 240,
      time: '22 mins',
      rating: 4.7,
      calories: '520 kcal',
      protein: '12g',
      matchPercentage: 93,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600',
      badges: ['Healthy', 'Budget Friendly'],
      cuisine: 'Indian',
      spicy: true,
      dessert: false,
      beverage: false,
    },
    {
      id: 'dish-4',
      name: 'Artisanal Woodfired Margherita Pizza',
      restaurant: 'Bake & Brew Cafe',
      price: 280,
      time: '20 mins',
      rating: 4.6,
      calories: '710 kcal',
      protein: '15g',
      matchPercentage: 91,
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=600',
      badges: ['Trending', 'Budget Friendly'],
      cuisine: 'Pizza',
      spicy: false,
      dessert: false,
      beverage: false,
    },
    {
      id: 'dish-5',
      name: 'Gourmet Cold Coffee',
      restaurant: 'Coffee Studio',
      price: 120,
      time: '15 mins',
      rating: 4.9,
      calories: '190 kcal',
      protein: '4g',
      matchPercentage: 96,
      image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600',
      badges: ['Budget Friendly'],
      cuisine: 'Coffee',
      spicy: false,
      dessert: false,
      beverage: true,
    },
    {
      id: 'dish-6',
      name: 'Chilled Mango Shake',
      restaurant: 'Jaipur Juice Co.',
      price: 110,
      time: '10 mins',
      rating: 4.8,
      calories: '240 kcal',
      protein: '5g',
      matchPercentage: 97,
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=600',
      badges: ['Healthy', 'Budget Friendly'],
      cuisine: 'Beverages',
      spicy: false,
      dessert: false,
      beverage: true,
    },
    {
      id: 'dish-7',
      name: 'Crisp Organic Fresh Salad',
      restaurant: 'The Green Bowl',
      price: 180,
      time: '15 mins',
      rating: 4.5,
      calories: '150 kcal',
      protein: '6g',
      matchPercentage: 94,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
      badges: ['Healthy', 'Budget Friendly'],
      cuisine: 'Healthy',
      spicy: false,
      dessert: false,
      beverage: false,
    },
    {
      id: 'dish-8',
      name: 'Artisanal Gulab Jamun (2 Pcs)',
      restaurant: 'Sweet Cravings',
      price: 80,
      time: '12 mins',
      rating: 4.9,
      calories: '320 kcal',
      protein: '3g',
      matchPercentage: 89,
      image: 'https://images.unsplash.com/photo-1589135304601-cd29e1b35529?auto=format&fit=crop&q=80&w=600',
      badges: ['Trending', 'Budget Friendly'],
      cuisine: 'Desserts',
      spicy: false,
      dessert: true,
      beverage: false,
    }
  ]);

  // Simulate AI Recalculation Loop on Refresh
  const handleRefreshRecommendations = () => {
    setIsRefreshing(true);
    setRefreshStep('Analyzing your current taste preferences...');
    
    setTimeout(() => {
      setRefreshStep('Reading Jaipur micro-climate telemetry...');
    }, 800);

    setTimeout(() => {
      setRefreshStep('Mapping healthy balance index against active budget...');
    }, 1600);

    setTimeout(() => {
      setRefreshStep('Polishing personalized bento matrix recommendations...');
    }, 2400);

    setTimeout(() => {
      // Slightly alter match percentages to feel alive!
      setDishes(prev => prev.map(d => ({
        ...d,
        matchPercentage: Math.min(100, Math.max(85, d.matchPercentage + Math.floor(Math.random() * 5) - 2))
      })));
      setIsRefreshing(false);
      triggerToast("Luna freshly calibrated your dynamic recommendations!");
    }, 3200);
  };

  const handleSavePreferences = () => {
    setMood(tempMood);
    setBudget(tempBudget);
    setCuisinePref(tempCuisine);
    setHealthGoal(tempHealthGoal);
    setIsCustomizing(false);
    triggerToast("Your personalized dining guidelines are updated!");
    handleRefreshRecommendations();
  };

  // Dynamic Suggestion based on State
  const getLunaSuggestion = () => {
    if (mood.includes('Lazy') || mood.includes('Tired')) {
      return `Feeling a bit low on energy? A hot plate of ${cuisinePref === 'North Indian' ? 'Paneer Butter Masala with buttery Garlic Naan' : 'comfort food'} from Taj Palace will restore your energy instantly.`;
    }
    if (healthGoal.includes('Weight') || healthGoal.includes('Fitness')) {
      return `To align with your ${healthGoal} goal, the Crisp Organic Fresh Salad (150 kcal) paired with a high-protein dish is highly recommended today.`;
    }
    if (budget < 150) {
      return `Perfect budget-friendly pick: Sweet Cravings' Gulab Jamun (₹80) or Jaipur Juice Co.'s Chilled Mango Shake (₹110) delivers maximum satisfaction under ₹150.`;
    }
    return `Based on today's weather in Jaipur and your preference for ${cuisinePref}, Paneer Butter Masala with Garlic Naan is the best choice to satisfy your cravings.`;
  };

  // Quick Filters configuration
  const filterChips = [
    { label: 'All', icon: '✨' },
    { label: 'Pizza', icon: '🍕' },
    { label: 'Indian', icon: '🍛' },
    { label: 'Healthy', icon: '🥗' },
    { label: 'Desserts', icon: '🍰' },
    { label: 'Coffee', icon: '☕' },
    { label: 'Spicy', icon: '🌶' },
    { label: 'Beverages', icon: '🥤' },
    { label: 'Premium', icon: '⭐' },
    { label: 'Trending', icon: '🔥' }
  ];

  // Helper to match custom filters
  const filteredDishes = dishes.filter(dish => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Pizza') return dish.cuisine === 'Pizza';
    if (activeFilter === 'Indian') return dish.cuisine === 'Indian';
    if (activeFilter === 'Healthy') return dish.badges.includes('Healthy') || dish.cuisine === 'Healthy';
    if (activeFilter === 'Desserts') return dish.dessert || dish.cuisine === 'Desserts';
    if (activeFilter === 'Coffee') return dish.cuisine === 'Coffee';
    if (activeFilter === 'Spicy') return dish.spicy;
    if (activeFilter === 'Beverages') return dish.beverage || dish.cuisine === 'Beverages';
    if (activeFilter === 'Premium') return dish.badges.includes('Premium') || dish.price >= 300;
    if (activeFilter === 'Trending') return dish.badges.includes('Trending');
    return true;
  });

  // Split items into categories for display sections
  // 1. Recommended for You (Matches highest AI Match)
  const recommendedForYou = [...filteredDishes].sort((a, b) => b.matchPercentage - a.matchPercentage);
  // 2. Trending Near You
  const trendingNearYou = filteredDishes.filter(d => d.badges.includes('Trending'));
  // 3. Perfect for Today's Weather
  const perfectForWeather = filteredDishes.filter(d => {
    if (weather.includes('Sunny') || weather.includes('Hot')) {
      return d.beverage || d.cuisine === 'Healthy' || d.name.includes('Cold') || d.name.includes('Shake');
    }
    return d.spicy || d.cuisine === 'Indian';
  });
  // 4. Based on Previous Orders (Simulated based on Favorites/History tags)
  const basedOnPrevious = filteredDishes.filter(d => d.rating >= 4.8);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Lucide.Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />);
      } else if (i === fullStars + 1 && halfStar) {
        stars.push(<Lucide.StarHalf key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />);
      } else {
        stars.push(<Lucide.Star key={i} className="w-3.5 h-3.5 text-gray-300" />);
      }
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 z-10 relative">
      
      {/* 1. Page Header */}
      <section className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D8F3DC] text-[#2D6A4F] text-[10px] font-extrabold rounded-full border border-[#B7E4C7]/40 select-none mb-3">
            <span>✨</span>
            <span>Personalized Daily Picks</span>
          </div>
          <h2 className="text-3xl font-black text-[#1c2e24] font-display flex items-center gap-2.5 tracking-tight">
            <span>🤖</span>
            <span>AI Recommendations</span>
          </h2>
          <p className="text-xs md:text-sm text-[#5e7166] mt-1 max-w-2xl leading-relaxed">
            Luna analyzes your preferences, mood, weather, budget, and dining history to recommend meals you'll love.
          </p>
        </div>
      </section>

      {/* 2. Top AI Summary Card */}
      <section className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-white/70 via-[#FFFDF8]/85 to-[#D8F3DC]/30 border border-white/60 shadow-premium p-8 text-left group">
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-[#52B788]/10 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-44 h-44 bg-gradient-to-tr from-amber-200/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row gap-8 justify-between relative z-10">
          {/* Greetings and Insights */}
          <div className="flex-1 space-y-5">
            <div>
              <h3 className="text-2xl font-black text-[#1c2e24] font-display flex items-center gap-1.5">
                <span>Good Evening, Khushi</span>
                <span className="animate-wiggle inline-block">👋</span>
              </h3>
              <p className="text-[11px] font-bold text-[#52B788] uppercase tracking-wider mt-0.5">Today's AI Insights</p>
            </div>

            {/* Micro details row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="bg-white/85 border border-[#B7E4C7]/20 p-3 rounded-2xl shadow-sm hover:border-[#52B788]/30 transition-colors">
                <div className="text-[9px] text-[#5e7166] font-bold uppercase tracking-wider">Mood</div>
                <div className="text-xs font-black text-[#1c2e24] mt-0.5 flex items-center gap-1">
                  <span>{mood}</span>
                </div>
              </div>
              
              <div className="bg-white/85 border border-[#B7E4C7]/20 p-3 rounded-2xl shadow-sm hover:border-[#52B788]/30 transition-colors">
                <div className="text-[9px] text-[#5e7166] font-bold uppercase tracking-wider">Weather</div>
                <div className="text-xs font-black text-[#1c2e24] mt-0.5 flex items-center gap-1">
                  <span>{weather}</span>
                </div>
              </div>

              <div className="bg-white/85 border border-[#B7E4C7]/20 p-3 rounded-2xl shadow-sm hover:border-[#52B788]/30 transition-colors">
                <div className="text-[9px] text-[#5e7166] font-bold uppercase tracking-wider">Budget</div>
                <div className="text-xs font-black text-[#2D6A4F] mt-0.5">
                  ₹{budget} max
                </div>
              </div>

              <div className="bg-white/85 border border-[#B7E4C7]/20 p-3 rounded-2xl shadow-sm hover:border-[#52B788]/30 transition-colors">
                <div className="text-[9px] text-[#5e7166] font-bold uppercase tracking-wider">Preferred</div>
                <div className="text-xs font-black text-[#1c2e24] mt-0.5 truncate">
                  {cuisinePref}
                </div>
              </div>

              <div className="bg-white/85 border border-[#B7E4C7]/20 p-3 rounded-2xl shadow-sm hover:border-[#52B788]/30 transition-colors col-span-2 sm:col-span-1">
                <div className="text-[9px] text-[#5e7166] font-bold uppercase tracking-wider">Health Goal</div>
                <div className="text-xs font-black text-[#1c2e24] mt-0.5 truncate">
                  {healthGoal}
                </div>
              </div>
            </div>

            {/* Luna's Suggestion */}
            <div className="bg-white/75 backdrop-blur-md border border-[#B7E4C7]/30 p-4.5 rounded-[24px] shadow-sm relative">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 bg-[#D8F3DC] rounded-xl flex items-center justify-center">
                  <Lucide.Sparkles className="w-3.5 h-3.5 text-[#52B788] animate-pulse" />
                </div>
                <span className="text-[10px] font-black text-[#2D6A4F] uppercase tracking-wider">Luna's Suggestion</span>
              </div>
              <p className="text-xs md:text-sm text-[#1c2e24] font-medium leading-relaxed italic">
                "{getLunaSuggestion()}"
              </p>
            </div>
          </div>

          {/* Action Cards / Trigger refresh or open preferences */}
          <div className="flex flex-col sm:flex-row lg:flex-col justify-center gap-3 shrink-0 lg:w-60">
            <button
              type="button"
              onClick={handleRefreshRecommendations}
              disabled={isRefreshing}
              className="px-5 py-4 bg-[#52B788] hover:bg-[#40916C] disabled:bg-gray-200 text-white font-bold text-xs rounded-2xl transition-all shadow-md shadow-[#52B788]/15 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer w-full"
            >
              <Lucide.RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Recalculating...' : 'Refresh Recommendations'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCustomizing(true)}
              className="px-5 py-4 bg-white hover:bg-[#D8F3DC] border border-[#B7E4C7]/40 text-[#1c2e24] font-bold text-xs rounded-2xl transition-all shadow-sm hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer w-full"
            >
              <Lucide.SlidersHorizontal className="w-4 h-4 text-[#52B788]" />
              <span>Customize Preferences</span>
            </button>
          </div>
        </div>

        {/* Refresh Telemetry Backdrop Loader */}
        <AnimatePresence>
          {isRefreshing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-14 h-14 bg-[#D8F3DC] rounded-[24px] flex items-center justify-center mb-4 relative">
                <Lucide.Loader className="w-7 h-7 text-[#52B788] animate-spin" />
                <div className="absolute -inset-1 border-2 border-dashed border-[#52B788]/40 rounded-[28px] animate-spin-slow" />
              </div>
              <h4 className="text-base font-black text-[#1c2e24] font-display">Recalculating Luna Curation</h4>
              <p className="text-xs text-[#5e7166] mt-1.5 animate-pulse max-w-sm">
                {refreshStep}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 3. Quick Filters */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#5e7166] uppercase tracking-wider flex items-center gap-1.5">
            <Lucide.Layers className="w-4 h-4 text-[#52B788]" />
            Quick Discovery Filters
          </span>
          <span className="text-[10px] text-[#52B788] font-bold">Showing {filteredDishes.length} matches</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none -mx-2 px-2 mask-image-right">
          {filterChips.map((chip) => {
            const isChipActive = activeFilter === chip.label;
            return (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  setActiveFilter(chip.label);
                  triggerToast(`Filtering by ${chip.label}...`);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 ${
                  isChipActive
                    ? 'bg-[#52B788] text-white border-[#52B788] shadow-md shadow-[#52B788]/10'
                    : 'bg-white hover:bg-[#D8F3DC]/40 text-[#1c2e24] border-[#B7E4C7]/20'
                }`}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Recommendations Sections */}
      <div className="space-y-12">
        {renderRecommendationSlider("🌟 Recommended for You", recommendedForYou)}
        {renderRecommendationSlider("🔥 Trending Near You", trendingNearYou)}
        {renderRecommendationSlider("🌤 Perfect for Today's Weather", perfectForWeather)}
        {renderRecommendationSlider("❤️ Based on Your Previous Orders", basedOnPrevious)}
      </div>

      {/* 5. Bottom Insight Panel */}
      <section className="p-8 rounded-[32px] border border-white/60 bg-gradient-to-br from-[#FFFDF8] via-white/50 to-[#D8F3DC]/20 shadow-premium relative overflow-hidden text-left">
        <div className="absolute right-0 bottom-0 w-52 h-52 bg-[#52B788]/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-[#D8F3DC] rounded-xl flex items-center justify-center text-[#52B788]">
            <Lucide.PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#1c2e24] font-display">Today's Food Insights</h3>
            <p className="text-[10px] text-[#5e7166]">Real-time bio-telemetry & culinary coordination</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/60 backdrop-blur-sm p-4.5 rounded-2xl border border-white/60 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#5e7166] uppercase tracking-wider">Cuisine Stats</span>
              <span className="text-[9px] font-extrabold text-[#52B788] bg-[#D8F3DC] px-2 py-0.5 rounded-full">Primary</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#1c2e24]">Most Popular Cuisine:</span>
                <span className="font-bold text-[#1b4332]">North Indian</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#1c2e24]">Highest Rated Diner:</span>
                <span className="font-bold text-[#1b4332]">Taj Palace (★4.9)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#1c2e24]">Trending Dessert:</span>
                <span className="font-bold text-amber-700">Saffron Pistachio Kulfi</span>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm p-4.5 rounded-2xl border border-white/60 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#5e7166] uppercase tracking-wider">Nutritional Matrix</span>
              <span className="text-[9px] font-extrabold text-[#52B788] bg-[#D8F3DC] px-2 py-0.5 rounded-full">Dynamic</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#1c2e24]">Est. Calories Today:</span>
                <span className="font-bold text-[#1b4332]">1,450 kcal</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#1c2e24]">Overall Health Score:</span>
                <span className="font-bold text-[#52B788]">92 / 100</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#1c2e24]">Hydration Status:</span>
                <span className="font-bold text-blue-600">2.2L / 3.0L Target</span>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm p-4.5 rounded-2xl border border-white/60 shadow-sm flex flex-col justify-between">
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                <Lucide.Droplet className="w-3.5 h-3.5 fill-blue-500 animate-bounce" />
                <span>Water Reminder</span>
              </div>
              <p className="text-[11px] text-[#5e7166] leading-relaxed font-medium">
                Beat the afternoon sun! Hydration accelerates metabolism. Grab a Chilled Mango Shake or cold water now.
              </p>
            </div>
            <button
              type="button"
              onClick={() => triggerToast("Logged 250ml water into tracker!")}
              className="mt-3 w-full py-2 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-blue-700 text-[10px] font-bold rounded-xl transition-all cursor-pointer text-center"
            >
              + Log 250ml Water
            </button>
          </div>
        </div>

        {/* Closing Warm Message */}
        <div className="mt-8 pt-6 border-t border-[#B7E4C7]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D8F3DC] rounded-full flex items-center justify-center text-2xl border border-white shadow-sm shrink-0">
              🔮
            </div>
            <p className="text-xs font-semibold text-[#2D6A4F] italic">
              "Enjoy your meal! I'll keep learning your taste to make even better recommendations."
            </p>
          </div>
          <span className="text-[10px] text-[#5e7166] font-extrabold tracking-widest uppercase bg-[#FFFDF8] border border-[#B7E4C7]/30 px-3 py-1 rounded-full">
            Luna Intelligence Core
          </span>
        </div>
      </section>

      {/* Preference Customization Popup Modal */}
      <AnimatePresence>
        {isCustomizing && (
          <div className="fixed inset-0 bg-black/35 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FFFDF8] border border-[#B7E4C7]/40 rounded-[32px] p-6 md:p-8 max-w-lg w-full shadow-premium-lg text-left relative overflow-hidden space-y-6"
            >
              <button
                onClick={() => setIsCustomizing(false)}
                className="absolute top-6 right-6 p-2 hover:bg-[#F8F5F2] rounded-full transition-colors cursor-pointer text-[#5e7166] hover:text-[#1c2e24]"
              >
                <Lucide.X className="w-5 h-5" />
              </button>

              <div className="space-y-1.5 pr-8">
                <span className="text-[10px] font-extrabold text-[#52B788] uppercase tracking-wider bg-[#D8F3DC] px-2.5 py-1 rounded-full border border-[#B7E4C7]/20">
                  🧬 Personalization Model
                </span>
                <h3 className="text-xl font-black text-[#1c2e24] font-display">Customize Your Dining Engine</h3>
                <p className="text-xs text-[#5e7166]">Fine-tune the weights used by Luna to align today's meal recommendations.</p>
              </div>

              <div className="space-y-4">
                {/* Mood Select */}
                <div>
                  <label className="text-[10px] font-bold text-[#5e7166] uppercase tracking-wider block mb-1.5">Appetite Mood</label>
                  <select
                    value={tempMood}
                    onChange={(e) => setTempMood(e.target.value)}
                    className="w-full bg-white border border-[#B7E4C7]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#1c2e24] focus:outline-none focus:border-[#52B788] font-semibold appearance-none cursor-pointer"
                  >
                    <option value="Happy 😊">Happy 😊</option>
                    <option value="Lazy 🥱">Lazy 🥱</option>
                    <option value="Healthy 🌱">Healthy 🌱</option>
                    <option value="Adventurous 🧭">Adventurous 🧭</option>
                    <option value="Cozy ☕">Cozy ☕</option>
                    <option value="Focused 🎯">Focused 🎯</option>
                  </select>
                </div>

                {/* Cuisine Preference */}
                <div>
                  <label className="text-[10px] font-bold text-[#5e7166] uppercase tracking-wider block mb-1.5">Primary Cuisine Preference</label>
                  <select
                    value={tempCuisine}
                    onChange={(e) => setTempCuisine(e.target.value)}
                    className="w-full bg-white border border-[#B7E4C7]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#1c2e24] focus:outline-none focus:border-[#52B788] font-semibold appearance-none cursor-pointer"
                  >
                    <option value="North Indian">North Indian</option>
                    <option value="South Indian">South Indian</option>
                    <option value="Italian">Italian (Pizza & Risotto)</option>
                    <option value="Organic Salads">Organic Salads & Bowls</option>
                    <option value="Desserts">Sweet Indulgence (Desserts)</option>
                  </select>
                </div>

                {/* Health Goals */}
                <div>
                  <label className="text-[10px] font-bold text-[#5e7166] uppercase tracking-wider block mb-1.5">Wellness Health Goal</label>
                  <select
                    value={tempHealthGoal}
                    onChange={(e) => setTempHealthGoal(e.target.value)}
                    className="w-full bg-white border border-[#B7E4C7]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#1c2e24] focus:outline-none focus:border-[#52B788] font-semibold appearance-none cursor-pointer"
                  >
                    <option value="Balanced Diet">Balanced Diet (Standard)</option>
                    <option value="High Protein">High Protein Build</option>
                    <option value="Calorie Deficit">Calorie Deficit (Weight Loss)</option>
                    <option value="Keto Friendly">Keto / Low-Carb</option>
                  </select>
                </div>

                {/* Budget Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-bold text-[#5e7166] uppercase tracking-wider">Maximum Budget</label>
                    <span className="text-xs font-black text-[#2D6A4F]">₹{tempBudget}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={tempBudget}
                    onChange={(e) => setTempBudget(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#D8F3DC] rounded-lg appearance-none cursor-pointer accent-[#52B788]"
                  />
                  <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                    <span>₹100 (Saver)</span>
                    <span>₹1000 (Gourmet Luxe)</span>
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCustomizing(false)}
                  className="flex-1 py-3 border border-[#B7E4C7]/40 text-[#1c2e24] text-xs font-bold rounded-xl hover:bg-[#F8F5F2] transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="flex-1 py-3 bg-[#52B788] hover:bg-[#40916C] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#52B788]/10 text-center cursor-pointer"
                >
                  Save & Apply Curation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  // Reusable Horizontal slider component
  function renderRecommendationSlider(title: string, list: Dish[]) {
    if (list.length === 0) return null;

    return (
      <div className="space-y-4.5 text-left">
        <h3 className="text-xl font-black text-[#1c2e24] font-display flex items-center gap-2">
          <span className="w-1.5 h-6 bg-[#52B788] rounded-full inline-block" />
          <span>{title}</span>
        </h3>

        <div className="flex items-stretch gap-6 overflow-x-auto pb-6 scrollbar-thin -mx-2 px-2 mask-image-right">
          {list.map((dish) => {
            const isExpanded = expandedCardId === dish.id;
            return (
              <div
                key={dish.id}
                className="w-72 bg-white rounded-[28px] border border-[#B7E4C7]/20 shadow-sm hover:shadow-premium transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between shrink-0 relative group"
              >
                {/* Upper Image container */}
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Glass Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[80%]">
                    {dish.badges.map((badge, idx) => (
                      <span
                        key={idx}
                        className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full border shadow-sm select-none ${
                          badge === 'Healthy'
                            ? 'bg-emerald-50/90 text-emerald-800 border-emerald-200'
                            : badge === 'Trending'
                            ? 'bg-orange-50/90 text-orange-800 border-orange-200'
                            : 'bg-sky-50/90 text-sky-800 border-sky-200'
                        }`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* AI Match percentage Badge */}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-[#1b4332] to-[#2D6A4F] text-white rounded-2xl px-2.5 py-1 shadow-md border border-white/20 select-none">
                    <div className="text-[9px] font-black tracking-tight">{dish.matchPercentage}% Match</div>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md rounded-xl px-2 py-0.5 border border-[#B7E4C7]/20 flex items-center gap-1 select-none">
                    <span className="text-amber-500 font-bold text-[10px]">★</span>
                    <span className="text-[10px] font-extrabold text-[#1c2e24]">{dish.rating}</span>
                  </div>

                  {/* Time Badge */}
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md rounded-xl px-2.5 py-1 border border-[#B7E4C7]/20 flex items-center gap-1.5 select-none">
                    <Lucide.Clock className="w-3 h-3 text-[#52B788]" />
                    <span className="text-[9px] font-extrabold text-[#1c2e24]">{dish.time}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1 text-left">
                    <div className="text-[10px] text-[#5e7166] font-extrabold uppercase tracking-wide">
                      {dish.restaurant}
                    </div>
                    <h4 className="font-extrabold text-sm text-[#1c2e24] line-clamp-2 leading-tight font-display">
                      {dish.name}
                    </h4>
                    
                    {/* Nutritional macros */}
                    <div className="flex items-center gap-2 pt-1 text-[10px] text-[#5e7166] font-semibold">
                      <span className="bg-[#F8F5F2] px-2 py-0.5 rounded-md">{dish.calories}</span>
                      <span className="bg-[#F8F5F2] px-2 py-0.5 rounded-md">💪 {dish.protein} Protein</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#B7E4C7]/15 flex items-center justify-between gap-2">
                    <span className="text-base font-black text-[#1b4332]">₹{dish.price}</span>
                    
                    <button
                      type="button"
                      onClick={() => setExpandedCardId(isExpanded ? null : dish.id)}
                      className="px-2.5 py-1.5 bg-gradient-to-r from-[#FFFDF8] to-[#D8F3DC]/40 hover:from-[#D8F3DC]/60 hover:to-[#FFFDF8] border border-[#B7E4C7]/30 text-[#2D6A4F] text-[10px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-0.5 active:scale-95 shrink-0"
                    >
                      <span>Why Luna Picked This</span>
                      {isExpanded ? <Lucide.ChevronUp className="w-3 h-3" /> : <Lucide.ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Expanded "Why Luna Picked This" details drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-[#D8F3DC]/30 border-t border-[#B7E4C7]/20 px-5 py-3.5 text-left space-y-2 text-[11px] font-semibold text-[#2D6A4F] overflow-hidden"
                    >
                      <div className="text-[9px] font-extrabold uppercase tracking-wider text-[#1b4332] mb-1">Curation Logic Matrix:</div>
                      <div className="flex items-center gap-1.5">
                        <Lucide.Check className="w-3.5 h-3.5 text-[#52B788] shrink-0" />
                        <span>Matches your {mood.toLowerCase()} mood</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Lucide.Check className="w-3.5 h-3.5 text-[#52B788] shrink-0" />
                        <span>Within your ₹{budget} budget limit</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Lucide.Check className="w-3.5 h-3.5 text-[#52B788] shrink-0" />
                        <span>Perfect for today's {weather.toLowerCase()} weather</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Lucide.Check className="w-3.5 h-3.5 text-[#52B788] shrink-0" />
                        <span>Popular local item in Jaipur, Rajasthan</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Lucide.Check className="w-3.5 h-3.5 text-[#52B788] shrink-0" />
                        <span>Similar to your previous orders & preferences</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onOpenLunaWithPrompt(`Please write a luxury food review and order checklist for "${dish.name}" from "${dish.restaurant}". Specify why it fits my current mood, weather, and budget!`);
                          triggerToast("Sending dish info to Luna chat...");
                        }}
                        className="mt-3 w-full py-2 bg-[#52B788] hover:bg-[#40916C] text-white text-[10px] font-bold rounded-xl transition-all text-center cursor-pointer shadow-sm active:scale-95"
                      >
                        Order with Luna 🚀
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
