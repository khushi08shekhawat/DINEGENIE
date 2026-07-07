/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/Sidebar';
import Luna from './components/Luna';
import AIRecommendations from './components/AIRecommendations';
import AINutritionDashboard from './components/AINutritionDashboard';
import Restaurants from './components/Restaurants';
import AIMealPlanner from './components/AIMealPlanner';
import Orders, { Order } from './components/Orders';
import MonthlyDashboard from './components/MonthlyDashboard';
import { MOODS, LOCATIONS, WEATHER_MOCK_DATA, TODAY_SPECIAL, COUPONS, Coupon } from './data';
import { Mood, WeatherInfo } from './types';

const DEFAULT_ORDERS: Order[] = [
  {
    id: "ORD-984210",
    restaurantName: "Tapri Central",
    restaurantImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600",
    items: [
      { name: "Saffron Masala Chai", price: 90, quantity: 2, isVeg: true },
      { name: "Gourmet Bun Maska", price: 110, quantity: 1, isVeg: true }
    ],
    subtotal: 290,
    discount: 0,
    deliveryFee: 40,
    platformFee: 10,
    gst: 52,
    total: 392,
    date: "06-Jul-2026 18:15",
    status: "preparing",
    eta: 22,
    rider: {
      name: "Rahul Sharma",
      rating: 4.9,
      vehicleNo: "RJ-14-SG-2024",
      phone: "+91 98765 43210",
      avatar: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=200"
    }
  },
  {
    id: "ORD-871542",
    restaurantName: "Laxmi Mishthan Bhandar (LMB)",
    restaurantImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600",
    items: [
      { name: "Special Paneer Ghewar", price: 350, quantity: 1, isVeg: true },
      { name: "Pyaaz Kachori (2 Pcs)", price: 120, quantity: 1, isVeg: true }
    ],
    subtotal: 470,
    discount: 50,
    deliveryFee: 0,
    platformFee: 10,
    gst: 85,
    total: 515,
    date: "05-Jul-2026 14:30",
    status: "delivered",
    eta: 0,
    userRating: 5
  },
  {
    id: "ORD-653119",
    restaurantName: "Spice Court",
    restaurantImage: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=600",
    items: [
      { name: "Paneer Butter Masala", price: 320, quantity: 1, isVeg: true },
      { name: "Garlic Butter Naan", price: 80, quantity: 2, isVeg: true }
    ],
    subtotal: 480,
    discount: 100,
    deliveryFee: 40,
    platformFee: 10,
    gst: 86,
    total: 516,
    date: "04-Jul-2026 20:15",
    status: "delivered",
    eta: 0
  },
  {
    id: "ORD-321458",
    restaurantName: "Zolocrust",
    restaurantImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600",
    items: [
      { name: "Artisanal Almond Croissant", price: 240, quantity: 2, isVeg: true },
      { name: "Dark Chocolate Truffle Cake", price: 280, quantity: 1, isVeg: true }
    ],
    subtotal: 760,
    discount: 150,
    deliveryFee: 0,
    platformFee: 10,
    gst: 137,
    total: 757,
    date: "02-Jul-2026 16:45",
    status: "delivered",
    eta: 0,
    userRating: 4
  }
];

interface RestaurantMenuItem {
  name: string;
  price: number;
  description: string;
  calories: string;
  isVeg: boolean;
}

interface HomeRestaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  priceLevel: string;
  image: string;
  isOpen: boolean;
  address: string;
  popularDish: string;
  menuItems: RestaurantMenuItem[];
}

const HOME_RESTAURANTS: HomeRestaurant[] = [
  {
    id: 'rest-1',
    name: 'Tapri Central',
    cuisine: 'Cafe',
    rating: 4.7,
    deliveryTime: '25 mins',
    priceLevel: '₹₹',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600',
    isOpen: true,
    address: 'C-Scheme, Jaipur',
    popularDish: 'Kesar Chai & Bun Maska',
    menuItems: [
      { name: 'Saffron Masala Chai', price: 90, description: 'Traditional Rajasthani slow-brewed milk tea with royal saffron strands.', calories: '110 kcal', isVeg: true },
      { name: 'Gourmet Bun Maska', price: 110, description: 'Toasted soft brioche bun loaded with fresh homemade white butter.', calories: '290 kcal', isVeg: true },
      { name: 'Spicy Maggie Tadka', price: 130, description: 'Street-style pan-fried noodles tossed in rich C-Scheme street spices.', calories: '340 kcal', isVeg: true },
      { name: 'Cheesy Garlic Khakhra', price: 150, description: 'Crisp whole-wheat flatbread loaded with hand-grated Amul cheese.', calories: '210 kcal', isVeg: true }
    ]
  },
  {
    id: 'rest-2',
    name: 'Bar Palladio',
    cuisine: 'Pizza',
    rating: 4.8,
    deliveryTime: '35 mins',
    priceLevel: '₹₹₹₹',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
    isOpen: true,
    address: 'Narayan Singh Circle, Jaipur',
    popularDish: 'Woodfired Gnocchi & Tiramisu',
    menuItems: [
      { name: 'Gnocchi Cacio e Pepe', price: 420, description: 'Handmade potato dumplings rolled in aged Pecorino and cracked black pepper.', calories: '480 kcal', isVeg: true },
      { name: 'Margherita Classica Pizza', price: 480, description: 'San Marzano tomato base, fresh local buffalo mozzarella, and organic basil.', calories: '650 kcal', isVeg: true },
      { name: 'Spaghetti alla Nerano', price: 520, description: 'Artisanal spaghetti spun with sweet pan-fried zucchini and provolone.', calories: '540 kcal', isVeg: true },
      { name: 'Classic Venetian Tiramisu', price: 350, description: 'Ladyfingers soaked in double shot espresso with velvety mascarpone.', calories: '420 kcal', isVeg: true }
    ]
  },
  {
    id: 'rest-3',
    name: 'Spice Court',
    cuisine: 'Indian',
    rating: 4.5,
    deliveryTime: '30 mins',
    priceLevel: '₹₹₹',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=600',
    isOpen: true,
    address: 'Civil Lines, Jaipur',
    popularDish: 'Rajasthani Lal Maas & Jungli Maas',
    menuItems: [
      { name: 'Paneer Butter Masala', price: 320, description: 'Soft cottage cheese cubes in a rich, sweet, mildly spiced tomato gravy.', calories: '450 kcal', isVeg: true },
      { name: 'Jungli Maas (Slow Cooked)', price: 450, description: 'Jaipur royal heritage mutton curry cooked using only ghee and dry whole red chilies.', calories: '580 kcal', isVeg: false },
      { name: 'Garlic Butter Naan', price: 80, description: 'Leavened clay-oven flatbread topped with minced raw garlic and organic butter.', calories: '260 kcal', isVeg: true },
      { name: 'Shahi Malai Kofta', price: 340, description: 'Paneer dumplings stuffed with dry fruits, simmered in premium cashew gravy.', calories: '510 kcal', isVeg: true }
    ]
  },
  {
    id: 'rest-4',
    name: 'Zolocrust',
    cuisine: 'Desserts',
    rating: 4.9,
    deliveryTime: '20 mins',
    priceLevel: '₹₹₹',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
    isOpen: true,
    address: 'Malviya Nagar, Jaipur',
    popularDish: 'Almond Croissant & Apple Pie',
    menuItems: [
      { name: 'Artisanal Almond Croissant', price: 240, description: 'Flaky butter pastry loaded with sweet almond paste and toasted flakes.', calories: '390 kcal', isVeg: true },
      { name: 'Organic Sourdough Pizza', price: 490, description: '72-hour cold fermented sourdough crust with charred cherry tomatoes.', calories: '580 kcal', isVeg: true },
      { name: 'Dark Chocolate Truffle Cake', price: 280, description: 'Single origin Belgian chocolate cake layered with rich dark ganache.', calories: '460 kcal', isVeg: true },
      { name: 'Warm Apple Cinnamon Tart', price: 210, description: 'Spiced Himachal apples baked in shortcrust pastry with real vanilla.', calories: '310 kcal', isVeg: true }
    ]
  },
  {
    id: 'rest-5',
    name: 'Chokhi Dhani',
    cuisine: 'Indian',
    rating: 4.8,
    deliveryTime: '45 mins',
    priceLevel: '₹₹₹',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600',
    isOpen: true,
    address: 'Tonk Road, Jaipur',
    popularDish: 'Traditional Rajasthani Thali',
    menuItems: [
      { name: 'Royal Rajasthani Thali', price: 850, description: 'A complete golden experience featuring Dal, Baati, Churma, Gatte ki Sabji, and Kair Sangri.', calories: '1250 kcal', isVeg: true },
      { name: 'Traditional Churma Combo', price: 180, description: 'Wheat flour churma sweetened with desi jaggery and swimming in royal cow ghee.', calories: '380 kcal', isVeg: true },
      { name: 'Authentic Dal Baati', price: 250, description: 'Oven-baked whole wheat flour rounds served with mixed yellow lentils.', calories: '440 kcal', isVeg: true },
      { name: 'Masala Butter Milk (Chaas)', price: 90, description: 'Chilled local churned yogurt with roasted cumin and dry mint.', calories: '80 kcal', isVeg: true }
    ]
  },
  {
    id: 'rest-6',
    name: 'Nibs Café',
    cuisine: 'Cafe',
    rating: 4.4,
    deliveryTime: '15 mins',
    priceLevel: '₹₹',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600',
    isOpen: true,
    address: 'Gopalbari, Jaipur',
    popularDish: 'Chocolate Injection & Waffles',
    menuItems: [
      { name: 'Waffle with Chocolate Injection', price: 190, description: 'Crisp hot waffle served with a physical syringe loaded with warm Belgian fudge.', calories: '490 kcal', isVeg: true },
      { name: 'Arrabiata Penne Pasta', price: 220, description: 'Al dente penne pasta cooked in spicy garlic tomato sauce with black olives.', calories: '380 kcal', isVeg: true },
      { name: 'Smoked Cheese Fries', price: 160, description: 'Crisp golden potato fingers baked in smoked hickory cheese sauce.', calories: '410 kcal', isVeg: true },
      { name: 'Hazelnut Iced Frappé', price: 180, description: 'Double shot arabica blended with whole milk and sweet Italian hazelnut syrup.', calories: '280 kcal', isVeg: true }
    ]
  },
  {
    id: 'rest-7',
    name: 'Handi Restaurant',
    cuisine: 'Indian',
    rating: 4.6,
    deliveryTime: '28 mins',
    priceLevel: '₹₹',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600',
    isOpen: true,
    address: 'M.I. Road, Jaipur',
    popularDish: 'Handi Biryani & Paneer Tikka',
    menuItems: [
      { name: 'Aromatic Veg Handi Biryani', price: 290, description: 'Basmati rice steam-cooked in custom clay pots with organic vegetables and saffron.', calories: '480 kcal', isVeg: true },
      { name: 'Paneer Tikka Shaslik', price: 260, description: 'Skewered cottage cheese pieces spiced with dry fenugreek, roasted in live tandoor.', calories: '320 kcal', isVeg: true },
      { name: 'Mughlai Butter Chicken', price: 380, description: 'Tandoori boneless chicken simmered in silk butter cream tomato gravy.', calories: '560 kcal', isVeg: false },
      { name: 'Khamiri Roti (Single)', price: 60, description: 'Traditional yeast-fermented Mughlai flatbread cooked on heavy inverted griddles.', calories: '180 kcal', isVeg: true }
    ]
  },
  {
    id: 'rest-8',
    name: 'Town Coffee',
    cuisine: 'Healthy',
    rating: 4.5,
    deliveryTime: '15 mins',
    priceLevel: '₹₹',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600',
    isOpen: true,
    address: 'Vaishali Nagar, Jaipur',
    popularDish: 'Avocado Toast & Cold Brew',
    menuItems: [
      { name: 'Smashed Avocado Toast', price: 280, description: 'Fresh Mexican Haas avocado on toasted artisanal sourdough with microgreens.', calories: '310 kcal', isVeg: true },
      { name: 'Quinoa Beetroot Super Salad', price: 240, description: 'Organic white quinoa, sweet roasted beetroot, roasted walnuts, and orange dressing.', calories: '190 kcal', isVeg: true },
      { name: 'Nitro Cold Brew Coffee', price: 160, description: 'Slow steeped nitrogen-infused dark roast coffee with a creamy head.', calories: '5 kcal', isVeg: true },
      { name: 'Protein Peanut Butter Shake', price: 220, description: 'Blended banana, raw dark cocoa, vegan protein isolate, and creamy peanut butter.', calories: '340 kcal', isVeg: true }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedLocation, setSelectedLocation] = useState('Jaipur, Rajasthan');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLunaOpen, setIsLunaOpen] = useState(false);
  const [lunaInitialPrompt, setLunaInitialPrompt] = useState<string | undefined>(undefined);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [activeBudget, setActiveBudget] = useState<string>('$$');
  const [favorites, setFavorites] = useState<{ id: string; name: string; category: string; liked: boolean }[]>([
    { id: 'fav-1', name: 'Truffle Edamame Bowl', category: 'Healthy Bowl', liked: true },
    { id: 'fav-2', name: 'Smoked Salmon Croissant', category: 'Breakfast Cafe', liked: true },
    { id: 'fav-3', name: 'Matcha Rose Latte', category: 'Specialty Drink', liked: false },
  ]);

  interface CartItem {
    name: string;
    price: number;
    quantity: number;
    isVeg: boolean;
    calories: string;
  }

  interface Cart {
    restaurantId: string;
    restaurantName: string;
    deliveryTime: string;
    items: CartItem[];
  }

  // Unified Cart State
  const [cart, setCart] = useState<Cart | null>(() => {
    try {
      const saved = localStorage.getItem('dinegenie_cart');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Save cart to local storage
  React.useEffect(() => {
    if (cart) {
      localStorage.setItem('dinegenie_cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('dinegenie_cart');
    }
  }, [cart]);

  // Unified Orders State for Premium Orders Tracking Page
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('dinegenie_orders');
      return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
    } catch (e) {
      return DEFAULT_ORDERS;
    }
  });

  // Save orders to local storage
  React.useEffect(() => {
    localStorage.setItem('dinegenie_orders', JSON.stringify(orders));
  }, [orders]);

  const handleReorder = (restaurantName: string, items: any[], deliveryTime: string) => {
    const matched = HOME_RESTAURANTS.find(r => r.name === restaurantName);
    const restaurantId = matched ? matched.id : `rest-${Math.floor(Math.random() * 1000)}`;

    setCart({
      restaurantId,
      restaurantName,
      deliveryTime,
      items: items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        isVeg: item.isVeg !== undefined ? item.isVeg : true,
        calories: item.calories || '210 kcal'
      }))
    });

    setAppliedCoupon(null);
    setCouponFeedback(null);
    setCouponCode('');
    setIsCartOpen(true);
  };

  const handleRateOrder = (orderId: string, rating: number) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, userRating: rating } : o));
  };

  const [pendingItemToAdd, setPendingItemToAdd] = useState<{
    restaurant: { id: string; name: string; deliveryTime: string };
    item: { name: string; price: number; isVeg: boolean; calories: string };
  } | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Cart operations
  const handleAddToCart = (
    restaurant: { id: string; name: string; deliveryTime: string },
    item: { name: string; price: number; isVeg: boolean; calories: string }
  ) => {
    if (cart && cart.items.length > 0 && cart.restaurantId !== restaurant.id) {
      setPendingItemToAdd({ restaurant, item });
      return;
    }

    setCart(prev => {
      const items = prev ? [...prev.items] : [];
      const existingIdx = items.findIndex(i => i.name === item.name);
      if (existingIdx > -1) {
        items[existingIdx] = {
          ...items[existingIdx],
          quantity: items[existingIdx].quantity + 1
        };
      } else {
        items.push({
          name: item.name,
          price: item.price,
          quantity: 1,
          isVeg: item.isVeg,
          calories: item.calories
        });
      }
      return {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        deliveryTime: restaurant.deliveryTime,
        items
      };
    });

    triggerToast(`Added "${item.name}" to cart! 🛒`);
  };

  const handleDecreaseQuantity = (itemName: string) => {
    if (!cart) return;

    setCart(prev => {
      if (!prev) return null;
      const items = prev.items.map(item => {
        if (item.name === itemName) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      }).filter(item => item.quantity > 0);

      if (items.length === 0) {
        setAppliedCoupon(null);
        setCouponFeedback(null);
        setCouponCode('');
        return null;
      }

      return {
        ...prev,
        items
      };
    });
  };

  const handleIncreaseQuantity = (itemName: string) => {
    if (!cart) return;

    setCart(prev => {
      if (!prev) return null;
      const items = prev.items.map(item => {
        if (item.name === itemName) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      return {
        ...prev,
        items
      };
    });
  };

  const handleClearCart = () => {
    setCart(null);
    setAppliedCoupon(null);
    setCouponFeedback(null);
    setCouponCode('');
    triggerToast("Cart cleared.");
  };

  const handleConfirmClearAndContinue = () => {
    if (pendingItemToAdd) {
      const { restaurant, item } = pendingItemToAdd;
      setCart({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        deliveryTime: restaurant.deliveryTime,
        items: [{
          name: item.name,
          price: item.price,
          quantity: 1,
          isVeg: item.isVeg,
          calories: item.calories
        }]
      });
      setAppliedCoupon(null);
      setCouponFeedback(null);
      setCouponCode('');
      setPendingItemToAdd(null);
      triggerToast(`Cleared cart and started new order from ${restaurant.name}!`);
    }
  };

  const cartSubtotal = cart ? cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0) : 0;
  const totalCartQuantity = cart ? cart.items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  // Helper to calculate coupon discount dynamically based on current subtotal
  const getDiscountForCoupon = (coupon: Coupon | null, subtotal: number): number => {
    if (!coupon) return 0;
    if (coupon.minOrder && subtotal < coupon.minOrder) return 0;

    if (coupon.code === 'WELCOME50') {
      return Math.min(Math.round(subtotal * 0.5), 150);
    }
    if (coupon.code === 'SAVE100') {
      return 100;
    }
    if (coupon.code === 'FREEMEAL') {
      return Math.min(subtotal, 200);
    }
    return 0;
  };

  const couponDiscount = getDiscountForCoupon(appliedCoupon, cartSubtotal);

  // Recalculate and validate applied coupon whenever cart changes or subtotal changes
  React.useEffect(() => {
    if (appliedCoupon) {
      if (appliedCoupon.minOrder && cartSubtotal < appliedCoupon.minOrder) {
        setAppliedCoupon(null);
        setCouponFeedback({
          type: 'error',
          message: `Coupon "${appliedCoupon.code}" removed. Min order of ₹${appliedCoupon.minOrder} is required.`
        });
      } else {
        const discountValue = getDiscountForCoupon(appliedCoupon, cartSubtotal);
        setCouponFeedback({
          type: 'success',
          message: `Coupon "${appliedCoupon.code}" active! Discount of ₹${discountValue} applied.`
        });
      }
    }
  }, [cartSubtotal, appliedCoupon]);

  const handleApplyCoupon = (code: string) => {
    const formattedCode = code.trim().toUpperCase();
    if (!formattedCode) {
      setCouponFeedback({ type: 'error', message: 'Please enter a coupon code.' });
      return;
    }

    const coupon = COUPONS.find(c => c.code === formattedCode);
    if (!coupon) {
      setCouponFeedback({ type: 'error', message: `Coupon "${formattedCode}" is invalid.` });
      setAppliedCoupon(null);
      return;
    }

    if (appliedCoupon && appliedCoupon.code === formattedCode) {
      setCouponFeedback({
        type: 'success',
        message: `Coupon "${formattedCode}" is already active!`
      });
      return;
    }

    if (coupon.minOrder && cartSubtotal < coupon.minOrder) {
      setCouponFeedback({
        type: 'error',
        message: `Min order of ₹${coupon.minOrder} required for ${coupon.code}.`
      });
      setAppliedCoupon(null);
      return;
    }

    // Replace the previous coupon (set state to the new one)
    setAppliedCoupon(coupon);
    setCouponFeedback({
      type: 'success',
      message: `Coupon "${coupon.code}" applied successfully!`
    });
  };

  // Popular Restaurants States & Logic
  const [selectedHomeRestaurant, setSelectedHomeRestaurant] = useState<HomeRestaurant | null>(null);
  const [likedRestaurants, setLikedRestaurants] = useState<Record<string, boolean>>({
    'rest-1': true,
    'rest-4': true,
  });

  // Listen for escape key press to close home restaurant modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedHomeRestaurant(null);
      }
    };
    if (selectedHomeRestaurant) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedHomeRestaurant]);

  // Prevent body scroll when home modal is open
  React.useEffect(() => {
    if (selectedHomeRestaurant) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedHomeRestaurant]);

  const currentWeather: WeatherInfo = WEATHER_MOCK_DATA[selectedLocation] || {
    temp: 20,
    condition: "Fair",
    icon: "Sun",
    suggestion: "Explore amazing gourmet bites near you!"
  };

  const handleOpenLunaWithPrompt = (prompt: string) => {
    setLunaInitialPrompt(prompt);
    setIsLunaOpen(true);
    // Clear the prompt after a brief moment to prevent re-triggering
    setTimeout(() => {
      setLunaInitialPrompt(undefined);
    }, 100);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleOpenLunaWithPrompt(`Suggest food for: "${searchQuery}" in ${selectedLocation}`);
      setSearchQuery('');
    }
  };

  const triggerToast = (message: string) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(null), 4000);
  };

  // Weather icon renderer
  const renderWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return <Lucide.Sun className="w-6 h-6 text-amber-500 animate-spin-slow" />;
      case 'CloudSun':
        return <Lucide.CloudSun className="w-6 h-6 text-orange-400" />;
      case 'CloudRain':
        return <Lucide.CloudRain className="w-6 h-6 text-blue-400 animate-bounce" />;
      case 'Cloud':
        return <Lucide.Cloud className="w-6 h-6 text-gray-400" />;
      default:
        return <Lucide.Sun className="w-6 h-6 text-amber-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F2] text-[#1c2e24] flex select-none">
      
      {/* Sidebar Component */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenLuna={() => setIsLunaOpen(true)} 
      />

      {/* Main Panel */}
      <main className="flex-1 ml-80 min-h-screen relative flex flex-col p-8 transition-all duration-300">
        
        {/* Floating Toast Notification */}
        {showNotification && (
          <div className="fixed top-6 right-8 bg-[#1b4332] text-white px-5 py-3.5 rounded-2xl shadow-premium-lg flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top duration-300">
            <div className="w-7 h-7 bg-[#52B788] rounded-full flex items-center justify-center">
              <Lucide.Sparkle className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="text-xs font-semibold">{showNotification}</div>
          </div>
        )}

        {/* Global Action Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-[#52B788] uppercase tracking-wider bg-[#D8F3DC] px-3 py-1.5 rounded-full border border-[#B7E4C7]/40">
              ⚡ Intelligent Food System
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Shopping Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#D8F3DC]/30 border border-[#52B788]/20 rounded-2xl text-xs font-bold text-[#1b4332] shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Lucide.ShoppingCart className="w-4 h-4 text-[#52B788]" />
              <span>Cart</span>
              {totalCartQuantity > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                  {totalCartQuantity}
                </span>
              )}
            </button>

            {/* Quick Luna Chat Button */}
            <button
              onClick={() => setIsLunaOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D8F3DC] to-[#FFFDF8] hover:from-[#B7E4C7]/50 hover:to-[#D8F3DC] border border-[#52B788]/20 rounded-2xl text-xs font-bold text-[#1b4332] shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Lucide.Sparkles className="w-4 h-4 text-[#52B788] animate-pulse" />
              <span>Consult Luna</span>
            </button>

            {/* Micro Wallet Balances or Badges */}
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-2xl border border-[#B7E4C7]/10 shadow-sm">
              <span className="w-2 h-2 bg-[#52B788] rounded-full animate-ping" />
              <span className="text-[11px] font-bold text-[#5e7166]">Vibe-match Active</span>
            </div>
          </div>
        </header>

        {/* Subtle Floating Food Illustrations & Leaves in Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          {/* Floating Leaf 1 */}
          <Lucide.Leaf className="absolute text-[#52B788]/10 w-6 h-6 animate-float-slow" style={{ top: '8%', left: '15%' }} />
          {/* Floating Coffee Cup */}
          <Lucide.Coffee className="absolute text-[#52B788]/5 w-8 h-8 animate-float-diagonal" style={{ top: '25%', right: '12%' }} />
          {/* Floating Pizza slice */}
          <Lucide.Pizza className="absolute text-[#52B788]/5 w-10 h-10 animate-float-sway" style={{ top: '65%', left: '5%' }} />
          {/* Floating Cupcake / Cake */}
          <Lucide.Cake className="absolute text-[#52B788]/5 w-8 h-8 animate-float-reverse" style={{ bottom: '15%', right: '18%' }} />
          {/* Floating Sparkles */}
          <Lucide.Sparkles className="absolute text-[#52B788]/15 w-4 h-4 animate-pulse-slow" style={{ top: '45%', left: '42%' }} />
          {/* Tiny decorative leaf 2 */}
          <Lucide.Leaf className="absolute text-[#52B788]/8 w-4 h-4 animate-float-reverse" style={{ bottom: '35%', left: '20%' }} />
        </div>

        {/* Dynamic Tab Views */}
        {activeTab === 'home' && (
          <div className="space-y-12 animate-in fade-in duration-500 z-10 relative">
            
            {/* Large Hero Section */}
            <section className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#D8F3DC]/60 via-[#FFFDF8]/85 to-[#B7E4C7]/25 border border-[#B7E4C7]/30 shadow-premium p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
              
              {/* Background decorative elements */}
              <div className="absolute top-10 right-10 w-44 h-44 bg-[#52B788]/5 rounded-full blur-3xl animate-pulse-slow" />
              <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-[#B7E4C7]/10 rounded-full blur-2xl animate-pulse-slow" />

              {/* Text Area */}
              <div className="flex-1 space-y-6 z-10 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/70 backdrop-blur-md border border-[#B7E4C7]/30 rounded-full shadow-sm text-xs font-semibold text-[#2D6A4F]">
                  <Lucide.Sparkles className="w-3.5 h-3.5 text-[#52B788]" />
                  <span>DineGenie Culinary Intelligence</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-extrabold text-[#1c2e24] tracking-tight leading-[1.1] font-display">
                  What are you <br />
                  <span className="text-[#52B788] relative">
                    craving today?
                    <span className="absolute left-0 bottom-1 w-full h-1 bg-[#B7E4C7]/60 -z-10" />
                  </span>
                </h2>

                <p className="text-sm md:text-base text-[#5e7166] leading-relaxed max-w-lg">
                  Discover personalized food recommendations powered by Luma AI.
                </p>

                {/* Feature Badges */}
                <div className="flex flex-wrap gap-2.5 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/80 backdrop-blur-md border border-[#B7E4C7]/30 rounded-full text-xs font-bold text-[#1c2e24] shadow-sm select-none">
                    <span>🤖</span>
                    <span>AI Personalized</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/80 backdrop-blur-md border border-[#B7E4C7]/30 rounded-full text-xs font-bold text-[#1c2e24] shadow-sm select-none">
                    <span>⚡</span>
                    <span>Fast Delivery</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/80 backdrop-blur-md border border-[#B7E4C7]/30 rounded-full text-xs font-bold text-[#1c2e24] shadow-sm select-none">
                    <span>💚</span>
                    <span>Healthy Choices</span>
                  </span>
                </div>

                {/* Search and Settings Container */}
                <form onSubmit={handleSearchSubmit} className="space-y-4 pt-1">
                  
                  {/* Outer search container */}
                  <div className="flex flex-col sm:flex-row gap-3 bg-white p-2.5 rounded-[24px] shadow-premium-lg border border-[#B7E4C7]/20 max-w-xl">
                    
                    {/* Location Selector */}
                    <div className="flex items-center gap-2 px-3.5 py-2 hover:bg-[#F8F5F2] rounded-xl transition-all border-r border-[#B7E4C7]/20 shrink-0 select-none relative group cursor-pointer">
                      <Lucide.MapPin className="w-4 h-4 text-[#52B788] animate-bounce" />
                      <select
                        value={selectedLocation}
                        onChange={(e) => {
                          setSelectedLocation(e.target.value);
                          triggerToast(`Switched GPS location to ${e.target.value}`);
                        }}
                        className="bg-transparent text-xs font-bold text-[#1c2e24] focus:outline-none pr-1 cursor-pointer appearance-none font-display"
                      >
                        {LOCATIONS.map((loc) => (
                          <option key={loc} value={loc} className="text-[#1c2e24] bg-white">
                            📍 {loc.split(',')[0]}
                          </option>
                        ))}
                      </select>
                      <Lucide.ChevronDown className="w-3 h-3 text-[#5e7166]" />
                    </div>

                    {/* Search Field */}
                    <div className="flex-1 flex items-center gap-2 px-2">
                      <Lucide.Search className="w-4.5 h-4.5 text-[#8fa395]" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search restaurants, cuisines or dishes..."
                        className="w-full bg-transparent border-none text-xs text-[#1c2e24] focus:outline-none placeholder-[#8fa395]"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#52B788] hover:bg-[#40916C] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#52B788]/10 hover:shadow-[#52B788]/20 flex items-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <span>Find Food</span>
                      <Lucide.ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>

                {/* Extra Quick Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => triggerToast("Exploring gourmet neighborhood restaurants...")}
                    className="px-5 py-3 bg-white hover:bg-[#D8F3DC] border border-[#B7E4C7]/40 rounded-2xl text-xs font-bold text-[#1c2e24] transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Lucide.Compass className="w-4 h-4 text-[#52B788]" />
                    <span>Explore Restaurants</span>
                  </button>
                  
                  {/* Weather Info Widget */}
                  <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-white/55 backdrop-blur-md rounded-2xl border border-[#B7E4C7]/20 shadow-sm">
                    {renderWeatherIcon(currentWeather.icon)}
                    <div className="text-left">
                      <div className="text-xs font-bold text-[#1c2e24]">
                        {currentWeather.temp}°C • <span className="text-[#52B788]">{currentWeather.condition}</span>
                      </div>
                      <p className="text-[10px] text-[#5e7166] max-w-xs truncate md:max-w-md">
                        {currentWeather.suggestion}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Illustration Area with multiple Absolute Floating Cards */}
              <div className="w-full md:w-96 shrink-0 z-10 flex items-center justify-center relative py-6">
                
                {/* Outer decorative ring */}
                <div className="absolute w-[290px] h-[290px] border border-dashed border-[#B7E4C7]/40 rounded-full animate-spin-slow pointer-events-none" style={{ animationDuration: '45s' }} />

                {/* Float elements animation wrapper */}
                <div className="relative w-72 h-72 rounded-[40px] overflow-hidden border-4 border-white shadow-premium-lg z-10">
                  <img
                    src="/src/assets/images/indian_gourmet_feast_1783344423822.jpg"
                    alt="Authentic Premium Indian Feast"
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* 1. 🔥 Trending Today */}
                <div className="absolute -top-3 -left-12 bg-white/80 backdrop-blur-md border border-orange-200 rounded-full px-3.5 py-1.5 shadow-premium animate-float-slow flex items-center gap-1.5 z-20">
                  <span className="text-sm">🔥</span>
                  <span className="text-[10px] font-extrabold text-orange-800 tracking-tight">Trending Today</span>
                </div>

                {/* 2. ⭐ AI Pick */}
                <div className="absolute -top-7 right-2 bg-gradient-to-r from-yellow-50 to-amber-50/95 backdrop-blur-md border border-amber-200 rounded-full px-3.5 py-1.5 shadow-premium animate-float-reverse flex items-center gap-1.5 z-20">
                  <span className="text-xs">⭐</span>
                  <span className="text-[10px] font-extrabold text-amber-800 tracking-tight">AI Pick</span>
                </div>

                {/* 3. 🥗 Healthy Choice */}
                <div className="absolute top-28 -left-16 bg-[#FFFDF8]/80 backdrop-blur-md border border-[#B7E4C7]/50 rounded-full px-3.5 py-1.5 shadow-premium animate-float-diagonal flex items-center gap-1.5 z-20">
                  <span className="text-sm">🥗</span>
                  <span className="text-[10px] font-extrabold text-[#2D6A4F] tracking-tight">Healthy Choice</span>
                </div>

                {/* 4. ⚡ Fast Delivery */}
                <div className="absolute top-36 -right-12 bg-white/80 backdrop-blur-md border border-sky-200 rounded-full px-3.5 py-1.5 shadow-premium animate-float-sway flex items-center gap-1.5 z-20">
                  <span className="text-sm">⚡</span>
                  <span className="text-[10px] font-extrabold text-sky-800 tracking-tight">Fast Delivery</span>
                </div>

                {/* 5. 💚 Low Calories */}
                <div className="absolute -bottom-4 left-6 bg-emerald-50/90 backdrop-blur-md border border-emerald-200 rounded-full px-3.5 py-1.5 shadow-premium animate-float-slow flex items-center gap-1.5 z-20">
                  <span className="text-xs">💚</span>
                  <span className="text-[10px] font-extrabold text-emerald-800 tracking-tight">Low Calories</span>
                </div>
              </div>

            </section>

            {/* 🍽 Popular Restaurants Near You Section */}
            <section id="popular-restaurants-section" className="space-y-6 text-left py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#1c2e24] font-display flex items-center gap-2">
                    <span>🍽</span>
                    <span>Popular Restaurants <span className="text-[#52B788]">Near You</span></span>
                  </h3>
                  <p className="text-xs text-[#5e7166]">
                    Highly rated gourmet culinary options in your local neighborhood.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D8F3DC] text-[#2D6A4F] text-[10px] font-extrabold rounded-full border border-[#B7E4C7]/30 select-none self-start sm:self-auto">
                  <span className="w-1.5 h-1.5 bg-[#52B788] rounded-full animate-ping" />
                  <span>8 Premium Spots</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {HOME_RESTAURANTS.map((rest) => {
                  const isLiked = likedRestaurants[rest.id] || false;
                  return (
                    <div
                      key={rest.id}
                      id={`home-rest-card-${rest.id}`}
                      className="bg-white border border-[#B7E4C7]/20 rounded-[32px] overflow-hidden shadow-premium hover:shadow-premium-lg transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
                    >
                      {/* Image container */}
                      <div className="relative h-44 bg-gray-100 overflow-hidden">
                        <img
                          src={rest.image}
                          alt={rest.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        {/* Open/Closed badge & Favorite button */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          {rest.isOpen ? (
                            <span className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                              Open
                            </span>
                          ) : (
                            <span className="bg-gray-400 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                              Closed
                            </span>
                          )}
                        </div>

                        {/* Favorite Heart Button */}
                        <button
                          type="button"
                          id={`btn-fav-home-${rest.id}`}
                          onClick={() => {
                            setLikedRestaurants(prev => {
                              const updated = { ...prev, [rest.id]: !prev[rest.id] };
                              triggerToast(updated[rest.id] ? `Added ${rest.name} to favorites!` : `Removed ${rest.name} from favorites`);
                              return updated;
                            });
                          }}
                          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-md hover:bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          <Lucide.Heart className={`w-4 h-4 ${isLiked ? 'text-rose-500 fill-rose-500' : 'text-gray-400'}`} />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-1.5">
                            <h4 className="font-extrabold text-base text-[#1c2e24] truncate">
                              {rest.name}
                            </h4>
                            <div className="flex items-center text-amber-500 font-bold text-xs shrink-0 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                              ★ {rest.rating}
                            </div>
                          </div>

                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                            {rest.cuisine} • {rest.priceLevel}
                          </p>

                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#5e7166] pt-1">
                            <Lucide.Clock className="w-3.5 h-3.5 text-[#52B788]" />
                            <span>{rest.deliveryTime} Delivery</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          id={`btn-menu-home-${rest.id}`}
                          onClick={() => setSelectedHomeRestaurant(rest)}
                          className="w-full py-2.5 bg-[#D8F3DC] hover:bg-[#B7E4C7] text-[#1b4332] text-xs font-black rounded-2xl transition-all border border-[#B7E4C7]/30 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Lucide.UtensilsCrossed className="w-3.5 h-3.5" />
                          <span>View Menu</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Premium Statistics Ribbon */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-gradient-to-r from-white via-[#D8F3DC]/15 to-white border border-[#B7E4C7]/30 rounded-[28px] shadow-sm relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-[#52B788]/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -left-6 -top-6 w-36 h-36 bg-[#B7E4C7]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="text-center relative z-10 p-2 group hover:scale-105 transition-transform duration-300">
                <div className="text-3xl md:text-4xl font-black text-[#1b4332] font-display tracking-tight group-hover:text-[#52B788] transition-colors">50K+</div>
                <div className="text-[10px] font-extrabold text-[#5e7166] uppercase tracking-wider mt-1">Happy Customers</div>
              </div>
              <div className="text-center relative z-10 p-2 border-l border-[#B7E4C7]/25 group hover:scale-105 transition-transform duration-300">
                <div className="text-3xl md:text-4xl font-black text-[#1b4332] font-display tracking-tight group-hover:text-[#52B788] transition-colors">500+</div>
                <div className="text-[10px] font-extrabold text-[#5e7166] uppercase tracking-wider mt-1">Partner Restaurants</div>
              </div>
              <div className="text-center relative z-10 p-2 border-l border-[#B7E4C7]/25 group hover:scale-105 transition-transform duration-300">
                <div className="text-3xl md:text-4xl font-black text-[#1b4332] font-display tracking-tight group-hover:text-[#52B788] transition-colors">100K+</div>
                <div className="text-[10px] font-extrabold text-[#5e7166] uppercase tracking-wider mt-1">Orders Delivered</div>
              </div>
              <div className="text-center relative z-10 p-2 border-l border-[#B7E4C7]/25 group hover:scale-105 transition-transform duration-300">
                <div className="text-3xl md:text-4xl font-black text-[#1b4332] font-display tracking-tight group-hover:text-[#52B788] transition-colors">4.9★</div>
                <div className="text-[10px] font-extrabold text-[#5e7166] uppercase tracking-wider mt-1">Customer Rating</div>
              </div>
            </div>

            {/* Dribbble Premium Bento Grid */}
            <section className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#1c2e24] tracking-tight font-display flex items-center gap-2">
                    <Lucide.Sparkles className="w-5 h-5 text-[#52B788]" />
                    <span>DineGenie Culinary <span className="text-[#52B788]">Bento Matrix</span></span>
                  </h3>
                  <p className="text-xs text-[#5e7166]">
                    Your personalized culinary universe, coordinated in real-time by Luna.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1 bg-[#D8F3DC] text-[#2D6A4F] text-[10px] font-extrabold px-3 py-1.5 rounded-full border border-[#B7E4C7]/30 select-none">
                  <span className="w-1.5 h-1.5 bg-[#52B788] rounded-full animate-ping" />
                  <span>Interactive Hub</span>
                </div>
              </div>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 🌤 Card 1: Today's Weather */}
                <div className="p-6 rounded-[32px] border border-white/60 bg-white/40 backdrop-blur-md bg-gradient-to-br from-[#D8F3DC]/30 via-white/45 to-amber-50/20 shadow-premium-lg hover:shadow-premium-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group h-64 relative overflow-hidden text-left">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-200/20 to-transparent rounded-full blur-xl pointer-events-none" />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold text-[#2D6A4F] uppercase tracking-wider bg-[#D8F3DC]/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-[#B7E4C7]/30 flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        🌤 Weather Matrix
                      </span>
                      <Lucide.Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />
                    </div>

                    <div className="flex items-baseline gap-2 mt-1">
                      <h4 className="text-xl font-black text-[#1c2e24] font-display flex items-center gap-1">
                        <span>☀ Jaipur</span>
                      </h4>
                      <span className="text-sm font-extrabold text-[#52B788]">32°C</span>
                      <span className="text-xs text-[#5e7166] font-semibold bg-[#FFFDF8] border border-[#B7E4C7]/20 px-1.5 py-0.5 rounded-md">Sunny</span>
                    </div>

                    {/* Recommended Today Section */}
                    <div className="mt-3 bg-white/60 backdrop-blur-sm p-2.5 rounded-2xl border border-white/60 shadow-sm">
                      <div className="text-[9px] font-extrabold uppercase tracking-wider text-[#2D6A4F] mb-1.5 flex items-center gap-1">
                        <Lucide.UtensilsCrossed className="w-3.5 h-3.5 text-[#52B788]" />
                        <span>Recommended Today</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            triggerToast("Adding fresh 🥭 Mango Shake to order queue...");
                            handleOpenLunaWithPrompt("I want to order a premium Jaipur-style Mango Shake. Draft an order for me!");
                          }}
                          className="flex items-center justify-between px-2 py-1 hover:bg-[#D8F3DC]/40 rounded-lg text-[10px] font-bold text-[#1c2e24] transition-all cursor-pointer text-left w-full"
                        >
                          <span>🥭 Mango Shake</span>
                          <span className="text-[9px] text-[#52B788] font-extrabold">Order ✦</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            triggerToast("Adding organic 🥗 Fresh Salad to order queue...");
                            handleOpenLunaWithPrompt("Draft an order for a crisp, organic Fresh Salad made with local baby greens.");
                          }}
                          className="flex items-center justify-between px-2 py-1 hover:bg-[#D8F3DC]/40 rounded-lg text-[10px] font-bold text-[#1c2e24] transition-all cursor-pointer text-left w-full"
                        >
                          <span>🥗 Fresh Salad</span>
                          <span className="text-[9px] text-[#52B788] font-extrabold">Order ✦</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            triggerToast("Adding whipped 🍹 Cold Coffee to order queue...");
                            handleOpenLunaWithPrompt("Order a rich whipped Cold Coffee to beat the warm sunny weather.");
                          }}
                          className="flex items-center justify-between px-2 py-1 hover:bg-[#D8F3DC]/40 rounded-lg text-[10px] font-bold text-[#1c2e24] transition-all cursor-pointer text-left w-full"
                        >
                          <span>🍹 Cold Coffee</span>
                          <span className="text-[9px] text-[#52B788] font-extrabold">Order ✦</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-[9px] text-[#5e7166] font-semibold flex items-center justify-between mt-1">
                    <span>GPS synced • Real-time</span>
                    <button
                      type="button"
                      onClick={() => triggerToast("Current location Jaipur selected as gourmet anchor.")}
                      className="text-[#52B788] hover:underline cursor-pointer"
                    >
                      Jaipur, IN 📌
                    </button>
                  </div>
                </div>

                {/* 😊 Card 2: Interactive Mood Selector */}
                <div className="p-6 rounded-[32px] border border-[#B7E4C7]/30 bg-gradient-to-br from-[#FFFDF8] to-[#F8F5F2] shadow-premium hover:shadow-premium-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group h-64 relative overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-extrabold text-[#2D6A4F] uppercase tracking-wider bg-[#D8F3DC] px-2.5 py-1 rounded-full border border-[#B7E4C7]/20">
                        😊 Mindset Food Match
                      </span>
                      <Lucide.Smile className="w-5 h-5 text-[#52B788] group-hover:rotate-12 transition-transform" />
                    </div>
                    <h4 className="text-base font-extrabold text-[#1c2e24] font-display">How is your vibe today?</h4>
                    <p className="text-[11px] text-[#5e7166] mt-1 leading-snug">Tap a mood to prompt Luna instantly:</p>
                    
                    {/* Compact Mood Selector pills */}
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {MOODS.slice(0, 4).map((mood) => (
                        <button
                          key={mood.id}
                          type="button"
                          onClick={() => {
                            triggerToast(`Consulting Luna for "${mood.label}"...`);
                            handleOpenLunaWithPrompt(`I am feeling in a "${mood.label}" mood ${mood.emoji} right now. Suggest some premium food matching this vibe!`);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-[#B7E4C7]/25 rounded-xl text-[10px] font-bold text-[#1c2e24] hover:bg-[#D8F3DC] hover:border-[#52B788] transition-all cursor-pointer"
                        >
                          <span>{mood.emoji}</span>
                          <span className="truncate">{mood.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-[9px] text-[#52B788] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span>⚡ Coordinates with Luna</span>
                  </div>
                </div>

                {/* 💰 Card 3: Interactive Budget Index */}
                <div className="p-6 rounded-[32px] border border-[#B7E4C7]/30 bg-gradient-to-br from-[#FFFDF8] via-[#FFFDF8]/40 to-white shadow-premium hover:shadow-premium-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group h-64 relative overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-extrabold text-[#2D6A4F] uppercase tracking-wider bg-[#D8F3DC] px-2.5 py-1 rounded-full border border-[#B7E4C7]/20">
                        💰 Smart Budget Index
                      </span>
                      <Lucide.Wallet className="w-5 h-5 text-[#52B788]" />
                    </div>
                    <h4 className="text-base font-extrabold text-[#1c2e24] font-display">Select Gourmet Budget</h4>
                    
                    {/* Interactive Selector */}
                    <div className="flex gap-2 mt-4 bg-[#F8F5F2] p-1 rounded-2xl border border-[#B7E4C7]/20">
                      {['$', '$$', '$$$'].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => {
                            setActiveBudget(lvl);
                            triggerToast(`Budget adjusted to ${lvl}`);
                          }}
                          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                            activeBudget === lvl 
                              ? 'bg-[#52B788] text-white shadow-md' 
                              : 'text-[#5e7166] hover:bg-[#D8F3DC]/40'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>

                    {/* Dynamic text based on selection */}
                    <p className="text-[11px] text-[#5e7166] mt-3 italic leading-relaxed">
                      {activeBudget === '$' && "🌱 Smart saver: unlocks 120+ local sustainable organic cafes & quick bites."}
                      {activeBudget === '$$' && "🍽️ Mid-tier boutique: access 42 culinary studios, bistro bars, and daily farm-to-table menus."}
                      {activeBudget === '$$$' && "✨ Premium Chef tier: coordinates with 14 ultra-premium private kitchens & boutique micro-kitchens."}
                    </p>
                  </div>
                  
                  <div className="text-[9px] text-[#5e7166] font-semibold">
                    Estimated delivery: <span className="font-bold text-[#52B788]">15 - 28 mins</span>
                  </div>
                </div>

                {/* 🎲 Card 4: Surprise Me */}
                <div className="p-6 rounded-[32px] border border-[#B7E4C7]/30 bg-gradient-to-br from-[#FFFDF8] to-[#D8F3DC]/10 shadow-premium hover:shadow-premium-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group h-64 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#52B788]/10 to-transparent rounded-full blur-lg pointer-events-none" />
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-extrabold text-[#2D6A4F] uppercase tracking-wider bg-[#D8F3DC] px-2.5 py-1 rounded-full border border-[#B7E4C7]/20">
                        🎲 Culinary Roulette
                      </span>
                      <Lucide.Dices className="w-5 h-5 text-[#52B788] group-hover:rotate-45 transition-transform duration-500" />
                    </div>
                    <h4 className="text-base font-extrabold text-[#1c2e24] font-display">Can't decide on flavor?</h4>
                    <p className="text-xs text-[#5e7166] mt-1 leading-relaxed">
                      Let our neural gastronomy system spin a custom recommendation for your taste buds instantly.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const dishes = [
                        'Taj Palace’s Paneer Butter Masala & Garlic Naan 🍛',
                        'Artisanal Woodfired Truffle Mushroom Pizza 🍕',
                        'Boutique Kitchen Saffron Pistachio Kulfi 🍨',
                        'Premium Truffle Edamame Dumplings 🥟',
                        'Slow-dripped Nitro Cold Brew Coffee ☕'
                      ];
                      const randomDish = dishes[Math.floor(Math.random() * dishes.length)];
                      triggerToast(`🎲 Luna selected: ${randomDish}!`);
                      handleOpenLunaWithPrompt(`Suggest a full meal order featuring: ${randomDish}`);
                    }}
                    className="w-full py-3 bg-[#52B788] hover:bg-[#40916C] text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-[#52B788]/10 flex items-center justify-center gap-2 group-hover:scale-[1.02] cursor-pointer"
                  >
                    <Lucide.Shuffle className="w-4 h-4 animate-pulse" />
                    <span>Surprise Me!</span>
                  </button>
                </div>

                {/* 🍽 Card 5: Chef Recommended (Paneer Butter Masala) */}
                <div className="p-6 rounded-[32px] border border-[#B7E4C7]/30 bg-gradient-to-br from-[#FFFDF8] to-[#D8F3DC]/20 shadow-premium hover:shadow-premium-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group h-64 relative overflow-hidden text-left">
                  {/* Glowing Match Indicator */}
                  <div className="absolute -right-12 -top-12 w-28 h-28 bg-[#52B788]/10 rounded-full blur-xl pointer-events-none" />
                  
                  <div>
                    {/* Header with Match & Stars */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-extrabold text-[#2D6A4F] uppercase tracking-wider bg-[#D8F3DC] px-2.5 py-1 rounded-full border border-[#B7E4C7]/30 flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#52B788] animate-ping" />
                        ✨ 97% AI Match
                      </span>
                      <div className="flex items-center text-amber-500 text-xs tracking-tight select-none">
                        ★★★★☆
                      </div>
                    </div>

                    {/* Title & Price */}
                    <div className="flex items-start justify-between gap-1.5">
                      <h4 className="text-sm md:text-base font-black text-[#1c2e24] font-display flex items-center gap-1.5">
                        <span>🍛 Paneer Butter Masala</span>
                      </h4>
                      <span className="text-xs font-black text-[#2D6A4F] bg-white border border-[#B7E4C7]/40 px-2 py-0.5 rounded-lg shrink-0 shadow-sm">
                        ₹299
                      </span>
                    </div>

                    {/* Duration and Meta Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[10px] font-semibold text-[#5e7166] bg-[#F8F5F2] px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Lucide.Clock className="w-3 h-3 text-[#52B788]" />
                        28 mins
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/60 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                        💚 Healthy
                      </span>
                      <span className="text-[10px] font-extrabold text-orange-800 bg-orange-100/60 border border-orange-200 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                        🔥 Trending
                      </span>
                    </div>

                    {/* Why Luna picked this Explanation */}
                    <div className="mt-3.5 bg-white/70 backdrop-blur-sm p-2 rounded-2xl border border-[#B7E4C7]/20">
                      <div className="text-[9px] font-extrabold uppercase tracking-wider text-[#52B788] flex items-center gap-1">
                        <Lucide.Sparkles className="w-2.5 h-2.5" />
                        Why Luna picked this
                      </div>
                      <p className="text-[11px] text-[#1c2e24] font-semibold mt-0.5 italic">
                        "Perfect for today's weather"
                      </p>
                    </div>
                  </div>

                  {/* Consult action button */}
                  <div className="pt-2 border-t border-[#B7E4C7]/15 flex items-center justify-between">
                    <span className="text-[9px] text-[#5e7166] font-semibold">Fresh artisan ingredients</span>
                    <button
                      type="button"
                      onClick={() => handleOpenLunaWithPrompt("Tell me more about the ₹299 Paneer Butter Masala, including its nutritional facts and why it suits the current weather!")}
                      className="px-3 py-1.5 bg-[#52B788] hover:bg-[#40916C] text-white text-[10px] font-bold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      Order with Luna
                    </button>
                  </div>
                </div>

                {/* ❤️ Card 6: Favorites */}
                <div className="p-6 rounded-[32px] border border-[#B7E4C7]/30 bg-gradient-to-br from-white to-[#FFFDF8] shadow-premium hover:shadow-premium-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group h-64 relative overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-extrabold text-[#2D6A4F] uppercase tracking-wider bg-[#D8F3DC] px-2.5 py-1 rounded-full border border-[#B7E4C7]/20">
                        ❤️ Saved Favorites
                      </span>
                      <Lucide.Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                    </div>
                    <h4 className="text-xs font-extrabold text-[#1c2e24] mb-2 font-display">Your VIP Dishes</h4>
                    
                    {/* Favorites list */}
                    <div className="space-y-2">
                      {favorites.map((fav) => (
                        <div key={fav.id} className="flex items-center justify-between bg-[#F8F5F2] px-3 py-1.5 rounded-xl border border-[#B7E4C7]/15">
                          <div className="text-left overflow-hidden pr-2">
                            <div className="text-[10px] font-extrabold text-[#1c2e24] truncate">{fav.name}</div>
                            <div className="text-[8px] text-[#5e7166]">{fav.category}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = favorites.map(f => f.id === fav.id ? { ...f, liked: !f.liked } : f);
                              setFavorites(updated);
                              triggerToast(fav.liked ? `Removed ${fav.name} from favorites` : `Added ${fav.name} to favorites!`);
                            }}
                            className="p-1 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                          >
                            <Lucide.Heart className={`w-3.5 h-3.5 ${fav.liked ? 'text-rose-500 fill-rose-500' : 'text-gray-300'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[9px] text-[#5e7166] text-right font-medium">
                    Luna sync active
                  </div>
                </div>

              </div>
            </section>

            {/* Mood Selection Section */}
            <section className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#1c2e24] font-display">
                    Full Culinary <span className="text-[#52B788]">Mood Archetypes</span>
                  </h3>
                  <p className="text-xs text-[#5e7166]">
                    Select any archetype to direct Luna to coordinate localized gourmet pairings instantly.
                  </p>
                </div>
                <div className="inline-flex gap-1.5 p-1 bg-[#F8F5F2] border border-[#B7E4C7]/20 rounded-xl shrink-0 self-start sm:self-center">
                  <span className="text-[10px] font-bold text-[#52B788] px-3 py-1 bg-[#D8F3DC] rounded-lg">
                    8 Mood Settings
                  </span>
                </div>
              </div>

              {/* Mood Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => {
                      triggerToast(`Consulting Luna for "${mood.label}" mood...`);
                      handleOpenLunaWithPrompt(`I am feeling in a "${mood.label}" mood (${mood.emoji}) right now. What should I order from DineGenie?`);
                    }}
                    className={`text-left rounded-[24px] p-5 border border-[#B7E4C7]/20 bg-gradient-to-br ${mood.gradient} hover:shadow-premium-lg transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between h-48 group`}
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-md flex items-center justify-center text-2xl shadow-sm border border-white group-hover:scale-110 transition-transform duration-300">
                        {mood.emoji}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base text-[#1c2e24] group-hover:text-[#2D6A4F] transition-colors font-display">
                          {mood.label}
                        </h4>
                        <p className="text-xs text-[#5e7166] mt-1 line-clamp-3 leading-relaxed">
                          {mood.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] font-bold text-[#52B788] uppercase tracking-wider">
                        Select Mood
                      </span>
                      <div className="w-6 h-6 rounded-lg bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Lucide.ChevronRight className="w-3.5 h-3.5 text-[#52B788]" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

          </div>
        )}

        {activeTab === 'ai-recommendations' && (
          <AIRecommendations
            onOpenLunaWithPrompt={handleOpenLunaWithPrompt}
            triggerToast={triggerToast}
          />
        )}

        {activeTab === 'monthly-dashboard' && (
          <MonthlyDashboard
            triggerToast={triggerToast}
          />
        )}

        {activeTab === 'nutrition' && (
          <AINutritionDashboard
            onOpenLunaWithPrompt={handleOpenLunaWithPrompt}
            triggerToast={triggerToast}
          />
        )}

        {activeTab === 'restaurants' && (
          <Restaurants
            onOpenLunaWithPrompt={handleOpenLunaWithPrompt}
            triggerToast={triggerToast}
            cart={cart}
            onAddToCart={handleAddToCart}
            onDecreaseQuantity={handleDecreaseQuantity}
            onOpenCartDrawer={() => setIsCartOpen(true)}
          />
        )}

        {activeTab === 'meal-planner' && (
          <AIMealPlanner
            onOpenLunaWithPrompt={handleOpenLunaWithPrompt}
            triggerToast={triggerToast}
          />
        )}

        {activeTab === 'orders' && (
          <Orders
            orders={orders}
            onReorder={handleReorder}
            onRateOrder={handleRateOrder}
            triggerToast={triggerToast}
            onOpenLunaWithPrompt={handleOpenLunaWithPrompt}
          />
        )}

        {/* Other Tab Views (Beautiful placeholders that fit guidelines) */}
        {activeTab !== 'home' && activeTab !== 'ai-recommendations' && activeTab !== 'monthly-dashboard' && activeTab !== 'nutrition' && activeTab !== 'restaurants' && activeTab !== 'meal-planner' && activeTab !== 'orders' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-12 space-y-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-[#D8F3DC] rounded-[24px] flex items-center justify-center text-[#52B788] shadow-sm">
              <Lucide.Sparkles className="w-8 h-8 animate-pulse-slow" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#1c2e24] capitalize font-display">
                {activeTab.replace('-', ' ')}
              </h2>
              <p className="text-sm text-[#5e7166] leading-relaxed">
                Our DineGenie AI is currently curating this space with boutique chefs, local kitchens, and customized meal prep schedules.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#B7E4C7]/20 rounded-[24px] shadow-premium w-full">
              <p className="text-xs text-[#5e7166] mb-4">
                💡 **Genie Advice:** You can ask our live Luna for any nutrition tips, restaurant suggestions, or recipe mockups for this section right now!
              </p>
              <button
                onClick={() => handleOpenLunaWithPrompt(`Let's discuss something about the "${activeTab.replace('-', ' ')}" feature!`)}
                className="px-5 py-2.5 bg-[#52B788] hover:bg-[#40916C] text-white text-xs font-bold rounded-xl transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <Lucide.Sparkles className="w-4 h-4" />
                <span>Ask Luna</span>
              </button>
            </div>

            <button
              onClick={() => setActiveTab('home')}
              className="text-xs font-bold text-[#52B788] hover:underline flex items-center gap-1"
            >
              ← Back to Dining Dashboard
            </button>
          </div>
        )}

        {/* Global Footer */}
        <footer className="mt-auto pt-16 border-t border-[#B7E4C7]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8fa395]">
          <div>
            &copy; {new Date().getFullYear()} DineGenie Technologies. Every Bite, Intelligently Chosen.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => triggerToast("Privacy & terms loaded.")} className="hover:text-[#52B788] transition-colors">Privacy</button>
            <span>•</span>
            <button onClick={() => triggerToast("DineGenie service guidelines loaded.")} className="hover:text-[#52B788] transition-colors">Terms of Use</button>
            <span>•</span>
            <span className="text-[#52B788] font-bold">Secure AI Sandbox</span>
          </div>
        </footer>

      </main>

      {/* Luna Drawer Panel */}
      <Luna
        isOpen={isLunaOpen}
        onClose={() => setIsLunaOpen(false)}
        initialMessageText={lunaInitialPrompt}
        onAddToCart={handleAddToCart}
        triggerToast={triggerToast}
      />

      {/* Detail Menu Modal (Popup) */}
      <AnimatePresence>
        {selectedHomeRestaurant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedHomeRestaurant(null);
              }
            }}
            className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-[#FFFDF8] border border-[#B7E4C7]/40 rounded-[32px] max-w-2xl w-full shadow-premium-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Upper Image */}
              <div className="relative h-48 bg-gray-200 shrink-0">
                <img
                  src={selectedHomeRestaurant.image}
                  alt={selectedHomeRestaurant.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => setSelectedHomeRestaurant(null)}
                  className="absolute top-4 right-4 w-9 h-9 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center text-[#5e7166] hover:text-[#1c2e24] shadow-md transition-colors cursor-pointer z-10"
                >
                  <Lucide.X className="w-5 h-5" />
                </button>

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-6">
                  <div className="text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#D8F3DC] bg-emerald-800/40 px-2.5 py-1 rounded-md border border-white/10 select-none">
                      📍 {selectedHomeRestaurant.address}
                    </span>
                    <h3 className="text-2xl font-black text-white font-display mt-2">{selectedHomeRestaurant.name}</h3>
                    <p className="text-xs text-[#D8F3DC] mt-0.5 font-medium">{selectedHomeRestaurant.cuisine} • Rating ★{selectedHomeRestaurant.rating} • Price {selectedHomeRestaurant.priceLevel}</p>
                  </div>
                </div>
              </div>

              {/* Modal Menu Body (Scrollable) */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-left">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-[#1c2e24] uppercase tracking-wider flex items-center gap-1.5">
                    <Lucide.MenuSquare className="w-4 h-4 text-[#52B788]" />
                    <span>DineGenie Curated Menu</span>
                  </h4>
                  <span className="text-[10px] text-gray-400 font-bold">Prices exclude taxes & deliveries</span>
                </div>

                <div className="space-y-4">
                  {selectedHomeRestaurant.menuItems.map((item, idx) => {
                    const quantity = (cart && cart.restaurantId === selectedHomeRestaurant.id)
                      ? (cart.items.find(i => i.name === item.name)?.quantity || 0)
                      : 0;
                    return (
                      <div
                        key={idx}
                        className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-sm hover:border-[#52B788]/20 transition-all flex justify-between items-stretch gap-4"
                      >
                        {/* Item Details */}
                        <div className="flex-1 space-y-2 flex flex-col justify-between">
                          <div className="space-y-1 text-left">
                            <div className="flex items-center gap-1.5">
                              {item.isVeg ? (
                                <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-200">🟢 Veg</span>
                              ) : (
                                <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-200">🔴 Non-Veg</span>
                              )}
                              <span className="text-[10px] bg-gray-50 px-1.5 py-0.5 rounded border text-gray-400 font-bold">{item.calories}</span>
                            </div>
                            <h5 className="font-extrabold text-sm text-[#1c2e24]">{item.name}</h5>
                            <p className="text-[11px] text-[#5e7166] leading-relaxed font-semibold">{item.description}</p>
                          </div>
                          
                          <span className="text-base font-black text-[#1b4332] block">₹{item.price}</span>
                        </div>

                        {/* Interactive Add Counter button */}
                        <div className="flex flex-col justify-center items-center shrink-0 w-24">
                          {quantity > 0 ? (
                            <div className="flex items-center gap-2.5 bg-[#D8F3DC] border border-[#B7E4C7] p-1.5 rounded-xl w-full justify-between">
                              <button
                                type="button"
                                onClick={() => handleDecreaseQuantity(item.name)}
                                className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-[#1b4332] font-black text-xs hover:bg-[#B7E4C7] transition-colors cursor-pointer"
                              >
                                -
                              </button>
                              <span className="text-xs font-black text-[#1b4332]">{quantity}</span>
                              <button
                                type="button"
                                onClick={() => handleAddToCart(
                                  { id: selectedHomeRestaurant.id, name: selectedHomeRestaurant.name, deliveryTime: selectedHomeRestaurant.deliveryTime },
                                  { name: item.name, price: item.price, isVeg: item.isVeg, calories: item.calories }
                                )}
                                className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-[#1b4332] font-black text-xs hover:bg-[#B7E4C7] transition-colors cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAddToCart(
                                { id: selectedHomeRestaurant.id, name: selectedHomeRestaurant.name, deliveryTime: selectedHomeRestaurant.deliveryTime },
                                { name: item.name, price: item.price, isVeg: item.isVeg, calories: item.calories }
                              )}
                              className="w-full py-2 bg-[#52B788] hover:bg-[#40916C] text-white text-xs font-extrabold rounded-xl transition-all shadow-sm cursor-pointer active:scale-95 text-center"
                            >
                              Add To Cart
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer / Summary calculations */}
              <div className="p-6 bg-white border-t border-gray-100 shrink-0 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                <div className="text-left">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Subtotal Summary</span>
                  <div className="text-xl font-black text-[#1b4332] font-display">
                    ₹{(cart && cart.restaurantId === selectedHomeRestaurant.id) ? cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0) : 0}
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      const itemsStr = cart && cart.restaurantId === selectedHomeRestaurant.id
                        ? cart.items.map(i => `[${i.quantity}x] ${i.name}`).join(', ')
                        : '';
                      handleOpenLunaWithPrompt(`Please write a luxury food evaluation and diet recommendation for ordering these dishes at "${selectedHomeRestaurant.name}": ${itemsStr}.`);
                      triggerToast("Opened Luna diet consult!");
                    }}
                    className="px-4 py-3 bg-[#D8F3DC] text-[#2D6A4F] text-xs font-extrabold rounded-xl border border-[#B7E4C7]/50 transition-all cursor-pointer hover:bg-[#B7E4C7]/60 active:scale-95 flex items-center gap-1.5"
                  >
                    <Lucide.Sparkles className="w-3.5 h-3.5 text-[#52B788]" />
                    <span>Diet Consult</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(true);
                      setSelectedHomeRestaurant(null);
                    }}
                    disabled={!(cart && cart.restaurantId === selectedHomeRestaurant.id && cart.items.length > 0)}
                    className={`px-6 py-3 text-white text-xs font-extrabold rounded-xl transition-all shadow-sm cursor-pointer active:scale-95 text-center flex items-center gap-1.5 ${!(cart && cart.restaurantId === selectedHomeRestaurant.id && cart.items.length > 0) ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-[#52B788] hover:bg-[#40916C]'}`}
                  >
                    <Lucide.ShoppingCart className="w-3.5 h-3.5" />
                    <span>View Cart</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🛒 Upgraded Smart Cart Drawer Panel */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity"
            />

            {/* Slide-over Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-[#FFFDF8] h-full shadow-premium-xl flex flex-col z-10 border-l border-[#B7E4C7]/30"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#B7E4C7]/20 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gradient-to-tr from-[#52B788] to-[#B7E4C7] rounded-xl flex items-center justify-center text-white shadow-sm">
                    <Lucide.ShoppingCart className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-extrabold text-[#1c2e24] font-display">Your Smart Cart</h3>
                    {cart && (
                      <p className="text-[10px] text-[#52B788] font-bold tracking-wide uppercase">
                        Ordering from {cart.restaurantName}
                      </p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  <Lucide.X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                {!cart || cart.items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-[#D8F3DC]/40 rounded-[24px] flex items-center justify-center text-[#52B788]">
                      <Lucide.ShoppingBag className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#1c2e24]">Your Cart is Empty</h4>
                      <p className="text-xs text-[#5e7166] mt-1 max-w-[240px] mx-auto">
                        Explore Jaipur's premium dining options and add gourmet items to start your luxurious feast!
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setActiveTab('restaurants');
                      }}
                      className="px-5 py-2.5 bg-[#52B788] hover:bg-[#40916C] text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      Browse Restaurants
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Restaurant Info Header Card */}
                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-[#B7E4C7]/20 flex justify-between items-center text-left">
                      <div>
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#2D6A4F] bg-[#D8F3DC]/70 px-2 py-0.5 rounded border border-[#B7E4C7]/30">
                          Active order
                        </span>
                        <h4 className="text-sm font-extrabold text-[#1c2e24] mt-1 font-display">
                          {cart.restaurantName}
                        </h4>
                        <p className="text-[10px] text-[#5e7166] flex items-center gap-1 mt-0.5 font-semibold">
                          <Lucide.Clock className="w-3.5 h-3.5 text-[#52B788]" />
                          <span>Delivering in {cart.deliveryTime}</span>
                        </p>
                      </div>

                      <button
                        onClick={handleClearCart}
                        className="py-1.5 px-3 bg-red-50 hover:bg-red-100/80 border border-red-200 text-red-600 text-[10px] font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Clear Cart
                      </button>
                    </div>

                    {/* Items List */}
                    <div className="space-y-3.5 text-left">
                      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                        Ordered Items ({totalCartQuantity})
                      </h5>

                      <div className="space-y-3">
                        {cart.items.map((item, idx) => (
                          <motion.div
                            key={idx}
                            layout
                            className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4 hover:border-[#52B788]/25 transition-all"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 mb-1">
                                {item.isVeg ? (
                                  <span className="w-2 h-2 rounded-full bg-green-500 ring-4 ring-green-100" />
                                ) : (
                                  <span className="w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-100" />
                                )}
                                <span className="text-[10px] text-gray-400 font-bold">{item.calories}</span>
                              </div>
                              <h6 className="text-xs font-extrabold text-[#1c2e24] truncate leading-tight">
                                {item.name}
                              </h6>
                              <p className="text-[11px] font-semibold text-[#5e7166] mt-0.5">
                                ₹{item.price} <span className="text-gray-300 mx-1">|</span> <span className="font-extrabold text-[#1b4332]">₹{item.price * item.quantity}</span>
                              </p>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-2 bg-[#D8F3DC]/60 border border-[#B7E4C7]/30 p-1 rounded-xl shrink-0">
                              <button
                                onClick={() => handleDecreaseQuantity(item.name)}
                                className="w-6 h-6 bg-white hover:bg-gray-100 rounded-lg flex items-center justify-center text-[#1b4332] font-black text-xs transition-colors cursor-pointer shadow-sm active:scale-90"
                              >
                                -
                              </button>
                              <span className="text-xs font-black text-[#1b4332] w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleIncreaseQuantity(item.name)}
                                className="w-6 h-6 bg-white hover:bg-gray-100 rounded-lg flex items-center justify-center text-[#1b4332] font-black text-xs transition-colors cursor-pointer shadow-sm active:scale-90"
                              >
                                +
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Coupons Section */}
                    <div className="bg-white border border-[#B7E4C7]/20 rounded-2xl p-4 space-y-3.5 text-left">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Lucide.TicketPercent className="w-4 h-4 text-[#52B788]" />
                          <h5 className="text-xs font-extrabold text-[#1c2e24] font-display">Coupons & Offers</h5>
                        </div>
                        {appliedCoupon && (
                          <span className="text-[9px] bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                            1 Applied
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Try WELCOME50, SAVE100, FREEMEAL"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            setCouponFeedback(null);
                          }}
                          className="flex-1 bg-gray-50/50 hover:bg-gray-50 border border-gray-100 focus:border-[#52B788] rounded-xl px-3.5 py-2 text-xs font-semibold uppercase placeholder-gray-400 focus:outline-none focus:ring-0"
                        />
                        <button
                          onClick={() => handleApplyCoupon(couponCode)}
                          className="px-4 py-2 bg-[#D8F3DC] hover:bg-[#B7E4C7] text-[#1b4332] text-xs font-black rounded-xl transition-all active:scale-95 cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>

                      {/* Feedback messages */}
                      {couponFeedback && (
                        <div className={`text-[10px] font-bold ${couponFeedback.type === 'success' ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {couponFeedback.type === 'success' ? '✓ ' : '✗ '} {couponFeedback.message}
                        </div>
                      )}

                      {/* Active Coupons List */}
                      <div className="pt-2 border-t border-gray-100 flex flex-col gap-1.5">
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-wider">Available Coupons</p>
                        {COUPONS.map((cp) => {
                          const isEligible = !cp.minOrder || cartSubtotal >= cp.minOrder;
                          return (
                            <div
                              key={cp.code}
                              onClick={() => {
                                if (isEligible) {
                                  setCouponCode(cp.code);
                                  handleApplyCoupon(cp.code);
                                }
                              }}
                              className={`p-2 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                                appliedCoupon?.code === cp.code
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                  : isEligible
                                    ? 'bg-[#FFFDF8] border-gray-100 hover:border-[#52B788]/30'
                                    : 'bg-gray-50/50 border-gray-100 opacity-60 cursor-not-allowed'
                              }`}
                            >
                              <div>
                                <span className="text-[10px] font-black px-1.5 py-0.5 bg-white border rounded mr-1.5 uppercase">
                                  {cp.code}
                                </span>
                                <span className="text-[10px] font-semibold text-gray-500">{cp.description}</span>
                              </div>
                              {!isEligible && (
                                <span className="text-[9px] text-rose-400 font-bold">Needs ₹{cp.minOrder}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="bg-[#F8F5F2]/50 border border-[#B7E4C7]/10 rounded-2xl p-4.5 space-y-3 text-left">
                      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Bill Summary</h5>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-gray-500 font-semibold">
                          <span>Subtotal</span>
                          <span className="font-extrabold text-[#1c2e24]">₹{cartSubtotal}</span>
                        </div>

                        {appliedCoupon && (
                          <div className="flex justify-between text-emerald-600 font-extrabold bg-emerald-50/50 p-1.5 rounded-lg border border-emerald-100/50">
                            <span className="flex items-center gap-1.5">
                              <Lucide.Tag className="w-3.5 h-3.5" />
                              <span>Discount ({appliedCoupon.code})</span>
                            </span>
                            <span>-₹{couponDiscount}</span>
                          </div>
                        )}

                        <div className="flex justify-between text-gray-500 font-semibold">
                          <span>Delivery Fee {cartSubtotal > 500 && <span className="text-emerald-600 text-[10px] font-black uppercase ml-1">Free</span>}</span>
                          <span className="font-extrabold text-[#1c2e24]">
                            {cartSubtotal > 500 ? '₹0' : '₹40'}
                          </span>
                        </div>

                        <div className="flex justify-between text-gray-500 font-semibold">
                          <span>Platform Fee</span>
                          <span className="font-extrabold text-[#1c2e24]">₹10</span>
                        </div>

                        <div className="flex justify-between text-gray-500 font-semibold">
                          <span>GST (18%)</span>
                          <span className="font-extrabold text-[#1c2e24]">₹{Math.round(cartSubtotal * 0.18)}</span>
                        </div>

                        <div className="pt-2.5 border-t border-dashed border-[#B7E4C7]/20 flex justify-between text-[#1b4332] font-black text-base">
                          <span className="font-display">Grand Total</span>
                          <span className="text-lg font-black font-display">₹{
                            Math.max(0,
                              cartSubtotal +
                              (cartSubtotal > 500 ? 0 : 40) +
                              10 +
                              Math.round(cartSubtotal * 0.18) -
                              couponDiscount
                            )
                          }</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Checkout Footer */}
              {cart && cart.items.length > 0 && (
                <div className="p-6 bg-white border-t border-[#B7E4C7]/20 space-y-3 shrink-0">
                  <div className="text-left flex items-center justify-between text-[11px] text-gray-400 font-bold">
                    <span>Delivering to Home</span>
                    <span>{cart.deliveryTime} arrival</span>
                  </div>

                  <button
                    onClick={() => {
                      if (!cart) return;
                      const deliveryFee = cartSubtotal > 500 ? 0 : 40;
                      const platformFee = 10;
                      const gst = Math.round(cartSubtotal * 0.18);
                      const total = cartSubtotal + deliveryFee + platformFee + gst - couponDiscount;
                      
                      const matchedRest = HOME_RESTAURANTS.find(r => r.name === cart.restaurantName);
                      const restaurantImage = matchedRest ? matchedRest.image : 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=600';

                      const newOrder: Order = {
                        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
                        restaurantName: cart.restaurantName,
                        restaurantImage,
                        items: cart.items.map(item => ({
                          name: item.name,
                          price: item.price,
                          quantity: item.quantity,
                          isVeg: item.isVeg
                        })),
                        subtotal: cartSubtotal,
                        discount: couponDiscount,
                        deliveryFee,
                        platformFee,
                        gst,
                        total,
                        date: new Date().toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        }).replace(',', ''),
                        status: 'confirmed',
                        eta: parseInt(cart.deliveryTime) || 30,
                        rider: {
                          name: "Rahul Sharma",
                          rating: 4.9,
                          vehicleNo: "RJ-14-SG-2024",
                          phone: "+91 98765 43210",
                          avatar: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=200"
                        }
                      };

                      setOrders(prev => [newOrder, ...prev]);
                      triggerToast(`🎉 Order Placed! DineGenie concierge has submitted your order at ${cart.restaurantName}.`);
                      setCart(null);
                      setAppliedCoupon(null);
                      setCouponFeedback(null);
                      setCouponCode('');
                      setIsCartOpen(false);
                      setActiveTab('orders');
                    }}
                    className="w-full py-3.5 bg-[#52B788] hover:bg-[#40916C] text-white text-sm font-black rounded-2xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Lucide.ShoppingBag className="w-4 h-4" />
                    <span>Checkout & Place Order</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ⚠️ Single Restaurant Rule Premium Confirmation Dialog */}
      <AnimatePresence>
        {pendingItemToAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FFFDF8] border border-red-100 rounded-[32px] max-w-md w-full shadow-premium-lg overflow-hidden p-6 text-center space-y-6"
            >
              <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto border border-amber-100">
                <Lucide.AlertTriangle className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black text-[#1c2e24] font-display">Replace Cart Items?</h3>
                <p className="text-xs text-[#5e7166] leading-relaxed">
                  Your cart already contains items from <span className="font-extrabold text-[#1b4332]">{cart?.restaurantName}</span>.<br />
                  Would you like to clear your cart and start a new order from <span className="font-extrabold text-[#1b4332]">{pendingItemToAdd.restaurant.name}</span>?
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPendingItemToAdd(null)}
                  className="flex-1 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-extrabold rounded-xl transition-all cursor-pointer active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClearAndContinue}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  Clear Cart & Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
}
