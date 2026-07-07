/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RestaurantsProps {
  onOpenLunaWithPrompt: (prompt: string) => void;
  triggerToast: (message: string) => void;
  cart: {
    restaurantId: string;
    restaurantName: string;
    deliveryTime: string;
    items: {
      name: string;
      price: number;
      quantity: number;
      isVeg: boolean;
      calories: string;
    }[];
  } | null;
  onAddToCart: (
    restaurant: { id: string; name: string; deliveryTime: string },
    item: { name: string; price: number; isVeg: boolean; calories: string }
  ) => void;
  onDecreaseQuantity: (itemName: string) => void;
  onOpenCartDrawer: () => void;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  priceLevel: '₹' | '₹₹' | '₹ taste' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  image: string;
  isOpen: boolean;
  isFavorite: boolean;
  address: string;
  popularDish: string;
  menuItems: {
    name: string;
    price: number;
    description: string;
    calories: string;
    isVeg: boolean;
  }[];
}

export default function Restaurants({
  onOpenLunaWithPrompt,
  triggerToast,
  cart,
  onAddToCart,
  onDecreaseQuantity,
  onOpenCartDrawer
}: RestaurantsProps) {
  // 12 Jaipur Restaurants Master Data
  const [restaurantsList, setRestaurantsList] = useState<Restaurant[]>([
    {
      id: 'rest-1',
      name: 'Tapri Central',
      cuisine: 'Cafe',
      rating: 4.7,
      deliveryTime: '25 mins',
      priceLevel: '₹₹',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600',
      isOpen: true,
      isFavorite: false,
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
      isFavorite: false,
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
      isFavorite: false,
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
      isFavorite: false,
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
      isFavorite: false,
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
      isFavorite: false,
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
      isFavorite: false,
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
      isFavorite: false,
      address: 'Vaishali Nagar, Jaipur',
      popularDish: 'Avocado Toast & Cold Brew',
      menuItems: [
        { name: 'Smashed Avocado Toast', price: 280, description: 'Fresh Mexican Haas avocado on toasted artisanal sourdough with microgreens.', calories: '310 kcal', isVeg: true },
        { name: 'Quinoa Beetroot Super Salad', price: 240, description: 'Organic white quinoa, sweet roasted beetroot, roasted walnuts, and orange dressing.', calories: '190 kcal', isVeg: true },
        { name: 'Nitro Cold Brew Coffee', price: 160, description: 'Slow steeped nitrogen-infused dark roast coffee with a creamy head.', calories: '5 kcal', isVeg: true },
        { name: 'Protein Peanut Butter Shake', price: 220, description: 'Blended banana, raw dark cocoa, vegan protein isolate, and creamy peanut butter.', calories: '340 kcal', isVeg: true }
      ]
    },
    {
      id: 'rest-9',
      name: 'Jaipur Adda',
      cuisine: 'Healthy',
      rating: 4.3,
      deliveryTime: '22 mins',
      priceLevel: '₹₹',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
      isOpen: false, // Closed to showcase open/closed badge properly
      isFavorite: false,
      address: 'Bani Park, Jaipur',
      popularDish: 'Multigrain Sliders & Mint Coolers',
      menuItems: [
        { name: 'Mini Multigrain Slider Combo', price: 210, description: 'Two light sliders stuffed with charcoal grilled potato and beetroot patties.', calories: '290 kcal', isVeg: true },
        { name: 'Jaipuri Pudina Cooler', price: 110, description: 'Squeezed fresh green lemon, wild garden mint, black salt, and sparkling soda.', calories: '60 kcal', isVeg: true },
        { name: 'Oven-Baked Potato Wedges', price: 130, description: 'Crispy skin-on potato wedges baked with dry rosemary and hand-ground pink salt.', calories: '180 kcal', isVeg: true },
        { name: 'Zesty Veg Caesar Salad', price: 190, description: 'Crisp iceberg greens tossed in light greek yogurt dressing with baked croutons.', calories: '150 kcal', isVeg: true }
      ]
    },
    {
      id: 'rest-10',
      name: 'Thali & More',
      cuisine: 'Indian',
      rating: 4.6,
      deliveryTime: '25 mins',
      priceLevel: '₹₹',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600',
      isOpen: true,
      isFavorite: false,
      address: 'C-Scheme, Jaipur',
      popularDish: 'Unlimited Executive Veg Thali',
      menuItems: [
        { name: 'Executive Veg Thali', price: 310, description: 'Premium lunch containing 2 seasonal subjis, Dal Fry, Jeera Rice, 3 Butter Rotis, and sweet Rasgulla.', calories: '790 kcal', isVeg: true },
        { name: 'Rajasthani Gatte ki Sabji', price: 180, description: 'Steamed gram-flour dumplings simmered in sharp sour yogurt and turmeric sauce.', calories: '260 kcal', isVeg: true },
        { name: 'Jeera Peas Pulao', price: 140, description: 'Basmati rice steam-fried with roasted cumin and fresh sweet garden peas.', calories: '210 kcal', isVeg: true },
        { name: 'Bengali Sponge Rasgulla (2 Pcs)', price: 70, description: 'Spongy cottage cheese rounds squeezed and soaked in light cardamom sugar syrup.', calories: '160 kcal', isVeg: true }
      ]
    },
    {
      id: 'rest-11',
      name: 'The Forresta',
      cuisine: 'Chinese',
      rating: 4.7,
      deliveryTime: '32 mins',
      priceLevel: '₹₹₹',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
      isOpen: true,
      isFavorite: false,
      address: 'Devi Marg, Jaipur',
      popularDish: 'Chili Garlic Noodles & Dimsums',
      menuItems: [
        { name: 'Chili Garlic Handpulled Noodles', price: 260, description: 'Thick street-style handpulled noodles tossed with dark soy and spicy burned garlic.', calories: '410 kcal', isVeg: true },
        { name: 'Steamed Crystal Dumplings (6 Pcs)', price: 220, description: 'Translucent flour wraps stuffed with water chestnut, wild mushrooms, and coriander.', calories: '140 kcal', isVeg: true },
        { name: 'Crispy Szechuan Paneer', price: 280, description: 'Wok-fired crispy paneer batons tossed in spicy, tangy homemade Szechuan peppercorn oil.', calories: '320 kcal', isVeg: true },
        { name: 'Chilled Lychee Coconut Pudding', price: 190, description: 'Creamy coconut cream set with natural lychee juice and sweet pulp shards.', calories: '180 kcal', isVeg: true }
      ]
    },
    {
      id: 'rest-12',
      name: 'Barbeque Nation',
      cuisine: 'Chinese', // has Chinese/Indian skewered combo options
      rating: 4.8,
      deliveryTime: '40 mins',
      priceLevel: '₹₹₹',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600',
      isOpen: true,
      isFavorite: false,
      address: 'Tonk Road, Jaipur',
      popularDish: 'Unlimited Barbeque Grill Feast',
      menuItems: [
        { name: 'Barbeque Grill Feast Ticket', price: 799, description: 'All-you-can-eat table buffet including Cajun Potato, BBQ Paneer, Crispy Corn, and desserts.', calories: '1400 kcal', isVeg: true },
        { name: 'Sizzling Garlic Pepper Skewers', price: 290, description: 'Wok-fried skewers loaded with bell peppers, pineapple cubes, and button mushrooms.', calories: '230 kcal', isVeg: true },
        { name: 'Crispy Corn Salt & Pepper', price: 180, description: 'Crunchy battered sweet corn tossed with freshly ground white pepper and scallions.', calories: '310 kcal', isVeg: true },
        { name: 'Classic Moong Dal Halwa', price: 150, description: 'Traditional split yellow gram pudding cooked in premium desi ghee for hours.', calories: '490 kcal', isVeg: true }
      ]
    }
  ]);

  // Search, Filters & Sorting States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Jaipur, Rajasthan');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'delivery' | 'priceAsc' | 'priceDesc' | 'none'>('none');
  const [activeFilters, setActiveFilters] = useState<{
    openOnly: boolean;
    highRating: boolean;
    vegOnly: boolean;
  }>({
    openOnly: false,
    highRating: false,
    vegOnly: false,
  });

  // Modal / Detail menu viewing state
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // Listen for escape key press to close modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedRestaurant(null);
      }
    };
    if (selectedRestaurant) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedRestaurant]);

  // Prevent background scroll when modal is open
  React.useEffect(() => {
    if (selectedRestaurant) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedRestaurant]);

  // Category chip configs
  const categoryChips = [
    { label: 'All', icon: '✨' },
    { label: 'Pizza', icon: '🍕' },
    { label: 'Indian', icon: '🍛' },
    { label: 'Chinese', icon: '🥢' },
    { label: 'Healthy', icon: '🥗' },
    { label: 'Cafe', icon: '☕' },
    { label: 'Desserts', icon: '🍰' }
  ];

  // Favorite toggle function
  const toggleFavorite = (id: string, name: string) => {
    setRestaurantsList(prev =>
      prev.map(rest => {
        if (rest.id === id) {
          const newFavState = !rest.isFavorite;
          triggerToast(
            newFavState
              ? `Added "${name}" to your favorites list!`
              : `Removed "${name}" from your favorites.`
          );
          return { ...rest, isFavorite: newFavState };
        }
        return rest;
      })
    );
  };



  // Location selector change handler
  const handleLocationChange = (loc: string) => {
    setSelectedLocation(loc);
    triggerToast(`Switched delivery context to: ${loc}`);
  };

  // Sort change handler
  const handleSortChange = (type: 'rating' | 'delivery' | 'priceAsc' | 'priceDesc' | 'none') => {
    setSortBy(type);
    let sortName = 'Relevance';
    if (type === 'rating') sortName = 'Highest Rated';
    if (type === 'delivery') sortName = 'Fastest Delivery';
    if (type === 'priceAsc') sortName = 'Price: Low to High';
    if (type === 'priceDesc') sortName = 'Price: High to Low';
    triggerToast(`Sorted restaurants by ${sortName}`);
  };

  // Toggle filter logic
  const toggleFilter = (filterKey: keyof typeof activeFilters) => {
    setActiveFilters(prev => {
      const updated = { ...prev, [filterKey]: !prev[filterKey] };
      triggerToast(`Filter updated: ${filterKey === 'openOnly' ? 'Open Now' : filterKey === 'highRating' ? '4.5+ Stars' : 'Veg Only'}`);
      return updated;
    });
  };

  // Compute filtered list
  const filteredRestaurants = restaurantsList
    .filter(rest => {
      // 1. Search term
      const matchesSearch =
        rest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rest.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rest.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rest.popularDish.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      // 2. Category Chip filter
      if (selectedCategory !== 'All' && rest.cuisine !== selectedCategory) {
        return false;
      }

      // 3. Open now filter
      if (activeFilters.openOnly && !rest.isOpen) return false;

      // 4. High Rating (4.5+) filter
      if (activeFilters.highRating && rest.rating < 4.5) return false;

      // 5. Veg only filter (Check if restaurant contains any veg menuItems)
      if (activeFilters.vegOnly && !rest.menuItems.some(item => item.isVeg)) return false;

      return true;
    })
    .sort((a, b) => {
      // Sort logic
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'delivery') {
        const timeA = parseInt(a.deliveryTime);
        const timeB = parseInt(b.deliveryTime);
        return timeA - timeB;
      }
      if (sortBy === 'priceAsc') {
        return a.priceLevel.length - b.priceLevel.length;
      }
      if (sortBy === 'priceDesc') {
        return b.priceLevel.length - a.priceLevel.length;
      }
      return 0; // Relevance / default
    });

  // Calculate total price of current item selection
  const totalCartPrice = (cart && selectedRestaurant && cart.restaurantId === selectedRestaurant.id)
    ? cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    : 0;

  return (
    <div className="space-y-12 animate-in fade-in duration-500 z-10 relative">
      
      {/* 1. Header Section */}
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D8F3DC] text-[#2D6A4F] text-[10px] font-extrabold rounded-full border border-[#B7E4C7]/40 select-none mb-3">
            <span>🛵</span>
            <span>Real-time Curation</span>
          </div>
          <h2 className="text-3xl font-black text-[#1c2e24] font-display flex items-center gap-2.5 tracking-tight">
            <span>🏰</span>
            <span>Jaipur Culinary Hub</span>
          </h2>
          <p className="text-xs md:text-sm text-[#5e7166] mt-1 max-w-2xl leading-relaxed">
            Discover and order from 12 premium dining destinations inside Jaipur, Rajasthan. Filter by cuisine or consult Luna for custom diet guidelines.
          </p>
        </div>

        {/* Location Selector */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-[#B7E4C7]/30 px-4 py-2.5 rounded-2xl shadow-sm hover:border-[#52B788]/50 transition-colors w-full sm:w-auto">
          <Lucide.MapPin className="w-4 h-4 text-[#52B788] shrink-0" />
          <div className="flex-1 text-left">
            <div className="text-[9px] text-[#5e7166] font-bold uppercase tracking-wider leading-none">Delivering To</div>
            <select
              value={selectedLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="bg-transparent border-none text-xs font-black text-[#1c2e24] focus:outline-none focus:ring-0 cursor-pointer pr-4 py-0 mt-0.5"
            >
              <option value="Jaipur, Rajasthan">Jaipur, Rajasthan</option>
              <option value="Beverly Hills, Los Angeles">Beverly Hills, LA</option>
              <option value="Manhattan, New York">Manhattan, NY</option>
              <option value="Soho, London">Soho, London</option>
              <option value="Marina Bay, Singapore">Marina Bay, SG</option>
            </select>
          </div>
        </div>
      </section>

      {/* 2. Top Controls Section (Search, Sort, Filters) */}
      <section className="bg-white/70 backdrop-blur-md border border-[#B7E4C7]/20 rounded-[28px] p-5 md:p-6 space-y-4 shadow-sm text-left">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          
          {/* Search Bar */}
          <div className="flex-1 relative flex items-center">
            <Lucide.Search className="w-4 h-4 text-gray-400 absolute left-4.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Jaipur cafes, Lal Maas, street food, woodfired pizzas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#B7E4C7]/25 rounded-2xl pl-12 pr-4.5 py-3 text-xs font-semibold text-[#1c2e24] focus:outline-none focus:border-[#52B788] placeholder-gray-400 shadow-inner"
            />
          </div>

          {/* Sort Selector Dropdown */}
          <div className="flex items-center gap-2 shrink-0 bg-white border border-[#B7E4C7]/25 px-4 py-2.5 rounded-2xl shadow-sm">
            <Lucide.ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-500 font-bold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as any)}
              className="bg-transparent border-none text-xs font-black text-[#1c2e24] focus:outline-none focus:ring-0 cursor-pointer py-0"
            >
              <option value="none">Relevance</option>
              <option value="rating">Highest Rated (★)</option>
              <option value="delivery">Fastest Delivery (⏱)</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>

          {/* Quick Toggle Filters Group */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => toggleFilter('openOnly')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                activeFilters.openOnly
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-black'
                  : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeFilters.openOnly ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              <span>Open Now Only</span>
            </button>

            <button
              type="button"
              onClick={() => toggleFilter('highRating')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                activeFilters.highRating
                  ? 'bg-amber-50 text-amber-800 border-amber-300 font-black'
                  : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
              }`}
            >
              <Lucide.Star className={`w-3.5 h-3.5 ${activeFilters.highRating ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}`} />
              <span>Top Rated (4.5+)</span>
            </button>

            <button
              type="button"
              onClick={() => toggleFilter('vegOnly')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                activeFilters.vegOnly
                  ? 'bg-green-50 text-green-800 border-green-300 font-black'
                  : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
              }`}
            >
              <span className="text-[10px]">🟢</span>
              <span>Pure Veg Options</span>
            </button>
          </div>
        </div>

        {/* 3. Category Filter Chips */}
        <div className="pt-2 border-t border-[#B7E4C7]/15">
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none mask-image-right">
            {categoryChips.map((chip) => {
              const isChipActive = selectedCategory === chip.label;
              return (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(chip.label);
                    triggerToast(`Switched filter category: ${chip.label}`);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-extrabold transition-all shrink-0 cursor-pointer active:scale-95 ${
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
        </div>
      </section>

      {/* 4. Active Restaurants Count Display */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-[#5e7166] uppercase tracking-wider flex items-center gap-1.5">
          <Lucide.Layers className="w-4 h-4 text-[#52B788]" />
          Showing {filteredRestaurants.length} Restaurants in Jaipur
        </span>
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setActiveFilters({ openOnly: false, highRating: false, vegOnly: false });
            }}
            className="text-[11px] font-bold text-[#52B788] hover:underline"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* 5. Restaurants Grid (Render immediately, no placeholders) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredRestaurants.map((rest) => (
            <motion.div
              layout
              key={rest.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-[28px] border border-[#B7E4C7]/20 shadow-sm hover:shadow-premium transition-all duration-300 overflow-hidden flex flex-col justify-between relative group"
            >
              
              {/* Restaurant Image Wrapper */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                  src={rest.image}
                  alt={rest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Favorite Icon Overlay */}
                <button
                  type="button"
                  onClick={() => toggleFavorite(rest.id, rest.name)}
                  className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md border border-white/20 hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                >
                  <Lucide.Heart
                    className={`w-4.5 h-4.5 transition-colors ${
                      rest.isFavorite ? 'text-rose-500 fill-rose-500 animate-wiggle' : 'text-gray-400 hover:text-rose-500'
                    }`}
                  />
                </button>

                {/* Open/Closed Badge */}
                <div className="absolute top-4 left-4 flex gap-1">
                  {rest.isOpen ? (
                    <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-400/20 shadow-sm select-none">
                      🟢 Open Now
                    </span>
                  ) : (
                    <span className="bg-rose-500/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-rose-400/20 shadow-sm select-none">
                      🔴 Closed
                    </span>
                  )}
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-xl px-2.5 py-1 border border-[#B7E4C7]/25 flex items-center gap-1 select-none shadow-sm">
                  <span className="text-amber-500 font-bold text-[11px]">★</span>
                  <span className="text-xs font-black text-[#1c2e24]">{rest.rating}</span>
                </div>

                {/* Distance/Delivery Time Badge */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md rounded-xl px-2.5 py-1 border border-[#B7E4C7]/25 flex items-center gap-1.5 select-none shadow-sm">
                  <Lucide.Clock className="w-3.5 h-3.5 text-[#52B788]" />
                  <span className="text-[10px] font-extrabold text-[#1c2e24]">{rest.deliveryTime}</span>
                </div>
              </div>

              {/* Restaurant Meta Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#5e7166] font-black uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                      {rest.cuisine}
                    </span>
                    <span className="text-xs font-black text-gray-400 tracking-wider">
                      {rest.priceLevel}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#1c2e24] font-display tracking-tight text-left">
                    {rest.name}
                  </h3>
                  
                  <p className="text-[11px] text-gray-400 text-left font-semibold">
                    📍 {rest.address}
                  </p>

                  <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-[#2D6A4F] bg-[#D8F3DC]/40 px-3 py-1.5 rounded-xl border border-[#B7E4C7]/20">
                    <Lucide.Sparkles className="w-3.5 h-3.5 text-[#52B788] animate-pulse shrink-0" />
                    <span className="text-gray-500 font-semibold truncate">Popular:</span>
                    <span className="font-extrabold text-[#1c2e24] truncate">{rest.popularDish}</span>
                  </div>
                </div>

                {/* Bottom Trigger View Menu button */}
                <div className="pt-3.5 border-t border-[#B7E4C7]/15 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRestaurant(rest);
                      triggerToast(`Loading ${rest.name}'s luxury menu...`);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-[#1b4332] to-[#2D6A4F] hover:from-[#2D6A4F] hover:to-[#1b4332] text-white text-xs font-extrabold rounded-xl shadow-sm transition-all text-center cursor-pointer active:scale-95 flex items-center justify-center gap-1"
                  >
                    <span>View Menu Details</span>
                    <Lucide.ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </AnimatePresence>

        {filteredRestaurants.length === 0 && (
          <div className="col-span-full py-16 text-center space-y-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto">
              <Lucide.Inbox className="w-8 h-8" />
            </div>
            <h4 className="text-base font-black text-[#1c2e24]">No Jaipur Restaurants Match Filters</h4>
            <p className="text-xs text-[#5e7166] max-w-sm mx-auto">
              Try modifying your search text, sorting criteria, or uncheck the pure veg / open now filters.
            </p>
          </div>
        )}
      </section>

      {/* 6. Detail Menu Modal (Popup) */}
      <AnimatePresence>
        {selectedRestaurant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedRestaurant(null);
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
                  src={selectedRestaurant.image}
                  alt={selectedRestaurant.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => setSelectedRestaurant(null)}
                  className="absolute top-4 right-4 w-9 h-9 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center text-[#5e7166] hover:text-[#1c2e24] shadow-md transition-colors cursor-pointer z-10"
                >
                  <Lucide.X className="w-5 h-5" />
                </button>

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-6">
                  <div className="text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#D8F3DC] bg-emerald-800/40 px-2.5 py-1 rounded-md border border-white/10 select-none">
                      📍 {selectedRestaurant.address}
                    </span>
                    <h3 className="text-2xl font-black text-white font-display mt-2">{selectedRestaurant.name}</h3>
                    <p className="text-xs text-[#D8F3DC] mt-0.5 font-medium">{selectedRestaurant.cuisine} • Rating ★{selectedRestaurant.rating} • Price {selectedRestaurant.priceLevel}</p>
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
                  {selectedRestaurant.menuItems.map((item, idx) => {
                    const quantity = (cart && cart.restaurantId === selectedRestaurant.id)
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
                                onClick={() => onDecreaseQuantity(item.name)}
                                className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-[#1b4332] font-black text-xs hover:bg-[#B7E4C7] transition-colors cursor-pointer"
                              >
                                -
                              </button>
                              <span className="text-xs font-black text-[#1b4332]">{quantity}</span>
                              <button
                                type="button"
                                onClick={() => onAddToCart(
                                  { id: selectedRestaurant.id, name: selectedRestaurant.name, deliveryTime: selectedRestaurant.deliveryTime },
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
                              onClick={() => onAddToCart(
                                { id: selectedRestaurant.id, name: selectedRestaurant.name, deliveryTime: selectedRestaurant.deliveryTime },
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
                    ₹{totalCartPrice}
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      const cartStr = cart ? cart.items.map(item => `[${item.quantity}x] ${item.name}`).join(', ') : '';
                      onOpenLunaWithPrompt(`Please write a luxury food evaluation and diet recommendation for ordering these dishes at "${selectedRestaurant.name}": ${cartStr}.`);
                      triggerToast("Opened Luna diet consult!");
                    }}
                    className="px-4 py-3 bg-[#D8F3DC] text-[#2D6A4F] text-xs font-extrabold rounded-xl border border-[#B7E4C7]/50 transition-all cursor-pointer hover:bg-[#B7E4C7]/60 active:scale-95 flex items-center gap-1.5"
                  >
                    <Lucide.Bot className="w-4 h-4" />
                    <span>Consult with Luna</span>
                  </button>

                  <button
                    type="button"
                    disabled={totalCartPrice === 0}
                    onClick={() => {
                      onOpenCartDrawer();
                      setSelectedRestaurant(null);
                    }}
                    className="px-6 py-3 bg-[#52B788] hover:bg-[#40916C] disabled:bg-gray-200 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-[#52B788]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 flex-1 sm:flex-none"
                  >
                    <Lucide.ShoppingCart className="w-4 h-4" />
                    <span>View Cart & Checkout</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
