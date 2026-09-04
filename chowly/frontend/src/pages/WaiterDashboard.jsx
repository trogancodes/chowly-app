import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header.jsx";
import { Loader, ErrorNote, StatusBadge } from "../components/Misc.jsx";
import { WaiterIllustration } from "../illustrations/index.jsx";
import { api } from "../api.js";

export default function WaiterDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchOrders() {
    try {
      const data = await api.getWaiterOrders(["PENDING", "PREPARING", "DELAYED", "SERVED"]);
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 6000);
    return () => clearInterval(interval);
  }, []);

  const active = orders.filter((o) => o.status !== "SERVED");
  const served = orders.filter((o) => o.status === "SERVED");

  return (
    <div className="min-h-screen bg-cream">
      <Header roleLabel="Waiter view" onSwitchRole={() => navigate("/")} />
      <main className="mx-auto max-w-3xl px-6 pb-24">
        <div className="flex items-center gap-4">
          <WaiterIllustration className="h-16 w-16 shrink-0" />
          <div>
            <h1 className="text-3xl text-ink md:text-4xl">The floor, right now</h1>
            <p className="text-ink/70">Open an order to record who's preparing it.</p>
          </div>
        </div>

        {loading && <Loader label="Checking the queue..." />}
        <ErrorNote message={error} />

        {!loading && active.length === 0 && (
          <p className="mt-10 text-ink/60">No active orders right now. Nice and quiet.</p>
        )}

        <div className="mt-8 space-y-3">
          {active.map((order) => (
            <motion.button
              key={order.id}
              whileHover={{ y: -2 }}
              onClick={() => navigate(`/waiter/order/${order.id}`)}
              className="flex w-full items-center justify-between rounded-chowly border border-clay bg-white/50 px-5 py-4 text-left"
            >
              <div>
                <p className="font-display text-lg text-ink">
                  Table {order.visit.tableNumber} · Order #{order.id}
                </p>
                <p className="text-sm text-ink/60">
                  {order.visit.customer.fullName} · {order.orderItems.length} item
                  {order.orderItems.length > 1 ? "s" : ""}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </motion.button>
          ))}
        </div>

        {served.length > 0 && (
          <>
            <h2 className="mt-12 text-xl text-ink/70">Served tonight</h2>
            <div className="mt-4 space-y-3 opacity-70">
              {served.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-chowly border border-clay/60 bg-white/30 px-5 py-4"
                >
                  <p className="text-sm text-ink">
                    Table {order.visit.tableNumber} · Order #{order.id} · {order.visit.customer.fullName}
                  </p>
                  <StatusBadge status={order.status} />
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
