/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { SIDEBAR_ITEMS, USER_PROFILE, TODAY_SPECIAL } from '../data';
import { MenuItem } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  onOpenLuna: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onOpenLuna }: SidebarProps) {
  const [copied, setCopied] = useState(false);

  // Dynamic Lucide helper
  const renderIcon = (iconName: string, className = "w-5 h-5") => {
    const IconComponent = (Lucide as any)[iconName];
    if (IconComponent) {
      return <IconComponent className={className} />;
    }
    return <Lucide.HelpCircle className={className} />;
  };

  const handleCopyCode = () => {
    setCopied(true);
    navigator.clipboard.writeText("GENIE10");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="w-80 h-screen bg-[#FFFDF8] border-r border-[#B7E4C7]/30 flex flex-col fixed left-0 top-0 overflow-y-auto z-30 pb-6 scrollbar-thin">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#B7E4C7]/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#52B788] to-[#B7E4C7] rounded-2xl flex items-center justify-center shadow-premium-lg">
            <Lucide.Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#1c2e24] tracking-tight flex items-center gap-1 font-display">
              Dine<span className="text-[#52B788]">Genie</span>
            </h1>
            <p className="text-[10px] text-[#52B788] font-bold tracking-widest uppercase">
              Intelligent Dining
            </p>
          </div>
        </div>
        <span className="bg-[#D8F3DC] text-[#2D6A4F] text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-[#B7E4C7]/40 uppercase tracking-wider animate-pulse-slow">
          v1.0
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'luna') {
                  onOpenLuna();
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? 'bg-gradient-to-r from-[#D8F3DC] to-[#FFFDF8] text-[#1b4332] font-semibold border-l-4 border-[#52B788] shadow-sm'
                  : 'text-[#5e7166] hover:bg-[#F8F5F2]/80 hover:text-[#1c2e24]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className={`transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'text-[#52B788]' : 'text-[#8fa395]'
                }`}>
                  {renderIcon(item.icon)}
                </span>
                <span className="text-sm font-medium tracking-wide font-display">
                  {item.title}
                </span>
              </div>
              {item.badge && (
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  item.badge === 'New' 
                    ? 'bg-[#52B788] text-white' 
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Cards Area */}
      <div className="px-5 space-y-5 mt-auto pt-6 border-t border-[#B7E4C7]/20">
        
        {/* Refer & Earn Card */}
        <div className="bg-[#B7E4C7]/20 border border-[#B7E4C7]/30 rounded-[24px] p-4 relative overflow-hidden group shadow-premium transition-all duration-300 hover:shadow-premium-lg">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-[#52B788]/10 rounded-full blur-xl group-hover:scale-125 transition-all duration-500" />
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-sm">
              <Lucide.Gift className="w-4 h-4 text-[#52B788]" />
            </div>
            <span className="text-xs font-bold text-[#1b4332]">Refer & Earn $10</span>
          </div>
          <p className="text-xs text-[#5e7166] mb-3 leading-relaxed">
            Invite friends to DineGenie and you both receive $10 on their first bite.
          </p>
          <button
            onClick={handleCopyCode}
            className="w-full py-2 px-3 bg-white hover:bg-[#D8F3DC] border border-[#B7E4C7]/40 rounded-xl text-xs font-bold text-[#1b4332] transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            {copied ? (
              <>
                <Lucide.Check className="w-3.5 h-3.5 text-[#52B788]" />
                Copied code!
              </>
            ) : (
              <>
                <Lucide.Share2 className="w-3.5 h-3.5 text-[#52B788]" />
                Code: GENIE10
              </>
            )}
          </button>
        </div>

        {/* Today's Special Card */}
        <div className="bg-white border border-[#B7E4C7]/20 rounded-[24px] p-4 shadow-premium relative overflow-hidden group transition-all duration-300 hover:shadow-premium-lg">
          <div className="relative h-28 rounded-2xl overflow-hidden mb-3">
            <img
              src={TODAY_SPECIAL.image}
              alt={TODAY_SPECIAL.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute top-2 left-2 bg-[#D8F3DC] text-[#2D6A4F] text-[9px] font-bold px-2.5 py-1 rounded-full border border-[#B7E4C7]/40">
              Chef's Pick
            </span>
          </div>
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-sm font-bold text-[#1c2e24] line-clamp-1 font-display">
              {TODAY_SPECIAL.name}
            </h4>
            <div className="flex items-center text-amber-500 text-xs shrink-0 ml-1">
              <Lucide.Star className="w-3 h-3 fill-amber-500 mr-0.5" />
              <span className="font-bold">{TODAY_SPECIAL.rating}</span>
            </div>
          </div>
          <p className="text-[11px] text-[#5e7166] mb-3">{TODAY_SPECIAL.restaurant}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-extrabold text-[#1b4332]">${TODAY_SPECIAL.price.toFixed(2)}</span>
              <span className="text-[10px] text-gray-400 line-through">${TODAY_SPECIAL.originalPrice.toFixed(2)}</span>
            </div>
            <button className="py-1.5 px-3 bg-[#52B788] hover:bg-[#40916C] text-white text-[10px] font-bold rounded-xl transition-all flex items-center gap-1 shadow-sm shadow-[#52B788]/20 hover:scale-105 active:scale-95">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              Order Special
            </button>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="flex items-center gap-3.5 p-2.5 bg-[#F8F5F2]/60 rounded-2xl border border-[#B7E4C7]/10">
          <div className="relative shrink-0">
            <img
              src={USER_PROFILE.avatarUrl}
              alt={USER_PROFILE.name}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-full object-cover border-2 border-[#52B788] shadow-sm"
            />
            <div className="absolute right-0 bottom-0 w-3 h-3 bg-[#52B788] border-2 border-[#FFFDF8] rounded-full" />
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="text-xs font-bold text-[#1c2e24] truncate leading-tight font-display">
              {USER_PROFILE.name}
            </h5>
            <p className="text-[10px] text-[#52B788] font-bold tracking-tight truncate mb-0.5">
              {USER_PROFILE.tier}
            </p>
            <div className="flex items-center gap-1">
              <Lucide.Wallet className="w-3 h-3 text-[#8fa395]" />
              <span className="text-[11px] font-medium text-[#5e7166]">
                Balance: <span className="font-bold text-[#1b4332]">${USER_PROFILE.walletBalance.toFixed(2)}</span>
              </span>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
}
