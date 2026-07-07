/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  name: string;
  email: string;
  tier: string;
  avatarUrl: string;
  walletBalance: number;
}

export interface MenuItem {
  id: string;
  title: string;
  icon: string;
  badge?: string;
}

export interface TodaySpecial {
  name: string;
  restaurant: string;
  price: number;
  rating: number;
  originalPrice: number;
  tag: string;
  image: string;
}

export interface Mood {
  id: string;
  emoji: string;
  label: string;
  description: string;
  color: string;
  gradient: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  suggestions?: string[];
}

export interface WeatherInfo {
  temp: number;
  condition: string;
  icon: string;
  suggestion: string;
}
