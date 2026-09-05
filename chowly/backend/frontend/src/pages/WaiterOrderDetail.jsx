import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, restaurant]);

  const hasFood = order?.orderItems?.some((i) => i.menuItem.categoryId === 1 || i.menuItem.category?.categoryName === "Food");
  const hasDrinks = order?.orderItems?.some((i) => i.menuItem.categoryId === 2 || i.menuItem.category?.categoryName === "Drinks");

  async function handleAssign() {
    setSaving(true);
    setError("");
    try {
      const updated = await api.assignOrder(order.id, {
        waiterId: waiterId ? Number(waiterId) : undefined,
        chefId: chefId ? Number(chefId) : undefined,
        bartenderId: bartenderId ? Number(bartenderId) : undefined,
      });
      setOrder(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleServe() {
    setSaving(true);
    setError("");
    try {
      const updated = await api.serveOrder(order.id);
      setOrder(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!restaurant) return null;
  if (loading) return <Loader label="Opening order..." />;
  if (!order) return <ErrorNote message={error || "Order not found."} />;

  const total = order.orderItems.reduce((sum, i) => sum + i.subTotal, 0);

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

        <div className="mt-6 divide-y divide-clay rounded-chowly border border-clay bg-white/50">
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
          <div className="mt-6 rounded-chowly border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-700">Customer flagged a delay</p>
            {order.feedbacks.map((f) => (
              <p key={f.id} className="mt-1 text-sm text-red-700/80">
                "{f.complaintText}" — rated {f.rating}/5
              </p>
            ))}
          </div>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-ink/80">
              <ChefIllustration className="h-8 w-8" /> Waiter on this order
            </label>
            <select
              value={waiterId}
              onChange={(e) => setWaiterId(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-clay bg-white/70 px-4 py-3 outline-none focus:border-terracotta"
            >
              <option value="">Select a waiter</option>
              {staff.waiters.map((w) => (
                <option key={w.id} value={w.id}>{w.fullName}</option>
              ))}
            </select>
          </div>

          {hasFood !== false && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-ink/80">
                <ChefIllustration className="h-8 w-8" /> Chef who prepared it
              </label>
              <select
                value={chefId}
                onChange={(e) => setChefId(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-clay bg-white/70 px-4 py-3 outline-none focus:border-terracotta"
              >
                <option value="">Select a chef</option>
                {staff.chefs.map((c) => (
                  <option key={c.id} value={c.id}>{c.fullName}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-ink/80">
              <BartenderIllustration className="h-8 w-8" /> Bartender who prepared it
            </label>
            <select
              value={bartenderId}
              onChange={(e) => setBartenderId(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-clay bg-white/70 px-4 py-3 outline-none focus:border-terracotta"
            >
              <option value="">Select a bartender</option>
              {staff.bartenders.map((b) => (
                <option key={b.id} value={b.id}>{b.fullName}</option>
              ))}
            </select>
          </div>
        </div>

        <ErrorNote message={error} />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" onClick={handleAssign} disabled={saving} className="flex-1">
            {saving ? "Saving..." : "Save assignment"}
          </Button>
          <Button
            onClick={handleServe}
            disabled={saving || order.status === "SERVED"}
            className="flex-1"
          >
            {order.status === "SERVED" ? "Already served" : "Mark as served"}
          </Button>
        </div>
      </main>
    </div>
  );
}
