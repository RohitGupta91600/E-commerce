"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShoppingBag, Heart, X, Star, Trash2, Plus, Minus, ArrowRight, 
  ChevronRight, SlidersHorizontal, Globe, ShieldCheck
} from 'lucide-react';

// --- CURATED DATA ENGINE ---
const CATEGORIES = ["All", "Living Room", "Bedroom", "Office", "Dining", "Decor"];

const generate300Products = () => {
  const products = [];
  const brands = ["Elysian", "Nordic", "Auric", "Lunar", "Minimal", "Craft", "Urban", "Modo"];
  
  // Real keywords that match the Category for accurate images
  const meta: { [key: string]: { types: string[], keywords: string[] } } = {
    "Living Room": { types: ["Sofa", "Armchair", "Coffee Table"], keywords: ["sofa", "furniture", "living-room"] },
    "Bedroom": { types: ["Bed", "Nightstand", "Dresser"], keywords: ["bed", "bedroom", "aesthetic-room"] },
    "Office": { types: ["Desk", "Task Chair", "Bookshelf"], keywords: ["desk", "office", "workspace"] },
    "Dining": { types: ["Dining Table", "Chair Set", "Sideboard"], keywords: ["dining-table", "kitchen", "modern-interior"] },
    "Decor": { types: ["Vase", "Mirror", "Sculpture"], keywords: ["interior-decor", "minimal-art", "vase"] }
  };

  for (let i = 1; i <= 300; i++) {
    const cat = CATEGORIES[Math.floor(Math.random() * (CATEGORIES.length - 1)) + 1];
    const brand = brands[i % brands.length];
    const type = meta[cat].types[i % meta[cat].types.length];
    const keyword = meta[cat].keywords[i % meta[cat].keywords.length];
    
    products.push({
      id: i,
      category: cat,
      name: `${brand} ${type} #${i}`,
      price: Math.floor(Math.random() * 1500) + 200,
      rating: (Math.random() * (5 - 4.5) + 4.5).toFixed(1),
      isNew: i % 5 === 0,
      isSummer: i % 8 === 0,
      // Source: Using Unsplash Source for better reliability + varied images
      image: `https://images.unsplash.com/photo-${getReliableId(i, cat)}?auto=format&fit=crop&w=800&q=80`
    });
  }
  return products;
};

// These IDs are manually picked to ensure they NEVER fail and look high-end
function getReliableId(i: number, cat: string) {
  const ids: { [key: string]: string[] } = {
    "Living Room": ["1555041469-a586c61ea9bc", "1493663284031-b7e3aefcae8e", "1586023492125-27b2c045efd7"],
    "Bedroom": ["1505691938895-1758d7feb511", "1540518614846-7eded433c457", "1522771739844-6a9f6d5f14af"],
    "Office": ["1524758631624-e2822e304c36", "1518455027359-f3f81040a9bb", "1493934558415-9d19f0b2944b"],
    "Dining": ["1577145946459-1ff440f5de71", "1617806118233-f8e1801426a1", "1530099486328-2ca21fe76ea8"],
    "Decor": ["1581783898377-1c85bf937427", "1578500484720-6d9b49b4938d", "1519710164239-da123dc03ef4"]
  };
  const pool = ids[cat];
  return pool[i % pool.length];
}

const ALL_PRODUCTS = generate300Products();

export default function VeraStore() {
  const [cart, setCart] = useState<{product: any, qty: number}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return ALL_PRODUCTS.filter(p => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      let matchView = true;
      if (viewMode === "New") matchView = p.isNew;
      if (viewMode === "Summer") matchView = p.isSummer;
      return matchCat && matchSearch && matchView;
    });
  }, [activeCategory, viewMode, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#121212] font-sans selection:bg-black selection:text-white">
      
      {/* --- TOP BAR --- */}
      <div className="bg-[#121212] text-white py-3 text-[9px] text-center font-bold tracking-[0.3em] uppercase">
        Sustainability at our core: Read our 2026 Impact Report
      </div>

      {/* --- WORLD CLASS NAVBAR --- */}
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-stone-100">
        <div className="max-w-[1600px] mx-auto px-10 h-24 flex items-center justify-between">
          <div className="flex items-center gap-16">
            <h1 onClick={() => {setViewMode("All"); setActiveCategory("All");}} 
                className="text-3xl font-serif font-black tracking-tighter cursor-pointer">VERA</h1>
            
            <div className="hidden lg:flex gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
              <button onClick={() => setViewMode("New")} className={viewMode === "New" ? "text-black border-b-2 border-black pb-1" : "hover:text-black"}>New Arrivals</button>
              <button onClick={() => setViewMode("Summer")} className={viewMode === "Summer" ? "text-black border-b-2 border-black pb-1" : "hover:text-black"}>Collections</button>
              <button onClick={() => setViewMode("All")} className={viewMode === "All" ? "text-black border-b-2 border-black pb-1" : "hover:text-black"}>Shop All</button>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input 
                type="text" placeholder="Search the collection..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 bg-stone-100/50 rounded-full text-sm w-64 focus:w-96 focus:bg-white border border-transparent focus:border-stone-200 transition-all outline-none" 
              />
            </div>
            <button onClick={() => setIsCartOpen(true)} className="relative group p-2">
              <ShoppingBag size={26} strokeWidth={1.2} />
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold ring-4 ring-white">
                  {cart.reduce((a, b) => a + b.qty, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-10 py-16">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
          <div>
            <div className="flex items-center gap-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-6">
              <span>Home</span> <ChevronRight size={12} /> <span className="text-black">Catalogue</span>
            </div>
            <h2 className="text-8xl font-serif tracking-tight leading-[0.85] text-stone-900">
              {viewMode === "All" ? "Essential" : viewMode} <br/>
              <span className="text-stone-300 italic">Pieces</span>
            </h2>
          </div>
          <p className="text-stone-400 text-sm font-bold tracking-widest uppercase border-b border-stone-200 pb-2">
            Showing {filtered.length} Objects
          </p>
        </div>

        {/* --- FILTER BAR --- */}
        <div className="flex gap-4 overflow-x-auto pb-10 mb-16 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button 
              key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-10 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
                activeCategory === cat ? 'bg-black text-white shadow-2xl scale-105' : 'bg-white text-stone-400 border border-stone-100 hover:border-black hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- PREMIUM GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-20">
          <AnimatePresence mode="popLayout">
            {filtered.slice(0, 48).map((p) => (
              <motion.div 
                layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                key={p.id} className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] bg-stone-100 rounded-[3rem] overflow-hidden mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                  <img 
                    src={p.image} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    alt={p.name}
                  />
                  <div className="absolute top-8 left-8">
                    {p.isNew && <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-xl">New</span>}
                  </div>
                  <button 
                    onClick={() => setCart(prev => [...prev, {product: p, qty: 1}])}
                    className="absolute bottom-8 left-8 right-8 bg-black text-white py-5 rounded-[2rem] font-bold text-[11px] uppercase tracking-[0.2em] translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-2xl active:scale-95"
                  >
                    Add to Bag — ${p.price}
                  </button>
                </div>
                <div className="px-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl tracking-tighter group-hover:text-stone-500 transition-colors">{p.name}</h3>
                    <p className="font-bold text-lg">${p.price}</p>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-bold text-stone-400 uppercase tracking-[0.2em]">
                    <span>{p.category}</span>
                    <div className="flex items-center gap-1.5 text-black">
                      <Star size={14} fill="currentColor" /> {p.rating}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* --- LUXURY CART SIDEBAR --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-md z-[200]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[210] shadow-2xl flex flex-col"
            >
              <div className="p-10 border-b flex justify-between items-center">
                <h2 className="text-3xl font-serif font-bold italic text-stone-900">Your Bag</h2>
                <button onClick={() => setIsCartOpen(false)} className="w-12 h-12 hover:bg-stone-50 rounded-full flex items-center justify-center transition-all"><X /></button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-10 space-y-12">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-stone-300 gap-6">
                    <ShoppingBag size={100} strokeWidth={0.5} />
                    <p className="font-serif italic text-2xl">The bag is empty.</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="flex gap-8 group">
                      <img src={item.product.image} className="w-28 h-36 object-cover rounded-[2rem] bg-stone-100 shadow-lg" />
                      <div className="flex-grow flex flex-col justify-between py-2">
                        <div>
                          <div className="flex justify-between font-bold text-lg tracking-tight">
                            <h4>{item.product.name}</h4>
                            <button onClick={() => setCart(cart.filter((_, i) => i !== idx))}><Trash2 size={18} className="text-stone-300 hover:text-red-500 transition-colors" /></button>
                          </div>
                          <p className="text-[11px] text-stone-400 font-bold uppercase tracking-widest mt-2">{item.product.category}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">${item.product.price}</span>
                          <div className="flex items-center gap-5 bg-stone-50 px-5 py-2.5 rounded-full border border-stone-100">
                            <Minus size={14} className="cursor-pointer" />
                            <span className="text-xs font-bold">{item.qty}</span>
                            <Plus size={14} className="cursor-pointer" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-10 bg-stone-50 border-t border-stone-100">
                  <div className="space-y-4 mb-10">
                    <div className="flex justify-between items-end">
                      <p className="text-stone-400 text-[11px] font-bold uppercase tracking-[0.2em]">Subtotal</p>
                      <p className="text-4xl font-serif font-bold text-stone-900">${cart.reduce((a, b) => a + b.product.price, 0)}</p>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-emerald-600 tracking-widest uppercase">
                      <span>Shipping</span>
                      <span>Complimentary</span>
                    </div>
                  </div>
                  <button onClick={() => {alert("Processing securely..."); setCart([]); setIsCartOpen(false);}} className="w-full bg-black text-white py-6 rounded-[2.5rem] font-bold text-[12px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-[#333] transition-all shadow-2xl">
                    Checkout Now <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}