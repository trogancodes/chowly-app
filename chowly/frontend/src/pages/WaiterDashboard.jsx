import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CHEFS = [
  { id: 'tunde', name: 'Chef Tunde', initial: 'T' },
  { id: 'amaka', name: 'Chef Amaka', initial: 'A' },
  { id: 'bola', name: 'Chef Bola', initial: 'B' },
];

export default function WaiterDashboard({ activeOrder }) {
  const navigate = useNavigate();
  const [order, setOrder] = useState(activeOrder || {
    id: "28",
    table: "Table 7",
    item: "Egusi Soup & Pounded Yam",
    total: 5500,
    status: "pending_acceptance", 
  });
  const [selectedChef, setSelectedChef] = useState(null);

  // Watch for the 'assigned' status and auto-redirect
  useEffect(() => {
    if (order.status === 'assigned') {
      const timer = setTimeout(() => {
        // Change '/waiter/orders' to your actual waiter orders route
        navigate('/waiter/orders'); 
      }, 1500); // 1.5 second delay to read the success message
      return () => clearTimeout(timer);
    }
  }, [order.status, navigate]);

  return (
    <div className="min-h-screen bg-appBg p-4 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-lg bg-surface rounded-4xl shadow-framer p-6 relative border border-white/60">
        
        {/* ... (Header and Order Items remain exactly the same) ... */}

        {order.status === 'pending_acceptance' && (
          <button 
            onClick={() => setOrder({ ...order, status: 'accepted' })}
            className="w-full py-4 bg-brand text-white font-bold rounded-2xl shadow-glow hover:bg-[#9d1245] transition-all"
          >
            👤 Accept Order
          </button>
        )}

        {order.status === 'accepted' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {CHEFS.map((chef) => (
                <button
                  key={chef.id}
                  onClick={() => setSelectedChef(chef.id)}
                  className={`p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 font-bold ${
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
                  ? 'bg-brand text-white shadow-glow hover:bg-[#9d1245]' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Confirm Assignment
            </button>
          </div>
        )}

        {order.status === 'assigned' && (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl font-bold text-center text-sm animate-pulse">
            ✓ Assigned to Chef & Sent to Kitchen
          </div>
        )}
      </div>
    </div>
  );
}