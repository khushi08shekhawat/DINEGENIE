/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  isVeg?: boolean;
}

export interface Order {
  id: string;
  restaurantName: string;
  restaurantImage: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  platformFee: number;
  gst: number;
  total: number;
  date: string;
  status: 'confirmed' | 'preparing' | 'picked_up' | 'out_for_delivery' | 'delivered';
  eta: number; // in minutes
  rider?: {
    name: string;
    rating: number;
    vehicleNo: string;
    phone: string;
    avatar: string;
  };
  userRating?: number;
}

interface OrdersProps {
  orders: Order[];
  onReorder: (restaurantName: string, items: OrderItem[], deliveryTime: string) => void;
  onRateOrder: (orderId: string, rating: number) => void;
  triggerToast: (message: string) => void;
  onOpenLunaWithPrompt: (prompt: string) => void;
}

export default function Orders({
  orders,
  onReorder,
  onRateOrder,
  triggerToast,
  onOpenLunaWithPrompt,
}: OrdersProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [selectedOrderForRating, setSelectedOrderForRating] = useState<string | null>(null);
  const [ratingStars, setRatingStars] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState<string>('');

  // Local state to simulate status progress of active orders
  const [simulatedStatus, setSimulatedStatus] = useState<Record<string, 'confirmed' | 'preparing' | 'picked_up' | 'out_for_delivery' | 'delivered'>>({});
  const [simulatedEta, setSimulatedEta] = useState<Record<string, number>>({});

  const activeOrders = orders.filter(
    (order) => (simulatedStatus[order.id] || order.status) !== 'delivered'
  );
  const completedOrders = orders.filter(
    (order) => (simulatedStatus[order.id] || order.status) === 'delivered'
  );

  // Status mapping to steps
  const statusSteps = [
    { key: 'confirmed', label: 'Order Confirmed', description: 'Restaurant accepted', icon: 'CheckCircle2' },
    { key: 'preparing', label: 'Preparing', description: 'Kitchen is cooking', icon: 'Utensils' },
    { key: 'picked_up', label: 'Picked Up', description: 'Rider received order', icon: 'Package' },
    { key: 'out_for_delivery', label: 'Out for Delivery', description: 'Rider is on the way', icon: 'Bike' },
    { key: 'delivered', label: 'Delivered', description: 'Arrived at your door', icon: 'Home' },
  ] as const;

  const getStatusIndex = (status: Order['status']) => {
    return statusSteps.findIndex((step) => step.key === status);
  };

  // Set up simulation intervals
  useEffect(() => {
    // Initialize status for active orders if not set
    const initialStatus: typeof simulatedStatus = { ...simulatedStatus };
    const initialEtas: typeof simulatedEta = { ...simulatedEta };
    let changed = false;

    orders.forEach((order) => {
      if (order.status !== 'delivered' && !initialStatus[order.id]) {
        initialStatus[order.id] = order.status;
        initialEtas[order.id] = order.eta;
        changed = true;
      }
    });

    if (changed) {
      setSimulatedStatus(initialStatus);
      setSimulatedEta(initialEtas);
    }
  }, [orders]);

  // Handle manual/auto progress simulation for a live experience
  const advanceOrderStatus = (orderId: string) => {
    const currentStatus = simulatedStatus[orderId] || 'confirmed';
    const currentIndex = getStatusIndex(currentStatus);
    if (currentIndex < statusSteps.length - 1) {
      const nextStatus = statusSteps[currentIndex + 1].key;
      setSimulatedStatus((prev) => ({
        ...prev,
        [orderId]: nextStatus,
      }));

      // Dynamically decrease ETA as delivery progresses
      setSimulatedEta((prev) => {
        const curEta = prev[orderId] || 30;
        const nextEta = Math.max(5, Math.round(curEta * 0.6));
        return {
          ...prev,
          [orderId]: nextStatus === 'delivered' ? 0 : nextEta,
        };
      });

      triggerToast(`Order status updated to: ${statusSteps[currentIndex + 1].label}! ⚡`);
    }
  };

  const handleRateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOrderForRating) {
      onRateOrder(selectedOrderForRating, ratingStars);
      triggerToast(`⭐ Thank you! Rated ${ratingStars} stars for your order.`);
      setSelectedOrderForRating(null);
      setRatingStars(5);
      setRatingComment('');
    }
  };

  const renderStatusIcon = (iconName: string, className = "w-5 h-5") => {
    const IconComponent = (Lucide as any)[iconName];
    if (IconComponent) {
      return <IconComponent className={className} />;
    }
    return <Lucide.Package className={className} />;
  };

  return (
    <div id="orders-page-container" className="flex-1 space-y-8 text-left max-w-5xl mx-auto py-2 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#B7E4C7]/20 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-[#1c2e24] font-display">
            Your Premium <span className="text-[#52B788]">DineGenie Orders</span>
          </h2>
          <p className="text-sm text-[#5e7166] mt-1">
            Track real-time active deliveries or reorder your favorite meals from Jaipur's top culinary kitchens.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="inline-flex p-1.5 bg-[#FFFDF8] border border-[#B7E4C7]/30 rounded-2xl shadow-sm self-start md:self-center shrink-0">
          <button
            id="tab-active-orders"
            onClick={() => setActiveTab('active')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'active'
                ? 'bg-[#52B788] text-white shadow-sm'
                : 'text-[#5e7166] hover:text-[#1c2e24] hover:bg-gray-50'
            }`}
          >
            <Lucide.Compass className="w-4 h-4" />
            Active Orders
            {activeOrders.length > 0 && (
              <span className="bg-[#FFFDF8] text-[#2D6A4F] text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
                {activeOrders.length}
              </span>
            )}
          </button>
          <button
            id="tab-order-history"
            onClick={() => setActiveTab('history')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-[#52B788] text-white shadow-sm'
                : 'text-[#5e7166] hover:text-[#1c2e24] hover:bg-gray-50'
            }`}
          >
            <Lucide.History className="w-4 h-4" />
            Order History
            {completedOrders.length > 0 && (
              <span className="bg-[#D8F3DC] text-[#2D6A4F] text-[10px] px-2 py-0.5 rounded-full font-black">
                {completedOrders.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tabs Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'active' ? (
          <motion.div
            key="active-orders-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            {activeOrders.length === 0 ? (
              <div id="no-active-orders" className="text-center py-16 px-6 bg-white border border-[#B7E4C7]/20 rounded-[32px] shadow-premium max-w-2xl mx-auto space-y-6">
                <div className="w-16 h-16 bg-[#D8F3DC] rounded-[24px] flex items-center justify-center text-[#52B788] mx-auto shadow-inner">
                  <Lucide.ShoppingBag className="w-8 h-8 animate-pulse-slow" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#1c2e24] font-display">No active orders right now</h3>
                  <p className="text-sm text-[#5e7166] max-w-md mx-auto">
                    Hungry? Treat yourself to fresh, localized culinary items. Order now from the Restaurants tab or let Luna customize a meal plan.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => onOpenLunaWithPrompt("Show me some top Jaipur tea and snack recommendations from Tapri Central!")}
                    className="px-6 py-3 bg-[#52B788] hover:bg-[#40916C] text-white text-xs font-bold rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer inline-flex items-center gap-2"
                  >
                    <Lucide.Sparkles className="w-4 h-4" />
                    Consult DineGenie Luna
                  </button>
                </div>
              </div>
            ) : (
              activeOrders.map((order) => {
                const currentStatus = simulatedStatus[order.id] || order.status;
                const statusIndex = getStatusIndex(currentStatus);
                const progressPercentage = (statusIndex / (statusSteps.length - 1)) * 100;
                const etaVal = simulatedEta[order.id] !== undefined ? simulatedEta[order.id] : order.eta;

                return (
                  <div
                    key={order.id}
                    id={`active-order-${order.id}`}
                    className="bg-[#FFFDF8] border border-[#B7E4C7]/30 rounded-[32px] p-6 md:p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300 space-y-8 relative overflow-hidden"
                  >
                    {/* Header bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B7E4C7]/20 pb-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={order.restaurantImage}
                          alt={order.restaurantName}
                          className="w-14 h-14 rounded-2xl object-cover border border-[#B7E4C7]/20 shadow-sm shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h3 className="text-lg font-extrabold text-[#1c2e24] font-display">
                            {order.restaurantName}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-[#5e7166] mt-0.5 font-medium">
                            <span>ID: <strong className="text-[#1c2e24]">{order.id}</strong></span>
                            <span>•</span>
                            <span>{order.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                        {/* Simulation trigger */}
                        {currentStatus !== 'delivered' && (
                          <button
                            onClick={() => advanceOrderStatus(order.id)}
                            className="px-3.5 py-1.5 bg-[#D8F3DC] hover:bg-[#b7e4c7]/50 text-[#1b4332] text-[10px] font-black uppercase tracking-wider rounded-xl border border-[#B7E4C7]/30 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                            title="Simulate order milestone"
                          >
                            <Lucide.Play className="w-3 h-3 fill-[#1b4332]" />
                            Simulate Next Step
                          </button>
                        )}
                        <span className="bg-[#FFFDF8] border border-[#52B788]/30 text-[#2D6A4F] text-xs font-black px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#52B788] animate-ping" />
                          {etaVal > 0 ? `ETA: ${etaVal} mins` : 'Arrived'}
                        </span>
                      </div>
                    </div>

                    {/* Timeline Tracker */}
                    <div className="space-y-6">
                      <div className="relative">
                        {/* Progress line background */}
                        <div className="absolute top-[18px] left-5 right-5 md:left-8 md:right-8 h-1 bg-gray-100 rounded-full" />
                        
                        {/* Active animated progress bar */}
                        <motion.div
                          className="absolute top-[18px] left-5 md:left-8 h-1 bg-[#52B788] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        />

                        {/* Status timeline nodes */}
                        <div className="relative flex justify-between">
                          {statusSteps.map((step, idx) => {
                            const isCompleted = idx <= statusIndex;
                            const isCurrent = idx === statusIndex;
                            return (
                              <div
                                key={step.key}
                                className="flex flex-col items-center text-center max-w-[80px] md:max-w-[120px] group"
                              >
                                <div
                                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-500 z-10 ${
                                    isCompleted
                                      ? 'bg-[#52B788] border-[#52B788] text-white shadow-md'
                                      : 'bg-white border-gray-200 text-gray-400'
                                  } ${isCurrent ? 'ring-4 ring-[#D8F3DC] scale-110' : ''}`}
                                >
                                  {renderStatusIcon(step.icon, "w-4 h-4")}
                                </div>
                                <span
                                  className={`text-[10px] md:text-xs mt-3 font-bold transition-colors ${
                                    isCompleted ? 'text-[#1c2e24]' : 'text-gray-400'
                                  } ${isCurrent ? 'text-[#2D6A4F]' : ''}`}
                                >
                                  {step.label}
                                </span>
                                <span className="text-[8px] md:text-[10px] text-gray-400 hidden sm:block mt-0.5 line-clamp-2 leading-tight">
                                  {step.description}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Main Layout Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
                      {/* Rider Card & Actions */}
                      <div className="md:col-span-5 space-y-4">
                        <h4 className="text-xs font-extrabold text-[#1c2e24] uppercase tracking-wider font-display">
                          Your Concierge Rider
                        </h4>
                        
                        {order.rider ? (
                          <div className="bg-[#F8F5F2]/80 border border-[#B7E4C7]/20 rounded-2xl p-4 flex items-center gap-4">
                            <img
                              src={order.rider.avatar}
                              alt={order.rider.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-[#52B788] shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0 flex-1">
                              <h5 className="text-xs font-extrabold text-[#1c2e24] truncate">
                                {order.rider.name}
                              </h5>
                              <div className="flex items-center gap-1.5 text-[11px] text-[#5e7166] mt-0.5 font-semibold">
                                <span className="flex items-center text-amber-500">
                                  ★ {order.rider.rating}
                                </span>
                                <span>•</span>
                                <span className="text-gray-400 font-normal">{order.rider.vehicleNo}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => triggerToast(`📞 Dialing ${order.rider?.name}... Direct call channel established!`)}
                              className="w-9 h-9 bg-white border border-[#B7E4C7]/30 hover:bg-[#D8F3DC] rounded-xl flex items-center justify-center text-[#52B788] transition-colors cursor-pointer shrink-0"
                              title="Call Rider"
                            >
                              <Lucide.Phone className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center text-xs text-gray-400">
                            Assigning premium rider...
                          </div>
                        )}

                        <div className="flex gap-3">
                          <button
                            onClick={() => triggerToast(`🗺️ Live GPS Tracking Active: Connected with Jaipur City Node. Delivery en route!`)}
                            className="flex-1 py-3 bg-[#52B788] hover:bg-[#40916C] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                          >
                            <Lucide.MapPin className="w-3.5 h-3.5" />
                            Track Live Order
                          </button>
                          <button
                            onClick={() => onOpenLunaWithPrompt(`Please check status and estimate delivery coordinates for order ID ${order.id}.`)}
                            className="py-3 px-4 bg-white border border-[#B7E4C7]/30 text-[#1b4332] text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                          >
                            <Lucide.Bot className="w-3.5 h-3.5" />
                            Ask Luna
                          </button>
                        </div>
                      </div>

                      {/* Order Summary Breakdown */}
                      <div className="md:col-span-7 bg-[#FFFDF8] border border-[#B7E4C7]/25 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-extrabold text-[#1c2e24] uppercase tracking-wider font-display">
                            Order Summary
                          </h4>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                            {order.items.reduce((acc, i) => acc + i.quantity, 0)} Items
                          </span>
                        </div>

                        {/* Items list */}
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className={`w-3.5 h-3.5 flex items-center justify-center text-[8px] font-bold border rounded shrink-0 ${
                                  item.isVeg ? 'border-emerald-500 text-emerald-500' : 'border-red-500 text-red-500'
                                }`}>
                                  {item.isVeg ? '●' : '▲'}
                                </span>
                                <span className="text-[#1c2e24] font-bold truncate">{item.name}</span>
                                <span className="text-gray-400 text-[10px] font-normal">x{item.quantity}</span>
                              </div>
                              <span className="text-[#1c2e24] font-semibold shrink-0">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* Charges breakdown */}
                        <div className="pt-3 border-t border-dashed border-[#B7E4C7]/20 space-y-1.5 text-[11px] text-[#5e7166] font-medium">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="text-gray-700">₹{order.subtotal}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between text-emerald-600 font-bold">
                              <span>Coupon Discount</span>
                              <span>-₹{order.discount}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>GST & Restaurant Charges (18%)</span>
                            <span className="text-gray-700">₹{order.gst}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Platform Fee</span>
                            <span className="text-gray-700">₹{order.platformFee}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Delivery Fee</span>
                            <span className="text-gray-700">{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
                          </div>
                          
                          <div className="pt-2 border-t border-dashed border-[#B7E4C7]/20 flex justify-between text-[#1b4332] font-black text-sm">
                            <span className="font-display">Paid Total</span>
                            <span className="text-base font-display">₹{order.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        ) : (
          <motion.div
            key="order-history-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {completedOrders.length === 0 ? (
              <div id="no-history-orders" className="text-center py-16 px-6 bg-white border border-[#B7E4C7]/20 rounded-[32px] shadow-premium max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-[#D8F3DC] rounded-[24px] flex items-center justify-center text-[#52B788] mx-auto mb-4">
                  <Lucide.History className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#1c2e24] font-display">No previous orders yet</h3>
                <p className="text-xs text-[#5e7166] mt-1 max-w-sm mx-auto">
                  When you check out your dynamic gourmet cart, your completed orders will show up here as culinary memories!
                </p>
              </div>
            ) : (
              completedOrders.map((order) => (
                <div
                  key={order.id}
                  id={`history-order-${order.id}`}
                  className="bg-white border border-[#B7E4C7]/20 rounded-3xl p-5 md:p-6 shadow-premium hover:shadow-premium-lg transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B7E4C7]/15 pb-4 mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={order.restaurantImage}
                        alt={order.restaurantName}
                        className="w-12 h-12 rounded-xl object-cover border border-[#B7E4C7]/10 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h3 className="text-sm md:text-base font-extrabold text-[#1c2e24] font-display">
                          {order.restaurantName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs text-[#5e7166] mt-0.5">
                          <span>ID: <strong>{order.id}</strong></span>
                          <span>•</span>
                          <span>{order.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                      <span className="text-[10px] md:text-xs font-extrabold text-emerald-800 bg-[#D8F3DC] px-2.5 py-1 rounded-full border border-[#B7E4C7]/30 flex items-center gap-1">
                        <Lucide.CheckCircle2 className="w-3 h-3 text-[#52B788]" />
                        Delivered Successfully
                      </span>
                      <span className="text-sm font-extrabold text-[#1c2e24] font-display">
                        ₹{order.total}
                      </span>
                    </div>
                  </div>

                  {/* Order History Item Details */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#5e7166]">Items Ordered:</p>
                      <p className="text-xs font-bold text-[#1c2e24] mt-1 leading-relaxed line-clamp-2">
                        {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                      </p>
                      
                      {/* Rating details */}
                      {order.userRating ? (
                        <div className="flex items-center gap-1.5 mt-2.5 text-xs text-[#5e7166] font-medium">
                          <span className="text-gray-400">Your Rating:</span>
                          <span className="flex items-center text-amber-500 font-extrabold">
                            {"★".repeat(order.userRating)}
                            {"☆".repeat(5 - order.userRating)}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2 md:pt-0 shrink-0">
                      {!order.userRating && (
                        <button
                          onClick={() => setSelectedOrderForRating(order.id)}
                          className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-[#1b4332] text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Lucide.Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          Rate Order
                        </button>
                      )}
                      <button
                        onClick={() => {
                          onReorder(order.restaurantName, order.items, '25 mins');
                          triggerToast(`🛒 Added items from ${order.restaurantName} to your cart for reorder!`);
                        }}
                        className="px-4 py-2 bg-[#52B788] hover:bg-[#40916C] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Lucide.RefreshCw className="w-3.5 h-3.5" />
                        Reorder Meal
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⭐ Feedback Rating Modal Popup */}
      <AnimatePresence>
        {selectedOrderForRating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedOrderForRating(null);
              }
            }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FFFDF8] border border-[#B7E4C7]/40 rounded-[32px] max-w-md w-full shadow-premium-lg p-6 space-y-6"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-[#1c2e24] font-display">Rate Your Dining Experience</h3>
                  <p className="text-xs text-[#5e7166]">
                    Help DineGenie and the kitchen improve recommendations for your profile.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrderForRating(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <Lucide.X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRateSubmit} className="space-y-5 text-center">
                {/* 5-star selector */}
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingStars(star)}
                      className="text-3xl transition-transform hover:scale-110 cursor-pointer p-1"
                    >
                      <Lucide.Star
                        className={`w-8 h-8 ${
                          star <= ratingStars ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Text comment */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="rating-comment" className="text-xs font-bold text-[#1c2e24]">
                    Add Comments (Optional)
                  </label>
                  <textarea
                    id="rating-comment"
                    rows={3}
                    placeholder="E.g., Delicious paneer ghewar, perfectly balanced saffron levels!"
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    className="w-full text-xs p-3 rounded-2xl border border-[#B7E4C7]/30 bg-white focus:outline-none focus:ring-2 focus:ring-[#52B788] text-[#1c2e24] placeholder-gray-400"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedOrderForRating(null)}
                    className="flex-1 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#52B788] hover:bg-[#40916C] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer active:scale-95"
                  >
                    Submit Rating
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
