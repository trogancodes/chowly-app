import React, { useState } from 'react';

const CHEFS = [
  { id: 'tunde', name: 'Chef Tunde', initial: 'T' },
  { id: 'amaka', name: 'Chef Amaka', initial: 'A' },
  { id: 'bola', name: 'Chef Bola', initial: 'B' },
];

export default function WaiterDashboard({ activeOrder }) {
  const [order, setOrder] = useState(activeOrder || {
    id: "28",
    table: "Table 7",
    item: "Egusi Soup & Pounded Yam",
    total: 5500,
    status: "pending_acceptance", // 'pending_acceptance' | 'accepted' | 'assigned'
  });

  const [selectedChef, setSelectedChef] = useState(null);

  return (
    <div className="min-h-screen bg-appBg p-4 md:p-6 flex items-center justify-center">
      {/* Order Acceptance & Chef Assignment Bottom Modal (Photos 5 & 6 Logic) */}
      <div className="w-full max-w-lg bg-surface rounded-4xl shadow-framer-modal p-6 relative border border-white/60">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-gray-900">#{order.id}</span>
            <span className="bg-appBg text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
              {order.table}
            </span>
          </div>
          <button className="text-gray-400 hover:text-gray-600 text-lg font-bold">✕</button>
        </div>

        {/* Order Items */}
        <div className="bg-appBg/40 p-4 rounded-2xl mb-6 space-y-3">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            🍴 Order Items
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-bold text-gray-800">
              <span className="text-brand mr-2">1x</span>{order.item}
            </span>
            <span className="font-semibold text-gray-600">₦{order.total.toLocaleString()}</span>
          </div>
          <div className="pt-2 border-t border-gray-200/50 flex justify-between font-black text-base">
            <span>Total</span>
            <span className="text-brand">₦{order.total.toLocaleString()}</span>
          </div>
        </div>

        {/* State 1: Accept Order (Photo 6) */}
        {order.status === 'pending_acceptance' && (
          <button 
            onClick={() => setOrder({ ...order, status: 'accepted' })}
            className="w-full py-4 bg-brand text-white font-bold rounded-2xl shadow-glow hover:bg-brand-dark transition-all flex items-center justify-center gap-2"
          >
            <span>👤</span> Accept Order
          </button>
        )}

        {/* State 2: Assign Chef (Photo 5) */}
        {order.status === 'accepted' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              👨‍🍳 Assign Chef
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              {CHEFS.map((chef) => (
                <button
                  key={chef.id}
                  onClick={() => setSelectedChef(chef.id)}
                  className={`p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 text-left font-bold ${
                    selectedChef === chef.id 
                      ? 'border-brand bg-brand/10 text-brand' 
                      : 'border-gray-200 bg-surface text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-appBg flex items-center justify-center text-brand font-black text-xs">
                    {chef.initial}
                  </div>
                  <span className="text-sm">{chef.name}</span>
                </button>
              ))}
            </div>

            <button 
              disabled={!selectedChef}
              onClick={() => setOrder({ ...order, status: 'assigned' })}
              className={`w-full py-4 rounded-2xl font-bold transition-all mt-4 ${
                selectedChef 
                  ? 'bg-brand text-white shadow-glow hover:bg-brand-dark' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Confirm Assignment
            </button>
          </div>
        )}

        {order.status === 'assigned' && (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl font-bold text-center text-sm">
            ✓ Assigned to Chef & Sent to Kitchen
          </div>
        )}
      </div>
    </div>
  );
}