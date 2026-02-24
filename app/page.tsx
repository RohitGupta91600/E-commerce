/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  X,
  Star,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

// --- CURATED DATA ENGINE ---
const CATEGORIES = [
  "All",
  "Living Room",
  "Bedroom",
  "Office",
  "Dining",
  "Decor",
];

const PHOTO_IDS = {
  "Living Room": [
    "1555041469-a586c61ea9bc",
    "1493663284031-b7e3aefcae8e",
    "1586023492125-27b2c045efd7",
    "1567016432779-094069958ea5",
    "1616486338812-3dadae4b4ace",
    "1631679706909-1844bbd07221",
    "1600210492493-0964c98a9a9c",
    "1600607687939-ce8a6c25118c",
  ],
  Bedroom: [
    "1505691938895-1758d7feb511",
    "1540518614846-7eded433c457",
    "1522771739844-6a9f6d5f14af",
    "1588046130717-0eb0c9a3ba15",
    "1616594039964-ae9021a400a0",
    "1631049307264-da0ec9d70304",
    "1560185007-c5ca9d2c014d",
    "1484101403633-562f891dc89a",
  ],
  Office: [
    "1524758631624-e2822e304c36",
    "1518455027359-f3f81040a9bb",
    "1493934558415-9d19f0b2944b",
    "1591370874773-6702e8f12fd8",
    "1593642632559-0c6d3fc62b89",
    "1537498425277-c283d32ef9db",
    "1519710164239-da123dc03ef4",
    "1583515177789-3b9f3e483a18",
  ],
  Dining: [
    "1577145946459-1ff440f5de71",
    "1617806118233-f8e1801426a1",
    "1530099486328-2ca21fe76ea8",
    "1449247709967-d4461a6a6103",
    "1595526051218-08e4b7e08a31",
    "1600489788083-8b610e42a050",
    "1571397659-7aab9f82dbb1",
    "1555696958-5a29a6dc3fc8",
  ],
  Decor: [
    "1581783898377-1c85bf937427",
    "1578500484720-6d9b49b4938d",
    "1519710164239-da123dc03ef4",
    "1556909114-f6e7ad7d3136",
    "1594909122845-11baa439b7bf",
    "1607344645866-009c320b8eba",
    "1585399000684-d2f72d519091",
    "1567538096630-e950f09e62f2",
  ],
};

const generate300Products = () => {
  const products = [];
  const brands = [
    "Elysian",
    "Nordic",
    "Auric",
    "Lunar",
    "Minimal",
    "Craft",
    "Urban",
    "Modo",
  ];

  const meta: { [key: string]: { types: string[] } } = {
    "Living Room": { types: ["Sofa", "Armchair", "Coffee Table"] },
    Bedroom: { types: ["Bed", "Nightstand", "Dresser"] },
    Office: { types: ["Desk", "Task Chair", "Bookshelf"] },
    Dining: { types: ["Dining Table", "Chair Set", "Sideboard"] },
    Decor: { types: ["Vase", "Mirror", "Sculpture"] },
  };

  for (let i = 1; i <= 300; i++) {
    const cat =
      CATEGORIES[Math.floor(Math.random() * (CATEGORIES.length - 1)) + 1];
    const brand = brands[i % brands.length];
    const type = meta[cat].types[i % meta[cat].types.length];
    const pool = PHOTO_IDS[cat as keyof typeof PHOTO_IDS];
    const photoId = pool[i % pool.length];

    products.push({
      id: i,
      category: cat,
      name: `${brand} ${type} No.${i}`,
      price: Math.floor(Math.random() * 1500) + 200,
      rating: (Math.random() * (5 - 4.5) + 4.5).toFixed(1),
      isNew: i % 5 === 0,
      isSummer: i % 8 === 0,
      image: `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=800&q=80`,
    });
  }
  return products;
};

const ALL_PRODUCTS = generate300Products();

export default function VeraStore() {
  const [cart, setCart] = useState<{ product: any; qty: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return ALL_PRODUCTS.filter((p) => {
      const matchCat =
        activeCategory === "All" || p.category === activeCategory;
      const matchSearch = p.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      let matchView = true;
      if (viewMode === "New") matchView = p.isNew;
      if (viewMode === "Summer") matchView = p.isSummer;
      return matchCat && matchSearch && matchView;
    });
  }, [activeCategory, viewMode, searchQuery]);

  const addToCart = (p: any) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === p.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + 1 };
        return updated;
      }
      return [...prev, { product: p, qty: 1 }];
    });
  };

  const updateQty = (idx: number, delta: number) => {
    setCart((prev) => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        qty: Math.max(1, updated[idx].qty + delta),
      };
      return updated;
    });
  };

  const totalItems = cart.reduce((a, b) => a + b.qty, 0);
  const subtotal = cart.reduce((a, b) => a + b.product.price * b.qty, 0);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#121212] font-sans selection:bg-black selection:text-white">
      {/* TOP BAR */}
      <div className="bg-[#121212] text-white py-3 text-[9px] text-center font-bold tracking-[0.3em] uppercase">
        Sustainability at our core — Free worldwide shipping on orders over $800
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-stone-100">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-10 md:gap-16">
            <h1
              onClick={() => {
                setViewMode("All");
                setActiveCategory("All");
                setSearchQuery("");
              }}
              className="text-2xl md:text-3xl font-serif font-black tracking-tighter cursor-pointer select-none"
            >
              VERA
            </h1>
            <div className="hidden lg:flex gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
              {["New", "Summer", "All"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={
                    viewMode === mode
                      ? "text-black border-b-2 border-black pb-1"
                      : "hover:text-black transition-colors"
                  }
                >
                  {mode === "New"
                    ? "New Arrivals"
                    : mode === "Summer"
                      ? "Collections"
                      : "Shop All"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search the collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-6 py-2.5 bg-stone-100/60 rounded-full text-sm w-56 focus:w-80 focus:bg-white border border-transparent focus:border-stone-200 transition-all outline-none"
              />
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2"
            >
              <ShoppingBag size={24} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold ring-2 ring-white">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-6 md:px-10 py-12 md:py-16">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-5">
              <span>Home</span>
              <ChevronRight size={11} />
              <span className="text-black">Catalogue</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-serif tracking-tight leading-[0.88]">
              {viewMode === "All" ? "Essential" : viewMode} <br />
              <span className="text-stone-300 italic">Pieces</span>
            </h2>
          </div>
          <p className="text-stone-400 text-[11px] font-bold tracking-widest uppercase border-b border-stone-200 pb-2 mt-6 md:mt-0">
            Showing {filtered.length} Objects
          </p>
        </div>

        {/* FILTER BAR */}
        <div className="flex gap-3 overflow-x-auto pb-8 mb-14 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-8 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-black text-white shadow-xl scale-105"
                  : "bg-white text-stone-400 border border-stone-100 hover:border-stone-400 hover:text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
          <AnimatePresence mode="popLayout">
            {filtered.slice(0, 48).map((p) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                key={p.id}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] bg-stone-100 rounded-[2.5rem] overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-shadow duration-500">
                  <img
                    src={p.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={p.name}
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to picsum if unsplash fails
                      (e.target as HTMLImageElement).src =
                        `https://picsum.photos/seed/${p.id}/800/1000`;
                    }}
                  />
                  {p.isNew && (
                    <div className="absolute top-6 left-6">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg">
                        New
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => addToCart(p)}
                    className="absolute bottom-6 left-6 right-6 bg-black text-white py-4 rounded-[1.75rem] font-bold text-[11px] uppercase tracking-[0.2em] translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 shadow-2xl active:scale-95"
                  >
                    Add to Bag — ${p.price}
                  </button>
                </div>
                <div className="px-2">
                  <div className="flex justify-between items-start mb-1.5">
                    <h3 className="font-bold text-base tracking-tight group-hover:text-stone-500 transition-colors leading-snug pr-2">
                      {p.name}
                    </h3>
                    <p className="font-bold text-base flex-shrink-0">
                      ${p.price}
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">
                    <span>{p.category}</span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-stone-700">{p.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-32 text-stone-300">
            <p className="font-serif italic text-3xl">No pieces found.</p>
          </div>
        )}
      </main>

      {/* CART SIDEBAR */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[210] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b flex justify-between items-center">
                <h2 className="text-2xl font-serif font-bold italic">
                  Your Bag ({totalItems})
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-10 h-10 hover:bg-stone-100 rounded-full flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-10">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-stone-300 gap-5">
                    <ShoppingBag size={80} strokeWidth={0.8} />
                    <p className="font-serif italic text-xl">
                      The bag is empty.
                    </p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="flex gap-6">
                      <img
                        src={item.product.image}
                        className="w-24 h-32 object-cover rounded-2xl bg-stone-100 flex-shrink-0"
                        alt={item.product.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            `https://picsum.photos/seed/${item.product.id}/200/250`;
                        }}
                      />
                      <div className="flex-grow flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-sm tracking-tight leading-snug">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() =>
                                setCart(cart.filter((_, i) => i !== idx))
                              }
                            >
                              <Trash2
                                size={16}
                                className="text-stone-300 hover:text-red-500 transition-colors flex-shrink-0"
                              />
                            </button>
                          </div>
                          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">
                            {item.product.category}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold">
                            ${item.product.price * item.qty}
                          </span>
                          <div className="flex items-center gap-4 bg-stone-50 px-4 py-2 rounded-full border border-stone-100">
                            <button onClick={() => updateQty(idx, -1)}>
                              <Minus size={13} />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">
                              {item.qty}
                            </span>
                            <button onClick={() => updateQty(idx, 1)}>
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-stone-50 border-t border-stone-100">
                  <div className="flex justify-between items-end mb-3">
                    <p className="text-stone-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                      Subtotal
                    </p>
                    <p className="text-3xl font-serif font-bold">
                      ${subtotal.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-emerald-600 tracking-widest uppercase mb-8">
                    <span>Shipping</span>
                    <span>Complimentary</span>
                  </div>
                  <button
                    onClick={() => {
                      alert("Processing securely...");
                      setCart([]);
                      setIsCartOpen(false);
                    }}
                    className="w-full bg-black text-white py-5 rounded-[2rem] font-bold text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-stone-800 transition-colors"
                  >
                    Checkout Now <ArrowRight size={18} />
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
