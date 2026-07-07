/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIMealPlannerProps {
  onOpenLunaWithPrompt: (prompt: string) => void;
  triggerToast: (message: string) => void;
}

interface Goal {
  id: string;
  emoji: string;
  title: string;
  description: string;
  color: string;
}

interface MealItem {
  id: string;
  mealType: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner' | 'Late Night';
  name: string;
  restaurant: string;
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  fiber: number; // in grams
  price: number;
  image: string;
  description: string;
}

export default function AIMealPlanner({ onOpenLunaWithPrompt, triggerToast }: AIMealPlannerProps) {
  // Step 1: Health Goals
  const goals: Goal[] = [
    { id: 'muscle', emoji: '🏋', title: 'Muscle Gain', description: 'Surplus calories with optimal proteins to rebuild muscle.', color: 'border-emerald-200 bg-emerald-50/40 text-emerald-800' },
    { id: 'loss', emoji: '⚖', title: 'Weight Loss', description: 'Calorie deficit plans featuring high fiber and metabolism boosters.', color: 'border-blue-200 bg-blue-50/40 text-blue-800' },
    { id: 'balanced', emoji: '🥗', title: 'Balanced Diet', description: 'Equally distributed macronutrients for daily sustained energy.', color: 'border-teal-200 bg-teal-50/40 text-teal-800' },
    { id: 'heart', emoji: '❤️', title: 'Heart Healthy', description: 'Low sodium, rich in omega-3, healthy fats and leafy greens.', color: 'border-rose-200 bg-rose-50/40 text-rose-800' },
    { id: 'focus', emoji: '🧠', title: 'Student Focus', description: 'Antioxidants and brain-fueling complex carbs to prevent fatigue.', color: 'border-indigo-200 bg-indigo-50/40 text-indigo-800' },
    { id: 'protein', emoji: '💪', title: 'High Protein', description: 'Heavy focus on tandoori grills, paneer, and lean meat cuts.', color: 'border-amber-200 bg-amber-50/40 text-amber-800' },
    { id: 'veg', emoji: '🌱', title: 'Vegetarian', description: '100% plant-derived dairy-inclusive classic Rajasthani fare.', color: 'border-green-200 bg-green-50/40 text-green-800' },
    { id: 'vegan', emoji: '🌾', title: 'Vegan', description: 'Cruelty-free botanical delights without dairy, honey, or butter.', color: 'border-lime-200 bg-lime-50/40 text-lime-800' },
  ];

  // User Interactive Selections
  const [selectedGoal, setSelectedGoal] = useState<string>('balanced');
  const [budget, setBudget] = useState<number>(1000); // Slider values: 200, 500, 1000, 2000+
  const [selectedMealPeriods, setSelectedMealPeriods] = useState<string[]>(['Breakfast', 'Lunch', 'Snacks', 'Dinner']);
  
  // Generation & Results States
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [showPlan, setShowPlan] = useState<boolean>(false);
  const [mealTimeline, setMealTimeline] = useState<MealItem[]>([]);
  const [healthScore, setHealthScore] = useState<number>(88);

  // Pool of realistic food items from Jaipur's premium dining options
  const mealPool: MealItem[] = [
    // Breakfast
    {
      id: 'm-1',
      mealType: 'Breakfast',
      name: 'Kesar Chai & Gourmet Bun Maska',
      restaurant: 'Tapri Central',
      calories: 400,
      protein: 10,
      carbs: 52,
      fat: 18,
      fiber: 3,
      price: 200,
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600',
      description: 'Slow-brewed royal saffron tea paired with toasted soft brioche slathered in white butter.'
    },
    {
      id: 'm-2',
      mealType: 'Breakfast',
      name: 'Smashed Avocado Toast with Microgreens',
      restaurant: 'Town Coffee',
      calories: 310,
      protein: 8,
      carbs: 28,
      fat: 16,
      fiber: 9,
      price: 280,
      image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=600',
      description: 'Fresh Haas avocado with cherry tomatoes, toasted pumpkin seeds, and organic sourdough.'
    },
    {
      id: 'm-3',
      mealType: 'Breakfast',
      name: 'Artisanal Almond Croissant & Espresso',
      restaurant: 'Zolocrust',
      calories: 420,
      protein: 9,
      carbs: 45,
      fat: 22,
      fiber: 4,
      price: 320,
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600',
      description: 'Flaky baked pastry filled with royal sweet almond cream and powdered organic sugar.'
    },
    {
      id: 'm-4',
      mealType: 'Breakfast',
      name: 'Oats Chia Berry Parfait',
      restaurant: 'Town Coffee',
      calories: 250,
      protein: 12,
      carbs: 38,
      fat: 6,
      fiber: 8,
      price: 220,
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600',
      description: 'Overnight rolled oats layered with Greek yogurt, organic chia seeds, and fresh strawberries.'
    },

    // Lunch
    {
      id: 'm-5',
      mealType: 'Lunch',
      name: 'Gnocchi Cacio e Pepe',
      restaurant: 'Bar Palladio',
      calories: 480,
      protein: 15,
      carbs: 68,
      fat: 14,
      fiber: 5,
      price: 420,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
      description: 'Handcrafted potato dumplings coated with freshly cracked black pepper and aged Pecorino.'
    },
    {
      id: 'm-6',
      mealType: 'Lunch',
      name: 'Executive Rajasthani Thali',
      restaurant: 'Thali & More',
      calories: 790,
      protein: 26,
      carbs: 98,
      fat: 28,
      fiber: 12,
      price: 310,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600',
      description: 'Luxurious platter with Gatte ki sabji, Dal Tadka, Jeera Rice, butter rotis, and Rasgulla.'
    },
    {
      id: 'm-7',
      mealType: 'Lunch',
      name: 'Quinoa Beetroot Super Salad',
      restaurant: 'Town Coffee',
      calories: 280,
      protein: 11,
      carbs: 42,
      fat: 7,
      fiber: 10,
      price: 240,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
      description: 'High-protein grain salad tossed in low-fat Greek yogurt, toasted walnuts, and citrus juice.'
    },
    {
      id: 'm-8',
      mealType: 'Lunch',
      name: 'Woodfired Margherita Classica Pizza',
      restaurant: 'Bar Palladio',
      calories: 650,
      protein: 24,
      carbs: 82,
      fat: 22,
      fiber: 6,
      price: 480,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
      description: 'Charred, high-hydration neapolitan crust layered with sweet San Marzano tomatoes & fresh buffalo mozzarella.'
    },

    // Snacks
    {
      id: 'm-9',
      mealType: 'Snacks',
      name: 'Waffle with Chocolate Injection',
      restaurant: 'Nibs Café',
      calories: 410,
      protein: 7,
      carbs: 58,
      fat: 16,
      fiber: 2,
      price: 190,
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600',
      description: 'Golden Belgian waffle served with a fun syringe filled with hot melted chocolate ganache.'
    },
    {
      id: 'm-10',
      mealType: 'Snacks',
      name: 'Cheesy Garlic Khakhra',
      restaurant: 'Tapri Central',
      calories: 210,
      protein: 8,
      carbs: 24,
      fat: 9,
      fiber: 4,
      price: 150,
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600',
      description: 'Crunchy flatbread baked with spicy red garlic, ghee, and loaded with Amul cheese.'
    },
    {
      id: 'm-11',
      mealType: 'Snacks',
      name: 'Steamed Crystal Dumplings (6 Pcs)',
      restaurant: 'The Forresta',
      calories: 140,
      protein: 6,
      carbs: 25,
      fat: 1,
      fiber: 3,
      price: 220,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
      description: 'Translucent steamed purses stuffed with shredded water chestnut, bamboo shoots, and green onion.'
    },
    {
      id: 'm-12',
      mealType: 'Snacks',
      name: 'High Protein Peanut Butter Shake',
      restaurant: 'Town Coffee',
      calories: 340,
      protein: 22,
      carbs: 32,
      fat: 12,
      fiber: 5,
      price: 220,
      image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600',
      description: 'Creamy high protein blended smoothie featuring raw unsweetened peanut butter and clean whey.'
    },

    // Dinner
    {
      id: 'm-13',
      mealType: 'Dinner',
      name: 'Rajasthani Lal Maas with Rumali Roti',
      restaurant: 'Spice Court',
      calories: 680,
      protein: 42,
      carbs: 45,
      fat: 31,
      fiber: 4,
      price: 490,
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=600',
      description: 'Jaipur heritage mutton stew cooked slowly with hand-pounded Mathania chilies and yogurt.'
    },
    {
      id: 'm-14',
      mealType: 'Dinner',
      name: 'Chili Garlic Handpulled Noodles',
      restaurant: 'The Forresta',
      calories: 410,
      protein: 11,
      carbs: 65,
      fat: 12,
      fiber: 4,
      price: 260,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
      description: 'Spicy wok-fired wheat noodles infused with home-brewed Szechuan chili oil and crisp scallions.'
    },
    {
      id: 'm-15',
      mealType: 'Dinner',
      name: 'Aromatic Veg Handi Biryani',
      restaurant: 'Handi Restaurant',
      calories: 480,
      protein: 13,
      carbs: 72,
      fat: 14,
      fiber: 7,
      price: 290,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600',
      description: 'Basmati rice steam-cooked with authentic mint, cardamom, and fresh winter garden vegetables.'
    },
    {
      id: 'm-16',
      mealType: 'Dinner',
      name: 'Unlimited Barbeque Grill Feast',
      restaurant: 'Barbeque Nation',
      calories: 1100,
      protein: 55,
      carbs: 95,
      fat: 45,
      fiber: 9,
      price: 799,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600',
      description: 'Massive luxury table-grill experience filled with infinite hot paneer tikka, cajun potatoes, and desserts.'
    },

    // Late Night
    {
      id: 'm-17',
      mealType: 'Late Night',
      name: 'Mini Multigrain Sliders Trio',
      restaurant: 'Jaipur Adda',
      calories: 290,
      protein: 11,
      carbs: 34,
      fat: 10,
      fiber: 6,
      price: 210,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
      description: 'Compact late-night healthy mini burgers filled with spiced potato and shredded cabbage salad.'
    },
    {
      id: 'm-18',
      mealType: 'Late Night',
      name: 'Warm Apple Cinnamon Tart',
      restaurant: 'Zolocrust',
      calories: 310,
      protein: 4,
      carbs: 48,
      fat: 11,
      fiber: 5,
      price: 210,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
      description: 'Crispy shortcrust tart loaded with baked spiced apples and drizzled with organic honey syrup.'
    },
    {
      id: 'm-19',
      mealType: 'Late Night',
      name: 'Jaipuri Pudina Mint Cooler & Crackers',
      restaurant: 'Jaipur Adda',
      calories: 120,
      protein: 3,
      carbs: 22,
      fat: 1,
      fiber: 2,
      price: 150,
      image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600',
      description: 'Refreshing carbonated mint cooler served with spiced baked wheat mathris.'
    }
  ];

  // Meal Preference Toggle handler
  const toggleMealPeriod = (period: string) => {
    setSelectedMealPeriods(prev => {
      if (prev.includes(period)) {
        if (prev.length === 1) {
          triggerToast("You must select at least one meal period for your AI plan.");
          return prev;
        }
        return prev.filter(p => p !== period);
      } else {
        return [...prev, period];
      }
    });
  };

  // Generate Personalized Plan Engine
  const handleGeneratePlan = () => {
    if (selectedMealPeriods.length === 0) {
      triggerToast("Please check at least one meal preference period first.");
      return;
    }

    setIsGenerating(true);
    setShowPlan(false);
    
    // Smooth step-by-step processing animations simulating actual AI computing
    const steps = [
      "Connecting to DineGenie AI engines...",
      `Analyzing health constraints for "${goals.find(g => g.id === selectedGoal)?.title}" goal...`,
      `Configuring premium Jaipur menus for budget threshold of ₹${budget}...`,
      "Calculating target macro distributions & fiber counts...",
      "Polishing meal pairing sequences and calorie timelines..."
    ];

    let currentStepIdx = 0;
    setGenerationStep(steps[currentStepIdx]);

    const interval = setInterval(() => {
      currentStepIdx++;
      if (currentStepIdx < steps.length) {
        setGenerationStep(steps[currentStepIdx]);
      } else {
        clearInterval(interval);
        
        // Pick the best meals from pool based on active configuration
        const filteredPlan: MealItem[] = [];
        let priceAcc = 0;

        selectedMealPeriods.forEach((period) => {
          const matchingPool = mealPool.filter(item => item.mealType === period);
          if (matchingPool.length > 0) {
            // Apply simple heuristic sorting matching selected goal
            const sorted = [...matchingPool].sort((a, b) => {
              if (selectedGoal === 'muscle' || selectedGoal === 'protein') {
                return b.protein - a.protein; // High protein first
              }
              if (selectedGoal === 'loss') {
                return a.calories - b.calories; // Low calories first
              }
              if (selectedGoal === 'veg' || selectedGoal === 'vegan') {
                const vegA = !a.name.toLowerCase().includes('maas') && !a.name.toLowerCase().includes('chicken');
                const vegB = !b.name.toLowerCase().includes('maas') && !b.name.toLowerCase().includes('chicken');
                return (vegB ? 1 : 0) - (vegA ? 1 : 0);
              }
              return 0; // balanced default
            });

            // Make sure we select an item that fits budget if possible, else pick first
            const matchedItem = sorted.find(item => priceAcc + item.price <= budget) || sorted[0];
            filteredPlan.push(matchedItem);
            priceAcc += matchedItem.price;
          }
        });

        // Compute custom health score based on goal match
        let score = 88;
        if (selectedGoal === 'muscle') score = 94;
        if (selectedGoal === 'loss') score = 91;
        if (selectedGoal === 'heart') score = 97;
        if (selectedGoal === 'balanced') score = 95;
        if (selectedGoal === 'focus') score = 92;

        setMealTimeline(filteredPlan);
        setHealthScore(score);
        setIsGenerating(false);
        setShowPlan(true);
        triggerToast("Custom AI Meal Plan Generated Successfully!");
      }
    }, 900);
  };

  // Calculate Totals for active plan
  const totalCalories = mealTimeline.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = mealTimeline.reduce((acc, curr) => acc + curr.protein, 0);
  const totalCarbs = mealTimeline.reduce((acc, curr) => acc + curr.carbs, 0);
  const totalFat = mealTimeline.reduce((acc, curr) => acc + curr.fat, 0);
  const totalFiber = mealTimeline.reduce((acc, curr) => acc + curr.fiber, 0);
  const totalPlanPrice = mealTimeline.reduce((acc, curr) => acc + curr.price, 0);

  // Suggested Actions Tips
  const aiTips = [
    { title: '💧 Hydration Check', text: 'Drink at least 2.5L of mineral water today to maintain skin and digestive elasticity.' },
    { title: '⏱ Meal Timing Window', text: 'Eat your Breakfast within 60 mins of waking. Rest your gut for 12 hours overnight.' },
    { title: '📉 Glycemic Guidance', text: 'Avoid adding raw sugar to your tea. Rely on fresh fruits or organic stevia.' },
    { title: '💤 Active Recovery Sleep', text: 'Sleep by 10:30 PM to optimize muscle recovery and hormone balance.' }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500 text-left">
      
      {/* HEADER */}
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D8F3DC] text-[#2D6A4F] text-[10px] font-extrabold rounded-full border border-[#B7E4C7]/40 select-none mb-3">
            <span>✨ AI Coached</span>
            <span>Premium Precision</span>
          </div>
          <h2 className="text-3xl font-black text-[#1c2e24] font-display flex items-center gap-2.5 tracking-tight">
            <span>🍽</span>
            <span>AI Meal Planner</span>
          </h2>
          <p className="text-xs md:text-sm text-[#5e7166] mt-1 max-w-2xl leading-relaxed">
            Let Luna generate a complete personalized meal plan based on your lifestyle, health goals, mood, budget, and schedule.
          </p>
        </div>

        {/* Luna Coach Status Badge */}
        <div className="flex items-center gap-3 bg-white/85 backdrop-blur-md border border-[#B7E4C7]/30 px-4 py-2.5 rounded-2xl shadow-sm">
          <div className="relative shrink-0">
            <div className="w-8 h-8 bg-gradient-to-tr from-[#52B788] to-[#B7E4C7] rounded-full flex items-center justify-center shadow-inner">
              <span className="text-sm">👩‍⚕️</span>
            </div>
            <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
          </div>
          <div className="text-left">
            <span className="text-[9px] text-[#5e7166] font-bold uppercase tracking-wider block leading-none">Luna Nutrition Coach</span>
            <span className="text-xs font-black text-[#1c2e24] mt-0.5 block">Active Consultation</span>
          </div>
        </div>
      </section>

      {/* STEP CONFIGURE GRIDS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Interactive Configuration Block (Cols 5) */}
        <div className="lg:col-span-5 space-y-8 bg-white/70 backdrop-blur-md border border-[#B7E4C7]/20 rounded-[32px] p-6 md:p-8 shadow-sm">
          
          {/* STEP 1: Choose Your Goal */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-[#D8F3DC] text-[#2D6A4F] rounded-full flex items-center justify-center text-[11px] font-black">1</span>
              <h3 className="text-sm font-black text-[#1c2e24] uppercase tracking-wider">Choose Your Nutrition Goal</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3.5">
              {goals.map((g) => {
                const isActive = selectedGoal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      setSelectedGoal(g.id);
                      triggerToast(`Selected nutrition goal: ${g.title}`);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-300 relative group cursor-pointer active:scale-95 ${
                      isActive
                        ? 'border-[#52B788] bg-[#D8F3DC]/40 shadow-sm'
                        : 'border-gray-100 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-lg">{g.emoji}</span>
                      <span className={`text-xs font-black truncate ${isActive ? 'text-[#1b4332]' : 'text-gray-700'}`}>
                        {g.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-semibold leading-relaxed line-clamp-2">
                      {g.description}
                    </p>
                    {isActive && (
                      <span className="absolute top-2 right-2 text-[#52B788] text-xs">
                        ●
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Choose Budget */}
          <div className="space-y-4 pt-4 border-t border-[#B7E4C7]/15">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-[#D8F3DC] text-[#2D6A4F] rounded-full flex items-center justify-center text-[11px] font-black">2</span>
                <h3 className="text-sm font-black text-[#1c2e24] uppercase tracking-wider">Set Daily Budget Cap</h3>
              </div>
              <span className="text-xs font-black text-[#1b4332] bg-[#D8F3DC] px-2.5 py-1 rounded-full border border-[#B7E4C7]/30">
                ₹{budget}{budget >= 2000 ? '+' : ''}
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Slider Input */}
              <input
                type="range"
                min="200"
                max="2500"
                step="50"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-[#52B788] h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
              />
              {/* Labels */}
              <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider px-1">
                <span>₹200 (Eco)</span>
                <span>₹1,000 (Premium)</span>
                <span>₹2,500+ (Elite)</span>
              </div>
            </div>
          </div>

          {/* STEP 3: Meal Preferences Checklist */}
          <div className="space-y-4 pt-4 border-t border-[#B7E4C7]/15">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-[#D8F3DC] text-[#2D6A4F] rounded-full flex items-center justify-center text-[11px] font-black">3</span>
              <h3 className="text-sm font-black text-[#1c2e24] uppercase tracking-wider">Meal Preferences</h3>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {['Breakfast', 'Lunch', 'Snacks', 'Dinner', 'Late Night'].map((period) => {
                const isChecked = selectedMealPeriods.includes(period);
                return (
                  <button
                    key={period}
                    type="button"
                    onClick={() => toggleMealPeriod(period)}
                    className={`px-4 py-2.5 rounded-full border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${
                      isChecked
                        ? 'bg-[#52B788] text-white border-[#52B788] font-extrabold shadow-sm'
                        : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <span>{period === 'Breakfast' ? '🌞' : period === 'Lunch' ? '🌤' : period === 'Snacks' ? '🌇' : period === 'Dinner' ? '🌙' : '🌌'}</span>
                    <span>{period}</span>
                    <span className="text-[9px] opacity-75">{isChecked ? '✓' : '+'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 4: Generate AI Plan Button */}
          <div className="pt-6 border-t border-[#B7E4C7]/15">
            <button
              type="button"
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="w-full py-4.5 bg-gradient-to-r from-[#1b4332] to-[#2D6A4F] hover:from-[#2D6A4F] hover:to-[#1b4332] disabled:opacity-50 text-white font-extrabold rounded-2xl shadow-lg shadow-[#1b4332]/20 transition-all text-center flex items-center justify-center gap-3.5 relative overflow-hidden group cursor-pointer active:scale-98"
            >
              {isGenerating ? (
                <>
                  <Lucide.Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm uppercase tracking-wider">Compiling Plan...</span>
                </>
              ) : (
                <>
                  <Lucide.Sparkles className="w-5 h-5 text-[#B7E4C7] animate-pulse" />
                  <span className="text-sm uppercase tracking-wider font-black">Generate My Meal Plan</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Output Generation Screens (Cols 7) */}
        <div className="lg:col-span-7 min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* Display loader when compiling AI plan */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white/80 border border-[#B7E4C7]/20 rounded-[32px] p-12 text-center h-full flex flex-col items-center justify-center space-y-6"
              >
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-inner relative">
                  <span className="text-4xl animate-bounce">👩‍⚕️</span>
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                </div>

                <div className="space-y-2 max-w-sm">
                  <h4 className="text-lg font-black text-[#1c2e24]">Luna is composing your plan</h4>
                  <p className="text-xs text-[#5e7166] min-h-[36px] font-medium leading-relaxed italic">
                    "{generationStep}"
                  </p>
                </div>

                <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 animate-[pulse_1.5s_infinite] w-3/4 rounded-full" />
                </div>
              </motion.div>
            )}

            {/* Default State: Before first generation */}
            {!isGenerating && !showPlan && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#FFFDF8] border border-[#B7E4C7]/30 border-dashed rounded-[32px] p-12 text-center h-full flex flex-col items-center justify-center space-y-6"
              >
                <div className="w-16 h-16 bg-[#D8F3DC] text-[#2D6A4F] rounded-full flex items-center justify-center text-3xl">
                  🥣
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h4 className="text-lg font-black text-[#1c2e24]">Plan Pending Curation</h4>
                  <p className="text-xs text-[#5e7166] leading-relaxed">
                    Set your targets, preferences, and daily budget on the left to activate Luna's professional nutrition evaluation module.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGeneratePlan}
                  className="px-6 py-3 bg-[#D8F3DC] hover:bg-[#B7E4C7] text-[#1b4332] text-xs font-black rounded-xl border border-[#B7E4C7]/40 transition-all flex items-center gap-1.5"
                >
                  <Lucide.Sparkles className="w-4 h-4" />
                  <span>Generate Quick Default Plan</span>
                </button>
              </motion.div>
            )}

            {/* Generated Plan Output Content */}
            {!isGenerating && showPlan && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                
                {/* 1. Nutrition Summary Banner with Ring Charts */}
                <div className="bg-white/90 border border-[#B7E4C7]/25 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
                  
                  {/* Summary Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Macronutrient Summary</h4>
                      <div className="text-2xl font-black text-[#1b4332] font-display flex items-baseline gap-1.5">
                        <span>{totalCalories}</span>
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total kcal</span>
                      </div>
                    </div>

                    {/* Circular Health Score Chart */}
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="28" cy="28" r="24" stroke="#F3F4F6" strokeWidth="4.5" fill="transparent" />
                          <circle cx="28" cy="28" r="24" stroke="#52B788" strokeWidth="4.5" fill="transparent"
                                  strokeDasharray={150} strokeDashoffset={150 - (150 * healthScore) / 100} />
                        </svg>
                        <span className="absolute text-xs font-black text-[#1b4332]">{healthScore}%</span>
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Luna Score</span>
                        <span className="text-xs font-extrabold text-[#2D6A4F]">Perfect Balance</span>
                      </div>
                    </div>
                  </div>

                  {/* Macros Ring Charts Equivalents */}
                  <div className="grid grid-cols-4 gap-3 bg-gray-50/55 p-4 rounded-2xl border border-gray-100">
                    <div className="text-center space-y-1">
                      <span className="text-xs text-gray-400 font-bold block uppercase">Protein</span>
                      <span className="text-base font-black text-[#1c2e24] block">{totalProtein}g</span>
                      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '40%' }} />
                      </div>
                    </div>

                    <div className="text-center space-y-1">
                      <span className="text-xs text-gray-400 font-bold block uppercase">Carbs</span>
                      <span className="text-base font-black text-[#1c2e24] block">{totalCarbs}g</span>
                      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '55%' }} />
                      </div>
                    </div>

                    <div className="text-center space-y-1">
                      <span className="text-xs text-gray-400 font-bold block uppercase">Fat</span>
                      <span className="text-base font-black text-[#1c2e24] block">{totalFat}g</span>
                      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: '30%' }} />
                      </div>
                    </div>

                    <div className="text-center space-y-1">
                      <span className="text-xs text-gray-400 font-bold block uppercase">Fiber</span>
                      <span className="text-base font-black text-[#1c2e24] block">{totalFiber}g</span>
                      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '70%' }} />
                      </div>
                    </div>
                  </div>

                </div>

                {/* 2. Beautiful Timeline Section */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-[#5e7166] uppercase tracking-wider flex items-center gap-2">
                    <Lucide.Compass className="w-4 h-4 text-[#52B788]" />
                    Daily Meal Progression Timeline
                  </h4>

                  <div className="space-y-6 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-[#52B788] before:to-[#B7E4C7] before:opacity-30">
                    {mealTimeline.map((item, idx) => (
                      <div key={item.id} className="relative pl-12 flex flex-col md:flex-row gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-[#52B788]/20 transition-all duration-300">
                        
                        {/* Timeline Bullet Anchor */}
                        <div className="absolute left-3.5 top-5 w-5.5 h-5.5 bg-white border-2 border-[#52B788] rounded-full flex items-center justify-center text-[10px] shadow-sm select-none">
                          {idx + 1}
                        </div>

                        {/* Food Unsplash Image */}
                        <div className="w-full md:w-32 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute bottom-1 right-1 bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded font-black uppercase">
                            {item.mealType}
                          </span>
                        </div>

                        {/* Meal Details */}
                        <div className="flex-1 space-y-2.5 flex flex-col justify-between">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h5 className="font-extrabold text-sm text-[#1c2e24]">{item.name}</h5>
                              <span className="text-[10px] font-black text-[#2D6A4F] bg-[#D8F3DC]/40 px-2 py-0.5 rounded border border-[#B7E4C7]/20">
                                🥣 {item.restaurant}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#5e7166] leading-relaxed font-semibold">
                              {item.description}
                            </p>
                          </div>

                          {/* Stats and Call to Action */}
                          <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            <div className="flex items-center gap-3">
                              <span>🔥 {item.calories} kcal</span>
                              <span>💪 {item.protein}g Protein</span>
                              <span>₹{item.price}</span>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => triggerToast(`Successfully added "${item.name}" from ${item.restaurant} to your active checkout order!`)}
                              className="px-3 py-1.5 bg-[#52B788] hover:bg-[#40916C] text-white text-[10px] font-black rounded-lg transition-colors cursor-pointer"
                            >
                              Add Order Single
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. AI Coach Tips Suggestions */}
                <div className="bg-gradient-to-br from-[#D8F3DC]/20 to-[#B7E4C7]/10 border border-[#B7E4C7]/30 rounded-[28px] p-6 space-y-4 text-left">
                  <h4 className="text-xs font-black text-[#1b4332] uppercase tracking-wider flex items-center gap-1.5">
                    <Lucide.HeartPulse className="w-4.5 h-4.5 text-[#52B788]" />
                    Luna Personal Health Insights
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiTips.map((tip, idx) => (
                      <div key={idx} className="bg-white/80 p-3.5 rounded-xl border border-white/50 space-y-1">
                        <span className="text-xs font-black text-[#1c2e24] block">{tip.title}</span>
                        <p className="text-[10px] text-[#5e7166] font-semibold leading-relaxed">{tip.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Action Command Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      triggerToast("PDF Nutrition Report prepared! Starting automatic export download...");
                      // Simulated PDF generator
                      setTimeout(() => {
                        triggerToast("DineGenie_AI_Meal_Plan.pdf downloaded successfully!");
                      }, 1000);
                    }}
                    className="flex-1 min-w-[140px] py-3 px-4 bg-white hover:bg-gray-50 text-gray-700 text-xs font-extrabold rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-sm"
                  >
                    <Lucide.Download className="w-3.5 h-3.5" />
                    <span>Export PDF Report</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGeneratePlan}
                    className="flex-1 min-w-[140px] py-3 px-4 bg-[#D8F3DC] hover:bg-[#B7E4C7]/60 text-[#1b4332] text-xs font-extrabold rounded-xl border border-[#B7E4C7]/30 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-sm"
                  >
                    <Lucide.RefreshCw className="w-3.5 h-3.5" />
                    <span>Regenerate Plan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerToast(`DineGenie has saved your AI plan for Goal: ${goals.find(g => g.id === selectedGoal)?.title}!`);
                    }}
                    className="flex-1 min-w-[140px] py-3 px-4 bg-[#1b4332] hover:bg-[#2D6A4F] text-white text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-sm"
                  >
                    <Lucide.BookmarkCheck className="w-3.5 h-3.5" />
                    <span>Save My Plan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerToast(`Successfully dispatched entire day's meal plan (${mealTimeline.length} dishes)! Total value: ₹${totalPlanPrice}. Arriving on schedule.`);
                    }}
                    className="w-full sm:w-auto py-3.5 px-6 bg-[#52B788] hover:bg-[#40916C] text-white text-xs font-black rounded-xl transition-all shadow-md shadow-[#52B788]/20 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <Lucide.ShoppingCart className="w-4 h-4" />
                    <span>Order Entire Meal Plan (₹{totalPlanPrice})</span>
                  </button>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </section>

    </div>
  );
}
