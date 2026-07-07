/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, MenuItem, TodaySpecial, Mood, WeatherInfo } from './types';

export const USER_PROFILE: UserProfile = {
  name: "Khushi Shekhawat",
  email: "khushishekhawat1109@gmail.com",
  tier: "Elite Platinum Member",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  walletBalance: 128.50,
};

export const SIDEBAR_ITEMS: MenuItem[] = [
  { id: 'home', title: 'Home', icon: 'Home' },
  { id: 'restaurants', title: 'Restaurants', icon: 'Utensils', badge: 'New' },
  { id: 'monthly-dashboard', title: 'Monthly Dashboard', icon: 'BarChart3', badge: 'New' },
  { id: 'ai-recommendations', title: 'AI Recommendations', icon: 'Sparkles' },
  { id: 'mood-cravings', title: 'Mood & Cravings', icon: 'Smile' },
  { id: 'nutrition', title: 'Nutrition', icon: 'Apple' },
  { id: 'meal-planner', title: 'Meal Planner', icon: 'CalendarDays' },
  { id: 'orders', title: 'Orders', icon: 'Package' },
  { id: 'favorites', title: 'Favorites', icon: 'Heart' },
  { id: 'wallet', title: 'Wallet', icon: 'Wallet' },
  { id: 'offers', title: 'Offers', icon: 'Gift', badge: '15%' },
  { id: 'luna', title: 'Luna', icon: 'MessageSquare' },
];

export const TODAY_SPECIAL: TodaySpecial = {
  name: "Truffle Mushroom Risotto",
  restaurant: "Bella Italia",
  price: 16.50,
  originalPrice: 22.00,
  rating: 4.9,
  tag: "Chefs Pick",
  image: "/src/assets/images/truffle_risotto_special_1783342184613.jpg",
};

export const MOODS: Mood[] = [
  {
    id: 'happy',
    emoji: '😊',
    label: 'Happy',
    description: 'Feeling wonderful! Celebrate with vibrant flavors & premium delights.',
    color: '#52B788',
    gradient: 'from-amber-100 to-[#D8F3DC]',
  },
  {
    id: 'tired',
    emoji: '😴',
    label: 'Tired',
    description: 'Low on energy? Cozy comfort foods to soothe your body and soul.',
    color: '#83C5BE',
    gradient: 'from-[#D8F3DC] to-sky-100',
  },
  {
    id: 'studying',
    emoji: '📚',
    label: 'Studying',
    description: 'Brain foods, nuts, berries, and custom memory-boosting light bites.',
    color: '#4EA8DE',
    gradient: 'from-blue-50 to-[#B7E4C7]',
  },
  {
    id: 'working',
    emoji: '💼',
    label: 'Working',
    description: 'Clean, mess-free powerhouse meals designed to keep you focused & productive.',
    color: '#5E60CE',
    gradient: 'from-slate-100 to-[#D8F3DC]',
  },
  {
    id: 'party',
    emoji: '🎉',
    label: 'Party',
    description: 'Generous sharing platters, artisanal dips, and celebratory visual feasts.',
    color: '#F15BB5',
    gradient: 'from-pink-100 to-[#FFFDF8]',
  },
  {
    id: 'date-night',
    emoji: '❤️',
    label: 'Date Night',
    description: 'Premium romantic dinners, exquisite desserts, and fine dining for two.',
    color: '#E63946',
    gradient: 'from-rose-50 to-[#B7E4C7]',
  },
  {
    id: 'healthy',
    emoji: '🥗',
    label: 'Healthy',
    description: 'Macro-calculated fresh salads, organic grain bowls & cold-pressed tonics.',
    color: '#52B788',
    gradient: 'from-emerald-50 to-[#D8F3DC]',
  },
  {
    id: 'comfort',
    emoji: '🍜',
    label: 'Comfort Food',
    description: 'Warm soups, loaded noodle bowls, and hot molten bakes from childhood.',
    color: '#F4A261',
    gradient: 'from-orange-50 to-[#FFFDF8]',
  },
];

export const LOCATIONS = [
  "Jaipur, Rajasthan",
  "Beverly Hills, Los Angeles",
  "Manhattan, New York",
  "Soho, London",
  "Downtown San Francisco",
  "Marina Bay, Singapore",
  "Champs-Élysées, Paris"
];

export const WEATHER_MOCK_DATA: Record<string, WeatherInfo> = {
  "Jaipur, Rajasthan": {
    temp: 32,
    condition: "Sunny",
    icon: "Sun",
    suggestion: "Beat the heat! Order chilled Mango Shake, fresh healthy salads, and artisan beverages."
  },
  "Beverly Hills, Los Angeles": {
    temp: 24,
    condition: "Sunny & Warm",
    icon: "Sun",
    suggestion: "Perfect weather for an organic Acai bowl or cold-pressed juices!"
  },
  "Manhattan, New York": {
    temp: 18,
    condition: "Partly Cloudy",
    icon: "CloudSun",
    suggestion: "Chilly breeze outside. How about a warm Truffle Mushroom Risotto?"
  },
  "Soho, London": {
    temp: 14,
    condition: "Drizzling",
    icon: "CloudRain",
    suggestion: "Rainy London afternoon calls for hot, comforting Ramen bowls!"
  },
  "Downtown San Francisco": {
    temp: 16,
    condition: "Foggy & Cool",
    icon: "Cloud",
    suggestion: "Classic Karl the Fog! Warm up with a hot, loaded clam chowder."
  },
  "Marina Bay, Singapore": {
    temp: 31,
    condition: "Humid & Tropical",
    icon: "Sun",
    suggestion: "Beat the tropical heat with a chilled coconut shake and fresh summer rolls!"
  },
  "Champs-Élysées, Paris": {
    temp: 19,
    condition: "Clear Sky",
    icon: "Sun",
    suggestion: "Cest si bon! Perfect for fresh artisan croissants or an elegant bistro lunch."
  }
};

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'flat';
  value: number;
  maxDiscount?: number;
  minOrder?: number;
}

export const COUPONS: Coupon[] = [
  { code: 'WELCOME50', description: '50% OFF up to ₹150', discountType: 'percentage', value: 50, maxDiscount: 150 },
  { code: 'SAVE100', description: 'Flat ₹100 OFF on orders above ₹400', discountType: 'flat', value: 100, minOrder: 400 },
  { code: 'FREEMEAL', description: '100% OFF up to ₹200 (100% free food up to limit)', discountType: 'percentage', value: 100, maxDiscount: 200 }
];
