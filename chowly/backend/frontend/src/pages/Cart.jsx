import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import Button from "../components/Button.jsx";
import { ErrorNote } from "../components/Misc.jsx";
import { useSession } from "../context/SessionContext.jsx";
import { api } from "../api.js";

function formatNaira(amount) {
  return `₦${amount.toLocaleString()}`;
}

export default function Cart() {
  const navigate = useNavigate();
  const { session, cart, updateQuantity, clearCart } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = cart.reduce((sum, i) => sum + i.quantity * i.price, 0);

  async function handlePlaceOrder() {
    setError("");
    setLoading(true);
    try {
      const order = await api.placeOrder(
        session.visitId,
        cart.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity }))
      );
      clearCart();
      navigate(`/customer/order/${order.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!session) {
    navigate("/customer/start");
    return null;
  }

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen bg-cream">
      <NavBar cartCount={cartCount} variant="customer" />
      <main className="mx-auto max-w-2xl px-6 pb-24">
        <h1 className="text-3xl text-ink md:text-4xl">Your order so far</h1>

        {cart.length === 0 ? (
          <div className="mt-10 rounded-chowly border border-clay bg-white/50 p-8 text-center">
            <p className="text-ink/70">Your cart is empty.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/customer/menu")}>
              Back to the menu
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-8 divide-y divide-clay rounded-chowly border border-clay bg-white/50">
              {cart.map((item) => (
                <div key={item.menuItemId} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="font-display text-lg text-ink">{item.itemName}</p>
                    <p className="text-sm text-ink/60">{formatNaira(item.price)} each</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-full border border-terracotta">
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                        className="px-3 py-1 text-terracotta"
                      >
                        –
                      </button>
                      <span className="px-2 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                        className="px-3 py-1 text-terracotta"
                      >
                        +
                      </button>
                    </div>
                    <span className="w-20 text-right font-semibold text-ink">
                      {formatNaira(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between text-lg">
              <span className="text-ink/70">Total</span>
              <span className="font-display text-2xl text-terracotta">{formatNaira(total)}</span>
            </div>

            <ErrorNote message={error} />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="ghost" onClick={() => navigate("/customer/menu")}>
                Add more items
              </Button>
              <Button onClick={handlePlaceOrder} disabled={loading} className="flex-1">
                {loading ? "Sending to the kitchen..." : "Place order"}
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
