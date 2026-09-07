import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NavBar from "../components/NavBar.jsx";
import { Loader, ErrorNote, StatusBadge } from "../components/Misc.jsx";
import { WaiterIllustration } from "../illustrations/index.jsx";
import { useSession } from "../context/SessionContext.jsx";
import { api } from "../api.js";

function formatNaira(amount) {
  return `₦${amount.toLocaleString()}`;
}

// Orders are sorted so the ones needing action float to the top: a brand new order
// (PENDING) or one flagged DELAYED needs a waiter right now; a SERVED-and-paid order
// is the next most urgent (the customer is sitting there waiting to be let go).
const URGENCY = { PENDING: 0, DELAYED: 1, ACCEPTED: 2, PREPARING: 3, SERVED: 4 };

export default function WaiterDashboard() {
  const navigate = useNavigate();
  const { restaurant } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchOrders() {
    if (!restaurant) return;
    try {
      const data = await api.getWaiterOrders(
        ["PENDING", "ACCEPTED", "PREPARING", "DELAYED", "SERVED", "COMPLETED"],
        restaurant.id
      );
      setOrders(data);
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
    fetchOrders();
    const interval = setInterval(fetchOrders, 6000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant]);

  if (!restaurant) return null;

  const active = orders
    .filter((o) => o.status !== "COMPLETED")
    .sort((a, b) => {
      const paidDiff = (b.status === "SERVED" && !!b.payment ? 1 : 0) - (a.status === "SERVED" && !!a.payment ? 1 : 0);
      if (paidDiff !== 0) return paidDiff;
      return (URGENCY[a.status] ?? 9) - (URGENCY[b.status] ?? 9);
    });
  const completed = orders.filter((o) => o.status === "COMPLETED");

  return (
    <div className="min-h-screen bg-cream">
      <NavBar variant="waiter" />
      <main className="mx-auto max-w-4xl px-6 pb-24">
        <div className="flex items-center gap-4">
          <WaiterIllustration className="h-16 w-16 shrink-0" />
          <div>
            <h1 className="text-3xl text-ink md:text-4xl">The floor, right now</h1>
            <p className="text-ink/70">{restaurant.name} · click an order to open it.</p>
          </div>
        </div>

        {loading && <Loader label="Checking the queue..." />}
        <ErrorNote message={error} />

        {!loading && active.length === 0 && (
          <p className="mt-10 text-ink/60">No active orders right now. Nice and quiet.</p>
        )}

        {active.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-chowly border border-clay bg-cream-dark/50">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-clay bg-cream-dark/60 text-xs uppercase tracking-wide text-ink/50">
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Table</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Payment</th>
                </tr>
              </thead>
              <tbody>
                {active.map((order) => {
                  const readyToClose = order.status === "SERVED" && !!order.payment;
                  return (
                    <motion.tr
                      key={order.id}
                      whileHover={{ backgroundColor: "rgba(193,80,46,0.05)" }}
                      onClick={() => navigate(`/waiter/order/${order.id}`)}
                      className={`cursor-pointer border-b border-clay/60 last:border-0 ${
                        readyToClose ? "bg-sage/10" : order.status === "DELAYED" ? "bg-red-500/10" : ""
                      }`}
                    >
                      <td className="px-5 py-4 font-semibold text-ink">#{order.id}</td>
                      <td className="px-5 py-4 text-ink/80">Table {order.visit.tableNumber}</td>
                      <td className="px-5 py-4 text-ink/80">{order.visit.customer.fullName}</td>
                      <td className="px-5 py-4 text-ink/60">
                        {order.orderItems.length} item{order.orderItems.length > 1 ? "s" : ""} ·{" "}
                        {formatNaira(order.orderItems.reduce((sum, i) => sum + i.subTotal, 0))}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4">
                        {order.payment ? (
                          <span className="rounded-full bg-sage/20 px-3 py-1 text-xs font-semibold text-sage">
                            💰 Paid
                          </span>
                        ) : order.status === "SERVED" ? (
                          <span className="rounded-full bg-clay/50 px-3 py-1 text-xs text-ink/60">Awaiting</span>
                        ) : (
                          <span className="text-ink/30">—</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {completed.length > 0 && (
          <>
            <h2 className="mt-12 text-xl text-ink/70">Completed tonight</h2>
            <div className="mt-4 overflow-hidden rounded-chowly border border-clay/60 bg-cream-dark/30">
              <table className="w-full text-left text-sm opacity-70">
                <tbody>
                  {completed.map((order) => (
                    <tr key={order.id} className="border-b border-clay/40 last:border-0">
                      <td className="px-5 py-3 font-medium text-ink">#{order.id}</td>
                      <td className="px-5 py-3 text-ink/70">Table {order.visit.tableNumber}</td>
                      <td className="px-5 py-3 text-ink/70">{order.visit.customer.fullName}</td>
                      <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
