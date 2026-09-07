import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import NavBar from "../components/NavBar.jsx";
import Button from "../components/Button.jsx";
import { Loader, ErrorNote, StatusBadge } from "../components/Misc.jsx";
import { ChefIllustration, BartenderIllustration } from "../illustrations/index.jsx";
import { useSession } from "../context/SessionContext.jsx";
import { api } from "../api.js";

function formatNaira(amount) {
  return `₦${amount.toLocaleString()}`;
}

export default function WaiterOrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { restaurant } = useSession();

  const [order, setOrder] = useState(null);
  const [staff, setStaff] = useState({ waiters: [], chefs: [], bartenders: [] });
  const [waiterId, setWaiterId] = useState("");
  const [chefId, setChefId] = useState("");
  const [bartenderId, setBartenderId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      const [orderData, staffData] = await Promise.all([api.getOrder(orderId), api.getStaff(restaurant.id)]);
      setOrder(orderData);
      setStaff(staffData);
      setWaiterId(orderData.waiterId || "");
      setChefId(orderData.chefId || "");
      setBartenderId(orderData.bartenderId || "");
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
    const interval = setInterval(load, 6000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, restaurant]);

  if (!restaurant) return null;
  if (loading) return <Loader label="Opening order..." />;
  if (!order) return <ErrorNote message={error || "Order not found."} />;

  const hasFood = order.orderItems.some((i) => i.menuItem.category?.categoryName === "Food");
  const hasDrinks = order.orderItems.some((i) => i.menuItem.category?.categoryName === "Drinks");
  const total = order.orderItems.reduce((sum, i) => sum + i.subTotal, 0);

  const isPending = order.status === "PENDING";
  const isAccepted = order.status === "ACCEPTED" || order.status === "PREPARING";
  const isServedOrLater = ["SERVED", "COMPLETED"].includes(order.status);
  const isCompleted = order.status === "COMPLETED";

  async function runAction(action) {
    setSaving(true);
    setError("");
    try {
      const updated = await action();
      setOrder(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <NavBar variant="waiter" />
      <main className="mx-auto max-w-2xl px-6 pb-24">
        <button onClick={() => navigate("/waiter")} className="text-sm text-ink/60 hover:text-terracotta">
          ← Back to the floor
        </button>

        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-3xl text-ink md:text-4xl">
            Table {order.visit.tableNumber} · Order #{order.id}
          </h1>
          <StatusBadge status={order.status} />
        </div>
        <p className="mt-1 text-ink/60">
          {order.visit.customer.fullName} · placed {new Date(order.orderTime).toLocaleTimeString()}
        </p>

        <div className="mt-6 divide-y divide-clay rounded-chowly border border-clay bg-cream-dark/50">
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-5 py-4">
              <span className="text-ink">
                {item.quantity} × {item.menuItem.itemName}
              </span>
              <span className="font-semibold text-ink">{formatNaira(item.subTotal)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-5 py-4">
            <span className="font-semibold text-ink">Total</span>
            <span className="font-display text-xl text-terracotta">{formatNaira(total)}</span>
          </div>
        </div>

        {order.feedbacks?.length > 0 && (
          <div className="mt-6 rounded-chowly border border-red-500/30 bg-red-500/10 p-5">
            <p className="font-semibold text-red-400">Customer flagged a delay</p>
            {order.feedbacks.map((f) => (
              <p key={f.id} className="mt-1 text-sm text-red-400/80">
                "{f.complaintText}" — rated {f.rating}/5
              </p>
            ))}
          </div>
        )}

        <ErrorNote message={error} />

        {/* Step 1: Accept the order */}
        {isPending && (
          <div className="mt-8 rounded-chowly border border-clay bg-cream-dark/50 p-6">
            <h2 className="font-display text-lg text-ink">Step 1 · Accept this order</h2>
            <select
              value={waiterId}
              onChange={(e) => setWaiterId(e.target.value)}
              className="mt-3 w-full rounded-2xl border border-clay bg-cream-dark/70 px-4 py-3 outline-none focus:border-terracotta"
            >
              <option value="">Select a waiter</option>
              {staff.waiters.map((w) => (
                <option key={w.id} value={w.id}>{w.fullName}</option>
              ))}
            </select>
            <Button
              className="mt-4 w-full"
              disabled={saving || !waiterId}
              onClick={() => runAction(() => api.acceptOrder(order.id, Number(waiterId)))}
            >
              {saving ? "Accepting..." : "Accept order"}
            </Button>
          </div>
        )}

        {/* Step 2: Assign chef / bartender */}
        {(isAccepted || isServedOrLater) && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {hasFood && (
              <div className="rounded-chowly border border-clay bg-cream-dark/50 p-5">
                <label className="flex items-center gap-2 text-sm font-medium text-ink/80">
                  <ChefIllustration className="h-8 w-8" /> Chef preparing the food
                </label>
                <select
                  value={chefId}
                  onChange={(e) => setChefId(e.target.value)}
                  disabled={isServedOrLater}
                  className="mt-2 w-full rounded-2xl border border-clay bg-cream-dark/70 px-4 py-3 outline-none focus:border-terracotta disabled:opacity-60"
                >
                  <option value="">Select a chef</option>
                  {staff.chefs.map((c) => (
                    <option key={c.id} value={c.id}>{c.fullName}</option>
                  ))}
                </select>
                {!isServedOrLater && (
                  <Button
                    variant="outline"
                    className="mt-3 w-full"
                    disabled={saving || !chefId || Number(chefId) === order.chefId}
                    onClick={() => runAction(() => api.assignChef(order.id, Number(chefId)))}
                  >
                    {order.chefId ? "Update chef" : "Assign chef"}
                  </Button>
                )}
              </div>
            )}

            {hasDrinks && (
              <div className="rounded-chowly border border-clay bg-cream-dark/50 p-5">
                <label className="flex items-center gap-2 text-sm font-medium text-ink/80">
                  <BartenderIllustration className="h-8 w-8" /> Bartender preparing the drinks
                </label>
                <select
                  value={bartenderId}
                  onChange={(e) => setBartenderId(e.target.value)}
                  disabled={isServedOrLater}
                  className="mt-2 w-full rounded-2xl border border-clay bg-cream-dark/70 px-4 py-3 outline-none focus:border-terracotta disabled:opacity-60"
                >
                  <option value="">Select a bartender</option>
                  {staff.bartenders.map((b) => (
                    <option key={b.id} value={b.id}>{b.fullName}</option>
                  ))}
                </select>
                {!isServedOrLater && (
                  <Button
                    variant="outline"
                    className="mt-3 w-full"
                    disabled={saving || !bartenderId || Number(bartenderId) === order.bartenderId}
                    onClick={() => runAction(() => api.assignBartender(order.id, Number(bartenderId)))}
                  >
                    {order.bartenderId ? "Update bartender" : "Assign bartender"}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Mark served */}
        {isAccepted && (
          <Button
            className="mt-8 w-full"
            disabled={saving}
            onClick={() => runAction(() => api.serveOrder(order.id))}
          >
            {saving ? "Saving..." : "Mark as served"}
          </Button>
        )}

        {/* Step 4: Payment status + complete */}
        {isServedOrLater && (
          <div className="mt-8 rounded-chowly border border-clay bg-cream-dark/50 p-6">
            {order.payment ? (
              <p className="rounded-2xl bg-sage/10 px-4 py-3 text-sm font-medium text-sage">
                💰 Paid {formatNaira(order.payment.amount)} via {order.payment.paymentMethod} — ready to close out.
              </p>
            ) : (
              <p className="rounded-2xl bg-clay/40 px-4 py-3 text-sm text-ink/70">
                ⏳ Waiting for the customer to pay on their device.
              </p>
            )}
            {!isCompleted ? (
              <Button
                className="mt-4 w-full"
                disabled={saving}
                onClick={() => runAction(() => api.completeOrder(order.id))}
              >
                {saving ? "Closing out..." : "Complete order"}
              </Button>
            ) : (
              <p className="mt-4 text-center text-sm text-ink/50">✅ This table has been closed out.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
