import React, { useState } from 'react';

export default function CartPayment({ totalAmount = 3500, orderId = "25", tableNumber = "7", onComplete }) {
  const [selectedMethod, setSelectedMethod] = useState('cash');
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  const handlePaymentSubmit = () => {
    setPaymentSubmitted(true);
  };

  if (paymentSubmitted) {
    return (
      <div className="min-h-screen bg-appBg flex items-center justify-center p-4">
        {/* Payment Confirmation Modal (Photo 9 Logic) */}
        <div className="bg-surface w-full max-w-md rounded-4xl p-8 shadow-framer-modal text-center border border-white/60">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-2">Payment Submitted</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Your cash payment has been submitted. Your waiter will confirm it before the order is completed.
          </p>

          <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-4 text-left mb-8 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order</span>
              <span className="font-bold text-gray-900">#{orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment method</span>
              <span className="font-bold text-gray-900 capitalize">{selectedMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Amount</span>
              <span className="font-bold text-brand">₦{totalAmount.toLocaleString()}</span>
            </div>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-amber-700">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              Waiting for waiter confirmation
            </div>
          </div>

          <button 
            onClick={onComplete}
            className="w-full py-4 bg-brand text-white font-bold rounded-2xl shadow-glow hover:bg-brand-dark transition-all"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-appBg p-4 md:p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-black text-gray-900 mb-6">Payment</h2>

      {/* Summary Card */}
      <div className="bg-surface p-5 rounded-3xl shadow-framer mb-6 space-y-2 border border-white/60">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Order</span>
          <span className="font-bold text-gray-900">#{orderId}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Table</span>
          <span className="font-bold text-gray-900">Table {tableNumber}</span>
        </div>
        <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
          <span>Total</span>
          <span className="text-brand">₦{totalAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* Payment Options (Photos 8 & 12) */}
      <div className="space-y-4 mb-8">
        <h3 className="font-bold text-gray-800 text-sm">Payment Method</h3>

        {/* Cash Option */}
        <div 
          onClick={() => setSelectedMethod('cash')}
          className={`p-5 rounded-3xl bg-surface shadow-framer cursor-pointer border-2 transition-all flex items-start gap-4 ${
            selectedMethod === 'cash' ? 'border-brand bg-brand/5' : 'border-transparent'
          }`}
        >
          <div className="p-3 bg-brand/10 text-brand rounded-2xl text-xl">💵</div>
          <div>
            <h4 className="font-bold text-gray-900">Cash</h4>
            <p className="text-xs text-gray-500 mt-0.5">Pay cash to your waiter. Your waiter will confirm receipt.</p>
          </div>
        </div>

        {/* Bank Transfer Option */}
        <div 
          onClick={() => setSelectedMethod('bank')}
          className={`p-5 rounded-3xl bg-surface shadow-framer cursor-pointer border-2 transition-all flex items-start gap-4 ${
            selectedMethod === 'bank' ? 'border-brand bg-brand/5' : 'border-transparent'
          }`}
        >
          <div className="p-3 bg-appBg text-brand rounded-2xl text-xl">🏦</div>
          <div>
            <h4 className="font-bold text-gray-900">Bank Transfer</h4>
            <p className="text-xs text-gray-500 mt-0.5">Transfer the amount and wait for your waiter to verify it.</p>
          </div>
        </div>

        {/* Demo Payment */}
        <div 
          onClick={() => setSelectedMethod('pretend')}
          className={`p-5 rounded-3xl bg-surface shadow-framer cursor-pointer border-2 transition-all flex items-start gap-4 ${
            selectedMethod === 'pretend' ? 'border-brand bg-brand/5' : 'border-transparent'
          }`}
        >
          <div className="p-3 bg-appBg text-brand rounded-2xl text-xl">💳</div>
          <div>
            <h4 className="font-bold text-gray-900">Pretend Payment</h4>
            <p className="text-xs text-gray-500 mt-0.5">Demo payment for testing. No real money is charged.</p>
          </div>
        </div>
      </div>

      <button 
        onClick={handlePaymentSubmit}
        className="w-full py-4 bg-brand hover:bg-brand-dark text-white font-bold rounded-2xl shadow-glow transition-all"
      >
        Submit Payment • ₦{totalAmount.toLocaleString()}
      </button>
    </div>
  );
}