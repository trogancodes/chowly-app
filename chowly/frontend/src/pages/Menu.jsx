import React from 'react';
import { motion } from 'framer-motion';

// Spring physics config for that signature Framer bounce
const spring = {
  type: "spring",
  stiffness: 300,
  damping: 24
};

// Staggered list animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: spring }
};

const MENU_ITEMS = [
  { id: 1, name: "Beef Suya Skewers", price: 3500, category: "Popular", icon: "🍢" },
  { id: 2, name: "Chilled Zobo Drink", price: 1000, category: "Drinks", icon: "🍷" },
  { id: 3, name: "Egusi & Pounded Yam", price: 5500, category: "Food", icon: "🍲" },
];

export default function Menu() {
  return (
    <div className="min-h-screen p-4 md:p-6 max-w-xl mx-auto pb-24">
      
      {/* Header with SVG Illustration & Animation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="bg-surface rounded-4xl p-8 mb-8 shadow-framer relative overflow-hidden text-center border border-white/60"
      >
        {/* Decorative Abstract SVG Illustration */}
        <svg className="absolute -top-10 -right-10 w-40 h-40 text-brand/5 rotate-12" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.8,-18,97.2,-2.4C97.6,13.2,92.5,28.9,82.4,41.4C72.3,53.9,57.1,63.1,41.6,69.5C26.1,75.9,10.3,79.5,-5.2,80.7C-20.7,81.9,-35.9,80.6,-50.2,74.1C-64.5,67.6,-77.9,55.9,-86.3,41.4C-94.7,26.9,-98.1,9.6,-95.6,-6.6C-93.1,-22.8,-84.7,-37.9,-73.4,-49.5C-62.1,-61.1,-47.9,-69.2,-33.9,-76.5C-19.9,-83.8,-6.1,-90.3,7.4,-92C20.9,-93.7,40.1,-90.6,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>

        <h1 className="text-3xl font-black text-gray-900 mb-2 relative z-10">Menu</h1>
        <p className="text-gray-500 text-sm relative z-10">Browse dishes, drinks, or categories...</p>
      </motion.div>

      {/* Animated Menu List */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {MENU_ITEMS.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-surface p-5 rounded-3xl shadow-framer hover:shadow-framer-hover transition-shadow cursor-pointer flex items-center gap-4 border border-white/50"
          >
            <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
              {item.icon}
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
              <span className="text-xs font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                {item.category}
              </span>
            </div>

            <div className="text-right">
              <p className="font-black text-brand text-lg">₦{item.price.toLocaleString()}</p>
              <button className="mt-1 w-8 h-8 bg-appBg text-brand rounded-full font-bold flex items-center justify-center hover:bg-brand hover:text-white transition-colors">
                +
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
}