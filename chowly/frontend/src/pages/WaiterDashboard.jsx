import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar.jsx';
import { Loader, ErrorNote } from '../components/Misc.jsx';
import { useSession } from '../context/SessionContext.jsx';
import { api } from '../api.js';

function formatNaira(amount) {
  return `₦${amount.toLocaleString()}`;
}

export default function WaiterDashboard() {
  const navigate = useNavigate();
  const { restaurant } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acceptingId, setAcceptingId] = useState(null);

  async function load() {
    try {
      const pending = await api.getWaiterOrders(["PENDING"], restaurant.id);
      setOrders(pending);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!restaurant) {
      navigate("/");
      return;
    }
    load();
    // Poll for newly placed orders every 10s so the floor doesn't have to refresh manually.
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant]);

  async function handleAccept(orderId) {
    setAcceptingId(orderId);
    setError("");
    try {
      await api.acceptOrder(orderId, null);
      // Take the waiter straight into the order to assign a chef/bartender next.
      navigate(`/waiter/order/${orderId}`);
    } catch (err) {
      setError(err.message);
      setAcceptingId(null);
    }
  }

  if (!restaurant) return null;

  return (
    <div className="min-h-screen bg-cream">
      <NavBar variant="waiter" />
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-8">
        <h1 className="text-3xl text-ink md:text-4xl">The floor</h1>
        <p className="mt-1 text-ink/60">Orders waiting for a waiter to accept them.</p>

        <div className="mt-6">
          {loading && <Loader label="Checking for new orders..." />}
          <ErrorNote message={error} />

          {!loading && orders.length === 0 && (
            <div className="rounded-chowly border border-clay bg-white/50 p-8 text-center text-ink/50">
              No pending orders right now.
            </div>
          )}

          <div className="space-y-4">
            {orders.map((order) => {
              const total = order.orderItems.reduce((sum, i) => sum + i.subTotal, 0);
              return (
                <div key={order.id} className="rounded-chowly border border-clay bg-white/50 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-ink">
                        Table {order.visit?.tableNumber} · Order #{order.id}
                      </p>
                      <p className="text-sm text-ink/60">
                        {order.visit?.customer?.fullName} · placed {new Date(order.orderTime).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className="font-display text-lg text-terracotta">{formatNaira(total)}</span>
                  </div>

                  <ul className="mt-3 space-y-1 text-sm text-ink/80">
                    {order.orderItems.map((item) => (
                      <li key={item.id}>
                        {item.quantity} × {item.menuItem.itemName}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleAccept(order.id)}
                    disabled={acceptingId === order.id}
                    className="mt-4 w-full py-3 bg-terracotta text-cream font-bold rounded-2xl hover:bg-terracotta-dark transition-all disabled:opacity-40"
                  >
                    {acceptingId === order.id ? "Accepting..." : "👤 Accept Order"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}