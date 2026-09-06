import React, { useState } from 'react';

const STAGES = [
  { id: 1, label: 'Placed' },
  { id: 2, label: 'Accepted' },
  { id: 3, label: 'Preparing' },
  { id: 4, label: 'Served' },
  { id: 5, label: 'Payment' },
  { id: 6, label: 'Completed' },
];

export default function OrderStatus({ orders = [], notifications = [], onClearNotifications }) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="min-h-screen bg-appBg p-4 md:p-6 max-w-xl mx-auto pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6 bg-surface p-4 rounded-3xl shadow-framer">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand/10 flex items-center justify-center text-brand font-bold text-xl">
            🍴
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Chowly</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications Button */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 bg-appBg hover:bg-brand/10 rounded-2xl transition-all relative"
            >
              <span className="text-xl">🔔</span>
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-glow">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown (Photo 16 Logic) */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-surface rounded-3xl shadow-framer-modal p-5 z-50 border border-brand/10 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900">Notifications</h3>
                  <button 
                    onClick={onClearNotifications}
                    className="text-xs font-semibold text-brand hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {notifications.map((n, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-appBg/50 flex gap-3 items-start border border-brand/5">
                      <span className="text-brand mt-0.5">🔔</span>
                      <div>
                        <p className="text-xs font-medium text-gray-800 leading-snug">{n.message}</p>
                        <span className="text-[10px] text-gray-400 mt-1 block">Order #{n.orderId}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-10 h-10 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-bold">
            👤
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-5">
        {orders.map((order) => {
          const currentStage = order.stageIndex || 1; // 1 to 6
          return (
            <div key={order.id} className="bg-surface rounded-3xl p-6 shadow-framer border border-white/60">
              <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-lg font-black text-gray-900">#{order.id}</span>
                  <span className="ml-3 text-xs font-semibold text-brand bg-brand/10 px-3 py-1 rounded-full">
                    ⏱️ {order.statusText || 'Order Placed'}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-400">{order.timeAgo}</span>
              </div>

              {/* 6-Step Stepper Timeline (Photos 13 & 15) */}
              <div className="my-6 px-2">
                <div className="flex items-center justify-between relative">
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-100 -z-0" />
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand transition-all duration-500 -z-0" 
                    style={{ width: `${((currentStage - 1) / (STAGES.length - 1)) * 100}%` }}
                  />

                  {STAGES.map((s) => {
                    const isPassed = s.id <= currentStage;
                    return (
                      <div key={s.id} className="flex flex-col items-center relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isPassed ? 'bg-brand text-white shadow-glow' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {isPassed ? '✓' : s.id}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-3 px-1">
                  {STAGES.map((s) => (
                    <span key={s.id} className={s.id <= currentStage ? 'text-brand font-semibold' : ''}>
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Items & Chef Information */}
              <div className="py-3 border-t border-gray-100 space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="font-semibold text-gray-800">
                      <span className="text-brand mr-2">{item.qty}x</span>
                      {item.name}
                    </span>
                    <span className="font-medium text-gray-500">₦{item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {order.chefName && (
                <div className="mt-3 text-xs font-medium text-gray-600 bg-appBg/60 p-2.5 rounded-xl flex items-center gap-2">
                  <span>👨‍🍳</span> Assigned Chef: <strong className="text-gray-900">{order.chefName}</strong>
                </div>
              )}

              {/* Total & Confirmation Banner */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Order Total</span>
                <span className="text-lg font-black text-brand">₦{order.total.toLocaleString()}</span>
              </div>

              {order.paymentStatus === 'pending_waiter' && (
                <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-2xl text-xs font-medium flex items-center gap-2">
                  <span className="animate-pulse">🟠</span> Waiting for waiter payment confirmation
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}